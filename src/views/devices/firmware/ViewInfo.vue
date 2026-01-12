<template>
  <!-- 查看 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 1100px"
    title="查看"
    @after-leave="closeModalAfter"
  >
    <div class="info-box">
      <div class="title-line">固件信息</div>
      <div class="params-line">
        <n-grid x-gap="12" y-gap="12" :cols="3">
          <n-grid-item>
            <div class="cell-param">
              <div class="cell-label">固件名称：</div>
              <div class="cell-value">{{ localParams.firmwareName }}</div>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="cell-param">
              <div class="cell-label">版本号：</div>
              <div class="cell-value">{{ localParams.version }}</div>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="cell-param">
              <div class="cell-label">更新方式：</div>
              <div class="cell-value">{{
                localParams.installType === 1 ? 'http' : '分包拉取'
              }}</div>
            </div>
          </n-grid-item>
          <n-grid-item :span="3">
            <div class="cell-param">
              <div class="cell-label">描述：</div>
              <div class="cell-value">{{ localParams.remark }}</div>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
    <div class="info-box">
      <div class="title-line">设备固件升级统计</div>
      <n-row>
        <n-col :span="6">
          <n-statistic label="设备升级总数">
            <template #default>
              <span style="color: #2080f0">{{ totalData.total }}</span>
            </template>
          </n-statistic>
        </n-col>
        <n-col :span="6">
          <n-statistic label="升级成功数量">
            <span style="color: #18a058">{{ totalData.succeed }}</span>
          </n-statistic>
        </n-col>
        <n-col :span="6">
          <n-statistic label="正在升级数量">
            <span style="color: #f0a020">{{ totalData.update }}</span>
          </n-statistic>
        </n-col>
        <n-col :span="6">
          <n-statistic label="升级失败数量">
            <span style="color: #d03050">{{ totalData.fail }}</span>
          </n-statistic>
        </n-col>
      </n-row>
    </div>
    <div class="info-box">
      <div class="title-line">升级任务管理</div>
      <n-row style="padding-bottom: 15px">
        <n-col :span="12">
          <n-button @click="handleAdd">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新增升级任务
          </n-button>
        </n-col>
        <n-col :span="12">
          <div style="float: right">
            <n-button type="default" @click="handleRest">重置</n-button>
          </div>
          <div style="float: right">
            <n-button style="margin-right: 10px" type="info" @click="handleQuery">查询</n-button>
          </div>
          <div style="width: 180px; margin-right: 10px; float: right">
            <n-input
              maxlength="30"
              placeholder="请输入任务名称"
              v-model:value="queryKey"
              clearable
            />
          </div>
        </n-col>
      </n-row>
      <n-row>
        <n-col :span="24">
          <BasicTable
            :columns="taskColumns"
            :request="loadList"
            :row-key="(row) => row.taskId"
            ref="actionRef"
            :actionColumn="actionColumn"
            :scroll-x="1000"
            :striped="true"
            :headShow="false"
          >
            <template #toolbar> </template>
          </BasicTable>
        </n-col>
      </n-row>
    </div>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">关闭</n-button>
      </n-space>
    </template>

    <AddTask
      :showTaskModel="addTaskModal"
      :params="viewLogs"
      @task-close="() => (addTaskModal = false)"
      @task-submit="reloadTable"
    />
  </n-modal>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, watch } from 'vue';
  import { PlusOutlined } from '@vicons/antd';
  import { BasicTable, TableAction } from '@/components/Table';
  import { PageFirmwareUpdateTask } from '@/types/DeviceModel';
  import {
    getFirmwareUpdateTaskPageList,
    delFirmwareUpdateTask,
    FirmwareUpdateTaskPageParams,
  } from '@/api/devices/firmwareUpdateTask';
  import { getFirmwareUpdateTotal } from '@/api/devices/firmwareUpdateLog';
  import { taskColumns } from './taskColumns';
  // @ts-ignore
  import AddTask from './AddTask.vue';
  import { format } from 'date-fns';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        firmwareId: 0,
        firmwareName: '',
        version: '',
        installType: '1',
        url: '',
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close']);

  const showState = ref(false);
  const localParams: any = ref(null);

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], async ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
    if (newParams && newParams.firmwareId) {
      totalData.value = await loadUpDateTotal();
    }
    console.log('totalData', totalData.value);
  });

  const actionRef = ref();
  const queryKey = ref('');
  const addTaskModal = ref(false);
  const totalData = ref<any>({
    total: 0,
    succeed: 0,
    update: 0,
    fail: 0,
  });
  const showLogsModal = ref(false);
  const viewLogs = ref<any>({
    taskId: 0,
    taskName: '',
    firmwareId: 0,
    version: '',
    taskType: '1',
    devices: '',
    deviceArray: [],
    deviceCount: 0,
    planTime: null,
    remark: '',
  });

  // 根据权限渲染表格操作列
  const actionCell = () => {
    return reactive({
      width: 120,
      title: '操作',
      key: 'action',
      fixed: 'right',
      render(record: Recordable) {
        return h(TableAction as any, {
          style: 'button',
          actions: [
            {
              label: '详情',
              onClick: handleView.bind(null, record),
            },
            {
              label: '删除',
              onClick: handleDel.bind(null, record),
            },
          ],
        });
      },
    });
  };
  // 表格操作列对象
  const actionColumn = actionCell();

  // 加载查询统计
  const loadUpDateTotal = async () => {
    const params = {
      firmwareId: localParams.value.firmwareId,
    };
    const result = (await getFirmwareUpdateTotal(params)) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return {
        total: 0,
        succeed: 0,
        update: 0,
        fail: 0,
      };
    }
  };

  // 加载查询计划
  const loadList = async (res: any) => {
    if (localParams.value) {
      let params = {} as FirmwareUpdateTaskPageParams;
      params.firmwareId = localParams.value.firmwareId;
      if (queryKey.value !== '') {
        params.key = queryKey.value;
      }
      params.index = res.page || res.current;
      params.size = res.pageSize || res.size;

      const result = (await getFirmwareUpdateTaskPageList(params)) as unknown as {
        status: string;
        message: string;
        data: PageFirmwareUpdateTask;
      };
      if (result.status === 'success') {
        return result.data;
      } else {
        return {
          records: [],
          total: 0,
          current: res.page || res.current,
          pages: 1,
          size: res.pageSize || res.size,
        };
      }
    } else {
      return [];
    }
  };

  // 查询
  const handleQuery = () => {
    reloadTable();
  };

  // 重置
  const handleRest = () => {
    queryKey.value = '';
    reloadTable();
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 详情
  const handleView = (record: Recordable) => {
    viewLogs.value = record;
    showLogsModal.value = true;
  };

  // 新增
  const handleAdd = () => {
    const oneHourLater = new Date();
    oneHourLater.setHours(oneHourLater.getHours() + 1);
    //const planTime = format(oneHourLater, 'yyyy-MM-dd HH:mm:ss');
    const planTime = oneHourLater.getTime();

    viewLogs.value = {
      taskId: 0,
      taskName: '',
      firmwareId: 0,
      version: '',
      taskType: '1',
      devices: '',
      deviceCount: 0,
      planTime,
      remark: '',
    };
    addTaskModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.firmwareId,
    };

    try {
      const result = (await delFirmwareUpdateTask(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        window['$message'].success('删除成功');
        reloadTable();
      } else {
        window['$message'].error(result.message);
      }
    } catch (error) {
      window['$message'].error('删除失败');
    }
  };
</script>

<style lang="less" scoped>
  .info-box {
    width: 100%;
    padding: 10px 20px;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    margin-bottom: 20px;
    .title-line {
      width: 100%;
      height: 36px;
      line-height: 28px;
      font-size: 15px;
      font-weight: 600;
    }
    .params-line {
      width: 100%;
      .cell-param {
        width: 100%;
        height: 28px;
        font-size: 14px;
        .cell-label {
          width: 80px;
          height: 28px;
          line-height: 28px;
          color: #666666;
          float: left;
        }
        .cell-value {
          height: 28px;
          line-height: 28px;
          margin-left: 80px;
        }
      }
    }
  }
</style>
