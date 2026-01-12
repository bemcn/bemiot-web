import type { GlobEnvConfig } from '/#/config';

import { warn } from '@/utils/log';
import pkg from '../../package.json';
import { getConfigFileName } from '../../build/getConfigFileName';

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// 根据版本生成缓存密钥
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = (import.meta.env.DEV
    ? // 获取全局配置（打包时将独立提取配置）
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_FILE_URL,
    VITE_GLOB_API_APP_ID,
    VITE_GLOB_API_SECRET_KEY,
    VITE_USE_MOCK,
    VITE_LOGGER_MOCK,
    AMAP_KEY,
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_FILE_URL,
    VITE_GLOB_API_APP_ID,
    VITE_GLOB_API_SECRET_KEY,
    VITE_USE_MOCK,
    VITE_LOGGER_MOCK,
    AMAP_KEY,
  };
}

/**
 * @description: 开发环境
 */
export const devMode = 'development';

/**
 * @description: 正式环境
 */
export const prodMode = 'production';

/**
 * @description: 获取环境变量
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: 判断是否开发环境
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: 判断是否正式环境
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}

/**
 * @description: 生成唯一ID(10位)
 * @returns:
 * @example:
 */
export function uniqueId(): string {
  const timestamp = Date.now();
  let hexString = timestamp.toString(16);
  // 确保是偶数长度，如果不是则在前面补0
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }
  // 显式声明 bytes 为 string[]
  const bytes: string[] = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(hexString.substring(i, i + 2)); // 使用 substring 替代 substr
  }
  // 反转字节数组并连接成字符串
  return bytes.reverse().join('').toUpperCase();
}
