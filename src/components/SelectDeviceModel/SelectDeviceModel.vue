<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 640px"
    title="选择物模型"
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
      <n-form-item label="设备编号" path="deviceId">
        <n-input-group>
          <n-input placeholder="请选择设备" v-model:value="localParams.deviceId" readonly />
          <n-button ghost @click="handleCheckDevice">选择</n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item label="设备名称" path="deviceName">
        <n-input :value="localParams.deviceName" readonly />
      </n-form-item>
      <n-form-item label="设备位置" path="spaceRouteName">
        <n-input :value="localParams.spaceRouteName" readonly />
      </n-form-item>
      <n-form-item label="模型标识" path="modelIdentity">
        <n-input-group>
          <n-input placeholder="请选择物模型" v-model:value="localParams.modelIdentity" readonly />
          <n-button ghost @click="handleCheckModel">选择</n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item label="模型名称" path="modelName">
        <n-input :value="localParams.modelName" readonly />
      </n-form-item>
      <n-form-item label="模型类别" path="modelName">
        <n-input :value="getModelClass(localParams.modelClass)" readonly />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>

  <CheckDevice
    :showModel="showDeviceModal"
    @close="() => (showDeviceModal = false)"
    @checked="receivedDevice"
  />
  <CheckDeviceModel
    :showModel="showModelModal"
    :devId="localParams.deviceId"
    :devClass="popModelClass"
    @close="() => (showModelModal = false)"
    @checked="receivedModel"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { getDeviceModel, ModelParams } from '@/api/devices/deviceModel';
  // @ts-ignore
  import CheckDevice from './CheckDevice.vue';
  // @ts-ignore
  import CheckDeviceModel from './CheckDeviceModel.vue';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    id: {
      type: String,
      default: '',
    },
    deviceId: {
      type: String,
      default: '',
    },
    identity: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  });

  // 回调
  const emit = defineEmits(['close', 'checked']);

  const showState = ref(false);
  const showDeviceModal = ref(false);
  const showModelModal = ref(false);
  const subassemblyId = ref('');
  const popModelClass = ref('');
  const localParams: any = ref({
    deviceId: '',
    deviceName: '',
    spaceRouteName: '',
    modelId: '',
    modelIdentity: '',
    modelName: '',
    productId: '',
    modelType: '',
    modelClass: '',
    dataType: '',
    dataDefinition: '',
    charts: 0,
    monitor: 0,
    history: 0,
    readonly: 0,
    share: 0,
    createTime: '',
    value: '',
    status: 0,
  });
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const rules: FormRules = {
    deviceId: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请选择设备',
    },
    modelIdentity: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请选择物模型',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [
      () => props.showModel,
      () => props.id,
      () => props.deviceId,
      () => props.identity,
      () => props.type,
    ],
    ([newShowModel, newId, newDeviceId, newIdentity, newClass]) => {
      showState.value = newShowModel;
      let isHasData = false;
      if (newShowModel === true) {
        subassemblyId.value = newId;
        popModelClass.value = newClass;
        if (newDeviceId && newDeviceId !== '' && newIdentity && newIdentity !== '') {
          isHasData = true;
          loadData(newDeviceId, newIdentity);
        }
      }
      if (!isHasData) {
        localParams.value = {
          deviceId: '',
          deviceName: '',
          spaceRouteName: '',
          modelId: '',
          modelIdentity: '',
          modelName: '',
          productId: '',
          modelType: '',
          modelClass: '',
          dataType: '',
          dataDefinition: '',
          charts: 0,
          monitor: 0,
          history: 0,
          readonly: 0,
          share: 0,
          createTime: '',
          value: '',
          status: 0,
        };
      }
    }
  );

  const loadData = async (deviceId: string, identity: string) => {
    let params = {
      deviceId,
      identity,
    } as ModelParams;

    const result = (await getDeviceModel(params)) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      const device = result.data.device;
      const model = result.data.model;
      localParams.value = {
        deviceId: deviceId,
        deviceName: device.deviceName,
        spaceRouteName: device.spaceRouteName,
        modelId: model.modelId,
        modelIdentity: model.modelIdentity,
        modelName: model.modelName,
        productId: model.productId,
        modelType: model.modelType,
        modelClass: model.modelClass,
        dataType: model.dataType,
        dataDefinition: model.dataDefinition,
        charts: model.charts,
        monitor: model.monitor,
        history: model.history,
        readonly: model.readonly,
        share: model.share,
        createTime: model.createTime,
        value: model.value,
        status: model.status,
      };
    }
  };

  const getModelClass = (modelClass: number) => {
    switch (modelClass) {
      case 1:
        return '属性';
      case 2:
        return '服务';
      case 3:
        return '事件';
      default:
        return '';
    }
  };

  const handleCheckDevice = () => {
    showDeviceModal.value = true;
  };
  const receivedDevice = (device: any) => {
    showDeviceModal.value = false;
    localParams.value.deviceId = device.deviceId;
    localParams.value.deviceName = device.deviceName;
    localParams.value.spaceRouteName = device.spaceRouteName;
    
    // 手动验证该字段
    if (formRef.value) {
      formRef.value.restoreValidation('deviceId');
      formRef.value.validateField('deviceId');
    }
  };

  const handleCheckModel = () => {
    if (localParams.value.deviceId === '') {
      window['$message'].error('请先选择设备');
      return;
    } else {
      showModelModal.value = true;
    }
  };
  const receivedModel = (model: any) => {
    showModelModal.value = false;
    localParams.value.modelId = model.modelId;
    localParams.value.modelIdentity = model.modelIdentity;
    localParams.value.modelName = model.modelName;
    localParams.value.productId = model.productId;
    localParams.value.modelType = model.modelType;
    localParams.value.modelClass = model.modelClass;
    localParams.value.dataType = model.dataType;
    localParams.value.dataDefinition = model.dataDefinition;
    localParams.value.charts = model.charts;
    localParams.value.monitor = model.monitor;
    localParams.value.history = model.history;
    localParams.value.readonly = model.readonly;
    localParams.value.share = model.share;
    localParams.value.createTime = model.createTime;
    localParams.value.value = model.value;
    localParams.value.status = model.status;
    
    // 手动验证该字段
    if (formRef.value) {
      formRef.value.restoreValidation('modelIdentity');
      formRef.value.validateField('modelIdentity');
    }
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        emit('checked', localParams.value);
        showState.value = false; // 关闭模态框
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };
</script>
