import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义固件升级日志相关接口类型
export interface FirmwareUpdateLogPageParams {
  taskId: number;
  key?: number;
  index?: number;
  size?: number;
}

/**
 * @description: 获取固件升级统计
 */
export function getFirmwareUpdateTotal(params: any) {
  return Alova.Get<InResult>('/firmware_log/getFirmwareUpdateTotal', {
    params,
  });
}

/**
 * @description: 获取固件升级日志分页列表
 */
export function getFirmwareUpdateLogPageList(params: FirmwareUpdateLogPageParams) {
  return Alova.Get<InResult>('/firmware_log/getFirmwareUpdateLogPageList', {
    params,
  });
}

/**
 * @description: 新增升级日志
 * @param params 固件升级日志
 * @returns 返回创建结果
 */
export function addFirmwareUpdateLog(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/firmware_log/addFirmwareUpdateLog', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}
