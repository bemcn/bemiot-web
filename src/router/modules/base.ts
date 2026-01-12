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
      {
        path: 'ext_interface',
        name: `${routeName}_ext_interface`,
        meta: {
          title: '外部接口',
          permissions: ['ext_interface'],
        },
        component: () => import('@/views/base/ext_interface/index.vue'),
      },
      {
        path: 'msg_templates',
        name: `${routeName}_msg_templates`,
        meta: {
          title: '消息模板',
          permissions: ['msg_templates'],
        },
        component: () => import('@/views/base/msg_templates/index.vue'),
      },
    ],
  },
];

export default routes;
