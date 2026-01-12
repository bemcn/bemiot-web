import { BasicColumn } from '@/components/Table';
import { format } from 'date-fns';
import { h } from 'vue';
import { LogModelAlarm } from '@/types/AlarmModel';

export const columns: BasicColumn<LogModelAlarm>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<LogModelAlarm>,
  {
    title: '时间',
    key: 'ts',
    width: 180,
    render(record) {
      const date = new Date(record.ts);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
  {
    title: '告警信息',
    key: 'description',
    width: 250,
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
    width: 150,
  },
  {
    title: '物模型名称',
    key: 'model.modelName',
    width: 150,
  },
  {
    title: '告警值',
    key: 'alarmValue',
    width: 100,
  },
  {
    title: '告警状态',
    key: 'alarmStatus',
    width: 100,
    render(record) {
      let statusStr = '';
      if (record.alarmStatus === 1) {
        statusStr = '告警中';
      } else {
        statusStr = '解除告警';
      }
      return h('span', statusStr);
    },
  },
];
