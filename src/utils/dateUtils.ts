import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 日期具类
 */
export default class DateUtils {
  conversionByDate(inputValue: string, outputTypeId: string, outputFormat: string): string[] {
    const inputDateValue = inputValue + ' 00:00:00';
    const inputDate = new Date(inputDateValue);

    let outputValue = inputValue;
    let valueType = 'text';
    if (outputTypeId === 'year') {
      if (outputFormat === 'yyyy') {
        outputValue = inputDate.getFullYear() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getFullYear() + '年';
        valueType = 'text';
      }
    } else if (outputTypeId === 'month') {
      const month = inputDate.getMonth() + 1;
      if (outputFormat === 'MM') {
        outputValue = month + '';
        valueType = 'int';
      } else {
        outputValue = month + '月';
        valueType = 'text';
      }
    } else if (outputTypeId === 'day') {
      if (outputFormat === 'dd') {
        outputValue = inputDate.getDate() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getDate() + '日';
        valueType = 'text';
      }
    } else if (outputTypeId === 'week') {
      if (outputFormat === 'weekNumber') {
        outputValue = format(inputDate, 'i');
        valueType = 'int';
      } else if (outputFormat === 'weekEn') {
        outputValue = format(inputDate, 'EEEE');
        valueType = 'text';
      } else {
        outputValue = format(inputDate, 'EEEE', { locale: zhCN });
        valueType = 'text';
      }
    } else if (outputTypeId === 'hour') {
      if (outputFormat === 'HH') {
        outputValue = inputDate.getHours() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getHours() + '时';
        valueType = 'text';
      }
    } else if (outputTypeId === 'minute') {
      if (outputFormat === 'mm') {
        outputValue = inputDate.getMinutes() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getMinutes() + '分';
        valueType = 'text';
      }
    } else if (outputTypeId === 'second') {
      if (outputFormat === 'ss') {
        outputValue = inputDate.getSeconds() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getSeconds() + '秒';
        valueType = 'text';
      }
    } else if (outputTypeId === 'date' || outputTypeId === 'datetime') {
      outputValue = format(inputDate, outputFormat);
      valueType = 'text';
    } else if (outputTypeId === 'timestamp') {
      outputValue = inputDate.getTime() + '';
      valueType = 'number';
    }
    return [outputValue, valueType];
  }
  conversionByDateTime(inputValue: string, outputTypeId: string, outputFormat: string): string[] {
    const inputDate = new Date(inputValue);

    let outputValue = inputValue;
    let valueType = 'text';
    if (outputTypeId === 'year') {
      if (outputFormat === 'yyyy') {
        outputValue = inputDate.getFullYear() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getFullYear() + '年';
        valueType = 'text';
      }
    } else if (outputTypeId === 'month') {
      const month = inputDate.getMonth() + 1;
      if (outputFormat === 'MM') {
        outputValue = month + '';
        valueType = 'int';
      } else {
        outputValue = month + '月';
        valueType = 'text';
      }
    } else if (outputTypeId === 'day') {
      if (outputFormat === 'dd') {
        outputValue = inputDate.getDate() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getDate() + '日';
        valueType = 'text';
      }
    } else if (outputTypeId === 'week') {
      if (outputFormat === 'weekNumber') {
        outputValue = format(inputDate, 'i');
        valueType = 'int';
      } else if (outputFormat === 'weekEn') {
        outputValue = format(inputDate, 'EEEE');
        valueType = 'text';
      } else {
        outputValue = format(inputDate, 'EEEE', { locale: zhCN });
        valueType = 'text';
      }
    } else if (outputTypeId === 'hour') {
      if (outputFormat === 'HH') {
        outputValue = inputDate.getHours() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getHours() + '时';
        valueType = 'text';
      }
    } else if (outputTypeId === 'minute') {
      if (outputFormat === 'mm') {
        outputValue = inputDate.getMinutes() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getMinutes() + '分';
        valueType = 'text';
      }
    } else if (outputTypeId === 'second') {
      if (outputFormat === 'ss') {
        outputValue = inputDate.getSeconds() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getSeconds() + '秒';
        valueType = 'text';
      }
    } else if (outputTypeId === 'date' || outputTypeId === 'datetime' || outputTypeId === 'time') {
      outputValue = format(inputDate, outputFormat);
      valueType = 'text';
    } else if (outputTypeId === 'timestamp') {
      outputValue = inputDate.getTime() + '';
      valueType = 'number';
    }
    return [outputValue, valueType];
  }
  conversionByTimestamp(inputValue: string, outputTypeId: string, outputFormat: string): string[] {
    const inputTimestamp = Number(inputValue);
    const inputDate = new Date(inputTimestamp);

    let outputValue = inputValue;
    let valueType = 'number';
    if (outputTypeId === 'year') {
      if (outputFormat === 'yyyy') {
        outputValue = inputDate.getFullYear() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getFullYear() + '年';
        valueType = 'text';
      }
    } else if (outputTypeId === 'month') {
      const month = inputDate.getMonth() + 1;
      if (outputFormat === 'MM') {
        outputValue = month + '';
        valueType = 'int';
      } else {
        outputValue = month + '月';
        valueType = 'text';
      }
    } else if (outputTypeId === 'day') {
      if (outputFormat === 'dd') {
        outputValue = inputDate.getDate() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getDate() + '日';
        valueType = 'text';
      }
    } else if (outputTypeId === 'week') {
      if (outputFormat === 'weekNumber') {
        outputValue = format(inputDate, 'i');
        valueType = 'int';
      } else if (outputFormat === 'weekEn') {
        outputValue = format(inputDate, 'EEEE');
        valueType = 'text';
      } else {
        outputValue = format(inputDate, 'EEEE', { locale: zhCN });
        valueType = 'text';
      }
    } else if (outputTypeId === 'hour') {
      if (outputFormat === 'HH') {
        outputValue = inputDate.getHours() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getHours() + '时';
        valueType = 'text';
      }
    } else if (outputTypeId === 'minute') {
      if (outputFormat === 'mm') {
        outputValue = inputDate.getMinutes() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getMinutes() + '分';
        valueType = 'text';
      }
    } else if (outputTypeId === 'second') {
      if (outputFormat === 'ss') {
        outputValue = inputDate.getSeconds() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getSeconds() + '秒';
        valueType = 'text';
      }
    } else if (outputTypeId === 'date' || outputTypeId === 'time' || outputTypeId === 'datetime') {
      outputValue = format(inputDate, outputFormat);
      valueType = 'text';
    }
    return [outputValue, valueType];
  }
  conversionByTime(inputValue: string, outputTypeId: string, outputFormat: string): string[] {
    const nowDate = new Date();
    const nowDateStr = format(nowDate, 'yyyy-MM-dd');
    const inputDateStr = nowDateStr + ' ' + inputValue;
    const inputDate = new Date(inputDateStr);

    let outputValue = inputValue;
    let valueType = 'text';
    if (outputTypeId === 'hour') {
      if (outputFormat === 'HH') {
        outputValue = inputDate.getHours() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getHours() + '时';
        valueType = 'text';
      }
    } else if (outputTypeId === 'minute') {
      if (outputFormat === 'mm') {
        outputValue = inputDate.getMinutes() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getMinutes() + '分';
        valueType = 'text';
      }
    } else if (outputTypeId === 'second') {
      if (outputFormat === 'ss') {
        outputValue = inputDate.getSeconds() + '';
        valueType = 'int';
      } else {
        outputValue = inputDate.getSeconds() + '秒';
        valueType = 'text';
      }
    } else if (outputTypeId === 'time') {
      outputValue = format(inputDate, outputFormat);
      valueType = 'text';
    }
    return [outputValue, valueType];
  }

