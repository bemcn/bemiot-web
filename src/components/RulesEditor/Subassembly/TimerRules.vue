<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 800px"
    title="定时器"
    @after-leave="closeModalAfter"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      :label-width="80"
      :model="localParams"
      :show-feedback="false"
    >
      <n-form-item label="定时规则">
        <cron-generator ref="cronGeneratorRef" v-model:value="localParams.cron" />
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
  import { CronUtil } from '@/utils/CronUtil';
  // @ts-ignore
  import CronGenerator from '../../CronGenerator/index.vue';
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
    cron: '1 0 * * * ?',
    description: '',
  });
  const formBtnLoading = ref(false);
  const cronGeneratorRef = ref();

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
        cron: properties.cron,
        description: properties.description,
      };
      console.log('localParams.value', localParams.value);
    }
  });

  // 提交表单
  const confirmForm = () => {
    formBtnLoading.value = true;
    const cron = cronGeneratorRef.value?.cronExpression || '';

    let description: string;
    try {
      description = CronUtil.parse(cron);
    } catch (e) {
      description = '表达式错误';
    }

    nodeData.value.properties.cron = cron;
    nodeData.value.properties.description = description;

    showState.value = false;
    emit('submit', nodeData.value);
    formBtnLoading.value = false;
  };
</script>
