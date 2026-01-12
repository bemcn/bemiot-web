import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义固件升级计划相关接口类型
export interface FirmwareUpdateTaskPageParams {
  firmwareId: number;
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取固件升级计划分页列表
 */
export function getFirmwareUpdateTaskPageList(params: FirmwareUpdateTaskPageParams) {
  return Alova.Get<InResult>('/firmware_task/getFirmwareUpdateTaskPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取固件升级计划
 */
export function getFirmwareUpdateTask(params: { id: number }) {
  return Alova.Get<InResult>('/firmware_task/getFirmwareUpdateTask', {
    params,
  });
}

/**
 * @description: 新增升级计划
 * @param params 固件升级计划
 * @returns 返回创建结果
 */
export function addFirmwareUpdateTask(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/firmware_task/addFirmwareUpdateTask', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个升级计划
 */
export function delFirmwareUpdateTask(params: { id: number }) {
  return Alova.Get<InResult>('/firmware_task/delFirmwareUpdateTask', {
    params,
  });
}
