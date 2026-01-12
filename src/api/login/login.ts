import { Alova } from '@/utils/http/alova/index';
import { RequestBody } from 'alova';

/**
 * 获取登录Code
 * @param params 请求参数
 * @returns 返回数据
 */
export function getLoginCode(params: { appId: string | undefined }) {
  return Alova.Get<InResult>('/login/getLoginCode', {
    params,
  });
}

/**
 * 用户登录
 * @param params 请求参数
 * @returns 返回数据
 */
export function chkLogin(params: RequestBody | undefined) {
  return Alova.Post<InResult>('/login/chkLogin', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * 用户登出
 * @param params 请求参数
 * @returns 返回数据
 */
export function loginOut(params: { refreshToken: string | undefined }) {
  return Alova.Get<InResult>('/login/loginOut', {
    params,
  });
}
