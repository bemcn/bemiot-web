<template>
  <n-grid cols="1 s:2 m:3 l:3 xl:6 2xl:6" responsive="screen" :x-gap="12" :y-gap="8">
    <n-grid-item>
      <NCard :segmented="{ content: true, footer: true }" size="small" :bordered="false">
        <div class="row-box" @mouseenter="productEnter" @mouseleave="productLeave">
          <div class="card-icon product-icon">
            <n-icon class="icon-style" :color="proEnter ? '#0a9dd3' : '#08bdff'">
              <DropboxOutlined />
            </n-icon>
          </div>
          <div class="card-info">
            <div class="card-info-label">产品数量</div>
            <div class="card-info-value">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <CountTo v-else :startVal="0" :endVal="iotStatistics.productCount" class="text-3xl" />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <n-skeleton v-if="loading" text :repeat="2" />
            <template v-else>
              <div class="text-sn-span">
                <n-icon class="text-sn-icon-enter">
                  <CheckCircleFilled />
                </n-icon>
                <span class="text-sn-label">启用</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="0" :endVal="iotStatistics.productEnableCount"
                /></span>
              </div>
              <div class="text-sn-span text-sn-right">
                <n-icon class="text-sn-icon-alarm">
                  <StopFilled />
                </n-icon>
                <span class="text-sn-label">停用</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="1" :endVal="iotStatistics.productDeactivatedCount"
                /></span>
              </div>
            </template>
          </div>
        </template>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard :segmented="{ content: true, footer: true }" size="small" :bordered="false">
        <div class="row-box" @mouseenter="deviceEnter" @mouseleave="deviceLeave">
          <div class="card-icon device-icon">
            <n-icon class="icon-style" :color="devEnter ? '#f15dce' : '#f385d9'">
              <ContainerFilled />
            </n-icon>
          </div>
          <div class="card-info">
            <div class="card-info-label">设备数量</div>
            <div class="card-info-value">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <CountTo v-else :startVal="1" :endVal="iotStatistics.deviceCount" class="text-3xl" />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <n-skeleton v-if="loading" text :repeat="2" />
            <template v-else>
              <div class="text-sn-span">
                <n-icon class="text-sn-icon-enter">
                  <CheckCircleFilled />
                </n-icon>
                <span class="text-sn-label">在线</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="0" :endVal="iotStatistics.deviceOnlineCount"
                /></span>
              </div>
              <div class="text-sn-span text-sn-right">
                <n-icon class="text-sn-icon-alarm">
                  <StopFilled />
                </n-icon>
                <span class="text-sn-label">离线</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="1" :endVal="iotStatistics.deviceOfflineCount"
                /></span>
              </div>
            </template>
          </div>
        </template>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard :segmented="{ content: true, footer: true }" size="small" :bordered="false">
        <div class="row-box" @mouseenter="optionEnter" @mouseleave="optionLeave">
          <div class="card-icon option-icon">
            <n-icon class="icon-style" :color="optEnter ? '#0baca5' : '#42c9c3'">
              <RocketFilled />
            </n-icon>
          </div>
          <div class="card-info">
            <div class="card-info-label">设备操作</div>
            <div class="card-info-value">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <CountTo v-else :startVal="1" :endVal="iotStatistics.optionCount" class="text-3xl" />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <n-skeleton v-if="loading" text :repeat="2" />
            <template v-else>
              <div class="text-sn-span">
                <n-icon class="text-sn-icon-default">
                  <ChromeFilled />
                </n-icon>
                <span class="text-sn-label">月累计</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="0" :endVal="iotStatistics.optionMonthCount"
                /></span>
              </div>
              <div class="text-sn-span text-sn-right">
                <n-icon class="text-sn-icon-alarm">
                  <CodepenCircleFilled />
                </n-icon>
                <span class="text-sn-label">日累计</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="1" :endVal="iotStatistics.optionDayCount"
                /></span>
              </div>
            </template>
          </div>
        </template>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard :segmented="{ content: true, footer: true }" size="small" :bordered="false">
        <div class="row-box" @mouseenter="messageEnter" @mouseleave="messageLeave">
          <div class="card-icon message-icon">
            <n-icon class="icon-style" :color="msgEnter ? '#f99a02' : '#feaf31'">
              <MessageFilled />
            </n-icon>
          </div>
          <div class="card-info">
            <div class="card-info-label">设备消息</div>
            <div class="card-info-value">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <CountTo v-else :startVal="1" :endVal="iotStatistics.messageCount" class="text-3xl" />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <n-skeleton v-if="loading" text :repeat="2" />
            <template v-else>
              <div class="text-sn-span">
                <n-icon class="text-sn-icon-default">
                  <ChromeFilled />
                </n-icon>
                <span class="text-sn-label">月累计</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="0" :endVal="iotStatistics.messageMonthCount"
                /></span>
              </div>
              <div class="text-sn-span text-sn-right">
                <n-icon class="text-sn-icon-alarm">
                  <CodepenCircleFilled />
                </n-icon>
                <span class="text-sn-label">日累计</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="1" :endVal="iotStatistics.messageDayCount"
                /></span>
              </div>
            </template>
          </div>
        </template>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard :segmented="{ content: true, footer: true }" size="small" :bordered="false">
        <div class="row-box" @mouseenter="alarmEnter" @mouseleave="alarmLeave">
          <div class="card-icon alarm-icon">
            <n-icon class="icon-style" :color="almEnter ? '#f53d3f' : '#f66b6c'">
              <AlertFilled />
            </n-icon>
          </div>
          <div class="card-info">
            <div class="card-info-label">设备告警</div>
            <div class="card-info-value">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <CountTo v-else :startVal="1" :endVal="iotStatistics.alarmCount" class="text-3xl" />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <n-skeleton v-if="loading" text :repeat="2" />
            <template v-else>
              <div class="text-sn-span">
                <n-icon class="text-sn-icon-default">
                  <ChromeFilled />
                </n-icon>
                <span class="text-sn-label">月累计</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="0" :endVal="iotStatistics.alarmMonthCount"
                /></span>
              </div>
              <div class="text-sn-span text-sn-right">
                <n-icon class="text-sn-icon-alarm">
                  <CodepenCircleFilled />
                </n-icon>
                <span class="text-sn-label">日累计</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="1" :endVal="iotStatistics.alarmDayCount"
                /></span>
              </div>
            </template>
          </div>
        </template>
      </NCard>
    </n-grid-item>
    <n-grid-item>
      <NCard :segmented="{ content: true, footer: true }" size="small" :bordered="false">
        <div class="row-box" @mouseenter="eventEnter" @mouseleave="eventLeave">
          <div class="card-icon event-icon">
            <n-icon class="icon-style" :color="evnEnter ? '#7638ec' : '#a076ef'">
              <BoxPlotFilled />
            </n-icon>
          </div>
          <div class="card-info">
            <div class="card-info-label">上报事件</div>
            <div class="card-info-value">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <CountTo v-else :startVal="1" :endVal="iotStatistics.eventCount" class="text-3xl" />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <n-skeleton v-if="loading" text :repeat="2" />
            <template v-else>
              <div class="text-sn-span">
                <n-icon class="text-sn-icon-default">
                  <ChromeFilled />
                </n-icon>
                <span class="text-sn-label">月累计</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="0" :endVal="iotStatistics.eventMonthCount"
                /></span>
              </div>
              <div class="text-sn-span text-sn-right">
                <n-icon class="text-sn-icon-alarm">
                  <CodepenCircleFilled />
                </n-icon>
                <span class="text-sn-label">日累计</span>
                <span class="text-sn-value"
                  ><CountTo :startVal="1" :endVal="iotStatistics.eventDayCount"
                /></span>
              </div>
            </template>
          </div>
        </template>
      </NCard>
    </n-grid-item>
  </n-grid>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { IotStatistics } from '@/types/StatisticsModel';
  import { CountTo } from '@/components/CountTo/index';
  // @ts-ignore
  import {
    DropboxOutlined,
    ContainerFilled,
    RocketFilled,
    MessageFilled,
    AlertFilled,
    BoxPlotFilled,
    CheckCircleFilled,
    StopFilled,
    ChromeFilled,
    CodepenCircleFilled,
  } from '@vicons/antd';

  defineProps({
    loading: {
      type: Boolean,
      default: () => true,
    },
    iotStatistics: {
      type: Object as PropType<IotStatistics>,
      default: () => ({
        productCount: 0,
        productEnableCount: 0,
        productDeactivatedCount: 0,
        deviceCount: 0,
        deviceOnlineCount: 0,
        deviceOfflineCount: 0,
        optionCount: 0,
        optionMonthCount: 0,
        optionDayCount: 0,
        messageCount: 0,
        messageMonthCount: 0,
        messageDayCount: 0,
        alarmCount: 0,
        alarmMonthCount: 0,
        alarmDayCount: 0,
        eventCount: 0,
        eventMonthCount: 0,
        eventDayCount: 0,
      }),
    },
  });

  const productEnter = () => {
    proEnter.value = true;
  };
  const productLeave = () => {
    proEnter.value = false;
  };
  const deviceEnter = () => {
    devEnter.value = true;
  };
  const deviceLeave = () => {
    devEnter.value = false;
  };
  const optionEnter = () => {
    optEnter.value = true;
  };
  const optionLeave = () => {
    optEnter.value = false;
  };
  const messageEnter = () => {
    msgEnter.value = true;
  };
  const messageLeave = () => {
    msgEnter.value = false;
  };
  const alarmEnter = () => {
    almEnter.value = true;
  };
  const alarmLeave = () => {
    almEnter.value = false;
  };
  const eventEnter = () => {
    evnEnter.value = true;
  };
  const eventLeave = () => {
    evnEnter.value = false;
  };

  const proEnter = ref(false);
  const devEnter = ref(false);
  const optEnter = ref(false);
  const msgEnter = ref(false);
  const almEnter = ref(false);
  const evnEnter = ref(false);

  onMounted(() => {});
</script>
<style lang="less" scoped>
  div {
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
  }
  .row-box {
    display: flex;

    .card-icon {
      width: 75px;
      height: 60px;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
    .icon-style {
      font-size: 30px;
      margin: 0;
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
      height: 60px;
      padding: 0px 10px 0px 10px;

      .card-info-label {
        width: 100%;
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        color: #999;
      }
      .card-info-value {
        width: 100%;
        height: 38px;
        line-height: 38px;
      }
    }
  }
  .text-sn-span {
    width: 50%;
    height: 18px;
    text-align: left;

    .text-sn-icon-enter {
      color: #51b465;
      margin-right: 3px;
      padding-top: 2px;
      font-size: 14px;
    }
    .text-sn-icon-alarm {
      color: #ffbb73;
      margin-right: 3px;
      padding-top: 2px;
      font-size: 14px;
    }
    .text-sn-icon-default {
      color: #4285f4;
      margin-right: 3px;
      padding-top: 2px;
      font-size: 14px;
    }
    .text-sn-label {
      color: #999;
      margin-right: 8px;
      font-size: 12px;
    }
    .text-sn-value {
      color: #666;
      font-size: 12px;
    }
  }
  .text-sn-right {
    text-align: right !important;
  }
</style>
