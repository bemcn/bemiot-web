import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义视频服务器相关接口类型
export interface VideoServerParams {
  key?: string;
  status?: number;
}
export interface VideoServerPageParams {
  key?: string;
  status?: number;
  index?: number;
  size?: number;
}

/**
 * @description: 获取视频服务器列表
 */
export function getVideoServerList(params: VideoServerParams) {
  return Alova.Get<InResult>('/video_server/getVideoServerList', {
    params,
  });
}

/**
 * @description: 获取视频服务器分页列表
 */
export function getVideoServerPageList(params: VideoServerPageParams) {
  return Alova.Get<InResult>('/video_server/getVideoServerPageList', {
    params,
  });
}

/**
 * @description: 获取视频服务器
 */
export function getVideoServer(params: { id: number }) {
  return Alova.Get<InResult>('/video_server/getVideoServer', {
    params,
  });
}

/**
 * @description: 验证ID标识是否被使用
 */
export function verifyServerKey(params: { key: string }) {
  return Alova.Get<InResult>('/video_server/verifyServerKey', {
    params,
  });
}


/**
 * @description: 新增视频服务器
 * @param params 视频服务器
 * @returns 返回创建结果
 */
export function addVideoServer(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/video_server/addVideoServer', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑视频服务器
 * @param params 视频服务器
 * @returns 返回更新结果
 */
export function editVideoServer(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/video_server/editVideoServer', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 变更视频服务器状态
 */
export function videoServerStatus(params: { id: number }) {
  return Alova.Get<InResult>('/video_server/updateStatus', {
    params,
  });
}

/**
 * @description: 删除单个视频服务器
 */
export function delVideoServerById(params: { id: number }) {
  return Alova.Get<InResult>('/video_server/delVideoServer', {
    params,
  });
}

/**
 * @description: 批量删除视频服务器
 */
export function delVideoServerByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/video_server/delVideoServers', {
    params,
  });
}
