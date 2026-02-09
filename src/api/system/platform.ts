import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义相关接口类型
interface PlatformParams {
  accessType?: number;
  key?: string;
}

interface PlatformPageParams {
  accessType?: number;
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取第3方平台接入列表
 */
export function getPlatformList(params: PlatformParams): Object {
  return Alova.Get<InResult>('/platform/getPlatformList', {
    params,
  });
}

/**
 * @description: 获取第3方平台接入分页列表
 */
export function getPlatformPageList(params: PlatformPageParams): Object {
  return Alova.Get<InResult>('/platform/getPlatformPageList', {
    params,
  });
}

/**
 * @description: 获取第3方平台接入
 */
export function getPlatform(params: { id: string }): Object {
  return Alova.Get<InResult>('/platform/getPlatform', {
    params,
  });
}

/**
 * 编辑第3方平台接入
 * @param params 请求参数
 * @returns 返回数据
 */
export function editPlatform(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/platform/editPlatform', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑状态
 */
export function editStatus(params: { id: string }): Object {
  return Alova.Get<InResult>('/platform/editStatus', {
    params,
  });
}
