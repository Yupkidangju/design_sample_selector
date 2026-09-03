import { getLocaleCopy } from '../copy.js';
import catalog from './catalog/ja.js';

export default {
  locale: 'ja',
  catalog,
  copy: getLocaleCopy('ja'),
  messages: {
    language: '言語', search: 'デザインを検索', all: 'すべて', saved: '保存済み',
    sort: '並べ替え', catalogOrder: 'カタログ順', nameAscending: '名前順', eraAscending: '古い順', eraDescending: '新しい順',
    grid: 'グリッド', bento: 'ベントー', spectrum: 'スペクトラム', details: '詳細を見る', bookmark: 'ブックマーク', bookmarked: '保存済み',
    inspector: 'インスペクター', palette: 'カラーパレット', characteristics: '特徴', pros: '長所', cons: '注意点',
    copy: 'コピー', copied: 'コピー済み', reset: '初期値に戻す', desktop: 'デスクトップ', mobile: 'モバイル',
    noResults: '該当するデザインがありません。', category: 'カテゴリー', filters: 'フィルター', clearFilters: 'フィルターを解除',
    liveTuner: 'ライブパラメータ調整', previewHint: 'プレビュー内の要素を操作できます。',
    designSummary: 'デザイン例と実用的な適用方針を示すサンプルです。',
    paletteUsage: 'このサンプルの主要な面とシグナルに使う色です。', subtitle: '8カテゴリー・120ライブサンプル・8アーキタイプ・動的サンドボックス',
    noSelection: '未選択', compare: 'スプリット比較'
  }
};
