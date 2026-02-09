<template>
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 860px"
    title="详情"
    @after-leave="closeModalAfter"
  >
    <n-form :model="localParams" label-placement="left" :label-width="120" class="py-4">
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="服务器名称">
          <n-input :value="localParams.serverName" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="服务器类型">
          <n-input :value="localParams.serverType" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="服务器地址">
          <n-input :value="localParams.ipAddress" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="播放协议">
          <n-input :value="localParams.playProtocol" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="自动配置">
          <n-switch :value="localParams.autoConfig" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="收流模式">
          <n-radio-group :value="localParams.receiveType" name="radiogroup">
            <n-space>
              <n-radio :value="0" disabled>单端口</n-radio>
              <n-radio :value="1" disabled>多端口</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="收流端口">
          <div style="width: 43%; float: left"
            ><n-input :value="localParams.receivePort1" readonly
          /></div>
          <div style="margin: 0px 12px; float: left">至</div>
          <div style="width: 43%; float: left"
            ><n-input :value="localParams.receivePort2" readonly
          /></div>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="http端口">
          <n-input :value="localParams.httpPort" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="https端口">
          <n-input :value="localParams.httpsPort" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="rtmp端口">
          <n-input :value="localParams.rtmpPort" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="hls端口">
          <n-input :value="localParams.hlsPort" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="webscoket端口">
          <n-input :value="localParams.webscoketPort" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="录像管理端">
          <n-input :value="localParams.storagePort" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="备注">
          <n-input
            type="textarea"
            :autosize="{
              minRows: 3,
            }"
            readonly
            :value="localParams.remark"
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
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref(null);

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = { ...newParams }; // 创建副本避免直接修改props
  });
</script>
