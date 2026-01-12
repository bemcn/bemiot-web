import { NTag } from 'naive-ui';
import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { format } from 'date-fns';
import { DeviceChannel } from '@/types/VideoModel';

export const columns: BasicColumn<DeviceChannel>[] = [
  {
    title: '时间',
    key: 'id',
  },
  {
    title: '物模型名称',
    key: 'associatDevice',
  },
  {
    title: '物模型标识',
    key: 'channelName',
  },
  {
    title: '物模型类型',
    key: 'channelName',
  },
  {
    title: '所属设备',
    key: 'channelName',
  },
  {
    title: '设备位置',
    key: 'channelName',
  },
  {
    title: '数据采集值',
    key: 'channelName',
  },
];
