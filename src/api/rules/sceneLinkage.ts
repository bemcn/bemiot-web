import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义场景联动相关接口类型
export interface SceneLinkageParams {
  sceneGroupId?: number;
  key?: string;
}
export interface SceneLinkagePageParams {
  sceneGroupId?: number;
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取场景联动列表
 */
export function getSceneLinkageList(params: SceneLinkageParams) {
  return Alova.Get<InResult>('/sceneLinkage/getSceneLinkageList', {
    params,
  });
}

/**
 * @description: 获取场景联动分页列表
 */
export function getSceneLinkagePageList(params: SceneLinkagePageParams) {
  return Alova.Get<InResult>('/sceneLinkage/getSceneLinkagePageList', {
    params,
  });
}

/**
 * @description: 获取场景联动
 */
export function getSceneLinkage(params: { id: number }) {
  return Alova.Get<InResult>('/sceneLinkage/getSceneLinkage', {
    params,
  });
}

/**
 * @description: 新增场景联动
 * @param params 场景联动
 * @returns 返回创建结果
 */
export function addSceneLinkage(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/sceneLinkage/addSceneLinkage', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑场景联动
 * @param params 场景联动
 * @returns 返回更新结果
 */
export function editSceneLinkage(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/sceneLinkage/editSceneLinkage', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 修改场景联动状态
 */
export function updateStatus(params: { id: number; status: number }) {
  return Alova.Get<InResult>('/sceneLinkage/updateStatus', {
    params,
  });
}

/**
 * @description: 删除单个场景联动
 */
export function delSceneLinkageById(params: { id: number }) {
  return Alova.Get<InResult>('/sceneLinkage/delSceneLinkage', {
    params,
  });
}

/**
 * @description: 批量删除场景联动
 */
export function delSceneLinkageByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/sceneLinkage/delSceneLinkages', {
    params,
  });
}
