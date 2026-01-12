import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义驱动参数相关接口类型
export interface DriveParamsParams {
  driveCode: string;
  type: number;
}

/**
 * @description: 获取驱动参数列表
 */
export function getDriveParamsList(params: DriveParamsParams) {
  return Alova.Get<InResult>('/drive_params/getDriveParamsList', {
    params,
  });
}

/**
 * @description: 根据ID获取驱动参数信息
 */
export function getDriveParams(params: { id: number }) {
  return Alova.Get<InResult>('/drive_params/getDriveParams', {
    params,
  });
}

/**
 * @description: 新增驱动参数
 * @param params 驱动参数信息
 * @returns 返回创建结果
 */
export function addDriveParams(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/drive_params/addDriveParams', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑驱动参数信息
 * @param params 驱动参数更新信息
 * @returns 返回更新结果
 */
export function editDriveParams(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/drive_params/editDriveParams', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 更新驱动参数排序
 */
export function updateDriveParamsOrder(params: { id: number; orderNum: number }) {
  return Alova.Get<InResult>('/drive_params/updateOrderNumber', {
    params,
  });
}

/**
 * @description: 删除单个驱动参数
 */
export function delDriveParamsById(params: { id: number }) {
  return Alova.Get<InResult>('/drive_params/delDriveParams', {
    params,
  });
}

/**
 * @description: 批量删除驱动参数
 */
export function delDriveParamsByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/drive_params/delDriveParamss', {
    params,
  });
}
