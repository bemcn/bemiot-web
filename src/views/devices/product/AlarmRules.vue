<template>
  <n-modal
    v-model:show="showModelState"
    :show-icon="false"
    preset="dialog"
    style="width: 1260px"
    :title="title"
    @after-leave="closeAfter"
  >
    <n-card :bordered="false" class="mt-3" content-style="padding: 0px !important;">
      <div class="table-toolbar">
        <div class="table-title">告警规则</div>
        <div class="table-toolbar-right">
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              新增
            </n-button>
            <n-button type="primary" @click="handleDelArray">
              <template #icon>
                <n-icon>
                  <DeleteOutlined />
                </n-icon>
              </template>
              批量删除
            </n-button>
          </n-space>
        </div>
      </div>
      <n-data-table
        :columns="tableColumns"
        :data="tableData"
        :loading="loading"
        :row-key="(row) => row.rulesId"
        v-model:checked-row-keys="checkedRowKeys"
        :pagination="false"
        :striped="true"
      />
    </n-card>
    <template #action>
      <n-space>
        <n-button @click="() => (showModelState = false)">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
  <AlarmRuleEdit
    :showModel="showEditModal"
    :action="action"
    :params="modelParams"
    @close="() => (showEditModal = false)"
    @submit="saveModelAlarm"
  />
</template>

<script lang="ts" setup>
  import { h, ref, watch } from 'vue';
  import { NDataTable, NButton, NIcon, NSpace, NModal, NCard } from 'naive-ui';
  import { ModelAlarmRules } from '@/types/DeviceModel';
  import {
    getModelAlarmRulesList,
    delModelAlarmRules,
    delModelAlarmRulesIds,
    ModelAlarmRulesParams,
  } from '@/api/devices/modelAlarmRules';
  import { alarmRulesColumns } from './columns';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import AlarmRuleEdit from './AlarmRuleEdit.vue';
  // @ts-ignore
  import ViewInfo from './ViewInfo.vue';

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
  const showModelState = ref(false);
  const showEditModal = ref(false);
  const title = ref('');
  const action = ref('');
  const localParams: any = ref(null);
  const modelParams: any = ref(null);
  // 回调
  const emit = defineEmits(['close']);
  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showModelState.value = newShowModel;
    localParams.value = newParams || {};
    if (newParams && newParams.modelName) {
      title.value = newParams.modelName + ' 告警规则';
    }
  });

  const loading = ref(false);
  const tableData = ref<ModelAlarmRules[]>([]);
  const checkedRowKeys = ref<string[]>([]);

  // 定义操作列
  const actionColumn = {
    title: '操作',
    key: 'actions',
    width: 170,
    render(record: ModelAlarmRules) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => handleEdit(record),
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDel(record),
            },
            { default: () => '删除' }
          ),
        ],
      });
    },
  };

  // 合并列定义，包含操作列
  const tableColumns = ref([...alarmRulesColumns, actionColumn]);

  // 获取表格数据
  const loadDataTable = async () => {
    if (localParams.value && localParams.value.productId) {
      loading.value = true;
      try {
        let params = {} as ModelAlarmRulesParams;
        params.productId = localParams.value.productId;
        params.identity = localParams.value.modelIdentity;

        const result = (await getModelAlarmRulesList(params)) as unknown as {
          status: string;
          message: string;
          data: ModelAlarmRules[];
        };
        if (result.status === 'success') {
          tableData.value = result.data;
          return result.data;
        } else {
          tableData.value = [];
          return [];
        }
      } catch (error) {
        console.error('获取告警规则列表失败:', error);
        tableData.value = [];
        return [];
      } finally {
        loading.value = false;
      }
    } else {
      tableData.value = [];
      return [];
    }
  };

  // 刷新表格
  const reloadTable = () => {
    loadDataTable();
  };

  // 新增
  const handleAdd = () => {
    modelParams.value = {
      rulesId: '',
      rulesName: '',
      productId: localParams.value.productId,
      modelIdentity: localParams.value.modelIdentity,
      modelName: localParams.value.modelName,
      dataType: localParams.value.dataType,
      alarmLevel: '1',
      alarmRules: '',
      rules: [
        {
          link: '',
          model: '',
          operator: '==',
          value: '',
        },
      ],
      alertsType: '1',
      specifyUsers: '',
      users: [],
    };
    action.value = 'add';
    showEditModal.value = true;
  };
  // 编辑
  const handleEdit = (record: Recordable) => {
    const rules = JSON.parse(record.alarmRules);
    let users = [];
    if (record.specifyUsers && record.specifyUsers.length > 0) {
      users = record.specifyUsers.split(',');
    }

    modelParams.value = {
      rulesId: record.rulesId,
      rulesName: record.rulesName,
      productId: record.productId,
      modelIdentity: record.modelIdentity,
      modelName: localParams.value.modelName,
      dataType: localParams.value.dataType,
      alarmLevel: record.alarmLevel + '',
      alarmRules: record.alarmRules,
      rules,
      alertsType: record.alertsType + '',
      specifyUsers: record.specifyUsers,
      users,
    };
    action.value = 'edit';
    showEditModal.value = true;
  };
  const saveModelAlarm = () => {
    showEditModal.value = false;
    reloadTable();
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.rulesId,
    };

    try {
      const result = (await delModelAlarmRules(params)) as unknown as {
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

  // 批量删除
  const handleDelArray = async () => {
    if (checkedRowKeys.value.length === 0) {
      window['$message'].warning('请至少选择一项');
      return;
    }

    const ids = checkedRowKeys.value.join(',');
    const params = {
      ids,
    };

    const result = (await delModelAlarmRulesIds(params)) as unknown as {
      status: string;
      message: string;
    };
    if (result.status === 'success') {
      window['$message'].success('删除成功');
      reloadTable();
      checkedRowKeys.value = []; // 清空选中状态
    } else {
      window['$message'].error(result.message);
    }
  };

  const closeAfter = () => {
    emit('close');
  };

  // 在组件挂载时加载数据
  watch(
    () => localParams.value,
    (newParams) => {
      if (newParams && newParams.productId) {
        loadDataTable();
      }
    },
    { immediate: true }
  );
</script>

<style scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .table-title {
    font-size: 16px;
    font-weight: bold;
  }
  .table-toolbar-right {
    display: flex;
    gap: 8px;
  }
</style>
