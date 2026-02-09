import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { Protocols } from '@/types/BaseModel';
import { NTag } from 'naive-ui';

export const columns: BasicColumn<Protocols>[] = [
  {
    type: 'selection',
    key: 'selection',
    disabled: (record: { built: number }) => record.built === 1,
  } as unknown as BasicColumn<Protocols>,
  {
    title: 'ID',
    key: 'protocolId',
    width: 80,
  },
  {
    title: '协议名称',
    key: 'protocolName',
  },
  {
    title: '协议类型',
    key: 'status',
    width: 160,
    render(record) {
      let builtStr = '内置协议';
      if (record.built === 0) {
        builtStr = '外部协议';
      }
      return h(
        NTag,
        {
          type: record.built === 0 ? 'info' : 'success',
        },
        {
          default: () => builtStr,
        }
      );
    },
  },
];
