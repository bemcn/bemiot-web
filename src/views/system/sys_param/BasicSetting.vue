<template>
  <n-grid cols="12" item-responsive responsive="screen">
    <n-grid-item span="12 m:11 l:10 xl:9 2xl:8">
      <n-form
        style="padding: 20px"
        label-placement="left"
        label-width="auto"
        :model="formValue"
        :rules="rules"
        ref="formRef"
      >
        <n-form-item label="系统名称" path="sysName" :first="true">
          <n-input
            v-model:value="formValue.sysName"
            maxlength="20"
            clearable
            placeholder="请输入系统名称"
          />
        </n-form-item>

        <n-form-item label="系统简称" path="sysAbbreviation" :first="true">
          <n-input
            placeholder="请输入系统简称"
            maxlength="6"
            clearable
            v-model:value="formValue.sysAbbreviation"
          />
        </n-form-item>

        <n-form-item label="公司名称" path="company" :first="true">
          <n-input
            placeholder="请输入公司名称"
            maxlength="30"
            clearable
            v-model:value="formValue.company"
          />
        </n-form-item>

        <n-form-item label="LOGO图标" path="sysLogo">
          <SoleUpload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{ type: 0 }"
            name="file"
            :maxSize="2"
            :width="100"
            :height="100"
            @upload-change="uploadLogoChange"
            v-model:value="formValue.sysLogo"
            helpText="建议规格： 250*250px"
          />
        </n-form-item>

        <n-form-item label="登录背景图" path="sysBackgroundImg">
          <SoleUpload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{ type: 0 }"
            name="file"
            :maxSize="5"
            :width="178"
            :height="100"
            @upload-change="uploadImgChange"
            v-model:value="formValue.sysBackgroundImg"
            helpText="建议规格： 2560*1440px"
          />
        </n-form-item>

        <div>
          <n-space>
            <n-button type="primary" style="width: 160px" @click="formSubmit">确 认</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { SoleUpload } from '@/components/Upload';
  import { useGlobSetting } from '@/hooks/setting';
  import { ACCESS_TOKEN } from '@/store/mutation-types';
  import { storage } from '@/utils/Storage';
  import { getConfigParams, editConfig } from '@/api/system/systemConfig';

  const globSetting = useGlobSetting();

  const rules = {
    sysName: {
      required: true,
      message: '请输入系统名称',
      trigger: 'blur',
    },
    sysAbbreviation: {
      required: true,
      message: '请输入系统简称',
      trigger: 'input',
    },
    company: {
      required: true,
      message: '请输入公司名称',
      trigger: 'input',
    },
  };

  const formRef: any = ref(null);
  const message = useMessage();

  interface SysSettingForm {
    group: string;
    sysName: string;
    sysAbbreviation: string;
    company: string;
    address: string;
    sysLogo: string;
    sysBackgroundImg: string;
  }

  const formValue = ref<SysSettingForm>({
    group: '',
    sysName: '',
    sysAbbreviation: '',
    company: '',
    address: '',
    sysLogo: '',
    sysBackgroundImg: '',
  });

  const uploadUrl = globSetting.apiUrl + globSetting.uploadUrl;
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    accessToken: storage.get(ACCESS_TOKEN),
  });
  const uploadLogoChange = (imgUrl: string) => {
    formValue.value.sysLogo = imgUrl;
    console.log(formValue);
  };
  const uploadImgChange = (imgUrl: string) => {
    formValue.value.sysBackgroundImg = imgUrl;
    console.log(formValue);
  };

  const getSysSetting = async () => {
    const params = {
      group: 'base',
    };
    const result = (await getConfigParams(params)) as {
      status: string;
      message: string;
      data: SysSettingForm;
    };
    if (result.status === 'success') {
      formValue.value = result.data;
    } else {
      message.info(result.message);
    }
  };

  const formSubmit = () => {
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        formValue.value.group = 'base';
        const result = (await editConfig(formValue.value)) as {
          status: string;
          message: string;
        };
        if (result.status === 'success') {
          message.success('提交成功');
        } else {
          message.error(result.message);
        }
      } else {
        message.error('验证失败，请填写完整信息');
      }
    });
  };

  onMounted(async () => {
    getSysSetting();
  });
</script>
