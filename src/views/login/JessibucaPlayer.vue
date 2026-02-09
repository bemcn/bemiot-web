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
      <div class="video" ref="playerRef"></div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';

  // 声明Jessibuca全局变量
  declare const Jessibuca: any;

  const playerRef = ref<HTMLDivElement>();
  const jessibucaPlayer = ref<any>();

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
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

  const closeModalAfter = () => {
    // 销毁播放器实例
    if (jessibucaPlayer.value) {
      jessibucaPlayer.value.destroy();
      jessibucaPlayer.value = null;
    }
    emit('close');
  };

  // 等待 DOM 更新后初始化播放器
  const initPlayer = async () => {
    // 确保元素已经渲染
    setTimeout(() => {
      // 创建播放器
      jessibucaPlayer.value = new Jessibuca({
        container: playerRef.value!,
        ...config,
      });
      jessibucaPlayer.value.play('ws://127.0.0.1:7080/cam1/101.live.flv');
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
