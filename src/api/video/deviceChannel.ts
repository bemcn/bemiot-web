import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义视频通道相关接口类型
export interface DeviceChannelParams {
  deviceId?: number;
  key?: string;
}
export interface DeviceChannelPageParams {
  deviceId?: number;
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取视频通道列表
 */
export function getDeviceChannelList(params: DeviceChannelParams) {
  return Alova.Get<InResult>('/device_channel/getDeviceChannelList', {
    params,
  });
}

/**
 * @description: 获取视频通道分页列表
 */
export function getDeviceChannelPageList(params: DeviceChannelPageParams) {
  return Alova.Get<InResult>('/device_channel/getDeviceChannelPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取视频通道信息
 */
export function getDeviceChannel(params: { id: string }) {
  return Alova.Get<InResult>('/device_channel/getDeviceChannel', {
    params,
  });
}

/**
 * @description: 新增视频通道
 * @param params 视频通道信息
 * @returns 返回创建结果
 */
export function addDeviceChannel(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device_channel/addDeviceChannel', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 批量新增视频通道
 * @param params 视频通道信息
 * @returns 返回创建结果
 */
export function addDeviceChannelArray(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device_channel/addDeviceChannelArray', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑视频通道信息
 * @param params 视频通道更新信息
 * @returns 返回更新结果
 */
export function editDeviceChannel(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device_channel/editDeviceChannel', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 修改在离线状态
 */
export function statusDeviceChannel(params: { id: string; status: number }) {
  return Alova.Post<InResult>('/device_channel/statusDeviceChannel', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 修改运行状态
 */
export function runStatusDeviceChannel(params: { id: string; types: number; status: number }) {
  return Alova.Post<InResult>('/device_channel/runStatusDeviceChannel', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个视频通道
 */
export function delDeviceChannelById(params: { id: number }) {
  return Alova.Get<InResult>('/device_channel/delDeviceChannel', {
    params,
  });
}

/**
 * @description: 批量删除视频通道
 */
export function delDeviceChannelByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/device_channel/delDeviceChannels', {
    params,
  });
}
