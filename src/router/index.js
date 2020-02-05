import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/forget',
    component: () => import('@/views/forget'),
    hidden: true
  }
]
export const asyncRoutes = [ 
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/project',
    component: Layout, 
    redirect: '/project/my_project',
    name: '项目管理',
    meta: { title: '项目管理', icon: 'example', roles: ['项目经理', '助理', '部门经理', '管理员', '技术负责人'] },
    children: [
      {
        path: 'new_project',
        name: '立项',
        component: () => import('@/views/new_project/index'),
        meta: { title: '立项', icon: 'tree'}
      },
      {
        path: 'my_project',
        name: '我的项目',
        component: () => import('@/views/my_project/index'),
        meta: { title: '我的项目', icon: 'table'},

      },
    ]
  },

  {
    path: '/query',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Query',
        component: () => import('@/views/query/index'),
        meta: { title: '查询', icon: 'eye-open', roles: ['主任会计师', '副主任会计师', '部门经理', '技术负责人', '管理员'] }
      }
    ]
  },
  {
    path: '/review',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Review',
        component: () => import('@/views/review/index'),
        meta: { title: '我的审核', icon: 'form', roles: ['主任会计师', '副主任会计师', '部门经理', '技术负责人', '行政助理', '管理员'] }
      }
    ]

  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
