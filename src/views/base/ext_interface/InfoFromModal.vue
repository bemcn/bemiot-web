<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 640px"
    title="编辑"
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
      <n-form-item label="接口名称" path="platformName">
        <n-input
          placeholder="请输入接口名称"
          maxlength="20"
          clearable
          v-model:value="localParams.platformName"
        />
      </n-form-item>
      <n-form-item label="接入类型">
        <n-input
          :value="
            localParams.accessType === 1
              ? '运用接口'
              : localParams.accessType === 2
              ? '第3方登录'
              : '数据接口'
          "
          :disabled="true"
        />
      </n-form-item>
      <n-form-item label="运用Key" path="appKey">
        <n-input placeholder="请输入运用Key" maxlength="50" v-model:value="localParams.appKey" />
      </n-form-item>
      <n-form-item label="安全密钥" path="secretKey">
        <n-input
          placeholder="请输入安全密钥"
          maxlength="255"
          clearable
          v-model:value="localParams.secretKey"
        />
      </n-form-item>
      <n-form-item v-if="localParams.accessType === 2" label="接口图标" path="iconImg">
        <n-input
          placeholder="请输入接口图标"
          maxlength="255"
          v-model:value="localParams.iconImg"
          clearable
        />
      </n-form-item>
      <n-form-item v-if="localParams.accessType === 2" label="认证跳转URL" path="authJumpUrl">
        <n-input
          placeholder="请输入认证跳转地址"
          maxlength="255"
          clearable
          v-model:value="localParams.authJumpUrl"
        />
      </n-form-item>
      <n-form-item v-if="localParams.accessType === 2" label="绑定注册URL" path="bindRegUrl">
        <n-input
          placeholder="请输入绑定注册地址"
          maxlength="255"
          clearable
          v-model:value="localParams.bindRegUrl"
        />
      </n-form-item>
      <n-form-item v-if="localParams.accessType === 2" label="跳转登录URL" path="loginJumpUrl">
        <n-input
          placeholder="请输入跳转登录地址"
          maxlength="255"
          clearable
          v-model:value="localParams.loginJumpUrl"
        />
      </n-form-item>
      <n-form-item v-if="localParams.accessType === 2" label="错误提示URL" path="errorUrl">
        <n-input
          placeholder="请输入错误提示地址"
          maxlength="255"
          clearable
          v-model:value="localParams.errorUrl"
        />
      </n-form-item>
      <n-form-item label="接口描述" path="remark">
        <n-input placeholder="请输入接口描述" v-model:value="localParams.remark" clearable />
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
  import { editPlatform } from '@/api/base/platform';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        platformId: '',
        platformName: '',
        appKey: '',
        secretKey: '',
        accessType: 0,
        authJumpUrl: '',
        bindRegUrl: '',
        loginJumpUrl: '',
        errorUrl: '',
        remark: '',
        isSystem: 0,
        iconImg: '',
        status: 0,
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
    platformName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入接口名称',
    },
    appKey: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入运用Key',
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
        const result = (await editPlatform(localParams.value)) as {
          status: string;
          message: string;
        };
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
