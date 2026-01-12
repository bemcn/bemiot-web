import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { UserInfo } from '@/types/SystemModel';
import { NTag } from 'naive-ui';
import { format } from 'date-fns';

export const columns: BasicColumn<UserInfo>[] = [
  {
    type: 'selection',
    key: 'selection',
    disabled: (record: { userId: number }) => record.userId === 1,
  } as unknown as BasicColumn<UserInfo>,
  {
    title: 'ID',
    key: 'userId',
    width: 100,
  },
  {
    title: '账号',
    key: 'userName',
  },
  {
    title: '昵称',
    key: 'nickName',
  },
  {
    title: '性别',
    key: 'sex',
    render(record) {
      let typeStr = '未知';
      if (record.sex === 1) {
        typeStr = '男';
      } else if (record.sex === 2) {
        typeStr = '女';
      }
      return h('span', typeStr);
    },
  },
  {
    title: '角色',
    key: 'role.roleName',
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
  {
    title: '创建时间',
    key: 'createTime',
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];
