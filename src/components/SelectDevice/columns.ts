import { BasicColumn } from '@/components/Table';
import { Device } from '@/types/DeviceModel';
import { NIcon, NTag } from 'naive-ui';
import { h } from 'vue';
import { format } from 'date-fns';
// @ts-ignore
import { WifiOutlined } from '@vicons/antd';

export const columns: BasicColumn<Device>[] = [
  {
    title: 'ID',
    key: 'deviceId',
    width: 72,
  },
  {
    title: '设备名称',
    key: 'deviceName',
    width: 250,
  },
  {
    title: '设备编号',
    key: 'deviceCode',
    width: 250,
  },
  {
    title: '产品',
    key: 'product.productName',
    width: 250,
  },
  {
    title: '设备类型',
    key: 'product.types',
    width: 120,
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
          typeStr = '网关子设备';
          break;
        case 5:
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
    width: 250,
  },
  {
    title: '所属分组',
    key: 'group.groupName',
    width: 150,
  },
  {
    title: '上级网关',
    key: 'gateway.deviceName',
    width: 250,
  },
  {
    title: '设备驱动',
    key: 'record.product.drive.driveName',
    width: 250,
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render(record) {
      return h(
        NTag,
        {
          type: record.status === 1 ? 'warning' : record.status === 2 ? 'default' : 'success',
          disabled: record.status === 2,
        },
        {
          default: () =>
            record.openShadow === 1 ? '未激活' : record.openShadow === 2 ? '禁用' : '启用',
        }
      );
    },
  },
];
