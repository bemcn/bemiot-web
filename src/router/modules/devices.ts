import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CodeSandboxOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'devices';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/devices',
    name: routeName,
    component: Layout,
    redirect: '/devices/device',
    meta: {
      title: '设备物联',
      icon: renderIcon(CodeSandboxOutlined),
      permissions: [
        'device',
        'device_controls',
        'device_map',
        'product',
        'firmware',
        'general_model',
      ],
      sort: 1,
    },
    children: [
      {
        path: 'device',
        name: `${routeName}_device`,
        meta: {
          title: '设备管理',
          permissions: ['device'],
        },
        component: () => import('@/views/devices/device/index.vue'),
      },
      {
        path: 'device_controls',
        name: `${routeName}_device_controls`,
        meta: {
          title: '设备群控',
          permissions: ['device_controls'],
        },
        component: () => import('@/views/devices/device_controls/index.vue'),
      },
      {
        path: 'device_map',
        name: `${routeName}_device_map`,
        meta: {
          title: '设备地图',
          permissions: ['device_map'],
        },
        component: () => import('@/views/devices/device_map/index.vue'),
      },
      {
        path: 'device_group',
        name: `${routeName}_device_group`,
        meta: {
          title: '设备分组',
          permissions: ['device_group'],
        },
        component: () => import('@/views/devices/device_group/index.vue'),
      },
      {
        path: 'product',
        name: `${routeName}_product`,
        meta: {
          title: '产品管理',
          permissions: ['product'],
        },
        component: () => import('@/views/devices/product/index.vue'),
      },
      {
        path: 'product_class',
        name: `${routeName}_product_class`,
        meta: {
          title: '产品分类',
          permissions: ['product_class'],
        },
        component: () => import('@/views/devices/product_class/index.vue'),
      },
      {
        path: 'firmware',
        name: `${routeName}_firmware`,
        meta: {
          title: '产品固件',
          permissions: ['firmware'],
        },
        component: () => import('@/views/devices/firmware/index.vue'),
      },
    ],
  },
];

export default routes;
