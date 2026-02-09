<template>
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 540px"
    :title="title"
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
      <n-form-item :label="label1" path="mainNode">
        <n-select
          v-model:value="localParams.mainNode"
          :options="nodeIdOptions"
          :placeholder="`请选择${label1}`"
        />
      </n-form-item>
      <n-form-item class="ttl" :label="label2" path="subNodes">
        <n-dynamic-input v-model:value="localParams.subNodes" :placeholder="`请选择${label2}`">
          <template #create-button-default> 添加{{ label2 }} </template>
          <template #default="{ value, index }">
            <div style="display: flex; align-items: center; width: 100%">
              <n-select
                :value="value"
                @update:value="(val) => (localParams.subNodes[index] = val)"
                :options="nodeIdOptions"
                :placeholder="`请选择${label2}`"
                style="flex: 1"
              />
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
  import { computed, onMounted, ref, watch } from 'vue';
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
  const title = ref('');
  const label1 = ref('');
  const label2 = ref('');
  const nodeData: any = ref(null);
  const nodeType = ref('');
  const localParams = ref<any>({
    mainNode: null,
    subNodes: [null],
  });
  const formRef = ref(); // 表单引用
  const formBtnLoading = ref(false);
  const nodeIdOptions = ref<any[]>([]);

  // 表单验证规则
  const rules = computed(() => {
    return {
      mainNode: {
        required: true,
        message: `请选择${label1.value}`,
        trigger: ['change', 'blur'],
      },
      subNodes: {
        required: true,
        validator(_rule: any, value: string[]) {
          if (!value || value.length === 0) {
            return new Error(`至少需要添加一个${label2.value}`);
          }
          for (let i = 0; i < value.length; i++) {
            if (!value[i] || value[i].trim() === '') {
              return new Error(`${label2.value}第${i + 1}项不能为空`);
            }
          }
          return true;
        },
        trigger: ['input', 'blur'],
      },
    };
  });

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.data], ([newShowModel, newData]) => {
    showState.value = newShowModel;
    if (newShowModel && newShowModel === true) {
      // 使用cloneDeep创建数据副本，避免MobX的observable对象重复引用问题
      nodeData.value = newData ? cloneDeep(newData) : {};
      nodeData.value.properties = nodeData.value.properties || {};

      nodeType.value = nodeData.value.properties.type;
      if (nodeType.value === 'add') {
        title.value = '加法计算';
        label1.value = '被加数';
        label2.value = '加数';
      } else if (nodeType.value === 'subtract') {
        title.value = '减法计算';
        label1.value = '被减数';
        label2.value = '减数';
      } else if (nodeType.value === 'multiply') {
        title.value = '乘法计算';
        label1.value = '被乘数';
        label2.value = '乘数';
      } else if (nodeType.value === 'divide') {
        title.value = '除法计算';
        label1.value = '被除数';
        label2.value = '除数';
      } else if (nodeType.value === 'modular') {
        title.value = '除法取余计算';
        label1.value = '被除数';
        label2.value = '除数';
      }

      let nodeIdArray: any[] = [];
      const nodeIdList = nodeData.value.properties.inputNodes;
      if (nodeIdList && nodeIdList.length > 0) {
        const idArray = getFilteredLeftNodes(nodeIdList);

        idArray.forEach((id: string) => {
          const nodeItem = {
            label: id,
            value: id,
          };
          nodeIdArray.push(nodeItem);
        });
      }
      nodeIdOptions.value = nodeIdArray;

      // 初始化localParams的值
      localParams.value = {
        mainNode: nodeData.value.properties.mainNode || null,
        subNodes:
          nodeData.value.properties.subNodes && nodeData.value.properties.subNodes.length > 0
            ? [...nodeData.value.properties.subNodes]
            : [null],
      };
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

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;

    // 使用表单验证
    formRef.value?.validate((errors: any) => {
      if (!errors) {
        if (logicFlowUtil.logicFlow) {
          const mainNode = localParams.value.mainNode;
          const subNodes = localParams.value.subNodes;
          nodeData.value.properties.mainNode = mainNode;
          nodeData.value.properties.subNodes = subNodes;

          let hasFloat = false;
          const mainData = logicFlowUtil.logicFlow.getNodeModelById(mainNode);
          console.log('mainData', logicFlowUtil.logicFlow.getNodeDataById(mainNode));
          let outputValue = 0;
          if (mainData) {
            const mainProperties = mainData.getProperties();
            if (mainProperties.valueType === 'number') {
              hasFloat = true;
            }
            const mainValueStr = mainProperties.outputValue || '0';
            outputValue = Number(mainValueStr);
          }

          for (let i = 0; i < localParams.value.subNodes.length; i++) {
            const subId = localParams.value.subNodes[i];
            const subData = logicFlowUtil.logicFlow.getNodeModelById(subId);
            let subValue = 0;
            if (subData) {
              const subProperties = subData.getProperties();
              if (!hasFloat && subProperties.valueType === 'number') {
                hasFloat = true;
              }
              const subValueStr = subProperties.outputValue || '0';
              subValue = Number(subValueStr);
              if (nodeType.value === 'add') {
                outputValue = outputValue + subValue;
              } else if (nodeType.value === 'subtract') {
                outputValue = outputValue - subValue;
              } else if (nodeType.value === 'multiply') {
                outputValue = outputValue * subValue;
              } else if (nodeType.value === 'divide') {
                outputValue = outputValue / subValue;
              } else if (nodeType.value === 'modular') {
                outputValue = outputValue % subValue;
              }
            }
          }

          if (hasFloat) {
            nodeData.value.properties.valueType = 'number';
          } else {
            nodeData.value.properties.valueType = 'int';
          }
          nodeData.value.properties.outputValue = outputValue + '';
        }
        emit('submit', nodeData.value);
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };

  onMounted(async () => {
    // nodeIdOptions.value = [
    //   {
    //     value: 'test1',
    //     label: 'test1',
    //     type: 'int',
    //   },
    //   {
    //     value: 'test2',
    //     label: 'test2',
    //     type: 'int',
    //   },
    //   {
    //     value: 'test3',
    //     label: 'test3',
    //     type: 'number',
    //   },
    // ];
    nodeIdOptions.value = [];
    localParams.value = {
      mainNode: null,
      subNodes: [null],
    };
  });
</script>
<style lang="less" scoped>
  .ttl :deep(.n-form-item .n-form-item-feedback-wrapper) {
    display: none;
  }
</style>
