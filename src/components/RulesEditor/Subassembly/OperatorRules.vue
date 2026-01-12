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
      <n-form-item :label="label1" path="principal">
        <n-select
          v-model:value="localParams.principal"
          :options="nodeOptions"
          :placeholder="`请选择${label1}`"
        />
      </n-form-item>
      <n-form-item class="ttl" :label="label2" path="inputValue">
        <n-dynamic-input v-model:value="localParams.inputValue" :placeholder="`请选择${label2}`">
          <template #create-button-default> 添加{{ label2 }} </template>
          <template #default="{ value, index }">
            <div style="display: flex; align-items: center; width: 100%">
              <n-select
                :value="value"
                @update:value="(val) => (localParams.inputValue[index] = val)"
                :options="nodeOptions"
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
  const localParams = ref<any>({
    principal: null,
    inputValue: [null],
  });
  const formRef = ref(); // 表单引用
  const formBtnLoading = ref(false);
  const nodeOptions = ref<any[]>([]);

  // 表单验证规则
  const rules = computed(() => {
    return {
      principal: {
        required: true,
        message: `请选择${label1.value}`,
        trigger: ['change', 'blur'],
      },
      inputValue: {
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

      const nodeType = nodeData.value.properties.type;
      if (nodeType === 'add') {
        title.value = '加法计算';
        label1.value = '被加数';
        label2.value = '加数';
      } else if (nodeType === 'subtract') {
        title.value = '减法计算';
        label1.value = '被减数';
        label2.value = '减数';
      } else if (nodeType === 'multiply') {
        title.value = '乘法计算';
        label1.value = '被乘数';
        label2.value = '乘数';
      } else if (nodeType === 'divide') {
        title.value = '除法计算';
        label1.value = '被除数';
        label2.value = '除数';
      } else if (nodeType === 'modular') {
        title.value = '除法取余计算';
        label1.value = '被除数';
        label2.value = '除数';
      }

      // 清空之前的数据
      nodeOptions.value = [];

      if (nodeData.value.properties.inputNodes && nodeData.value.properties.inputNodes.length > 0) {
        if (logicFlowUtil.logicFlow) {
          for (let i = 0; i < nodeData.value.properties.inputNodes.length; i++) {
            const id = nodeData.value.properties.inputNodes[i];
            const node = logicFlowUtil.logicFlow.getNodeDataById(id);
            if (node) {
              const nodeProperties = (node as any).getProperties
                ? (node as any).getProperties()
                : node.properties || {};
              const item = {
                value: id,
                label: id,
                type: nodeProperties.valueType || 'unknown',
              };
              nodeOptions.value.push(item);
            }
          }
        }
      }

      // 初始化localParams的值
      localParams.value = {
        principal: nodeData.value.properties.principal || null,
        inputValue:
          nodeData.value.properties.inputValue && nodeData.value.properties.inputValue.length > 0
            ? [...nodeData.value.properties.inputValue]
            : [null],
      };
    }
  });

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;

    // 使用表单验证
    formRef.value?.validate((errors: any) => {
      if (!errors) {
        //showState.value = false;
        nodeData.value.properties.principal = localParams.value.principal;
        nodeData.value.properties.inputValue = localParams.value.inputValue;

        let hasFloat = false;
        for (let i = 0; i < nodeOptions.value.length; i++) {
          if (nodeOptions.value[i].value === localParams.value.principal) {
            if (nodeOptions.value[i].type === 'number') {
              hasFloat = true;
              break;
            }
          }
        }
        if (!hasFloat) {
          for (let i = 0; i < localParams.value.inputValue.length; i++) {
            const nodeItemId = localParams.value.inputValue[i];
            let xHasFloat = false;
            for (let i = 0; i < nodeOptions.value.length; i++) {
              if (nodeOptions.value[i].value === nodeItemId) {
                if (nodeOptions.value[i].type === 'number') {
                  xHasFloat = true;
                  break;
                }
              }
            }
            if (xHasFloat) {
              hasFloat = true;
              break;
            }
          }
        }

        let valueType = 'int';
        if (hasFloat) {
          valueType = 'number';
        }
        nodeData.value.properties.valueType = valueType;

        // 根据ID计算节点的值
        emit('submit', nodeData.value);
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };

  onMounted(async () => {
    // nodeOptions.value = [
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
    nodeOptions.value = [];
    localParams.value = {
      principal: null,
      inputValue: [null],
    };
  });
</script>
<style lang="less" scoped>
  .ttl :deep(.n-form-item .n-form-item-feedback-wrapper) {
    display: none;
  }
</style>
