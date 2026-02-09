<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 940px"
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
      style="padding-right: 30px !important"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-gi :span="12">
          <n-form-item label="设备名称" path="deviceName">
            <n-input
              maxlength="50"
              placeholder="请输入设备名称"
              v-model:value="localParams.deviceName"
              clearable
            />
          </n-form-item>
          <n-form-item :span="12" label="所属产品" path="productName">
            <n-input-group>
              <n-input
                maxlength="50"
                placeholder="请选择所属产品"
                v-model:value="localParams.productName"
                readonly
                :disabled="action === 'edit'"
                clearable
              />
              <n-button :disabled="action === 'edit'" ghost @click="selectProduct">选择</n-button>
            </n-input-group>
          </n-form-item>
          <n-form-item :span="12" label="设备编号" path="deviceCode">
            <n-input-group>
              <n-input
                maxlength="50"
                placeholder="请输入设备编号"
                v-model:value="localParams.deviceCode"
                clearable
                :disabled="action === 'edit'"
              />
              <n-button :disabled="action === 'edit'" ghost @click="createCode">生成</n-button>
            </n-input-group>
          </n-form-item>
          <n-form-item label="所属分组" path="groupId">
            <n-select
              v-model:value="localParams.groupId"
              :options="groupOptions"
              placeholder="请选择所属分组"
            />
          </n-form-item>
          <n-form-item :span="12" label="安装位置" path="spaceId">
            <n-cascader
              v-model:value="localParams.spaceId"
              placeholder="请选择安装位置"
              expand-trigger="click"
              check-strategy="child"
              :options="positionOptions"
              clearable
            />
          </n-form-item>
        </n-gi>
        <n-form-item-gi :span="12" label="设备图片" path="installImg">
          <div class="img-box">
            <div class="img-view">
              <n-image
                width="100%"
                height="auto"
                :src="
                  localParams.installImg === ''
                    ? '/src/assets/images/no-img.gif'
                    : globSetting.apiUrl + localParams.installImg
                "
              />
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
                <n-button style="width: 140px">
                  <template #icon>
                    <n-icon>
                      <UploadOutlined />
                    </n-icon>
                  </template>
                  上传文件
                </n-button>
              </n-upload>
            </div>
          </div>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="定位方式" path="locateMethod">
          <n-select
            v-model:value="localParams.locateMethod"
            :options="locateOptions"
            placeholder="请选择定位方式"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="经纬度" v-if="localParams.locateMethod === '3'">
          <div style="width: 100%; height: 34px">
            <div style="width: 50%; height: 34px; float: left; padding-right: 5px">
              <n-input
                maxlength="20"
                placeholder="请输入经度"
                v-model:value="localParams.longitude"
                clearable
              />
            </div>
            <div style="width: 50%; height: 34px; float: right; padding-left: 5px">
              <n-input
                maxlength="20"
                placeholder="请输入纬度"
                v-model:value="localParams.latitude"
                clearable
              />
            </div>
          </div>
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="设备地址"
          path="address"
          v-if="localParams.locateMethod === '0' || localParams.locateMethod === '3'"
        >
          <n-input
            maxlength="250"
            placeholder="请输入设备地址"
            v-model:value="localParams.address"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="固件版本" path="firmwareVersion">
          <n-input-group>
            <n-button ghost disabled>v</n-button>
            <n-input
              maxlength="50"
              placeholder="例：1.0、2.0.1或3.1.5.1"
              v-model:value="localParams.firmwareVersion"
              :allow-input="onlyAllowNumber"
              clearable
            />
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="上级网关"
          path="gatewayName"
          v-if="localParams.types === 4"
        >
          <n-input-group>
            <n-input
              maxlength="50"
              placeholder="请选择上级网关"
              v-model:value="localParams.gatewayName"
              readonly
              clearable
            />
            <n-button ghost @click="selectGateway">选择</n-button>
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="入网地址" path="ipAddress">
          <n-input
            maxlength="15"
            placeholder="请输入设备IP地址"
            v-model:value="localParams.ipAddress"
            :allow-input="onlyAllowNumber"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          :label="item.label"
          :path="item.key"
          v-for="item in localParams.paramsArray"
          :key="item.key"
        >
          <n-input
            maxlength="50"
            :placeholder="'请输入' + item.label"
            v-model:value="item.value"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="影子设备" path="openShadow">
          <n-space>
            <n-switch v-model:value="localParams.openShadow" />
          </n-space>
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="备注" path="remark">
          <n-input
            type="textarea"
            placeholder="请输入备注"
            :autosize="{
              minRows: 2,
            }"
            clearable
            v-model:value="localParams.remark"
          />
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

  <SelectProduct
    :showModel="showProductModal"
    @close="() => (showProductModal = false)"
    @checked="checkProduct"
  />
  <VideoParams
    :showModel="showVideoModal"
    @close="() => (showVideoModal = false)"
    @submit="createVideoCode"
  />
  <SelectDevice
    :showModel="showGatewayModal"
    :types="2"
    @close="() => (showGatewayModal = false)"
    @checked="checkGateway"
  />
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { FormItemRule, FormRules } from 'naive-ui';
  import { addDevice, editDevice } from '@/api/devices/device';
  import { useGlobSetting } from '@/hooks/setting';
  import { ACCESS_TOKEN } from '@/store/mutation-types';
  import { storage } from '@/utils/Storage';
  import { UploadOutlined } from '@vicons/antd';
  import { uniqueId } from '@/utils/env';
  // @ts-ignore
  import SelectProduct from './SelectProduct.vue';
  // @ts-ignore
  import VideoParams from './VideoParams.vue';
  // @ts-ignore
  import SelectDevice from '@/components/SelectDevice/SelectDevice.vue';

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
      default: () => 'add',
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
  const positionOptions = ref<any[]>([]);
  const groupOptions = ref<any[]>([]);
  const locateOptions = [
    {
      label: '无',
      value: '0',
    },
    {
      label: '自动定位',
      value: '1',
    },
    {
      label: '设备定位',
      value: '2',
    },
    {
      label: '自定义位置',
      value: '3',
    },
  ];
  const showProductModal = ref(false);
  const showVideoModal = ref(false);
  const showGatewayModal = ref(false);
  const globSetting = useGlobSetting();
  const uploadUrl = globSetting.apiUrl + globSetting.uploadUrl;
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    accessToken: storage.get(ACCESS_TOKEN),
  });

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.spaceOption, () => props.groupOption, () => props.params],
    ([newShowModel, newSpaceOptions, newGroupOptions, newParams]) => {
      showState.value = newShowModel;
      localParams.value = newParams;
      if (newSpaceOptions) {
        positionOptions.value = newSpaceOptions[0]?.children;
      }
      groupOptions.value = newGroupOptions;
    }
  );

  // 表单验证
  const onlyAllowNumber = (value: string) => !value || /^[\d.]+$/.test(value);
  const inputValidationVersion = (_rule: FormItemRule, value: string) => {
    if (value !== '') {
      const regex = /^(\d+\.\d+(\.\d+)*?)$/;
      return regex.test(value);
    }
    return true;
  };
  const inputValidationIp = (_rule: FormItemRule, value: string) => {
    if (value !== '') {
      const regex =
        /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      return regex.test(value);
    }
    return true;
  };
  const rules: FormRules = {
    deviceName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入设备名称',
    },
    productName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请选择所属产品',
    },
    deviceCode: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入设备编号',
    },
    spaceId: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择安装位置',
    },
    firmwareVersion: {
      validator: inputValidationVersion,
      trigger: ['blur', 'input'],
      message: '固件版本格式错误',
    },
    ipAddress: {
      validator: inputValidationIp,
      trigger: ['blur', 'input'],
      message: '入网IP地址格式错误',
    },
  };

  //上传图片之前
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
      localParams.value.installImg = data.url;
    } else window['$message'].error(message);
  };

  // 选择产品
  const selectProduct = () => {
    showProductModal.value = true;
  };
  const checkProduct = (dataRow: any) => {
    try {
      showProductModal.value = false;

      if (!dataRow) return;

      if (localParams.value) {
        localParams.value.productId = dataRow.productId;
        localParams.value.productName = dataRow.productName;
        localParams.value.types = dataRow.types;

        if (dataRow.firmware) {
          let version = dataRow.firmware.version;
          if (version !== null && version !== '') {
            version = version.replace(/^[vV]/, ''); // 更简洁的替换方式
            localParams.value.firmwareVersion = version;
          }
        }

        localParams.value.serverKey = '';
        localParams.value.videoDomain = '';
        localParams.value.mainChannel = 0;
        localParams.value.deviceCode = '';
      }
    } catch (error) {
      console.error('Error in checkProduct:', error);
      window['$message']?.error('选择产品时发生错误');
    }
  };
  // 生成设备编号
  const createCode = () => {
    if (localParams.value.types === 3) {
      //打开视频参数窗口
      showVideoModal.value = true;
    } else {
      const devCode = 'D' + uniqueId();
      localParams.value.deviceCode = devCode;
    }
  };
  const createVideoCode = (data: any) => {
    showVideoModal.value = false;
    localParams.value.serverKey = data.serverKey;
    localParams.value.videoDomain = data.videoDomain;
    localParams.value.mainChannel = data.mainChannel;
    localParams.value.deviceCode = data.code;
  };
  // 选择网关
  const selectGateway = () => {
    showGatewayModal.value = true;
  };
  const checkGateway = (dataRow: any) => {
    localParams.value.gatewayId = dataRow.deviceId;
    localParams.value.gatewayName = dataRow.deviceName;
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const params = {
          deviceId: localParams.value.deviceId,
          deviceCode: localParams.value.deviceCode,
          deviceName: localParams.value.deviceName,
          productId: localParams.value.productId,
          groupId: localParams.value.groupId ? parseInt(localParams.value.groupId) : 0,
          userId: 0,
          spaceId: parseInt(localParams.value.spaceId),
          gatewayId: localParams.value.gatewayId,
          locateMethod: parseInt(localParams.value.locateMethod),
          openShadow: localParams.value.openShadow ? 1 : 0,
          address: localParams.value.address,
          ipAddress: localParams.value.ipAddress,
          longitude: Number(localParams.value.longitude),
          latitude: Number(localParams.value.latitude),
          installImg: localParams.value.installImg === null ? '' : localParams.value.installImg,
          firmwareVersion: localParams.value.firmwareVersion,
          remark: localParams.value.remark,
          serverKey: localParams.value.serverKey,
          videoDomain: localParams.value.videoDomain,
          mainChannel: localParams.value.mainChannel,
          paramsData: JSON.stringify(localParams.value.paramsArray),
        };

        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addDevice(params)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editDevice(params)) as unknown as {
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
    }
    .img-upload {
      width: 100%;
      height: 36px;
      margin-top: 12px;
      text-align: center;
    }
  }
</style>
