import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { MsgTemplate } from '@/types/BaseModel';

export const columns: BasicColumn<MsgTemplate>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<MsgTemplate>,
  {
    title: 'ID',
    key: 'templateId',
    width: 80,
    resizable: true,
  },
  {
    title: '标题',
    key: 'title',
    resizable: true,
  },
  {
    title: '标识',
    key: 'identity',
    resizable: true,
  },
  {
    title: '运用范围',
    key: 'scopeApp',
    width: 90,
    resizable: true,
    render(record) {
      let scopeAppStr = '邮件消息模板';
      if (record.scopeApp === 'wechat') {
        scopeAppStr = '微信消息模板';
      } else if (record.scopeApp === 'sms') {
        scopeAppStr = '短信消息模板';
      }
      return h('span', scopeAppStr);
    },
  },
  {
    title: '模板示例',
    key: 'example',
    width: 200,
    resizable: true,
  },
];
