<template>
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 700px"
    title="条件判断"
    @after-leave="closeModalAfter"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="localParams"
      class="py-4"
      style="padding-bottom: 0px !important"
    >
      <n-form-item label="">
        <n-dynamic-input v-model:value="localParams" :on-create="handleCreate">
          <template #default="{ value: item, index }">
            <div v-if="item" style="display: flex; align-items: center; width: 100%">
              <!-- 连接词验证 (index > 0 时验证) -->
              <div style="margin-right: 12px; width: 13%">
                <n-form-item
                  ignore-path-change
                  :show-label="false"
                  :path="`[${index}].link`"
                  :rule="index > 0 ? linkRule : undefined"
                >
                  <n-select
                    v-model:value="item.link"
                    :options="linkTypeOptions"
                    :disabled="index == 0"
                    placeholder="连接词"
                  />
                </n-form-item>
              </div>

              <!-- 输入对象验证 -->
              <div style="margin-right: 12px; width: 27%">
                <n-form-item
                  ignore-path-change
                  :show-label="false"
                  :path="`[${index}].nodeId`"
                  :rule="nodeIdRule"
                >
                  <n-select
                    v-model:value="item.nodeId"
                    :options="nodeIdOptions"
                    placeholder="输入对象"
                    @update:value="(value, option) => handleNodeIdChange(index, value, option)"
                  />
                </n-form-item>
              </div>

              <!-- 操作符验证 -->
              <div style="margin-right: 12px; width: 12%">
                <n-form-item
                  ignore-path-change
                  :show-label="false"
                  :path="`[${index}].operator`"
                  :rule="operatorRule"
                >
                  <n-select v-model:value="item.operator" :options="operatorOptions" />
                </n-form-item>
              </div>

              <!-- 值验证 -->
              <div style="margin-right: 12px; width: 38%">
                <n-form-item
                  ignore-path-change
                  :show-label="false"
                  :path="`[${index}].value`"
                  :rule="valueRule"
                >
                  <n-select
                    v-model:value="item.value"
                    :options="booleanOptions"
                    v-if="item.valueType === 'bool'"
                  />
                  <n-input
                    maxlength="10"
                    :placeholder="
                      item.valueType === 'number'
                        ? '请输入数字'
                        : item.valueType === 'int'
                        ? '请输入整数'
                        : ''
                    "
                    v-model:value="item.value"
                    :allow-input="
                      item.valueType === 'number'
                        ? onlyAllowNumber
                        : item.valueType === 'int'
                        ? onlyAllowInt
                        : () => true
                    "
                    @blur="() => handleValueBlur(index)"
                    clearable
                    v-else
                  />
                </n-form-item>
              </div>
            </div>
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
  import { onMounted, ref, watch } from 'vue';
  // @ts-ignore
  import { PlusOutlined, MinusOutlined } from '@vicons/antd';
  import { cloneDeep } from 'lodash-es';
  import { SelectBaseOption } from 'naive-ui/es/select/src/interface';
  import { logicFlowUtil } from '../LogicFlowUtil'; // 导入logicFlowUtil实例

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
  const localParams = ref<any[]>([
    {
      link: '',
      nodeId: '',
      operator: '==',
      valueType: '',
      value: '',
    },
  ]);
  const formRef = ref(); // 表单引用
  const nodeIdOptions = ref<any[]>([]);
  const linkTypeOptions = [
    {
      label: 'and',
      value: 'and',
    },
    {
      label: 'or',
      value: 'or',
    },
  ];
  const operatorOptions = ref<any[]>([
    {
      label: '==',
      value: '==',
    },
    {
      label: '!=',
      value: '!=',
    },
    {
      label: '>',
      value: '>',
    },
    {
      label: '>=',
      value: '>=',
    },
    {
      label: '<',
      value: '<',
    },
    {
      label: '<=',
      value: '<=',
    },
  ]);
  const booleanOptions = [
    {
      label: 'true',
      value: 'true',
    },
    {
      label: 'false',
      value: 'false',
    },
  ];
  const formBtnLoading = ref(false);

  // 限制输入
  const onlyAllowNumber = (value: string) => !value || /^\d+(\.\d*)?$/.test(value);
  const onlyAllowInt = (value: string) => !value || /^\d+$/.test(value);

  // 表单验证规则
  const linkRule = {
    required: true,
    validator(_rule: any, value: string) {
      if (!value || value.trim() === '') {
        return new Error('请选择连接词');
      }
      return true;
    },
    trigger: ['blur', 'change'],
  };

  const nodeIdRule = {
    required: true,
    validator(_rule: any, value: string) {
      if (!value || value.trim() === '') {
        return new Error('请选择输入对象');
      }
      return true;
    },
    trigger: ['blur', 'change'],
  };

  const operatorRule = {
    required: true,
    validator(_rule: any, value: string) {
      if (!value || value.trim() === '') {
        return new Error('请选择操作符');
      }
      return true;
    },
    trigger: ['blur', 'change'],
  };

  const valueRule = {
    required: true,
    validator(_rule: any, value: string) {
      if (!value || value.trim() === '') {
        return new Error('请输入值');
      }
      return true;
    },
    trigger: ['blur', 'input'],
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

      const nodeIdList = nodeData.value.properties.inputNodes;
      let nodeIdArray: any[] = [];
      if (nodeIdList && nodeIdList.length > 0) {
        const idArray = getFilteredLeftNodes(nodeIdList);

        idArray.forEach((item: string) => {
          const nodeDataTemp = logicFlowUtil.getNodeWithConnections(item);
          const type = nodeDataTemp.node.properties?.valueType || 'text';
          const nodeItem = {
            label: item,
            value: item,
            type: type,
          };
          nodeIdArray.push(nodeItem);
        });
      }
      nodeIdOptions.value = nodeIdArray;

      if (nodeData.value.properties.condition && nodeData.value.properties.condition.length > 0) {
        try {
          localParams.value = nodeData.value.properties.condition;
        } catch (e) {
          localParams.value = [
            {
              link: '',
              nodeId: '',
              operator: '==',
              valueType: '',
              value: '',
            },
          ];
        }
      } else {
        localParams.value = [
          {
            link: '',
            nodeId: '',
            operator: '==',
            valueType: '',
            value: '',
          },
        ];
      }
    }
  });

  // 获取左边节点并过滤
  const getFilteredLeftNodes = (nodeIdList: any[]): string[] => {
    const result: string[] = [];
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
          uniqueNodeIds.add(nodeId);
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
    // 将 Set 转换为数组
    result.push(...uniqueNodeIds);
    return result;
  };

  const handleCreate = () => {
    return {
      link: 'and', // 新增条件默认使用 and 连接词
      nodeId: '',
      operator: '==',
      valueType: '',
      value: '',
    };
  };

  const handleNodeIdChange = (index: number, _value: string, option: SelectBaseOption | null) => {
    localParams.value[index].valueType = option?.type || '';
    if (option?.type === 'bool') {
      localParams.value[index].value = 'false';
      operatorOptions.value = [
        {
          label: '==',
          value: '==',
        },
        {
          label: '!=',
          value: '!=',
        },
      ];
    } else if (option?.type === 'int' || option?.type === 'number') {
      localParams.value[index].value = '';
      operatorOptions.value = [
        {
          label: '==',
          value: '==',
        },
        {
          label: '!=',
          value: '!=',
        },
        {
          label: '>',
          value: '>',
        },
        {
          label: '>=',
          value: '>=',
        },
        {
          label: '<',
          value: '<',
        },
        {
          label: '<=',
          value: '<=',
        },
      ];
    } else {
      localParams.value[index].value = '';
      operatorOptions.value = [
        {
          label: '==',
          value: '==',
        },
        {
          label: '!=',
          value: '!=',
        },
      ];
    }
  };

  // 处理值输入框失去焦点事件
  const handleValueBlur = (index: number) => {
    const valType = localParams.value[index].valueType;
    if (valType === 'number') {
      const value = localParams.value[index].value;
      if (value && value.endsWith('.')) {
        localParams.value[index].value = value.slice(0, -1);
      }
    }
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;

    // 使用表单验证
    formRef.value?.validate((errors: any) => {
      if (!errors) {
        showState.value = false;
        nodeData.value.properties.condition = localParams.value;
        emit('submit', nodeData.value);
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };

  onMounted(async () => {
    nodeIdOptions.value = [];
    operatorOptions.value = [
      { label: '==', value: '==' },
      { label: '!=', value: '!=' },
    ];
  });
</script>
<style lang="less" scoped>
  :deep(.n-form-item .n-form-item-feedback-wrapper) {
    display: none;
  }
</style>
