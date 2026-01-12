<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    :show-feedback="false"
    preset="dialog"
    style="width: 940px"
    title="详情"
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
        <n-gi :span="12">
          <n-form-item label-style="color: #999999" label="产品名称：">
            <div class="item-value">{{ localParams.productName }}</div>
          </n-form-item>
          <n-form-item label-style="color: #999999" label="产品分类：">
            <div class="item-value">{{ localParams.className }}</div>
          </n-form-item>
          <n-form-item label-style="color: #999999" label="产品类型：">
            <div class="item-value">{{ getTypeName(localParams.types) }}</div>
          </n-form-item>
          <n-form-item label-style="color: #999999" label="产品型号：">
            <div class="item-value">{{ localParams.models }}</div>
          </n-form-item>
        </n-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="产品图片：" path="images">
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
          </div>
        </n-form-item-gi>
        <n-form-item-gi
          label-style="color: #999999"
          :span="24"
          label="产品规格："
          v-if="localParams.attributeArray && localParams.attributeArray.length > 0"
        >
          <div class="attribute-params">
            <n-descriptions
              label-placement="left"
              label-style="color:#999999"
              content-style="color: #666666"
            >
              <n-descriptions-item
                v-for="(item, index) in localParams.attributeArray"
                :key="index"
                :label="item.label"
                >{{ item.value }}</n-descriptions-item
              >
            </n-descriptions>
          </div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="生产厂商：">
          <div class="item-value">{{ localParams.manufacturer }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="供应商：">
          <div class="item-value">{{ localParams.supplier }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="产品固件：">
          <div class="item-value">{{ localParams.firmwareName }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="联网方式：">
          <div class="item-value">{{ getNetMethod(localParams.netMethod) }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="定位方式：">
          <div class="item-value">{{ getLocalMethod(localParams.locateMethod) }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="驱动协议：">
          <div class="item-value">{{ localParams.driveName }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="传输协议：">
          <div class="item-value">{{ getTrans(localParams.trans) }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="采集模式：">
          <div class="item-value">{{ getCollectType(localParams.collectType) }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="认证方式：">
          <div class="item-value">{{ getAuthMethod(localParams.authMethod) }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="设备授权：">
          <div class="item-value">{{ localParams.authEquipment === 1 ? '启用' : '关闭' }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="24" label="备注：">
          <div class="item-value">{{ localParams.remark }}</div>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useGlobSetting } from '@/hooks/setting';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  });

  // 回调
  const emit = defineEmits(['close']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formRef: any = ref(null);
  const globSetting = useGlobSetting();

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });

  // 获取型号
  const getTypeName = (types: number) => {
    let name = '';
    switch (types) {
      case 1:
        name = '直连设备';
        break;
      case 2:
        name = '网关设备';
        break;
      case 3:
        name = '监控设备';
        break;
      case 4:
        name = '视频存储设备';
        break;
      case 5:
        name = '网关子设备';
        break;
      default:
        name = '虚拟设备';
        break;
    }
    return name;
  };
  // 获取联网方式
  const getNetMethod = (method: number) => {
    let name = '';
    switch (method) {
      case 1:
        name = '以太网';
        break;
      case 2:
        name = 'Wifi';
        break;
      case 3:
        name = '蜂窝移动';
        break;
      case 4:
        name = 'NB-IOT';
        break;
      case 5:
        name = '串口通讯';
        break;
      default:
        name = '其他';
        break;
    }
    return name;
  };
  // 获取定位方式
  const getLocalMethod = (method: number) => {
    let name = '';
    switch (method) {
      case 1:
        name = '自动定位';
        break;
      case 2:
        name = '设备定位';
        break;
      case 3:
        name = '自定义位置';
        break;
      default:
        name = '无';
        break;
    }
    return name;
  };
  // 获取传输协议
  const getTrans = (trans: string) => {
    let name = '';
    switch (trans) {
      case 'bem-json':
        name = 'Bem Json解析协议';
        break;
      case 'bem-net':
        name = 'Bem TCP/UDP协议';
        break;
      case 'bem-modbus-rtu':
        name = 'Bem Modbus RTU协议';
        break;
      case 'bem-modbus-tcp':
        name = 'Bem Modbus TCP协议';
        break;
      default:
        name = '未知';
        break;
    }
    return name;
  };
  // 获取采集模式
  const getCollectType = (type: number) => {
    let name = '';
    if (type === 0) {
      name = '设备主动上传';
    } else {
      name = '网关被动采集';
    }
    return name;
  };
  // 获取认证方式
  const getAuthMethod = (method: number) => {
    let name = '';
    switch (method) {
      case 1:
        name = '简单认证';
        break;
      case 2:
        name = '加密认证';
        break;
      case 3:
        name = '简单+加密认证';
      default:
        name = '无认证';
        break;
    }
    return name;
  };
</script>

<style lang="less" scoped>
  .item-value {
    width: 100%;
    height: 34px;
    line-height: 34px;
  }

  .img-box {
    width: 100%;
    padding-right: 80px;
    .img-view {
      width: 160px;
      height: 160px;
      padding: 10px;
      border: 1px solid #eeeeee;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .attribute-params {
    width: 87%;
    padding: 8px 10px;
    border: 1px solid #eeeeee;
    background-color: #fafafa;
    border-radius: 6px;
  }

  :deep(.n-form-item .n-form-item-feedback-wrapper) {
    line-height: 0;
    min-height: 5px;
    font-size: 0;
    height: 10px;
  }
</style>
