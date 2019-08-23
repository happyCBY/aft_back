
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
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Index',
    children: [{
      path: 'index',
      component: () => import('@/views/welcome'),
      meta: { title: '首页', icon: 'ic_list_home' }
    }]
  },
  // 用户管理
  {
    path: '/account',
    component: Layout,
    redirect: '/account/list',
    name: 'account',
    meta: { title: '用户管理', icon: 'ic_list_user' },
    children: [
      {
        path: 'list',
        name: 'account-list',
        component: () => import('@/views/account/list'),
        meta: { title: '用户管理', icon: 'ic_list_user' }
      },
      {
        path: 'detail',
        component: () => import('@/views/account/detail'),
        name: 'account-detail',
        meta: { title: '奖励详情', noCache: true, activeMenu: '/account/list' },
        hidden: true
      }
    ]
  },
  // 用户奖励记录
  {
    path: '/reward',
    component: Layout,
    redirect: '/reward/list',
    name: 'reward',
    meta: { title: '用户奖励记录', icon: 'nested' },
    children: [
      {
        path: 'list',
        name: 'reward-list',
        component: () => import('@/views/reward/list'),
        meta: { title: '用户奖励记录', icon: 'nested' }
      },
      {
        path: 'detail',
        component: () => import('@/views/reward/detail'),
        name: 'reward-detail',
        meta: { title: '奖励详情', noCache: true, activeMenu: '/reward/list' },
        hidden: true
      }
    ]
  },
  //  抢购记录
  {
    path: '/purchase',
    name: 'purchase',
    meta: { title: '抢购记录', icon: 'ic_list_recharge' },
    component: Layout,
    redirect: '/purchase/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/record/purchase'),
        meta: { title: '抢购记录', icon: 'ic_list_recharge' }
      }
    ]
  },
  //  解锁记录
  {
    path: '/unlock',
    name: 'unlock',
    meta: { title: '解锁记录', icon: 'ic_list_recharge' },
    component: Layout,
    redirect: '/unlock/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/record/unlock'),
        meta: { title: '解锁记录', icon: 'ic_list_recharge' }
      }
    ]
  },
  // AFT期数设置
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/list',
    name: 'setting',
    meta: { title: 'AFT期数设置', icon: 'form' },
    children: [
      {
        path: 'list',
        name: 'setting-list',
        component: () => import('@/views/setting/list'),
        meta: { title: 'AFT期数设置', icon: 'form' }
      },
      {
        path: 'detail',
        component: () => import('@/views/setting/detail'),
        name: 'setting-detail',
        meta: { title: '详情', icon: 'form', activeMenu: '/setting/list' },
        hidden: true
      }
    ]
  },
  //  参数配置
  {
    path: '/params',
    name: 'params',
    meta: { title: '参数配置', icon: 'example' },
    component: Layout,
    redirect: '/params/setting',
    children: [
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/params/setting'),
        meta: { title: '参数配置', icon: 'example' }
      }
    ]
  },
  //  账号管理
  {
    path: '/manager',
    name: 'manager',
    meta: { title: '账号管理', icon: 'user' },
    component: Layout,
    redirect: '/manager/account',
    children: [
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/manager/list'),
        meta: { title: '账号管理', icon: 'user' }
      }
    ]
  }
]
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

//实例化vue的时候只挂载constantRouter
// export default new Router({
//   routes: constantRouterMap
// });

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

// const createRouter = () => new Router({
//   // mode: 'history', // require service support
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRoutes
// })
//
const router = createRouter()
//
// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
//
export default router
