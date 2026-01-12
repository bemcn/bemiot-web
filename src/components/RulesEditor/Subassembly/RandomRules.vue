<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 480px"
    title="随机数"
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
      <n-form-item label="数值类型" path="properties.valueType">
        <n-select
          v-model:value="nodeData.properties.valueType"
          :options="valueTypeOptions"
          placeholder="请选择数值类型"
          @update:value="handleValueType"
        />
      </n-form-item>
      <n-form-item label="最小值" path="properties.minNum">
        <n-input
          maxlength="8"
          placeholder="请输入最小值"
          v-model:value="nodeData.properties.minNum"
          :allow-input="nodeData.properties.valueType === 'int' ? onlyAllowInt : onlyAllowNumber"
          clearable
        />
      </n-form-item>
      <n-form-item label="最大值" path="properties.maxNum">
        <n-input
          maxlength="8"
          placeholder="请输入最大值"
          v-model:value="nodeData.properties.maxNum"
          :allow-input="nodeData.properties.valueType === 'int' ? onlyAllowInt : onlyAllowNumber"
          clearable
        />
      </n-form-item>
      <n-form-item
        label="小数位数"
        path="properties.bits"
        v-if="nodeData.properties.valueType === 'number'"
      >
        <n-input
          maxlength="1"
          placeholder="请输入小数位数"
          v-model:value="nodeData.properties.bits"
          :allow-input="onlyAllowInt"
          clearable
        />
      </n-form-item>
      <n-form-item label="随机时间" path="properties.refresh">
        <n-input
          maxlength="4"
          placeholder="请输入随机时间（5-7200秒之间）"
          v-model:value="nodeData.properties.refresh"
          :allow-input="onlyAllowInt"
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
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
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
  const valueTypeOptions = [
    {
      label: 'int',
      value: 'int',
    },
    {
      label: 'number',
      value: 'number',
    },
  ];
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^-?\d*$/.test(value);
  const onlyAllowNumber = (value: string) => !value || /^-?\d*\.?\d*$/.test(value);
  const validateMaxGreaterThanMin = (_rule: any, value: string): Promise<void> | boolean => {
    const minNum = nodeData.value.properties.minNum;
    if (minNum && value && Number(value) < Number(minNum)) {
      return Promise.reject(new Error('最大值不能小于最小值'));
    }
    return true;
  };
  const rules: FormRules = {
    valueType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择数值类型',
    },
    minNum: {
      required: true,
      message: '请输入最小值',
      trigger: ['blur', 'input'],
    },
    maxNum: [
      {
        required: true,
        message: '请输入最大值',
        trigger: ['blur', 'input'],
      },
      {
        validator: validateMaxGreaterThanMin,
        trigger: ['blur', 'input'],
      },
    ],
    bits: {
      required: true,
      message: '请输入小数位数',
      trigger: ['blur', 'input'],
      validator(_rule: any, value: string) {
        if (value && parseInt(value) > 4) {
          return new Error('小数位数不能大于4');
        }
        return true;
      },
    },
    refresh: {
      required: true,
      message: '请输入随机时间',
      trigger: ['blur', 'input'],
      validator(_rule: any, value: string) {
        if (value && parseInt(value) < 5 && parseInt(value) > 7200) {
          return new Error('随机时间必须在5-7200秒之间');
        }
        return true;
      },
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
        minNum: '0',
        maxNum: '10',
        bits: '0',
        refresh: '10',
        valueType: 'int',
      };
    }
  });

  const handleValueType = (value: string) => {
    if (value === 'int') {
      if (nodeData.value.properties.minNum) {
        nodeData.value.properties.minNum = parseInt(nodeData.value.properties.minNum) + '';
      }
      if (nodeData.value.properties.maxNum) {
        nodeData.value.properties.maxNum = parseInt(nodeData.value.properties.maxNum) + '';
      }
      nodeData.value.properties.bits = '0';
    }
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        showState.value = false;
        emit('submit', cloneDeep(nodeData.value));
      } else {
        window['$message'].error('请填写完整信息');
      }
    });
    formBtnLoading.value = false;
  };
</script>
