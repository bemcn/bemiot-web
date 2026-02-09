<template>
  <!-- 生成设备编号和通道 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 640px"
    title="生成设备编号和通道"
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
      <n-form-item label="视频服务器" path="serverKey">
        <n-select
          v-model:value="localParams.serverKey"
          :options="serverOptions"
          placeholder="请选择视频服务器"
        />
      </n-form-item>
      <n-form-item label="设备类型" path="deviceType">
        <n-select
          v-model:value="localParams.deviceType"
          :options="deviceTypeOptions"
          placeholder="请选择设备类型"
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
  import { useMainChannel } from '@/api/devices/device';
  import { getVideoServerList, VideoServerParams } from '@/api/video/videoServer';
  import { uniqueId } from '@/utils/env';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref({
    district: null,
    deviceType: null,
    channelType: null,
    channelCount: '1',
    mainChannel: null,
    code: '',
  });
  const serverOptions = ref<any[]>([]);
  const serverList = ref<any[]>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  const deviceTypeOptions = [
    {
      label: 'DVR',
      value: '111',
    },
    {
      label: 'NVR',
      value: '118',
    },
    {
      label: 'HVR',
      value: '130',
    },
    {
      label: '视频服务器',
      value: '112',
    },
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
  ];

  // 表单验证
  const rules: FormRules = {
    serverKey: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择视频服务器',
    },
    deviceType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择设备类型',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel], async ([newShowModel]) => {
    showState.value = newShowModel;
    if (newShowModel && newShowModel === true) {
      serverList.value = await createServerList();
      serverOptions.value = serverList.value.map((item) => ({
        label: item.serverName,
        value: item.serverKey,
      }));
    }
  });

  /**
   * 获取服务器列表
   */
  const createServerList = async () => {
    const params: VideoServerParams = {
      status: 2,
      key: '',
    };
    const result = (await getVideoServerList(params)) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [];
    }
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const serverKey = localParams.value.serverKey;
        let serverType = 'BEM SIP';
        for (let i = 0; i < serverList.value.length; i++) {
          if (serverList.value[i].serverKey === serverKey) {
            serverType = serverList.value[i].serverType;
            break;
          }
        }
        if (serverType === 'ZLMediaKit') {
          const devCode = 'C' + uniqueId();
          localParams.value.serverKey = serverKey;
          localParams.value.videoDomain = '';
          localParams.value.mainChannel = 0;
          localParams.value.code = devCode;
          showState.value = false;
          emit('submit', localParams.value);
        } else {
          const deviceType = localParams.value.deviceType;
          const videoDomain = serverKey + deviceType;

          //获取可用主通道号
          const params = {
            videoDomain,
          };
          const result = (await useMainChannel(params)) as unknown as {
            status: string;
            message: string;
            data: number;
          };
          if (result.status === 'success') {
            const mainChannel = result.data;
            let mainCodeStr = mainChannel + '';
            let len = 4 - mainCodeStr.length;
            for (let i = 0; i < len; i++) {
              mainCodeStr = '0' + mainCodeStr;
            }
            const deviceCode = videoDomain + mainCodeStr;
            localParams.value.serverKey = serverKey;
            localParams.value.videoDomain = videoDomain;
            localParams.value.mainChannel = mainChannel;
            localParams.value.code = deviceCode;
            showState.value = false;
            emit('submit', localParams.value);
          } else {
            window['$message'].error(result.message);
          }
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };
</script>
