import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义产品相关接口类型
export interface ProductParams {
  classId?: number;
  types?: number;
  netMethod?: number;
  status?: number;
  driveCode?: string;
  filed?: string;
  key?: string;
  startDate?: number;
  endDate?: number;
}
export interface ProductPageParams {
  classId?: number;
  types?: number;
  netMethod?: number;
  status?: number;
  driveCode?: string;
  filed?: string;
  key?: string;
  startDate?: number;
  endDate?: number;
  index?: number;
  size?: number;
}

/**
 * @description: 获取产品列表
 */
export function getProductList(params: ProductParams) {
  return Alova.Get<InResult>('/product/getProductList', {
    params,
  });
}

/**
 * @description: 获取产品分页列表
 */
export function getProductPageList(params: ProductPageParams) {
  return Alova.Get<InResult>('/product/getProductPageList', {
    params,
  });
}

/**
 * @description: 获取产品树
 */
export function getProductTree() {
  return Alova.Get<InResult>('/product/getProductTree');
}

/**
 * @description: 根据ID获取产品信息
 */
export function getProduct(params: { id: number }) {
  return Alova.Get<InResult>('/product/getProduct', {
    params,
  });
}

/**
 * @description: 新增产品
 * @param params 产品信息
 * @returns 返回创建结果
 */
export function addProduct(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/product/addProduct', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑产品信息
 * @param params 产品更新信息
 * @returns 返回更新结果
 */
export function editProduct(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/product/editProduct', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 转移产品分类
 * @param params 产品更新信息
 * @returns 返回更新结果
 */
export function transProductClass(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/product/transProductClass', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 修改产品状态
 */
export function editProductStatus(params: { id: number; status: number }) {
  return Alova.Get<InResult>('/product/editProductStatus', {
    params,
  });
}

/**
 * @description: 删除单个产品
 */
export function delProductById(params: { id: number }) {
  return Alova.Get<InResult>('/product/delProduct', {
    params,
  });
}

/**
 * @description: 批量删除产品
 */
export function delProductByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/product/delProducts', {
    params,
  });
}
