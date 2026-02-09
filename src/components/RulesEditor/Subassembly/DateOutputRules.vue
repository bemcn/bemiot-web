<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 480px"
    title="日期输出"
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
      <n-form-item label="输出类型" path="outputTypeId">
        <n-select
          v-model:value="localParams.outputTypeId"
          :options="typeOptions"
          placeholder="请选择输出类型"
          @update:value="handleOutputType"
        />
      </n-form-item>
      <n-form-item label="输出格式" path="outputFormat">
        <n-select
          v-model:value="localParams.outputFormat"
          :options="formatOptions"
          placeholder="请选择输出格式"
          @update:value="handleOutputFormat"
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
  import { FormRules, SelectOption } from 'naive-ui';
  // @ts-ignore
  import { PlusOutlined, MinusOutlined } from '@vicons/antd';
  import { dateUtils } from '../../../utils/dateUtils';
  import { cloneDeep } from 'lodash-es';

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
  const localParams: any = ref({
    outputTypeId: '',
    outputType: '',
    outputFormat: '',
    inputType: '',
    inputValue: '',
    valueType: '',
    outputValue: '',
  });
  const typeOptions = ref<any[]>([]);
  const formatOptions = ref<any[]>([]);
  const formatDataOptions = [
    {
      label: 'yyyy',
      value: 'yyyy',
      group: 'year',
      valType: 'int',
    },
    {
      label: 'yyyy年',
      value: 'yyyy年',
      group: 'year',
      valType: 'text',
    },
    {
      label: 'MM',
      value: 'MM',
      group: 'month',
      valType: 'int',
    },
    {
      label: 'MM月',
      value: 'MM月',
      group: 'month',
      valType: 'text',
    },
    {
      label: 'dd',
      value: 'dd',
      group: 'day',
      valType: 'int',
    },
    {
      label: 'dd日',
      value: 'dd日',
      group: 'day',
      valType: 'text',
    },
    {
      label: 'yyyyMM',
      value: 'yyyyMM',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyyMMdd',
      value: 'yyyyMMdd',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyy-MM',
      value: 'yyyy-MM',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyy-MM-dd',
      value: 'yyyy-MM-dd',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyy/MM',
      value: 'yyyy/MM',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyy/MM/dd',
      value: 'yyyy/MM/dd',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyy.MM',
      value: 'yyyy.MM',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyy.MM.dd',
      value: 'yyyy.MM.dd',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyy年MM月',
      value: 'yyyy年MM月',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'yyyy年MM月dd日',
      value: 'yyyy年MM月dd日',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'MM-yyyy',
      value: 'MM-yyyy',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'dd-MM-yyyy',
      value: 'dd-MM-yyyy',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'MM/yyyy',
      value: 'MM/yyyy',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'dd/MM/yyyy',
      value: 'dd/MM/yyyy',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'MM.yyyy',
      value: 'MM.yyyy',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'dd.MM.yyyy',
      value: 'dd.MM.yyyy',
      group: 'date',
      valType: 'text',
    },
    {
      label: 'W',
      value: 'weekNumber',
      group: 'week',
      valType: 'int',
    },
    {
      label: 'Week',
      value: 'weekEn',
      group: 'week',
      valType: 'text',
    },
    {
      label: '星期W',
      value: 'weekCn',
      group: 'week',
      valType: 'text',
    },
    {
      label: 'HH',
      value: 'HH',
      group: 'hour',
      valType: 'int',
    },
    {
      label: 'HH时',
      value: 'HH时',
      group: 'hour',
      valType: 'text',
    },
    {
      label: 'HH点',
      value: 'HH点',
      group: 'hour',
      valType: 'text',
    },
    {
      label: 'mm',
      value: 'mm',
      group: 'minute',
      valType: 'int',
    },
    {
      label: 'mm分',
      value: 'mm分',
      group: 'minute',
      valType: 'text',
    },
    {
      label: 'ss',
      value: 'ss',
      group: 'second',
      valType: 'int',
    },
    {
      label: 'ss秒',
      value: 'ss秒',
      group: 'second',
      valType: 'text',
    },
    {
      label: 'HHmm',
      value: 'HHmm',
      group: 'time',
      valType: 'text',
    },
    {
      label: 'HHmmss',
      value: 'HHmmss',
      group: 'time',
      valType: 'text',
    },
    {
      label: 'HH.mm',
      value: 'HH.mm',
      group: 'time',
      valType: 'text',
    },
    {
      label: 'HH.mm.ss',
      value: 'HH.mm.ss',
      group: 'time',
      valType: 'text',
    },
    {
      label: 'HH:mm',
      value: 'HH:mm',
      group: 'time',
      valType: 'text',
    },
    {
      label: 'HH:mm:ss',
      value: 'HH:mm:ss',
      group: 'time',
      valType: 'text',
    },
    {
      label: 'yyyy-MM-dd HH:mm',
      value: 'yyyy-MM-dd HH:mm',
      group: 'datetime',
      valType: 'text',
    },
    {
      label: 'yyyy-MM-dd HH:mm:ss',
      value: 'yyyy-MM-dd HH:mm:ss',
      group: 'datetime',
      valType: 'text',
    },
    {
      label: 'yyyy-MM-dd HH:mm:ss.SSS',
      value: 'yyyy-MM-dd HH:mm:ss.SSS',
      group: 'datetime',
      valType: 'text',
    },
    {
      label: 'yyyy年MM月dd日 HH:mm:ss',
      value: 'yyyy年MM月dd日 HH:mm:ss',
      group: 'datetime',
      valType: 'text',
    },
    {
      label: 'yyyy年MM月dd日 HH:mm',
      value: 'yyyy年MM月dd日 HH:mm',
      group: 'datetime',
      valType: 'text',
    },
    {
      label: 'yyyy年MM月dd日HH时mm分',
      value: 'yyyy年MM月dd日HH时mm分',
      group: 'datetime',
      valType: 'text',
    },
    {
      label: 'yyyy年MM月dd日HH时mm分ss秒',
      value: 'yyyy年MM月dd日HH时mm分ss秒',
      group: 'datetime',
      valType: 'text',
    },
    {
      label: 'yyyy年MM月dd日HH点mm分ss秒',
      value: 'yyyy年MM月dd日HH点mm分ss秒',
      group: 'datetime',
      valType: 'text',
    },
    {
      label: '精确到秒',
      value: 'toSeconds',
      group: 'timestamp',
      valType: 'number',
    },
    {
      label: '精确到毫秒',
      value: 'toMilliSeconds',
      group: 'timestamp',
      valType: 'number',
    },
  ];
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const rules: FormRules = {
    inputValue: {
      required: true,
      trigger: ['blur', 'input'],
      message: '输入值不能为空，请连接到左边锚点',
    },
    outputType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择输出类型',
    },
    outputFormat: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择输出格式',
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
        outputTypeId: properties.outputTypeId,
        outputType: properties.outputType,
        outputFormat: properties.outputFormat,
        inputType: properties.inputType,
        inputValue: properties.inputValue,
        valueType: properties.valueType,
        outputValue: properties.outputValue,
      };
      if (properties.inputType === 'date') {
        typeOptions.value = [
          {
            label: '年',
            value: 'year',
          },
          {
            label: '月',
            value: 'month',
          },
          {
            label: '日',
            value: 'day',
          },
          {
            label: '日期',
            value: 'date',
          },
          {
            label: '星期',
            value: 'week',
          },
          {
            label: '日期时间',
            value: 'datetime',
          },
          {
            label: '时间戳',
            value: 'timestamp',
          },
        ];
      } else if (properties.inputType === 'datetime') {
        typeOptions.value = [
          {
            label: '年',
            value: 'year',
          },
          {
            label: '月',
            value: 'month',
          },
          {
            label: '日',
            value: 'day',
          },
          {
            label: '日期',
            value: 'date',
          },
          {
            label: '星期',
            value: 'week',
          },
          {
            label: '时',
            value: 'hour',
          },
          {
            label: '分',
            value: 'minute',
          },
          {
            label: '秒',
            value: 'second',
          },
          {
            label: '时间',
            value: 'time',
          },
          {
            label: '日期时间',
            value: 'datetime',
          },
          {
            label: '时间戳',
            value: 'timestamp',
          },
        ];
      } else if (properties.inputType === 'timestamp') {
        typeOptions.value = [
          {
            label: '年',
            value: 'year',
          },
          {
            label: '月',
            value: 'month',
          },
          {
            label: '日',
            value: 'day',
          },
          {
            label: '日期',
            value: 'date',
          },
          {
            label: '星期',
            value: 'week',
          },
          {
            label: '时',
            value: 'hour',
          },
          {
            label: '分',
            value: 'minute',
          },
          {
            label: '秒',
            value: 'second',
          },
          {
            label: '时间',
            value: 'time',
          },
          {
            label: '日期时间',
            value: 'datetime',
          },
        ];
      } else {
        typeOptions.value = [
          {
            label: '时',
            value: 'hour',
          },
          {
            label: '分',
            value: 'minute',
          },
          {
            label: '秒',
            value: 'second',
          },
          {
            label: '时间',
            value: 'time',
          },
        ];
      }
    }
  });

  const handleOutputType = (value: string, option: SelectOption) => {
    if (option.label !== localParams.value.outputType) {
      localParams.value.outputType = option.label;
      localParams.value.outputFormat = null;
      formatOptions.value.length = 0;
      const filteredOptions = formatDataOptions.filter((item) => item.group === value);
      formatOptions.value.push(...filteredOptions);
    }
  };

  const handleOutputFormat = (_value: string, option: SelectOption) => {
    localParams.value.valueType = option.valType;
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        showState.value = false;
        const inputType = localParams.value.inputType;
        const inputValue = localParams.value.inputValue;
        const outputTypeId = localParams.value.outputTypeId;
        const outputType = localParams.value.outputType;
        const outputFormat = localParams.value.outputFormat;

        let outputBase: string[];
        if (inputType === 'date') {
          outputBase = dateUtils.conversionByDate(inputValue, outputTypeId, outputFormat);
        } else if (inputType === 'datetime') {
          outputBase = dateUtils.conversionByDateTime(inputValue, outputTypeId, outputFormat);
        } else if (inputType === 'timestamp') {
          outputBase = dateUtils.conversionByTimestamp(inputValue, outputTypeId, outputFormat);
        } else {
          outputBase = dateUtils.conversionByTime(inputValue, outputTypeId, outputFormat);
        }
        const outputValue = outputBase[0];
        const valueType = outputBase[1];

        nodeData.value.properties.outputTypeId = outputTypeId;
        nodeData.value.properties.outputType = outputType;
        nodeData.value.properties.outputFormat = outputFormat;
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
