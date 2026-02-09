import { BasicColumn } from '@/components/Table';
import { ProductAttr } from '@/types/AssetModel';
// @ts-ignore
import { WifiOutlined } from '@vicons/antd';

export const columns: BasicColumn<ProductAttr>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<ProductAttr>,
  {
    title: 'ID',
    key: 'attrId',
    width: 80,
  },
  {
    title: '字段名',
    key: 'fieldKey',
  },
  {
    title: '字段标题',
    key: 'fieldLabel',
  },
  {
    title: '字段类型',
    key: 'fieldType',
  },
  {
    title: '所属产品',
    key: 'product.productName',
  },
  {
    title: '字段描述',
    key: 'description',
  },
];
