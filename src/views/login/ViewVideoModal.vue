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
      <div class="video" id="video"></div>
      <div v-if="errorMessage" class="error-message">
        <div class="error-content">
          <h3>播放器错误</h3>
          <p>{{ errorMessage }}</p>
          <div class="error-solutions">
            <p>解决方案：</p>
            <ul>
              <li>确保视频服务器正在运行</li>
              <li>检查防火墙设置，确保端口7080未被阻止</li>
              <li>确认视频流地址正确</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';

  // 声明ckplayer全局变量
  declare const ckplayer: any;

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const loadCkplayer = ref();
  const errorMessage = ref('');

  const closeModalAfter = () => {
    // 销毁播放器实例
    if (loadCkplayer.value) {
      try {
        loadCkplayer.value.remove();
      } catch (e) {
        console.log('Error quitting player:', e);
      }
    }
    emit('close');
  };

  // 等待 DOM 更新后初始化播放器
  const initPlayer = () => {
    // 清除之前的错误信息
    errorMessage.value = '';

    // 确保元素已经渲染
    setTimeout(() => {
      const videoContainer = document.getElementById('video');
      if (videoContainer && typeof ckplayer !== 'undefined') {
        // 如果已有播放器实例，先销毁
        if (loadCkplayer.value) {
          try {
            loadCkplayer.value.remove();
          } catch (e) {
            console.log('Error quitting existing player:', e);
          }
        }

        loadCkplayer.value = new ckplayer({
          container: '#video', // 使用 ID 选择器更准确
          variable: 'player',
          autoplay: true,
          live: true,
          //plug: 'hls.js',
          plug: 'mpegts.js',
          video: 'http://127.0.0.1:7080/cam1/101.live.ts',
          // 添加错误处理配置
          errorShow: true,
          // 配置跨域选项
          crossOrigin: 'anonymous',
          // 截图功能是否开启
          screenshot: true,
          timeScheduleAdjust: 0,
          rightBar: null,
          menu: null,
          // 移除菜单配置以禁用右键菜单
        });

        // 添加播放器事件监听
        setTimeout(() => {
          addPlayerListeners();
        }, 500);
      } else if (videoContainer) {
        // 如果 ckplayer 还未加载完成，稍后重试
        setTimeout(initPlayer, 100);
      }
    }, 100);
  };

  // 添加播放器事件监听
  const addPlayerListeners = () => {
    if (loadCkplayer.value) {
      // 监听播放错误
      try {
        loadCkplayer.value.addListener('error', function (error) {
          console.error('播放器错误:', error);
          errorMessage.value = '无法连接到RTMP服务器或播放出现问题';
        });

        loadCkplayer.value.addListener('play', function () {
          console.log('视频开始播放');
          errorMessage.value = ''; // 清除错误信息
        });

        // 监听加载状态
        loadCkplayer.value.addListener('loadstart', function () {
          console.log('开始加载视频');
        });

        // 监听等待状态
        loadCkplayer.value.addListener('waiting', function () {
          console.log('视频缓冲中');
        });

        // 监听播放准备就绪
        loadCkplayer.value.addListener('canplay', function () {
          console.log('可以开始播放');
        });
      } catch (e) {
        console.error('添加事件监听失败:', e);
        errorMessage.value = '播放器初始化失败';
      }
    }
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
