import { format } from 'date-fns';
import { NImage } from 'naive-ui';
import { h } from 'vue';

export const columns = [
  {
    title: '告警时间',
    key: 'createTime',
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
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
    title: '告警类型',
    key: 'alarmType',
  },
  {
    title: '告警照片',
    key: 'alarmImage',
    render(record) {
      return h(NImage, {
        width: '100',
        src: record.alarmImage,
      });
    },
  },
  {
    title: '告警描述',
    key: 'alarmType',
  },
];
