import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

/**
 * @description: 获取空间位置列表
 */
export function getPositionTreeTable() {
  return Alova.Get<InResult>('/position/getPositionTreeTable');
}

/**
 * @description: 获取空间位置列树
 */
export function getPositionTree() {
  return Alova.Get<InResult>('/position/getPositionTree');
}

/**
 * @description: 根据ID获取空间位置信息
 */
export function getPosition(params: { id: number }) {
  return Alova.Get<InResult>('/position/getPosition', {
    params,
  });
}

/**
 * @description: 新增空间位置
 * @param params 空间位置信息
 * @returns 返回创建结果
 */
export function addPosition(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/position/addPosition', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑空间位置信息
 * @param params 空间位置更新信息
 * @returns 返回更新结果
 */
export function editPosition(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/position/editPosition', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 更新空间位置排序
 */
export function updatePositionOrderNumber(params: { id: number; orderNum: number }) {
  return Alova.Get<InResult>('/position/updateOrderNumber', {
    params,
  });
}

/**
 * @description: 删除单个空间位置
 */
export function delPositionById(params: { id: number }) {
  return Alova.Get<InResult>('/position/delPosition', {
    params,
  });
}

/**
 * @description: 批量删除空间位置
 */
export function delPositionByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/position/delPositions', {
    params,
  });
}
