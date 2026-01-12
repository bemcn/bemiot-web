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
          :max="23"
          :disabled="modelValue !== 'custom'"
          size="small"
        />
        <n-text>小时执行一次</n-text>
      </n-space>
      <n-space align="center">
        <n-radio value="specific">具体小时(可多选)</n-radio>
        <n-select
          v-model:value="specificHours"
          multiple
          :options="hourOptions"
          :disabled="modelValue !== 'specific'"
          style="width: 300px"
          size="small"
        />
      </n-space>
      <n-space align="center">
        <n-radio value="range">周期从</n-radio>
        <n-input-number
          v-model:value="rangeStart"
          :min="0"
          :max="23"
          :disabled="modelValue !== 'range'"
          size="small"
        />
        <n-text>到</n-text>
        <n-input-number
          v-model:value="rangeEnd"
          :min="0"
          :max="23"
          :disabled="modelValue !== 'range'"
          size="small"
        />
        <n-text>点</n-text>
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
  const interval = ref(2);
  const specificHours = ref<number[]>([0]);
  const rangeStart = ref(8);
  const rangeEnd = ref(18);
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({ label: `${i}时`, value: i }));

  const options = [
    { value: '*', label: '每小时' },
    { value: '0', label: '每天的0点' },
  ];

  watch(modelValue, updateValue);
  watch([interval, specificHours, rangeStart, rangeEnd], updateValue);

  function updateValue() {
    let value = props.value;
    switch (modelValue.value) {
      case '*':
        value = '*';
        break;
      case '0':
        value = '0';
        break;
      case 'custom':
        value = `*/${interval.value}`;
        break;
      case 'specific':
        value = specificHours.value.join(',');
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
      } else if (val === '0') {
        modelValue.value = '0';
      } else if (val.startsWith('*/')) {
        modelValue.value = 'custom';
        interval.value = parseInt(val.split('/')[1]);
      } else if (val.includes(',')) {
        modelValue.value = 'specific';
        specificHours.value = val.split(',').map(Number);
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
