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
      :rules="configGroup === 'wechat' ? wxRules : configGroup === 'sms' ? smsRules : mailRules"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
    >
      <div v-if="configGroup === 'wechat'">
        <n-form-item label="微信消息" path="sendOpen">
          <n-switch v-model:value="localParams.sendOpen" :round="false" />
        </n-form-item>
        <n-form-item label="接入类型" path="wxType">
          <n-select
            v-model:value="localParams.wxType"
            :options="wxTypeOptions"
            placeholder="请选择接入类型"
          />
        </n-form-item>
        <n-form-item label="AppID" path="wxAppId">
          <n-input
            maxlength="50"
            placeholder="请输入微信AppID"
            v-model:value="localParams.wxAppId"
            clearable
          />
        </n-form-item>
        <n-form-item label="AppSecret" path="wxAppSecret">
          <n-input
            maxlength="500"
            placeholder="请输入微信AppSecret"
            v-model:value="localParams.wxAppSecret"
            clearable
          />
        </n-form-item>
      </div>
      <div v-if="configGroup === 'sms'">
        <n-form-item label="短信消息" path="sendOpen">
          <n-switch v-model:value="localParams.sendOpen" :round="false" />
        </n-form-item>
        <n-form-item label="接入类型" path="smsType">
          <n-select
            v-model:value="localParams.smsType"
            :options="smsTypeOptions"
            placeholder="请选择接入类型"
          />
        </n-form-item>
        <n-form-item label="KeyID" path="smsAccessKeyId">
          <n-input
            maxlength="50"
            placeholder="请输入短信平台AccessKeyID"
            v-model:value="localParams.smsAccessKeyId"
            clearable
          />
        </n-form-item>
        <n-form-item label="KeySecret" path="smsAccessKeySecret">
          <n-input
            maxlength="500"
            placeholder="请输入短信平台AccessKeySecret"
            v-model:value="localParams.smsAccessKeySecret"
            clearable
          />
        </n-form-item>
        <n-form-item label="短信签名" path="smsSignature">
          <n-input
            maxlength="20"
            placeholder="请输入短信签名"
            v-model:value="localParams.smsSignature"
            clearable
          />
        </n-form-item>
      </div>
      <div v-if="configGroup === 'mail'">
        <n-form-item label="邮件消息" path="sendOpen">
          <n-switch v-model:value="localParams.sendOpen" :round="false" />
        </n-form-item>
        <n-form-item label="smtp主机" path="mailHost">
          <n-input
            maxlength="50"
            placeholder="请输入smtp主机"
            v-model:value="localParams.mailHost"
            clearable
          />
        </n-form-item>
        <n-form-item label="smtp端口" path="mailPort">
          <n-input
            maxlength="8"
            placeholder="请输入smtp端口"
            v-model:value="localParams.mailPort"
            :allow-input="onlyAllowInt"
            clearable
          />
        </n-form-item>
        <n-form-item label="邮箱地址" path="mailAddress">
          <n-input
            maxlength="50"
            placeholder="请输入邮箱地址"
            v-model:value="localParams.mailAddress"
            clearable
          />
        </n-form-item>
        <n-form-item label="邮箱账号" path="mailUser">
          <n-input
            maxlength="50"
            placeholder="请输入邮箱账号"
            v-model:value="localParams.mailUser"
            clearable
          />
        </n-form-item>
        <n-form-item label="邮箱密码" path="mailPass">
          <n-input
            maxlength="50"
            placeholder="请输入邮箱密码"
            v-model:value="localParams.mailPass"
            clearable
          />
        </n-form-item>
      </div>
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
  import { getConfigParams, editConfig } from '@/api/system/systemConfig';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    type: {
      type: String,
      default: () => '',
    },
    title: {
      type: String,
      default: () => '',
    },
  });

  // 回调
  const emit = defineEmits(['close']);

  const showState = ref(false);
  const configGroup = ref('');
  const localParams = ref<any>({});
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const wxTypeOptions = [
    {
      label: '微信服务号',
      value: 'service',
    },
    {
      label: '微信小程序',
      value: 'program',
    },
    {
      label: '企业微信',
      value: 'enterprise',
    },
  ];
  const smsTypeOptions = [
    {
      label: '阿里云短信',
      value: 'aliyun',
    },
    {
      label: '腾讯云短信',
      value: 'tencent',
    },
  ];

  const loadData = async () => {
    if (configGroup.value && configGroup.value.length > 0) {
      const params = {
        group: configGroup.value,
      };
      const result = (await getConfigParams(params)) as {
        status: string;
        message: string;
        data: any;
      };
      if (result.status === 'success') {
        if (configGroup.value === 'wechat') {
          console.log(result.data);
          if (result.data.wxSendOpen === '1') {
            result.data.sendOpen = true;
          } else {
            result.data.sendOpen = false;
          }
        } else if (configGroup.value === 'sms') {
          if (result.data.smsSendOpen === '1') {
            result.data.sendOpen = true;
          } else {
            result.data.sendOpen = false;
          }
        } else {
          if (result.data.mailSendOpen === '1') {
            result.data.sendOpen = true;
          } else {
            result.data.sendOpen = false;
          }
        }
        localParams.value = result.data;
      }
    }
  };

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^\d+$/.test(value);
  const wxRules: FormRules = {
    wxType: {
      required: false,
      trigger: ['blur', 'change'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请选择接入类型');
          }
        }
        return true;
      },
    },
    wxAppId: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入微信AppID');
          }
        }
        return true;
      },
    },
    wxAppSecret: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入微信AppSecret');
          }
        }
        return true;
      },
    },
  };
  const smsRules: FormRules = {
    smsType: {
      required: false,
      trigger: ['blur', 'change'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请选择接入类型');
          }
        }
        return true;
      },
    },
    smsAccessKeyId: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入短信AccessKeyID');
          }
        }
        return true;
      },
    },
    smsAccessKeySecret: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入短信AccessKeySecret');
          }
        }
        return true;
      },
    },
  };
  const mailRules: FormRules = {
    mailHost: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入smtp邮件服务器地址');
          }
        }
        return true;
      },
    },
    mailPort: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入smtp邮件发送端口');
          }
        }
        return true;
      },
    },
    mailAddress: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入发送人邮箱地址');
          }
        }
        return true;
      },
    },
    mailUser: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入发送人邮箱账号');
          }
        }
        return true;
      },
    },
    mailPass: {
      required: false,
      trigger: ['blur', 'input'],
      validator(_rule: any, value: any) {
        if (localParams.value.sendOpen) {
          if (!value || value === '') {
            return new Error('请输入发送人邮箱密码');
          }
        }
        return true;
      },
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.type], ([newShowModel, newType]) => {
    showState.value = newShowModel;
    if (newType && newType.length > 0) {
      configGroup.value = newType;
      loadData();
    }
  });

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        if (configGroup.value === 'wechat') {
          if (localParams.value.sendOpen) {
            localParams.value.wxSendOpen = '1';
          } else {
            localParams.value.wxSendOpen = '0';
          }
        } else if (configGroup.value === 'sms') {
          if (localParams.value.sendOpen) {
            localParams.value.smsSendOpen = '1';
          } else {
            localParams.value.smsSendOpen = '0';
          }
        } else {
          if (localParams.value.sendOpen) {
            localParams.value.mailSendOpen = '1';
          } else {
            localParams.value.mailSendOpen = '0';
          }
        }
        delete localParams.value.sendOpen;
        localParams.value.group = configGroup.value;

        const result = (await editConfig(localParams.value)) as {
          status: string;
          message: string;
        };
        if (result.status === 'success') {
          window['$message'].success('提交成功');
          setTimeout(() => {
            showState.value = false;
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
