import { useGlobSetting } from '@/hooks/setting';
import { encryptUtils } from '@/utils/encryptUtils';
import { useUser } from '@/store/modules/user';
import { storage } from '@/utils/Storage';
import { ACCESS_TOKEN } from '@/store/mutation-types';

// 添加接口定义
interface HeaderParams {
  appId: string;
  type: string;
  accessToken: string;
  signMethod: string;
  sign: string;
  timestamp: number;
  v: string;
}

interface SignData {
  [key: string]: any;
}

export default class SignUtils {
  /**
   * 创建带签名的请求头
   * @param param 请求参数
   * @returns 带签名的请求头
   */
  createHeader(param: Object): HeaderParams {
    // 直接从 storage 中获取最新的 accessToken，而不是从 store 中获取可能过期的值
    const accessToken = storage.get(ACCESS_TOKEN, '');
    const timer = new Date().getTime();
    const nonceTimer = timer / 1000;
    const timestamp = parseInt(nonceTimer.toString());

    const header: HeaderParams = {
      appId: useGlobSetting().appId ?? '',
      type: 'user',
      accessToken: accessToken,
      signMethod: 'md5',
      sign: '',
      timestamp,
      v: '1.0',
    };

    const sign = this.createSign(header, param);
    header.sign = sign;
    return header;
  }

  /**
   * 签名
   * @param header 请求头
   * @param param 请求参数
   * @returns 签名
   */
  createSign(header: Object, param: Object): string {
    const dataParam: SignData = {};

    for (const p in header) {
      const val = header[p];
      if (val != null && val !== '' && p !== 'sign') {
        dataParam[p] = header[p];
      }
    }

    for (const p in param) {
      const val = param[p];
      if (val != null && val !== '' && p !== 'files' && p !== 'file') {
        dataParam[p] = param[p];
      }
    }

    // 排序
    const sortObj: SignData = {};
    Object.keys(dataParam)
      .sort()
      .forEach(function (key) {
        sortObj[key] = dataParam[key];
      });
    return this.encryptSign(sortObj);
  }

  /**
   * 签名加密
   * @param sortData 待签名数据
   * @returns 加密后签名
   */
  encryptSign(sortData: SignData): string {
    let strData = '';
    let sign = '';
    // 获取加密类型
    const signMethod = sortData.signMethod || sortData.sign_method;
    // 获取 secretKey 并提供默认值防止 undefined
    const secretKey = useGlobSetting().secretKey ?? '';

    if (!secretKey) {
      console.warn('SecretKey is missing, signature may be invalid.');
    }

    if (signMethod === 'md5') {
      strData = secretKey;
      for (const key in sortData) {
        strData += key + sortData[key];
      }
      strData += secretKey;
      sign = encryptUtils.md5(strData);
    } else {
      for (const key in sortData) {
        strData += key + sortData[key];
      }
      sign = encryptUtils.hmacMD5(strData, secretKey);
    }
    return sign;
  }
}

export const signUtils = new SignUtils();