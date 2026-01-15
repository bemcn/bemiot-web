import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { FundOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

const routeName = 'monitors';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/monitors',
    name: routeName,
    redirect: '/monitors/platform_monitor',
    component: Layout,
    meta: {
      title: '监控中心',
      icon: renderIcon(FundOutlined),
      permissions: [
        'platform_monitor',
        'scheduled_monitor',
        'cache_monitor',
        'message_monitor',
        'data_monitor',
        'run_monitor',
      ],
      sort: 8,
    },
    children: [
      {
        path: 'platform_monitor',
        name: `${routeName}_platform_monitor`,
        meta: {
          title: '平台监控',
          permissions: ['platform_monitor'],
        },
        component: () => import('@/views/monitors/platform_monitor/index.vue'),
      },
      {
        path: 'scheduled_monitor',
        name: `${routeName}_scheduled_monitor`,
        meta: {
          title: '任务监控',
          permissions: ['scheduled_monitor'],
        },
        component: () => import('@/views/monitors/scheduled_monitor/index.vue'),
      },
      {
        path: 'cache_monitor',
        name: `${routeName}_cache_monitor`,
        meta: {
          title: '缓存监控',
          permissions: ['cache_monitor'],
        },
        component: () => import('@/views/monitors/cache_monitor/index.vue'),
      },
      {
        path: 'message_monitor',
        name: `${routeName}_message_monitor`,
        meta: {
          title: '消息监控',
          permissions: ['message_monitor'],
        },
        component: () => import('@/views/monitors/message_monitor/index.vue'),
      },
      {
        path: 'run_monitor',
        name: `${routeName}_run_monitor`,
        meta: {
          title: '运行监控',
          permissions: ['run_monitor'],
        },
        component: () => import('@/views/monitors/run_monitor/index.vue'),
      },
    ],
  },
];

export default routes;
