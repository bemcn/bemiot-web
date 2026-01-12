import { Alova } from '@/utils/http/alova/index';

// 定义相关接口类型
export interface LogParams {
  source?: string;
  filed?: string;
  key?: string;
  operation?: string;
  startDate?: string;
  endDate?: string;
}

export interface LogPageParams {
  source?: string;
  filed?: string;
  key?: string;
  operation?: string;
  startDate?: string;
  endDate?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取系统日志分页列表
 */
export function getLogPageList(params: LogPageParams) {
  return Alova.Get<InResult>('/log/getLogPageList', {
    params,
  });
}

/**
 * @description: 删除单个系统日志
 */
export function delLogById(params: { id: string }) {
  return Alova.Get<InResult>('/log/delLog', {
    params,
  });
}

/**
 * @description: 批量删除系统日志
 */
export function delLogByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/log/delLogs', {
    params,
  });
}
