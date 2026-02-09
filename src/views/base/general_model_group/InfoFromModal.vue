<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 640px"
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
    >
      <n-form-item label="分组名称" path="groupName">
        <n-input placeholder="请输入分组名称" v-model:value="localParams.groupName" clearable />
      </n-form-item>
      <n-form-item label="备注" path="remark">
        <n-input
          type="textarea"
          placeholder="请输入备注"
          :autosize="{
            minRows: 3,
          }"
          clearable
          v-model:value="localParams.remark"
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
  import { addGeneralModelGroup, editGeneralModelGroup } from '@/api/base/generalModelGroup';

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
    params: {
      type: Object as PropType<any>,
      default: () => ({
        groupId: 0,
        groupName: '',
        orderNum: '',
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const rules: FormRules = {
    groupName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入分组名称',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addGeneralModelGroup(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editGeneralModelGroup(localParams.value)) as unknown as {
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
