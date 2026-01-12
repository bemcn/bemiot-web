<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 640px"
    :title="title"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="位置名称" path="spaceName">
        <n-input
          maxlength="20"
          placeholder="请输入位置名称"
          v-model:value="localParams.spaceName"
          clearable
        />
      </n-form-item>
      <n-form-item label="上级位置" path="levelId">
        <n-cascader
          v-model:value="localParams.levelId"
          placeholder="请选择..."
          :options="levelOptions"
          check-strategy="child"
          :show-path="true"
          @update:value="handleUpdateValue"
        />
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
  import { FormRules, CascaderOption } from 'naive-ui';
  import { addPosition, editPosition } from '@/api/base/position';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    title: {
      type: String,
      default: () => '',
    },
    action: {
      type: String,
      default: () => '',
    },
    levels: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        spaceId: 0,
        spaceName: '',
        levelId: 0,
        orderNum: 0,
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const fromAction = ref('');
  const localParams: any = ref(null);
  const levelOptions = ref<any[]>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  // 表单验证
  const rules: FormRules = {
    spaceName: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入位置名称',
      },
      {
        min: 1,
        max: 20,
        message: '位置名称长度在 1 到 20 个字符',
        trigger: ['blur', 'input'],
      },
    ],
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.levels, () => props.params],
    ([newShowModel, newAction, newLevels, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;
      localParams.value = newParams;
      levelOptions.value = newLevels;
    }
  );

  const handleUpdateValue = (value: string, option: CascaderOption) => {
    console.log(value, option);
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addPosition(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editPosition(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        }
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
