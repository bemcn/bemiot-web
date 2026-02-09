export default class MathUtil {
  /**
   * 计算正弦值
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static sin(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.sin(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 计算余弦值
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static cos(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.cos(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 角度转换为弧度
   * @param valueStr 角度
   * @returns 返回计算值
   */
  static toRadians(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const toValue = value * (Math.PI / 180);
      const resultValue = toValue + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 弧度转换为角度
   * @param valueStr 弧度
   * @returns 返回计算值
   */
  static toDegrees(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const toValue = value * (180 / Math.PI);
      const resultValue = toValue + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 反正弦
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static asin(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.asin(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 反余弦
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static acos(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.acos(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 反正切
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static atan(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.atan(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * e的指定次方
   * @param valueStr e参
   * @returns 返回计算值
   */
  static exp(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.exp(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 自然底数
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static log(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.log(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 以10为底的对数
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static log10(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.log10(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 指定数的n次方
   * @param valueStr 待计算入参
   * @param numStr 指定次方
   * @returns 返回计算值
   */
  static pow(valueStr: string | null, numStr?: string): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const num = Number(numStr);
      const resultValue = Math.pow(value, num) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 开方
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static sqrt(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.sqrt(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 向上进位取整
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static ceil(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.ceil(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 舍掉小数取整
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static floor(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.floor(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 四舍五入保留整数
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static round(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.round(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 四舍五入保留指定小数位数
   * @param valueStr 待计算入参
   * @param numStr 小数位数
   * @returns 返回计算值
   */
  static roundFloat(valueStr: string | null, numStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    if (numStr === null || numStr === '') {
      numStr = '0';
    }
    try {
      const value = parseFloat(valueStr);
      let num = Number(numStr);
      if (num > 8) {
        num = 8;
      }
      const resultValue = Number(value.toFixed(num)) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 两者中最小数
   * @param valueStr1 待计算入参1
   * @param valueStr2 待计算入参2
   * @returns 返回计算值
   */
  static min(valueStr1: string | null, valueStr2: string | null): string[] {
    if (valueStr1 === null || valueStr1 === '') {
      return ['', 'number'];
    }
    if (valueStr2 === null || valueStr2 === '') {
      return ['', 'number'];
    }
    try {
      const value1 = Number(valueStr1);
      const value2 = Number(valueStr2);
      const resultValue = Math.min(value1, value2) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 两者中最大数
   * @param valueStr1 待计算入参1
   * @param valueStr2 待计算入参2
   * @returns 返回计算值
   */
  static max(valueStr1: string | null, valueStr2: string | null): string[] {
    if (valueStr1 === null || valueStr1 === '') {
      return ['', 'number'];
    }
    if (valueStr2 === null || valueStr2 === '') {
      return ['', 'number'];
    }
    try {
      const value1 = Number(valueStr1);
      const value2 = Number(valueStr2);
      const resultValue = Math.max(value1, value2) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 绝对值
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  static abs(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'number'];
    }
    try {
      const value = Number(valueStr);
      const resultValue = Math.abs(value) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 两点间的距离
   * @param valueStr1 待计算入参1
   * @param valueStr2 待计算入参2
   * @returns 返回计算值
   */
  static hypot(valueStr1: string | null, valueStr2: string | null): string[] {
    if (valueStr1 === null || valueStr1 === '') {
      return ['', 'number'];
    }
    if (valueStr2 === null || valueStr2 === '') {
      return ['', 'number'];
    }
    try {
      const value1 = Number(valueStr1);
      const value2 = Number(valueStr2);
      const resultValue = Math.hypot(value1, value2) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }
}

export const mathUtil = new MathUtil();
