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
          <n-form-item label-style="color: #999999" label="设备名称：">
            <div class="item-value">{{ localParams.deviceName }}</div>
          </n-form-item>
          <n-form-item label-style="color: #999999" label="设备编号：">
            <div class="item-value">{{ localParams.deviceCode }}</div>
          </n-form-item>
          <n-form-item label-style="color: #999999" label="所属产品：">
            <div class="item-value">{{ localParams.productName }}</div>
          </n-form-item>
          <n-form-item label-style="color: #999999" label="所属分组：">
            <div class="item-value">{{ localParams.groupName }}</div>
          </n-form-item>
          <n-form-item label-style="color: #999999" label="安装位置：">
            <div class="item-value">{{ localParams.spaceRouteName }}</div>
          </n-form-item>
        </n-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="设备图片：" path="images">
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
          </div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="定位方式：">
          <div class="item-value">{{ getLocalMethod(localParams.locateMethod) }}</div>
        </n-form-item-gi>
        <n-form-item-gi
          label-style="color: #999999"
          :span="12"
          label="经纬度："
          v-if="localParams.locateMethod === '3'"
        >
          <div class="item-value">{{ localParams.longitude + ',' + localParams.latitude }}</div>
        </n-form-item-gi>
        <n-form-item-gi
          label-style="color: #999999"
          :span="24"
          label="设备地址："
          v-if="localParams.locateMethod === '0' || localParams.locateMethod === '3'"
        >
          <div class="item-value">{{ localParams.address }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="固件版本：">
          <div class="item-value">v{{ localParams.firmwareVersion }}</div>
        </n-form-item-gi>
        <n-form-item-gi
          label-style="color: #999999"
          :span="12"
          label="上级网关"
          v-if="localParams.types === 4"
        >
          <div class="item-value">{{ localParams.gatewayName }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="入网地址：">
          <div class="item-value">{{ localParams.ipAddress }}</div>
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label-style="color: #999999"
          :label="item.label + '：'"
          :path="item.key"
          v-for="item in localParams.paramsArray"
          :key="item.key"
        >
          <div class="item-value">{{ item.value }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="12" label="设备状态：">
          <div class="item-value">
            <n-tag size="small" type="warning" v-if="localParams.status === 1">未激活</n-tag>
            <n-tag size="small" type="error" v-else-if="localParams.status === 2">已禁用</n-tag>
            <n-tag size="small" type="success" v-else>启用中</n-tag>
          </div>
        </n-form-item-gi>
        <n-form-item-gi
          label-style="color: #999999"
          :span="12"
          label="激活时间："
          v-if="localParams.status > 1"
        >
          <div class="item-value">{{ localParams.activeTime }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="24" label="备注：">
          <div class="item-value">{{ localParams.remark }}</div>
        </n-form-item-gi>
        <n-form-item-gi label-style="color: #999999" :span="24" label="其他：">
          <div class="item-value">
            <n-button style="width: 120px; margin-right: 15px">认证信息</n-button>
            <n-button style="width: 120px" @click="onErCodeClick">二维码</n-button>
          </div>
          <n-image-preview
            v-model:show="showErCodeRef"
            :src="globSetting.apiUrl + localParams.erCode"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">关闭</n-button>
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
  const showErCodeRef = ref(false);
  const globSetting = useGlobSetting();

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });

  // 预览二维码
  const onErCodeClick = () => {
    showErCodeRef.value = true;
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
      width: 200px;
      height: 200px;
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

  /deep/ .n-form-item .n-form-item-feedback-wrapper {
    line-height: 0;
    min-height: 5px;
    font-size: 0;
    height: 10px;
  }
</style>
