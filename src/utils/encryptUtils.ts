import CryptoJS from 'crypto-js';

/**
 * 加解密工具类
 */
export default class EncryptUtils {
  /**
   * Base64编码
   * @param str 需要编码的字符串
   * @returns 编码后的Base64字符串
   */
  base64Encode(str: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
  }

  /**
   * Base64解码
   * @param str 需要解码的Base64字符串
   * @returns 解码后的原始字符串
   */
  base64Decode(str: string): string {
    return CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8);
  }

  /**
   * MD5加密
   * @param str 需要加密的字符串
   * @returns 32位MD5加密后的字符串
   */
  md5(str: string): string {
    return CryptoJS.MD5(str).toString();
  }

  /**
   * HmacMD5加密
   * @param str 需要加密的字符串
   * @param key 密钥
   * @returns HmacMD5加密后的字符串
   */
  hmacMD5(str: string, key: string): string {
    return CryptoJS.HmacMD5(str, key).toString();
  }

  /**
   * AES加密 (CBC模式, PKCS5Padding填充)
   * @param data 需要加密的数据
   * @param key 密钥 (16位/24位/32位)
   * @param iv 偏移量 (16位)
   * @returns 加密后的字符串 (Base64格式)
   */
  aesEncrypt(data: string, key: string, iv: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  /**
   * AES解密 (CBC模式, PKCS5Padding填充)
   * @param data 需要解密的数据 (Base64格式)
   * @param key 密钥 (16位/24位/32位)
   * @param iv 偏移量 (16位)
   * @returns 解密后的原始字符串
   */
  aesDecrypt(data: string, key: string, iv: string): string {
    const decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

export const encryptUtils = new EncryptUtils();
