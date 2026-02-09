export default class FuncUtils {
  /**
   * 判断字符串是否为空
   * @param value 待判断的字符串
   * @returns 输出判断结果
   */
  isEmpty(value: string | null): string[] {
    const isEmpty = value === null || value === '';
    const resultValue = isEmpty ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断字符串是否字母
   * @param value 待判断的字符串
   * @returns 输出判断结果
   */
  isLetter(value: string | null): string[] {
    if (value === null) {
      return ['false', 'bool'];
    }
    const isLetter = /^[a-zA-Z]+$/.test(value);
    const resultValue = isLetter ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断字符串是否数字
   * @param value 待判断的字符串
   * @returns 输出判断结果
   */
  isDigtit(value: string | null): string[] {
    if (value === null) {
      return ['false', 'bool'];
    }
    const isDigit = /^\d+$/.test(value);
    const resultValue = isDigit ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断字符串是否整数
   * @param value 待判断的字符串
   * @returns 输出判断结果
   */
  isInt(value: string | null): string[] {
    if (value === null) {
      return ['false', 'bool'];
    }
    const isInteger = /^-?\d+$/.test(value);
    const resultValue = isInteger ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 两个字符串是否相等
   * @param value1 待判断的字符串1
   * @param value2 待判断的字符串2
   * @returns 输出判断结果
   */
  equals(value1: string | null, value2: string | null): string[] {
    const isEqual = value1 === value2;
    const resultValue = isEqual ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断两个字符串是否相等(区分大小写)
   * @param value1 待判断的字符串1
   * @param value2 待判断的字符串2
   * @returns 输出判断结果
   */
  equalsCase(value1: string | null, value2: string | null): string[] {
    if (value1 === null || value2 === null) {
      return ['false', 'bool'];
    }
    const isEqual = value1 === value2;
    const resultValue = isEqual ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断两个字符串是否相等(不区分大小写)
   * @param value1 待判断的字符串1
   * @param value2 待判断的字符串2
   * @returns 输出判断结果
   */
  equalsIgnoreCase(value1: string | null, value2: string | null): string[] {
    if (value1 === null || value2 === null) {
      return ['false', 'bool'];
    }
    const isEqual = value1?.toLowerCase() === value2?.toLowerCase();
    const resultValue = isEqual ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断字符串是否包含指定字符串
   * @param value 待判断的字符串
   * @param specifiedStr 指定字符串
   * @returns 输出判断结果
   */
  contains(value: string | null, specifiedStr: string | null): string[] {
    if (value === null || specifiedStr === null) {
      return ['false', 'bool'];
    }
    const doesContain = value.includes(specifiedStr);
    const resultValue = doesContain ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断字符串是否以指定字符串开头
   * @param value 待判断的字符串
   * @param specifiedStr 指定字符串
   * @returns 输出判断结果
   */
  startsWith(value: string | null, specifiedStr: string | null): string[] {
    if (value === null || specifiedStr === null) {
      return ['false', 'bool'];
    }
    const doesStartWith = value.startsWith(specifiedStr);
    const resultValue = doesStartWith ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断字符串是否以指定字符串结尾
   * @param value 待判断的字符串
   * @param specifiedStr 指定字符串
   * @returns 输出判断结果
   */
  endsWith(value: string | null, specifiedStr: string | null): string[] {
    if (value === null || specifiedStr === null) {
      return ['false', 'bool'];
    }
    const doesEndWith = value.endsWith(specifiedStr);
    const resultValue = doesEndWith ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 判断字符串1的长度是否大于字符串2的长度
   * @param value1 待判断的字符串1
   * @param value2 待判断的字符串2
   * @returns 输出判断结果
   */
  compareTo(value1: string | null, value2: string | null): string[] {
    if (value1 === null || value2 === null) {
      return ['false', 'bool'];
    }
    const isGreater = value1.length > value2.length;
    const resultValue = isGreater ? 'true' : 'false';
    return [resultValue, 'bool'];
  }

  /**
   * 获取字符串长度
   * @param value 字符串
   * @returns 输出结果
   */
  length(value: string | null): string[] {
    if (value === null || value === '') {
      return ['0', 'int'];
    }
    const resultValue = value.length + '';
    return [resultValue, 'int'];
  }

  /**
   * 获取指定位置的单个字符串
   * @param value 字符串
   * @param indexStr 指定位置序号
   * @returns 输出结果
   */
  charAt(value: string | null, indexStr: string | null): string[] {
    if (value === null || value === '') {
      return ['', 'text'];
    }
    if (indexStr === null || indexStr === '') {
      return ['', 'text'];
    }
    try {
      const n = parseInt(indexStr);
      const length = value.length;
      if (n > 0 && n < length) {
        const resultValue = value.charAt(n);
        return [resultValue, 'text'];
      } else {
        return ['', 'text'];
      }
    } catch (e) {
      return ['', 'text'];
    }
  }

  /**
   * 替换字符串
   * @param value 待替换的字符串
   * @param queryStr 要替换的字符串
   * @param replaceStr 替换的字符串
   * @returns 输出结果
   */
  replace(value: string | null, queryStr: string | null, replaceStr: string | null): string[] {
    if (value === null || value === '') {
      return ['', 'text'];
    }
    if (queryStr === null || queryStr === '') {
      return ['', 'text'];
    }
    if (replaceStr === null) {
      return ['', 'text'];
    }

    // 转义查询字符串中的特殊正则表达式字符
    const escapedQueryStr = queryStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newValue = value.replace(new RegExp(escapedQueryStr, 'g'), replaceStr);
    return [newValue, 'text'];
  }

  /**
   * 从指定位置截取字符串
   * @param value 待截取的字符串
   * @param index 起始位置
   * @param length 截取长度
   * @returns 输出结果
   */
  substring(value: string | null, index: number, length?: number): string[] {
    if (value === null || value === '') {
      return ['', 'text'];
    }

    // 处理负数索引，确保起始位置不小于0
    const startIndex = Math.max(0, index);
    // 如果起始位置超出字符串长度，返回空字符串
    if (startIndex >= value.length) {
      return ['', 'text'];
    }

    // 如果没有提供长度参数，则截取到字符串末尾
    if (length === undefined || length === null) {
      const resultValueTo = value.substring(startIndex);
      return [resultValueTo, 'text'];
    }

    // 确保截取长度不为负数，并计算结束位置
    const actualLength = Math.max(0, length);
    const endIndex = Math.min(value.length, startIndex + actualLength);

    const resultValue = value.substring(startIndex, endIndex);
    return [resultValue, 'text'];
  }

  /**
   * 计算正弦值
   * @param valueStr 待计算入参
   * @returns 返回计算值
   */
  sin(valueStr: string | null): string[] {
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
  cos(valueStr: string | null): string[] {
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
  toRadians(valueStr: string | null): string[] {
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
  toDegrees(valueStr: string | null): string[] {
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
  asin(valueStr: string | null): string[] {
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
  acos(valueStr: string | null): string[] {
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
  atan(valueStr: string | null): string[] {
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
  exp(valueStr: string | null): string[] {
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
  log(valueStr: string | null): string[] {
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
  log10(valueStr: string | null): string[] {
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
  pow(valueStr: string | null, numStr?: string): string[] {
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
  sqrt(valueStr: string | null): string[] {
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
  ceil(valueStr: string | null): string[] {
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
  floor(valueStr: string | null): string[] {
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
  round(valueStr: string | null): string[] {
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
  roundFloat(valueStr: string | null, numStr: string | null): string[] {
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
  min(valueStr1: string | null, valueStr2: string | null): string[] {
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
  max(valueStr1: string | null, valueStr2: string | null): string[] {
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
  abs(valueStr: string | null): string[] {
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
  hypot(valueStr1: string | null, valueStr2: string | null): string[] {
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

  executionString(data: any, inputNode1: any, inputNode2: any): string[] {
    const func = data.func;
    const paramValue1 = data.paramValue1;
    const paramValue2 = data.paramValue2;

    const inputValue1 = inputNode1.properties.outputValue || '';
    let inputValue2 = '';

    if (func === 'isEmpty') {
      return this.isEmpty(inputValue1);
    } else if (func === 'isLetter') {
      return this.isLetter(inputValue1);
    } else if (func === 'isDigtit') {
      return this.isDigtit(inputValue1);
    } else if (func === 'isInt') {
      return this.isInt(inputValue1);
    } else if (func === 'equals') {
      inputValue2 = inputNode2.properties.outputValue || '';
      return this.equals(inputValue1, inputValue2);
    } else if (func === 'equalsIgnoreCase') {
      inputValue2 = inputNode2.properties.outputValue || '';
      return this.equalsIgnoreCase(inputValue1, inputValue2);
    } else if (func === 'contains') {
      return this.contains(inputValue1, paramValue1);
    } else if (func === 'startsWith') {
      return this.equalsCase(inputValue1, paramValue1);
    } else if (func === 'endsWith') {
      return this.equalsCase(inputValue1, paramValue1);
    } else if (func === 'compareTo') {
      inputValue2 = inputNode2.properties.outputValue || '';
      return this.compareTo(inputValue1, inputValue2);
    } else if (func === 'length') {
      return this.length(inputValue1);
    } else if (func === 'charAt') {
      return this.charAt(inputValue1, paramValue1);
    } else if (func === 'replace') {
      return this.replace(inputValue1, paramValue1, paramValue2);
    } else if (func === 'substring') {
      return this.substring(inputValue1, paramValue1, paramValue2);
    } else if (func === 'replace') {
      return this.replace(inputValue1, paramValue1, paramValue2);
    } else {
      return [inputValue1, 'text'];
    }
  }

  executionMath = (data: any, inputNode1: any, inputNode2: any): string[] => {
    const func = data.func;
    const paramValue1 = data.paramValue1;

    const inputValue1 = inputNode1.properties.outputValue || '';
    let inputValue2 = '';

    if (func === 'sin') {
      return this.sin(inputValue1);
    } else if (func === 'cos') {
      return this.cos(inputValue1);
    } else if (func === 'toRadians') {
      return this.toRadians(inputValue1);
    } else if (func === 'toDegrees') {
      return this.toDegrees(inputValue1);
    } else if (func === 'asin') {
      return this.asin(inputValue1);
    } else if (func === 'acos') {
      return this.acos(inputValue1);
    } else if (func === 'atan') {
      return this.atan(inputValue1);
    } else if (func === 'exp') {
      return this.exp(inputValue1);
    } else if (func === 'log') {
      return this.log(inputValue1);
    } else if (func === 'log10') {
      return this.log10(inputValue1);
    } else if (func === 'pow') {
      return this.pow(inputValue1);
    } else if (func === 'sqrt') {
      return this.sqrt(inputValue1);
    } else if (func === 'ceil') {
      return this.ceil(inputValue1);
    } else if (func === 'floor') {
      return this.floor(inputValue1);
    } else if (func === 'round') {
      return this.round(inputValue1);
    } else if (func === 'roundFloat') {
      return this.roundFloat(inputValue1, paramValue1);
    } else if (func === 'min') {
      inputValue2 = inputNode2.properties.outputValue || '';
      return this.min(inputValue1, inputValue2);
    } else if (func === 'max') {
      inputValue2 = inputNode2.properties.outputValue || '';
      return this.max(inputValue1, inputValue2);
    } else if (func === 'abs') {
      return this.abs(inputValue1);
    } else if (func === 'hypot') {
      inputValue2 = inputNode2.properties.outputValue || '';
      return this.hypot(inputValue1, inputValue2);
    } else {
      return [inputValue1, 'number'];
    }
  };
}

export const funcUtils = new FuncUtils();
