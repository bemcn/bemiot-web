<template>
  <n-card :bordered="false">
    <BasicForm
      :showAdvancedButton="false"
      @register="register"
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </n-card>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1500"
      :striped="true"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button
          v-if="addAlarmConfig !== undefined ? addAlarmConfig : true"
          type="primary"
          @click="handleAdd"
        >
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增
        </n-button>
        <n-button
          v-if="deleteAlarmConfig !== undefined ? deleteAlarmConfig : true"
          style="margin-left: 10px"
          type="primary"
          @click="handleDelArray"
        >
          <template #icon>
            <n-icon>
              <DeleteOutlined />
            </n-icon>
          </template>
          批量删除
        </n-button>
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <InfoFromModal
      :showModel="showModal"
      :title="modalTitle"
      :params="formParams"
      :action="action"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import { AlarmConfig, columns } from './columns';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  let addAlarmConfig, deleteAlarmConfig, editAlarmConfig;

  try {
    const auth = userStore.parseAuthByModule('alarm_config');
    addAlarmConfig = auth.add;
    deleteAlarmConfig = auth.delete;
    editAlarmConfig = auth.edit;
  } catch (e) {
    // 如果权限解析失败，则默认启用所有功能
    addAlarmConfig = true;
    deleteAlarmConfig = true;
    editAlarmConfig = true;
  }

  const actionRef = ref();
  const checkRow: any = ref(null);
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const formParams = ref<any>({});

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'level',
      component: 'NSelect',
      label: '告警级别',
      componentProps: {
        placeholder: '请选择告警级别',
        options: [
          {
            label: '紧急告警',
            value: 1,
          },
          {
            label: '重要告警',
            value: 2,
          },
          {
            label: '一般告警',
            value: 3,
          },
        ],
      },
    },
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
      },
    },
  ];

  // 根据权限渲染表格操作列
  const actionCell = () => {
    return reactive({
      width: 150,
      title: '操作',
      key: 'action',
      fixed: 'right',
      render(record: Recordable) {
        return h(TableAction as any, {
          style: 'button',
          actions: [
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {
                return editAlarmConfig !== undefined ? editAlarmConfig : true;
              },
            },
            {
              label: '删除',
              onClick: handleDel.bind(null, record),
              ifShow: () => {
                return deleteAlarmConfig !== undefined ? deleteAlarmConfig : true;
              },
            },
          ],
        });
      },
    });
  };

  // 表格操作列对象
  const actionColumn = actionCell();

  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params: any = {};

    if (fieldsValue.hasOwnProperty('level')) {
      params.level = fieldsValue.level;
    }

    if (fieldsValue.hasOwnProperty('key')) {
      params.key = fieldsValue.key;
    }

    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;

    // 模拟数据请求
    const result = {
      records: [
        {
          id: 1,
          alarmName: '温度过高告警',
          level: 1,
          deviceProperty: '温度',
          deviceName: '温湿度传感器01',
          minValue: 10,
          maxValue: 50,
          responseMethods: ['message', 'sms'],
          responseMethodText: '消息通知,短信通知',
          notifyUsers: ['zhangsan', 'lisi'],
          notifyUserText: '张三,李四',
          status: 1,
          createTime: '2025-10-30T10:30:25',
        },
        {
          id: 2,
          alarmName: '湿度异常告警',
          level: 2,
          deviceProperty: '湿度',
          deviceName: '温湿度传感器02',
          minValue: 20,
          maxValue: 80,
          responseMethods: ['message'],
          responseMethodText: '消息通知',
          notifyUsers: ['wangwu'],
          notifyUserText: '王五',
          status: 1,
          createTime: '2025-10-29T09:15:42',
        },
        {
          id: 3,
          alarmName: '电量不足告警',
          level: 3,
          deviceProperty: '电量',
          deviceName: '智能电表05',
          minValue: 20,
          maxValue: undefined,
          responseMethods: ['message'],
          responseMethodText: '消息通知',
          notifyUsers: ['zhaoliu'],
          notifyUserText: '赵六',
          status: 0,
          createTime: '2025-10-28T08:22:17',
        },
      ],
      total: 3,
      current: 1,
      pages: 1,
      size: 10,
    };

    // 模拟请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));
    return result;
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 新增
  const handleAdd = () => {
    formParams.value = {
      id: 0,
      alarmName: '',
      level: null,
      deviceProperty: '',
      deviceName: '',
      minValue: undefined,
      maxValue: undefined,
      responseMethods: [],
      notifyUsers: [],
      status: true,
    };
    modalTitle.value = '新增告警设置';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      id: record.id,
      alarmName: record.alarmName,
      level: record.level,
      deviceProperty: record.deviceProperty,
      deviceName: record.deviceName,
      minValue: record.minValue,
      maxValue: record.maxValue,
      responseMethods: [...record.responseMethods],
      notifyUsers: [...record.notifyUsers],
      status: record.status === 1,
    };
    modalTitle.value = '编辑告警设置';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    window['$message'].success('删除成功');
    reloadTable();
  };

  // 批量选择
  const onCheckedRow = (rowKeys: any) => {
    checkRow.value = rowKeys;
  };

  // 批量删除
  const handleDelArray = async () => {
    if (!checkRow.value || checkRow.value.length === 0) {
      window['$message'].warning('请至少选择一条记录');
      return;
    }
    window['$message'].success('批量删除成功');
    reloadTable();
  };

  // 查询点击
  const handleSubmit = () => {
    reloadTable();
  };

  // 重置点击
  const handleReset = () => {
    reloadTable();
  };
</script>
