<template>
  <n-dropdown
    v-if="authShow"
    placement="bottom-start"
    trigger="hover"
    size="medium"
    :options="importOptions"
    @select="handleSelect"
  >
    <n-button style="margin-left: 10px" :type="type">
      <template #icon>
        <n-icon>
          <ImportOutlined />
        </n-icon>
      </template>
      导入数据
    </n-button>
  </n-dropdown>

  <n-modal
    v-model:show="showImportModal"
    :show-icon="false"
    style="width: 640px"
    preset="dialog"
    title="新建"
  >
    <div class="uploadbox">
      <n-upload
        v-if="importState === 0"
        directory-dnd
        response-type="json"
        :action="actionUrl"
        :show-file-list="false"
        :max="5"
        :data="uploadData"
        @before-upload="beforeUpload"
        @error="errorUpload"
        @finish="finishUpload"
      >
        <n-upload-dragger>
          <div style="height: 160px; margin-bottom: 12px">
            <n-icon size="140" :depth="5">
              <UploadOutlined />
            </n-icon>
          </div>
          <n-text style="font-size: 16px; color: #777777"> 点击或者拖动文件到该区域来上传 </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0; color: #bbbbbb">
            仅支持xls和xlsx类型的文件上传，文件不能超过2MB
          </n-p>
        </n-upload-dragger>
      </n-upload>
      <div v-if="importState > 0" class="endbox">
        <div :class="importState === 1 ? 'success-line' : 'error-line'">
          <n-icon size="100" color="#ffffff">
            <CheckCircleFilled v-if="importState === 1" />
            <InfoCircleFilled v-else />
          </n-icon>
        </div>
        <div class="state-label">{{
          importState === 1 ? 'Excel数据导入完成' : 'Excel数据导入错误'
        }}</div>
        <div v-if="importState === 1" class="state-msg"
          >累计导入数据
          <span style="color: #18a058">{{ successCount }}</span> 条，导入数据将自动在表格刷新</div
        >
        <div v-else class="state-msg"
          >成功 <span style="color: #18a058">{{ successCount }}</span> 条，失败
          <span style="color: #d03050">{{ errorCount }}</span> 条，请下载失败数据调整后重导入</div
        >
      </div>
    </div>
    <div class="footbar">
      <div class="btn-box">
        <n-button
          v-if="importState === 1"
          type="primary"
          style="width: 120px"
          @click="() => (showImportModal = false)"
          >确认</n-button
        >
        <n-button
          v-if="importState === 2"
          type="primary"
          style="width: 120px; margin-right: 10px"
          @click="downloadError"
          >下载错误数据</n-button
        >
        <n-button
          v-if="importState !== 1"
          style="width: 100px"
          @click="() => (showImportModal = false)"
          >取消</n-button
        >
      </div>
      <div class="msg-box">
        <div v-if="importErrorShow" class="msg-box">
          <div class="iconbox">
            <n-icon size="18" color="#d03050">
              <InfoCircleFilled />
            </n-icon>
          </div>
          <div class="errormsg">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ImportOutlined, UploadOutlined, InfoCircleFilled, CheckCircleFilled } from '@vicons/antd';
  import { useGlobSetting } from '@/hooks/setting';
  import { useUserStore } from '@/store/modules/user';
  import { importProps } from './import_props';
  import type { UploadFileInfo } from 'naive-ui';

  const userStore = useUserStore();
  const { apiUrl } = useGlobSetting();

  const props = defineProps({
    ...importProps,
  });
  const importOptions = [
    {
      label: '导入Excel数据',
      key: 'import',
    },
    {
      label: '下载导入模板',
      key: 'model',
    },
  ];
  const showImportModal = ref(false);
  const uploadData: any = ref(null);
  const importErrorShow = ref(false);
  const importState = ref(0);
  const errorMessage = ref('');
  const successCount = ref(0);
  const errorCount = ref(0);
  const errorUrl = ref('');

  const actionUrl = ref(apiUrl + props.importPath);

  // 回调
  const emit = defineEmits(['importChange']);

  // 导入选择
  const handleSelect = (key: string | number) => {
    if (key === 'import') {
      handleImport();
    } else {
      handleDownModel();
    }
  };

  // 导入
  const handleImport = () => {
    importState.value = 0;
    successCount.value = 0;
    errorCount.value = 0;
    errorUrl.value = '';
    importErrorShow.value = false;
    errorMessage.value = '';
    uploadData.value = {
      token: userStore.getAccessToken,
    };
    showImportModal.value = true;
  };

  //上传前检查
  const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    importErrorShow.value = false;
    errorMessage.value = '';
    if (
      data.file.file?.type !== 'application/vnd.ms-excel' &&
      data.file.file?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      importErrorShow.value = true;
      errorMessage.value = '只能上传xls或者xlsx格式的文件';
      return false;
    } else {
      const verifySize = data.file.file.size / 1024 / 1024 < 2;
      if (verifySize) {
        return true;
      } else {
        importErrorShow.value = true;
        errorMessage.value = '上传文件大小不能超过2MB';
        return false;
      }
    }
  };
  // 上传失败
  const errorUpload = (data: { file: UploadFileInfo; event: any }) => {
    importErrorShow.value = true;
    errorMessage.value = 'Excel文件上传失败';
  };

  //上传完成
  const finishUpload = (data: { file: UploadFileInfo; event: any }) => {
    importErrorShow.value = false;
    errorMessage.value = '';

    const result = (data.event?.target as XMLHttpRequest).response;
    const status = result.status;
    if (status === 'success') {
      const successData = result.data;
      importState.value = 1;
      successCount.value = successData.successCount;
      errorCount.value = 0;
      errorUrl.value = '';
      emit('importChange');
    } else {
      const code = result.code;
      if (code === 2000) {
        importState.value = 0;
        successCount.value = 0;
        errorCount.value = 0;
        errorUrl.value = '';
        importErrorShow.value = true;
        errorMessage.value = result.message;
      } else {
        const errorData = result.data;
        importState.value = 2;
        successCount.value = errorData.successCount;
        errorCount.value = errorData.errorCount;
        errorUrl.value = errorData.url;
        if (errorData.successCount > 0) {
          emit('importChange');
        }
      }
    }
  };

  // 下载错误数据
  const downloadError = () => {
    window.location.href = apiUrl + errorUrl.value;
    showImportModal.value = false;
  };

  // 下载模板
  const handleDownModel = () => {
    const token = userStore.getAccessToken;
    const params = 'token=' + token;
    const url = apiUrl + props.modelPath + '?' + params;
    window.location.href = url;
  };
</script>
<style lang="less">
  .uploadbox {
    width: 100%;
    margin-bottom: 20px;
  }
  .endbox {
    width: 100%;
    height: 277px;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    padding: 10px 15px;
    margin-bottom: 20px;
    .success-line,
    .error-line {
      width: 100%;
      height: 160px;
      text-align: center;
      padding-top: 30px;
      border-radius: 8px;
    }
    .success-line {
      background: linear-gradient(90deg, #18a058, #61d296);
    }
    .error-line {
      background: linear-gradient(90deg, #d03050, #e87292);
    }
    .state-label {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 18px;
      color: #333333;
      margin-top: 10px;
    }
    .state-msg {
      width: 100%;
      height: 20px;
      text-align: center;
      font-size: 14px;
      color: #999999;
    }
  }
  .footbar {
    width: 100%;
    height: 34px;
    .btn-box {
      width: 240px;
      text-align: right;
      float: right;
    }
    .msg-box {
      .iconbox {
        width: 24px;
        height: 34px;
        padding-top: 8px;
        float: left;
      }
      .errormsg {
        width: 100%;
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        color: #d03050;
        margin-left: 24px;
      }
    }
  }
</style>
