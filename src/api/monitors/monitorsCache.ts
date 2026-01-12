import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取缓存信息
 */
export function getCacheInfo() {
  return Alova.Get<InResult>('/monitorsCache/getCacheInfo');
}
