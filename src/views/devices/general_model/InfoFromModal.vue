<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 720px"
    title="新增通用物模型"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
      style="padding-top: 0px !important; padding-bottom: 0px !important"
    >
      <div class="from-group">
        <n-form-item label="模型标识" path="modelIdentity">
          <n-input
            maxlength="20"
            placeholder="请输入模型标识"
            v-model:value="localParams.modelIdentity"
            clearable
          />
        </n-form-item>
        <n-form-item label="模型名称" path="modelName">
          <n-input
            maxlength="20"
            placeholder="请输入模型名称"
            v-model:value="localParams.modelName"
            clearable
          />
        </n-form-item>
        <n-form-item label="所属分组" path="groupId">
          <n-select
            v-model:value="localParams.groupId"
            :options="groupOptions"
            placeholder="请选择分组"
          />
        </n-form-item>
        <n-form-item label="模型类别">
          <n-button-group>
            <n-button
              :type="localParams.modelType == 1 ? 'info' : 'default'"
              style="width: 100px; border-radius: 4px 0px 0px 4px"
              @click="handleModelType(1)"
              >属性</n-button
            >
            <n-button
              :type="localParams.modelType == 2 ? 'info' : 'default'"
              style="width: 100px"
              @click="handleModelType(2)"
              >功能</n-button
            >
            <n-button
              :type="localParams.modelType == 3 ? 'info' : 'default'"
              style="width: 100px; border-radius: 0px 4px 4px 0px"
              @click="handleModelType(3)"
              >事件</n-button
            >
          </n-button-group>
        </n-form-item>
        <n-form-item label="模型特性">
          <n-checkbox
            :checked="(localParams.charts === null ? 1 : localParams.charts) === 1"
            @update:checked="handleCharts"
            style="margin-right: 15px"
            v-if="(localParams.charts === null ? 1 : localParams.charts) === 1"
            >图表展示</n-checkbox
          >
          <n-checkbox
            :checked="(localParams.modelType === null ? 1 : localParams.modelType) === 1"
            @update:checked="handleMonitor"
            style="margin-right: 15px"
            v-if="(localParams.modelType === null ? 1 : localParams.modelType) === 1"
            >实时监测</n-checkbox
          >
          <n-checkbox
            :checked="(localParams.readonly === null ? 1 : localParams.readonly) === 1"
            @update:checked="handleReadonly"
            style="margin-right: 15px"
            :disabled="(localParams.readonly === null ? 1 : localParams.readonly) === 3"
            >只读数据</n-checkbox
          >
          <n-checkbox
            :checked="(localParams.history === null ? 1 : localParams.history) === 1"
            @update:checked="handleHistory"
            style="margin-right: 15px"
            >历史存储</n-checkbox
          >
          <n-checkbox
            :default-checked="(localParams.share === null ? 1 : localParams.share) === 1"
            @update:checked="handleShare"
            >分享权限</n-checkbox
          >
        </n-form-item>
      </div>
      <div class="from-group">
        <n-form-item label="数据类型" path="dataType">
          <n-select
            v-model:value="localParams.dataType"
            :options="dataTypeOptions"
            placeholder="请选择数据类型"
            @update:value="handleDataType"
          />
        </n-form-item>
        <!-- 数据类型 => int, number -->
        <n-form-item
          v-if="showState && (localParams.dataType === 'int' || localParams.dataType === 'number')"
        >
          <template #label>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="16" color="#666666">
                  <QuestionCircleFilled />
                </n-icon>
              </template>
              该取值范围只作用于数据下发，数据上报不受其影响
            </n-tooltip>
            取值范围
          </template>
          <div class="before-input">
            <n-input
              placeholder="最小值"
              :maxlength="localParams.dataType === 'int' ? 8 : 16"
              v-model:value="localParams.datas.min"
              clearable
              :allow-input="localParams.dataType === 'int' ? onlyAllowInt : onlyAllowNumber"
            />
          </div>
          <div class="before-text">到</div>
          <div class="before-input">
            <n-input
              :maxlength="localParams.dataType === 'int' ? 8 : 16"
              placeholder="最大值"
              v-model:value="localParams.datas.max"
              clearable
              :allow-input="localParams.dataType === 'int' ? onlyAllowInt : onlyAllowNumber"
            />
          </div>
        </n-form-item>
        <n-form-item
          label="单位"
          v-if="showState && (localParams.dataType === 'int' || localParams.dataType === 'number')"
        >
          <n-input
            maxlength="10"
            placeholder="请输入单位，例如: ℃"
            v-model:value="localParams.datas.unit"
            clearable
          />
        </n-form-item>
        <n-form-item
          label="步长"
          v-if="showState && (localParams.dataType === 'int' || localParams.dataType === 'number')"
        >
          <n-input
            :maxlength="localParams.dataType === 'int' ? 8 : 16"
            placeholder="请输入步长，例如: 1"
            v-model:value="localParams.datas.step"
            clearable
            :allow-input="localParams.dataType === 'int' ? onlyAllowInt : onlyAllowNumber"
          />
        </n-form-item>
        <!-- 数据类型 => text -->
        <n-form-item label="最大长度" v-if="showState && localParams.dataType === 'text'">
          <n-input
            :maxlength="8"
            placeholder="请输入最大长度，例如: 1024"
            v-model:value="localParams.datas.maxLength"
            clearable
            :allow-input="onlyAllowInt"
          />
        </n-form-item>
        <!-- 数据类型 => date -->
        <n-form-item label="数据格式" v-if="showState && localParams.dataType === 'date'">
          <n-select
            v-model:value="localParams.datas.source"
            :options="dateFormatOptions"
            placeholder="请选择数据格式"
          />
        </n-form-item>
        <n-form-item label="输出格式" v-if="showState && localParams.dataType === 'date'">
          <n-input
            :maxlength="30"
            placeholder="请输入输出格式，例如: yyyy-MM-dd HH:mm:ss"
            v-model:value="localParams.datas.format"
            clearable
          />
        </n-form-item>
        <!-- 数据类型 => bool -->
        <n-form-item label="False值" v-if="showState && localParams.dataType === 'bool'">
          <n-input
            :maxlength="20"
            placeholder="请输入false值(0)对应文本，例如: 关闭"
            v-model:value="localParams.datas.falseText"
            clearable
          />
        </n-form-item>
        <n-form-item label="True值" v-if="showState && localParams.dataType === 'bool'">
          <n-input
            :maxlength="20"
            placeholder="请输入true值(1)对应文本，例如: 开启"
            v-model:value="localParams.datas.trueText"
            clearable
          />
        </n-form-item>
        <!-- 数据类型 => array -->
        <n-form-item label="元素个数" v-if="showState && localParams.dataType === 'array'">
          <n-input
            :maxlength="3"
            placeholder="超过数量数组将被抛弃。默认0 无限制，最大值 999"
            v-model:value="localParams.datas.length"
            clearable
            :allow-input="onlyAllowInt"
          />
        </n-form-item>
        <n-form-item label="数组类型" v-if="showState && localParams.dataType === 'array'">
          <n-radio-group v-model:value="localParams.datas.itemType" name="radioItemType">
            <n-space>
              <n-radio value="int">整数</n-radio>
              <n-radio value="number">小数</n-radio>
              <n-radio value="text">字符串</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <!-- 数据类型 => enum -->
        <n-form-item label="展示方式" v-if="showState && localParams.dataType === 'enum'">
          <n-select
            v-model:value="localParams.datas.subassembly"
            :options="subassemblyOptions"
            placeholder="请选择展示方式"
          />
        </n-form-item>
        <n-form-item label="枚举项" v-if="showState && localParams.dataType === 'enum'">
          <div class="enum-params">
            <div class="enum-line" v-for="(item, index) in localParams.datas.values" :key="index">
              <div class="enum-item1">
                <n-input
                  maxlength="2"
                  placeholder="参数值，例如 0"
                  v-model:value="item.value"
                  clearable
                  :allow-input="onlyAllowInt"
                />
              </div>
              <div class="enum-item2">
                <n-input
                  maxlength="20"
                  placeholder="参数描述，例如：10%开度"
                  v-model:value="item.label"
                  clearable
                />
              </div>
              <div class="enum-delete" v-if="index > 0">
                <a href="javascript:;" @click="deleteEnumItem(index)">
                  <n-icon size="18">
                    <CloseCircleFilled />
                  </n-icon>
                </a>
              </div>
            </div>
            <div class="enum-add">
              <div class="enum-add-line">
                <n-button quaternary type="info" @click="addEnumItem">
                  <n-icon size="12" color="#666" style="margin-right: 4px">
                    <PlusOutlined />
                  </n-icon>
                  添加枚举项
                </n-button>
              </div>
            </div>
          </div>
        </n-form-item>
      </div>
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
  import { addGeneralModel } from '@/api/devices/generalModel';
  // @ts-ignore
  import { QuestionCircleFilled, PlusOutlined, CloseCircleFilled } from '@vicons/antd';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        modelIdentity: '',
        modelName: '',
        groupId: null,
        modelType: '1',
        dataType: 'int',
        dataDefinition: '',
        datas: {
          min: null,
          max: null,
          unit: '',
          step: null,
        },
        charts: 0,
        monitor: 0,
        history: 0,
        readonly: 0,
        share: 0,
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const groupOptions = ref<any[]>([]);
  const dataTypeOptions = ref<any[]>([
    {
      label: '整数',
      value: 'int',
    },
    {
      label: '小数',
      value: 'number',
    },
  ]);
  const dateFormatOptions = [
    {
      label: '时间戳',
      value: 'timestamp',
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
      label: '日期+时间',
      value: 'datetime',
    },
  ];
  const subassemblyOptions = [
    {
      label: '下拉框',
      value: 'select',
    },
    {
      label: '按钮',
      value: 'button',
    },
  ];

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.options, () => props.params],
    ([newShowModel, newOptions, newParams]) => {
      showState.value = newShowModel;
      groupOptions.value = newOptions;
      localParams.value = newParams;
      // 确保 localParams.value 不为 undefined
      if (newParams) {
        localParams.value = JSON.parse(JSON.stringify(newParams));
        // 如果 datas 不存在，则初始化它
        if (!localParams.value.datas) {
          localParams.value.datas = initDataDefinition(localParams.value.dataType);
        }
      } else {
        localParams.value = {
          modelIdentity: '',
          modelName: '',
          groupId: null,
          modelType: '1',
          dataType: 'int',
          datas: {
            min: null,
            max: null,
            unit: '',
            step: null,
          },
          charts: 0,
          monitor: 0,
          history: 0,
          readonly: 0,
          share: 0,
        };
      }
      console.log('localParams.value.datas', localParams.value.datas);
    }
  );
  const initDataDefinition = (dataType: string) => {
    switch (dataType) {
      case 'int':
      case 'number':
        return {
          min: null,
          max: null,
          unit: '',
          step: null,
        };
      case 'text':
        return {
          maxLength: null,
        };
      case 'date':
        return {
          source: 'timestamp',
          format: 'yyyy-MM-dd',
        };
      case 'bool':
        return {
          falseText: '',
          trueText: '',
        };
      case 'array':
        return {
          length: '0',
          itemType: 'int',
        };
      case 'enum':
        return {
          subassembly: 'select', // select/button
          values: [
            {
              value: '',
              label: '',
            },
          ],
        };
      default:
        return {
          min: null,
          max: null,
          unit: '',
          step: null,
        };
    }
  };

  // 输入限制
  const onlyAllowInt = (value: string) => !value || /^-?\d*$/.test(value);
  const onlyAllowNumber = (value: string) => !value || /^-?\d*\.?\d*$/.test(value);

  // 表单验证
  const rules: FormRules = {
    modelIdentity: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入模型标识',
    },
    modelName: {
      required: true,
      message: '请输入模型名称',
      trigger: ['blur', 'input'],
    },
    groupId: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择分组',
    },
  };

  // 类别切换
  const handleModelType = (value: number) => {
    if (value === 1) {
      localParams.value.charts = 1;
      localParams.value.monitor = 1;
      localParams.value.readonly = 1;
      localParams.value.history = 1;
      localParams.value.share = 1;
      dataTypeOptions.value = [
        {
          label: '整数',
          value: 'int',
        },
        {
          label: '小数',
          value: 'number',
        },
      ];
    } else if (value === 2) {
      localParams.value.charts = 0;
      localParams.value.monitor = 0;
      localParams.value.readonly = 0;
      localParams.value.history = 1;
      localParams.value.share = 1;
      dataTypeOptions.value = [
        {
          label: '整数',
          value: 'int',
        },
        {
          label: '小数',
          value: 'number',
        },
        {
          label: '字符串',
          value: 'text',
        },
        {
          label: '布尔值',
          value: 'bool',
        },
        {
          label: '数组',
          value: 'array',
        },
        {
          label: '枚举',
          value: 'enum',
        },
      ];
    } else {
      localParams.value.charts = 0;
      localParams.value.monitor = 0;
      localParams.value.readonly = 1;
      localParams.value.history = 1;
      localParams.value.share = 0;
      dataTypeOptions.value = [
        {
          label: '整数',
          value: 'int',
        },
        {
          label: '小数',
          value: 'number',
        },
        {
          label: '字符串',
          value: 'text',
        },
        {
          label: '日期时间',
          value: 'date',
        },
        {
          label: '布尔值',
          value: 'bool',
        },
        {
          label: '数组',
          value: 'array',
        },
        {
          label: '枚举',
          value: 'enum',
        },
      ];
    }
    localParams.value.modelType = value;
  };
  // 模型特性选择
  const handleCharts = (checked: boolean) => {
    localParams.value.charts = checked ? 1 : 0;
  };
  const handleMonitor = (checked: boolean) => {
    localParams.value.monitor = checked ? 1 : 0;
  };
  const handleReadonly = (checked: boolean) => {
    if (localParams.value.modelType !== 3) {
      localParams.value.readonly = checked ? 1 : 0;
    }
  };
  const handleHistory = (checked: boolean) => {
    localParams.value.history = checked ? 1 : 0;
  };
  const handleShare = (checked: boolean) => {
    localParams.value.share = checked ? 1 : 0;
  };

  // 选择数据类型--初始化对应的默认值
  const handleDataType = (value: string) => {
    const newDataDefinition = initDataDefinition(value);

    // 确保 localParams.value 存在并且有 datas 属性
    if (!localParams.value) {
      localParams.value = {};
    }

    // 将新创建的数据定义赋给 datas 属性
    localParams.value.datas = newDataDefinition;
  };

  // 增加枚举
  const addEnumItem = () => {
    let datas = localParams.value.datas;
    let values = datas.values;
    let newItem = {
      value: '',
      label: '',
    };
    values.push(newItem);
    datas.values = values;
    localParams.value.datas = datas;
  };
  // 删除枚举
  const deleteEnumItem = (index: number) => {
    localParams.value.datas.value.values.splice(index, 1);
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const params = {
          modelIdentity: localParams.value.modelIdentity,
          modelName: localParams.value.modelName,
          groupId: parseInt(localParams.value.groupId),
          modelType: localParams.value.modelType,
          dataType: localParams.value.dataType,
          dataDefinition: JSON.stringify(localParams.value.datas),
          charts: localParams.value.charts,
          monitor: localParams.value.monitor,
          history: localParams.value.history,
          readonly: localParams.value.readonly,
          share: localParams.value.share,
        };

        const result = (await addGeneralModel(params)) as unknown as {
          status: string;
          message: string;
        };
        if (result.status === 'success') {
          window['$message'].success('提交成功');
          setTimeout(() => {
            showState.value = false;
            emit('submit');
          });
        } else {
          window['$message'].error(result.message);
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };
</script>

<style lang="less" scoped>
  .from-group {
    width: 100%;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    padding-top: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
    .before-input {
      width: 240px;
      float: left;
    }
    .before-text {
      width: 45px;
      text-align: center;
      float: left;
    }
  }

  .enum-params {
    width: 100%;
    .enum-line {
      width: 100%;
      height: 46px;
      .enum-item1 {
        width: 140px;
        height: 36px;
        margin-right: 20px;
        float: left;
      }
      .enum-item2 {
        width: 200px;
        height: 36px;
        float: left;
      }
      .enum-delete {
        width: 36px;
        height: 36px;
        padding-top: 9px;
        text-align: right;
        float: left;
      }
    }
    .enum-add {
      width: 100%;
      height: 46px;
      .enum-add-line {
        width: 100%;
        height: 36px;
      }
    }
  }
</style>
