import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义通用物模型相关接口类型
export interface GeneralModelParams {
  groupId?: number;
  modelType?: number;
  filed?: string;
  key?: string;
}
export interface GeneralModelPageParams {
  groupId?: number;
  modelType?: number;
  filed?: string;
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取通用物模型列表
 */
export function getGeneralModelList(params: GeneralModelParams) {
  return Alova.Get<InResult>('/general_model/getGeneralModelList', {
    params,
  });
}

/**
 * @description: 获取通用物模型分页列表
 */
export function getGeneralModelPageList(params: GeneralModelPageParams) {
  return Alova.Get<InResult>('/general_model/getGeneralModelPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取通用物模型信息
 */
export function getGeneralModel(params: { identity: string }) {
  return Alova.Get<InResult>('/general_model/getGeneralModel', {
    params,
  });
}

/**
 * @description: 新增通用物模型
 * @param params 通用物模型信息
 * @returns 返回创建结果
 */
export function addGeneralModel(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/general_model/addGeneralModel', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑通用物模型信息
 * @param params 通用物模型更新信息
 * @returns 返回更新结果
 */
export function editGeneralModel(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/general_model/editGeneralModel', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个通用物模型
 */
export function delGeneralModelById(params: { identity: string }) {
  return Alova.Get<InResult>('/general_model/delGeneralModel', {
    params,
  });
}

/**
 * @description: 批量删除通用物模型
 */
export function delGeneralModelByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/general_model/delGeneralModels', {
    params,
  });
}
