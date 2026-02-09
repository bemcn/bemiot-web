import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { GeneralModelGroup } from '@/types/BaseModel';
import { useUserStore } from '@/store/modules/user';
import { NInput } from 'naive-ui';

export const columns: BasicColumn<GeneralModelGroup>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<GeneralModelGroup>,
  {
    title: 'ID',
    key: 'groupId',
    width: 100,
  },
  {
    title: '分组名称',
    key: 'groupName',
  },
  {
    title: '描述',
    key: 'remark',
  },
  {
    title: '排序值',
    key: '',
    width: 180,
    render(record, index) {
      const userStore = useUserStore();
      const auth = userStore.parseAuthByModule('general_model_group');
      const editAuth = auth.edit;
      return h(NInput, {
        defaultValue: record.orderNum?.toString(),
        onUpdateValue(v) {
          // 保留原有逻辑，但只在失去焦点时触发
        },
        onBlur(v) {
          // 调用父组件方法更新排序值
          const inputValue = (v.target as HTMLInputElement).value;
          const event = new CustomEvent('updateOrderNumber', {
            detail: { index, value: parseInt(inputValue) || 0, record },
          });
          window.dispatchEvent(event);
        },
        style: {
          textAlign: 'center',
        },
        disabled: !editAuth,
      });
    },
  },
];
