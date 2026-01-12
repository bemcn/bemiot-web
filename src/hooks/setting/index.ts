import type { GlobConfig, LocalConfig } from '/#/config';

import { getAppEnvConfig } from '@/utils/env';
import { warn } from '@/utils/log';

// 这里的 useGlobSetting 用于获取全局配置，以下环境变量 带 VITE_GLOB_开头 会打包到 app.config 中去
export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_APP_ID,
    VITE_GLOB_API_SECRET_KEY,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_FILE_URL,
    AMAP_KEY,
  } = getAppEnvConfig();

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  // Take global configuration
  return {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    appId: VITE_GLOB_API_APP_ID,
    secretKey: VITE_GLOB_API_SECRET_KEY,
    fileUrl: VITE_GLOB_FILE_URL,
    amapKey: AMAP_KEY,
  };
};

// 这里的 useLocalSetting 用于获取本地配置，以下环境变量不会打包到 app.config 中去
export const useLocalSetting = (): Readonly<LocalConfig> => {
  const { VITE_USE_MOCK, VITE_LOGGER_MOCK } = import.meta.env;

  function strToBoolean(val): boolean {
    return val === 'true';
  }
  return {
    useMock: strToBoolean(VITE_USE_MOCK),
    loggerMock: strToBoolean(VITE_LOGGER_MOCK),
  };
};
