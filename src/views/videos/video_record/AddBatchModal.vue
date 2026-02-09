<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 940px"
    title="创建视频通道"
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
      <n-form-item label="所属设备" path="deviceId">
        <n-cascader
          v-model:value="localParams.deviceId"
          placeholder="请选择所属设备"
          expand-trigger="click"
          check-strategy="child"
          :options="deviceOptions"
          clearable
        />
      </n-form-item>
      <n-form-item label="通道类型" path="channelType">
        <n-select
          v-model:value="localParams.channelType"
          :options="channelTypeOptions"
          placeholder="请选择通道类型"
        />
      </n-form-item>
      <n-form-item label="入网地址" path="ipAddress">
        <n-input-group>
          <n-input-group-label>rtsp://</n-input-group-label>
          <n-input
            maxlength="50"
            placeholder="请输入ip或域名"
            v-model:value="localParams.ipAddress"
            clearable
          />
        </n-input-group>
      </n-form-item>
      <n-form-item label="入网端口" path="port">
        <n-input
          maxlength="8"
          placeholder="请输入开始IP地址"
          v-model:value="localParams.port"
          clearable
          :allow-input="onlyAllowNumber"
        />
      </n-form-item>
      <n-form-item label="设备账号" path="account">
        <n-input
          maxlength="50"
          placeholder="请输入设备账号"
          v-model:value="localParams.account"
          clearable
        />
      </n-form-item>
      <n-form-item label="设备密码" path="password">
        <n-input
          maxlength="50"
          placeholder="请输入设备密码"
          v-model:value="localParams.password"
          clearable
        />
      </n-form-item>
      <n-form-item label="PTZ类型" path="ptzType">
        <n-select
          v-model:value="localParams.ptzType"
          :options="ptzOptions"
          placeholder="请选择PTZ类型"
        />
      </n-form-item>
      <n-form-item label="生成数量" path="count">
        <n-input
          maxlength="2"
          placeholder="请输入批量生成数量"
          v-model:value="localParams.count"
          clearable
          :allow-input="onlyAllowNumber"
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
  import { addDeviceChannelArray } from '@/api/video/deviceChannel';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    deviceOption: {
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
  const deviceOptions = ref<any[]>([]);
  const channelTypeOptions = [
    {
      label: '报警控制器',
      value: '117',
    },
    {
      label: '摄像机',
      value: '131',
    },
    {
      label: 'IPC网络摄像机',
      value: '132',
    },
    {
      label: '显示器',
      value: '133',
    },
    {
      label: '报警输入设备',
      value: '134',
    },
    {
      label: '报警输出设备',
      value: '135',
    },
    {
      label: '语音输入设备',
      value: '136',
    },
    {
      label: '语音输出设备',
      value: '137',
    },
    {
      label: '移动传输设备',
      value: '138',
    },
    {
      label: 'URL拉流',
      value: '139',
    },
    {
      label: 'URL代理拉流',
      value: '140',
    },
  ];
  const ptzOptions = [
    {
      label: '无PTZ类型',
      value: '0',
    },
    {
      label: 'ONVIF',
      value: '1',
    },
    {
      label: 'Pelco-P',
      value: '2',
    },
    {
      label: 'Pelco-P',
      value: '3',
    },
    {
      label: 'VISCA',
      value: '4',
    },
    {
      label: 'HTTP',
      value: '5',
    },
    {
      label: '其他',
      value: '6',
    },
  ];

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.deviceOption, () => props.params],
    async ([newShowModel, newOptions, newParams]) => {
      showState.value = newShowModel;
      localParams.value = newParams;
      if (newOptions) {
        deviceOptions.value = newOptions[0].children;
      }
    }
  );

  // 表单验证
  const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);
  const rules: FormRules = {
    deviceId: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择所属设备',
    },
    channelType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择通道类型',
    },
    count: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入生成数量',
    },
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const devId = localParams.value.deviceId;
        const deviceId = devId.replace('D-', '');
        const params = {
          deviceId,
          channelType: localParams.value.channelType,
          ipAddress: localParams.value.ipAddress,
          port: localParams.value.port,
          account: localParams.value.account,
          password: localParams.value.password,
          ptzType: localParams.value.ptzType,
          count: localParams.value.count,
        };

        const result = (await addDeviceChannelArray(params)) as unknown as {
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
