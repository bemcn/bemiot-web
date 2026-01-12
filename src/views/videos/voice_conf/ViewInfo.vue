<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 960px"
    title="详情"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="服务名称">
          <n-input :value="localParams.serverName" readonly />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="服务类型">
          <n-input :value="localParams.serverType" readonly />
        </n-form-item-gi>
        <n-gi :span="24" v-if="localParams.serverType === 'BEM SIP'">
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="SIP ID">
              <n-input :value="localParams.config.sipId" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="SIP服务域">
              <n-input :value="localParams.config.sipDomain" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="服务器地址">
              <n-input :value="localParams.config.sipAddress" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="服务器端口">
              <n-input :value="localParams.config.sipPort" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="认证密码">
              <n-input :value="localParams.config.sipPass" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="信令协议">
              <n-input :value="localParams.config.protocol" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="传输协议">
              <n-input :value="localParams.config.transmission" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="心跳间隔">
              <n-input-group>
                <n-input :value="localParams.config.heartInterval" readonly />
                <n-input-group-label>秒</n-input-group-label>
              </n-input-group>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="注册有效期">
              <n-input-group>
                <n-input :value="localParams.config.regExpiration" readonly />
                <n-input-group-label>秒</n-input-group-label>
              </n-input-group>
            </n-form-item-gi>
          </n-grid>
        </n-gi>
        <n-gi :span="24" v-else>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="服务标识">
              <n-input :value="localParams.config.appId" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="服务器地址">
              <n-input :value="localParams.config.ipAddress" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="认证密钥">
              <n-input :value="localParams.config.secret" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="播放协议">
              <n-input :value="localParams.config.playProtocol" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="收流模式" path="receiveType">
              <n-input
                :value="localParams.config.receiveType === '0' ? '单端口' : '多端口'"
                readonly
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="收流端口">
              <n-input-group>
                <n-input :value="localParams.config.receivePort1" readonly />
                <n-input-group-label>至</n-input-group-label>
                <n-input :value="localParams.config.receivePort2" readonly />
              </n-input-group>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="http端口">
              <n-input :value="localParams.config.httpPort" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="https端口">
              <n-input :value="localParams.config.httpsPort" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="rtmp端口">
              <n-input :value="localParams.config.rtmpPort" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="rtsp端口">
              <n-input :value="localParams.config.rtspPort" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="rtp端口">
              <n-input :value="localParams.config.rtpPort" readonly />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="录像端口">
              <n-input :value="localParams.config.storagePort" readonly />
            </n-form-item-gi>
          </n-grid>
        </n-gi>
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
      default: () => ({
        certificateId: 0,
        certificateName: '',
        certificateStandard: null,
        caFile: '',
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formRef: any = ref(null);

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });
</script>
