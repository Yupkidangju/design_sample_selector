import { getLocaleCopy } from '../copy.js';
import catalog from './catalog/zh-CN.js';

export default {
  locale: 'zh-CN',
  catalog,
  copy: getLocaleCopy('zh-CN'),
  messages: {
    language: '语言', search: '搜索设计', all: '全部', saved: '已保存',
    sort: '排序', catalogOrder: '目录顺序', nameAscending: '名称', eraAscending: '最早', eraDescending: '最新',
    grid: '网格', bento: '便当', spectrum: '光谱', details: '查看详情', bookmark: '收藏', bookmarked: '已收藏',
    inspector: '检查器', palette: '配色方案', characteristics: '特点', pros: '优点', cons: '注意事项',
    copy: '复制', copied: '已复制', reset: '恢复默认值', desktop: '桌面端', mobile: '移动端',
    noResults: '没有匹配的设计。', category: '类别', filters: '筛选', clearFilters: '清除筛选',
    liveTuner: '实时参数调节', previewHint: '可与预览中的元素进行交互。',
    designSummary: '展示设计方案及实际应用原则的示例。',
    paletteUsage: '用于此方案主要表面与信号的颜色。', subtitle: '8大类别 · 120个实时方案 · 8种原型 · 动态沙盒',
    noSelection: '未选择', compare: '分屏对比'
  }
};
