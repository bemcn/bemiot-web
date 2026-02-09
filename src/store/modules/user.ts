import { defineStore } from 'pinia';
import { store } from '@/store';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TIME_OUT,
  CURRENT_USER,
  PERMISSIONS,
  TABS_ROUTES,
} from '@/store/mutation-types';
import { useGlobSetting } from '@/hooks/setting';

import { getLoginCode, chkLogin, loginOut } from '@/api/login/login';
import { storage } from '@/utils/Storage';
import { encryptUtils } from '@/utils/encryptUtils';

export type UserInfoType = {
  userName: string;
  roleName: string;
  nickName: string;
  headImg: string;
};

export interface IUserState {
  accessToken: string;
  refreshToken: string;
  userName: string;
  welcome: string;
  avatar: string;
  permissions: string;
  info: UserInfoType;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    accessToken: storage.get(ACCESS_TOKEN, ''),
    refreshToken: storage.get(REFRESH_TOKEN, ''),
    userName: '',
    welcome: '',
    avatar: '',
    permissions: storage.get(PERMISSIONS, ''),
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getAccessToken(): string {
      return this.accessToken;
    },
    getRefreshToken(): string {
      return this.refreshToken;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.userName;
    },
    getPermissions(): string {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },

    // 获取登录Code
    async getCode() {
      const params = {
        appId: useGlobSetting().appId,
      };
      return await getLoginCode(params);
    },

    // 登录
    async login(params: any) {
      const result = await chkLogin(params);
      if (result.status === 'success') {
        const { data } = result;
        const exTimer = 7000 * 1000;
        const timestamp = new Date().getTime() + exTimer;
        const permissions = encryptUtils.base64Encode(data.permissions);

        const tabRoutes = {
          value: [
            {
              fullPath: '/dashboard/console',
              hash: '',
              meta: {
                title: '控制台',
                affix: true,
              },
              name: 'dashboard_console',
              params: {},
              path: '/dashboard/console',
              query: {},
            },
          ],
          expire: 1766043158040,
        };
        const tabRoutesStr =
          '{"value":"[{"fullPath":"/dashboard/console","hash":"","meta":{"title":"控制台","affix":true},"name":"dashboard_console","params":{},"path":"/dashboard/console","query":{}}]","expire":1766044179102}';

        storage.set(ACCESS_TOKEN, data.accessToken, 7200);
        storage.set(REFRESH_TOKEN, data.refreshToken, 7200);
        storage.set(TIME_OUT, timestamp, 7200);
        storage.set(CURRENT_USER, data.user);
        storage.set(PERMISSIONS, permissions);
        storage.set(TABS_ROUTES, tabRoutesStr);
        this.setAccessToken(data.accessToken);
        this.setRefreshToken(data.refreshToken);
        this.setUserInfo(data.user);
      }
      return result;
    },

    // 解析用户权限
    async parseRoleAuth() {
      if (storage.exists(PERMISSIONS)) {
        const permissions = storage.get(PERMISSIONS);
        const strRole = encryptUtils.base64Decode(permissions);
        return JSON.parse(strRole);
      } else {
        return null;
      }
    },

    // 获取指定模块的操作权限
    parseAuthByModule(key: string) {
      if (storage.exists(PERMISSIONS)) {
        try {
          const permissions = storage.get(PERMISSIONS);
          const strRole = encryptUtils.base64Decode(permissions);
          const authArray = JSON.parse(strRole);
          let auth: any = null;
          for (let i = 0; i < authArray.length; i++) {
            if (authArray[i].value === key) {
              auth = authArray[i].auths;
              break;
            }
          }
          return auth;
        } catch (e) {
          console.error('解析模块权限失败:', e);
          return null;
        }
      } else {
        return null;
      }
    },

    // 登出
    async logout() {
      const refreshToken = storage.get(REFRESH_TOKEN, '');
      const params = {
        refreshToken,
      };
      const result = await loginOut(params);
      if (result.status === 'fail') {
        console.log(result.message);
      }
      this.setPermissions([]);
      this.setUserInfo({ userName: '', roleName: '', nickName: '', headImg: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(REFRESH_TOKEN);
      storage.remove(TIME_OUT);
      storage.remove(CURRENT_USER);
      storage.remove(PERMISSIONS);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
