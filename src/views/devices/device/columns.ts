import { BasicColumn } from '@/components/Table';
import { Device, Product, DeviceModel, LogModelEvent } from '@/types/DeviceModel';
import { LogModelAlarm } from '@/types/AlarmModel';
import { DeviceChannel } from '@/types/VideoModel';
import { VideoServer } from '@/types/VideoModel';
import { Drive } from '@/types/BaseModel';
import { NTag, NIcon } from 'naive-ui';
import { h } from 'vue';
import { format } from 'date-fns';
// @ts-ignore
import { WifiOutlined, CheckCircleFilled, MinusCircleFilled } from '@vicons/antd';
import { DeviceAttr } from '@/types/AssetModel';

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
    width: 120,
  },
  {
    title: '上级网关',
    key: 'gateway.deviceName',
  },
  {
    title: '设备驱动',
    key: 'product.drive.driveName',
  },
  {
    title: '驱动协议',
    key: 'product.drive.driveName',
  },
  {
    title: '通讯协议',
    key: 'product.trans',
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

export const subColumns: BasicColumn<Device>[] = [
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
    title: '设备状态',
    key: 'status',
    width: 80,
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
    title: '通讯协议',
    key: 'product.trans',
    width: 100,
  },
  {
    title: '所有者',
    key: 'record.user.userName',
    width: 100,
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
    title: '序号',
    key: 'index',
    width: 72,
    resizable: true,
    render(_row: any, index: number) {
      return index + 1;
    },
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
    resizable: true,
  },
  {
    title: '值',
    key: 'value',
    align: 'right',
    titleAlign: 'center',
    resizable: true,
    render(record) {
      let valueDisplay;
      if (record.value === null || record.value === undefined || record.value === '') {
        valueDisplay = h('span', { style: { color: '#999999' } }, 'none');
      } else {
        valueDisplay = record.value;
      }
      let valueContent;
      if (record.readonly === 1) {
        valueContent = h('span', { style: { color: '#18a058' } }, '只读');
      } else {
        valueContent = h('span', { style: { color: '#d03050' } }, '读写');
      }
      const dataDefinition = record.dataDefinition;
      const definition = JSON.parse(dataDefinition);
      let unit = '';
      // 判断json对象中是否包含名称为unit的key，如果有则赋值给unit变量
      if (definition.hasOwnProperty('unit')) {
        unit = definition.unit;
      }
      return h('span', [valueDisplay, unit, ' （', valueContent, '）']);
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    resizable: true,
    render(record) {
      const statusIcon =
        record.status === 0
          ? h(
              NIcon,
              {
                size: 16,
                color: '#18a058',
                style: { marginRight: '4px' },
              },
              { default: () => h(CheckCircleFilled) }
            )
          : h(
              NIcon,
              {
                size: 16,
                color: '#f0a020',
                style: { marginRight: '4px' },
              },
              { default: () => h(MinusCircleFilled) }
            );
      const statusText = record.status === 0 ? '在线' : '离线';
      const statusColor = record.status === 0 ? '#18a058' : '#f0a020';
      const statusTextNode = h(
        'span',
        {
          style: { color: statusColor, fontSize: '12px' },
        },
        statusText
      );
      return h('span', { style: { display: 'inline-flex', alignItems: 'center' } }, [
        statusIcon,
        statusTextNode,
      ]);
    },
  },
  {
    title: '物模型名称',
    key: 'modelName',
    resizable: true,
  },
  {
    title: '类型',
    key: 'modelType',
    width: 100,
    resizable: true,
    render(record) {
      let typeStr = '物理模型';
      if (record.modelType === 1) {
        typeStr = '虚拟模型';
      }
      return h('span', typeStr);
    },
  },
  {
    title: '类别',
    key: 'modelClass',
    width: 100,
    resizable: true,
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
    width: 100,
    resizable: true,
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
    width: 100,
    resizable: true,
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
export const channelColumns: BasicColumn<DeviceChannel>[] = [
  {
    title: '通道ID',
    key: 'channelId',
    width: 200,
  },
  {
    title: '通道名称',
    key: 'channelName',
  },
  {
    title: '通道类型',
    key: 'channelType',
    width: 120,
    render(record) {
      let typeStr = '';
      switch (record.channelType) {
        case 117:
          typeStr = '报警控制器';
          break;
        case 131:
          typeStr = '摄像机';
          break;
        case 132:
          typeStr = 'IPC网络摄像机';
          break;
        case 133:
          typeStr = '显示器';
          break;
        case 134:
          typeStr = '报警输入设备';
          break;
        case 135:
          typeStr = '报警输出设备';
          break;
        case 136:
          typeStr = '语音输入设备';
          break;
        case 137:
          typeStr = '语音输出设备';
          break;
        case 138:
          typeStr = '移动传输设备';
          break;
        case 140:
          typeStr = '视频存储';
          break;
        default:
          typeStr = '未知';
          break;
      }
      return h('span', typeStr);
    },
  },
  {
    title: '设备编号',
    key: 'device.deviceId',
    width: 200,
  },
  {
    title: '设备名称',
    key: 'device.deviceName',
  },
  {
    title: 'PTZ类型',
    key: 'ptzType',
    width: 120,
    render(record) {
      let typeStr = '';
      switch (record.ptzType) {
        case 1:
          typeStr = 'ONVIF';
          break;
        case 2:
          typeStr = 'Pelco-P';
          break;
        case 3:
          typeStr = 'Pelco-P';
          break;
        case 4:
          typeStr = 'VISCA';
          break;
        case 5:
          typeStr = 'HTTP';
          break;
        case 6:
          typeStr = '其他';
          break;
        default:
          typeStr = '无';
          break;
      }
      return h('span', typeStr);
    },
  },
  {
    title: '服务器名称',
    key: 'server.serverName',
  },
  {
    title: '服务器类型',
    key: 'server.serverType',
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 170,
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];
export const logEventColumns: BasicColumn<LogModelEvent>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<LogModelEvent>,
  {
    title: '时间',
    key: 'ts',
    width: 180,
    render(record) {
      const date = new Date(record.ts);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
  {
    title: '事件类型',
    key: 'type',
    width: 100,
    render(record) {
      let typeStr = '';
      switch (record.type) {
        case 'register':
          typeStr = '设备注册';
          break;
        case 'online':
          typeStr = '设备上线';
          break;
        case 'offline':
          typeStr = '设备下线';
          break;
        case 'reported':
          typeStr = '事件上报';
          break;
        case 'read':
          typeStr = '读属性';
          break;
        case 'readReply':
          typeStr = '读属性反馈';
          break;
        case 'write':
          typeStr = '写属性';
          break;
        case 'writeReply':
          typeStr = '写属性反馈';
          break;
        default:
          typeStr = '未知';
          break;
      }
      return h('span', typeStr);
    },
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
    width: 150,
  },
  {
    title: '物模型名称',
    key: 'model.modelName',
    width: 150,
  },
  {
    title: '事件描述',
    key: 'description',
    width: 250,
  },
  {
    title: '事件数据',
    key: 'data',
    width: 250,
  },
];
export const logAlarmColumns: BasicColumn<LogModelAlarm>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<LogModelAlarm>,
  {
    title: '时间',
    key: 'ts',
    width: 180,
    render(record) {
      const date = new Date(record.ts);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
  {
    title: '告警信息',
    key: 'description',
    width: 250,
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
    width: 150,
  },
  {
    title: '物模型名称',
    key: 'model.modelName',
    width: 150,
  },
  {
    title: '告警值',
    key: 'alarmValue',
    width: 100,
  },
  {
    title: '告警状态',
    key: 'alarmStatus',
    width: 100,
    render(record) {
      let statusStr = '';
      if (record.alarmStatus === 1) {
        statusStr = '告警中';
      } else {
        statusStr = '解除告警';
      }
      return h('span', statusStr);
    },
  },
];

export const recordColumns: BasicColumn<DeviceAttr>[] = [
  {
    title: 'ID',
    key: 'attrId',
    width: 80,
  },
  {
    title: '属性标识',
    key: 'fieldKey',
    width: 220,
  },
  {
    title: '属性名称',
    key: 'fieldLabel',
    width: 220,
  },
  {
    title: '属性值',
    key: 'fieldValue',
  },
  {
    title: '数据类型',
    key: 'fieldType',
    width: 220,
  },
];

export const videoServerColumns: BasicColumn<VideoServer>[] = [
  {
    title: 'ID',
    key: 'serverId',
  },
  {
    title: '服务器名称',
    key: 'serverName',
  },
  {
    title: '服务器类型',
    key: 'serverType',
  },
  {
    title: 'IP地址',
    key: 'ipAddress',
    render(record) {
      let ipAddress = '';
      if (record.serverType === 'sip') {
        ipAddress = record.config.sipAddress;
      } else {
        ipAddress = record.config.mediaIp;
      }
      return h('span', ipAddress);
    },
  },
  {
    title: '端口号',
    key: 'port',
    render(record) {
      let ipAddress = '';
      if (record.serverType === 'sip') {
        ipAddress = record.config.sipPort;
      } else {
        ipAddress = record.config.ports;
      }
      return h('span', ipAddress);
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
          type: record.status === 0 ? 'error' : 'success',
        },
        {
          default: () => (record.status === 0 ? '禁用' : '启用'),
        }
      );
    },
  },
];
