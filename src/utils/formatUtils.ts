export default class FormatUtils {
  /**
   * 转字符串
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  objToString(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['', 'text'];
    }
    return [valueStr, 'text'];
  }

  /**
   * 字符串转整数
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  stringToInt(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'int'];
    }
    try {
      const resultValue = parseInt(valueStr) + '';
      return [resultValue, 'int'];
    } catch (e) {
      return ['0', 'int'];
    }
  }

  /**
   * 小数转整数
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  floatToInt(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'int'];
    }

    try {
      // 将字符串转换为数字，然后转换为整数
      const numValue = Number(valueStr);
      // 检查是否为有效数字
      if (isNaN(numValue)) {
        return ['0', 'int'];
      }
      // 转换为整数（截断小数部分）
      const intValue = Math.trunc(numValue);
      return [intValue.toString(), 'int'];
    } catch (e) {
      return ['0', 'int'];
    }
  }

  /**
   * 布尔值转整数
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  boolToInt(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'int'];
    }
    // 检查字符串是否表示真值
    if (
      valueStr === 'true' ||
      valueStr === 'True' ||
      valueStr === '1' ||
      valueStr === 'Y' ||
      valueStr === 'y' ||
      valueStr.toLowerCase() === 'yes' ||
      valueStr.toLowerCase() === 't' ||
      valueStr.toLowerCase() === 'on'
    ) {
      return ['1', 'int'];
    } else {
      return ['0', 'int'];
    }
  }

  /**
   * 字符串转小数
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  stringToFloat(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'number'];
    }
    try {
      const resultValue = Number(valueStr) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 整数转小数
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  intToFloat(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'number'];
    }
    return [valueStr, 'number'];
  }

  /**
   * 字符串转Bool
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  stringToBool(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['false', 'bool'];
    }
    if (
      valueStr === 'true' ||
      valueStr === 'True' ||
      valueStr === '1' ||
      valueStr === 'Y' ||
      valueStr === 'y'
    ) {
      return ['true', 'bool'];
    } else {
      return ['false', 'bool'];
    }
  }

  /**
   * 整数转布尔值
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  intToBool(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['false', 'bool'];
    }
    if (valueStr === '1') {
      return ['true', 'bool'];
    } else {
      return ['false', 'bool'];
    }
  }

  /**
   * 十六进制字符串转整数
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  bytesToInt(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'number'];
    }

    try {
      // 移除可能存在的0x前缀
      let hexStr = valueStr.toLowerCase();
      if (hexStr.startsWith('0x')) {
        hexStr = hexStr.substring(2);
      }

      // 检查是否是有效的十六进制字符串
      if (!/^[0-9a-f]+$/.test(hexStr)) {
        return ['0', 'number'];
      }

      // 将十六进制转换为十进制整数
      const resultValue = parseInt(hexStr, 16) + '';
      return [resultValue, 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 整数转16进制字符串
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  intToBytes(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'text'];
    }
    try {
      // 将字符串转换为整数
      const intValue = parseInt(valueStr, 10);
      // 检查是否为有效数字
      if (isNaN(intValue)) {
        return ['0', 'text'];
      }
      // 将整数转换为十六进制字符串
      const hexValue = intValue.toString(16);
      return [hexValue, 'text'];
    } catch (e) {
      return ['0', 'text'];
    }
  }

  /**
   * 十六进制字符串转小数
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  bytesToFloat(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'number'];
    }

    try {
      // 移除可能存在的0x前缀
      let hexStr = valueStr.toLowerCase();
      if (hexStr.startsWith('0x')) {
        hexStr = hexStr.substring(2);
      }

      // 检查是否是有效的十六进制字符串
      if (!/^[0-9a-f]+$/.test(hexStr)) {
        return ['0', 'number'];
      }

      // 如果十六进制表示的是IEEE 754格式的浮点数，则需要特殊处理
      // 先解析为整数，然后按照IEEE 754标准转换为浮点数

      // 将十六进制字符串转换为整数
      const intValue = parseInt(hexStr, 16);

      // 根据十六进制字符串长度确定是单精度还是双精度
      let floatVal: number;
      if (hexStr.length <= 8) {
        // 单精度浮点数（32位）
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setUint32(0, intValue);
        floatVal = view.getFloat32(0);
      } else {
        // 双精度浮点数（64位）
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);

        // 对于超过32位的十六进制，我们需要特别处理
        if (hexStr.length > 8) {
          // 截取后8位（32位）进行转换
          const last8Chars = hexStr.slice(-8);
          const highPart = parseInt(last8Chars, 16);
          view.setUint32(0, highPart);
          floatVal = view.getFloat32(0);
        } else {
          // 将十六进制字符串填充到8位（32位）
          const paddedHex = hexStr.padStart(8, '0').slice(-8);
          const intVal = parseInt(paddedHex, 16);
          view.setUint32(0, intVal);
          floatVal = view.getFloat32(0);
        }
      }

      return [floatVal + '', 'number'];
    } catch (e) {
      return ['0', 'number'];
    }
  }

  /**
   * 小数转16进制字符串
   * @param valueStr 待转换字符串
   * @returns 转换结果
   */
  floatToBytes(valueStr: string | null): string[] {
    if (valueStr === null || valueStr === '') {
      return ['0', 'text'];
    }
    try {
      // 将字符串转换为数字
      const floatValue = Number(valueStr);
      // 检查是否为有效数字
      if (isNaN(floatValue)) {
        return ['0', 'text'];
      }
      // 创建一个ArrayBuffer和DataView来处理浮点数的二进制表示
      const buffer = new ArrayBuffer(4); // 单精度浮点数需要4字节
      const view = new DataView(buffer);
      // 将浮点数写入buffer
      view.setFloat32(0, floatValue);
      // 从buffer中读取32位无符号整数
      const intBits = view.getUint32(0);
      // 将整数转换为十六进制字符串
      const hexValue = intBits.toString(16);
      return [hexValue, 'text'];
    } catch (e) {
      return ['0', 'text'];
    }
  }

  conversionString(data: any, inputNode: any): string[] {
    const func = data.func;
    const inputValue = inputNode.properties.outputValue || '';

    if (func === 'stringToInt') {
      return this.stringToInt(inputValue);
    } else if (func === 'stringToFloat') {
      return this.stringToFloat(inputValue);
    } else if (func === 'stringToBool') {
      return this.stringToBool(inputValue);
    } else if (func === 'byteToInt') {
      return this.bytesToInt(inputValue);
    } else if (func === 'byteToFloat') {
      return this.bytesToFloat(inputValue);
    } else {
      return [inputValue, 'text'];
    }
  }
  conversionInt(data: any, inputNode: any): string[] {
    const func = data.func;
    const inputValue = inputNode.properties.outputValue || '';

    if (func === 'intToString') {
      return this.objToString(inputValue);
    } else if (func === 'intToFloat') {
      return this.intToFloat(inputValue);
    } else if (func === 'intToBool') {
      return this.intToBool(inputValue);
    } else if (func === 'intToByte') {
      return this.intToBytes(inputValue);
    } else {
      return [inputValue, 'int'];
    }
  }

  conversionNumber(data: any, inputNode: any): string[] {
    const func = data.func;
    const inputValue = inputNode.properties.outputValue || '';

    if (func === 'floatToString') {
      return this.objToString(inputValue);
    } else if (func === 'floatToInt') {
      return this.floatToInt(inputValue);
    } else if (func === 'floatToByte') {
      return this.floatToBytes(inputValue);
    } else {
      return [inputValue, 'text'];
    }
  }

  conversionBool(data: any, inputNode: any): string[] {
    const func = data.func;
    const inputValue = inputNode.properties.outputValue || '';

    if (func === 'boolToString') {
      return this.objToString(inputValue);
    } else if (func === 'boolToInt') {
      return this.boolToInt(inputValue);
    } else {
      return [inputValue, 'text'];
    }
  }
}

export const formatUtils = new FormatUtils();
