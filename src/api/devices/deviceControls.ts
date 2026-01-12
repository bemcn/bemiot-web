import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义设备群控相关接口类型
export interface DeviceControlsPageParams {
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取设备群控分页列表
 */
export function getDeviceControlsPageList(params: DeviceControlsPageParams) {
  return Alova.Get<InResult>('/device_controls/getDeviceControlsPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取设备群控信息
 */
export function getDeviceControls(params: { id: number }) {
  return Alova.Get<InResult>('/device_controls/getDeviceControls', {
    params,
  });
}

/**
 * @description: 新增设备群控
 * @param params 设备群控信息
 * @returns 返回创建结果
 */
export function addDeviceControls(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device_controls/addDeviceControls', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑设备群控信息
 * @param params 设备群控更新信息
 * @returns 返回更新结果
 */
export function editDeviceControls(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device_controls/editDeviceControls', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个设备群控
 */
export function delDeviceControlsById(params: { id: number }) {
  return Alova.Get<InResult>('/device_controls/delDeviceControls', {
    params,
  });
}

/**
 * @description: 批量删除设备群控
 */
export function delDeviceControlsByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/device_controls/delDeviceControlss', {
    params,
  });
}
