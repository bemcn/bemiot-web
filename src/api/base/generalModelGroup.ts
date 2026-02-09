import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义角色相关接口类型
interface GeneralModelGroupPageParams {
  index?: number;
  size?: number;
}

/**
 * @description: 获取物模型分组列表
 */
export function getGeneralModelGroupList() {
  return Alova.Get<InResult>('/general_model_group/getGeneralModelGroupList');
}

/**
 * @description: 获取物模型分组分页列表
 */
export function getGeneralModelGroupPageList(params: GeneralModelGroupPageParams) {
  return Alova.Get<InResult>('/general_model_group/getGeneralModelGroupPageList', {
    params,
  });
}

/**
 * @description: 获取物模型分组
 */
export function getGeneralModelGroup(params: { id: number }) {
  return Alova.Get<InResult>('/general_model_group/getGeneralModelGroup', {
    params,
  });
}

/**
 * @description: 新增物模型分组
 * @param params 物模型分组
 * @returns 返回创建结果
 */
export function addGeneralModelGroup(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/general_model_group/addGeneralModelGroup', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑物模型分组
 * @param params 物模型分组
 * @returns 返回更新结果
 */
export function editGeneralModelGroup(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/general_model_group/editGeneralModelGroup', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 修改分组排序
 */
export function updateGeneralModelGroupOrder(params: { id: number; orderNum: number }) {
  return Alova.Get<InResult>('/general_model_group/updateOrderNumber', {
    params,
  });
}

/**
 * @description: 删除单个物模型分组
 */
export function delGeneralModelGroupById(params: { id: number }) {
  return Alova.Get<InResult>('/general_model_group/delGeneralModelGroup', {
    params,
  });
}

/**
 * @description: 批量删除物模型分组
 */
export function delGeneralModelGroupByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/general_model_group/delGeneralModelGroups', {
    params,
  });
}
