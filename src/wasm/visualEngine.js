/**
 * HTML5 Canvas 2D background particle render engine.
 * Particle physics, mesh lines, and audio-reactive spectrum pulsation — no WebAssembly.
 */

import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { prefersReducedMotion } from '../utils/selection.js';

class CanvasVisualEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.particleCount = 110;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.activeAccentColor = '#00F0FF';
    this.animFrameId = null;
    this.motionQuery = null;
    this.freqData = new Uint8Array(32);
    this.audioEnergy = 0;
    this.isPaused = false;
  }

  async init(canvasElement) {
    if (!canvasElement) return;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

    this.initParticles();

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.onMotionPrefChange = () => {
        if (this.isPaused) {
          this.draw();
          return;
        }
        this.startLoop();
      };
      if (this.motionQuery.addEventListener) {
        this.motionQuery.addEventListener('change', this.onMotionPrefChange);
      } else if (this.motionQuery.addListener) {
        this.motionQuery.addListener(this.onMotionPrefChange);
      }
    }
    
    appState.setState({ canvasReady: true });
    console.log(`[Canvas VisualEngine] 2D renderer ready. Particles: ${this.particleCount}`);

    this.startLoop();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    const { viewport } = appState.getState();
    if (viewport === 'MOBILE') this.particleCount = 50;
    else if (viewport === 'TABLET') this.particleCount = 80;
    else this.particleCount = 120;

    this.initParticles();
    if (prefersReducedMotion()) this.draw();
  }

  initParticles() {
    this.particles = [];
    const w = this.canvas ? this.canvas.width : window.innerWidth;
    const h = this.canvas ? this.canvas.height : window.innerHeight;

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.35 + 0.1
      });
    }
  }

  handleMouseMove(e) {
    this.targetMouseX = e.clientX;
    this.targetMouseY = e.clientY;
  }

  setAccentColor(hexColor) {
    if (hexColor) this.activeAccentColor = hexColor;
  }

  pauseLoop() {
    this.isPaused = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  resumeLoop() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.startLoop();
  }

  startLoop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (prefersReducedMotion()) {
      this.draw();
      return;
    }
    
    const render = () => {
      if (this.isPaused) return;
      if (prefersReducedMotion()) {
        this.draw();
        this.animFrameId = null;
        return;
      }
      this.update();
      this.draw();
      this.animFrameId = requestAnimationFrame(render);
    };

    render();
  }

  update() {
    if (prefersReducedMotion()) return;

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.06;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.06;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Sample audio frequency energy if playing
    const { audio } = appState.getState();
    if (audio.isPlaying) {
      synthAudio.getByteFrequencyData(this.freqData);
      let sum = 0;
      for (let i = 0; i < 16; i++) sum += this.freqData[i];
      this.audioEnergy = (sum / 16) / 255; // 0.0 to 1.0
    } else {
      this.audioEnergy *= 0.95;
    }

    const speedBoost = 1.0 + this.audioEnergy * 1.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx * speedBoost;
      p.y += p.vy * speedBoost;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        const force = (180 - dist) / 180;
        p.alpha = p.baseAlpha + force * 0.6 + this.audioEnergy * 0.3;
        p.x -= (dx / dist) * force * 1.4;
        p.y -= (dy / dist) * force * 1.4;
      } else {
        p.alpha += (p.baseAlpha - p.alpha) * 0.05 + this.audioEnergy * 0.05;
      }
    }
  }

  draw() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Subtle audio-responsive mesh connections
    this.ctx.lineWidth = 0.6;
    const maxDist = 110 + this.audioEnergy * 40;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (0.12 + this.audioEnergy * 0.15);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    // Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const radius = p.radius + this.audioEnergy * 1.5;
      this.ctx.fillStyle = this.hexToRgba(this.activeAccentColor, Math.min(1, p.alpha));
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  hexToRgba(hex, alpha) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    if (isNaN(num)) return `rgba(0, 240, 255, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

export const canvasVisualEngine = new CanvasVisualEngine();
