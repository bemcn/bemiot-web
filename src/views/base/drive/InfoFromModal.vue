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
      <n-form-item label="驱动编号" path="driveCode">
        <n-input
          maxlength="20"
          placeholder="请输入驱动编号"
          v-model:value="localParams.driveCode"
          clearable
          :disabled="fromAction === 'edit'"
        />
      </n-form-item>
      <n-form-item label="驱动名称" path="driveName">
        <n-input
          maxlength="20"
          placeholder="请输入驱动名称"
          v-model:value="localParams.driveName"
          clearable
        />
      </n-form-item>
      <n-form-item label="驱动协议" path="protocolId">
        <n-select
          v-model:value="localParams.protocolId"
          :options="dataOptions"
          placeholder="请选择驱动协议"
        />
      </n-form-item>
      <n-form-item label="驱动来源" path="driveSource">
        <n-input
          maxlength="20"
          placeholder="请输入驱动来源"
          v-model:value="localParams.driveSource"
          clearable
        />
      </n-form-item>
      <n-form-item label="版本号" path="version">
        <n-input
          maxlength="20"
          placeholder="请输入版本号，格式：v2.x.x.x"
          clearable
          v-model:value="localParams.version"
          :allow-input="allowVersion"
        />
      </n-form-item>
      <n-form-item label="发行时间" path="releaseTime">
        <n-date-picker
          v-model:formatted-value="localParams.releaseTime"
          placeholder="请录入发行时间"
          type="date"
          value-format="yyyy-MM-dd"
          clearable
        />
      </n-form-item>
      <n-form-item label="驱动包" path="packageUrl">
        <div class="upload-line">
          <div class="upload-btn">
            <n-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              accept="application/x-jar"
              name="file"
              :file-list-style="{ display: 'none' }"
              :show-file-list="false"
              @before-upload="beforeUpload"
              @finish="finishUpload"
            >
              <n-button type="primary" style="width: 100px">上传驱动包</n-button>
            </n-upload>
          </div>
          <div class="upload-input">
            <n-input
              maxlength="20"
              placeholder="请上传驱动包"
              readonly
              v-model:value="localParams.packageUrl"
            />
          </div>
        </div>
      </n-form-item>
      <n-form-item label="驱动描述" path="remark">
        <n-input
          type="textarea"
          placeholder="请输入备注"
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
  import { addDrives, editDrive } from '@/api/base/drives';
  import { ACCESS_TOKEN } from '@/store/mutation-types';
  import { storage } from '@/utils/Storage';
  import { useGlobSetting } from '@/hooks/setting';

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
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        driveCode: '',
        driveName: '',
        protocolId: '',
        version: '',
        driveSource: '',
        author: '',
        email: '',
        remark: '',
        packageUrl: '',
        releaseTime: null,
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const fromAction = ref('');
  const uploadUrl = globSetting.apiUrl + '/upload/uploadDrive';
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    accessToken: storage.get(ACCESS_TOKEN),
  });
  const localParams: any = ref(null);
  const dataOptions = ref<any[]>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  const allowVersion = (value: string) => !value || /[vV0-9.]/.test(value);
  const inputValidationVersion = (_rule: FormItemRule, value: string) => {
    if (value !== '') {
      const regex = /^(v\d+\.\d+(\.\d+)?)$/;
      return regex.test(value);
    }
    return false;
  };
  const inputValidationMail = (_rule: FormItemRule, value: string) => {
    if (value !== '') {
      // 使用标准的邮箱验证正则表达式
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }
    return true;
  };

  // 表单验证
  const rules: FormRules = {
    driveCode: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入驱动编号',
    },
    driveName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入驱动名称',
    },
    protocolId: {
      required: true,
      message: '请选择驱动协议',
      trigger: ['blur', 'input'],
    },
    driveSource: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入驱动来源',
    },
    version: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入驱动版本',
      },
      {
        validator: inputValidationVersion,
        trigger: ['blur', 'input'],
        message: '驱动版本格式错误',
      },
    ],
    email: {
      validator: inputValidationMail,
      trigger: ['blur', 'input'],
      message: '电子邮箱格式错误',
    },
    packageUrl: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请上传驱动包',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.options, () => props.params],
    ([newShowModel, newAction, newOptions, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;
      localParams.value = newParams;
      dataOptions.value = newOptions;
    }
  );

  //上传之前
  const beforeUpload = (file: any) => {
    const fileInfo = file.file;

    // 添加限制
    if (fileInfo.size / 1024 / 1024 >= 100) {
      window['$message'].error(`上传文件最大值不能超过100Mb`);
      return false;
    }
    if (!fileInfo.name.endsWith('.jar')) {
      window['$message'].error(`请上传.jar文件`);
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
      localParams.value.packageUrl = data.url;
    } else window['$message'].error(message);
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addDrives(localParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editDrive(localParams.value)) as unknown as {
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
