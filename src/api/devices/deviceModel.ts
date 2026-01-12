import { Alova } from '@/utils/http/alova/index';

// 定义设备相关接口类型
export interface DeviceModelParams {
  deviceId: string;
  identity?: string;
  name?: string;
  modelClass?: number;
  neModelClass?: number;
  history?: number;
}

export interface DeviceModelPageParams {
  deviceId: string;
  identity?: string;
  name?: string;
  modelClass?: number;
  neModelClass?: number;
  history?: number;
  index?: number;
  size?: number;
}

// 定义设备相关接口类型
export interface ModelParams {
  deviceId: string;
  identity: string;
}

/**
 * @description: 获取设备物模型列表
 */
export function getDeviceModelList(params: DeviceModelParams) {
  return Alova.Get<InResult>('/deviceModel/getDeviceModelList', {
    params,
  });
}

/**
 * @description: 获取设备物模型列表
 */
export function getDeviceModelPageList(params: DeviceModelPageParams) {
  return Alova.Get<InResult>('/deviceModel/getDeviceModelPageList', {
    params,
  });
}

/**
 * @description: 获取设备物模型信息
 */
export function getDeviceModel(params: ModelParams) {
  return Alova.Get<InResult>('/deviceModel/getDeviceModel', {
    params,
  });
}
