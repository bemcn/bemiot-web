import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取统计信息
 */
export function getIotTotal(): Object {
  return Alova.Get<InResult>('/dashboard/getIotTotal');
}

/**
 * @description: 获取消息分时统计
 */
export function getMessageHourStatistics(): Object {
  return Alova.Get<InResult>('/dashboard/getMessageHourStatistics');
}

/**
 * @description: 获取分类设备统计
 */
export function getDevicesTypeTotal(): Object {
  return Alova.Get<InResult>('/dashboard/getDevicesTypeTotal');
}

/**
 * @description: 获取刷新数据
 */
export function getUpDateBase(): Object {
  return Alova.Get<InResult>('/dashboard/getUpDateBase');
}

/**
 * @description: 获取最新通知公告
 */
export function getNoticeTop(params: { size: number }): Object {
  return Alova.Get<InResult>('/dashboard/getNoticeTop', {
    params,
  });
}

/**
 * @description: 获取最新系统日志
 */
export function getLogTop(params: { size: number }): Object {
  return Alova.Get<InResult>('/dashboard/getLogTop', {
    params,
  });
}
