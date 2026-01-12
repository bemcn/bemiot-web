<template>
  <div>
    <n-card :bordered="false" class="mt-3" content-style="padding: 5px 0px !important;">
      <n-form ref="formRef" label-placement="left" :label-width="60" class="py-4">
        <n-grid :cols="32" :x-gap="32">
          <n-gi :span="8">
            <n-form-item label="状态">
              <n-select
                v-model:value="fromStatus"
                :options="statusOptions"
                placeholder="请选择状态"
              />
            </n-form-item>
          </n-gi>
          <n-gi :span="12">
            <n-form-item label="关键字">
              <n-input-group>
                <n-select
                  v-model:value="fromFiled"
                  :options="filedOptions"
                  :style="{ width: '140px' }"
                />
                <n-input
                  maxlength="50"
                  placeholder="请输入关键字"
                  v-model:value="fromKey"
                  clearable
                />
              </n-input-group>
            </n-form-item>
          </n-gi>
          <n-gi :span="4" />
          <n-gi :span="8" style="text-align: right; padding-right: 20px">
            <n-button type="primary" style="margin-right: 12px" @click="handleQuery">
              查询
            </n-button>
            <n-button type="default" @click="handleRest">重置</n-button>
          </n-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card :bordered="false" class="mt-3" content-style="padding: 0px !important;">
      <n-data-table
        :columns="subColumns"
        :data="list"
        :pagination="false"
        :bordered="true"
        :row-key="(row) => row.deviceId"
        :scroll-x="1600"
        striped
        :style="{ height: '420px' }"
        flex-height
      />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { NButton } from 'naive-ui';
  import { subColumns } from '../columns';
  import { getDeviceList, DeviceParams } from '@/api/devices/device';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    id: {
      type: String,
      default: () => '',
    },
  });
  const deviceId: any = ref('');
  const keys = ref<string[]>([]);
  const list = ref<any[]>([]);
  const fromStatus = ref<string | null>(null);
  const statusOptions = ref<any[]>([
    {
      value: '1',
      label: '未激活',
    },
    {
      value: '3',
      label: '启用',
    },
    {
      value: '2',
      label: '禁用',
    },
  ]);
  const fromFiled = ref('name');
  const filedOptions = ref<any[]>([
    {
      label: '设备编号',
      value: 'code',
    },
    {
      label: '设备名称',
      value: 'name',
    },
  ]);
  const fromKey = ref('');

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async () => {
    if (deviceId.value) {
      let params = {} as DeviceParams;
      if (fromStatus.value && fromStatus.value.length > 0) {
        params.status = parseInt(fromStatus.value);
      }
      if (fromKey.value !== '') {
        params.filed = fromFiled.value;
        params.key = fromKey.value;
      }

      const result = (await getDeviceList(params)) as unknown as {
        status: string;
        message: string;
        data: any[];
      };
      if (result.status === 'success') {
        keys.value = result.data.map((item: any) => item.modelId);
        list.value = result.data;
      }
    }
  };

  watch(
    [() => props.id],
    ([newId]) => {
      if (newId && newId.length > 0) {
        deviceId.value = newId;
        loadDataTable();
      }
    },
    { immediate: true }
  );

  // 查询
  const handleQuery = () => {
    loadDataTable();
  };

  const handleRest = () => {
    fromStatus.value = null;
    fromFiled.value = 'name';
    fromKey.value = '';
    loadDataTable();
  };
</script>
