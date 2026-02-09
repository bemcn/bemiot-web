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
      <n-form-item label="开始IP" path="ipStart">
        <n-input
          maxlength="15"
          placeholder="请输入开始IP地址"
          v-model:value="localParams.ipStart"
          clearable
          :allow-input="onlyAllowNumber"
        />
      </n-form-item>
      <n-form-item label="截止IP" path="ipEnd">
        <n-input
          maxlength="15"
          placeholder="单个IP地址则不用输入"
          clearable
          v-model:value="localParams.ipEnd"
          :allow-input="onlyAllowNumber"
        />
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
  import { FormItemRule, FormRules } from 'naive-ui';
  import { addBlacklist, editBlacklist } from '@/api/system/blacklist';

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
    roles: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        roleId: 0,
        roleName: '',
        roleAuth: '',
        orderNum: '',
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const fromAction = ref('');
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const onlyAllowNumber = (value: string) => !value || /^[\d.]+$/.test(value);

  // 表单验证
  const inputValidationIP = (_rule: FormItemRule, value: string) => {
    if (value !== '') {
      // IP地址验证正则表达式
      return /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        value
      );
    }
    return true;
  };
  const rules: FormRules = {
    ipStart: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入开始IP',
      },
      {
        validator: inputValidationIP,
        trigger: ['blur', 'input'],
        message: '请输入有效的IP地址格式',
      },
    ],
    ipEnd: [
      {
        validator: inputValidationIP,
        trigger: ['blur', 'input'],
        message: '请输入有效的IP地址格式',
      },
    ],
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.params],
    ([newShowModel, newAction, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;
      localParams.value = newParams;
    }
  );

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addBlacklist(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editBlacklist(localParams.value)) as unknown as {
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
