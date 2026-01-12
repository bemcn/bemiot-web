/**
 * Cron 表达式解析工具类
 */
export class CronUtil {
  /**
   * 解析 cron 表达式并返回中文描述
   * @param cronExpression 标准的 cron 表达式，支持 5 位或 6 位（带年份）或 7 位（带秒和年）
   * @returns 中文描述字符串
   */
  static parse(cronExpression: string): string {
    const parts = cronExpression.trim().split(/\s+/);

    if (parts.length < 5 || parts.length > 7) {
      throw new Error('无效的 cron 表达式格式');
    }

    // 根据表达式长度处理不同的情况
    let minute: any, hour: any, dayOfMonth: any, month: any, dayOfWeek: any, year: any, second: any;

    if (parts.length === 7) {
      // 7位表达式：秒 分 时 日 月 周 年
      [second, minute, hour, dayOfMonth, month, dayOfWeek, year] = parts;
    } else if (parts.length === 6) {
      // 6位表达式：可能是 秒 分 时 日 月 周 或 分 时 日 月 周 年
      if (parts[0].match(/^\d+$/) && parseInt(parts[0]) < 60) {
        // 第一位是数字且小于60，认为是秒
        [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts;
      } else {
        // 否则认为最后一位是年
        [minute, hour, dayOfMonth, month, dayOfWeek, year] = parts;
      }
    } else if (parts.length === 5) {
      // 5位标准表达式：分 时 日 月 周
      [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    }

    // 组合描述
    return this.formatDescription(second, minute, hour, dayOfMonth, month, dayOfWeek, year);
  }

  /**
   * 解析单个字段
   * @param field 字段值
   * @param fieldName 字段名称
   * @param min 最小值
   * @param max 最大值
   * @param aliasFunc 别名函数
   * @returns 描述片段
   */
  private static parseField(
    field: string,
    fieldName: string,
    min: number,
    max: number,
    aliasFunc?: (value: number) => string
  ): string {
    // 处理 ? 符号，表示不指定值，通常用于日期和星期字段
    if (field === '?') {
      return '';
    }

    // 处理 * 符号，表示每（一个单位）
    if (field === '*') {
      return `每${fieldName}`;
    }

    if (field.includes('/')) {
      const [range, interval] = field.split('/');
      const intervalNum = Number(interval);

      if (isNaN(intervalNum)) {
        throw new Error(`无效的间隔值: ${interval}`);
      }

      if (range === '*' || range === '?') {
        if (intervalNum === 1) {
          return `每${fieldName}`;
        }
        return `每隔${intervalNum}${fieldName}`;
      } else {
        const [start, end] = range.split('-').map(Number);
        if (isNaN(start) || isNaN(end)) {
          throw new Error(`无效的范围值: ${range}`);
        }
        if (start < min || end > max) {
          throw new Error(`${fieldName}字段值应在 ${min}-${max} 范围内`);
        }
        return `${start}-${end}${fieldName}`;
      }
    }

    if (field.includes('-')) {
      const [start, end] = field.split('-').map(Number);
      if (isNaN(start) || isNaN(end)) {
        throw new Error(`无效的范围值: ${field}`);
      }
      if (start < min || end > max) {
        throw new Error(`${fieldName}字段值应在 ${min}-${max} 范围内`);
      }
      return `${start}-${end}${fieldName}`;
    }

    if (field.includes(',')) {
      const values = field.split(',').map((v) => {
        // 处理逗号分隔的列表中的 ? 符号
        if (v === '?') {
          return '';
        }

        // 处理单个值
        if (v === 'L') {
          if (fieldName === '日') {
            return '最后一天';
          } else if (fieldName === '周') {
            return '最后一天(周六)';
          }
        }

        // 处理带有L的值
        const lMatch = v.match(/^(\d*)L$/);
        if (lMatch) {
          const value = lMatch[1] ? Number(lMatch[1]) : null;
          if (value !== null) {
            return `最后${value}天`;
          } else {
            if (fieldName === '日') {
              return '最后一天';
            } else if (fieldName === '周') {
              return '最后一天(周六)';
            }
          }
        }

        // 处理带有W的值
        const wMatch = v.match(/^(\d+)W$/);
        if (wMatch) {
          const value = Number(wMatch[1]);
          if (value < 1 || value > 31) {
            throw new Error(`${fieldName}字段值应在 1-31 范围内`);
          }
          return `${value}号附近的工作日`;
        }

        // 处理带有#的值
        const hashMatch = v.match(/^(\d+)#(\d+)$/);
        if (hashMatch) {
          const day = Number(hashMatch[1]);
          const week = Number(hashMatch[2]);

          if (day < 0 || day > 7) {
            throw new Error(`${fieldName}字段星期值应在 0-7 范围内`);
          }

          if (week < 1 || week > 5) {
            throw new Error(`${fieldName}字段周次值应在 1-5 范围内`);
          }

          const dayAlias = aliasFunc ? aliasFunc(day) : `星期${day}`;
          return `第${week}个${dayAlias}`;
        }

        const num = Number(v);
        if (isNaN(num)) {
          throw new Error(`无效的字段值: ${v}`);
        }

        if (num < min || num > max) {
          throw new Error(`${fieldName}字段值应在 ${min}-${max} 范围内`);
        }

        // 对星期特殊处理，支持 1-7 (周一到周日) 和 0-6 (周日到周六) 两种格式
        if (fieldName === '周') {
          return this.getDayOfWeekAlias(num);
        }

        return aliasFunc ? aliasFunc(num) : `${num}`;
      });
      // 过滤空值并连接
      const filteredValues = values.filter((v) => v !== '');
      if (filteredValues.length > 0) {
        return `${filteredValues.join('、')}${fieldName}`;
      }
      return '';
    }

    // 单个值处理
    if (field === 'L') {
      if (fieldName === '日') {
        return '本月最后一日';
      } else if (fieldName === '周') {
        return '本月最后一个周六';
      }
      return `最后${fieldName}`;
    }

    if (field === 'W') {
      if (fieldName === '日') {
        return '工作日';
      }
      return `${fieldName}工作日`;
    }

    // 处理带有字母的特殊值
    const lMatch = field.match(/^(\d*)L$/);
    if (lMatch) {
      const value = lMatch[1] ? Number(lMatch[1]) : null;
      if (value !== null) {
        if (fieldName === '日') {
          return `本月倒数第${value}天`;
        }
        return `每月最后${value}${fieldName}`;
      } else {
        if (fieldName === '日') {
          return '本月最后一日';
        } else if (fieldName === '周') {
          return '本月最后一个周六';
        }
        return `最后${fieldName}`;
      }
    }

    const wMatch = field.match(/^(\d+)W$/);
    if (wMatch) {
      const value = Number(wMatch[1]);
      if (value < 1 || value > 31) {
        throw new Error(`${fieldName}字段值应在 1-31 范围内`);
      }
      return `${value}号附近的工作日`;
    }

    const hashMatch = field.match(/^(\d+)#(\d+)$/);
    if (hashMatch) {
      const day = Number(hashMatch[1]);
      const week = Number(hashMatch[2]);

      if (day < 0 || day > 7) {
        throw new Error(`${fieldName}字段星期值应在 0-7 范围内`);
      }

      if (week < 1 || week > 5) {
        throw new Error(`${fieldName}字段周次值应在 1-5 范围内`);
      }

      const dayAlias = this.getDayOfWeekAlias(day);
      return `每月第${week}个${dayAlias}`;
    }

    // 单个数值
    const value = Number(field);
    if (isNaN(value)) {
      throw new Error(`无效的字段值: ${field}`);
    }

    if (value < min || value > max) {
      throw new Error(`${fieldName}字段值应在 ${min}-${max} 范围内`);
    }

    // 对星期特殊处理，支持 1-7 (周一到周日) 和 0-6 (周日到周六) 两种格式
    if (fieldName === '周') {
      return this.getDayOfWeekAlias(value);
    }

    return aliasFunc ? aliasFunc(value) : `${value}`;
  }

  /**
   * 获取月份别名
   * @param month 月份 (1-12)
   * @returns 月份中文名称
   */
  private static getMonthAlias(month: number): string {
    const months = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    return `${months[month]}月`;
  }

  /**
   * 获取星期别名
   * @param dayOfWeek 星期 (0-6, 0表示周日) 或 (1-7, 1表示周日)
   * @returns 星期中文名称
   */
  private static getDayOfWeekAlias(dayOfWeek: number): string {
    // 处理1-7和0-6两种编号方式，都统一为0表示周日
    const normalizedDay = dayOfWeek === 7 ? 0 : dayOfWeek % 7;
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return `周${days[normalizedDay]}`;
  }

  /**
   * 格式化最终描述
   * @returns 完整描述
   */
  private static formatDescription(
    second: string | undefined,
    minute: string | undefined,
    hour: string | undefined,
    dayOfMonth: string | undefined,
    month: string | undefined,
    dayOfWeek: string | undefined,
    year: string
  ): string {
    // 处理特殊情况：如果没有任何部分，则返回默认值
    if (!second && !minute && !hour && !dayOfMonth && !month && !dayOfWeek) {
      return '每分钟执行一次';
    }

    // 处理秒字段
    let secondDesc = '';
    if (second) {
      secondDesc = this.parseField(second, '秒', 0, 59);
    }

    // 处理分钟字段
    let minuteDesc = '';
    if (minute) {
      minuteDesc = this.parseField(minute, '分', 0, 59);
    }

    // 处理小时字段
    let hourDesc = '';
    if (hour) {
      hourDesc = this.parseField(hour, '时', 0, 23);
    }

    // 处理日期字段
    let dayDesc = '';
    if (dayOfMonth) {
      dayDesc = this.parseField(dayOfMonth, '日', 1, 31);
    }

    // 处理月份字段
    let monthDesc = '';
    if (month) {
      monthDesc = this.parseField(month, '月', 1, 12, this.getMonthAlias);
    }

    // 处理星期字段
    let weekDesc = '';
    if (dayOfWeek) {
      weekDesc = this.parseField(dayOfWeek, '周', 0, 7, this.getDayOfWeekAlias);
    }

    // 处理年份字段
    let yearDesc = '';
    if (year) {
      yearDesc = this.parseField(year, '年', 1970, 2099);
    }

    // 特殊情况处理：只有秒字段为具体值，其他都是*
    if (
      second &&
      (minute === '*' || minute === undefined) &&
      (hour === '*' || hour === undefined) &&
      (dayOfMonth === '*' || dayOfMonth === undefined) &&
      (month === '*' || month === undefined) &&
      (dayOfWeek === '*' || dayOfWeek === undefined || dayOfWeek === '?')
    ) {
      if (/^\d+$/.test(second)) {
        return `每分钟的第${second}秒执行一次`;
      }
    }

    // 特殊情况处理：只有分钟字段为具体值，其他都是*
    if (
      minute &&
      (second === '*' || second === undefined) &&
      (hour === '*' || hour === undefined) &&
      (dayOfMonth === '*' || dayOfMonth === undefined) &&
      (month === '*' || month === undefined) &&
      (dayOfWeek === '*' || dayOfWeek === undefined || dayOfWeek === '?')
    ) {
      if (/^\d+$/.test(minute)) {
        return `每小时${minute}分执行一次`;
      }
    }

    // 特殊情况处理：秒和分钟都有具体值，其他都是*
    if (
      second &&
      minute &&
      (hour === '*' || hour === undefined) &&
      (dayOfMonth === '*' || dayOfMonth === undefined) &&
      (month === '*' || month === undefined) &&
      (dayOfWeek === '*' || dayOfWeek === undefined || dayOfWeek === '?')
    ) {
      if (/^\d+$/.test(second) && /^\d+$/.test(minute)) {
        return `每小时${minute}分${second}秒执行一次`;
      }
    }

    // 特殊情况处理：只有小时字段为具体值，其他都是*
    if (
      hour &&
      (second === '*' || second === undefined) &&
      (minute === '*' || minute === undefined) &&
      (dayOfMonth === '*' || dayOfMonth === undefined) &&
      (month === '*' || month === undefined) &&
      (dayOfWeek === '*' || dayOfWeek === undefined || dayOfWeek === '?')
    ) {
      if (/^\d+$/.test(hour)) {
        return `每天${hour}时执行一次`;
      }
    }

    // 特殊情况处理：只有每隔N分钟的情况
    if (
      minute &&
      minute.startsWith('每隔') &&
      (second === '*' || second === undefined) &&
      (hour === '*' || hour === undefined) &&
      (dayOfMonth === '*' || dayOfMonth === undefined) &&
      (month === '*' || month === undefined) &&
      (dayOfWeek === '*' || dayOfWeek === undefined || dayOfWeek === '?')
    ) {
      return `${minute}执行一次`;
    }

    // 构建通用描述
    let result = '';

    // 按照时间单位重要性排序添加描述
    if (yearDesc) result += yearDesc;
    if (monthDesc) result += monthDesc;
    if (dayDesc) result += dayDesc;
    if (weekDesc) result += weekDesc;
    if (hourDesc) result += hourDesc;
    if (minuteDesc) result += minuteDesc;
    if (secondDesc) result += secondDesc;

    // 如果没有任何描述，默认为每分钟执行一次
    if (!result) {
      return '每分钟执行一次';
    }

    // 特殊处理：如果只有"每"开头的描述
    if (result.startsWith('每') && result.indexOf('每', 1) === -1) {
      return result + '执行一次';
    }

    return `${result}执行一次`;
  }
}
