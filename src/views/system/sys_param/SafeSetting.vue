<template>
  <n-grid cols="12" item-responsive responsive="screen">
    <n-grid-item span="12 m:11 l:10 xl:9 2xl:8">
      <n-form
        style="padding: 20px"
        label-placement="left"
        label-width="auto"
        :model="formValue"
        :rules="rules"
        ref="formRef"
      >
        <n-form-item label="账号初始密码" path="initPassword" :first="true">
          <n-input
            v-model:value="formValue.initPassword"
            maxlength="20"
            clearable
            placeholder="请输入账号初始密码"
          />
        </n-form-item>

        <n-form-item label="密码最小长度" path="pwdMinLength" :first="true">
          <n-input-number
            :min="1"
            :max="36"
            v-model:value="formValue.pwdMinLength"
            clearable
            button-placement="both"
            placeholder="请输入密码最小长度"
          />
        </n-form-item>

        <n-form-item label="密码最大长度" path="pwdMaxLength" :first="true">
          <n-input-number
            :min="1"
            :max="36"
            v-model:value="formValue.pwdMaxLength"
            clearable
            button-placement="both"
            placeholder="请输入密码最大长度"
          />
        </n-form-item>

        <n-form-item label="包含大写字母">
          <n-switch v-model:value="formValue.pwdUpperCase" />
        </n-form-item>

        <n-form-item label="包含小写字母">
          <n-switch v-model:value="formValue.pwdLowerCase" />
        </n-form-item>

        <n-form-item label="包含数字">
          <n-switch v-model:value="formValue.pwdNumber" />
        </n-form-item>

        <n-form-item label="包含复杂字符">
          <n-switch v-model:value="formValue.pwdChars" />
        </n-form-item>

        <n-form-item label="密码错误次数">
          <n-input-group>
            <n-input-number
              :min="0"
              :max="20"
              v-model:value="formValue.passErrorCount"
              clearable
              button-placement="both"
              placeholder="请输入密码错误次数"
            />
            <n-input-group-label>次</n-input-group-label>
          </n-input-group>
        </n-form-item>

        <n-form-item label="密码锁定时间">
          <n-input-group>
            <n-input-number
              :min="0"
              :max="20"
              v-model:value="formValue.loginTimeAgain"
              clearable
              button-placement="both"
              placeholder="超过错误次数锁定时间"
            />
            <n-input-group-label>分钟</n-input-group-label>
          </n-input-group>
        </n-form-item>

        <div>
          <n-space>
            <n-button type="primary" style="width: 160px" @click="formSubmit">确 认</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { getConfigParams, editConfig } from '@/api/system/systemConfig';

  const rules = {
    initPassword: {
      required: true,
      message: '请输入账号初始密码',
      trigger: 'blur',
    },
    pwdMinLength: {
      required: true,
      message: '请输入密码最小长度',
      type: 'number',
      trigger: ['input', 'blur'],
    },
    pwdMaxLength: {
      required: true,
      message: '不能为空且必须大于最小长度',
      type: 'number',
      trigger: ['input', 'blur'],
      validator(_rule: any, value: number) {
        if (value <= formValue.value.pwdMinLength) {
          return new Error('密码最大长度必须大于最小长度');
        }
        return true;
      },
    },
  };

  const formRef: any = ref(null);
  const message = useMessage();

  interface SafeForm {
    initPassword: string;
    pwdMinLength: string;
    pwdMaxLength: string;
    pwdUpperCase: string;
    pwdLowerCase: string;
    pwdNumber: string;
    pwdChars: string;
    passErrorCount: string;
    loginTimeAgain: string;
  }

  const formValue = ref({
    group: '',
    initPassword: '',
    pwdMinLength: 1,
    pwdMaxLength: 20,
    pwdUpperCase: false,
    pwdLowerCase: false,
    pwdNumber: true,
    pwdChars: false,
    passErrorCount: 0,
    loginTimeAgain: 0,
  });

  const getSafe = async () => {
    const params = {
      group: 'safe',
    };
    const result = (await getConfigParams(params)) as {
      status: string;
      message: string;
      data: SafeForm;
    };
    if (result.status === 'success') {
      const { data } = result;
      formValue.value = {
        group: 'safe',
        initPassword: data.initPassword,
        pwdMinLength: parseInt(data.pwdMinLength),
        pwdMaxLength: parseInt(data.pwdMaxLength),
        pwdUpperCase: formatBool(data.pwdUpperCase),
        pwdLowerCase: formatBool(data.pwdLowerCase),
        pwdNumber: formatBool(data.pwdNumber),
        pwdChars: formatBool(data.pwdChars),
        passErrorCount: parseInt(data.passErrorCount),
        loginTimeAgain: parseInt(data.loginTimeAgain),
      };
    } else {
      message.info(result.message);
    }
  };

  const formatBool = (value: string) => {
    return value === 'true' ? true : false;
  };

  const formSubmit = () => {
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const result = (await editConfig(formValue.value)) as {
          status: string;
          message: string;
        };
        if (result.status === 'success') {
          message.success('提交成功');
        } else {
          message.error(result.message);
        }
      } else {
        message.error('验证失败，请填写完整信息');
      }
    });
  };

  onMounted(async () => {
    getSafe();
  });
</script>
