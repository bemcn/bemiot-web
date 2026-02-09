import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义资产属性接口类型
export interface ProductAttrParams {
  classId?: number;
  productId?: string;
  key?: string;
}
export interface ProductAttrPageParams {
  classId?: number;
  productId?: string;
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取资产属性列表
 */
export function getProductAttrList(params: ProductAttrParams) {
  return Alova.Get<InResult>('/productAttr/getProductAttrList', {
    params,
  });
}

/**
 * @description: 获取资产属性分页列表
 */
export function getProductAttrPageList(params: ProductAttrPageParams) {
  return Alova.Get<InResult>('/productAttr/getProductAttrPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取资产属性信息
 */
export function getProductAttr(params: { id: number }) {
  return Alova.Get<InResult>('/productAttr/getProductAttr', {
    params,
  });
}

/**
 * @description: 新增资产属性
 * @param params 资产属性信息
 * @returns 返回创建结果
 */
export function addProductAttr(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/productAttr/addProductAttr', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑资产属性信息
 * @param params 资产属性更新信息
 * @returns 返回更新结果
 */
export function editProductAttr(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/productAttr/editProductAttr', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个资产属性
 */
export function delProductAttrById(params: { id: number }) {
  return Alova.Get<InResult>('/productAttr/delProductAttr', {
    params,
  });
}

/**
 * @description: 批量删除资产属性
 */
export function delProductAttrByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/productAttr/delProductAttrs', {
    params,
  });
}
