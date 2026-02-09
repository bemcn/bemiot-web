import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { VideoCameraOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'videos';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/videos',
    name: routeName,
    redirect: '/videos/split_screen',
    component: Layout,
    meta: {
      title: '视频中心',
      icon: renderIcon(VideoCameraOutlined),
      permissions: ['split_screen', 'video_record', 'voice_intercom', 'voice_conf', 'video_alarm'],
      sort: 3,
    },
    children: [
      {
        path: 'split_screen',
        name: `${routeName}_split_screen`,
        meta: {
          title: '分屏显示',
          permissions: ['split_screen'],
        },
        component: () => import('@/views/videos/split_screen/index.vue'),
      },
      {
        path: 'video_record',
        name: `${routeName}_video_record`,
        meta: {
          title: '视频通道',
          permissions: ['video_record'],
        },
        component: () => import('@/views/videos/video_record/index.vue'),
      },
      {
        path: 'voice_intercom',
        name: `${routeName}_voice_intercom`,
        meta: {
          title: '录像管理',
          permissions: ['voice_intercom'],
        },
        component: () => import('@/views/videos/voice_intercom/index.vue'),
      },
      {
        path: 'voice_conf',
        name: `${routeName}_voice_conf`,
        meta: {
          title: '视频配置',
          permissions: ['voice_conf'],
        },
        component: () => import('@/views/videos/voice_conf/index.vue'),
      },
      {
        path: 'video_alarm',
        name: `${routeName}_video_alarm`,
        meta: {
          title: '视频告警',
          permissions: ['video_alarm'],
        },
        component: () => import('@/views/videos/video_alarm/index.vue'),
      },
    ],
  },
];

export default routes;
