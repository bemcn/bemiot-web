<template>
  <div class="main-panner">
    <!--分屏显示-->
    <div class="main-box">
      <n-grid cols="12" responsive="screen" :x-gap="15" :y-gap="15" style="height: 100%">
        <n-grid-item span="3">
          <n-card size="small" :bordered="false" style="min-height: 600px">
            <template #header>
              <n-input
                maxlength="20"
                v-model:value="queryKey"
                type="text"
                placeholder="请输入关键字"
                clearable
                @keyup="handleKeyUp"
                @clear="handleKeyClear"
              />
            </template>
            <div class="card-content" style="max-height: 600px; overflow-y: auto">
              <n-tree
                block-line
                :data="treeOptions"
                :expand-on-click="true"
                :default-expanded-keys="['0']"
                :node-props="nodeProps"
                v-show="!queryKey"
              />
              <div class="q-box" v-show="queryKey">
                <div class="q-line">
                  <div class="item-icon">
                    <n-icon size="10" color="#777">
                      <CaretRightFilled />
                    </n-icon>
                  </div>
                  <div class="item-label">主楼1</div>
                </div>
                <div class="q-line">
                  <div class="item-icon">
                    <n-icon size="10" color="#777">
                      <CaretRightFilled />
                    </n-icon>
                  </div>
                  <div class="item-label">主楼1</div>
                </div>
                <div class="q-line">
                  <div class="item-icon">
                    <n-icon size="10" color="#777">
                      <CaretRightFilled />
                    </n-icon>
                  </div>
                  <div class="item-label">主楼1</div>
                </div>
              </div>
            </div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="9" style="height: 100%">
          <n-card size="small" :bordered="false" style="height: 100%; padding: 0px 10px 15px 10px">
            <template #header>
              <n-button
                :type="splitNum === 1 ? 'primary' : 'default'"
                style="margin-right: 15px"
                @click="handleSplit(1)"
              >
                <template #icon>
                  <n-icon>
                    <ExpandOutlined />
                  </n-icon>
                </template>
                单屏
              </n-button>
              <n-button
                :type="splitNum === 2 ? 'primary' : 'default'"
                style="margin-right: 15px"
                @click="handleSplit(2)"
              >
                <template #icon>
                  <n-icon>
                    <AppstoreOutlined />
                  </n-icon>
                </template>
                四屏
              </n-button>
              <n-button :type="splitNum === 3 ? 'primary' : 'default'" @click="handleSplit(3)">
                <template #icon>
                  <n-icon>
                    <TableOutlined />
                  </n-icon>
                </template>
                九屏
              </n-button>
            </template>
            <div class="card-content">
              <n-grid :x-gap="6" :y-gap="6" :cols="splitNum" style="height: 100%">
                <n-gi
                  v-for="num in blockNum"
                  :key="num"
                  :class="selectIndex === num ? 'v-box active' : 'v-box'"
                  @click="handleBoxClick(num)"
                >
                  <div :id="'video_' + num" class="default-box"></div>
                </n-gi>
              </n-grid>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { getDevicesTree } from '@/api/devices/device';
  import { TreeOption } from 'naive-ui';
  // @ts-ignore
  import { CaretRightFilled, ExpandOutlined, AppstoreOutlined, TableOutlined } from '@vicons/antd';
  // @ts-ignore
  import MapBox from './MapBox.vue';
  import { debounce } from 'lodash-es';
  import { addStreamProxy, delStreamProxy } from '@/api/video/media';
  import { StreamProxyParam } from '@/types/MediaParams';
  import { onBeforeRouteLeave } from 'vue-router';

  declare const Jessibuca: any;

  const treeOptions = ref<any[]>([]);
  const queryKey = ref('');
  const splitNum = ref(1);
  const blockNum = ref(1);
  const selectIndex = ref(0);
  const channelList = ref<any[]>([]);
  const jessibucaPlayers = ref<any[]>([]);
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

  /**
   * 获取设备位置树
   */
  const createTreeData = async () => {
    const params = {
      types: '3,4',
      lastType: 2,
    };

    const result = (await getDevicesTree(params)) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      console.log(result.data);
      return result.data;
    } else {
      return [];
    }
  };
  const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
      onClick() {
        const treeType = option.type + '';
        if (treeType === 'channel') {
          // 判断是否已在播放列表
          let isPlayer = false;
          for (let i = 0; i < 9; i++) {
            if (channelList.value[i].channelId === option.id) {
              isPlayer = true;
              break;
            }
          }

          // 判断是否超过当前显示矩阵
          let index = 0;
          if (selectIndex.value > 0) {
            index = selectIndex.value;

            if (isPlayer) {
              window['$message'].error('视频通道已在播放列表中，请勿重复添加！');
            } else {
              removeVideo(index);
              if (selectIndex.value > 0) {
                channelList.value[index - 1] = {
                  channelId: option.id,
                  channelName: option.label,
                  deviceId: option.levelId,
                  smtpUrl: option.url,
                  key: '',
                };
              } else {
                channelList.value[index - 1] = {
                  channelId: option.id,
                  channelName: option.label,
                  deviceId: option.levelId,
                  smtpUrl: option.url,
                  key: '',
                };
              }
              initPlayer(index);
            }
          } else {
            window['$message'].error('请指定右侧播放的屏幕');
          }
        }
      },
    };
  };
  // 防抖处理查询函数
  const debouncedHandleQuery = debounce(() => {
    if (queryKey.value) {
      console.log('OK');
    } else {
      console.log('NULL');
    }
    console.log('key:', queryKey.value);
  }, 500);
  const handleKeyUp = () => {
    debouncedHandleQuery();
  };
  const handleKeyClear = () => {
    queryKey.value = '';
  };

  // 分屏切换
  const handleSplit = (num: number) => {
    splitNum.value = num;
    const total = num * num;
    blockNum.value = total;
    // 如果channelList 的数组长度大于splitNum，则删除末尾多余的内容；如果小于，则增加空白的内容
    for (let i = 0; i < 9; i++) {
      const index = i + 1;
      if (index > total) {
        // 移除视频
        removeVideo(index);
      }
    }
    selectIndex.value = 0;
  };

  // 选中分屏
  const handleBoxClick = (index: number) => {
    if (index === selectIndex.value) {
      selectIndex.value = 0;
    } else {
      selectIndex.value = index;
    }
  };

  // 初始化播放视频
  const initPlayer = async (index: number) => {
    const n = index - 1;
    const channel = channelList.value[n];

    // 调用接口获取视频流地址
    const params: StreamProxyParam = {
      app: channel.deviceId,
      stream: channel.channelId,
      url: channel.smtpUrl,
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
      channel.key = refData.key;
      const url = refData.wsFlvUrl;

      // 确保元素已经渲染
      setTimeout(() => {
        const divId = 'video_' + index;
        const container = document.getElementById(divId);
        if (container && !jessibucaPlayers.value[n]) {
          // 创建播放器
          jessibucaPlayers.value[n] = new Jessibuca({
            container,
            ...config,
          });
          jessibucaPlayers.value[n].play(url);
        } else if (container) {
          // 如果 ckplayer 还未加载完成，稍后重试
          setTimeout(() => initPlayer(index), 100);
        }
      }, 100);
    } else {
      channelList.value[n] = {
        channelId: '',
        channelName: '',
        deviceId: '',
        smtpUrl: '',
        key: '',
      };
      window['$message'].error('获取视频流地址失败');
    }
  };

  // 移除视频
  const removeVideo = async (index: number) => {
    const n = index - 1;
    // 销毁播放器实例
    if (jessibucaPlayers.value[n]) {
      try {
        jessibucaPlayers.value[n].destroy();
        jessibucaPlayers.value[n] = null;
      } catch (e) {
        console.log('Error quitting player - ' + n + ':', e);
      }
    }

    const channel = channelList.value[n];
    const mediaKey = channel.key;
    if (mediaKey !== '') {
      const params = {
        key: mediaKey,
      };

      const result = (await delStreamProxy(params)) as unknown as {
        status: string;
        message: string;
      };
      if (result.status !== 'success') {
        window['$message'].error('关闭视频流失败');
      }
    }
    channelList.value[n] = {
      channelId: '',
      channelName: '',
      deviceId: '',
      smtpUrl: '',
      key: '',
    };
  };

  onMounted(async () => {
    treeOptions.value = await createTreeData();
    for (let i = 0; i < 9; i++) {
      channelList.value.push({
        channelId: '',
        channelName: '',
        deviceId: '',
        smtpUrl: '',
        key: '',
      });
      jessibucaPlayers.value.push(null);
    }
  });

  onBeforeRouteLeave((_to, _from, next) => {
    for (let i = 0; i < 9; i++) {
      channelList.value.push({
        channelId: '',
        channelName: '',
        deviceId: '',
        smtpUrl: '',
        key: '',
      });
      removeVideo(i + 1);
      next();
    }
  });
