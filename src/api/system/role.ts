import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义角色相关接口类型
interface RolePageParams {
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取角色列表
 */
export function getRoleList() {
  return Alova.Get<InResult>('/role/getRoleList');
}

/**
 * @description: 获取角色分页列表
 */
export function getRolePageList(params: RolePageParams) {
  return Alova.Get<InResult>('/role/getRolePageList', {
    params,
  });
}

/**
 * @description: 根据ID获取角色信息
 */
export function getRoleById(params: { id: number }) {
  return Alova.Get<InResult>('/role/getRole', {
    params,
  });
}

/**
 * @description: 新增角色
 * @param params 角色信息
 * @returns 返回创建结果
 */
export function addRole(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/role/addRole', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑角色信息
 * @param params 角色更新信息
 * @returns 返回更新结果
 */
export function updateRole(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/role/editRole', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑角色权限
 * @param params 角色更新权限
 * @returns 返回更新结果
 */
export function editRoleAuth(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/role/editRoleAuth', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 更新角色排序
 */
export function updateRoleOrder(params: { id: number; orderNum: number }) {
  return Alova.Get<InResult>('/role/updateOrderNumber', {
    params,
  });
}

/**
 * @description: 删除单个角色
 */
export function deleteRoleById(params: { id: number }) {
  return Alova.Get<InResult>('/role/delRole', {
    params,
  });
}

/**
 * @description: 批量删除角色
 */
export function deleteRolesByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/role/delRoles', {
    params,
  });
}
