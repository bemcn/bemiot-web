<template>
  <div class="run-monitor">
    <div class="mt-2">
      <!-- 饼图统计 -->
      <n-grid cols="1 m:3 l:3 xl:4 2xl:4" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="drive in deviceMonitor" :key="drive.driveCode">
          <ItemMonitor :data="drive" />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { createClientId } from '@/utils/objectUtil';
  import { Drive } from '@/types/BaseModel';
  import { getDriveList, DriveParams } from '@/api/base/drives';
  import { MonitorDataDrive } from '@/types/MonitorsModel';
  // @ts-ignore
  import ItemMonitor from './ItemMonitor.vue';

  const deviceMonitor = ref<MonitorDataDrive[]>([]);

  // 初始化图表数据
  const initChartData = async () => {
    let params = {} as DriveParams;
    const result = (await getDriveList(params)) as unknown as {
      status: string;
      message: string;
      data: Drive[];
    };
    if (result.status === 'success') {
      const list = result.data;

      // 获取30秒前的时间戳
      const startTime = Date.now() - 30 * 1000;
      let timeData: string[] = [];
      let usageData1: number[] = [];
      let usageData2: number[] = [];
      // 5秒一次，取6次
      for (let i = 0; i < 6; i++) {
        const nowTimeLong = startTime + i * 5 * 1000;
        const nowTime = new Date(nowTimeLong).toLocaleTimeString();

        timeData.push(nowTime);
        usageData1.push(0);
        usageData2.push(0);
      }

      list.forEach((drive) => {
        const driveCode = drive.driveCode;
        const driveName = drive.driveName;

        const item = {
          driveCode,
          driveName,
          timeData,
          usageData1,
          usageData2,
        };
        deviceMonitor.value.push(item);
      });
    }
  };

  // SSE 参数
  let retryCount = 0;
  const maxRetries = 5; // 最大重试次数
  const maxRetryDelay = 30000; // 最大重连时间，30秒
  const clientId = ref(''); // 客户端ID
  let reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null; // 重连定时器ID

  // 初始化 SSE 连接
  const { apiUrl } = useGlobSetting();
  let eventSource: EventSource | null = null;
  const initializeSSE = () => {
    // 如果已经存在连接，先关闭它
    if (eventSource) {
      //console.log('关闭已存在的sse连接：', eventSource);
      closeEventSource();
    }

    // 清除之前的重连定时器
    if (reconnectTimeoutId) {
      clearTimeout(reconnectTimeoutId);
      reconnectTimeoutId = null;
    }

    // 生成 clientId, clientId 等于 当前时间戳 + 6位随机数
    clientId.value = createClientId();
    // 定义SSE链接参数
    let url = apiUrl + '/monitorsDriveRun/connect?clientId=' + clientId.value;
    //console.log('sse连接地址：', url);
    // 监听连接打开事件
    eventSource = new EventSource(url);
    eventSource.onopen = () => {
      //console.log('建立 SSE 连接成功');
    };

    // 监听消息事件
    eventSource.onmessage = (event) => {
      //console.log('收到消息：', event.data);
      // 收到消息
      const result = JSON.parse(event.data);
      if (result.data) {
        //console.log('收到数据：', result.data);
        const driveList: any[] | null = result.data;
        if (driveList) {
          const nowTimeLong = Date.now();
          const nowTime = new Date(nowTimeLong).toLocaleTimeString();

          for (let i = 0; i < driveList.length; i++) {
            const drive = driveList[i];
            const driveCode = drive.driveCode;
            const sendNumber = drive.sendNumber;
            const receiveNumber = drive.receiveNumber;

            for (let ii = 0; ii < deviceMonitor.value.length; ii++) {
              const item = deviceMonitor.value[ii];
              if (item.driveCode === driveCode) {
                item.usageData1.shift();
                item.usageData1.push(receiveNumber);
                item.usageData2.shift();
                item.usageData2.push(sendNumber);
                item.timeData.shift();
                item.timeData.push(nowTime);
                deviceMonitor.value[ii] = item;
              }
            }
          }
        }
      }
    };

    // 监听错误事件
    eventSource.onerror = () => {
      console.error('SSE 连接发生错误，尝试重连...');
      if (eventSource) {
        eventSource.close(); // 关闭当前连接
        handleReconnect(); // 尝试重连
      }
    };
  };

  const handleReconnect = () => {
    if (clientId.value !== '') {
      if (retryCount < maxRetries) {
        retryCount++;
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), maxRetryDelay); // 计算重连延迟
        reconnectTimeoutId = setTimeout(initializeSSE, retryDelay);
      } else {
        console.error('网络连接不稳定，请检查网络或刷新页面');
      }
    }
  };

  const closeEventSource = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    retryCount = 0;

    // 清除重连定时器
    if (reconnectTimeoutId) {
      clearTimeout(reconnectTimeoutId);
      reconnectTimeoutId = null;
    }
  };

  const loading = ref(true);
  onMounted(() => {
    loading.value = false;
    initChartData();
    initializeSSE();
  });

  // 组件卸载前清理定时器
  onBeforeUnmount(() => {
    closeEventSource();
  });
</script>

<style lang="less" scoped>
  .run-monitor {
    .n-card {
      border-radius: 4px;
    }
  }
</style>
