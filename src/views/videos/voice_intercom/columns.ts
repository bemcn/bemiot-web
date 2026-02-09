import { BasicColumn } from '@/components/Table';
import { VideoServer } from '@/types/VideoModel';
import { format } from 'date-fns';

export const columns: BasicColumn<VideoServer>[] = [
  {
    title: 'ID',
    key: 'serverId',
    width: 100,
  },
  {
    title: '摄像头名称',
    key: 'deviceName',
  },
  {
    title: '安装位置',
    key: 'deviceName',
  },
  {
    title: '流ID',
    key: 'streamId',
  },
  {
    title: '录像时间',
    key: 'createTime',
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];
