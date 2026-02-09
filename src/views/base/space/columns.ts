import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { SpacePositionTable } from '@/types/BaseModel';
import { NTag } from 'naive-ui';
import { useUserStore } from '@/store/modules/user';
import { NInput } from 'naive-ui';

export const columns: BasicColumn<SpacePositionTable>[] = [
  {
    title: '空间位置',
    key: 'spaceName',
  },
  {
    title: '上级位置',
    key: 'spaceRouteName',
  },
  {
    title: '排序值',
    key: '',
    width: 180,
    render(record, index) {
      const userStore = useUserStore();
      const auth = userStore.parseAuthByModule('space');
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
