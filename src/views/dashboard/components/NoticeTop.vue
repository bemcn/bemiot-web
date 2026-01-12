<template>
  <div>
    <NRow :gutter="24">
      <NCol :span="24">
        <NCard
          title="最新通知公告"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <template #header-extra><a href="#" class="more-link">更多 >></a></template>
          <n-skeleton v-if="loading" size="medium" style="width: 100%; height: 400px" />
          <div v-else class="flex justify-between px-1 py-1 notice-box">
            <div v-if="initData.length === 0" class="empty">
              <n-empty :show-icon="false" :show-description="false">
                <template #extra>
                  <img alt="" src="/src/assets/images/exception/nulldata.svg" />
                  <p class="description">暂无通知公告发布</p>
                </template>
              </n-empty>
            </div>
            <div v-else class="notice">
              <div class="notice-item" v-for="(item, index) in initData" :key="index">
                <div class="item-tag">
                  <n-tag
                    size="small"
                    :bordered="false"
                    :color="{ color: '#2d8cf0', borderColor: '#08bdff', textColor: '#ffffff' }"
                    >{{ item.noticeType === 1 ? '通知' : '公告' }}</n-tag
                  >
                </div>
                <div class="item-time">{{ formatDate(item.createTime) }}</div>
                <a href="#" class="item-label">{{ item.noticeTitle }}</a>
              </div>
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

  //dateString:日期字符串，格式为2025-09-28 17:37:15.943
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd');
  };
</script>
<style lang="less" scoped>
  .more-link {
    color: #2d8cf0;
    font-size: 12px;
  }
  .notice-box {
    width: 100%;
    height: 400px;

    .empty {
      width: 100%;
      height: 400px;
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

    .notice {
      width: 100%;
      height: 390px;
      overflow: hidden;

      .notice-item {
        width: 100%;
        height: 39px;
        position: relative;

        .item-tag {
          width: 32px;
          height: 39px;
          padding-top: 8px;
          float: left;
        }
        .item-time {
          width: 78px;
          height: 39px;
          line-height: 38px;
          font-size: 12px;
          color: #cccccc;
          text-align: right;
          float: right;
        }
        .item-label {
          width: 100%;
          height: 39px;
          line-height: 38px;
          padding-left: 48px;
          padding-right: 78px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          position: absolute;
        }
      }
    }
  }
</style>
