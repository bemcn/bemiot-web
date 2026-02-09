import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义相关接口类型
export interface UserParams {
  roleId?: number;
  status?: number;
  filed?: string;
  key?: string;
  dateType?: number;
  startDate?: string;
  endDate?: string;
}

export interface UserPageParams {
  roleId?: number;
  status?: number;
  filed?: string;
  key?: string;
  dateType?: number;
  startDate?: string;
  endDate?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取用户列表
 */
export function getUserList(params: UserParams) {
  return Alova.Get<InResult>('/user/getUserList', { params });
}

/**
 * @description: 获取用户分页列表
 */
export function getUserPageList(params: UserPageParams) {
  return Alova.Get<InResult>('/user/getUserPageList', {
    params,
  });
}

/**
 * @description: 获取指定多个用户列表
 */
export function getUserListByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/user/getUserPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取用户信息
 */
export function getUserInfo(params: { id: number }) {
  return Alova.Get<InResult>('/user/getUser', {
    params,
  });
}

/**
 * @description: 新增用户
 * @param params 用户信息
 * @returns 返回创建结果
 */
export function addUser(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/user/addUser', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑用户信息
 * @param params 用户更新信息
 * @returns 返回更新结果
 */
export function editUser(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/user/editUser', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个用户
 */
export function deleteUserById(params: { id: number }) {
  return Alova.Get<InResult>('/user/delUser', {
    params,
  });
}

/**
 * @description: 批量删除用户
 */
export function deleteUserByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/user/delUsers', {
    params,
  });
}
