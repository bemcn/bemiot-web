import { BasicColumn } from '@/components/Table';
import { Blacklist } from '@/types/SystemModel';
import { format } from 'date-fns';

export const columns: BasicColumn<Blacklist>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<Blacklist>,
  {
    title: 'ID',
    key: 'blackId',
    width: 100,
  },
  {
    title: '账号',
    key: 'ipStart',
  },
  {
    title: '昵称',
    key: 'ipEnd',
  },
  {
    title: '备注',
    key: 'remark',
  },
  {
    title: '创建时间',
    key: 'createTime',
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];
