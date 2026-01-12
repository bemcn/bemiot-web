<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 800px"
    title="格式转换"
    @after-leave="closeModalAfter"
  >
    <n-form
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="localParams"
      class="py-4"
    >
      <n-form-item label="转换类型" path="funcType">
        <n-select
          v-model:value="localParams.funcType"
          :options="funcTypeOptions"
          placeholder="请选择转换类型"
          @update:value="handleFuncType"
        />
      </n-form-item>
      <n-form-item label="转换方法" path="func">
        <n-select
          v-model:value="localParams.func"
          :options="funcOptions"
          placeholder="请选择转换方法"
          @update:value="handleFunc"
        />
      </n-form-item>
      <n-form-item label="转换说明" path="formula">
        <n-input :value="localParams.formula" disabled />
      </n-form-item>
      <n-form-item label="转换公式" v-if="localParams.formula !== ''">
        <n-input-group>
          <n-input-group-label>{{ localParams.func }}(</n-input-group-label>
          <n-form-item path="inputId1" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId1"
              :options="inputOptions1"
              placeholder="请选择输入节点"
              :style="{ width: '200px' }"
            />
          </n-form-item>
          <n-input-group-label>)</n-input-group-label>
        </n-input-group>
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
  import { SelectBaseOption } from 'naive-ui/es/select/src/interface';
  import { cloneDeep } from 'lodash-es';
  import { logicFlowUtil } from '../LogicFlowUtil';

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
    inputNodes: null,
    funcType: null,
    func: null,
    formula: '',
    describe: '',
    inputIdNum: 0,
    inputId1: '',
    inputId2: '',
    inputIdType1: '',
    inputIdType2: '',
    paramNum: 0,
    paramValue1: '',
    paramValue2: '',
    paramType1: '',
    paramType2: '',
    valueType: '',
    outputValue: '',
  });
  const funcTypeOptions = [
    {
      label: '字符串转换',
      value: 'string',
    },
    {
      label: '整数转换',
      value: 'int',
    },
    {
      label: '小数转换',
      value: 'number',
    },
    {
      label: '布尔值转换',
      value: 'bool',
    },
  ];
  const funcOptions = ref<any[]>([]);
  const funcDatas = [
    {
      label: '字符串转整数',
      value: 'stringToInt',
      funcType: 'string',
      formula: 'stringToInt(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'int',
    },
    {
      label: '字符串转小数',
      value: 'stringToFloat',
      funcType: 'string',
      formula: 'stringToFloat(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '字符串转布尔值',
      value: 'stringToBool',
      funcType: 'string',
      formula: 'stringToBool(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '十六进制转整数',
      value: 'byteToInt',
      funcType: 'string',
      formula: 'byteToInt(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'int',
    },
    {
      label: '十六进制转小数',
      value: 'byteToFloat',
      funcType: 'string',
      formula: 'byteToFloat(value1)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '整数转字符串',
      value: 'intToString',
      funcType: 'int',
      formula: 'intToString(value)',
      inputIdNum: 1,
      inputIdType1: 'int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'text',
    },
    {
      label: '整数转小数',
      value: 'intToFloat',
      funcType: 'int',
      formula: 'intToFloat(value)',
      inputIdNum: 1,
      inputIdType1: 'int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '整数转布尔值',
      value: 'intToBool',
      funcType: 'int',
      formula: 'intToBool(value, x)',
      inputIdNum: 1,
      inputIdType1: 'int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '整数转16进制',
      value: 'intToByte',
      funcType: 'int',
      formula: 'intToByte(value)',
      inputIdNum: 1,
      inputIdType1: 'int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '小数转字符串',
      value: 'floatToString',
      funcType: 'number',
      formula: 'floatToString(value1)',
      inputIdNum: 1,
      inputIdType1: 'number',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'text',
    },
    {
      label: '小数转整数',
      value: 'floatToInt',
      funcType: 'number',
      formula: 'floatToInt(value)',
      inputIdNum: 1,
      inputIdType1: 'number',
      inputIdType2: '',
      paramNum: 0,
      paramValue1: '',
      paramValue2: '',
      valueType: 'int',
    },
    {
      label: '小数转16进制',
      value: 'floatToByte',
      funcType: 'number',
      formula: 'floatToByte(value)',
      inputIdNum: 1,
      inputIdType1: 'number',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'text',
    },
    {
      label: '布尔值转字符串',
      value: 'boolToString',
      funcType: 'bool',
      formula: 'boolToString(value)',
      inputIdNum: 1,
      inputIdType1: 'bool',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'text',
    },
    {
      label: '布尔值转整数',
      value: 'boolToInt',
      funcType: 'bool',
      formula: 'boolToInt(value)',
      inputIdNum: 1,
      inputIdType1: 'bool',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'int',
    },
  ];
  const inputOptions1 = ref<any[]>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const rules: FormRules = {
    funcType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择转换类型',
    },
    func: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择转换方法',
    },
    formula: {
      required: true,
      trigger: ['blur', 'change'],
      validator(_rule: any, value: string) {
        if (!value) {
          return new Error('转换公式不能为空');
        }
        return true;
      },
    },
    inputId1: {
      required: true,
      trigger: ['blur', 'change'],
      validator(_rule: any, value: string) {
        // 检查是否需要验证此字段
        if (
          localParams.value.formula &&
          (localParams.value.inputIdNum === 1 || localParams.value.inputIdNum === 2)
        ) {
          // 验证字段是否已填写
          if (!value) {
            return new Error('请选择输入节点');
          }
        }
        return true;
      },
    },
  };

  // 移除之前添加的监听器，因为我们现在只在提交时验证

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
        inputNodes: properties.inputNodes,
        funcType: properties.funcType,
        func: properties.func,
        formula: properties.formula,
        describe: properties.describe,
        inputIdNum: properties.inputIdNum,
        inputId1: properties.inputId1,
        inputId2: properties.inputId2,
        inputIdType1: properties.inputIdType1,
        inputIdType2: properties.inputIdType2,
        paramNum: properties.paramNum,
        paramValue1: properties.paramValue1,
        paramValue2: properties.paramValue2,
        paramType1: properties.paramType1,
        paramType2: properties.paramType2,
        valueType: properties.valueType,
        outputValue: properties.outputValue,
      };
    }
  });

  const handleFuncType = (value: string) => {
    funcOptions.value = funcDatas.filter((item: any) => item.funcType === value);

    localParams.value.func = null;
    localParams.value.formula = '';
    localParams.value.describe = '';
    localParams.value.inputIdNum = 0;
    localParams.value.inputId1 = null;
    localParams.value.inputId2 = null;
    localParams.value.inputIdType1 = '';
    localParams.value.inputIdType2 = '';
    localParams.value.paramNum = 0;
    localParams.value.paramValue1 = null;
    localParams.value.paramValue2 = null;
    localParams.value.paramType1 = '';
    localParams.value.paramType2 = '';
    localParams.value.valueType = '';
    localParams.value.outputValue = '';
  };

  const handleFunc = (_value: string, option: SelectBaseOption | null) => {
    const inputNodes = localParams.value.inputNodes;
    if (inputNodes !== null && inputNodes.length > 0) {
      let idArray1: any[] = [];
      const inputIdType1 = option?.inputIdType1;
      for (let i = 0; i < inputNodes; i++) {
        const nodeId = inputNodes[i];
        if (logicFlowUtil.logicFlow) {
          const node = logicFlowUtil.logicFlow.getNodeDataById(nodeId);
          const pops = (node as any).getProperties();
          if (pops) {
            const item = {
              label: inputNodes[i],
              value: inputNodes[i],
            };

            if (pops.valueType) {
              if (inputIdType1 === pops.valueType) {
                idArray1.push(item);
              }
            }
          }
        }
      }
      inputOptions1.value = idArray1;
    } else {
      inputOptions1.value = [];
    }

    localParams.value.formula = option?.formula;
    localParams.value.describe = option?.label;
    localParams.value.inputIdNum = option?.inputIdNum;
    localParams.value.inputId1 = null;
    localParams.value.inputId2 = '';
    localParams.value.inputIdType1 = option?.inputIdType1;
    localParams.value.inputIdType2 = option?.inputIdType2;
    localParams.value.paramNum = option?.paramNum;
    localParams.value.paramValue1 = '';
    localParams.value.paramValue2 = '';
    localParams.value.paramType1 = option?.paramType1;
    localParams.value.paramType2 = option?.paramType2;
    localParams.value.valueType = option?.valueType;
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    // 触发表单验证，包括自定义验证规则
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        showState.value = false;
        let outputValue = '';
        if (localParams.value.valueType === 'boolean') {
          outputValue = 'false';
        } else if (
          localParams.value.valueType === 'int' ||
          localParams.value.valueType === 'number'
        ) {
          outputValue = '0';
        }

        nodeData.value.properties.funcType = localParams.value.funcType;
        nodeData.value.properties.func = localParams.value.func;
        nodeData.value.properties.formula = localParams.value.formula;
        nodeData.value.properties.describe = localParams.value.describe;
        nodeData.value.properties.inputIdNum = localParams.value.inputIdNum;
        nodeData.value.properties.inputId1 = localParams.value.inputId1;
        nodeData.value.properties.inputId2 = localParams.value.inputId2;
        nodeData.value.properties.inputIdType1 = localParams.value.inputIdType1;
        nodeData.value.properties.inputIdType2 = localParams.value.inputIdType2;
        nodeData.value.properties.paramNum = localParams.value.paramNum;
        nodeData.value.properties.paramValue1 = localParams.value.paramValue1;
        nodeData.value.properties.paramValue2 = localParams.value.paramValue2;
        nodeData.value.properties.paramType1 = localParams.value.paramType1;
        nodeData.value.properties.paramType2 = localParams.value.paramType2;
        nodeData.value.properties.valueType = localParams.value.valueType;
        nodeData.value.properties.timeValue = localParams.value.timeValue;
        nodeData.value.properties.outputValue = outputValue;
        emit('submit', nodeData.value);
      }
    });
    formBtnLoading.value = false;
  };
</script>
