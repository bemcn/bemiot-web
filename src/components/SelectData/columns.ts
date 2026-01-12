import { DeviceModel } from '@/types/DeviceModel';
import { BasicColumn } from '../Table';
import { h } from 'vue';
import { NTag } from 'naive-ui';

export const modelColumns: BasicColumn<DeviceModel>[] = [
  {
    title: '表名',
    key: 'modelId',
    width: 160,
  },
  {
    title: '物模型名称',
    key: 'modelName',
  },
  {
    title: '所属设备',
    key: 'device.deviceName',
  },
  {
    title: '设备类型',
    key: 'types',
    width: 80,
    render(record) {
      let typeStr: string; //1：直连设备 2：网关设备 3：监控设备 4：视频存储设备 5：网关子设备 6：虚拟设备
      switch (record.types) {
        case 1:
          typeStr = '直连设备';
          break;
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
          typeStr = '其他';
          break;
      }
      return h('span', typeStr);
    },
  },
  {
    title: '类别',
    key: 'modelType',
    width: 80,
    render(record) {
      let typeStr = '属性';
      if (record.modelType === 2) {
        typeStr = '功能';
      } else if (record.modelType === 3) {
        typeStr = '事件';
      }
      return h(
        NTag,
        {
          type: record.modelType === 1 ? 'info' : record.modelType === 2 ? 'success' : 'warning',
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
];
