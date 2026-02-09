import { BasicColumn } from '@/components/Table';
import { format } from 'date-fns';
import { h } from 'vue';
import { NTag } from 'naive-ui';

export interface AlarmLog {
  id: string;
  level: number; // 1: 紧急告警, 2: 重要告警, 3: 一般告警
  levelText: string;
  levelType: 'error' | 'warning' | 'info';
  keyword: string;
  deviceName: string;
  content: string;
  createTime: string;
}

export const columns: BasicColumn<AlarmLog>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<AlarmLog>,
  {
    title: '告警时间',
    key: 'createTime',
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
  {
    title: '告警级别',
    key: 'level',
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
    title: '设备名称',
    key: 'deviceName',
  },
  {
    title: '告警内容',
    key: 'content',
  },
];