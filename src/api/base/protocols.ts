import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';
import { Protocols, PageProtocols } from '@/types/BaseModel';

// 定义通讯协议相关接口类型
export interface ProtocolsPageParams {
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取通讯协议列表
 */
export function getProtocolsList() {
  return Alova.Get<InResult>('/protocols/getProtocolsList');
}

/**
 * @description: 获取通讯协议分页列表
 */
export function getProtocolsPageList(params: ProtocolsPageParams) {
  return Alova.Get<InResult>('/protocols/getProtocolsPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取通讯协议信息
 */
export function getProtocols(params: { id: number }) {
  return Alova.Get<InResult>('/protocols/getProtocols', {
    params,
  });
}

/**
 * @description: 新增通讯协议
 * @param params 通讯协议信息
 * @returns 返回创建结果
 */
export function addProtocols(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/protocols/addProtocols', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑通讯协议信息
 * @param params 通讯协议更新信息
 * @returns 返回更新结果
 */
export function editProtocols(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/protocols/editProtocols', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个通讯协议
 */
export function delProtocolsById(params: { id: number }) {
  return Alova.Get<InResult>('/protocols/delProtocols', {
    params,
  });
}

/**
 * @description: 批量删除通讯协议
 */
export function delProtocolsByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/protocols/delProtocolss', {
    params,
  });
}
