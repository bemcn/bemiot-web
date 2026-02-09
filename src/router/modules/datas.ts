import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DatabaseOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'datas';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/datas',
    name: routeName,
    component: Layout,
    redirect: '/datas/agg_analysis',
    meta: {
      title: '数据中心',
      icon: renderIcon(DatabaseOutlined),
      permissions: ['agg_analysis', 'data_query', 'data_analysis', 'data_maint'],
      sort: 4,
    },
    children: [
      {
        path: 'agg_analysis',
        name: `${routeName}_agg_analysis`,
        meta: {
          title: '聚合统计',
          permissions: ['agg_analysis'],
        },
        component: () => import('@/views/datas/agg_analysis/index.vue'),
      },
      {
        path: 'data_query',
        name: `${routeName}_data_query`,
        meta: {
          title: '数据查询',
          permissions: ['data_query'],
        },
        component: () => import('@/views/datas/data_query/index.vue'),
      },
      {
        path: 'data_analysis',
        name: `${routeName}_data_analysis`,
        meta: {
          title: '数据统计',
          permissions: ['data_analysis'],
        },
        component: () => import('@/views/datas/data_analysis/index.vue'),
      },
      {
        path: 'data_maint',
        name: `${routeName}_data_maint`,
        meta: {
          title: '数据维护',
          permissions: ['data_maint'],
        },
        component: () => import('@/views/datas/data_maint/index.vue'),
      },
    ],
  },
];

export default routes;
