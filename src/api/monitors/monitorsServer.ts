import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取平台信息
 */
export function getServerInfo() {
  return Alova.Get<InResult>('/monitorsServer/getServerInfo');
}
