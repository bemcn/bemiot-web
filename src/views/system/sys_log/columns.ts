import { BasicColumn } from '@/components/Table';
import { Log } from '@/types/SystemModel';
import { format } from 'date-fns';

export const columns: BasicColumn<Log>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<Log>,
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
    title: '账号',
    key: 'userName',
  },
  {
    title: '昵称',
    key: 'nickName',
  },
  {
    title: '来源',
    key: 'clientSource',
    width: 150,
  },
  {
    title: 'IP地址',
    key: 'clientIp',
    width: 150,
  },
  {
    title: '模块',
    key: 'modelName',
    width: 120,
  },
  {
    title: '事件',
    key: 'operation',
    width: 100,
  },
  {
    title: '描述',
    key: 'description',
    width: 280,
  },
];
