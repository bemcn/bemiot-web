import { defineStore } from 'pinia';
import { store } from '@/store';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TIME_OUT,
  CURRENT_USER,
  PERMISSIONS,
  AUTO_LOGIN,
  IS_SCREENLOCKED,
} from '@/store/mutation-types';
import { useGlobSetting } from '@/hooks/setting';

import { getUserInfo as getUserInfoApi } from '@/api/system/user';
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
    async login(params: any, autoLogin: boolean) {
      const result = await chkLogin(params);
      if (result.status === 'success') {
        const { data } = result;
        let ex = 7000;
        if (autoLogin) {
          ex = 2591800;
        }
        const exTimer = ex * 1000;
        const timestamp = new Date().getTime() + exTimer;

        storage.set(ACCESS_TOKEN, data.accessToken, ex);
        storage.set(REFRESH_TOKEN, data.refreshToken, ex);
        storage.set(TIME_OUT, timestamp);
        storage.set(CURRENT_USER, data.user, ex);
        storage.set(PERMISSIONS, data.permissions, ex);
        storage.set(AUTO_LOGIN, autoLogin);
        storage.set(IS_SCREENLOCKED, false);
        if (autoLogin) {
          storage.setCookie(ACCESS_TOKEN, data.accessToken, ex);
        }
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
      const autoLogin = storage.get(AUTO_LOGIN, false);
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
      if (!autoLogin) {
        storage.removeCookie(ACCESS_TOKEN);
      }
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
