import { Alova } from '@/utils/http/alova/index';

// 定义相关接口类型
export interface LogEventParams {
  deviceId?: string;
  identity?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface LogEventPageParams {
  deviceId?: string;
  identity?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取指定数量最新日志列表
 */
export function getEventLogTop(params: LogEventParams) {
  return Alova.Get<InResult>('/log_model_event/getEventLogTop', {
    params,
  });
}

/**
 * @description: 获取日志分页列表
 */
export function getEventLogPageList(params: LogEventPageParams) {
  return Alova.Get<InResult>('/log_model_event/getEventLogPageList', {
    params,
  });
}

/**
 * @description: 删除单个日志
 */
export function delEventLog(params: { id: string }) {
  return Alova.Get<InResult>('/log_model_event/delEventLog', {
    params,
  });
}

/**
 * @description: 批量删除日志
 */
export function delEventLogs(params: { ids: string }) {
  return Alova.Get<InResult>('/log_model_event/delEventLogs', {
    params,
  });
}
