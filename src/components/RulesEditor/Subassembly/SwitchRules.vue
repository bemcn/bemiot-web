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
      class="py-4"
      style="padding-bottom: 0px !important"
    >
      <n-form-item label="判断参数" path="nodeId">
        <n-input placeholder="无可用参数" :value="localParams.nodeId" readonly />
      </n-form-item>
      <n-form-item class="ttl" label="参数值" path="condition">
        <n-dynamic-input v-model:value="localParams.condition" placeholder="请输入参数值">
          <template #create-button-default> 添加条件 </template>
          <template #default="{ index }">
            <n-form-item :show-label="false" :path="`condition[${index}]`" :rule="conditionRule">
              <n-input v-model:value="localParams.condition[index]" placeholder="请输入参数值" />
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
  const localParams = ref<any>({
    nodeId: '',
    condition: [''], // 初始化为包含一个空字符串的数组，以满足验证要求
  });
  const formRef = ref(); // 表单引用
  const formBtnLoading = ref(false);

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
      validator(_rule: any, value: string[]) {
        if (!value || value.length === 0) {
          return new Error('至少需要添加一个参数值');
        }
        for (let i = 0; i < value.length; i++) {
          if (!value[i] || value[i].trim() === '') {
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
      let nodeId = '';
      let inputValueType = '';
      if (nodeData.value.inputNodes && nodeData.value.inputNodes.length > 0) {
        const id = nodeData.value.inputNodes[0];
        if (logicFlowUtil.logicFlow) {
          const node = logicFlowUtil.logicFlow.getNodeDataById(id);
          const nodeProperties = (node as any).getProperties();
          nodeId = id;
          inputValueType = nodeProperties.valueType;
        }
      } else if (nodeData.value.properties.nodeId) {
        // 如果没有inputNodes，但properties中已经有nodeId，则使用已有的值
        nodeId = nodeData.value.properties.nodeId;
        inputValueType = nodeData.value.properties.inputValueType || '';
      }
      if (nodeData.value.properties.condition && nodeData.value.properties.condition.length > 0) {
        try {
          localParams.value = {
            nodeId,
            inputValueType,
            condition: [...nodeData.value.properties.condition],
          };
        } catch (e) {
          console.error('解析条件失败:', e);
          localParams.value = {
            nodeId,
            inputValueType,
            condition: [''],
          };
        }
      } else {
        localParams.value = {
          nodeId,
          inputValueType,
          condition: [''],
        };
      }
      console.log('localParams.value:', localParams.value);
    }
  });

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;

    // 使用表单验证
    formRef.value?.validate((errors: any) => {
      if (!errors) {
        showState.value = false;
        nodeData.value.properties.nodeId = localParams.value.nodeId;
        nodeData.value.properties.inputValueType = localParams.value.inputValueType;
        nodeData.value.properties.condition = localParams.value.condition;
        emit('submit', nodeData.value);
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };
</script>
<style lang="less" scoped>
  .ttl :deep(.n-form-item .n-form-item-feedback-wrapper) {
    display: none;
  }
</style>
