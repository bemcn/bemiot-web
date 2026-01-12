// /src/views/api/rules/dataBridging.ts
import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义数据桥接相关接口类型
export interface DataBridgeParams {
  key?: string;
}

export interface DataBridgePageParams {
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取数据桥接列表
 */
export function getDataBridgeList(params: DataBridgeParams) {
  return Alova.Get<InResult>('/dataBridge/getDataBridgeList', {
    params,
  });
}

/**
 * @description: 获取数据桥接分页列表
 */
export function getDataBridgePageList(params: DataBridgePageParams) {
  return Alova.Get<InResult>('/dataBridge/getDataBridgePageList', {
    params,
  });
}

/**
 * @description: 根据ID获取数据桥接信息
 */
export function getDataBridge(params: { id: string }) {
  return Alova.Get<InResult>('/dataBridge/getDataBridge', {
    params,
  });
}

/**
 * @description: 新增数据桥接
 * @param params 数据桥接信息
 * @returns 返回创建结果
 */
export function addDataBridge(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/dataBridge/addDataBridge', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑数据桥接信息
 * @param params 数据桥接更新信息
 * @returns 返回更新结果
 */
export function editDataBridge(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/dataBridge/editDataBridge', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个数据桥接
 */
export function delDataBridgeById(params: { id: string }) {
  return Alova.Get<InResult>('/dataBridge/delDataBridge', {
    params,
  });
}

/**
 * @description: 批量删除数据桥接
 */
export function delDataBridgeByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/dataBridge/delDataBridges', {
    params,
  });
}
