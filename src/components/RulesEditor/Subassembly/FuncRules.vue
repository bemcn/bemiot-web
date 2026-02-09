<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 800px"
    title="函数"
    @after-leave="closeModalAfter"
  >
    <n-form
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="localParams"
    >
      <n-form-item label="输入对象" path="inputNodes" v-if="isFuncInput">
        <n-input
          placeholder="请连接输入对象"
          :value="localParams.inputNodes ? localParams.inputNodes[0] : ''"
          disabled
        />
      </n-form-item>
      <n-form-item label="函数类型" path="funcType">
        <n-select
          v-model:value="localParams.funcType"
          :options="funcTypeOptions"
          placeholder="请选择函数类型"
          @update:value="handleFuncType"
        />
      </n-form-item>
      <n-form-item label="函数方法" path="func">
        <n-select
          v-model:value="localParams.func"
          :options="funcOptions"
          placeholder="请选择函数方法"
          @update:value="handleFunc"
        />
      </n-form-item>
      <n-form-item label="函数说明" path="formula">
        <n-input :value="localParams.formula" disabled />
      </n-form-item>
      <n-form-item label="函数公式" v-if="localParams.formula !== ''">
        <n-input-group v-if="localParams.inputIdNum === 1 && localParams.paramNum === 0">
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
        <n-input-group v-if="localParams.inputIdNum === 2 && localParams.paramNum === 0">
          <n-input-group-label>{{ localParams.func }}(</n-input-group-label>
          <n-form-item path="inputId1" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId1"
              :options="inputOptions1"
              placeholder="请选择输入节点1"
              :style="{ width: '200px' }"
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="inputId2" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId2"
              :options="inputOptions2"
              placeholder="请选择输入节点2"
              :style="{ width: '200px' }"
            />
          </n-form-item>
          <n-input-group-label>)</n-input-group-label>
        </n-input-group>
        <n-input-group v-if="localParams.inputIdNum === 1 && localParams.paramNum === 1">
          <n-input-group-label>{{ localParams.func }}(</n-input-group-label>
          <n-form-item path="inputId1" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId1"
              :options="inputOptions1"
              placeholder="请选择输入节点"
              :style="{ width: '200px' }"
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="paramValue1" :show-label="false" style="margin-bottom: 0">
            <n-input
              :maxlength="
                localParams.paramType1 === 'text' ? 250 : localParams.paramType1 === 'int' ? 8 : 10
              "
              :placeholder="
                localParams.paramType1 === 'int'
                  ? '请输入整数'
                  : localParams.paramType1 === 'number|int'
                  ? '请输入数字'
                  : '请输入字符串'
              "
              v-model:value="localParams.paramValue1"
              :style="{ width: '150px' }"
              :allow-input="
                localParams.paramType1 === 'int'
                  ? onlyAllowInt
                  : localParams.paramType1 === 'number|int'
                  ? onlyAllowNumber
                  : true
              "
              clearable
            />
          </n-form-item>
          <n-input-group-label>)</n-input-group-label>
        </n-input-group>
        <n-input-group v-if="localParams.inputIdNum === 1 && localParams.paramNum === 2">
          <n-input-group-label>{{ localParams.func }}(</n-input-group-label>
          <n-form-item path="inputId1" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId1"
              :options="inputOptions1"
              placeholder="请选择输入节点"
              :style="{ width: '200px' }"
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="paramValue1" :show-label="false" style="margin-bottom: 0">
            <n-input
              :maxlength="
                localParams.paramType1 === 'text' ? 250 : localParams.paramType1 === 'int' ? 8 : 10
              "
              :placeholder="
                localParams.paramType1 === 'int'
                  ? '请输入整数'
                  : localParams.paramType1 === 'number|int'
                  ? '请输入数字'
                  : '请输入字符串'
              "
              v-model:value="localParams.paramValue1"
              :style="{ width: '150px' }"
              :allow-input="
                localParams.paramType1 === 'int'
                  ? onlyAllowInt
                  : localParams.paramType1 === 'number|int'
                  ? onlyAllowNumber
                  : true
              "
              clearable
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="paramValue2" :show-label="false" style="margin-bottom: 0">
            <n-input
              :maxlength="
                localParams.paramType1 === 'text' ? 250 : localParams.paramType1 === 'int' ? 8 : 10
              "
              :placeholder="
                localParams.paramType2 === 'int'
                  ? '请输入整数'
                  : localParams.paramType2 === 'number|int'
                  ? '请输入数字'
                  : '请输入字符串'
              "
              v-model:value="localParams.paramValue2"
              :style="{ width: '150px' }"
              :allow-input="
                localParams.paramType2 === 'int'
                  ? onlyAllowInt
                  : localParams.paramType2 === 'number|int'
                  ? onlyAllowNumber
                  : true
              "
              clearable
            />
          </n-form-item>
          <n-input-group-label>)</n-input-group-label>
        </n-input-group>
        <n-input-group v-if="localParams.inputIdNum === 2 && localParams.paramNum === 1">
          <n-input-group-label>{{ localParams.func }}(</n-input-group-label>
          <n-form-item path="inputId1" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId1"
              :options="inputOptions1"
              placeholder="请选择输入节点1"
              :style="{ width: '200px' }"
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="inputId2" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId2"
              :options="inputOptions2"
              placeholder="请选择输入节点2"
              :style="{ width: '200px' }"
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="paramValue1" :show-label="false" style="margin-bottom: 0">
            <n-input
              :maxlength="
                localParams.paramType1 === 'text' ? 250 : localParams.paramType1 === 'int' ? 8 : 10
              "
              :placeholder="
                localParams.paramType1 === 'int'
                  ? '请输入整数'
                  : localParams.paramType1 === 'number|int'
                  ? '请输入数字'
                  : '请输入字符串'
              "
              v-model:value="localParams.paramValue1"
              :style="{ width: '150px' }"
              :allow-input="
                localParams.paramType1 === 'int'
                  ? onlyAllowInt
                  : localParams.paramType1 === 'number|int'
                  ? onlyAllowNumber
                  : true
              "
              clearable
            />
          </n-form-item>
          <n-input-group-label>)</n-input-group-label>
        </n-input-group>
        <n-input-group v-if="localParams.inputIdNum === 2 && localParams.paramNum === 2">
          <n-input-group-label>{{ localParams.func }}(</n-input-group-label>
          <n-form-item path="inputId1" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId1"
              :options="inputOptions1"
              placeholder="请选择输入节点1"
              :style="{ width: '160px' }"
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="inputId2" :show-label="false" style="margin-bottom: 0">
            <n-select
              v-model:value="localParams.inputId2"
              :options="inputOptions2"
              placeholder="请选择输入节点2"
              :style="{ width: '160px' }"
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="paramValue1" :show-label="false" style="margin-bottom: 0">
            <n-input
              :maxlength="
                localParams.paramType1 === 'text' ? 250 : localParams.paramType1 === 'int' ? 8 : 10
              "
              :placeholder="
                localParams.paramType1 === 'int'
                  ? '请输入整数'
                  : localParams.paramType1 === 'number|int'
                  ? '请输入数字'
                  : '请输入字符串'
              "
              v-model:value="localParams.paramValue1"
              :style="{ width: '120px' }"
              :allow-input="
                localParams.paramType1 === 'int'
                  ? onlyAllowInt
                  : localParams.paramType1 === 'number|int'
                  ? onlyAllowNumber
                  : true
              "
              clearable
            />
          </n-form-item>
          <n-input-group-label>,</n-input-group-label>
          <n-form-item path="paramValue2" :show-label="false" style="margin-bottom: 0">
            <n-input
              :maxlength="
                localParams.paramType1 === 'text' ? 250 : localParams.paramType1 === 'int' ? 8 : 10
              "
              :placeholder="
                localParams.paramType2 === 'int'
                  ? '请输入整数'
                  : localParams.paramType2 === 'number|int'
                  ? '请输入数字'
                  : '请输入字符串'
              "
              v-model:value="localParams.paramValue2"
              :style="{ width: '120px' }"
              :allow-input="
                localParams.paramType2 === 'int'
                  ? onlyAllowInt
                  : localParams.paramType2 === 'number|int'
                  ? onlyAllowNumber
                  : true
              "
              clearable
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
  import { funcUtils } from '../../../utils/funcUtils';

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
  const funcTypeOptions = ref<any>([
    {
      label: '字符串函数',
      value: 'string',
    },
    {
      label: '数学函数',
      value: 'math',
    },
  ]);
  const funcOptions = ref<any[]>([]);
  const funcDatas = [
    {
      label: '是否空字符串',
      value: 'isEmpty',
      funcType: 'string',
      formula: 'isEmpty(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '是否字母',
      value: 'isLetter',
      funcType: 'string',
      formula: 'isLetter(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '是否数字',
      value: 'isDigtit',
      funcType: 'string',
      formula: 'isDigtit(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '是否整数',
      value: 'isInt',
      funcType: 'string',
      formula: 'isInt(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '两个字符串是否相等',
      value: 'equals',
      funcType: 'string',
      formula: 'equals(value1, value2)',
      inputIdNum: 2,
      inputIdType1: 'text',
      inputIdType2: 'text',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '两个字符串是否相等（不区分大小写）',
      value: 'equalsIgnoreCase',
      funcType: 'string',
      formula: 'equalsIgnoreCase(value1, value2)',
      inputIdNum: 2,
      inputIdType1: 'text',
      inputIdType2: 'text',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '是否包含指定字符串',
      value: 'contains',
      funcType: 'string',
      formula: 'contains(value, x)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 1,
      paramType1: 'text',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '是否以指定字符串开头',
      value: 'startsWith',
      funcType: 'string',
      formula: 'startsWith(value, x)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 1,
      paramType1: 'text',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '是否以指定字符串结尾',
      value: 'endsWith',
      funcType: 'string',
      formula: 'startsWith(value, x)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 1,
      paramType1: 'text',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '比较字符串大小',
      value: 'compareTo',
      funcType: 'string',
      formula: 'compareTo(value1, value2)',
      inputIdNum: 2,
      inputIdType1: 'text',
      inputIdType2: 'text',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'boolean',
    },
    {
      label: '获取字符串长度',
      value: 'length',
      funcType: 'string',
      formula: 'length(value)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 0,
      paramValue1: '',
      paramValue2: '',
      valueType: 'int',
    },
    {
      label: '获取单个字符',
      value: 'charAt',
      funcType: 'string',
      formula: 'charAt(value, n)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 1,
      paramType1: 'int',
      paramType2: '',
      valueType: 'text',
    },
    {
      label: '替换字符串',
      value: 'replace',
      funcType: 'string',
      formula: 'replace(value, x, y)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 2,
      paramType1: 'text',
      paramType2: 'text',
      valueType: 'text',
    },
    {
      label: '替换首个内容',
      value: 'replaceFirst',
      funcType: 'string',
      formula: 'replaceFirst(value, x, y)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 2,
      paramType1: 'text',
      paramType2: 'text',
      valueType: 'text',
    },
    {
      label: '字符串截取',
      value: 'substring',
      funcType: 'string',
      formula: 'substring(value, n, nn)',
      inputIdNum: 1,
      inputIdType1: 'text',
      inputIdType2: '',
      paramNum: 2,
      paramType1: 'int',
      paramType2: 'int',
      valueType: 'text',
    },
    {
      label: '正弦值',
      value: 'sin',
      funcType: 'math',
      formula: 'sin(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '余弦值',
      value: 'cos',
      funcType: 'math',
      formula: 'cos(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '角度转换为弧度',
      value: 'toRadians',
      funcType: 'math',
      formula: 'toRadians(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '弧度转换为角度',
      value: 'toDegrees',
      funcType: 'math',
      formula: 'toDegrees(value)',
      paramsType: ['number|int'],
      paramNum: 1,
      valueType: 'number',
    },
    {
      label: '反正弦',
      value: 'asin',
      funcType: 'math',
      formula: 'asin(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '反余弦',
      value: 'acos',
      funcType: 'math',
      formula: 'acos(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '反正切',
      value: 'atan',
      funcType: 'math',
      formula: 'atan(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: 'e的指定次方',
      value: 'exp',
      funcType: 'math',
      formula: 'exp(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '自然底数',
      value: 'log',
      funcType: 'math',
      formula: 'log(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '以10为底的对数',
      value: 'log10',
      funcType: 'math',
      formula: 'log10(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '指定数的n次方',
      value: 'pow',
      funcType: 'math',
      formula: 'pow(value, n)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 1,
      paramType1: 'int',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '开方',
      value: 'sqrt',
      funcType: 'math',
      formula: 'sqrt(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'int',
    },
    {
      label: '向上进位取整',
      value: 'ceil',
      funcType: 'math',
      formula: 'ceil(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'int',
    },
    {
      label: '舍掉小数取整',
      value: 'floor',
      funcType: 'math',
      formula: 'floor(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'int',
    },
    {
      label: '四舍五入取整',
      value: 'round',
      funcType: 'math',
      formula: 'round(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'int',
    },
    {
      label: '四舍五入小数',
      value: 'roundFloat',
      funcType: 'math',
      formula: 'roundFloat(value, n)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 1,
      paramType1: 'int',
      paramType2: '',
      valueType: 'int',
    },
    {
      label: '两者中最小数',
      value: 'min',
      funcType: 'math',
      formula: 'min(value1, value2)',
      inputIdNum: 2,
      inputIdType1: 'number|int',
      inputIdType2: 'number|int',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '两者中最大数',
      value: 'max',
      funcType: 'math',
      formula: 'max(value1, value2)',
      inputIdNum: 2,
      inputIdType1: 'number|int',
      inputIdType2: 'number|int',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '绝对值',
      value: 'abs',
      funcType: 'math',
      formula: 'abs(value)',
      inputIdNum: 1,
      inputIdType1: 'number|int',
      inputIdType2: '',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
    {
      label: '两点间的距离',
      value: 'hypot',
      funcType: 'math',
      formula: 'hypot(value1, value2)',
      inputIdNum: 2,
      inputIdType1: 'number|int',
      inputIdType2: 'number|int',
      paramNum: 0,
      paramType1: '',
      paramType2: '',
      valueType: 'number',
    },
  ];
  const inputOptions1 = ref<any[]>([]);
  const inputOptions2 = ref<any[]>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const isFuncInput = ref(false);

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^-?\d+$/.test(value);
  const onlyAllowNumber = (value: string) => !value || /^-?[\d.]+$/.test(value);
  const rules: FormRules = {
    funcType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择函数类型',
    },
    func: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择函数方法',
    },
    formula: {
      required: true,
      trigger: ['blur', 'change'],
      validator(_rule: any, value: string) {
        if (!value) {
          return new Error('函数公式不能为空');
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
    inputId2: {
      required: true,
      trigger: ['blur', 'change'],
      validator(_rule: any, value: string) {
        // 检查是否需要验证此字段
        if (localParams.value.formula && localParams.value.inputIdNum === 2) {
          // 验证字段是否已填写
          if (!value) {
            return new Error('请选择输入节点2');
          }
        }
        return true;
      },
    },
    paramValue1: {
      required: true,
      trigger: ['blur', 'change'],
      validator(_rule: any, value: string) {
        // 检查是否需要验证此字段
        if (
          localParams.value.formula &&
          (localParams.value.paramNum === 1 || localParams.value.paramNum === 2)
        ) {
          // 验证字段是否已填写
          if (!value) {
            return new Error('参数值不能为空');
          }
        }
        return true;
      },
    },
    paramValue2: {
      required: true,
      trigger: ['blur', 'change'],
      validator(_rule: any, value: string) {
        // 检查是否需要验证此字段
        if (localParams.value.formula && localParams.value.paramNum === 2) {
          // 验证字段是否已填写
          if (!value) {
            return new Error('参数值2不能为空');
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

      const nodeIdList = properties.inputNodes;
      if (nodeIdList && nodeIdList.length > 0) {
        const inputNodeId = nodeIdList[0];
        const nodeDataTemp = logicFlowUtil.getNodeWithConnections(inputNodeId);
        const nodeDataType = nodeDataTemp.node.properties?.valueType || 'none';
        if (nodeDataType === 'text') {
          funcTypeOptions.value = [
            {
              label: '字符串函数',
              value: 'string',
            },
          ];
          isFuncInput.value = true;
        } else if (nodeDataType === 'int' || nodeDataType === 'number') {
          funcTypeOptions.value = [
            {
              label: '数学函数',
              value: 'math',
            },
          ];
          isFuncInput.value = true;
        } else {
          funcTypeOptions.value = [
            {
              label: '字符串函数',
              value: 'string',
            },
            {
              label: '数学函数',
              value: 'math',
            },
          ];
        }
      }
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

    // 遍历左边node节点
    const nodeIdList = localParams.value.inputNodes;
    if (nodeIdList && nodeIdList.length > 0) {
      const nodeArray = getFilteredLeftNodes(nodeIdList);
      let nodeIdArray: any[] = [];
      // 遍历nodeArray
      nodeArray.forEach((item: any) => {
        const itemId = item.nodeId;
        const itemType = item.valueType;
        let isAddList = false;
        if (value === 'string' && itemType === 'text') {
          isAddList = true;
        } else if (value === 'math' && (itemType === 'int' || itemType === 'number')) {
          isAddList = true;
        }
        if (isAddList) {
          const nodeItem = {
            label: itemId,
            value: itemId,
            type: itemType,
          };
          nodeIdArray.push(nodeItem);
        }
      });
      console.log('nodeIdArray', nodeIdArray);

      if (isFuncInput.value) {
        const inputNodeId = nodeIdList[0];
        const nodeDataTemp = logicFlowUtil.getNodeWithConnections(inputNodeId);
        const nodeDataType = nodeDataTemp.node.properties?.valueType || 'none';
        let nodeIdArray1: any[] = [];
        let isAddList = false;
        if (value === 'string' && nodeDataType === 'text') {
          isAddList = true;
        } else if (value === 'math' && (nodeDataType === 'int' || nodeDataType === 'number')) {
          isAddList = true;
        }
        if (isAddList) {
          const nodeItem = {
            label: inputNodeId,
            value: inputNodeId,
            type: nodeDataType,
          };
          nodeIdArray1.push(nodeItem);
        }
        inputOptions1.value = nodeIdArray1;
        inputOptions2.value = nodeIdArray;
      } else {
        inputOptions1.value = nodeIdArray;
        inputOptions2.value = nodeIdArray;
      }
    }
  };
  // 获取左边节点并过滤
  const getFilteredLeftNodes = (nodeIdList: any[]): any[] => {
    const result: any[] = [];
    const visitedNodes = new Set<string>(); // 用于跟踪已访问的节点，防止循环引用
    const uniqueNodeIds = new Set<string>(); // 用于去重
    const traverseNodes = (nodes: any[]) => {
      for (const nodeId of nodes) {
        // 如果已经访问过该节点，跳过以防止无限递归
        if (visitedNodes.has(nodeId)) {
          continue;
        }
        visitedNodes.add(nodeId);

        // 只有不是以'judgment'或'switch'开头的节点才添加到结果中
        if (!nodeId.startsWith('judgment') && !nodeId.startsWith('switch')) {
          // 获取节点信息以获取 valueType
          const nodeDataTemp = logicFlowUtil.getNodeWithConnections(nodeId);
          const valueType = nodeDataTemp.node.properties?.valueType || 'none';

          // 添加包含 nodeId 和 valueType 的对象到结果中
          if (!uniqueNodeIds.has(nodeId)) {
            result.push({
              nodeId: nodeId,
              valueType: valueType,
            });
            uniqueNodeIds.add(nodeId);
          }
        }
        // 获取左边节点（即使当前节点被过滤，也需要检查它的输入节点）
        const nodeDataTemp = logicFlowUtil.getNodeWithConnections(nodeId);
        const inputNodes: any[] = nodeDataTemp.node.properties?.inputNodes || [];

        if (inputNodes.length > 0) {
          traverseNodes(inputNodes);
        }
      }
    };
    traverseNodes(nodeIdList);
    return result;
  };

  const handleFunc = (_value: string, option: SelectBaseOption | null) => {
    localParams.value.formula = option?.formula;
    localParams.value.describe = option?.label;
    localParams.value.inputIdNum = option?.inputIdNum;
    localParams.value.inputId1 = null;
    localParams.value.inputId2 = null;
    localParams.value.inputIdType1 = option?.inputIdType1;
    localParams.value.inputIdType2 = option?.inputIdType2;
    localParams.value.paramNum = option?.paramNum;
    localParams.value.paramValue1 = null;
    localParams.value.paramValue2 = null;
    localParams.value.paramType1 = option?.paramType1;
    localParams.value.paramType2 = option?.paramType2;
    localParams.value.valueType = option?.valueType;
  };

  // 提交表单
  const confirmForm = async (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    try {
      // 触发表单验证，包括自定义验证规则
      await formRef.value.validate();
      // 如果验证通过，执行提交逻辑
      showState.value = false;
      const inputId1 = localParams.value.inputId1;
      const inputId2 = localParams.value.inputId2;
      const nodeData1 = logicFlowUtil.getNodeWithConnections(inputId1);
      let nodeData2: any = {};
      if (inputId2 && inputId2 !== '') {
        nodeData2 = logicFlowUtil.getNodeWithConnections(inputId2);
      }

      let funcDataArray: string[];
      if (localParams.value.func === 'string') {
        funcDataArray = funcUtils.executionString(localParams.value, nodeData1, nodeData2);
      } else {
        funcDataArray = funcUtils.executionMath(localParams.value, nodeData1, nodeData2);
      }
      const outputValue = funcDataArray[0];
      const valueType = funcDataArray[1];

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
      nodeData.value.properties.valueType = valueType;
      nodeData.value.properties.outputValue = outputValue;
      console.log(nodeData.value);
      emit('submit', nodeData.value);
    } catch (errors: any) {
      // 验证失败，errors 包含验证错误信息
      console.log('表单验证失败:', errors);
      // 不关闭模态框，让用户修正错误
    } finally {
      // 确保无论验证成功还是失败都会重置加载状态
      formBtnLoading.value = false;
    }
  };
</script>
