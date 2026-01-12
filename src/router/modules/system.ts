import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SettingOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'system';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/system',
    name: routeName,
    redirect: '/system/sys_param',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: renderIcon(SettingOutlined),
      permissions: ['sys_param', 'ext_interface', 'role_auth', 'users', 'blacklist', 'sys_log'],
      sort: 10,
    },
    children: [
      {
        path: 'sys_param',
        name: `${routeName}_sys_param`,
        meta: {
          title: '系统设置',
          permissions: ['sys_param'],
        },
        component: () => import('@/views/system/sys_param/index.vue'),
      },
      {
        path: 'msg_system',
        name: `${routeName}_msg_system`,
        meta: {
          title: '消息设置',
          permissions: ['msg_system'],
        },
        component: () => import('@/views/system/msg_system/index.vue'),
      },
      {
        path: 'role_auth',
        name: `${routeName}_role_auth`,
        meta: {
          title: '角色权限',
          permissions: ['role_auth'],
        },
        component: () => import('@/views/system/role_auth/index.vue'),
      },
      {
        path: 'users',
        name: `${routeName}_users`,
        meta: {
          title: '用户管理',
          permissions: ['users'],
        },
        component: () => import('@/views/system/users/index.vue'),
      },
      {
        path: 'blacklist',
        name: `${routeName}_blacklist`,
        meta: {
          title: '黑名单管理',
          permissions: ['blacklist'],
        },
        component: () => import('@/views/system/blacklist/index.vue'),
      },
      {
        path: 'sys_log',
        name: `${routeName}_sys_log`,
        meta: {
          title: '系统日志',
          permissions: ['sys_log'],
        },
        component: () => import('@/views/system/sys_log/index.vue'),
      },
    ],
  },
];

export default routes;
