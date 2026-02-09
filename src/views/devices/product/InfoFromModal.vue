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
        <n-form-item-gi :span="12" label="产品名称" path="productName">
          <n-input
            maxlength="50"
            placeholder="请输入产品名称"
            v-model:value="localParams.productName"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="产品分类" path="classId">
          <n-cascader
            v-model:value="localParams.classId"
            placeholder="请选择产品分类"
            expand-trigger="click"
            check-strategy="child"
            :options="classOptions"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="产品类型" path="types">
          <n-select
            v-model:value="localParams.types"
            :options="typesOptions"
            placeholder="请选择产品类型"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="产品型号" path="models">
          <n-input
            maxlength="50"
            placeholder="请输入产品型号"
            v-model:value="localParams.models"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="产品规格">
          <div class="attribute-params">
            <div
              class="attribute-line"
              v-for="(item, index) in localParams.attributeArray"
              :key="index"
            >
              <div class="attribute-label">
                <n-input
                  maxlength="10"
                  placeholder="名称，例：重量"
                  v-model:value="item.label"
                  clearable
                />
              </div>
              <div class="attribute-value">
                <n-input
                  maxlength="100"
                  placeholder="值，例：2kg"
                  v-model:value="item.value"
                  clearable
                />
              </div>
              <div class="attribute-del" v-if="index > 0">
                <a href="javascript:;" @click="deleteEnumItem(index)">
                  <n-icon size="18">
                    <CloseCircleFilled />
                  </n-icon>
                </a>
              </div>
            </div>
            <div class="attribute-add">
              <div class="attribute-add-line">
                <n-button text type="info" @click="addAttribute">
                  <n-icon size="12" color="#666" style="margin-right: 4px">
                    <PlusOutlined />
                  </n-icon>
                  添加属性参数
                </n-button>
              </div>
            </div>
          </div>
        </n-form-item-gi>
        <n-gi :span="12">
          <n-form-item label="生产厂商" path="manufacturer">
            <n-input
              maxlength="50"
              placeholder="请输入生产厂商"
              v-model:value="localParams.manufacturer"
              clearable
            />
          </n-form-item>
          <n-form-item label="供应商" path="supplier">
            <n-input
              maxlength="50"
              placeholder="请输入供应商"
              v-model:value="localParams.supplier"
              clearable
            />
          </n-form-item>
          <n-form-item label="产品固件" path="firmwareName">
            <n-input-group>
              <n-input
                maxlength="50"
                placeholder="请选择产品固件"
                v-model:value="localParams.firmwareName"
                readonly
                clearable
              />
              <n-button ghost @click="selectFirmware">选择</n-button>
            </n-input-group>
          </n-form-item>
          <n-form-item label="联网方式" path="netMethod">
            <n-select
              v-model:value="localParams.netMethod"
              :options="netMethodOptions"
              placeholder="请选择联网方式"
            />
          </n-form-item>
          <n-form-item :span="12" label="定位方式" path="locateMethod">
            <n-select
              v-model:value="localParams.locateMethod"
              :options="locateOptions"
              placeholder="请选择定位方式"
            />
          </n-form-item>
        </n-gi>
        <n-form-item-gi :span="12" label="产品图片" path="images">
          <div class="img-box">
            <div class="img-view">
              <n-image
                width="100%"
                height="auto"
                :src="
                  localParams.images === ''
                    ? '/src/assets/images/no-img.gif'
                    : globSetting.apiUrl + localParams.images
                "
              />
            </div>
            <div class="img-upload">
              <n-upload
                :action="uploadUrl"
                :headers="uploadHeaders"
                :accept="'image/jpeg,image/jpg,image/png,image/bmp,image/gif'"
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
        <n-form-item-gi :span="12" label="驱动协议" path="driveName">
          <n-input-group>
            <n-input
              maxlength="50"
              placeholder="请选择驱动协议"
              v-model:value="localParams.driveName"
              readonly
              clearable
            />
            <n-button ghost @click="selectDrive">选择</n-button>
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="传输协议" path="trans">
          <n-select
            v-model:value="localParams.trans"
            :options="transOptions"
            placeholder="请选择传输协议"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="采集模式" path="collectType">
          <n-select
            v-model:value="localParams.collectType"
            :options="collectOptions"
            placeholder="请选择采集模式"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="认证方式" path="authMethod">
          <n-select
            v-model:value="localParams.authMethod"
            :options="authOptions"
            placeholder="请选择认证方式"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="设备授权" path="authEquipment">
          <n-space>
            <n-switch v-model:value="localParams.authEquipment" />
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

  <SelectFirmware
    :showModel="showFirmwareModal"
    @close="() => (showFirmwareModal = false)"
    @checked="checkFirmware"
  />
  <SelectDrive
    :showModel="showDriveModal"
    @close="() => (showDriveModal = false)"
    @checked="checkDrive"
  />
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { addProduct, editProduct } from '@/api/devices/product';
  import { useGlobSetting } from '@/hooks/setting';
  import { ACCESS_TOKEN } from '@/store/mutation-types';
  import { storage } from '@/utils/Storage';
  // @ts-ignore
  import { PlusOutlined, CloseCircleFilled, UploadOutlined } from '@vicons/antd';
  // @ts-ignore
  import SelectFirmware from './SelectFirmware.vue';
  // @ts-ignore
  import SelectDrive from './SelectDrive.vue';

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
    classOption: {
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
  const classOptions = ref<any[]>([]);
  const typesOptions = [
    {
      label: '直连设备',
      value: '1',
    },
    {
      label: '网关设备',
      value: '2',
    },
    {
      label: '监控设备',
      value: '3',
    },
    {
      label: '网关子设备',
      value: '4',
    },
    {
      label: '虚拟设备',
      value: '5',
    },
  ];
  const netMethodOptions = [
    {
      label: '以太网',
      value: '1',
    },
    {
      label: 'Wifi',
      value: '2',
    },
    {
      label: '蜂窝移动',
      value: '3',
    },
    {
      label: 'NB-IOT',
      value: '4',
    },
    {
      label: '串口通讯',
      value: '5',
    },
    {
      label: '其他',
      value: '6',
    },
  ];
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
  const transOptions = [
    {
      label: 'Bem Json解析协议',
      value: 'bem-json',
    },
    {
      label: 'Bem TCP/UDP协议',
      value: 'bem-net',
    },
    {
      label: 'Bem Modbus RTU协议',
      value: 'bem-modbus-rtu',
    },
    {
      label: 'Bem Modbus TCP协议',
      value: 'bem-modbus-tcp',
    },
  ];
  const collectOptions = [
    {
      label: '设备主动上传',
      value: '0',
    },
    {
      label: '网关被动采集',
      value: '1',
    },
  ];
  const authOptions = [
    {
      label: '无认证',
      value: '0',
    },
    {
      label: '简单认证',
      value: '1',
    },
    {
      label: '加密认证',
      value: '2',
    },
    {
      label: '简单+加密认证',
      value: '3',
    },
  ];
  const showFirmwareModal = ref(false);
  const showDriveModal = ref(false);
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
    [() => props.showModel, () => props.classOption, () => props.params],
    ([newShowModel, newOptions, newParams]) => {
      showState.value = newShowModel;
      localParams.value = newParams;
      if (newOptions) {
        classOptions.value = newOptions[0].children;
      }
    }
  );

  // 表单验证
  const rules: FormRules = {
    productName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入产品名称',
    },
    classId: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择产品分类',
    },
    types: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择产品类型',
    },
    driveName: {
      required: true,
      message: '请选择设备驱动',
      trigger: ['blur', 'input'],
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
      localParams.value.images = data.url;
    } else window['$message'].error(message);
  };

  // 增加产品规格行
  const addAttribute = () => {
    let datas = localParams.value.attributeArray;
    let newItem = {
      value: '',
      label: '',
    };
    datas.push(newItem);
    localParams.value.attributeArray = datas;
  };
  // 删除产品规格行
  const deleteEnumItem = (index: number) => {
    localParams.value.attributeArray.splice(index, 1);
  };

  // 选择产品固件
  const selectFirmware = () => {
    showFirmwareModal.value = true;
  };
  const checkFirmware = (dataRow: any) => {
    localParams.value.firmwareId = dataRow.firmwareId;
    localParams.value.firmwareName = dataRow.firmwareName;
  };
  // 选择驱动协议
  const selectDrive = () => {
    showDriveModal.value = true;
  };
  const checkDrive = (dataRow: any) => {
    localParams.value.driveCode = dataRow.driveCode;
    localParams.value.driveName = dataRow.driveName;
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const attributeArray = localParams.value.attributeArray;
        let attributes: { value: any; label: any }[] = [];
        attributeArray.forEach((item: any) => {
          if (item.label !== '' && item.value !== '') {
            attributes.push({
              value: item.value,
              label: item.label,
            });
          }
        });

        const params = {
          productId: localParams.value.productId,
          productName: localParams.value.productName,
          classId: parseInt(localParams.value.classId),
          models: localParams.value.models,
          images: localParams.value.images === null ? '' : localParams.value.images,
          attribute: JSON.stringify(attributes),
          types: parseInt(localParams.value.types),
          manufacturer: localParams.value.manufacturer,
          supplier: localParams.value.supplier,
          firmwareId: localParams.value.firmwareId,
          driveCode: localParams.value.driveCode,
          trans: localParams.value.trans,
          collectType: parseInt(localParams.value.collectType),
          authMethod: parseInt(localParams.value.authMethod),
          netMethod: parseInt(localParams.value.netMethod),
          locateMethod: parseInt(localParams.value.locateMethod),
          authEquipment: localParams.value.authEquipment === true ? 1 : 0,
          remark: localParams.value.remark,
        };

        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addProduct(params)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editProduct(params)) as unknown as {
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
  .from-group {
    width: 100%;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    padding-top: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
    .before-input {
      width: 240px;
      float: left;
    }
    .before-text {
      width: 45px;
      text-align: center;
      float: left;
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
    }
    .img-upload {
      width: 100%;
      height: 36px;
      margin-top: 12px;
      text-align: center;
    }
  }

  .attribute-params {
    width: 100%;
    .attribute-line {
      width: 100%;
      height: 46px;
      .attribute-label {
        width: 160px;
        height: 36px;
        margin-right: 20px;
        float: left;
      }
      .attribute-value {
        width: 360px;
        height: 36px;
        float: left;
      }
      .attribute-del {
        width: 36px;
        height: 36px;
        padding-top: 9px;
        text-align: right;
        float: left;
      }
    }
    .attribute-add {
      width: 100%;
      height: 14px;
      .attribute-add-line {
        width: 100%;
        height: 14px;
      }
    }
  }
</style>
