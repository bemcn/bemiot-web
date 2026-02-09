import { BasicColumn } from '@/components/Table';
import { SceneLinkage } from '@/types/RulesModel';
import { DeviceModel } from '@/types/DeviceModel';
import { NTag } from 'naive-ui';
import { h } from 'vue';

export const columns: BasicColumn<SceneLinkage>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<SceneLinkage>,
  {
    title: 'ID',
    key: 'sceneId',
    width: 80,
  },
  {
    title: '场景名称',
    key: 'sceneName',
  },
  {
    title: '场景分组',
    key: 'group.groupName',
  },
  {
    title: '执行方式',
    key: 'executionMethod',
    render(record) {
      const method =
        record.executionMethod === 1
          ? '触发响应'
          : record.executionMethod === 2
          ? '循环执行'
          : '定时执行';
      return h(
        NTag,
        {},
        {
          default: () => method,
        }
      );
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
          type: record.status === 0 ? 'warning' : 'success',
        },
        {
          default: () => (record.status === 0 ? '停用' : '启用'),
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
  },
];

export const devModelColumns: BasicColumn<DeviceModel>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<DeviceModel>,
  {
    title: '物模型名称',
    key: 'modelName',
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
  },
  {
    title: '类别',
    key: 'modelClass',
    width: 120,
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
    width: 120,
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
];
