<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 800px"
    title="输出"
    @after-leave="closeModalAfter"
  >
    <n-form
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="localParams"
    >
      <n-form-item label="输出对象" path="nodeId">
        <n-select
          v-model:value="localParams.nodeId"
          :options="exportOptions"
          placeholder="请选择输出对象"
          @update:value="handleExport"
        />
      </n-form-item>
      <n-form-item label="输出类型">
        <n-input :value="localParams.valueType || ''" disabled />
      </n-form-item>
      <n-form-item label="输出值">
        <n-input :value="localParams.outputValue || ''" disabled />
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
    nodeId: null,
    valueType: '',
    outputValue: '',
  });
  const exportOptions = ref<any>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const rules: FormRules = {
    nodeId: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择输出对象',
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
        nodeId: properties.nodeId,
        valueType: properties.valueType,
        outputValue: properties.outputValue,
      };

      const nodeIdList = properties.inputNodes;
      let nodeIdArray: any[] = [];
      if (nodeIdList && nodeIdList.length > 0) {
        const idArray = getFilteredLeftNodes(nodeIdList);

        idArray.forEach((item: { nodeId: string; valueType: string; outputValue: string }) => {
          const nodeItem = {
            label: item.nodeId,
            value: item.nodeId,
            type: item.valueType,
            outputValue: item.outputValue,
          };
          nodeIdArray.push(nodeItem);
        });
      }
      exportOptions.value = nodeIdArray;
    }
  });

  // 获取左边节点并过滤
  const getFilteredLeftNodes = (
    nodeIdList: string[]
  ): { nodeId: string; valueType: string; outputValue: string }[] => {
    const result: { nodeId: string; valueType: string; outputValue: string }[] = [];
    const visitedNodes = new Set<string>(); // 用于跟踪已访问的节点，防止循环引用
    const uniqueNodeIds = new Set<string>(); // 用于去重
    const traverseNodes = (nodes: string[]) => {
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
          const outputValue = nodeDataTemp.node.properties?.outputValue || '';

          // 添加包含 nodeId 和 valueType 的对象到结果中
          if (!uniqueNodeIds.has(nodeId)) {
            result.push({
              nodeId: nodeId,
              valueType: valueType,
              outputValue: outputValue,
            });
            uniqueNodeIds.add(nodeId);
          }
        }
        // 获取左边节点（即使当前节点被过滤，也需要检查它的输入节点）
        const nodeDataTemp = logicFlowUtil.getNodeWithConnections(nodeId);
        const inputNodes: string[] = nodeDataTemp.node.properties?.inputNodes || [];

        if (inputNodes.length > 0) {
          traverseNodes(inputNodes);
        }
      }
    };
    traverseNodes(nodeIdList);
    return result;
  };

  const handleExport = (value: string, option: SelectBaseOption | null) => {
    localParams.value.nodeId = value;
    localParams.value.valueType = option?.type;
    localParams.value.outputValue = option?.outputValue;
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

      nodeData.value.properties.nodeId = localParams.value.nodeId;
      nodeData.value.properties.valueType = localParams.value.valueType;
      nodeData.value.properties.outputValue = localParams.value.outputValue;
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
