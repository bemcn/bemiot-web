<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 860px"
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
      <n-form-item label="协议名称" path="protocolName">
        <n-input
          maxlength="20"
          placeholder="请输入协议名称"
          v-model:value="localParams.protocolName"
          clearable
        />
      </n-form-item>
      <n-form-item label="请求格式" path="request">
        <div style="width: 100%; height: 110px">
          <QuillEditor
            ref="requestEditor"
            :options="options"
            v-model:content="localParams.request"
            style="height: 80px"
            class="quillEditor"
          />
        </div>
      </n-form-item>
      <n-form-item label="响应格式" path="response">
        <div style="width: 100%; height: 110px">
          <QuillEditor
            ref="responseEditor"
            :options="options"
            v-model:content="localParams.response"
            style="height: 80px"
            class="quillEditor"
          />
        </div>
      </n-form-item>
      <n-form-item label="注册认证" path="registration">
        <div style="width: 100%; height: 110px">
          <QuillEditor
            ref="registEditor"
            :options="options"
            v-model:content="localParams.registration"
            style="height: 80px"
            class="quillEditor"
          />
        </div>
      </n-form-item>
      <n-form-item label="心跳包" path="heartbeat">
        <div style="width: 100%; height: 90px">
          <QuillEditor
            ref="heartEditor"
            :options="options"
            v-model:content="localParams.heartbeat"
            style="height: 80px"
            class="quillEditor"
          />
        </div>
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
  import { reactive, ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { QuillEditor } from '@vueup/vue-quill';
  import { addProtocols, editProtocols } from '@/api/base/protocols';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

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
    params: {
      type: Object as PropType<any>,
      default: () => ({
        protocolId: 0,
        protocolName: '',
        request: '',
        response: '',
        registration: '',
        heartbeat: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const fromAction = ref('');
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  //富文本编辑器
  const requestEditor = ref(); //请求
  const responseEditor = ref(); //响应
  const registEditor = ref(); //注册
  const heartEditor = ref(); //心跳

  const options = reactive({
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // 切换按钮
        ['blockquote', 'code-block'],

        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }], // 缩出/缩进

        [{ size: ['small', false, 'large', 'huge'] }], // 自定义下拉列表

        [{ color: [] }, { background: [] }], // 包含主题默认值的下拉列表
        [{ align: [] }],
        ['clean'],
      ],
    },
    theme: 'snow',
    placeholder: '请输入协议规则描述信息',
  });

  // 表单验证
  const rules: FormRules = {
    protocolName: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入协议名称',
      },
      {
        min: 4,
        max: 20,
        message: '协议名称长度在 4 到 20 个字符',
        trigger: ['blur', 'input'],
      },
    ],
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.params],
    ([newShowModel, newAction, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;
      localParams.value = newParams;
    }
  );

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        localParams.value.request = requestEditor.value.getHTML();
        localParams.value.response = responseEditor.value.getHTML();
        localParams.value.registration = registEditor.value.getHTML();
        localParams.value.heartbeat = heartEditor.value.getHTML();

        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addProtocols(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editProtocols(localParams.value)) as unknown as {
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
