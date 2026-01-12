import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { OneToOneOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'rules';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/rules',
    name: routeName,
    component: Layout,
    redirect: '/rules/data_bridging',
    meta: {
      title: '规则联动',
      icon: renderIcon(OneToOneOutlined),
      permissions: ['data_bridging', 'scene_group', 'scene_linkage'],
      sort: 2,
    },
    children: [
      {
        path: 'data_bridging',
        name: `${routeName}_data_bridging`,
        meta: {
          title: '数据桥接',
          permissions: ['data_bridging'],
        },
        component: () => import('@/views/rules/data_bridging/index.vue'),
      },
      {
        path: 'scene_group',
        name: `${routeName}_scene_group`,
        meta: {
          title: '场景分组',
          permissions: ['scene_group'],
        },
        component: () => import('@/views/rules/scene_group/index.vue'),
      },
      {
        path: 'scene_linkage',
        name: `${routeName}_scene_linkage`,
        meta: {
          title: '场景联动',
          permissions: ['scene_linkage'],
        },
        component: () => import('@/views/rules/scene_linkage/index.vue'),
      },
    ],
  },
];

export default routes;
