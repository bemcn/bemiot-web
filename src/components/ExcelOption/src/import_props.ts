import type { PropType } from 'vue';

export const importProps = {
  authShow: {
    type: Boolean,
    default: true,
  }, // 是否根据权限显示按钮
  type: {
    type: String,
    default: '',
  }, // 是否根据权限显示按钮
  modelPath: {
    type: String,
    default: '',
  }, // 模板接口路径
  importPath: {
    type: String,
    default: '',
  }, // 导入接口路径
};
