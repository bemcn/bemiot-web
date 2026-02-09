import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ProjectOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'base';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/base',
    name: routeName,
    component: Layout,
    redirect: '/base/space',
    meta: {
      title: '基础数据',
      icon: renderIcon(ProjectOutlined),
      permissions: [
        'space',
        'product_class',
        'device_group',
        'general_model_group',
        'drive',
        'certificate',
        'alarm_config',
      ],
      sort: 9,
    },
    children: [
      {
        path: 'space',
        name: `${routeName}_space`,
        meta: {
          title: '空间位置',
          permissions: ['space'],
        },
        component: () => import('@/views/base/space/index.vue'),
      },
      {
        path: 'product_class',
        name: `${routeName}_product_class`,
        meta: {
          title: '产品分类',
          permissions: ['product_class'],
        },
        component: () => import('@/views/base/product_class/index.vue'),
      },
      {
        path: 'device_group',
        name: `${routeName}_device_group`,
        meta: {
          title: '设备分组',
          permissions: ['device_group'],
        },
        component: () => import('@/views/base/device_group/index.vue'),
      },
      {
        path: 'general_model_group',
        name: `${routeName}_general_model_group`,
        meta: {
          title: '物模型分组',
          permissions: ['general_model_group'],
        },
        component: () => import('@/views/base/general_model_group/index.vue'),
      },
      {
        path: 'protocols',
        name: `${routeName}_protocols`,
        meta: {
          title: '通讯协议',
          permissions: ['protocols'],
        },
        component: () => import('@/views/base/protocols/index.vue'),
      },
      {
        path: 'drive',
        name: `${routeName}_drive`,
        meta: {
          title: '驱动管理',
          permissions: ['drive'],
        },
        component: () => import('@/views/base/drive/index.vue'),
      },
      {
        path: 'certificate',
        name: `${routeName}_certificate`,
        meta: {
          title: '证书管理',
          permissions: ['certificate'],
        },
        component: () => import('@/views/base/certificate/index.vue'),
      },
    ],
  },
];

export default routes;
