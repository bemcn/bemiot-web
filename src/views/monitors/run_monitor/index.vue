<template>
  <div class="run-monitor">
<<<<<<< HEAD
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
  import { Drive } from '@/types/BaseModel';
  import { getDriveList, DriveParams } from '@/api/base/drives';
  import { MonitorDataDrive } from '@/types/MonitorsModel';
  // @ts-ignore
  import ItemMonitor from './ItemMonitor.vue';

  const deviceMonitor = ref<MonitorDataDrive[]>([]);

  /**
   * 获取驱动数据
   */
  const loadDriveList = async () => {
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
      let usageData: number[] = [];
      // 5秒一次，取6次
      for (let i = 0; i < 6; i++) {
        const nowTimeLong = startTime + i * 5 * 1000;
        const nowTime = new Date(nowTimeLong).toLocaleTimeString();

        timeData.push(nowTime);
        usageData.push(0);
      }

      list.forEach((drive) => {
        const driveCode = drive.driveCode;
        const driveName = drive.driveName;

        const item = {
          driveCode,
          driveName,
          timeData,
          usageData,
        };
        deviceMonitor.value.push(item);
      });
      console.log(deviceMonitor.value);
    }
  };

  const loading = ref(true);

  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    loadDriveList();

    loading.value = false;

    // 模拟定时更新数据
    timer = setInterval(() => {
      // 这里可以添加更新所有监控组件数据的逻辑
    }, 5000);
  });

  // 组件卸载前清理定时器
  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });
</script>

<style lang="less" scoped>
  .run-monitor {
    .n-card {
      border-radius: 4px;
    }
  }
</style>
