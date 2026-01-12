import { Alova } from '@/utils/http/alova/index';

// 定义相关接口类型
export interface LogAlarmParams {
  deviceId?: string;
  identity?: string;
  status?: number;
  level?: number;
  startDate?: string;
  endDate?: string;
}

export interface LogAlarmPageParams {
  deviceId?: string;
  identity?: string;
  status?: number;
  level?: number;
  startDate?: string;
  endDate?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取指定数量最新日志列表
 */
export function getAlarmLogTop(params: LogAlarmParams) {
  return Alova.Get<InResult>('/logModelAlarm/getAlarmLogTop', {
    params,
  });
}

/**
 * @description: 获取系统日志分页列表
 */
export function getAlarmLogPageList(params: LogAlarmPageParams) {
  return Alova.Get<InResult>('/logModelAlarm/getAlarmLogPageList', {
    params,
  });
}

/**
 * @description: 获取告警合计
 */
export function totalAlarmLogLevel() {
  return Alova.Get<InResult>('/logModelAlarm/totalAlarmLogLevel');
}

/**
 * @description: 获取近7天告警合计
 */
export function totalAlarmLogSevenDay() {
  return Alova.Get<InResult>('/logModelAlarm/totalAlarmLogSevenDay');
}

/**
 * @description: 获取设备告警排行
 */
export function rankingAlarmLogDevice(params: { size: number }) {
  return Alova.Get<InResult>('/logModelAlarm/rankingAlarmLogDevice', {
    params,
  });
}

/**
 * @description: 删除单个系统日志
 */
export function delAlarmLog(params: { id: string }) {
  return Alova.Get<InResult>('/logModelAlarm/delAlarmLog', {
    params,
  });
}

/**
 * @description: 批量删除系统日志
 */
export function delAlarmLogs(params: { ids: string }) {
  return Alova.Get<InResult>('/logModelAlarm/delAlarmLogs', {
    params,
  });
}
