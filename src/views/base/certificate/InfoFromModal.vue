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
      <n-form-item label="证书名称" path="certificateName">
        <n-input
          maxlength="20"
          placeholder="请输入证书名称"
          v-model:value="localParams.certificateName"
          clearable
        />
      </n-form-item>
      <n-form-item label="证书标准" path="certificateStandard">
        <n-select
          v-model:value="localParams.certificateStandard"
          :options="standardOptions"
          placeholder="请选择证书标准"
        />
      </n-form-item>
      <n-form-item label="证书文件" path="caFile">
        <div class="upload-line">
          <div class="upload-btn">
            <n-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              accept="application/zip,application/x-rar-compressed‌,application/x-7z-compressed,application/xgzip,application/x-compress"
              name="file"
              :file-list-style="{ display: 'none' }"
              :show-file-list="false"
              @before-upload="beforeUpload"
              @finish="finishUpload"
            >
              <n-button type="primary" style="width: 100px">上传压缩包</n-button>
            </n-upload>
          </div>
          <div class="upload-input">
            <n-input
              maxlength="20"
              placeholder="请上传压缩包"
              readonly
              v-model:value="localParams.caFile"
            />
          </div>
        </div>
      </n-form-item>
      <n-form-item label="证书描述" path="remark">
        <n-input
          type="textarea"
          placeholder="请输入证书描述"
          :autosize="{
            minRows: 3,
          }"
          clearable
          v-model:value="localParams.remark"
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
  import { reactive, ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { addCertificate, editCertificate } from '@/api/base/certificate';
  import { useGlobSetting } from '@/hooks/setting';
  import { ACCESS_TOKEN } from '@/store/mutation-types';
  import { storage } from '@/utils/Storage';

  const globSetting = useGlobSetting();

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
        certificateId: 0,
        certificateName: '',
        certificateStandard: null,
        caFile: '',
        remark: '',
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
  const standardOptions = [
    {
      label: 'TLS',
      value: '1',
    },
    {
      label: 'SSL',
      value: '2',
    },
    {
      label: '其他',
      value: '3',
    },
  ];
  const uploadUrl = globSetting.apiUrl + globSetting.uploadUrl;
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    accessToken: storage.get(ACCESS_TOKEN),
  });

  //上传之前
  const beforeUpload = (file: any) => {
    const fileInfo = file.file;

    // 添加限制
    if (fileInfo.size / 1024 / 1024 >= 100) {
      window['$message'].error(`上传文件最大值不能超过100Mb`);
      return false;
    }
    if (
      !fileInfo.name.endsWith('.zip') &&
      !fileInfo.name.endsWith('.rar') &&
      !fileInfo.name.endsWith('.7z') &&
      !fileInfo.name.endsWith('.gz') &&
      !fileInfo.name.endsWith('.bz2')
    ) {
      window['$message'].error(`上传的压缩文件类型错误`);
      return false;
    }
    return true;
  };

  //上传结束
  const finishUpload = ({ event: Event }) => {
    const res = eval('(' + Event.target.response + ')');
    const message = res.message;
    //成功
    if (res.status === 'success') {
      const data = res.data;
      localParams.value.caFile = data.url;
    } else window['$message'].error(message);
  };

  // 表单验证
  const rules: FormRules = {
    certificateName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入证书名称',
    },
    certificateStandard: {
      required: true,
      message: '请选择证书标准',
      trigger: ['blur', 'change'],
    },
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
        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addCertificate(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editCertificate(localParams.value)) as unknown as {
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
<style lang="less" scoped>
  .upload-line {
    width: 100%;
    .upload-btn {
      width: 100px;
      float: right;
    }
    .upload-input {
      margin-right: 110px;
    }
  }
</style>
