import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义设备相关接口类型
export interface DeviceModelParams {
  deviceId: number;
  identity?: string;
  name?: string;
  type?: number;
  neType?: number;
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
 * @description: 新增设备物模型
 * @param params 设备物模型信息
 * @returns 返回创建结果
 */
export function addDeviceModel(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/deviceModel/addDeviceModel', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 批量新增设备物模型
 * @param params 设备物模型信息
 * @returns 返回创建结果
 */
export function addDeviceModels(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/deviceModel/addDeviceModels', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑设备物模型
 * @param params 设备物模型信息
 * @returns 返回创建结果
 */
export function editDeviceModel(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/deviceModel/editDeviceModel', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 修改排序
 */
export function updateOrderNumber(params: { id: number; orderNum: number }) {
  return Alova.Get<InResult>('/deviceModel/updateOrderNumber', {
    params,
  });
}

/**
 * @description: 删除单个设备物模型
 */
export function delDeviceModelById(params: { id: number }) {
  return Alova.Get<InResult>('/deviceModel/delDeviceModel', {
    params,
  });
}

/**
 * @description: 批量删除设备物模型
 */
export function delDeviceModelByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/deviceModel/delDeviceModels', {
    params,
  });
}
