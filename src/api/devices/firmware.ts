import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义固件相关接口类型
export interface FirmwareParams {
  installType?: number;
  key?: string;
}
export interface FirmwarePageParams {
  installType?: number;
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取固件列表
 */
export function getFirmwareList(params: FirmwareParams) {
  return Alova.Get<InResult>('/firmware/getFirmwareList', {
    params,
  });
}

/**
 * @description: 获取固件分页列表
 */
export function getFirmwarePageList(params: FirmwarePageParams) {
  return Alova.Get<InResult>('/firmware/getFirmwarePageList', {
    params,
  });
}

/**
 * @description: 根据ID获取固件信息
 */
export function getFirmware(params: { id: number }) {
  return Alova.Get<InResult>('/firmware/getFirmware', {
    params,
  });
}

/**
 * @description: 新增固件
 * @param params 固件信息
 * @returns 返回创建结果
 */
export function addFirmware(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/firmware/addFirmware', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑固件信息
 * @param params 固件更新信息
 * @returns 返回更新结果
 */
export function editFirmware(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/firmware/editFirmware', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个固件
 */
export function delFirmwareById(params: { id: number }) {
  return Alova.Get<InResult>('/firmware/delFirmware', {
    params,
  });
}

/**
 * @description: 批量删除固件
 */
export function delFirmwareByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/firmware/delFirmwares', {
    params,
  });
}
