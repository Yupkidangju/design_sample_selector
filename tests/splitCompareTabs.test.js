import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getNextSplitArchetype,
  getSplitArchetypeTabs
} from '../src/components/splitCompareTabs.js';

test('split comparison exposes one selected tab with roving tabindex', () => {
  const tabs = getSplitArchetypeTabs('dashboard');
  const selectedTabs = tabs.filter(tab => tab.ariaSelected === 'true');

  assert.equal(tabs.length, 8);
  assert.equal(selectedTabs.length, 1);
  assert.equal(selectedTabs[0].id, 'dashboard');
  assert.equal(selectedTabs[0].tabIndex, 0);
  tabs.filter(tab => tab.id !== 'dashboard').forEach(tab => assert.equal(tab.tabIndex, -1));
});

test('split comparison arrow, Home, and End keys follow the tabs pattern', () => {
  assert.equal(getNextSplitArchetype('game', 'ArrowLeft'), 'chat');
  assert.equal(getNextSplitArchetype('chat', 'ArrowRight'), 'game');
  assert.equal(getNextSplitArchetype('media', 'Home'), 'game');
  assert.equal(getNextSplitArchetype('mobile', 'End'), 'chat');
  assert.equal(getNextSplitArchetype('mobile', 'Enter'), null);
});
