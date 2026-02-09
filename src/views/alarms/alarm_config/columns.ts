import { BasicColumn } from '@/components/Table';
import { format } from 'date-fns';
import { h } from 'vue';
import { NTag, NSwitch } from 'naive-ui';

// 告警设置数据接口
export interface AlarmConfig {
  id: number;
  alarmName: string;
  level: number; // 1: 紧急告警, 2: 重要告警, 3: 一般告警
  levelText: string;
  levelType: 'error' | 'warning' | 'info';
  deviceProperty: string;
  deviceName: string;
  minValue?: number;
  maxValue?: number;
  responseMethods: string[]; // 响应方式: ['message', 'sms']
  responseMethodText: string;
  notifyUsers: string[]; // 通知人员
  notifyUserText: string;
  status: number; // 0: 禁用, 1: 启用
  createTime: string;
}

export const columns: BasicColumn<AlarmConfig>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<AlarmConfig>,
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '告警名称',
    key: 'alarmName',
    width: 150,
  },
  {
    title: '告警级别',
    key: 'level',
    width: 120,
    render(record) {
      const levelMap = {
        1: { text: '紧急告警', type: 'error' },
        2: { text: '重要告警', type: 'warning' },
        3: { text: '一般告警', type: 'info' },
      };
      
      const levelInfo = levelMap[record.level as keyof typeof levelMap] || { text: '未知', type: 'default' };
      
      return h(
        NTag,
        {
          type: levelInfo.type as any,
        },
        {
          default: () => levelInfo.text,
        }
      );
    },
  },
  {
    title: '设备属性',
    key: 'deviceProperty',
    width: 150,
  },
  {
    title: '设备名称',
    key: 'deviceName',
    width: 150,
  },
  {
    title: '告警值',
    key: 'alarmValue',
    width: 150,
    render(record) {
      let text = '';
      if (record.minValue !== undefined && record.maxValue !== undefined) {
        text = `${record.minValue} ~ ${record.maxValue}`;
      } else if (record.minValue !== undefined) {
        text = `> ${record.minValue}`;
      } else if (record.maxValue !== undefined) {
        text = `< ${record.maxValue}`;
      } else {
        text = '无限制';
      }
      return h('span', text);
    },
  },
  {
    title: '响应方式',
    key: 'responseMethodText',
    width: 150,
  },
  {
    title: '通知人员',
    key: 'notifyUserText',
    width: 150,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(record) {
      return h(NSwitch, {
        value: record.status === 1,
        disabled: true,
      });
    },
  },
  {
    title: '创建日期',
    key: 'createTime',
    width: 180,
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];