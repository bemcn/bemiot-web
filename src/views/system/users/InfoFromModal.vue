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
      :rules="fromAction === 'add' ? rulesAdd : rulesEdit"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="用户账号" path="userName">
        <n-input
          maxlength="20"
          placeholder="请输入用户账号"
          v-model:value="localParams.userName"
          clearable
          :disabled="fromAction === 'edit'"
        />
      </n-form-item>
      <n-form-item label="用户密码" path="passWord">
        <n-input
          type="password"
          maxlength="20"
          :placeholder="fromAction === 'add' ? '请输入用户密码' : '不修改密码，请留空'"
          clearable
          v-model:value="localParams.passWord"
        />
      </n-form-item>
      <n-form-item label="角色权限" path="roleId">
        <n-select v-model:value="localParams.roleId" :options="roleOptions" placeholder="请选择" />
      </n-form-item>
      <n-form-item label="姓名昵称" path="nickName">
        <n-input
          maxlength="20"
          placeholder="请输入姓名或昵称"
          clearable
          v-model:value="localParams.nickName"
        />
      </n-form-item>
      <n-form-item label="性别" path="sex">
        <n-radio-group v-model:value="localParams.sex" name="sex-group">
          <n-space>
            <n-radio :value="1" :checked="localParams.sex === 1">男</n-radio>
            <n-radio :value="2" :checked="localParams.sex === 2">女</n-radio>
            <n-radio :value="0" :checked="localParams.sex === 0">未知</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="手机号码" path="phone">
        <n-input
          maxlength="11"
          placeholder="请输入手机号码"
          v-model:value="localParams.phone"
          clearable
          :allow-input="onlyAllowNumber"
        />
      </n-form-item>
      <n-form-item label="电子邮箱" path="email">
        <n-input
          maxlength="50"
          placeholder="请输入电子邮箱"
          clearable
          v-model:value="localParams.email"
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
  import { addUser, editUser } from '@/api/system/user';

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
  const roleOptions = ref<any[]>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);
  const inputValidationPhone = (_rule: FormItemRule, value: string) => {
    if (value !== '') {
      return /^1[3456789]\d{9}$/.test(value);
    }
    return true;
  };
  const inputValidationMail = (_rule: FormItemRule, value: string) => {
    if (value !== '') {
      // 使用标准的邮箱验证正则表达式
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }
    return true;
  };

  // 表单验证
  const rulesAdd: FormRules = {
    userName: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入用户账号',
      },
      {
        min: 4,
        max: 20,
        message: '用户账号长度在 4 到 20 个字符',
        trigger: ['blur', 'input'],
      },
    ],
    passWord: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入用户密码',
      },
      {
        min: 4,
        max: 20,
        message: '用户密码长度在 4 到 20 个字符',
        trigger: ['blur', 'input'],
      },
    ],
    roleId: {
      required: true,
      message: '请选择角色权限',
      trigger: ['blur', 'change'],
    },
    nickName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入姓名昵称',
    },
    phone: {
      validator: inputValidationPhone,
      trigger: ['blur', 'input'],
      message: '手机号码格式错误',
    },
    email: {
      validator: inputValidationMail,
      trigger: ['blur', 'input'],
      message: '电子邮箱格式错误',
    },
  };
  const rulesEdit: FormRules = {
    passWord: [
      {
        min: 4,
        max: 20,
        message: '用户密码长度在 4 到 20 个字符',
        trigger: ['blur', 'input'],
      },
    ],
    roleId: {
      required: true,
      message: '请选择角色权限',
      trigger: ['blur', 'input'],
    },
    nickName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入姓名昵称',
    },
    phone: {
      validator: inputValidationPhone,
      trigger: ['blur', 'input'],
      message: '手机号码格式错误',
    },
    email: {
      validator: inputValidationMail,
      trigger: ['blur', 'input'],
      message: '电子邮箱格式错误',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.roles, () => props.params],
    ([newShowModel, newAction, newRoles, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;
      localParams.value = newParams;
      roleOptions.value = newRoles;
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
          result = (await addUser(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editUser(localParams.value)) as unknown as {
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
