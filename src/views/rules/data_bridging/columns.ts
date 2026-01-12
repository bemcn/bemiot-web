// /src/views/rules/data_bridging/columns.ts
import { BasicColumn } from '@/components/Table';
import { DataBridge } from '@/types/RulesModel';
import { h } from 'vue';

export const columns: BasicColumn<DataBridge>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<DataBridge>,
  {
    title: '标识',
    key: 'bridgeId',
  },
  {
    title: '桥接名称',
    key: 'bridgeName',
  },
  {
    title: '桥接方向',
    key: 'bridgeDirection',
    render(record) {
      return h('span', record.bridgeDirection === 'input' ? '输入' : '输出');
    },
  },
  {
    title: '桥接类型',
    key: 'bridgeType',
    render(record) {
      let typeName: string;
      if (record.bridgeType === 'http') {
        typeName = 'HTTP桥接';
      } else if (record.bridgeType === 'mqtt') {
        typeName = 'MQTT桥接';
      } else {
        typeName = '数据库存储';
      }
      return h('span', typeName);
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 150,
    render(record) {
      return h('span', record.status === 0 ? '禁用' : '启用');
    },
  },
];
