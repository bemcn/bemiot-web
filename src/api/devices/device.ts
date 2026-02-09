import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义设备相关接口类型
export interface DeviceParams {
  types?: number;
  classId?: number;
  groupId?: number;
  userId?: number;
  spaceId?: number;
  productId?: number;
  status?: number;
  filed?: string;
  key?: string;
  startDate?: number;
  endDate?: number;
}
export interface DevicePageParams {
  types?: number;
  classId?: number;
  groupId?: number;
  userId?: number;
  spaceId?: number;
  productId?: number;
  status?: number;
  filed?: string;
  key?: string;
  startDate?: number;
  endDate?: number;
  index?: number;
  size?: number;
}
export interface GetCodeParams {
  types?: number;
  cityCode?: string;
  deviceType?: string;
}

/**
 * @description: 获取设备列表
 */
export function getDeviceList(params: DeviceParams) {
  return Alova.Get<InResult>('/device/getDeviceList', {
    params,
  });
}

/**
 * @description: 获取未绑定设备列表
 */
export function getDeviceNoAssetList(params: { filed?: string; key?: string }) {
  return Alova.Get<InResult>('/device/getDeviceNoAssetList', {
    params,
  });
}

/**
 * @description: 获取指定数量的设备列表
 */
export function getDeviceTopList(params: DeviceParams) {
  return Alova.Get<InResult>('/device/getDeviceTopList', {
    params,
  });
}

/**
 * @description: 获取设备分页列表
 */
export function getDevicePageList(params: DevicePageParams) {
  return Alova.Get<InResult>('/device/getDevicePageList', {
    params,
  });
}

/**
 * @description: 获取设备所有者分页列表
 */
export function getDeviceAssetPageList(params: DevicePageParams) {
  return Alova.Get<InResult>('/device/getDeviceAssetPageList', {
    params,
  });
}

/**
 * @description: 获取设备分布地图
 */
export function getDevicesMap(params: DeviceParams) {
  return Alova.Get<InResult>('/device/getDevicesMap', {
    params,
  });
}

/**
 * @description: 获取设备树
 */
export function getDevicesTree(params: { types?: number; lastType?: number }) {
  return Alova.Get<InResult>('/device/getDevicesTree', {
    params,
  });
}

/**
 * @description: 获取国家中心编码6位
 */
export function getGbAreaTree() {
  return Alova.Get<InResult>('/gbArea/getGbAreaTree');
}

/**
 * @description: 根据ID获取设备信息
 */
export function getDevice(params: { id: number }) {
  return Alova.Get<InResult>('/device/getDevice', {
    params,
  });
}

/**
 * @description: 获取可用主通道号
 */
export function useMainChannel(params: { videoDomain: string }) {
  return Alova.Get<InResult>('/device/useMainChannel', {
    params,
  });
}

/**
 * @description: 获取设备编号
 */
export function getDeviceCode(params: GetCodeParams) {
  return Alova.Get<InResult>('/device/getDeviceCode', {
    params,
  });
}

/**
 * @description: 新增设备
 * @param params 设备信息
 * @returns 返回创建结果
 */
export function addDevice(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device/addDevice', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑设备信息
 * @param params 设备更新信息
 * @returns 返回更新结果
 */
export function editDevice(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device/editDevice', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 禁用设备
 */
export function disableDevice(params: { id: number }) {
  return Alova.Get<InResult>('/device/disableDevice', {
    params,
  });
}

/**
 * @description: 启用设备
 */
export function enableDevice(params: { id: number }) {
  return Alova.Get<InResult>('/device/enableDevice', {
    params,
  });
}

/**
 * @description: 批量绑定设备
 */
export function bindUserArray(params: { ids: string; userId: number }) {
  return Alova.Get<InResult>('/device/bindUserArray', {
    params,
  });
}

/**
 * @description: 解绑设备
 */
export function liftedUser(params: { id: number }) {
  return Alova.Get<InResult>('/device/liftedUser', {
    params,
  });
}

/**
 * @description: 批量解绑设备
 */
export function liftedUserArray(params: { ids: string }) {
  return Alova.Get<InResult>('/device/liftedUsers', {
    params,
  });
}

/**
 * @description: 修改设备状态
 */
export function updateStatus(params: { id: number; status: number }) {
  return Alova.Get<InResult>('/device/updateStatus', {
    params,
  });
}

/**
 * @description: 删除单个设备
 */
export function delDeviceById(params: { id: number }) {
  return Alova.Get<InResult>('/device/delDevice', {
    params,
  });
}

/**
 * @description: 批量删除设备
 */
export function delDeviceByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/device/delDevices', {
    params,
  });
}
