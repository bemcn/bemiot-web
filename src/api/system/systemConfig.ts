import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

/**
 * @description: 获取字典信息列表
 */
export function getConfigParams(params: { group: string }): Object {
  return Alova.Get<InResult>('/conf/getConfigParams', {
    params,
  });
}

/**
 * @description: 获取指定KEY的值
 */
export function getConfigValue(params: { key: string }): Object {
  return Alova.Get<InResult>('/conf/getConfigValue', {
    params,
  });
}

/**
 * @description: 获取多个KEY的值
 */
export function getConfigValues(params: { keys: string }): Object {
  return Alova.Get<InResult>('/conf/getConfigValues', {
    params,
  });
}

/**
 * 编辑配置参数
 * @param params 请求参数
 * @returns 返回数据
 */
export function editConfig(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/conf/editConfig', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}
