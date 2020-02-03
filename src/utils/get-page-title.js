import defaultSettings from '@/settings'

const title = defaultSettings.title || '正宏项目管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
