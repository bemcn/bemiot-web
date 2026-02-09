import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义角色相关接口类型
interface DeviceGroupPageParams {
  index?: number;
  size?: number;
}

/**
 * @description: 获取设备分组列表
 */
export function getDeviceGroupList() {
  return Alova.Get<InResult>('/device_group/getDeviceGroupList');
}

/**
 * @description: 获取设备分组分页列表
 */
export function getDeviceGroupPageList(params: DeviceGroupPageParams) {
  return Alova.Get<InResult>('/device_group/getDeviceGroupPageList', {
    params,
  });
}

/**
 * @description: 获取设备分组
 */
export function getDeviceGroup(params: { id: number }) {
  return Alova.Get<InResult>('/device_group/getDeviceGroup', {
    params,
  });
}

/**
 * @description: 新增设备分组
 * @param params 设备分组
 * @returns 返回创建结果
 */
export function addDeviceGroup(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device_group/addDeviceGroup', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑设备分组
 * @param params 设备分组
 * @returns 返回更新结果
 */
export function editDeviceGroup(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/device_group/editDeviceGroup', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 修改分组排序
 */
export function updateDeviceGroupOrder(params: { id: number; orderNum: number }) {
  return Alova.Get<InResult>('/device_group/updateOrderNumber', {
    params,
  });
}

/**
 * @description: 删除单个设备分组
 */
export function delDeviceGroupById(params: { id: number }) {
  return Alova.Get<InResult>('/device_group/delDeviceGroup', {
    params,
  });
}

/**
 * @description: 批量删除设备分组
 */
export function delDeviceGroupByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/device_group/delDeviceGroups', {
    params,
  });
}
