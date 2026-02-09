import { Device, DeviceModel } from '@/types/DeviceModel';
import { BasicColumn } from '../Table';
import { h } from 'vue';
import { NTag } from 'naive-ui';

export const modelColumns: BasicColumn<DeviceModel>[] = [
  {
    title: '物模型标识',
    key: 'modelIdentity',
    width: 140,
  },
  {
    title: '物模型名称',
    key: 'modelName',
    width: 250,
  },
  {
    title: '类别',
    key: 'modelClass',
    width: 80,
    render(record) {
      let typeStr = '属性';
      if (record.modelClass === 2) {
        typeStr = '功能';
      } else if (record.modelClass === 3) {
        typeStr = '事件';
      }
      return h(
        NTag,
        {
          type: record.modelClass === 1 ? 'info' : record.modelClass === 2 ? 'success' : 'warning',
        },
        {
          default: () => typeStr,
        }
      );
    },
  },
  {
    title: '数据类型',
    key: 'dataType',
    width: 80,
    render(record) {
      let dataTypeStr: string;
      switch (record.dataType) {
        case 'int':
          dataTypeStr = '整数';
          break;
        case 'number':
          dataTypeStr = '小数';
          break;
        case 'text':
          dataTypeStr = '字符串';
          break;
        case 'date':
          dataTypeStr = '日期时间';
          break;
        case 'bool':
          dataTypeStr = '布尔值';
          break;
        case 'array':
          dataTypeStr = '数组';
          break;
        case 'enum':
          dataTypeStr = '枚举';
          break;
        case 'struct':
          dataTypeStr = '对象';
          break;
        default:
          dataTypeStr = '未知';
          break;
      }
      return h('span', dataTypeStr);
    },
  },
  {
    title: '历史存储',
    key: 'history',
    width: 80,
    render(record) {
      return h(
        NTag,
        {
          type: record.history === 0 ? 'error' : 'success',
        },
        {
          default: () => (record.history === 0 ? '否' : '是'),
        }
      );
    },
  },
];

export const deviceColumns: BasicColumn<Device>[] = [
  {
    title: '序号',
    key: 'index',
    width: 60,
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
    title: 'IP地址',
    key: 'ipAddress',
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
    title: '设备驱动',
    key: 'record.product.drive.driveName',
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
