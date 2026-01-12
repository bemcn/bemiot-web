<template>
  <div>
    <NRow :gutter="24">
      <NCol :span="24">
        <NCard
          title="最新日志"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <template #header-extra><span class="top-txt">TOP 8</span></template>
          <n-skeleton v-if="loading" size="medium" style="width: 100%; height: 390px" />
          <div v-else ref="gaugeRef" class="flex justify-between px-1 py-1 log-box">
            <div v-if="initData.length === 0" class="empty">
              <n-empty :show-icon="false" :show-description="false">
                <template #extra>
                  <img alt="" src="/src/assets/images/exception/nulldata.svg" />
                  <p class="description">暂无日志记录</p>
                </template>
              </n-empty>
            </div>
            <div v-else class="log-main">
              <n-table :bordered="false" :single-line="false" size="medium">
                <tbody>
                  <tr v-for="(item, index) in initData" :key="index">
                    <td class="item-time">{{ formatDate(item.ts) }}</td>
                    <td class="item-item">{{ item.userName }}</td>
                    <td class="item-item">{{ item.clientIp }}</td>
                    <td class="item-item">{{ item.modelName }}</td>
                    <td>{{ item.description }}</td>
                  </tr>
                </tbody>
              </n-table>
            </div>
          </div>
        </NCard>
      </NCol>
    </NRow>
  </div>
</template>
<script lang="ts" setup>
  import { PropType, watch } from 'vue';
  import { format } from 'date-fns';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: () => true,
    },
    initData: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  };
</script>
<style lang="less" scoped>
  .top-txt {
    color: #cccccc;
    font-size: 12px;
    font-style: italic;
  }
  .log-box {
    width: 100%;
    height: 390px;

    .empty {
      width: 100%;
      height: 390px;
      text-align: center;

      img {
        width: 200px !important;
        height: 200px !important;
      }
      .description {
        color: #c3cbd6;
        font-size: 14px;
      }
    }

    .log-main {
      width: 100%;
      height: 390px;
      overflow: hidden;

      .item-time {
        width: 180px;
      }
      .item-item {
        width: 140px;
      }
    }
  }
</style>
