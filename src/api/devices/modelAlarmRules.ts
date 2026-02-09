import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义物模型告警规则接口类型
export interface ModelAlarmRulesParams {
  deviceId?: string;
  productId?: string;
  identity?: string;
}
export interface ModelAlarmRulesPageParams {
  deviceId?: string;
  productId?: string;
  identity?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取物模型告警规则列表
 */
export function getModelAlarmRulesList(params: ModelAlarmRulesParams) {
  return Alova.Get<InResult>('/modelAlarmRules/getModelAlarmRulesList', {
    params,
  });
}

/**
 * @description: 获取物模型告警规则分页列表
 */
export function getModelAlarmRulesPageList(params: ModelAlarmRulesPageParams) {
  return Alova.Get<InResult>('/modelAlarmRules/getModelAlarmRulesPageList', {
    params,
  });
}

/**
 * @description: 根据ID获取物模型告警规则
 */
export function getModelAlarmRules(params: { id: number }) {
  return Alova.Get<InResult>('/modelAlarmRules/getModelAlarmRules', {
    params,
  });
}

/**
 * @description: 新增物模型告警规则
 * @param params 物模型告警规则信息
 * @returns 返回创建结果
 */
export function addModelAlarmRules(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/modelAlarmRules/addModelAlarmRules', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑物模型告警规则
 * @param params 物模型告警规则信息
 * @returns 返回创建结果
 */
export function editModelAlarmRules(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/modelAlarmRules/editModelAlarmRules', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个物模型告警规则
 */
export function delModelAlarmRules(params: { id: number }) {
  return Alova.Get<InResult>('/modelAlarmRules/delModelAlarmRules', {
    params,
  });
}

/**
 * @description: 批量删除物模型告警规则
 */
export function delModelAlarmRulesIds(params: { ids: string }) {
  return Alova.Get<InResult>('/modelAlarmRules/delModelAlarmRulesIds', {
    params,
  });
}
