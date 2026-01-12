import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取消息分类统计
 */
export function getClassStatistics(params: { group: string }) {
  return Alova.Get<InResult>('/monitorsMessage/getClassStatistics', {
    params,
  });
}

/**
 * @description: 获取消息分类总计
 */
export function getClassTotal() {
  return Alova.Get<InResult>('/monitorsMessage/getClassTotal');
}

/**
 * @description: 获取连接统计
 */
export function getConnectStatistics(params: { group: string }) {
  return Alova.Get<InResult>('/monitorsMessage/getConnectStatistics', {
    params,
  });
}

/**
 * @description: 获取队列统计
 */
export function getQueueStatistics(params: { group: string }) {
  return Alova.Get<InResult>('/monitorsMessage/getQueueStatistics', {
    params,
  });
}
