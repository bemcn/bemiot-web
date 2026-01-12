import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取任务统计
 */
export function getTaskStatistics(params: { group: string }) {
  return Alova.Get<InResult>('/monitorsTask/getTaskStatistics', {
    params,
  });
}

/**
 * @description: 获取任务分类统计
 */
export function getTaskClassStatistics() {
  return Alova.Get<InResult>('/monitorsTask/getTaskClassStatistics');
}

/**
 * @description: 获取场景统计
 */
export function getSceneStatistics(params: { group: string }) {
  return Alova.Get<InResult>('/monitorsTask/getSceneStatistics', {
    params,
  });
}

/**
 * @description: 获取场景分组统计
 */
export function getSceneGroupStatistics() {
  return Alova.Get<InResult>('/monitorsTask/getSceneGroupStatistics');
}
