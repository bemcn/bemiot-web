import { BasicColumn } from '@/components/Table';
import { Certificate } from '@/types/BaseModel';

export const columns: BasicColumn<Certificate>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<Certificate>,
  {
    title: 'ID',
    key: 'certificateId',
    width: 80,
  },
  {
    title: '证书名称',
    key: 'certificateName',
  },
  {
    title: '证书标准',
    key: 'certificateStandard',
  },
  {
    title: '证书描述',
    key: 'remark',
  },
];
