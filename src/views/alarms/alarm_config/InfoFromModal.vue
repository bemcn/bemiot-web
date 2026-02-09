<template>
  <!-- 新增/编辑告警设置 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 860px"
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
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="告警名称" path="alarmName">
          <n-input 
            placeholder="请输入告警名称" 
            v-model:value="localParams.alarmName" 
            clearable 
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="告警级别" path="level">
          <n-select
            placeholder="请选择告警级别"
            :options="levelOptions"
            v-model:value="localParams.level"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="设备属性" path="deviceProperty">
          <n-input 
            placeholder="请输入设备属性" 
            v-model:value="localParams.deviceProperty" 
            clearable 
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="设备名称" path="deviceName">
          <n-input 
            placeholder="请输入设备名称" 
            v-model:value="localParams.deviceName" 
            clearable 
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="最小值" path="minValue">
          <n-input-number 
            placeholder="请输入最小值" 
            v-model:value="localParams.minValue" 
            clearable 
            :precision="2"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="最大值" path="maxValue">
          <n-input-number 
            placeholder="请输入最大值" 
            v-model:value="localParams.maxValue" 
            clearable 
            :precision="2"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="响应方式" path="responseMethods">
          <n-checkbox-group v-model:value="localParams.responseMethods">
            <n-space>
              <n-checkbox value="message" label="消息通知" />
              <n-checkbox value="sms" label="短信通知" />
            </n-space>
          </n-checkbox-group>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="通知人员" path="notifyUsers">
          <n-select
            multiple
            placeholder="请选择通知人员"
            :options="userOptions"
            v-model:value="localParams.notifyUsers"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="状态" path="status">
          <n-switch v-model:value="localParams.status">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
          </n-switch>
        </n-form-item-gi>
      </n-grid>
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
  import { reactive, ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';

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
        id: 0,
        alarmName: '',
        level: null,
        deviceProperty: '',
        deviceName: '',
        minValue: undefined,
        maxValue: undefined,
        responseMethods: [],
        notifyUsers: [],
        status: true,
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

  // 告警级别选项
  const levelOptions = [
    {
      label: '紧急告警',
      value: 1,
    },
    {
      label: '重要告警',
      value: 2,
    },
    {
      label: '一般告警',
      value: 3,
    },
  ];

  // 用户选项（模拟数据）
  const userOptions = [
    {
      label: '张三',
      value: 'zhangsan',
    },
    {
      label: '李四',
      value: 'lisi',
    },
    {
      label: '王五',
      value: 'wangwu',
    },
    {
      label: '赵六',
      value: 'zhaoliu',
    },
  ];

  // 表单验证
  const rules: FormRules = {
    alarmName: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入告警名称',
      },
    ],
    level: [
      {
        required: true,
        type: 'number',
        trigger: ['blur', 'change'],
        message: '请选择告警级别',
      },
    ],
    deviceProperty: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入设备属性',
      },
    ],
    deviceName: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入设备名称',
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
      localParams.value = {
        ...newParams,
        status: newParams.status === 1 ? true : false
      };
    }
  );

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        // 模拟提交请求
        setTimeout(() => {
          window['$message'].success('提交成功');
          showState.value = false;
          emit('submit');
          formBtnLoading.value = false;
        }, 500);
      } else {
        window['$message'].error('请填写完整信息');
        formBtnLoading.value = false;
      }
    });
  };
</script>