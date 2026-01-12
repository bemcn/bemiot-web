<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 1260px"
    title="绑定资产关系"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
      style="padding-right: 30px !important"
    >
      <n-form-item label="用户账号" path="userName">
        <n-input v-model:value="localParams.userName" disabled />
      </n-form-item>
      <n-form-item label="绑定设备">
        <div class="table-box">
          <div class="query-line">
            <div class="query-input">
              <n-input-group>
                <n-select
                  :style="{ width: '50%' }"
                  v-model:value="queryFiled"
                  :options="selectOptions"
                />
                <n-input
                  maxlength="30"
                  v-model:value="queryKey"
                  type="text"
                  placeholder="请输入关键字"
                  clearable
                />
              </n-input-group>
            </div>
            <div class="query-button">
              <n-button style="width: 100%">查询</n-button>
            </div>
            <div class="query-button">
              <n-button style="width: 100%">重置</n-button>
            </div>
          </div>
          <div class="table-content">
            <n-data-table
              :columns="columnDev"
              :data="deviceList"
              :row-key="(row) => row.deviceId"
              @update:checked-row-keys="onCheckedRow"
            />
          </div>
        </div>
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { bindUserArray } from '@/api/devices/device';
  import { columnDev } from './columns';
  import { getDeviceNoAssetList } from '@/api/devices/device';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const selectOptions = ref([
    {
      label: '设备编号',
      value: 'code',
    },
    {
      label: '设备名称',
      value: 'name',
    },
  ]);
  const queryFiled = ref('name');
  const queryKey = ref('');
  const deviceList = ref<any[]>([]);
  const checkRow: any = ref(null);

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], async ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
    if (newShowModel && newShowModel === true) {
      deviceList.value = await loadDataTable();
    }
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async () => {
    let params: { filed?: string; key?: string } = {};
    if (queryFiled.value !== '' && queryKey.value !== '') {
      params.filed = queryFiled.value;
      params.key = queryKey.value;
    }

    const result = (await getDeviceNoAssetList(params)) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [];
    }
  };

  // 批量选择
  const onCheckedRow = (rowKeys: any) => {
    checkRow.value = rowKeys;
  };

  // 提交表单
  const confirmForm = async () => {
    const ids = checkRow.value.join(',');

    const params = {
      ids,
      userId: localParams.value.userId,
    };

    const result = (await bindUserArray(params)) as unknown as {
      status: string;
      message: string;
    };

    if (result.status === 'success') {
      window['$message'].success('绑定成功');
      deviceList.value = await loadDataTable();
      setTimeout(() => {
        showState.value = false;
        emit('submit');
      });
    } else {
      window['$message'].error(result.message);
    }
  };

  onMounted(async () => {
  });
</script>

<style lang="less" scoped>
  .table-box {
    width: 100%;
    position: relative;
    .query-line {
      width: 100%;
      height: 44px;
      .query-input {
        width: 300px;
        height: 34px;
        margin-right: 10px;
        float: left;
      }
      .query-button {
        width: 80px;
        height: 34px;
        margin-right: 10px;
        float: left;
      }
    }
    .table-content {
      width: 100%;
    }
  }
</style>
