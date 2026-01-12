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
      <n-form-item label="固件名称" path="firmwareName">
        <n-input
          maxlength="20"
          placeholder="请输入固件名称"
          v-model:value="localParams.firmwareName"
          clearable
        />
      </n-form-item>
      <n-form-item label="最新版本" path="version">
        <n-input
          maxlength="20"
          placeholder="请输入版本号，例：v2.0、v2.1.0 或 v2.1.2.16"
          v-model:value="localParams.version"
          :allow-input="onlyAllowVersion"
          clearable
        />
      </n-form-item>
      <n-form-item label="更新方式" path="installType">
        <n-select
          v-model:value="localParams.installType"
          :options="installTypeOptions"
          placeholder="请选择更新方式"
        />
      </n-form-item>
      <n-form-item label="固件包" path="url">
        <div class="upload-line">
          <div class="upload-btn">
            <n-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              accept="application/octet-stream‌,application/zip,application/x-tar‌,application/x-gzip,application/pdf‌,text/plain,application/x-elf"
              name="file"
              :file-list-style="{ display: 'none' }"
              :show-file-list="false"
              @before-upload="beforeUpload"
              @finish="finishUpload"
            >
              <n-button type="primary" style="width: 100px">上传固件包</n-button>
            </n-upload>
          </div>
          <div class="upload-input">
            <n-input
              maxlength="20"
              placeholder="请上传固件包"
              readonly
              v-model:value="localParams.url"
            />
          </div>
        </div>
      </n-form-item>
      <n-form-item label="固件描述" path="remark">
        <n-input
          type="textarea"
          placeholder="请输入固件描述"
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
  import { FormItemRule, FormRules } from 'naive-ui';
  import { addFirmware, editFirmware } from '@/api/devices/firmware';
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
        firmwareId: 0,
        firmwareName: '',
        version: '',
        installType: '1',
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
  const installTypeOptions = [
    {
      label: 'http',
      value: '1',
    },
    {
      label: '分包拉取',
      value: '2',
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
      !fileInfo.name.endsWith('.bin') &&
      !fileInfo.name.endsWith('.zip') &&
      !fileInfo.name.endsWith('.tar') &&
      !fileInfo.name.endsWith('.gz') &&
      !fileInfo.name.endsWith('.img') &&
      !fileInfo.name.endsWith('.hex') &&
      !fileInfo.name.endsWith('.srec') &&
      !fileInfo.name.endsWith('.elf') &&
      !fileInfo.name.endsWith('.pdf')
    ) {
      window['$message'].error(`上传的文件类型错误`);
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
      localParams.value.url = data.url;
    } else window['$message'].error(message);
  };

  // 表单验证
  const onlyAllowVersion = (value: string) => !value || /^[v\d.]+$/.test(value);
  const inputValidationVersion = (_rule: FormItemRule, value: string) => {
    if (value !== '') {
      const regex = /^(v\d+\.\d+(\.\d+)*?)$/;
      return regex.test(value);
    }
    return false;
  };
  const rules: FormRules = {
    firmwareName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入固件名称',
    },
    version: [
      {
        required: true,
        message: '请选择固件版本',
        trigger: ['blur', 'input'],
      },
      {
        validator: inputValidationVersion,
        trigger: ['blur', 'input'],
        message: '固件版本格式错误',
      },
    ],
    installType: {
      required: true,
      message: '请选择更新方式',
      trigger: ['blur', 'change'],
    },
    url: {
      required: true,
      message: '请上传固件包',
      trigger: ['blur'],
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
          result = (await addFirmware(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editFirmware(localParams.value)) as unknown as {
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
