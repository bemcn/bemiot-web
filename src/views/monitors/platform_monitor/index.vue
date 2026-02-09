<template>
  <div class="platform-monitor">
    <div class="mt-2">
      <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <CpuMonitor :info="cpuInfo" :cpu-data="cpuData" />
        </n-grid-item>
        <n-grid-item>
          <MemoryMonitor :info="memoryInfo" :memory-data="memoryData" />
        </n-grid-item>
        <n-grid-item>
          <NetworkMonitor :info="netInfo" :network-data="networkData" />
        </n-grid-item>
        <n-grid-item>
          <DiskMonitor :info="diskInfo" :disk-data="diskData" />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { createClientId } from '@/utils/objectUtil';
  import { getServerInfo } from '@/api/monitors/monitorsServer';
  import {
    CpuData,
    DiskData,
    MemoryData,
    MonitorServer,
    MonitorServerDisk,
    MonitorServerNetwork,
    NetData,
    ServerData,
  } from '@/types/MonitorsModel';
  // @ts-ignore
  import CpuMonitor from './components/CpuMonitor.vue';
  // @ts-ignore
  import MemoryMonitor from './components/MemoryMonitor.vue';
  // @ts-ignore
  import NetworkMonitor from './components/NetworkMonitor.vue';
  // @ts-ignore
  import DiskMonitor from './components/DiskMonitor.vue';

  const loading = ref(true);

  // 初始化数据
  const cpuInfo = ref<CpuData>({
    bit: 0,
    physicalNum: 0,
    logicalNumber: 0,
    vendorFreq: '',
    vendor: '',
    microarchitecture: '',
  });
  const memoryInfo = ref<MemoryData>({
    total: 0,
    number: 0,
    swapTotal: '',
  });
  const diskInfo = ref<DiskData>({
    number: 0,
    diskName: '',
    size: '',
  });
  const netInfo = ref<NetData>({
    number: 0,
    netName: '',
    address: '',
  });
  const cpuData = reactive<MonitorServer>({
    timeData: [],
    usageData: [],
    currentUsage: 0,
  });
  const memoryData = reactive<MonitorServer>({
    timeData: [],
    usageData: [],
    currentUsage: 0,
  });
  const networkData = reactive<MonitorServerNetwork>({
    timeData: [],
    uploadData: [],
    downloadData: [],
    currentUpload: 0,
    currentDownload: 0,
  });
  const diskData = reactive<MonitorServerDisk>({
    timeData: [],
    readData: [],
    writeData: [],
    currentRead: 0,
    currentWrite: 0,
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

      cpuData.timeData.push(nowTime);
      cpuData.usageData.push(0);

      memoryData.timeData.push(nowTime);
      memoryData.usageData.push(0);

      networkData.timeData.push(nowTime);
      networkData.uploadData.push(0);
      networkData.downloadData.push(0);

      diskData.timeData.push(nowTime);
      diskData.readData.push(0);
      diskData.writeData.push(0);
    }
  };
  // 获取CPU、内存、网络、磁盘基础信息
  const loadServerInfo = async () => {
    const result = (await getServerInfo()) as unknown as {
      status: string;
      message: string;
      data: ServerData;
    };
    if (result.status === 'success') {
      cpuInfo.value = result.data.cpu;
      memoryInfo.value = result.data.memory;
      diskInfo.value = result.data.disk;
      netInfo.value = result.data.net;
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
    let url = apiUrl + '/monitorsServer/connect?clientId=' + clientId.value;
    console.log('sse连接地址：', url);
    // 监听连接打开事件
    eventSource = new EventSource(url);
    eventSource.onopen = () => {
      console.log('建立 SSE 连接成功');
    };

    // 监听消息事件
    eventSource.onmessage = (event) => {
      // 收到消息
      const result = JSON.parse(event.data);
      if (result.data) {
        console.log('收到数据：', result.data);

        // 处理数据
        const nowTimeLong = Date.now();
        const nowTime = new Date(nowTimeLong).toLocaleTimeString();
        // 更新CPU数据
        const newCpuData = result.data.cpu;
        cpuData.usageData.shift();
        cpuData.usageData.push(newCpuData);
        cpuData.timeData.shift();
        cpuData.timeData.push(nowTime);
        cpuData.currentUsage = newCpuData;
        // 更新内存数据
        const newMemoryData = result.data.memory;
        memoryData.usageData.shift();
        memoryData.usageData.push(newMemoryData);
        memoryData.timeData.shift();
        memoryData.timeData.push(nowTime);
        memoryData.currentUsage = newMemoryData;
        // 更新网络数据
        const newUploadStr = (result.data.netSend / 8192).toFixed(2);
        const newDownloadStr = (result.data.netRecv / 8192).toFixed(2);
        const newUpload = Number(newUploadStr);
        const newDownload = Number(newDownloadStr);
        networkData.uploadData.shift();
        networkData.downloadData.shift();
        networkData.uploadData.push(newUpload);
        networkData.downloadData.push(newDownload);
        networkData.timeData.shift();
        networkData.timeData.push(nowTime);
        networkData.currentUpload = newUpload;
        networkData.currentDownload = newDownload;
        // 更新磁盘数据
        const newReadDataStr = (result.data.distRead / 8192).toFixed(2);
        const newWriteDataStr = (result.data.distWrite / 8192).toFixed(2);
        const newReadData = Number(newReadDataStr);
        const newWriteData = Number(newWriteDataStr);
        diskData.readData.shift();
        diskData.writeData.shift();
        diskData.readData.push(newReadData);
        diskData.writeData.push(newWriteData);
        diskData.timeData.shift();
        diskData.timeData.push(nowTime);
        diskData.currentRead = newReadData;
        diskData.currentWrite = newWriteData;
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
    loadServerInfo();
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
