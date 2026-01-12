<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 480px"
    title="倒计时"
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
      <n-form-item label="倒计时" path="timeValue">
        <n-input-group>
          <n-input
            maxlength="4"
            placeholder="请输入倒计时"
            v-model:value="localParams.timeValue"
            :style="{ width: '80%' }"
            :allow-input="onlyAllowInt"
            clearable
          />
          <n-input-group-label>秒</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item label="执行频率" path="runTimeValue">
        <n-input-group>
          <n-input
            maxlength="4"
            placeholder="请输入执行频率"
            v-model:value="localParams.runTimeValue"
            :style="{ width: '80%' }"
            :allow-input="onlyAllowInt"
            clearable
          />
          <n-input-group-label>秒/次</n-input-group-label>
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
    timeValue: null,
    runTimeValue: null,
  });
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^\d+$/.test(value);
  const rules: FormRules = {
    timeValue: {
      required: true,
      message: '请输入倒计时',
      trigger: ['blur', 'input'],
    },
    runTimeValue: [
      {
        required: true,
        message: '请输入执行频率',
        trigger: ['blur', 'input'],
      },
      {
        validator(_rule: any, value: any) {
          if (
            value &&
            localParams.value.timeValue &&
            parseInt(value) > parseInt(localParams.value.timeValue)
          ) {
            return new Error('执行频率不能大于倒计时');
          }
          return true;
        },
        trigger: ['blur', 'input'],
      },
    ],
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
      localParams.value = {
        timeValue: properties.timeValue,
        runTimeValue: properties.runTimeValue,
      };
    }
  });

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        showState.value = false;
        nodeData.value.properties.timeValue = localParams.value.timeValue;
        nodeData.value.properties.runTimeValue = localParams.value.runTimeValue;

        emit('submit', nodeData.value);
      } else {
        window['$message'].error('请填写完整信息');
      }
    });
    formBtnLoading.value = false;
  };
</script>
