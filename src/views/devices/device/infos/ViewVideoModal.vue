<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 760px"
    :title="localParams?.value?.channelName || '视频播放'"
    @after-leave="closeModalAfter"
  >
    <div class="video-box">
      <div class="video" ref="playerRef"></div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { addStreamProxy, delStreamProxy } from '@/api/video/media';
  import { StreamProxyParam } from '@/types/MediaParams';

  // 声明ckplayer全局变量
  declare const Jessibuca: any;

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => {},
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const playerRef = ref<HTMLDivElement>();
  const jessibucaPlayer = ref<any>();
  const localParams: any = ref(null);
  const mediaKey = ref('');
  const config: any = {
    isFlv: true, // 是否使用flv格式
    showBandwidth: true, // 是否显示带宽使用情况
    loadingText: '加载中...',
    decoder: '/jessibuca/decoder.js',
    hiddenAutoPause: true,
    hasAudio: true,
    recordType: 'mp4',
    controlAutoHide: true,
    operateBtns: {
      // 配置按钮对象
      screenshot: true, // 是否启用截图功能
      fullscreen: true, // 是否启用全屏功能
      play: true, // 是否启用播放功能
      audio: true, // 是否启用音频功能
      record: true, // 是否启用录制功能
    },
  };

  const closeModalAfter = async () => {
    // 销毁播放器实例
    if (jessibucaPlayer.value) {
      jessibucaPlayer.value.destroy();
      jessibucaPlayer.value = null;
    }

    if (mediaKey.value !== '') {
      const params = {
        key: mediaKey.value,
      };
      mediaKey.value = '';

      const result = (await delStreamProxy(params)) as unknown as {
        status: string;
        message: string;
      };
      if (result.status !== 'success') {
        window['$message'].error('关闭视频流失败');
      }
    }
    emit('close');
  };

  // 等待 DOM 更新后初始化播放器
  const initPlayer = async () => {
    // 调用接口获取视频流地址
    const params: StreamProxyParam = {
      app: localParams.value.deviceId,
      stream: localParams.value.channelId,
      url: localParams.value.smtpUrl,
      enableAudio: 1,
    };

    const result = (await addStreamProxy(params)) as unknown as {
      status: string;
      code: number;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      const refData = result.data;
      mediaKey.value = refData.key;
      const url = refData.wsFlvUrl;

      // 确保元素已经渲染
      setTimeout(() => {
        // 创建播放器
        jessibucaPlayer.value = new Jessibuca({
          container: playerRef.value!,
          ...config,
        });
        jessibucaPlayer.value.play(url);
      }, 100);
    } else {
      mediaKey.value = '';
      window['$message'].error('获取视频流地址失败');
    }
  };

  watch([() => props.showModel, () => props.params], async ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
    if (newShowModel && newShowModel === true) {
      console.log('localParams', localParams.value);
      initPlayer();
    }
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

  .error-message {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    z-index: 10;
    padding: 20px;
    box-sizing: border-box;
  }

  .error-content {
    max-width: 80%;
    text-align: center;
  }

  .error-content h3 {
    margin-bottom: 15px;
    color: #ff4d4f;
  }

  .error-solutions {
    margin-top: 20px;
    text-align: left;
  }

  .error-solutions ul {
    padding-left: 20px;
  }

  .error-solutions li {
    margin-bottom: 10px;
  }
</style>