</script>

<style lang="less" scoped>
  .main-panner {
    width: 100%;
    height: 100%;
    padding-right: 220px;
    padding-bottom: 128px;
    padding-top: 10px;
    position: fixed;
    top: 108px;
    left: 210px;
    z-index: 1;
    .main-box {
      width: 100%;
      height: 100%;
    }
  }
  .card-content {
    width: 100%;
    height: 100%;
    padding: 0px 0px 20px 0px;
    color: #333333;
    font-size: 14px;
    .card-info {
      width: 100%;
      height: 48px;
      margin-bottom: 15px;
      padding: 10px 10px 10px 10px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
    .q-box {
      width: 100%;
      position: relative;
      .q-line {
        width: 100%;
        height: 24px;
        background-color: #ffffff;
        margin: 5px 0px;
        .item-icon {
          width: 24px;
          height: 22px;
          text-align: center;
          float: left;
        }
        .item-label {
          height: 22px;
          line-height: 22px;
          margin-left: 26px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .q-line:hover {
        background-color: #f5f5f5;
      }
    }
    .v-box {
      height: 100%;
      background-color: #000;
      cursor: pointer;
      .default-box {
        width: 100%;
        height: 100%;
        font-size: 32px;
        color: #fff;
        display: grid;
        place-items: center;
      }
    }
    .active {
      border: 4px solid #409eff;
      background-color: #111111;
    }
  }
</style>
