<template>
  <div class="data-monitor">
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="数据库存储监控">
        实时监控系统数据库存储情况，包括PostgreSQL和TDengine的操作统计和存储统计等关键指标。
      </n-card>
    </div>

    <div class="mt-4">
      <!-- PostgreSQL操作统计 - 占据整行 -->
      <n-grid cols="1" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <PostgreSQLOperationChart />
        </n-grid-item>
      </n-grid>

      <!-- TDengine操作统计 - 占据整行 -->
      <n-grid cols="1" responsive="screen" :x-gap="16" :y-gap="16" class="mt-4">
        <n-grid-item>
          <TDengineOperationChart />
        </n-grid-item>
      </n-grid>

      <!-- 存储统计 - 三等分 -->
      <n-grid
        cols="1 s:1 m:3 l:3 xl:3 2xl:3"
        responsive="screen"
        :x-gap="16"
        :y-gap="16"
        class="mt-4"
      >
        <n-grid-item>
          <DataStoragePie />
        </n-grid-item>
        <n-grid-item>
          <PostgreSQLStoragePie />
        </n-grid-item>
        <n-grid-item>
          <TDengineStoragePie />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import PostgreSQLOperationChart from './components/PostgreSQLOperationChart.vue';
  import TDengineOperationChart from './components/TDengineOperationChart.vue';
  import DataStoragePie from './components/DataStoragePie.vue';
  import PostgreSQLStoragePie from './components/PostgreSQLStoragePie.vue';
  import TDengineStoragePie from './components/TDengineStoragePie.vue';

  const loading = ref(true);

  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
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
  .data-monitor {
    .n-card {
      border-radius: 4px;
    }
  }
</style>
