import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
import { Platform } from '@/types/SystemModel';

export const columns: BasicColumn<Platform>[] = [
  {
    title: '标识',
    key: 'platformId',
  },
  {
    title: '平台名称',
    key: 'platformName',
  },
  {
    title: '接入类型',
    key: 'accessType',
    render(record) {
      let typeStr = '数据接口';
      if (record.accessType === 1) {
        typeStr = '运用接口';
      } else if (record.accessType === 2) {
        typeStr = '第3方登录';
      }
      return h('span', typeStr); // 修复：使用正确的 h 函数调用
    },
  },
  {
    title: '状态',
    key: 'status',
    render(record) {
      let statusStr = '停用';
      if (record.status === 1) {
        statusStr = '启用';
      }
      return h(
        NTag,
        {
          type: record.status === 0 ? 'error' : 'success',
        },
        {
          default: () => statusStr,
        }
      );
    },
  },
  {
    title: '备注',
    key: 'remark',
  },
];
