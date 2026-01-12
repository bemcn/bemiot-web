import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

/**
 * @description: 获取产品分类列表
 */
export function getProductClassTreeTable() {
  return Alova.Get<InResult>('/productClass/getProductClassTreeTable');
}

/**
 * @description: 获取产品分类列树
 */
export function getProductClassTree() {
  return Alova.Get<InResult>('/productClass/getProductClassTree');
}

/**
 * @description: 根据ID获取产品分类信息
 */
export function getProductClass(params: { id: number }) {
  return Alova.Get<InResult>('/productClass/getProductClass', {
    params,
  });
}

/**
 * @description: 新增产品分类
 * @param params 产品分类信息
 * @returns 返回创建结果
 */
export function addProductClass(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/productClass/addProductClass', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑产品分类信息
 * @param params 产品分类更新信息
 * @returns 返回更新结果
 */
export function editProductClass(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/productClass/editProductClass', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 更新产品分类排序
 */
export function updateProductClassOrder(params: { id: number; orderNum: number }) {
  return Alova.Get<InResult>('/productClass/updateOrderNumber', {
    params,
  });
}

/**
 * @description: 删除单个产品分类
 */
export function delProductClassById(params: { id: number }) {
  return Alova.Get<InResult>('/productClass/delProductClass', {
    params,
  });
}
