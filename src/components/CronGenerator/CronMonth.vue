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
          :max="12"
          :disabled="modelValue !== 'custom'"
          size="small"
        />
        <n-text>个月执行一次</n-text>
      </n-space>
      <n-space align="center">
        <n-radio value="specific">具体月份(可多选)</n-radio>
        <n-select
          v-model:value="specificMonths"
          multiple
          :options="monthOptions"
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
          :max="12"
          :disabled="modelValue !== 'range'"
          size="small"
        />
        <n-text>到</n-text>
        <n-input-number
          v-model:value="rangeEnd"
          :min="1"
          :max="12"
          :disabled="modelValue !== 'range'"
          size="small"
        />
        <n-text>月</n-text>
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
  const specificMonths = ref<number[]>([1]);
  const rangeStart = ref(1);
  const rangeEnd = ref(6);
  const monthOptions = [
    { label: '1月', value: 1 },
    { label: '2月', value: 2 },
    { label: '3月', value: 3 },
    { label: '4月', value: 4 },
    { label: '5月', value: 5 },
    { label: '6月', value: 6 },
    { label: '7月', value: 7 },
    { label: '8月', value: 8 },
    { label: '9月', value: 9 },
    { label: '10月', value: 10 },
    { label: '11月', value: 11 },
    { label: '12月', value: 12 },
  ];

  const options = [{ value: '*', label: '每月' }];

  watch(modelValue, updateValue);
  watch([interval, specificMonths, rangeStart, rangeEnd], updateValue);

  function updateValue() {
    let value = props.value;
    switch (modelValue.value) {
      case '*':
        value = '*';
        break;
      case 'custom':
        value = `*/${interval.value}`;
        break;
      case 'specific':
        value = specificMonths.value.join(',');
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
      } else if (val.startsWith('*/')) {
        modelValue.value = 'custom';
        interval.value = parseInt(val.split('/')[1]);
      } else if (val.includes(',')) {
        modelValue.value = 'specific';
        specificMonths.value = val.split(',').map(Number);
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
