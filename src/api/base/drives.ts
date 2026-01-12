import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义驱动相关接口类型
export interface DriveParams {
  status?: number;
  filed?: string;
  key?: string;
  startDate?: string;
  endDate?: string;
}
export interface DrivePageParams {
  status?: number;
  filed?: string;
  key?: string;
  startDate?: string;
  endDate?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取驱动列表
 */
export function getDriveList(params: DriveParams) {
  return Alova.Get<InResult>('/drive/getDriveList', {
    params,
  });
}

/**
 * @description: 获取驱动分页列表
 */
export function getDrivePageList(params: DrivePageParams) {
  return Alova.Get<InResult>('/drive/getDrivePageList', {
    params,
  });
}

/**
 * @description: 根据ID获取驱动信息
 */
export function getDrive(params: { driveCode: string }) {
  return Alova.Get<InResult>('/drive/getDrive', {
    params,
  });
}

/**
 * @description: 新增驱动
 * @param params 驱动信息
 * @returns 返回创建结果
 */
export function addDrives(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/drive/addDrive', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑驱动信息
 * @param params 驱动更新信息
 * @returns 返回更新结果
 */
export function editDrive(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/drive/editDrive', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 启动
 */
export function startDrive(params: { driveCode: string }) {
  return Alova.Get<InResult>('/drive/startDrive', {
    params,
  });
}

/**
 * @description: 停止
 */
export function stopDrive(params: { driveCode: string }) {
  return Alova.Get<InResult>('/drive/stopDrive', {
    params,
  });
}

/**
 * @description: 删除单个驱动
 */
export function delDriveById(params: { driveCode: string }) {
  return Alova.Get<InResult>('/drive/delDrive', {
    params,
  });
}

/**
 * @description: 批量删除驱动
 */
export function delDriveByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/drive/delDrives', {
    params,
  });
}
