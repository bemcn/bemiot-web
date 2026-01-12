import { BasicColumn } from '@/components/Table';
import { Product } from '@/types/DeviceModel';
import { NTag } from 'naive-ui';
import { h } from 'vue';
// @ts-ignore
import { WifiOutlined } from '@vicons/antd';

export const columns: BasicColumn<Product>[] = [
  {
    title: '序号',
    key: 'index',
    width: 72,
    render(_row: any, index: number) {
      return index + 1;
    },
  },
  {
    title: '产品名称',
    key: 'productName',
  },
  {
    title: '产品编号',
    key: 'productId',
  },
  {
    title: '产品型号',
    key: 'models',
  },
  {
    title: '产品类别',
    key: 'productClass.className',
  },
  {
    title: '产品类型',
    key: 'types',
    width: 120,
    render(record) {
      let typeStr = '';
      switch (record.types) {
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
    title: '联网方式',
    key: 'netMethod',
    width: 120,
    render(record) {
      let netStr = '';
      switch (record.netMethod) {
        case 1:
          netStr = '以太网';
        case 2:
          netStr = 'Wifi';
          break;
        case 3:
          netStr = '蜂窝移动';
          break;
        case 4:
          netStr = 'NB-IOT';
          break;
        case 5:
          netStr = '串口通讯';
          break;
        default:
          netStr = '其他';
          break;
      }
      return h('span', netStr);
    },
  },
  {
    title: '设备授权',
    key: 'authEquipment',
    width: 120,
    render(record) {
      return h(
        NTag,
        {
          type: record.authEquipment === 0 ? 'error' : 'success',
        },
        {
          default: () => (record.authEquipment === 0 ? '未启用' : '已启用'),
        }
      );
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render(record) {
      return h(
        NTag,
        {
          type: record.status === 1 ? 'error' : 'success',
        },
        {
          default: () => (record.status === 1 ? '待发布' : '已发布'),
        }
      );
    },
  },
];
