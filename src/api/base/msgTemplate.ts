import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义消息模板相关接口类型
export interface MsgTemplateParams {
  scopeApp?: string;
  filed?: string;
  key?: string;
}
export interface MsgTemplatePageParams {
  scopeApp?: string;
  filed?: string;
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取消息模板列表
 */
export function getMsgTemplateList(params: MsgTemplateParams) {
  return Alova.Get<InResult>('/msgTemplate/getMsgTemplateList', {
    params,
  });
}

/**
 * @description: 获取消息模板分页列表
 */
export function getMsgTemplatePageList(params: MsgTemplatePageParams) {
  return Alova.Get<InResult>('/msgTemplate/getMsgTemplatePageList', {
    params,
  });
}

/**
 * @description: 根据ID获取消息模板信息
 */
export function getMsgTemplate(params: { id: number }) {
  return Alova.Get<InResult>('/msgTemplate/getMsgTemplate', {
    params,
  });
}

/**
 * @description: 新增消息模板
 * @param params 消息模板信息
 * @returns 返回创建结果
 */
export function addMsgTemplate(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/msgTemplate/addMsgTemplate', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑消息模板信息
 * @param params 消息模板更新信息
 * @returns 返回更新结果
 */
export function editMsgTemplate(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/msgTemplate/editMsgTemplate', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个消息模板
 */
export function delMsgTemplate(params: { id: number }) {
  return Alova.Get<InResult>('/msgTemplate/delMsgTemplate', {
    params,
  });
}

/**
 * @description: 批量删除消息模板
 */
export function delMsgTemplates(params: { ids: string }) {
  return Alova.Get<InResult>('/msgTemplate/delMsgTemplates', {
    params,
  });
}
