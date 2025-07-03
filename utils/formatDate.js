export const formatDate = (isoString) => {
  if (!isoString) return '未知日期';
  const date = new Date(isoString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const getCategoryText = (category) => {
  switch (category) {
    case 'frontend': return '前端开发';
    case 'backend': return '后端开发';
    case 'database': return '数据库';
    case 'architecture': return '系统架构';
    case 'buddhism': return '佛教典籍';
    case 'taoism': return '道教典籍';
    case 'tcm': return '中医典籍';
    default: return '其他';
  }
};