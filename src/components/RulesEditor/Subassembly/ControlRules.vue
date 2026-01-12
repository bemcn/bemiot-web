<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 680px"
    title="物模型控制"
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
      <n-form-item label="物模型" path="modelName">
        <n-input-group>
          <n-input :value="localParams.modelName" disabled placeholder="请选择物模型服务" />
          <n-button @click="handleModelService">选择</n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item label="所属设备">
        <n-input :value="localParams.deviceName" disabled />
      </n-form-item>
      <n-form-item label="安装位置">
        <n-input :value="localParams.location" disabled />
      </n-form-item>
      <n-form-item
        label="控制操作"
        path="outputValue"
        v-if="localParams.valueType === 'bool' || localParams.valueType === 'enum'"
      >
        <n-select
          v-model:value="localParams.outputValue"
          :options="localParams.dataDefinition.typeOptions"
          placeholder="操作参数"
          @update:value="handleValueType"
        />
      </n-form-item>
      <n-form-item
        label="控制操作"
        path="outputValue"
        v-else-if="localParams.valueType === 'int' || localParams.valueType === 'number'"
      >
        <n-input-number
          v-model:value="localParams.outputValue"
          placeholder="操作参数"
          :min="localParams.dataDefinition.min || undefined"
          :max="localParams.dataDefinition.max || undefined"
          :step="localParams.dataDefinition.step || 1"
        />
      </n-form-item>
      <n-form-item label="控制操作" path="arrayValue" v-else-if="localParams.valueType === 'array'">
        <n-input-group>
          <div style="width: 544px">
            <div
              style="width: 170px; margin-bottom: 8px; margin-right: 10px; float: left"
              v-for="index in localParams.arrayValue"
              :key="index"
            >
              <n-input
                v-model:value="localParams.arrayValue[index]"
                :style="{ width: '100%' }"
                :allow-input="
                  localParams.dataDefinition.arrayType === 'int'
                    ? onlyAllowInt
                    : localParams.dataDefinition.arrayType === 'number'
                    ? onlyAllowNumber
                    : true
                "
              />
            </div>
            <div style="clear: both"></div>
          </div>
        </n-input-group>
      </n-form-item>
      <n-form-item label="控制操作" path="outputValue" v-else>
        <n-input
          :maxlength="localParams.dataDefinition.maxLength || 250"
          v-model:value="localParams.outputValue"
          placeholder="操作参数"
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

  <SelectDeviceModel
    :showModel="showModelModal"
    id="none"
    type="service"
    @close="() => (showModelModal = false)"
    @checked="checkModel"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  // @ts-ignore
  import { PlusOutlined, MinusOutlined } from '@vicons/antd';
  import { cloneDeep } from 'lodash-es';
  import { SelectBaseOption } from 'naive-ui/es/select/src/interface';

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
  const showModelModal = ref(false);
  const nodeData: any = ref(null);
  const localParams = ref<any>({
    modelId: '',
    modelName: '',
    deviceName: '',
    location: '',
    dataDefinition: {
      maxLength: null,
      typeOptions: [],
      min: null,
      max: null,
      unit: '',
      step: null,
      arrayLen: 0,
      arrayType: '',
    },
    valueType: '',
    outputValue: '',
    description: '',
    arrayValue: [],
  });
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^-?\d+$/.test(value);
  const onlyAllowNumber = (value: string) => !value || /^-?[\d.]+$/.test(value);
  const rules: FormRules = {
    modelName: {
      required: true,
      message: '请选择物模型',
      trigger: ['blur', 'input'],
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
      let valArray: any[] = [];
      if (properties.valueType === 'array') {
        const xValue = properties.outputValue;
        localParams.value.arrayLen.value = 0;
        if (xValue && xValue.length > 0) {
          const xArray = xValue.split(',');
          let hasString = false;
          for (let i = 0; i < xArray.length; i++) {
            if (!isNaN(parseFloat(xArray[i])) && isFinite(xArray[i])) {
              hasString = true;
              break;
            }
          }
          if (hasString) {
            for (let i = 0; i < xArray.length; i++) {
              valArray.push(xArray[i]);
            }
          } else {
            for (let i = 0; i < xArray.length; i++) {
              const numVal = Number(xArray[i]);
              valArray.push(numVal);
            }
          }
        }
      }
      localParams.value = {
        modelId: properties.modelId,
        modelName: properties.modelName,
        deviceName: properties.deviceName,
        location: properties.location,
        dataDefinition: properties.dataDefinition,
        valueType: properties.valueType,
        outputValue: properties.outputValue,
        description: properties.description,
        arrayValue: [],
      };
    }
  });

  const handleModelService = () => {
    showModelModal.value = true;
  };

  const checkModel = (data: any) => {
    localParams.value.modelId = data.modelId;
    localParams.value.modelName = data.modelName;
    localParams.value.deviceName = data.device.deviceName;
    localParams.value.location = data.device.spaceRouteName;
    localParams.value.valueType = data.dataType;
    const def = data.dataDefinition;
    const defJson = JSON.parse(def);

    let definition: {
      maxLength: null | number;
      typeOptions: { label: string; value: string }[];
      min: null | number;
      max: null | number;
      unit: string;
      step: null | number;
      arrayLen: number;
      arrayType: string;
    } = {
      maxLength: null,
      typeOptions: [],
      min: null,
      max: null,
      unit: '',
      step: null,
      arrayLen: 0,
      arrayType: '',
    };

    if (data.dataType === 'bool') {
      const falseText = defJson.falseText;
      const trueText = defJson.trueText;
      let defDescription = '';
      if (falseText === '') {
        definition.typeOptions.push({
          label: 'false',
          value: 'false',
        });
      } else {
        definition.typeOptions.push({
          label: falseText,
          value: 'false',
        });
        defDescription = falseText;
      }
      if (trueText === '') {
        definition.typeOptions.push({
          label: 'true',
          value: 'true',
        });
      } else {
        definition.typeOptions.push({
          label: trueText,
          value: 'true',
        });
      }
      localParams.value.outputValue = 'false';
      localParams.value.description = defDescription;
    } else if (data.dataType === 'int' || data.dataType === 'number') {
      definition.min = Number(defJson.min);
      definition.max = Number(defJson.max);
      definition.unit = defJson.unit;
      definition.step = Number(defJson.step);
      localParams.value.outputValue = '0';
    } else if (data.dataType === 'array') {
      const len = parseInt(defJson.length);
      definition.arrayLen = parseInt(defJson.length);
      definition.arrayType = defJson.itemType; //int number string

      let arrayValue: any[] = [];
      if (definition.arrayType === 'int' || definition.arrayType === 'number') {
        for (let i = 0; i < len; i++) {
          arrayValue.push(0);
        }
      } else {
        for (let i = 0; i < len; i++) {
          arrayValue.push('');
        }
      }
      localParams.value.outputValue = '';
      localParams.value.arrayValue = arrayValue;
    } else if (data.dataType === 'enum') {
      const values = defJson.values;
      let fristVal = '';
      let defDescription = '';
      for (let i = 0; i < values.length; i++) {
        definition.typeOptions.push({
          label: values[i].label,
          value: values[i].value,
        });
        if (i === 0) {
          fristVal = values[i].value;
          defDescription = values[i].label;
        }
      }
      localParams.value.outputValue = fristVal;
      localParams.value.description = defDescription;
    } else {
      definition.maxLength = parseInt(defJson.maxLength);
      localParams.value.outputValue = '';
    }
    localParams.value.dataDefinition = definition;
    console.log('localParams.value', localParams.value);
  };

  const handleValueType = (value: string, option: SelectBaseOption) => {
    console.log('handleValueType', option.label, value);
    if (option.label === value) {
      localParams.value.description = '--';
    } else {
      localParams.value.description = option.label;
    }
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        showState.value = false;
        const valueType = localParams.value.valueType;
        let outputValue = localParams.value.outputValue;
        if (valueType === 'array') {
          const arrayValue = localParams.value.arrayValue;
          outputValue = arrayValue.join(',');
        }

        nodeData.value.properties.modelId = localParams.value.modelId;
        nodeData.value.properties.modelName = localParams.value.modelName;
        nodeData.value.properties.deviceName = localParams.value.deviceName;
        nodeData.value.properties.location = localParams.value.location;
        nodeData.value.properties.dataDefinition = localParams.value.dataDefinition;
        nodeData.value.properties.valueType = valueType;
        nodeData.value.properties.outputValue = outputValue;
        nodeData.value.properties.description = localParams.value.description;

        console.log('nodeData.value', nodeData.value);

        emit('submit', nodeData.value);
      } else {
        window['$message'].error('请填写完整信息');
      }
    });
    formBtnLoading.value = false;
  };
</script>
