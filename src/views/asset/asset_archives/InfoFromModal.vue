<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 940px"
    title="编辑设备档案"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
      style="padding-right: 30px !important"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="设备名称" path="deviceName">
          <n-input v-model:value="localParams.deviceName" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="所属产品">
          <n-input :value="localParams.productName" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="设备编号">
          <n-input :value="localParams.deviceCode" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="产品名称">
          <n-input :value="localParams.productName" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="产品类型">
          <n-input :value="getTypeName(localParams.types)" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="安装位置">
          <n-input :value="localParams.spaceRouteName" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="IP地址">
          <n-input :value="localParams.ipAddress" disabled />
        </n-form-item-gi>
        <n-gi :span="24">
          <div class="divider-horizontal">
            <div class="divider-text">自定义属性</div>
          </div>
        </n-gi>
        <!-- <n-gi :span="24" v-for="item in localParams.attrList" :key="item.attrId">
          
        </n-gi> -->
        <n-form-item-gi
          :span="item.fieldType === 'input' || item.fieldType === 'date' ? 12 : 24"
          :label="item.fieldLabel"
          v-for="item in localParams.attrList"
          :key="item.attrId"
        >
          <n-input
            maxlength="50"
            :placeholder="'请输入' + item.fieldLabel"
            v-model:value="item.fieldValue"
            clearable
            v-if="item.fieldType === 'input' || item.fieldType === 'date'"
          />
          <n-input
            type="textarea"
            :placeholder="'请输入' + item.fieldLabel"
            :autosize="{
              minRows: 2,
            }"
            v-model:value="item.fieldValue"
            clearable
            v-if="item.fieldType === 'text'"
          />
          <div class="img-box" v-if="item.fieldType === 'img'">
            <div class="img-view" v-if="item.fieldValue !== ''">
              <n-image width="100%" height="auto" :src="globSetting.apiUrl + item.fieldValue" />
            </div>
            <div class="img-upload">
              <n-upload
                :action="uploadUrl"
                :headers="uploadHeaders"
                accept="image/jpeg‌,image/png,image/bmp‌,image/gif"
                name="file"
                :file-list-style="{ display: 'none' }"
                :show-file-list="false"
                @before-upload="beforeUpload"
                @finish="finishUpload"
              >
                <n-button class="btn-class" dashed @click="chkUploadId(item.attrId)">
                  <template #icon>
                    <n-icon size="46" color="#cccccc">
                      <PlusOutlined />
                    </n-icon>
                  </template>
                </n-button>
              </n-upload>
            </div>
          </div>
        </n-form-item-gi>
      </n-grid>
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
  import { addDeviceAttrArray } from '@/api/asset/deviceAttr';
  import { useGlobSetting } from '@/hooks/setting';
  import { ACCESS_TOKEN } from '@/store/mutation-types';
  import { storage } from '@/utils/Storage';
  import { PlusOutlined } from '@vicons/antd';
  import { format } from 'date-fns';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    spaceOption: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    groupOption: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const globSetting = useGlobSetting();
  const chkItemId = ref(0);
  const uploadUrl = globSetting.apiUrl + globSetting.uploadUrl;
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    accessToken: storage.get(ACCESS_TOKEN),
  });

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });

  const getTypeName = (type: number) => {
    switch (type) {
      case 1:
        return '直连设备';
      case 2:
        return '网关设备';
      case 3:
        return '监控设备';
      case 4:
        return '网关子设备';
      case 5:
        return '虚拟设备';
      default:
        return '未知';
    }
  };

  //上传图片之前
  const chkUploadId = (id: number) => {
    chkItemId.value = id;
  };
  const beforeUpload = (file: any) => {
    const fileInfo = file.file;

    // 添加限制
    if (fileInfo.size / 1024 / 1024 >= 10) {
      window['$message'].error(`上传文件最大值不能超过10Mb`);
      return false;
    }
    if (
      !fileInfo.name.endsWith('.jpeg') &&
      !fileInfo.name.endsWith('.png') &&
      !fileInfo.name.endsWith('.jpg') &&
      !fileInfo.name.endsWith('.bmp') &&
      !fileInfo.name.endsWith('.gif')
    ) {
      window['$message'].error(`上传的文件类型错误`);
      return false;
    }
    return true;
  };

  //上传图片结束
  const finishUpload = ({ event: Event }) => {
    const res = eval('(' + Event.target.response + ')');
    const message = res.message;
    //成功
    if (res.status === 'success') {
      const data = res.data;
      localParams.value.attrList?.forEach((item) => {
        if (item.attrId === chkItemId.value) {
          item.fieldValue = data.url;
          chkItemId.value = 0;
        }
      });
    } else window['$message'].error(message);
  };

  // 提交表单
  const confirmForm = async () => {
    const attrList = localParams.value.attrList;
    const attrs = JSON.stringify(attrList);

    const params = {
      deviceId: localParams.value.deviceId,
      attrs,
    };

    const result = (await addDeviceAttrArray(params)) as unknown as {
      status: string;
      message: string;
    };

    if (result.status === 'success') {
      window['$message'].success('提交成功');
      setTimeout(() => {
        showState.value = false;
        emit('submit');
      });
    } else {
      window['$message'].error(result.message);
    }
  };
</script>

<style lang="less" scoped>
  .divider-horizontal {
    height: 1px;
    width: 100%;
    margin: 24px 0 44px 0;
    border-top: 1px solid #e8e8e8;
    position: relative;
    display: block;
    .divider-text {
      background-color: #ffffff;
      padding: 0 20px;
      font-weight: 500;
      color: #000000;
      font-size: 14px;
      position: absolute;
      left: 20px;
      transform: translateY(-50%);
    }
  }

  .img-box {
    width: 100%;
    padding-right: 80px;
    .img-view {
      width: 220px;
      height: 220px;
      padding: 10px;
      border: 1px solid #eeeeee;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      float: left;
    }
    .img-upload {
      height: 220px;
      padding-left: 20px;
      float: left;
      .btn-class {
        width: 218px;
        height: 218px;
        border-radius: 6px;
      }
    }
  }
</style>
