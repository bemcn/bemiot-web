import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义相关接口类型
export interface BlacklistParams {
  key?: string;
}

export interface BlacklistPageParams {
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取黑名单列表
 */
export function getBlacklistList(params: BlacklistParams) {
  return Alova.Get<InResult>('/blacklist/getBlacklistList', { params });
}

/**
 * @description: 获取黑名单分页列表
 */
export function getBlacklistPageList(params: BlacklistPageParams) {
  return Alova.Get<InResult>('/blacklist/getBlacklistPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取黑名单信息
 */
export function getBlacklist(params: { id: number }) {
  return Alova.Get<InResult>('/blacklist/getBlacklist', {
    params,
  });
}

/**
 * @description: 新增黑名单
 * @param params 黑名单信息
 * @returns 返回创建结果
 */
export function addBlacklist(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/blacklist/addBlacklist', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑黑名单信息
 * @param params 黑名单更新信息
 * @returns 返回更新结果
 */
export function editBlacklist(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/blacklist/editBlacklist', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个黑名单
 */
export function delBlacklistById(params: { id: number }) {
  return Alova.Get<InResult>('/blacklist/delBlacklist', {
    params,
  });
}

/**
 * @description: 批量删除黑名单
 */
export function delBlacklistByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/blacklist/delBlacklists', {
    params,
  });
}