  computeByTime(
    inputValue: string,
    timeCompare: string,
    timeValue: string,
    timeUtil: string
  ): string {
    const nowDate = new Date();
    const num = parseInt(timeValue);
    //获取yyyy-MM-dd字符串
    const nowDateStr = format(nowDate, 'yyyy-MM-dd');
    const inputDate = nowDateStr + ' ' + inputValue;
    //将inputDate字符串转为时间戳
    const inputTimestamp = new Date(inputDate).getTime();
    //生成待计算的参数
    let timeStamp = 0;
    if (timeUtil === 'hour') {
      timeStamp = num * 3600000;
    } else if (timeUtil === 'minute') {
      timeStamp = num * 60000;
    } else if (timeUtil === 'second') {
      timeStamp = num * 1000;
    } else {
      timeStamp = num;
    }
    // 计算时间戳
    let outputTimestamp = 0;
    if (timeCompare === '+') {
      outputTimestamp = inputTimestamp + timeStamp;
    } else {
      outputTimestamp = inputTimestamp - timeStamp;
    }
    // 将时间戳转为HH:mm:ss字符串
    return format(new Date(outputTimestamp), 'HH:mm:ss');
  }
  computeByDate(
    inputValue: string,
    timeCompare: string,
    timeValue: string,
    timeUtil: string
  ): string {
    const num = parseInt(timeValue);
    //获取yyyy-MM-dd字符串
    const inputDateValue = inputValue + ' 00:00:00';
    //将inputDateValue字符串转为日期
    const inputDate = new Date(inputDateValue);

    // 计算日期
    let outputData;
    if (timeCompare === '+') {
      if (timeUtil === 'year') {
        outputData = inputDate.setFullYear(inputDate.getFullYear() + num);
      } else if (timeUtil === 'month') {
        outputData = inputDate.setMonth(inputDate.getMonth() + num);
      } else if (timeUtil === 'week') {
        outputData = inputDate.setDate(inputDate.getDate() + num * 7);
      } else {
        outputData = inputDate.setDate(inputDate.getDate() + num);
      }
    } else {
      if (timeUtil === 'year') {
        outputData = inputDate.setFullYear(inputDate.getFullYear() - num);
      } else if (timeUtil === 'month') {
        outputData = inputDate.setMonth(inputDate.getMonth() - num);
      } else if (timeUtil === 'week') {
        outputData = inputDate.setDate(inputDate.getDate() - num * 7);
      } else {
        outputData = inputDate.setDate(inputDate.getDate() - num);
      }
    }
    // 将时间戳转为yyyy-MM-dd字符串
    return format(outputData, 'yyyy-MM-dd');
  }
  computeByDateTime(
    inputValue: string,
    timeCompare: string,
    timeValue: string,
    timeUtil: string
  ): string {
    const num = parseInt(timeValue);
    //将inputValue字符串转为日期
    const inputDate = new Date(inputValue);

    // 计算日期
    let outputData;
    if (timeCompare === '+') {
      if (timeUtil === 'year') {
        outputData = inputDate.setFullYear(inputDate.getFullYear() + num);
      } else if (timeUtil === 'month') {
        outputData = inputDate.setMonth(inputDate.getMonth() + num);
      } else if (timeUtil === 'day') {
        outputData = inputDate.setDate(inputDate.getDate() + num);
      } else if (timeUtil === 'week') {
        outputData = inputDate.setDate(inputDate.getDate() + num * 7);
      } else if (timeUtil === 'hour') {
        outputData = inputDate.setHours(inputDate.getHours() + num);
      } else if (timeUtil === 'minute') {
        outputData = inputDate.setMinutes(inputDate.getMinutes() + num);
      } else if (timeUtil === 'second') {
        outputData = inputDate.setSeconds(inputDate.getSeconds() + num);
      } else {
        outputData = inputDate.setMilliseconds(inputDate.getMilliseconds() + num);
      }
    } else {
      if (timeUtil === 'year') {
        outputData = inputDate.setFullYear(inputDate.getFullYear() - num);
      } else if (timeUtil === 'month') {
        outputData = inputDate.setMonth(inputDate.getMonth() - num);
      } else if (timeUtil === 'week') {
        outputData = inputDate.setDate(inputDate.getDate() - num * 7);
      } else if (timeUtil === 'day') {
        outputData = inputDate.setDate(inputDate.getDate() - num);
      } else if (timeUtil === 'hour') {
        outputData = inputDate.setHours(inputDate.getHours() - num);
      } else if (timeUtil === 'minute') {
        outputData = inputDate.setMinutes(inputDate.getMinutes() - num);
      } else if (timeUtil === 'second') {
        outputData = inputDate.setSeconds(inputDate.getSeconds() - num);
      } else {
        outputData = inputDate.setMilliseconds(inputDate.getMilliseconds() - num);
      }
    }
    // 将时间戳转为yyyy-MM-dd HH:mm:ss字符串
    return format(outputData, 'yyyy-MM-dd HH:mm:ss');
  }
  computeByTimestamp(
    inputValue: string,
    timeCompare: string,
    timeValue: string,
    timeUtil: string
  ): string {
    const num = parseInt(timeValue);
    const inputTimestamp = Number(inputValue);
    //将inputTimestamp时间戳转为日期
    const inputDate = new Date(inputTimestamp);

    // 计算日期
    let outputData;
    if (timeCompare === '+') {
      if (timeUtil === 'year') {
        outputData = inputDate.setFullYear(inputDate.getFullYear() + num);
      } else if (timeUtil === 'month') {
        outputData = inputDate.setMonth(inputDate.getMonth() + num);
      } else if (timeUtil === 'day') {
        outputData = inputDate.setDate(inputDate.getDate() + num);
      } else if (timeUtil === 'week') {
        outputData = inputDate.setDate(inputDate.getDate() + num * 7);
      } else if (timeUtil === 'hour') {
        outputData = inputDate.setHours(inputDate.getHours() + num);
      } else if (timeUtil === 'minute') {
        outputData = inputDate.setMinutes(inputDate.getMinutes() + num);
      } else if (timeUtil === 'second') {
        outputData = inputDate.setSeconds(inputDate.getSeconds() + num);
      } else {
        outputData = inputDate.setMilliseconds(inputDate.getMilliseconds() + num);
      }
    } else {
      if (timeUtil === 'year') {
        outputData = inputDate.setFullYear(inputDate.getFullYear() - num);
      } else if (timeUtil === 'month') {
        outputData = inputDate.setMonth(inputDate.getMonth() - num);
      } else if (timeUtil === 'week') {
        outputData = inputDate.setDate(inputDate.getDate() - num * 7);
      } else if (timeUtil === 'day') {
        outputData = inputDate.setDate(inputDate.getDate() - num);
      } else if (timeUtil === 'hour') {
        outputData = inputDate.setHours(inputDate.getHours() - num);
      } else if (timeUtil === 'minute') {
        outputData = inputDate.setMinutes(inputDate.getMinutes() - num);
      } else if (timeUtil === 'second') {
        outputData = inputDate.setSeconds(inputDate.getSeconds() - num);
      } else {
        outputData = inputDate.setMilliseconds(inputDate.getMilliseconds() - num);
      }
    }
    // 将时间戳转为yyyy-MM-dd HH:mm:ss字符串
    return format(outputData, 'yyyy-MM-dd HH:mm:ss');
  }
}

export const dateUtils = new DateUtils();
