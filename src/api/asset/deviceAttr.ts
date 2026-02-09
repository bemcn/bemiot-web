import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义资产档案接口类型
export interface DeviceAttrParams {
  deviceId?: string;
}
export interface DeviceAttrPageParams {
  deviceId?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取资产档案列表
 */
export function getDeviceAttrList(params: DeviceAttrParams) {
  return Alova.Get<InResult>('/deviceAttr/getDeviceAttrList', {
    params,
  });
}

/**
 * @description: 获取资产档案分页列表
 */
export function getDeviceAttrPageList(params: DeviceAttrPageParams) {
  return Alova.Get<InResult>('/deviceAttr/getDeviceAttrPageList', {
    params,
  });
}

/**
 * @description: 批量添加设备档案属性
 * @param params 资产档案信息
 * @returns 返回创建结果
 */
export function addDeviceAttrArray(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/deviceAttr/addDeviceAttrArray', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}
