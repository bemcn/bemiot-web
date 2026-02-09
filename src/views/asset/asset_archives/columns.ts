import { BasicColumn } from '@/components/Table';
import { Device } from '@/types/DeviceModel';
import { h } from 'vue';
import { format } from 'date-fns';
// @ts-ignore
import { WifiOutlined } from '@vicons/antd';

export const columns: BasicColumn<Device>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<Device>,
  {
    title: '序号',
    key: 'index',
    width: 72,
    render(_row: any, index: number) {
      return index + 1;
    },
  },
  {
    title: '设备名称',
    key: 'deviceName',
  },
  {
    title: '设备编号',
    key: 'deviceId',
  },
  {
    title: '产品',
    key: 'product.productName',
  },
  {
    title: '设备类型',
    key: 'product.types',
    render(record) {
      let typeStr = '';
      switch (record.product?.types) {
        case 2:
          typeStr = '网关设备';
          break;
        case 3:
          typeStr = '监控设备';
          break;
        case 4:
          typeStr = '视频存储设备';
          break;
        case 5:
          typeStr = '网关子设备';
          break;
        case 6:
          typeStr = '虚拟设备';
          break;
        default:
          typeStr = '直连设备';
          break;
      }
      return h('span', typeStr);
    },
  },
  {
    title: '安装位置',
    key: 'spaceRouteName',
  },
  {
    title: '所属分组',
    key: 'group.groupName',
  },
  {
    title: '上级网关',
    key: 'gateway.deviceName',
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
