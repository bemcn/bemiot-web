import { BasicColumn } from '@/components/Table';
import { Firmware, ProductModel, GeneralModel } from '@/types/DeviceModel';
import { Drive } from '@/types/BaseModel';
import { NTag } from 'naive-ui';
import { h } from 'vue';

export const columns = [
  {
    title: 'ID',
    key: 'productId',
    width: 72,
  },
  {
    title: '产品名称',
    key: 'productName',
  },
  {
    title: '产品型号',
    key: 'models',
  },
  {
    title: '产品类别',
    key: 'productClass.className',
    width: 160,
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
    title: '联网方式',
    key: 'netMethod',
    width: 120,
    render(record) {
      let netStr = '';
      switch (record.netMethod) {
        case 1:
          netStr = '以太网';
          break;
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

export const firmwareColumns: BasicColumn<Firmware>[] = [
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
    title: '固件版本',
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
];

export const driveColumns: BasicColumn<Drive>[] = [
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
];

export const proModelColumns: BasicColumn<ProductModel>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<ProductModel>,
  {
    title: '物模型名称',
    key: 'modelName',
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
  },
  {
    title: '类别',
    key: 'modelType',
    width: 120,
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
    width: 120,
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
    title: '图表展示',
    key: 'charts',
    width: 120,
    render(record) {
      return h(
        NTag,
        {
          type: record.charts === 0 ? 'error' : 'success',
        },
        {
          default: () => (record.charts === 0 ? '否' : '是'),
        }
      );
    },
  },
  {
    title: '历史存储',
    key: 'history',
    width: 120,
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
export const generalModelColumns: BasicColumn<GeneralModel>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<GeneralModel>,
  {
    title: '物模型名称',
    key: 'modelName',
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
  },
  {
    title: '类别',
    key: 'modelType',
    width: 120,
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
    width: 120,
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
    title: '图表展示',
    key: 'charts',
    width: 120,
    render(record) {
      return h(
        NTag,
        {
          type: record.charts === 0 ? 'error' : 'success',
        },
        {
          default: () => (record.charts === 0 ? '否' : '是'),
        }
      );
    },
  },
  {
    title: '历史存储',
    key: 'history',
    width: 120,
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
