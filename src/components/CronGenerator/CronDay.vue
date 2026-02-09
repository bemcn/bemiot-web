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
          :max="31"
          :disabled="modelValue !== 'custom'"
          size="small"
        />
        <n-text>天执行一次</n-text>
      </n-space>
      <n-space align="center">
        <n-radio value="specific">具体天数(可多选)</n-radio>
        <n-select
          v-model:value="specificDays"
          multiple
          :options="dayOptions"
          :disabled="modelValue !== 'specific'"
          style="width: 300px"
          size="small"
        />
      </n-space>
      <n-space align="center">
        <n-radio value="range">周期从</n-radio>
        <n-input-number
          v-model:value="rangeStart"
          :min="1"
          :max="31"
          :disabled="modelValue !== 'range'"
          size="small"
        />
        <n-text>到</n-text>
        <n-input-number
          v-model:value="rangeEnd"
          :min="1"
          :max="31"
          :disabled="modelValue !== 'range'"
          size="small"
        />
        <n-text>日</n-text>
      </n-space>
      <n-space align="center">
        <n-radio value="last">每月最后一天</n-radio>
      </n-space>
      <n-space align="center">
        <n-radio value="workday">每月最后一个工作日</n-radio>
      </n-space>
      <n-space align="center">
        <n-radio value="nearest">每月最近的工作日</n-radio>
        <n-input-number
          v-model:value="nearestDay"
          :min="1"
          :max="31"
          :disabled="modelValue !== 'nearest'"
          size="small"
        />
        <n-text>日</n-text>
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

  const modelValue = ref('*');
  const interval = ref(1);
  const specificDays = ref<number[]>([1]);
  const rangeStart = ref(1);
  const rangeEnd = ref(10);
  const nearestDay = ref(15);
  const dayOptions = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}日`, value: i + 1 }));

  const options = [
    { value: '*', label: '每天' },
    { value: '?', label: '不指定' },
  ];

  watch(modelValue, updateValue);
  watch([interval, specificDays, rangeStart, rangeEnd, nearestDay], updateValue);

  function updateValue() {
    let value = props.value;
    switch (modelValue.value) {
      case '*':
        value = '*';
        break;
      case '?':
        value = '?';
        break;
      case 'custom':
        value = `*/${interval.value}`;
        break;
      case 'specific':
        value = specificDays.value.join(',');
        break;
      case 'range':
        value = `${rangeStart.value}-${rangeEnd.value}`;
        break;
      case 'last':
        value = 'L';
        break;
      case 'workday':
        value = 'LW';
        break;
      case 'nearest':
        value = `${nearestDay.value}W`;
        break;
    }
    emit('update:value', value);
  }

  // 初始化
  watch(
    () => props.value,
    (val) => {
      if (val === '*') {
        modelValue.value = '*';
      } else if (val === '?') {
        modelValue.value = '?';
      } else if (val.startsWith('*/')) {
        modelValue.value = 'custom';
        interval.value = parseInt(val.split('/')[1]);
      } else if (val.includes(',')) {
        modelValue.value = 'specific';
        specificDays.value = val.split(',').map(Number);
      } else if (val.includes('-')) {
        modelValue.value = 'range';
        const [start, end] = val.split('-').map(Number);
        rangeStart.value = start;
        rangeEnd.value = end;
      } else if (val === 'L') {
        modelValue.value = 'last';
      } else if (val === 'LW') {
        modelValue.value = 'workday';
      } else if (val.endsWith('W')) {
        modelValue.value = 'nearest';
        nearestDay.value = parseInt(val.replace('W', ''));
      }
    },
    { immediate: true }
  );
</script>
