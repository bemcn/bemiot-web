import { BasicColumn } from '@/components/Table';
import { Firmware } from '@/types/DeviceModel';
import { h } from 'vue';

export const columns: BasicColumn<Firmware>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<Firmware>,
  {
    title: 'ID',
    key: 'firmwareId',
    width: 80,
  },
  {
    title: '固件名称',
    key: 'firmwareName',
  },
  {
    title: '最新版本',
    key: 'version',
  },
  {
    title: '更新方式',
    key: 'installType',
    render(record) {
      let typeStr = 'http';
      if (record.installType === 2) {
        typeStr = '分包拉取';
      }
      return h('span', typeStr);
    },
  },
  {
    title: '固件描述',
    key: 'remark',
  },
];
