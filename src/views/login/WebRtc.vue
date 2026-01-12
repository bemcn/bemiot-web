<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 760px"
    title="播放器测试"
    @after-leave="closeModalAfter"
  >
    <div class="video-box">
      <video id="video" autoplay width="100%" height="100%"></video>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import '../../utils/media/webrtcstreamer.js';
  import '../../utils/media/adapter.min.js';

  declare global {
    interface Window {
      WebRtcStreamer: any;
    }
  }

  const WebRtcStreamer = window.WebRtcStreamer;

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  let webRtcServer: any = null;

  const closeModalAfter = () => {
    // 销毁播放器实例
    if (webRtcServer) {
      try {
        webRtcServer.disconnect();
        webRtcServer = null;
      } catch (e) {
        console.log('Error quitting player:', e);
      }
    }
    emit('close');
  };

  // 等待 DOM 更新后初始化播放器
  const initPlayer = () => {
    // 确保元素已经渲染
    setTimeout(() => {
      // 如果已有播放器实例，先销毁
      if (webRtcServer) {
        try {
          webRtcServer.disconnect();
          webRtcServer = null;
        } catch (e) {
          console.log('Error quitting existing player:', e);
        }
      }

      webRtcServer = new WebRtcStreamer('video', 'rtsp://127.0.0.1:7554/cam1/101');
      webRtcServer.connect('rtsp://admin:FV123456@172.150.1.3:554/Streaming/Channels/1');
    }, 100);
  };

  watch([() => props.showModel], async ([newShowModel]) => {
    showState.value = newShowModel;
    if (newShowModel && newShowModel === true) {
      initPlayer();
    }
  });

  // 组件挂载后尝试初始化播放器
  onMounted(() => {
    // if (props.showModel) {
    //   initPlayer();
    // }
  });
</script>

<style lang="less" scoped>
  .video-box {
    width: 100%;
    height: 380px;
    background-color: #000000;
    position: relative;
  }

  .video {
    width: 100%;
    height: 100%;
  }
</style>
