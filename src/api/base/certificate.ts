import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

// 定义证书相关接口类型
export interface CertificateParams {
  key?: string;
}
export interface CertificatePageParams {
  key?: string;
  index?: number;
  size?: number;
}

/**
 * @description: 获取证书列表
 */
export function getCertificateList(params: CertificateParams) {
  return Alova.Get<InResult>('/certificate/getCertificateList', {
    params,
  });
}

/**
 * @description: 获取证书分页列表
 */
export function getCertificatePageList(params: CertificatePageParams) {
  return Alova.Get<InResult>('/certificate/getCertificatePageList', {
    params,
  });
}

/**
 * @description: 根据ID获取证书信息
 */
export function getCertificate(params: { id: number }) {
  return Alova.Get<InResult>('/certificate/getCertificate', {
    params,
  });
}

/**
 * @description: 新增证书
 * @param params 证书信息
 * @returns 返回创建结果
 */
export function addCertificate(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/certificate/addCertificate', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 编辑证书信息
 * @param params 证书更新信息
 * @returns 返回更新结果
 */
export function editCertificate(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/certificate/editCertificate', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除单个证书
 */
export function delCertificateById(params: { id: number }) {
  return Alova.Get<InResult>('/certificate/delCertificate', {
    params,
  });
}

/**
 * @description: 批量删除证书
 */
export function delCertificateByIds(params: { ids: string }) {
  return Alova.Get<InResult>('/certificate/delCertificates', {
    params,
  });
}
