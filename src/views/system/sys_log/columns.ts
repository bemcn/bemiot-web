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
    key: 'createTime',
    render(record) {
      const date = new Date(record.createTime);
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
  },
  {
    title: 'IP地址',
    key: 'clientIp',
  },
  {
    title: '模块',
    key: 'modelName',
  },
  {
    title: '事件',
    key: 'operation',
  },
  {
    title: '描述',
    key: 'description',
  },
];
