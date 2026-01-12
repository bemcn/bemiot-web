<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 680px"
    title="查询规则"
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
      <n-form-item label="选择设备" path="deviceName">
        <n-input-group>
          <n-input :value="localParams.deviceName" readonly placeholder="请选择设备" />
          <n-button @click="handleSelectDevice">选择</n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item label="选择物模型" path="modelName">
        <n-input-group>
          <n-input :value="localParams.modelName" readonly placeholder="请选择物模型" />
          <n-button :disabled="localParams.deviceId === ''" @click="handleSelectModel"
            >选择</n-button
          >
        </n-input-group>
      </n-form-item>
      <n-form-item label="时间范围" path="timeFrame">
        <n-select
          v-model:value="localParams.timeFrame"
          :options="timeFrameOptions"
          placeholder="请选择时间范围"
        />
      </n-form-item>
      <n-form-item
        label="查询条件"
        path="timeData"
        v-if="
          localParams.timeFrame === 'min' ||
          localParams.timeFrame === 'hour' ||
          localParams.timeFrame === 'day'
        "
      >
        <n-input-group>
          <n-input
            maxlength="4"
            placeholder="请输入"
            v-model:value="localParams.timeData"
            clearable
            :allow-input="onlyAllowInt"
          />
          <n-input-group-label>{{
            localParams.timeFrame === 'min'
              ? '分钟前'
              : localParams.timeFrame === 'hour'
              ? '小时前'
              : '天前'
          }}</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item
        label="查询条件"
        :show-feedback="false"
        v-else-if="
          localParams.timeFrame === 'betweenDate' || localParams.timeFrame === 'betweenDateTime'
        "
      >
        <n-input-group>
          <n-form-item :show-label="false" path="dateTime1">
            <n-date-picker
              v-model:value="localParams.dateTime1"
              :type="localParams.timeFrame === 'betweenDate' ? 'date' : 'datetime'"
            />
          </n-form-item>
          <n-input-group-label>至</n-input-group-label>
          <n-form-item :show-label="false" path="dateTime2">
            <n-date-picker
              v-model:value="localParams.dateTime2"
              :type="localParams.timeFrame === 'betweenDate' ? 'date' : 'datetime'"
            />
          </n-form-item>
        </n-input-group>
      </n-form-item>
      <n-form-item label="查询条件" :show-feedback="false" v-else>
        <n-input-group>
          <n-form-item :show-label="false" path="dateTime1">
            <n-time-picker v-model:value="localParams.dateTime1" />
          </n-form-item>
          <n-input-group-label>至</n-input-group-label>
          <n-form-item :show-label="false" path="dateTime2">
            <n-time-picker v-model:value="localParams.dateTime2" />
          </n-form-item>
        </n-input-group>
      </n-form-item>
      <n-form-item label="查询输出" path="queryOut">
        <n-select
          v-model:value="localParams.queryOut"
          :options="queryOutOptions"
          placeholder="请选择查询输出"
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
    :type="modelType"
    @close="() => (showDeviceModal = false)"
    @checked="handleCheckDevice"
  />
  <CheckDeviceModel
    :showModel="showModelModal"
    :devId="localParams?.deviceId"
    devClass=""
    @close="() => (showModelModal = false)"
    @checked="handleCheckModel"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { FormRules } from 'naive-ui';
  import { format } from 'date-fns';
  // @ts-ignore
  import { PlusOutlined, MinusOutlined } from '@vicons/antd';
  // @ts-ignore
  import SelectDevice from '../../SelectDevice/SelectDevice.vue';
  // @ts-ignore
  import CheckDeviceModel from '../../SelectDeviceModel/CheckDeviceModel.vue';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    data: {
      type: Object as PropType<any>,
      default: null,
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const subassemblyId = ref('');
  const modelType = ref('');
  const nodeData: any = ref(null);
  const localParams = ref<any>({
    id: '',
    deviceId: '',
    deviceName: '',
    location: '',
    productId: '',
    modelIdentity: '',
    modelName: '',
    timeFrame: 'min',
    timeData: '10',
    queryOut: 'latestValue',
    valueType: '',
    inputValue: '',
    outputValue: '',
    unit: '',
    dateTime1: null,
    dateTime2: null,
  });
  const showDeviceModal = ref(false); //显示数据节点选择
  const showModelModal = ref(false);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const timeFrameOptions = ref([
    {
      label: '分钟范围查询',
      value: 'min',
    },
    {
      label: '小时范围查询',
      value: 'hour',
    },
    {
      label: '日范围查询',
      value: 'day',
    },
    {
      label: '时间范围查询',
      value: 'betweenTime',
    },
    {
      label: '日期范围查询',
      value: 'betweenDate',
    },
    {
      label: '日期时间范围查询',
      value: 'betweenDateTime',
    },
  ]);
  const queryOutOptions = [
    {
      label: '初始值',
      value: 'initialValue',
    },
    {
      label: '最新值',
      value: 'latestValue',
    },
    {
      label: '数量统计',
      value: 'countValue',
    },
    {
      label: '求和',
      value: 'sumValue',
    },
    {
      label: '最大值',
      value: 'maxValue',
    },
    {
      label: '最小值',
      value: 'minValue',
    },
    {
      label: '最小与最大差值',
      value: 'spreadValue',
    },
    {
      label: '平均值',
      value: 'averageValue',
    },
    {
      label: '均方差',
      value: 'stddevValue',
    },
  ];

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^\d+$/.test(value);
  const rules: FormRules = {
    deviceName: {
      required: true,
      message: '请选择设备',
      trigger: ['blur', 'change'],
    },
    modelName: {
      required: true,
      message: '请选择物模型',
      trigger: ['blur', 'change'],
    },
    timeFrame: {
      required: true,
      message: '请选择时间范围',
      trigger: ['blur', 'change'],
    },
    timeData: {
      validator(_rule: any, value: any) {
        if (!localParams.value || !localParams.value.properties) {
          return true; // 如果nodeData不存在，不验证
        }
        const timeFrame = localParams.value.timeFrame;
        if (timeFrame === 'min' || timeFrame === 'hour' || timeFrame === 'day') {
          if (!value) {
            return new Error('请输入时间数据');
          }
          return true;
        }
        return true; // 其他情况不验证
      },
      trigger: ['blur', 'change'],
    },
    queryOut: {
      required: true,
      message: '请选择查询输出',
      trigger: ['blur', 'change'],
    },
    dateTime1: {
      validator(_rule: any, value: any) {
        if (!localParams.value || !localParams.value.properties) {
          return true; // 如果nodeData不存在，不验证
        }
        const timeFrame = localParams.value.timeFrame;
        if (timeFrame === 'min' || timeFrame === 'hour' || timeFrame === 'day') {
          return true; // min/hour/day情况下不验证dateTime1
        } else if (
          timeFrame === 'betweenTime' ||
          timeFrame === 'betweenDate' ||
          timeFrame === 'betweenDateTime'
        ) {
          // 对于时间、日期和日期时间范围查询，验证值是否为有效的时间戳
          if (value === null || value === undefined || isNaN(value)) {
            return new Error('请选择开始日期或时间');
          }
          return true;
        }
        return true; // 其他情况不验证
      },
      trigger: ['blur', 'change'],
    },
    dateTime2: {
      validator(_rule: any, value: any) {
        if (!localParams.value || !localParams.value.properties) {
          return true; // 如果nodeData不存在，不验证
        }
        const timeFrame = localParams.value.timeFrame;
        if (timeFrame === 'min' || timeFrame === 'hour' || timeFrame === 'day') {
          return true; // min/hour/day情况下不验证dateTime2
        } else if (
          timeFrame === 'betweenTime' ||
          timeFrame === 'betweenDate' ||
          timeFrame === 'betweenDateTime'
        ) {
          // 对于时间、日期和日期时间范围查询，验证值是否为有效的时间戳
          if (value === null || value === undefined || isNaN(value)) {
            return new Error('请选择截止日期或时间');
          }
          return true;
        }
        return true; // 其他情况不验证
      },
      trigger: ['blur', 'change'],
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.id, () => props.type, () => props.data],
    async ([newShowModel, newId, newType, newData]) => {
      showState.value = newShowModel;
      if (newShowModel && newShowModel === true) {
        subassemblyId.value = newId;
        modelType.value = newType;

        // 使用深拷贝避免observable对象重复引用问题
        nodeData.value = newData ? cloneDeep(newData) : {};
        const properties = nodeData.value.properties;

        let timestamp1: number | null = null;
        let timestamp2: number | null = null;
        if (properties) {
          const timeFrame = properties.timeFrame;
          const timeData = properties.timeData;
          if (timeFrame === 'betweenDate' || timeFrame === 'betweenDateTime') {
            const timeDataArr = timeData.split(',');
            if (timeDataArr.length == 2) {
              try {
                const date1 = timeDataArr[0];
                const date2 = timeDataArr[1];
                timestamp1 = new Date(date1).getTime();
                timestamp2 = new Date(date2).getTime();
              } catch (_error) {}
            }
          } else if (timeFrame === 'betweenTime') {
            const timeDataArr = timeData.split(':');
            if (timeDataArr.length == 2) {
              try {
                const time1 = timeDataArr[0];
                const time2 = timeDataArr[1];

                const today = new Date();
                const dateStr = today.toISOString().split('T')[0];
                const fullDateTime1 = `${dateStr}T${time1}`;
                const fullDateTime2 = `${dateStr}T${time2}`;

                timestamp1 = new Date(fullDateTime1).getTime();
                timestamp2 = new Date(fullDateTime2).getTime();
              } catch (_error) {}
            }
          }

          localParams.value = {
            id: properties.id,
            deviceId: properties.deviceId,
            deviceName: properties.deviceName,
            location: properties.location,
            productId: properties.productId,
            modelIdentity: properties.modelIdentity,
            modelName: properties.modelName,
            timeFrame: properties.timeFrame,
            timeData: properties.timeData + '',
            queryOut: properties.queryOut,
            valueType: properties.valueType,
            unit: properties.unit,
            dateTime1: timestamp1,
            dateTime2: timestamp2,
          };
        }
      }
    }
  );

  const handleSelectDevice = () => {
    showDeviceModal.value = true;
  };
  const handleCheckDevice = (data: any) => {
    showDeviceModal.value = false;
    localParams.value.deviceId = data.deviceId;
    localParams.value.deviceName = data.deviceName;
    localParams.value.location = data.spaceRouteName;
    localParams.value.productId = data.productId;
    formRef.value?.restoreValidation?.('deviceName');
  };

  const handleSelectModel = () => {
    showModelModal.value = true;
  };
  const handleCheckModel = (data: any) => {
    showModelModal.value = false;
    const dataDefinition = data.dataDefinition;
    let unit = '';
    if (data.dataDefinition) {
      const definition = JSON.parse(dataDefinition);
      if (definition.hasOwnProperty('unit')) {
        unit = definition.unit;
      }
    }

    localParams.value.id = data.modelId;
    localParams.value.modelIdentity = data.modelIdentity;
    localParams.value.modelName = data.modelName;
    localParams.value.valueType = data.dataType;
    localParams.value.valueType = data.dataType;
    localParams.value.unit = unit;
    formRef.value?.restoreValidation?.('modelName');
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;

    // 使用 try-catch 确保 Promise 错误被捕获
    (async () => {
      try {
        await formRef.value.validate();
        const timeFrame = localParams.value.timeFrame;
        const dateTime1 = localParams.value.dateTime1;
        const dateTime2 = localParams.value.dateTime2;
        if (timeFrame === 'betweenTime') {
          const tm1 = format(new Date(dateTime1), 'HH:mm:ss');
          const tm2 = format(new Date(dateTime2), 'HH:mm:ss');
          localParams.value.timeData = `${tm1},${tm2}`;
        } else if (timeFrame === 'betweenDate') {
          const tm1 = format(new Date(dateTime1), 'yyyy-MM-dd');
          const tm2 = format(new Date(dateTime2), 'yyyy-MM-dd');
          localParams.value.timeData = `${tm1},${tm2}`;
        } else if (timeFrame === 'betweenDateTime') {
          const tm1 = format(new Date(dateTime1), 'yyyy-MM-dd HH:mm:ss');
          const tm2 = format(new Date(dateTime2), 'yyyy-MM-dd HH:mm:ss');
          localParams.value.timeData = `${tm1},${tm2}`;
        }

        nodeData.value.properties.id = localParams.value.id;
        nodeData.value.properties.deviceId = localParams.value.deviceId;
        nodeData.value.properties.deviceName = localParams.value.deviceName;
        nodeData.value.properties.location = localParams.value.location;
        nodeData.value.properties.productId = localParams.value.productId;
        nodeData.value.properties.modelIdentity = localParams.value.modelIdentity;
        nodeData.value.properties.modelName = localParams.value.modelName;
        nodeData.value.properties.timeFrame = localParams.value.timeFrame;
        nodeData.value.properties.timeData = localParams.value.timeData;
        nodeData.value.properties.queryOut = localParams.value.queryOut;
        nodeData.value.properties.valueType = localParams.value.valueType;
        nodeData.value.properties.unit = localParams.value.unit;

        showState.value = false;
        // 提交深拷贝的数据，防止循环引用
        emit('submit', cloneDeep(nodeData.value));
      } catch (errors) {
        console.log('验证失败', errors);
        window['$message']?.error('请填写完整信息');
      } finally {
        formBtnLoading.value = false;
      }
    })();
  };
</script>
