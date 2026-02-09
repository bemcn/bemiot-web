<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 480px"
    title="日期计算"
    @after-leave="closeModalAfter"
  >
    <n-form
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="localParams"
      style="padding-top: 10px"
    >
      <n-form-item label="输入值" path="inputValue">
        <n-input placeholder="暂无输入值" v-model:value="nodeData.properties.inputValue" disabled />
      </n-form-item>
      <n-form-item label="计算符" path="timeCompare">
        <n-select
          v-model:value="localParams.timeCompare"
          :options="compareOptions"
          placeholder="请选择计算符"
        />
      </n-form-item>
      <n-form-item label="数量" path="timeValue">
        <n-input
          maxlength="8"
          placeholder="请输入数量"
          v-model:value="localParams.timeValue"
          :allow-input="onlyAllowInt"
          clearable
        />
      </n-form-item>
      <n-form-item label="数量单位" path="timeUtil">
        <n-select
          v-model:value="localParams.timeUtil"
          :options="utilOptions"
          placeholder="请选择数量单位"
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
  // @ts-ignore
  import { PlusOutlined, MinusOutlined } from '@vicons/antd';
  import { format } from 'date-fns';
  import { cloneDeep } from 'lodash-es';
  import { dateUtils } from '../../../utils/dateUtils';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    data: {
      type: Object as PropType<any>,
      default: null,
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const nodeData: any = ref(null);
  const localParams = ref<any>({
    timeCompare: '+',
    timeValue: '1',
    timeUtil: '天',
    inputType: '',
    inputValue: '',
    valueType: '',
    outputValue: '',
  });
  const compareOptions = [
    {
      label: '加',
      value: '+',
    },
    {
      label: '减',
      value: '-',
    },
  ];
  const utilOptions = ref<any[]>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^\d+$/.test(value);
  const rules: FormRules = {
    inputValue: {
      required: true,
      trigger: ['blur', 'input'],
      message: '输入值不能为空，请连接到左边锚点',
    },
    timeCompare: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择计算符',
    },
    timeValue: {
      required: true,
      message: '请输入数量',
      trigger: ['blur', 'input'],
    },
    timeUtil: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择数量单位',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.data], ([newShowModel, newData]) => {
    showState.value = newShowModel;
    if (newShowModel && newShowModel === true) {
      // 使用cloneDeep创建数据副本，避免MobX的observable对象重复引用问题
      nodeData.value = newData ? cloneDeep(newData) : {};
      const properties = nodeData.value.properties;
      localParams.value = {
        timeCompare: properties.timeCompare,
        timeValue: properties.timeValue,
        timeUtil: properties.timeUtil,
        inputType: properties.inputType,
        inputValue: properties.inputValue,
        valueType: properties.valueType,
        outputValue: properties.outputValue,
      };
      if (properties.inputType === 'date') {
        utilOptions.value = [
          {
            label: '年',
            value: 'year',
          },
          {
            label: '月',
            value: 'month',
          },
          {
            label: '星期',
            value: 'week',
          },
          {
            label: '天',
            value: 'day',
          },
        ];
      } else if (properties.inputType === 'datetime' || properties.inputType === 'timestamp') {
        utilOptions.value = [
          {
            label: '年',
            value: 'year',
          },
          {
            label: '月',
            value: 'month',
          },
          {
            label: '星期',
            value: 'week',
          },
          {
            label: '天',
            value: 'day',
          },
          {
            label: '小时',
            value: 'hour',
          },
          {
            label: '分钟',
            value: 'minute',
          },
          {
            label: '秒',
            value: 'second',
          },
          {
            label: '毫秒',
            value: 'millisecond',
          },
        ];
      } else {
        utilOptions.value = [
          {
            label: '小时',
            value: 'hour',
          },
          {
            label: '分钟',
            value: 'minute',
          },
          {
            label: '秒',
            value: 'second',
          },
          {
            label: '毫秒',
            value: 'millisecond',
          },
        ];
      }
    }
  });

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        showState.value = false;
        const inputType = localParams.value.inputType;
        const inputValue = localParams.value.inputValue;
        const timeCompare = localParams.value.timeCompare;
        const timeValue = localParams.value.timeValue;
        const timeUtil = localParams.value.timeUtil;
        const valueType = localParams.value.inputType === '' ? 'text' : localParams.value.inputType;
        let outputValue = '';
        if (inputType === 'date') {
          outputValue = dateUtils.computeByDate(inputValue, timeCompare, timeValue, timeUtil);
        } else if (inputType === 'datetime') {
          outputValue = dateUtils.computeByDateTime(inputValue, timeCompare, timeValue, timeUtil);
        } else if (inputType === 'timestamp') {
          outputValue = dateUtils.computeByTimestamp(inputValue, timeCompare, timeValue, timeUtil);
        } else {
          outputValue = dateUtils.computeByTime(inputValue, timeCompare, timeValue, timeUtil);
        }

        nodeData.value.properties.timeCompare = timeCompare;
        nodeData.value.properties.timeValue = timeValue;
        nodeData.value.properties.timeUtil = timeUtil;
        nodeData.value.properties.valueType = valueType;
        nodeData.value.properties.outputValue = outputValue;

        emit('submit', nodeData.value);
      } else {
        window['$message'].error('请填写完整信息');
      }
    });
    formBtnLoading.value = false;
  };
</script>
