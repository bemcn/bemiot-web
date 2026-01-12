import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 刷新AccessToken
 */
export function refreshAccessToken(params: { refreshToken: string | undefined }): Object {
  return Alova.Post<InResult>('/refreshAccessToken', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 验证AccessToken
 */
export function verifyToken(params: { accessToken: string | undefined }): Object {
  return Alova.Get<InResult>('/verifyToken', {
    params,
  });
}

/**
 * @description: 删除AccessToken
 */
export function deleteToken(params: {
  refreshToken: string | undefined;
  refreshToke: string | undefined;
}): Object {
  return Alova.Get('/deleteToken', {
    params,
  });
}
