import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { AlertOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'alarms';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/alarms',
    name: routeName,
    redirect: '/alarms/alarm_statistics',
    component: Layout,
    meta: {
      title: '告警中心',
      icon: renderIcon(AlertOutlined),
      permissions: ['alarm_statistics', 'alarm_log', 'alarm_config'],
      sort: 7,
    },
    children: [
      {
        path: 'alarm_statistics',
        name: `${routeName}_alarm_statistics`,
        meta: {
          title: '告警统计',
          permissions: ['alarm_statistics'],
        },
        component: () => import('@/views/alarms/alarm_statistics/index.vue'),
      },
      {
        path: 'alarm_log',
        name: `${routeName}_alarm_log`,
        meta: {
          title: '告警日志',
          permissions: ['alarm_log'],
        },
        component: () => import('@/views/alarms/alarm_log/index.vue'),
      },
      {
        path: 'alarm_config',
        name: `${routeName}_alarm_config`,
        meta: {
          title: '告警设置',
          permissions: ['alarm_config'],
        },
        component: () => import('@/views/alarms/alarm_config/index.vue'),
      },
    ],
  },
];

export default routes;
