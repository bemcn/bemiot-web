import { createAlova, RequestBody } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { isString } from 'lodash-es';
import { storage } from '@/utils/Storage';
import { useGlobSetting } from '@/hooks/setting';
import { PageEnum } from '@/enums/pageEnum';
import { signUtils } from '@/utils/http/signUtils';
import { isUrl } from '@/utils';

const { apiUrl, urlPrefix } = useGlobSetting();

const noSignUrl = [
  '/login/getLoginCode',
  '/login/chkLogin',
  '/getAccessToken',
  '/existAccessToken',
  '/refreshAccessToken',
  '/verifyToken',
  '/deleteToken',
];

export const Alova = createAlova({
  baseURL: apiUrl,
  statesHook: VueHook,
  // 关闭全局请求缓存
  // 完全关闭全局请求缓存
  cacheFor: null,
  // 在开发环境开启缓存命中日志
  cacheLogger: process.env.NODE_ENV === 'development',
  requestAdapter: adapterFetch(),
  beforeRequest(method) {
    if (!noSignUrl.includes(method.url)) {
      let params: RequestBody | undefined;
      if (method.type === 'GET' && method.config.params) {
        params = method.config.params;
      } else {
        params = method.data;
      }
      const header = signUtils.createHeader(params ?? {});
      for (const key in header) {
        const val = header[key];
        method.config.headers[key] = val;
      }
    }

    // 禁用 HTTP 缓存
    method.config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    method.config.headers['Pragma'] = 'no-cache';
    method.config.headers['Expires'] = '0';

    // 为 GET 请求添加时间戳参数以防止缓存
    if (method.type === 'GET') {
      const separator = method.url.includes('?') ? '&' : '?';
      method.url += `${separator}_t=${Date.now()}`;
    } else if (method.type === 'POST') {
      method.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

      if (method.data && typeof method.data === 'object' && !(method.data instanceof FormData)) {
        const formData = new URLSearchParams();
        for (const key in method.data) {
          if (method.data.hasOwnProperty(key)) {
            formData.append(key, method.data[key]);
          }
        }
        method.data = formData.toString();
      }
    }

    // 处理 api 请求前缀
    const isUrlStr = isUrl(method.url as string);
    if (!isUrlStr && urlPrefix) {
      method.url = `${urlPrefix}${method.url}`;
    }
    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      method.url = `${apiUrl}${method.url}`;
    }
  },
  responded: {
    onSuccess: async (response) => {
      const res = (response.json && (await response.json())) || response.body;

      // @ts-ignore
      const Message = window.$message;
      // @ts-ignore
      const Modal = window.$dialog;

      const LoginPath = PageEnum.BASE_LOGIN;
      // 需要登录
      if (res.code === 1060) {
        Modal?.warning({
          title: '提示',
          content: '登录身份已失效，请重新登录!',
          positiveText: '确定',
          closable: false,
          maskClosable: false,
          onPositiveClick: async () => {
            storage.clear();
            window.location.href = LoginPath;
          },
        });
      } else {
        return res;
      }
    },
  },
});

// 项目，多个不同 api 地址，可导出多个实例
// export const AlovaTwo = createAlova({
//   baseURL: 'http://localhost:9001',
// });
