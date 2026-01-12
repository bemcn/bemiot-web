<template>
  <div class="platform-monitor">
    <div class="mt-2">
      <n-grid cols="8" item-responsive :x-gap="16" :y-gap="16">
        <n-grid-item span="8 600:2 800:2">
          <CacheDataInfo :data="cacheInfo" />
        </n-grid-item>
        <n-grid-item span="8 600:3 800:3">
          <UsedLinks :data="usedLinksData" />
        </n-grid-item>
        <n-grid-item span="8 600:3 800:3">
          <UsedMemory :data="usedMemoryData" />
        </n-grid-item>
      </n-grid>
      <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <UsedCpu :data="usedCpuData" />
        </n-grid-item>
        <n-grid-item>
          <UsedQps :data="usedQpsData" />
        </n-grid-item>
        <n-grid-item>
          <UsedBytes :data="usedBytesData" />
        </n-grid-item>
        <n-grid-item>
          <UsedKeys :data="usedKeysData" />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { createClientId } from '@/utils/objectUtil';
  import { getCacheInfo } from '@/api/monitors/monitorsCache';
  import { MonitorDataOne, MonitorDataTwo } from '@/types/MonitorsModel';
  // @ts-ignore
  import CacheDataInfo from './components/CacheDataInfo.vue';
  // @ts-ignore
  import UsedLinks from './components/UsedLinks.vue';
  // @ts-ignore
  import UsedMemory from './components/UsedMemory.vue';
  // @ts-ignore
  import UsedCpu from './components/UsedCpu.vue';
  // @ts-ignore
  import UsedQps from './components/UsedQps.vue';
  // @ts-ignore
  import UsedBytes from './components/UsedBytes.vue';
  // @ts-ignore
  import UsedKeys from './components/UsedKeys.vue';

  const loading = ref(true);

  // 初始化数据
  const cacheInfo = ref<any>({
    version: '',
    pid: '',
    port: '',
    runDays: '',
    model: '',
    memory: 0,
  });

  const usedLinksData = reactive<MonitorDataOne>({
    timeData: [],
    usageData: [],
  });
  const usedMemoryData = reactive<MonitorDataOne>({
    timeData: [],
    usageData: [],
  });
  const usedCpuData = reactive<MonitorDataTwo>({
    timeData: [],
    usageData1: [],
    usageData2: [],
  });
  const usedQpsData = reactive<MonitorDataOne>({
    timeData: [],
    usageData: [],
  });
  const usedBytesData = reactive<MonitorDataTwo>({
    timeData: [],
    usageData1: [],
    usageData2: [],
  });
  const usedKeysData = reactive<MonitorDataTwo>({
    timeData: [],
    usageData1: [],
    usageData2: [],
  });

  let timer: ReturnType<typeof setInterval> | null = null;

  // 初始化图表数据
  const initChartData = () => {
    // 获取60秒前的时间戳
    const startTime = Date.now() - 60 * 1000;
    // 初始化CPU数据
    for (let i = 0; i < 60; i++) {
      const nowTimeLong = startTime + i * 1000;
      const nowTime = new Date(nowTimeLong).toLocaleTimeString();

      usedLinksData.timeData.push(nowTime);
      usedLinksData.usageData.push(0);

      usedMemoryData.timeData.push(nowTime);
      usedMemoryData.usageData.push(0);

      usedCpuData.timeData.push(nowTime);
      usedCpuData.usageData1.push(0);
      usedCpuData.usageData2.push(0);

      usedQpsData.timeData.push(nowTime);
      usedQpsData.usageData.push(0);

      usedBytesData.timeData.push(nowTime);
      usedBytesData.usageData1.push(0);
      usedBytesData.usageData2.push(0);

      usedKeysData.timeData.push(nowTime);
      usedKeysData.usageData1.push(0);
      usedKeysData.usageData2.push(0);
    }
  };
  // 获取缓存信息
  const loadCacheInfo = async () => {
    const result = (await getCacheInfo()) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      cacheInfo.value = result.data;
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
      console.log('关闭已存在的sse连接：', eventSource);
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
    let url = apiUrl + '/monitorsCache/connect?clientId=' + clientId.value;
    console.log('sse连接地址：', url);
    // 监听连接打开事件
    eventSource = new EventSource(url);
    eventSource.onopen = () => {
      console.log('建立 SSE 连接成功');
    };

    // 监听消息事件
    eventSource.onmessage = (event) => {
      console.log('收到消息：', event.data);
      // 收到消息
      const result = JSON.parse(event.data);
      if (result.data) {
        console.log('收到数据：', result.data);

        // 处理数据
        const nowTimeLong = Date.now();
        const nowTime = new Date(nowTimeLong).toLocaleTimeString();
        // 更新客户端连接数据
        const connects = result.data.connects;
        usedLinksData.usageData.shift();
        usedLinksData.usageData.push(connects);
        usedLinksData.timeData.shift();
        usedLinksData.timeData.push(nowTime);
        // 更新内存使用数据
        const usedMemory = result.data.usedMemory;
        usedMemoryData.usageData.shift();
        usedMemoryData.usageData.push(usedMemory);
        usedMemoryData.timeData.shift();
        usedMemoryData.timeData.push(nowTime);
        // 更新CPU消耗数据
        const usedSysCpu = result.data.usedSysCpu;
        const usedUserCpu = result.data.usedUserCpu;
        usedCpuData.usageData1.shift();
        usedCpuData.usageData2.shift();
        usedCpuData.usageData1.push(usedSysCpu);
        usedCpuData.usageData2.push(usedUserCpu);
        usedCpuData.timeData.shift();
        usedCpuData.timeData.push(nowTime);
        // 更新QPS命令数据
        const qpsSec = result.data.qpsSec;
        usedQpsData.usageData.shift();
        usedQpsData.usageData.push(qpsSec);
        usedQpsData.timeData.shift();
        usedQpsData.timeData.push(nowTime);
        // 更新网络流量数据
        const inputBytes = Number(result.data.inputBytes);
        const outputBytes = Number(result.data.outputBytes);
        usedBytesData.usageData1.shift();
        usedBytesData.usageData2.shift();
        usedBytesData.usageData1.push(inputBytes);
        usedBytesData.usageData2.push(outputBytes);
        usedBytesData.timeData.shift();
        usedBytesData.timeData.push(nowTime);
        // 更新命中数据
        const keyHits = Number(result.data.keyHits);
        const keyMisses = Number(result.data.keyMisses);
        usedKeysData.usageData1.shift();
        usedKeysData.usageData2.shift();
        usedKeysData.usageData1.push(keyHits);
        usedKeysData.usageData2.push(keyMisses);
        usedKeysData.timeData.shift();
        usedKeysData.timeData.push(nowTime);
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

  onMounted(() => {
    loading.value = false;
    loadCacheInfo();
    initChartData();
    initializeSSE();
  });

  // 组件卸载前清理定时器
  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    closeEventSource();
  });
</script>

<style lang="less" scoped>
  .platform-monitor {
    .n-card {
      border-radius: 4px;
    }
  }
</style>
