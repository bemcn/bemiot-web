import { Alova } from '@/utils/http/alova/index';

// 定义设备相关接口类型
export interface ModelParams {
  deviceId: string;
  identity: string;
}
export interface HistoricalModelParams {
  deviceId: string;
  identity: string;
  timeFrame: string;
  timeData: string;
  queryOut: string;
}
export interface HistoricalParams {
  deviceId: string;
  identity: string;
  timeFrame: string;
  timeData: string;
}
export interface HistoricalPageParams {
  deviceId: string;
  identity: string;
  timeFrame: string;
  timeData: string;
  orderBy: string;
  index: number;
  size: number;
}

/**
 * @description: 获取IOT物模型实时数据
 */
export function realTimeData(params: ModelParams) {
  return Alova.Get<InResult>('/iot/realTimeData', {
    params,
  });
}

/**
 * @description: 查询物模型历史数据
 */
export function historicalOne(params: HistoricalModelParams) {
  return Alova.Get<InResult>('/iot/historicalData', {
    params,
  });
}

/**
 * @description: 查询物模型历史聚合数据
 */
export function historicalDeviceFind(params: HistoricalParams) {
  return Alova.Get<InResult>('/iot/historicalDeviceFind', {
    params,
  });
}



/**
 * @description: 查询物模型历史聚合数据
 */
export function historicalDeviceQuery(params: HistoricalPageParams) {
  return Alova.Get<InResult>('/iot/historicalDeviceQuery', {
    params,
  });
}
