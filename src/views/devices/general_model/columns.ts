import { BasicColumn } from '@/components/Table';
import { GeneralModel } from '@/types/DeviceModel';
import { NTag } from 'naive-ui';
import { h } from 'vue';
import { format } from 'date-fns';

export const columns: BasicColumn<GeneralModel>[] = [
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
    title: '分组',
    key: 'group.groupName',
  },
  {
    title: '类别',
    key: 'modelType',
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
  {
    title: '创建时间',
    key: 'createTime',
    render(record) {
      const date = new Date(record.createTime);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];
