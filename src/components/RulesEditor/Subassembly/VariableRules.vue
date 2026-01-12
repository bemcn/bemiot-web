<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 480px"
    title="变量赋值"
    @after-leave="closeModalAfter"
  >
    <n-form
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="nodeData"
      class="py-4"
    >
      <n-form-item label="数据类型" path="properties.valueType">
        <n-select
          v-model:value="nodeData.properties.valueType"
          :options="valueTypeOptions"
          placeholder="请选择数据类型"
          @update:value="handleValueType"
        />
      </n-form-item>
      <n-form-item label="默认值" path="properties.defaultValue">
        <n-input
          maxlength="8"
          placeholder="请输入变量默认值"
          v-model:value="nodeData.properties.defaultValue"
          :allow-input="onlyAllowInt"
          clearable
          v-if="nodeData.properties.valueType === 'int'"
        />
        <n-input
          maxlength="12"
          placeholder="请输入变量默认值"
          v-model:value="nodeData.properties.defaultValue"
          :allow-input="onlyAllowNumber"
          clearable
          v-else-if="nodeData.properties.valueType === 'number'"
        />
        <n-select
          v-model:value="nodeData.properties.defaultValue"
          :options="boolOptions"
          placeholder="请选择变量默认值"
          v-else-if="nodeData.properties.valueType === 'bool'"
        />
        <n-date-picker
          v-model:formatted-value="nodeData.properties.defaultValue"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择变量默认值"
          clearable
          v-else-if="nodeData.properties.valueType === 'date'"
        />
        <n-time-picker
          v-model:formatted-value="nodeData.properties.defaultValue"
          value-format="HH:mm:ss"
          placeholder="请选择变量默认值"
          clearable
          v-else-if="nodeData.properties.valueType === 'time'"
        />
        <n-input
          maxlength="200"
          placeholder="请输入变量默认值"
          v-model:value="nodeData.properties.defaultValue"
          clearable
          v-else
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
  import { format } from 'date-fns';
  // @ts-ignore
  import { PlusOutlined, MinusOutlined } from '@vicons/antd';
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
  const formBtnLoading = ref(false);
  const formRef: any = ref({ properties: {} });
  const valueTypeOptions = [
    {
      label: '整数',
      value: 'int',
    },
    {
      label: '小数',
      value: 'number',
    },
    {
      label: '布尔值',
      value: 'bool',
    },
    {
      label: '日期',
      value: 'date',
    },
    {
      label: '时间',
      value: 'time',
    },
    {
      label: '字符串',
      value: 'text',
    },
  ];
  const boolOptions = [
    {
      label: 'true',
      value: 'true',
    },
    {
      label: 'false',
      value: 'false',
    },
  ];

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^-?\d+$/.test(value);
  const onlyAllowNumber = (value: string) => !value || /^-?[\d.]+$/.test(value);
  const rules: FormRules = {
    'properties.valueType': {
      required: true,
      message: '请选择数据类型',
      trigger: ['blur', 'change'],
    },
    'properties.defaultValue': {
      required: true,
      message: '请输入或选择变量值',
      trigger: ['blur', 'input', 'change'],
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
      nodeData.value.properties = nodeData.value.properties || {
        valueType: 'number',
        valueFormat: '',
        defaultValue: '0',
      };
    }
  });

  const handleValueType = (value: string) => {
    if (value === 'date') {
      nodeData.value.properties.defaultValue = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    } else if (value === 'time') {
      nodeData.value.properties.defaultValue = format(new Date(), 'HH:mm:ss');
    } else if (value === 'int' || value === 'number') {
      nodeData.value.properties.defaultValue = '0';
    } else if (value === 'bool') {
      nodeData.value.properties.defaultValue = 'false';
    } else {
      nodeData.value.properties.defaultValue = '';
    }
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        showState.value = false;
        // 提交克隆后的数据，而不是原始引用
        emit('submit', cloneDeep(nodeData.value));
      } else {
        window['$message'].error('请填写完整信息');
      }
    });
    formBtnLoading.value = false;
  };
</script>
