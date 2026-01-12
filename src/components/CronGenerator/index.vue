<template>
  <n-card :bordered="false" size="small">
    <n-tabs type="card" animated>
      <n-tab-pane name="second" tab="秒">
        <cron-second v-model:value="second" />
      </n-tab-pane>
      <n-tab-pane name="minute" tab="分钟">
        <cron-minute v-model:value="minute" />
      </n-tab-pane>
      <n-tab-pane name="hour" tab="小时">
        <cron-hour v-model:value="hour" />
      </n-tab-pane>
      <n-tab-pane name="day" tab="日">
        <cron-day v-model:value="day" />
      </n-tab-pane>
      <n-tab-pane name="month" tab="月">
        <cron-month v-model:value="month" />
      </n-tab-pane>
      <n-tab-pane name="week" tab="周">
        <cron-week v-model:value="week" />
      </n-tab-pane>
      <n-tab-pane name="year" tab="年(可选)">
        <cron-year v-model:value="year" />
      </n-tab-pane>
    </n-tabs>

    <n-divider />

    <n-space vertical>
      <n-input-group>
        <n-input v-model:value="cronExpression" readonly />
        <n-button type="primary" @click="copyToClipboard">
          <template #icon>
            <n-icon>
              <CopyOutline />
            </n-icon>
          </template>
          复制
        </n-button>
      </n-input-group>

      <n-text depth="3">下次执行时间: {{ nextTime || '无' }}</n-text>
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { CopyOutline } from '@vicons/ionicons5';
  import {
    NCard,
    NTabs,
    NTabPane,
    NDivider,
    NInput,
    NInputGroup,
    NButton,
    NIcon,
    NSpace,
    NText,
    useMessage,
  } from 'naive-ui';
  // @ts-ignore
  import CronSecond from './CronSecond.vue';
  // @ts-ignore
  import CronMinute from './CronMinute.vue';
  // @ts-ignore
  import CronHour from './CronHour.vue';
  // @ts-ignore
  import CronDay from './CronDay.vue';
  // @ts-ignore
  import CronMonth from './CronMonth.vue';
  // @ts-ignore
  import CronWeek from './CronWeek.vue';
  // @ts-ignore
  import CronYear from './CronYear.vue';
  import { CronExpressionParser } from 'cron-parser';
  import { format } from 'date-fns';

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:value']);

  const message = useMessage();
  const { copy } = useClipboard();

  const second = ref('0');
  const minute = ref('*');
  const hour = ref('*');
  const day = ref('*');
  const month = ref('*');
  const week = ref('?');
  const year = ref('*');

  // 解析传入的cron表达式并设置各字段的初始值
  const parseCronExpression = (expression: string) => {
    if (!expression) return;

    const parts = expression.split(' ');
    if (parts.length >= 6) {
      second.value = parts[0] || '0';
      minute.value = parts[1] || '*';
      hour.value = parts[2] || '*';
      day.value = parts[3] || '*';
      month.value = parts[4] || '*';
      week.value = parts[5] || '?';

      if (parts.length >= 7) {
        year.value = parts[6] || '*';
      }
    }
  };

  // 当传入的value变化时，更新各个字段
  watch(
    () => props.value,
    (newValue) => {
      parseCronExpression(newValue);
    },
    { immediate: true }
  );

  const cronExpression = computed({
    get: () => {
      return `${second.value} ${minute.value} ${hour.value} ${day.value} ${month.value} ${
        week.value
      }${year.value !== '*' ? ' ' + year.value : ''}`;
    },
    set: (value) => {
      emit('update:value', value);
    },
  });

  // 当内部计算的cron表达式发生变化时，通知父组件
  watch(cronExpression, (val) => {
    emit('update:value', val);
  });

  const nextTime = ref('');

  watch(
    cronExpression,
    (val) => {
      console.log('val', val);
      try {
        const interval = CronExpressionParser.parse(val);
        const nextDate = interval.next();
        // 将 CronDate 转换为 JavaScript Date 对象
        const jsDate = new Date(nextDate.getTime());
        nextTime.value = format(jsDate, 'yyyy年MM月dd日 HH点mm分ss秒');
        console.log('nextTime.value', nextTime.value);
      } catch (e) {
        nextTime.value = '';
        console.log('val Error');
      }
    },
    { immediate: true }
  );

  const copyToClipboard = async () => {
    await copy(cronExpression.value);
    message.success('已复制到剪贴板');
  };

  // 暴露 cronExpression 给父组件使用
  defineExpose({
    cronExpression,
  });
</script>
