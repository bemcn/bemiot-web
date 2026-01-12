import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { Drive } from '@/types/BaseModel';
import { format } from 'date-fns';
import { NTag } from 'naive-ui';

export const columns: BasicColumn<Drive>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<Drive>,
  {
    title: '驱动编号',
    key: 'driveCode',
  },
  {
    title: '驱动名称',
    key: 'driveName',
  },
  {
    title: '驱动协议',
    key: 'protocolName',
  },
  {
    title: '驱动版本',
    key: 'version',
  },
  {
    title: '状态',
    key: 'status',
    width: 160,
    render(record) {
      let statusStr = '停止';
      if (record.status === 2) {
        statusStr = '启动';
      }
      return h(
        NTag,
        {
          type: record.status === 2 ? 'success' : 'error',
        },
        {
          default: () => statusStr,
        }
      );
    },
  },
  {
    title: '发行日期',
    key: 'releaseTime',
    render(record) {
      const date = new Date(record.releaseTime);
      return format(date, 'yyyy-MM-dd');
    },
  },
];
