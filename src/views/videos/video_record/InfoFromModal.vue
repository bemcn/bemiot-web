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
      <n-form-item label="通道名称" path="channelName">
        <n-input
          maxlength="50"
          placeholder="请输入通道名称"
          v-model:value="localParams.channelName"
          clearable
        />
      </n-form-item>
      <n-form-item label="所属设备" path="deviceName">
        <n-input-group>
          <n-input
            maxlength="50"
            placeholder="请选择所属设备"
            v-model:value="localParams.deviceName"
            readonly
            :disabled="action === 'edit'"
          />
          <n-button ghost :disabled="action === 'edit'" @click="onSelectDevice">选择</n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item label="通道类型" path="channelType">
        <n-select
          v-model:value="localParams.channelType"
          :options="channelTypeOptions"
          placeholder="请选择通道类型"
          :disabled="action === 'edit'"
        />
      </n-form-item>
      <n-form-item label="通道号" path="channel">
        <n-input
          maxlength="8"
          placeholder="请输入通道号"
          v-model:value="localParams.channel"
          clearable
          :allow-input="onlyAllowNumber"
        />
      </n-form-item>
      <n-form-item label="SMTP地址" path="smtpUrl">
        <n-input
          maxlength="255"
          placeholder="请输入SMTP地址"
          v-model:value="localParams.smtpUrl"
          clearable
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
  <SelectDevice
    :showModel="showDeviceModal"
    :types="[3, 4]"
    @close="() => (showDeviceModal = false)"
    @checked="checkDevice"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { addDeviceChannel, editDeviceChannel } from '@/api/video/deviceChannel';
  // @ts-ignore
  import SelectDevice from '@/components/SelectDevice/SelectDevice.vue';

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
      default: () => ({}),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const showDeviceModal = ref(false);
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
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
      label: '视频存储',
      value: '140',
    },
  ];

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], async ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });

  // 表单验证
  const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);
  const rules: FormRules = {
    channelName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入通道名称',
    },
    deviceName: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择所属设备',
    },
    channelType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择通道类型',
    },
    channel: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入通道号',
    },
    smtpUrl: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入SMTP地址',
    },
  };

  // 选择设备
  const onSelectDevice = () => {
    showDeviceModal.value = true;
  };
  const checkDevice = (dataRow: any) => {
    localParams.value.deviceId = dataRow.deviceId;
    localParams.value.deviceName = dataRow.deviceName;
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        let result: { status: any; message: any };
        let params: any;
        if (props.action === 'add') {
          params = {
            deviceId: localParams.value.deviceId,
            channelName: localParams.value.channelName,
            channelType: localParams.value.channelType,
            channel: localParams.value.channel,
            smtpUrl: localParams.value.smtpUrl,
          };
          result = (await addDeviceChannel(params)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          params = {
            channelId: localParams.value.channelId,
            channelName: localParams.value.channelName,
            channel: localParams.value.channel,
            smtpUrl: localParams.value.smtpUrl,
          };
          result = (await editDeviceChannel(params)) as unknown as {
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
