import { BasicColumn } from '@/components/Table';
import { Device } from '@/types/DeviceModel';

export const columns: BasicColumn<Device>[] = [
  {
    title: '通道号',
    key: 'channel',
    width: 100,
  },
  {
    title: '通道名称',
    key: 'channelName',
  },
  {
    title: 'IP地址',
    key: 'monitoring.ipAddress',
  },
  {
    title: '设备名称',
    key: 'device.deviceName',
  },
  {
    title: '安装位置',
    key: 'device.spaceRouteName',
  },
];
