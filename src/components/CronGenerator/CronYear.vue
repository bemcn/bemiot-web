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
          :max="10"
          :disabled="modelValue !== 'custom'"
          size="small"
        />
        <n-text>年执行一次</n-text>
      </n-space>
      <n-space align="center">
        <n-radio value="specific">具体年份(可多选)</n-radio>
        <n-select
          v-model:value="specificYears"
          multiple
          :options="yearOptions"
          :disabled="modelValue !== 'specific'"
          style="width: 300px"
          size="small"
        />
      </n-space>
      <n-space align="center">
        <n-radio value="range">周期从</n-radio>
        <n-input-number
          v-model:value="rangeStart"
          :min="currentYear"
          :max="currentYear + 20"
          :disabled="modelValue !== 'range'"
          size="small"
        />
        <n-text>到</n-text>
        <n-input-number
          v-model:value="rangeEnd"
          :min="currentYear"
          :max="currentYear + 20"
          :disabled="modelValue !== 'range'"
          size="small"
        />
        <n-text>年</n-text>
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

  const currentYear = new Date().getFullYear();
  const modelValue = ref('*');
  const interval = ref(2);
  const specificYears = ref<number[]>([currentYear]);
  const rangeStart = ref(currentYear);
  const rangeEnd = ref(currentYear + 5);
  const yearOptions = Array.from({ length: 21 }, (_, i) => ({
    label: `${currentYear + i}年`,
    value: currentYear + i,
  }));

  const options = [
    { value: '*', label: '每年' },
    { value: '?', label: '不指定' },
  ];

  watch(modelValue, updateValue);
  watch([interval, specificYears, rangeStart, rangeEnd], updateValue);

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
        value = specificYears.value.join(',');
        break;
      case 'range':
        value = `${rangeStart.value}-${rangeEnd.value}`;
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
        specificYears.value = val.split(',').map(Number);
      } else if (val.includes('-')) {
        modelValue.value = 'range';
        const [start, end] = val.split('-').map(Number);
        rangeStart.value = start;
        rangeEnd.value = end;
      }
    },
    { immediate: true }
  );
</script>
