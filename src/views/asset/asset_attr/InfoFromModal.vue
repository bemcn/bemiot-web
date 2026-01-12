<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 940px"
    :title="title"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
      style="padding-right: 30px !important"
    >
      <n-form-item label="所属产品">
        <n-input v-model:value="localParams.productName" disabled />
      </n-form-item>
      <n-form-item label="字段名称" path="fieldKey">
        <n-input
          maxlength="30"
          placeholder="请输入字段名称"
          v-model:value="localParams.fieldKey"
          clearable
        />
      </n-form-item>
      <n-form-item label="字段标题" path="fieldLabel">
        <n-input
          maxlength="20"
          placeholder="请输入字段标题"
          v-model:value="localParams.fieldLabel"
          clearable
        />
      </n-form-item>
      <n-form-item label="字段类型" path="fieldType">
        <n-select
          v-model:value="localParams.fieldType"
          :options="typeOptions"
          placeholder="请选择字段类型"
        />
      </n-form-item>
      <n-form-item label="字段描述" path="description">
        <n-input
          type="textarea"
          placeholder="请输入字段描述"
          :autosize="{
            minRows: 3,
          }"
          clearable
          v-model:value="localParams.description"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { addProductAttr, editProductAttr } from '@/api/asset/productAttr';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    title: {
      type: String,
      default: () => '',
    },
    action: {
      type: String,
      default: () => '',
    },
    treeOption: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const typeOptions = [
    {
      label: '输入框',
      value: 'input',
    },
    {
      label: '文本框',
      value: 'text',
    },
    {
      label: '日期选择',
      value: 'date',
    },
    {
      label: '上传图片',
      value: 'img',
    },
  ];

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });

  // 表单验证
  const rules: FormRules = {
    fieldKey: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入字段名称',
    },
    fieldLabel: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入字段标题',
    },
    fieldType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择字段类型',
    },
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const params = {
          attrId: localParams.value.attrId,
          productId: localParams.value.productId,
          classRoute: localParams.value.classRoute,
          fieldKey: localParams.value.fieldKey,
          fieldLabel: localParams.value.fieldLabel,
          fieldType: localParams.value.fieldType,
          description: localParams.value.description,
        };

        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addProductAttr(params)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editProductAttr(params)) as unknown as {
            status: string;
            message: string;
          };
        }

        if (result.status === 'success') {
          window['$message'].success('提交成功');
          setTimeout(() => {
            showState.value = false;
            emit('submit');
          });
        } else {
          window['$message'].error(result.message);
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };
</script>
