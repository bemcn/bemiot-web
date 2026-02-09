<template>
  <n-radio-group v-model:value="modelValue" name="radiogroup">
    <n-space vertical>
      <n-radio v-for="item in options" :key="item.value" :value="item.value">
        {{ item.label }}
      </n-radio>
      <n-space align="center">
        <n-radio value="custom">每隔</n-radio>
        <n-input-number
          v-model:value="interval"
          :min="1"
          :max="7"
          :disabled="modelValue !== 'custom'"
          size="small"
        />
        <n-text>周执行一次</n-text>
      </n-space>
      <n-space align="center">
        <n-radio value="specific">具体星期(可多选)</n-radio>
        <n-select
          v-model:value="specificWeeks"
          multiple
          :options="weekOptions"
          :disabled="modelValue !== 'specific'"
          style="width: 300px"
          size="small"
        />
      </n-space>
      <n-space align="center">
        <n-radio value="range">周期从</n-radio>
        <n-select
          v-model:value="rangeStart"
          :options="weekOptions"
          :disabled="modelValue !== 'range'"
          style="width: 120px"
          size="small"
        />
        <n-text>到</n-text>
        <n-select
          v-model:value="rangeEnd"
          :options="weekOptions"
          :disabled="modelValue !== 'range'"
          style="width: 120px"
          size="small"
        />
      </n-space>
      <n-space align="center">
        <n-radio value="last">本月最后一个</n-radio>
        <n-select
          v-model:value="lastWeekDay"
          :options="weekOptions"
          :disabled="modelValue !== 'last'"
          style="width: 120px"
          size="small"
        />
      </n-space>
      <n-space align="center">
        <n-radio value="nth">第</n-radio>
        <n-input-number
          v-model:value="nthWeek"
          :min="1"
          :max="5"
          :disabled="modelValue !== 'nth'"
          size="small"
        />
        <n-select
          v-model:value="nthWeekDay"
          :options="weekOptions"
          :disabled="modelValue !== 'nth'"
          style="width: 120px"
          size="small"
        />
      </n-space>
    </n-space>
  </n-radio-group>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';

  const props = defineProps<{
    value: string;
  }>();

  const emit = defineEmits(['update:value']);

  const modelValue = ref('?');
  const interval = ref(1);
  const specificWeeks = ref<number[]>([1]);
  const rangeStart = ref(1);
  const rangeEnd = ref(5);
  const lastWeekDay = ref(1);
  const nthWeek = ref(1);
  const nthWeekDay = ref(1);

  const weekOptions = [
    { label: '星期日', value: 1 },
    { label: '星期一', value: 2 },
    { label: '星期二', value: 3 },
    { label: '星期三', value: 4 },
    { label: '星期四', value: 5 },
    { label: '星期五', value: 6 },
    { label: '星期六', value: 7 },
  ];

  const options = [
    { value: '?', label: '不指定' },
    { value: '*', label: '每周' },
  ];

  watch(modelValue, updateValue);
  watch(
    [interval, specificWeeks, rangeStart, rangeEnd, lastWeekDay, nthWeek, nthWeekDay],
    updateValue
  );

  function updateValue() {
    let value = props.value;
    switch (modelValue.value) {
      case '?':
        value = '?';
        break;
      case '*':
        value = '*';
        break;
      case 'custom':
        value = `${interval.value}#1`; // 使用#表示每周的第几天
        break;
      case 'specific':
        value = specificWeeks.value.join(',');
        break;
      case 'range':
        value = `${rangeStart.value}-${rangeEnd.value}`;
        break;
      case 'last':
        value = `${lastWeekDay.value}L`;
        break;
      case 'nth':
        value = `${nthWeekDay.value}#${nthWeek.value}`;
        break;
    }
    emit('update:value', value);
  }

  // 初始化
  watch(
    () => props.value,
    (val) => {
      if (val === '?') {
        modelValue.value = '?';
      } else if (val === '*') {
        modelValue.value = '*';
      } else if (val.includes('#')) {
        const [day, week] = val.split('#');
        if (week === '1') {
          modelValue.value = 'custom';
          interval.value = parseInt(day);
        } else {
          modelValue.value = 'nth';
          nthWeekDay.value = parseInt(day);
          nthWeek.value = parseInt(week);
        }
      } else if (val.includes(',')) {
        modelValue.value = 'specific';
        specificWeeks.value = val.split(',').map(Number);
      } else if (val.includes('-')) {
        modelValue.value = 'range';
        const [start, end] = val.split('-').map(Number);
        rangeStart.value = start;
        rangeEnd.value = end;
      } else if (val.endsWith('L')) {
        modelValue.value = 'last';
        lastWeekDay.value = parseInt(val.replace('L', ''));
      }
    },
    { immediate: true }
  );
</script>
