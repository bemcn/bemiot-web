import type { PropType } from 'vue';

export const exportProps = {
  authShow: {
    type: Boolean,
    default: true,
  }, // 是否根据权限显示按钮
  type: {
    type: String,
    default: 'info',
  }, // 是否根据权限显示按钮
  queryData: {
    type: Object as PropType<any>,
    default: null,
  }, // 页面数据的查询参数
  apiPath: {
    type: String,
    default: '',
  }, // 导出接口路径
};
