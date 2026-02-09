<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 540px"
    title="多分支判断"
    @after-leave="closeModalAfter"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="localParams"
      :rules="rules"
      style="padding-bottom: 0px !important"
    >
      <n-form-item label="判断参数" path="nodeId">
        <n-input
          placeholder="尚无输入对象，请从左边接入输入对象"
          v-model:value="localParams.nodeId"
          disabled
        />
      </n-form-item>
      <n-form-item class="ttl" label="参数值" path="condition">
        <n-dynamic-input v-model:value="localParams.condition" :on-create="createCondition">
          <template #create-button-default> 添加条件 </template>
          <template #default="{ index }">
            <n-form-item
              :show-label="false"
              :path="`condition[${index}].caseValue`"
              :rule="conditionRule"
            >
              <n-input
                :value="getConditionValue(index)"
                @update:value="(value) => updateConditionValue(index, value)"
                placeholder="请输入参数值"
              />
            </n-form-item>
          </template>
        </n-dynamic-input>
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
  import { logicFlowUtil } from '../LogicFlowUtil';
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
  const localParams = ref<any>({});
  const formRef = ref(); // 表单引用
  const formBtnLoading = ref(false);

  // 创建条件项的方法，确保返回正确的对象格式
  const createCondition = () => {
    return {
      caseValue: '',
      caseValueType: localParams.value.inputValueType,
      toNodeId: '',
    };
  };

  // 获取条件值，处理可能为 null 的情况
  const getConditionValue = (index: number) => {
    const item = localParams.value.condition[index];
    return item && item.caseValue ? item.caseValue : '';
  };

  // 更新条件值
  const updateConditionValue = (index: number, value: string) => {
    if (!localParams.value.condition[index]) {
      localParams.value.condition[index] = {
        caseValue: '',
        caseValueType: localParams.value.inputValueType,
        toNodeId: '',
      };
    }
    localParams.value.condition[index].caseValue = value;
  };

  // 表单验证规则
  const conditionRule = {
    required: true,
    message: '参数值不能为空',
    trigger: ['input', 'blur'],
  };

  const rules = {
    nodeId: {
      required: true,
      message: '判断参数不能为空',
      trigger: ['input', 'blur'],
    },
    condition: {
      required: true,
      validator(_rule: any, value: any[]) {
        if (!value || value.length === 0) {
          return new Error('至少需要添加一个参数值');
        }
        for (let i = 0; i < value.length; i++) {
          // 检查值是否存在且是对象，然后检查caseValue
          if (!value[i] || !value[i].caseValue || value[i].caseValue.trim() === '') {
            return new Error(`参数值第${i + 1}项不能为空`);
          }
        }
        return true;
      },
      trigger: ['input', 'blur'],
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
      nodeData.value.properties = nodeData.value.properties || {};

      if (nodeData.value.properties.inputNodes && nodeData.value.properties.inputNodes.length > 0) {
        const nodeId = nodeData.value.properties.inputNodes[0];
        const nodeDataTemp = logicFlowUtil.getNodeWithConnections(nodeId);
        const inputValueType = nodeDataTemp.node.properties?.valueType || 'text';

        if (nodeData.value.properties.condition && nodeData.value.properties.condition.length > 0) {
          try {
            // 确保每个条件项都是正确的对象格式
            const processedConditions = nodeData.value.properties.condition.map((cond: any) => {
              return cond && typeof cond === 'object'
                ? cond
                : { caseValue: cond || '', caseValueType: inputValueType, toNodeId: '' };
            });

            localParams.value = {
              nodeId,
              inputValueType,
              condition: processedConditions,
            };
          } catch (e) {
            console.error('解析条件失败:', e);
            localParams.value = {
              nodeId,
              inputValueType,
              condition: [{ caseValue: '', caseValueType: inputValueType, toNodeId: '' }],
            };
          }
        } else {
          localParams.value = {
            nodeId,
            inputValueType,
            condition: [{ caseValue: '', caseValueType: inputValueType, toNodeId: '' }],
          };
        }
      }
    } else {
      localParams.value = {
        nodeId: '',
        inputValueType: '',
        condition: [{ caseValue: '', caseValueType: 'text', toNodeId: '' }],
      };
    }
  });

  // 提交表单
  const confirmForm = async (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;

    try {
      // 使用表单验证
      await formRef.value?.validate();
      console.log('验证成功');
      showState.value = false;
      nodeData.value.properties.condition = localParams.value.condition;
      emit('submit', nodeData.value);
    } catch (errors) {
      console.log('验证失败:', errors);
      window['$message'].error('请填写完整信息');
    } finally {
      formBtnLoading.value = false;
    }
  };
</script>
<style lang="less" scoped>
  .ttl :deep(.n-form-item .n-form-item-feedback-wrapper) {
    display: none;
  }
</style>
