import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { InboxOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'asset';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/asset',
    name: routeName,
    redirect: '/asset/asset_archives',
    component: Layout,
    meta: {
      title: '资产管理',
      icon: renderIcon(InboxOutlined),
      permissions: ['asset_archives', 'asset_attr', 'asset_distribution', 'asset_map'],
      sort: 6,
    },
    children: [
      {
        path: 'asset_archives',
        name: `${routeName}_asset_archives`,
        meta: {
          title: '资产档案',
          permissions: ['asset_archives'],
        },
        component: () => import('@/views/asset/asset_archives/index.vue'),
      },
      {
        path: 'asset_attr',
        name: `${routeName}_asset_attr`,
        meta: {
          title: '资产属性',
          permissions: ['asset_attr'],
        },
        component: () => import('@/views/asset/asset_attr/index.vue'),
      },
      {
        path: 'asset_distribution',
        name: `${routeName}_asset_distribution`,
        meta: {
          title: '资产分配',
          permissions: ['asset_distribution'],
        },
        component: () => import('@/views/asset/asset_distribution/index.vue'),
      },
      {
        path: 'asset_map',
        name: `${routeName}_asset_map`,
        meta: {
          title: '资产地图',
          permissions: ['asset_map'],
        },
        component: () => import('@/views/asset/asset_map/index.vue'),
      },
    ],
  },
];

export default routes;
