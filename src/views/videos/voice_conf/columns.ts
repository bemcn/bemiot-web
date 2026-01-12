import { BasicColumn } from '@/components/Table';
import { VideoServer } from '@/types/VideoModel';
import { format } from 'date-fns';
import { NTag } from 'naive-ui';
import { h } from 'vue';

export const columns: BasicColumn<VideoServer>[] = [
  {
    title: 'ID',
    key: 'serverId',
    width: 100,
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
    title: '状态',
    key: 'status',
    render(record) {
      return h(
        NTag,
        {
          type: record.status === 0 ? 'error' : 'success',
        },
        {
          default: () => (record.status === 0 ? '停用' : '启用'),
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];
