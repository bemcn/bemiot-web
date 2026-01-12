import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义角色相关接口类型
interface SceneGroupPageParams {
  index?: number;
  size?: number;
}

/**
 * @description: 获取场景分组列表
 */
export function getSceneGroupList() {
  return Alova.Get<InResult>('/sceneGroup/getSceneGroupList');
}

/**
 * @description: 获取场景分组分页列表
 */
export function getSceneGroupPageList(params: SceneGroupPageParams) {
  return Alova.Get<InResult>('/sceneGroup/getSceneGroupPageList', {
    params,
  });
}

/**
 * @description: 获取场景分组
 */
export function getSceneGroup(params: { id: number }) {
  return Alova.Get<InResult>('/sceneGroup/getSceneGroup', {
    params,
  });
}

/**
 * @description: 新增场景分组
 * @param params 场景分组
 * @returns 返回创建结果
 */
export function addSceneGroup(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/sceneGroup/addSceneGroup', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑场景分组
 * @param params 场景分组
 * @returns 返回更新结果
 */
export function editSceneGroup(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/sceneGroup/editSceneGroup', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 修改分组排序
 */
export function updateSceneGroupOrder(params: { id: number; orderNum: number }) {
  return Alova.Get<InResult>('/sceneGroup/updateOrderNumber', {
    params,
  });
}

/**
 * @description: 删除单个场景分组
 */
export function delSceneGroupById(params: { id: number }) {
  return Alova.Get<InResult>('/sceneGroup/delSceneGroup', {
    params,
  });
}

/**
 * @description: 批量删除场景分组
 */
export function delSceneGroupByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/sceneGroup/delSceneGroups', {
    params,
  });
}
