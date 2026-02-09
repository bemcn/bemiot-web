import { BasicColumn } from '@/components/Table';
import { Device, Product, DeviceModel, GeneralModel } from '@/types/DeviceModel';
import { Drive } from '@/types/BaseModel';
import { NTag } from 'naive-ui';
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
    title: 'ID',
    key: 'deviceId',
    width: 80,
  },
  {
    title: '设备名称',
    key: 'deviceName',
  },
  {
    title: '设备编号',
    key: 'deviceCode',
  },
  {
    title: '联网状态',
    key: 'online',
    width: 120,
    render(record) {
      return h(
        NTag,
        {
          type: record.online === 0 ? 'warning' : 'success',
        },
        {
          default: () => (record.online === 0 ? '离线' : '在线'),
        }
      );
    },
  },
  {
    title: '设备状态',
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
          default: () => (record.status === 1 ? '未激活' : record.status === 2 ? '禁用' : '启用'),
        }
      );
    },
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
  },
  {
    title: '所属分组',
    key: 'group.groupName',
    width: 120,
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
    title: '驱动协议',
    key: 'record.product.drive.driveName',
  },
  {
    title: '通讯协议',
    key: 'record.product.drive.trans',
  },
  {
    title: '影子设备',
    key: 'openShadow',
    width: 120,
    render(record) {
      return h(
        NTag,
        {
          type: record.openShadow === 0 ? 'default' : 'success',
          disabled: record.openShadow === 0,
        },
        {
          default: () => (record.openShadow === 0 ? '禁用' : '启用'),
        }
      );
    },
  },
  {
    title: '定位方式',
    key: 'locateMethod',
    width: 120,
    render(record) {
      return h(
        NTag,
        {
          type:
            record.locateMethod === 0
              ? 'default'
              : record.status === 1
              ? 'success'
              : record.status === 2
              ? 'info'
              : 'warning',
          disabled: record.locateMethod === 0,
        },
        {
          default: () =>
            record.locateMethod === 0
              ? '无定位'
              : record.status === 1
              ? '自动定位'
              : record.status === 2
              ? '设备定位'
              : '自定义位置',
        }
      );
    },
  },
  {
    title: '固件版本',
    key: 'firmwareVersion',
    width: 120,
  },
  {
    title: '激活时间',
    key: 'activeTime',
    width: 180,
    render(record) {
      if (record.status > 1) {
        const date = new Date(record.activeTime);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
      } else {
        return '';
      }
    },
  },
  {
    title: '所有者',
    key: 'record.user.userName',
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];

export const productColumns: BasicColumn<Product>[] = [
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

export const devModelColumns: BasicColumn<DeviceModel>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<DeviceModel>,
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
