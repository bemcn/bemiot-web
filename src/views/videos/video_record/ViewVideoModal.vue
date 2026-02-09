<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 760px"
    :title="localParams?.channelName"
    @after-leave="closeModalAfter"
  >
    <div class="video-box"></div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { editDeviceChannel } from '@/api/video/deviceChannel';
  import { VideoServer } from '@/types/VideoModel';
  import { getVideoServerList } from '@/api/video/videoServer';

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

  watch([() => props.showModel, () => props.params], async ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });
</script>

<style lang="less" scoped>
  .video-box {
    width: 100%;
    height: 380px;
    background-color: #000000;
  }
</style>
