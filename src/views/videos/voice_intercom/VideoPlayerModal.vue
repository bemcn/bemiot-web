<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 860px"
    title="录像回放"
    @after-leave="closeModalAfter"
  >
    <div class="search-line">
      <div class="label">开始时间</div>
      <div class="component">
        <n-date-picker v-model:value="startDate" type="datetime" />
      </div>
      <div class="label">截止时间</div>
      <div class="component">
        <n-date-picker v-model:value="endDate" type="datetime" />
      </div>
      <div class="buttonbox">
        <n-button type="info" @click="confirmQuery">确认</n-button>
      </div>
    </div>
    <div class="video-box">
      <div class="video" ref="playerRef"></div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { addStreamProxy, delStreamProxy } from '@/api/video/media';
  import { StreamProxyParam } from '@/types/MediaParams';
  import { format } from 'date-fns';

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
  const startDate = ref(new Date().getTime());
  const endDate = ref(new Date().getTime());
  const queryStart = ref('');
  const queryEnd = ref('');
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

  //查询播放
  const confirmQuery = async () => {
    const date1 = new Date(startDate.value);
    const date2 = new Date(endDate.value);
    queryStart.value = format(date1, "yyyyMMdd't'HHmmss'z'");
    queryEnd.value = format(date2, "yyyyMMdd't'HHmmss'z'");

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

    setTimeout(() => {
      initPlayer();
    }, 500);
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
    let smtpUrl = localParams.value.smtpUrl;
    smtpUrl = smtpUrl + '?starttime=' + queryStart.value + '&endtime=' + queryEnd.value;

    const params: StreamProxyParam = {
      app: localParams.value.device.deviceId,
      stream: localParams.value.channelId,
      url: smtpUrl,
      enableAudio: 1,
    };
    console.log('params', params);

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
      }, 500);
    } else {
      mediaKey.value = '';
      window['$message'].error('获取视频流地址失败');
    }
  };

  watch([() => props.showModel, () => props.params], async ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
    if (newShowModel && newShowModel === true) {
      // 初始化起止时间
      startDate.value = new Date().setHours(0, 0, 0, 0);
      endDate.value = new Date().getTime();

      const date1 = new Date(startDate.value);
      const date2 = new Date(endDate.value);
      //转为 20251121t154020z 这样的格式
      queryStart.value = format(date1, "yyyyMMdd't'HHmmss'z'");
      queryEnd.value = format(date2, "yyyyMMdd't'HHmmss'z'");

      initPlayer();
    }
  });
</script>

<style lang="less" scoped>
  .search-line {
    width: 100%;
    height: 54px;
    padding: 10px 15px;
    border: 1px solid #eee;
    margin-bottom: 10px;
    .label {
      height: 34px;
      line-height: 34px;
      margin-right: 10px;
      float: left;
    }
    .component {
      width: 200px;
      height: 34px;
      margin-right: 20px;
      float: left;
    }
    .buttonbox {
      height: 34px;
      margin-right: 20px;
      float: left;
    }
  }
  .video-box {
    width: 100%;
    height: 420px;
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
