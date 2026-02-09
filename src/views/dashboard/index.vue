<template>
  <div class="console">
    <!--数据卡片-->
    <DataTotal :loading="loadingIot" :iotStatistics="iotStatistics" />

    <!--消息统计|公告-->
    <div class="mt-4">
      <n-grid cols="1 s:1 m:1 l:1 xl:4 2xl:4" responsive="screen" :x-gap="16" :y-gap="8">
        <n-grid-item span="4 m:4 l:4 xl:3 2xl:3">
          <HourStatistics :loading="loadingHour" :initData="hourStatistics" />
        </n-grid-item>
        <n-grid-item span="4 m:4 l:4 xl:1 2xl:1">
          <NoticeTop :loading="loadingNotice" :initData="noticeList" />
        </n-grid-item>
      </n-grid>
    </div>

    <!--日志 | 设备分类统计-->
    <div class="mt-4">
      <n-grid cols="1 s:1 m:1 l:1 xl:4 2xl:4" responsive="screen" :x-gap="16" :y-gap="8">
        <n-grid-item span="4 m:4 l:4 xl:3 2xl:3">
          <LogTop :loading="loadingLog" :initData="logList" />
        </n-grid-item>
        <n-grid-item span="4 m:4 l:4 xl:1 2xl:1">
          <DevTypeTotal :loading="loadingType" :initData="devTypeTotal" />
        </n-grid-item>
      </n-grid>
    </div>

    <!--访问量 | 流量趋势-->
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import {
    getIotTotal,
    getMessageHourStatistics,
    getDevicesTypeTotal,
    getUpDateBase,
    getNoticeTop,
    getLogTop,
  } from '@/api/dashboard/console';
  import { IotStatistics, DevTypeStatistics, UpdateBaseData } from '@/types/StatisticsModel';
  import { Notice, Log } from '@/types/SystemModel';
  import { useMessage } from 'naive-ui';
  // @ts-ignore
  import DataTotal from './components/DataTotal.vue';
  // @ts-ignore
  import HourStatistics from './components/HourStatistics.vue';
  // @ts-ignore
  import NoticeTop from './components/NoticeTop.vue';
  // @ts-ignore
  import LogTop from './components/LogTop.vue';
  // @ts-ignore
  import DevTypeTotal from './components/DevTypeTotal.vue';

  const iotStatistics = ref({} as IotStatistics);
  const hourStatistics = ref({});
  const devTypeTotal = ref({} as DevTypeStatistics);
  const noticeList = ref([] as Array<Notice>);
  const logList = ref([] as Array<Log>);
  const loadingIot = ref(true);
  const loadingHour = ref(true);
  const loadingNotice = ref(true);
  const loadingLog = ref(true);
  const loadingType = ref(true);
  const message = useMessage();

  /**
   * 获取总统计数据
   */
  const getIotTypeTotal = async () => {
    const result = (await getIotTotal()) as {
      status: string;
      message: string;
      data: IotStatistics;
    };
    if (result.status === 'success') {
      iotStatistics.value = result.data;
      loadingIot.value = false;
    } else {
      message.info(result.message || '获取统计数据失败');
    }
  };

  /**
   * 获取设备消息日统计
   */
  const getHourStatistics = async () => {
    const result = (await getMessageHourStatistics()) as {
      status: string;
      message: string;
      data: Object;
    };
    if (result.status === 'success') {
      hourStatistics.value = result.data;
      loadingHour.value = false;
    } else {
      message.info(result.message || '获取统计地图数据失败');
    }
  };

  /**
   * 获取设备分类数量统计
   */
  const getDevTypeStatistics = async () => {
    const result = (await getDevicesTypeTotal()) as {
      status: string;
      message: string;
      data: DevTypeStatistics;
    };
    if (result.status === 'success') {
      devTypeTotal.value = result.data;
      loadingType.value = false;
    } else {
      message.info(result.message || '获取设备分类统计失败');
    }
  };

  /**
   * 获取通知公告
   */
  const getNoticeList = async () => {
    const params = {
      size: 10,
    };
    const result = (await getNoticeTop(params)) as {
      status: string;
      message: string;
      data: Array<Notice>;
    };
    if (result.status === 'success') {
      noticeList.value = result.data;
      loadingNotice.value = false;
    } else {
      console.log('result:', result.message);
      message.info(result.message || '获取通知公告失败');
    }
  };

  /**
   * 获取日志
   */
  const getLogList = async () => {
    const params = {
      size: 10,
    };
    const result = (await getLogTop(params)) as {
      status: string;
      message: string;
      data: Array<Log>;
    };
    if (result.status === 'success') {
      logList.value = result.data;
      loadingLog.value = false;
    } else {
      console.log('result:', result.message);
      message.info(result.message || '获取通知公告失败');
    }
  };

  /**
   * 获取页面统计刷新数据
   */
  const getUpdateStatistics = async () => {
    if (!loadingIot.value && !loadingHour.value && !loadingType.value) {
      console.log('getUpdateStatistics');
      const result = (await getUpDateBase()) as {
        status: string;
        message: string;
        data: Object;
      };
      if (result.status === 'success') {
        const data = result.data as UpdateBaseData;
        iotStatistics.value = data.totalStatistics;
        hourStatistics.value = data.hourStatistics;
        devTypeTotal.value = data.devTypeStatistics;
      } else {
        message.info(result.message || '刷新数据失败');
      }
    }
  };

  let timer: ReturnType<typeof setInterval> | null = null;
  onMounted(async () => {
    getIotTypeTotal();
    getHourStatistics();
    getDevTypeStatistics();
    getNoticeList();
    getLogList();

    timer = setInterval(getUpdateStatistics, 10000);
  });

  // 组件卸载前清理定时器
  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
      timer = null; // 确保timer被设置为null，避免悬挂引用
    }
  });
</script>

<style lang="less" scoped>
  .row-box {
    box-sizing: border-box;
    display: flex;

    .card-icon {
      width: 57px;
      height: 48px;
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 10px;
      box-sizing: border-box;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      float: left;
    }
    .icon-style {
      font-size: 24px;
      margin: 0;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
    .product-icon {
      background-color: #dbf9f7;
    }
    .device-icon {
      background-color: #ffeef8;
    }
    .option-icon {
      background-color: #e5f8ff;
    }
    .message-icon {
      background-color: #fdf0d7;
    }
    .alarm-icon {
      background-color: #ffe8e8;
    }
    .event-icon {
      background-color: #eae8fe;
    }
    .card-info {
      width: 100%;
      height: 48px;
      margin-bottom: 15px;
      padding: 10px 10px 10px 10px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
  }
</style>
