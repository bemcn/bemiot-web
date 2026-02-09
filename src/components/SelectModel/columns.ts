import { BasicColumn } from '@/components/Table';
import { ProductModel } from '@/types/DeviceModel';
import { NTag } from 'naive-ui';
import { h } from 'vue';
// @ts-ignore
import { WifiOutlined } from '@vicons/antd';

export const columns: BasicColumn<ProductModel>[] = [
  {
    title: '序号',
    key: 'index',
    width: 80,
    render(_row: any, index: number) {
      return index + 1;
    },
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
    width: 200,
  },
  {
    title: '物模型名称',
    key: 'modelName',
    width: 200,
  },
  {
    title: '类别',
    key: 'modelClass',
    width: 80,
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
    width: 80,
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
