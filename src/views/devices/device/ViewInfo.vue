<template>
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    :show-feedback="false"
    preset="dialog"
    style="width: 1200px"
    title="详情"
    @after-leave="closeModalAfter"
  >
    <n-tabs
      class="tabs"
      size="small"
      type="card"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      v-model:value="activeTab"
    >
      <n-tab-pane name="info" tab="设备信息">
        <DevInfoModal
          :data="localParams"
          :key="localParams?.deviceId || Date.now()"
          v-show="showState"
        />
      </n-tab-pane>
      <n-tab-pane name="subList" tab="网关子设备" v-if="localParams.types === 2">
        <DevSubModal
          :id="localParams?.deviceId"
          :key="localParams?.deviceId || Date.now()"
          v-show="showState"
        />
      </n-tab-pane>
      <n-tab-pane name="models" tab="物模型">
        <DevModelModal
          :id="localParams?.deviceId"
          :key="localParams?.deviceId || Date.now()"
          v-show="showState"
          @event-more="handleEventMore"
        />
      </n-tab-pane>
      <n-tab-pane
        name="channel"
        tab="视频通道"
        v-if="localParams.types === 3 || localParams.types === 4"
      >
        <DevChannelModal
          :id="localParams?.deviceId"
          :key="localParams?.deviceId || Date.now()"
          v-show="showState"
        />
      </n-tab-pane>
      <n-tab-pane name="events" tab="设备事件">
        <DevEventModal
          :id="localParams?.deviceId"
          :identity="viewIdentity"
          :key="localParams?.deviceId || Date.now()"
          v-show="showState"
        />
      </n-tab-pane>
      <n-tab-pane name="alarm" tab="设备告警">
        <DevAlarmModal
          :id="localParams?.deviceId"
          :key="localParams?.deviceId || Date.now()"
          v-show="showState"
        />
      </n-tab-pane>
      <n-tab-pane name="record" tab="设备档案">
        <DevRecordModal
          :id="localParams?.deviceId"
          :key="localParams?.deviceId || Date.now()"
          v-show="showState"
        />
      </n-tab-pane>
    </n-tabs>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  // @ts-ignore
  import DevInfoModal from './infos/DevInfoModal.vue';
  // @ts-ignore
  import DevSubModal from './infos/DevSubModal.vue';
  // @ts-ignore
  import DevModelModal from './infos/DevModelModal.vue';
  // @ts-ignore
  import DevChannelModal from './infos/DevChannelModal.vue';
  // @ts-ignore
  import DevEventModal from './infos/DevEventModal.vue';
  // @ts-ignore
  import DevAlarmModal from './infos/DevAlarmModal.vue';
  // @ts-ignore
  import DevRecordModal from './infos/DevRecordModal.vue';

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
  const activeTab = ref('info'); // 默认选中的标签页
  const viewIdentity = ref('');

  const closeModalAfter = () => {
    emit('close');
  };

  // 处理从物模型组件传来的事件
  const handleEventMore = (record: any) => {
    viewIdentity.value = record.modelIdentity;
    activeTab.value = 'events';
  };

  watch(
    [() => props.showModel, () => props.params],
    ([newShowModel, newParams]) => {
      showState.value = newShowModel;
      if (newParams) {
        localParams.value = { ...newParams };
      }
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  .tabs {
    margin-top: 10px;
    width: 100%;
  }
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

  :deep(.n-form-item .n-form-item-feedback-wrapper) {
    line-height: 0;
    min-height: 5px;
    font-size: 0;
    height: 10px;
  }
</style>
