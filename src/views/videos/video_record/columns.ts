import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { format } from 'date-fns';
import { DeviceChannel } from '@/types/VideoModel';

export const columns: BasicColumn<DeviceChannel>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<DeviceChannel>,
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
