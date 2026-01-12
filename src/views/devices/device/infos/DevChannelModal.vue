<template>
  <div>
    <n-card :bordered="false" class="mt-3" content-style="padding: 5px 0px !important;">
      <n-form ref="formRef" label-placement="left" :label-width="60">
        <n-grid :cols="20" :x-gap="20">
          <n-gi :span="8">
            <n-form-item label="关键字">
              <n-input
                maxlength="50"
                placeholder="请输入关键字"
                v-model:value="fromKey"
                clearable
              />
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
        :columns="columns"
        :data="list"
        :pagination="false"
        :bordered="true"
        :row-key="(row) => row.channelId"
        striped
        :style="{ height: '407px' }"
        flex-height
        :scroll-x="1500"
      />
    </n-card>
  </div>

  <ViewVideoModal
    :showModel="showViewModal"
    :params="data"
    @close="() => (showViewModal = false)"
  />
</template>

<script lang="ts" setup>
  import { computed, h, ref, watch } from 'vue';
  import { NButton } from 'naive-ui';
  import { getDeviceChannelList, DeviceChannelParams } from '@/api/video/deviceChannel';
  import { channelColumns } from '../columns';
  // @ts-ignore
  import ViewVideoModal from './ViewVideoModal.vue';

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
  const fromKey = ref('');
  const keys = ref<string[]>([]);
  const list = ref<any[]>([]);
  const columns = computed(() => [
    ...channelColumns,
    {
      title: '预览',
      key: 'option',
      align: 'center',
      titleAlign: 'center',
      width: 120,
      fixed: 'right',
      // 为操作列添加事件处理器
      render: (row) => {
        return h(
          'div',
          h(
            NButton,
            {
              type: 'default',
              size: 'small',
              onClick: () => handlePlayer(row),
            },
            { default: () => '预览' }
          )
        );
      },
    },
  ]);
  const showViewModal = ref(false);
  const data = ref<any>({});

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async () => {
    if (deviceId.value) {
      let params = {} as DeviceChannelParams;
      params.deviceId = deviceId.value;
      params.key = fromKey.value;

      const result = (await getDeviceChannelList(params)) as unknown as {
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
    fromKey.value = '';
    loadDataTable();
  };

  // 预览
  const handlePlayer = (row: any) => {
    data.value = {
      channelId: row.channelId,
      channelName: row.channelName,
      deviceId: row.device.deviceId,
      smtpUrl: row.smtpUrl,
    };
    showViewModal.value = true;
  };
</script>
