import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义产品相关接口类型
export interface ProductModelParams {
  productId: number;
  identity?: string;
  name?: string;
  type?: number;
}

/**
 * @description: 获取产品物模型列表
 */
export function getProductModelList(params: ProductModelParams) {
  return Alova.Get<InResult>('/productModel/getProductModelList', {
    params,
  });
}

/**
 * @description: 新增产品物模型
 * @param params 产品物模型信息
 * @returns 返回创建结果
 */
export function addProductModels(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/productModel/addProductModels', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个产品物模型
 */
export function delProductModelById(params: { id: number }) {
  return Alova.Get<InResult>('/productModel/delProductModel', {
    params,
  });
}

/**
 * @description: 批量删除产品物模型
 */
export function delProductModelByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/productModel/delProductModels', {
    params,
  });
}
