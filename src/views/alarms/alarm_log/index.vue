<template>
  <n-card :bordered="false">
    <BasicForm
      :showAdvancedButton="false"
      @register="register"
      @submit="handleSubmit"
      @reset="handleReset"
    >
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>
  </n-card>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.logId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1000"
      :striped="true"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button
          v-if="deleteAuth"
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
        <ExportExcel
          type="primary"
          :authShow="exportAuth"
          :queryData="queryRef"
          apiPath="/logModelAlarm/exportExcel"
        />
      </template>

      <template #toolbar> </template>
    </BasicTable>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns } from './columns';
  import { DeleteOutlined } from '@vicons/antd';
  import { format } from 'date-fns';
  import { useUserStore } from '@/store/modules/user';
  import {
    getAlarmLogPageList,
    delAlarmLog,
    delAlarmLogs,
    LogAlarmPageParams,
  } from '@/api/alarm/logModelAlarm';
  import { PageLogModelAlarm } from '@/types/AlarmModel';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('alarm_log');
  const deleteAuth = auth.delete;
  const exportAuth = auth.export;

  const actionRef = ref();
  const queryRef: any = ref(null);
  const checkRow: any = ref(null);

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
            label: '一般告警',
            value: 1,
          },
          {
            label: '重要告警',
            value: 2,
          },
          {
            label: '紧急告警',
            value: 3,
          },
        ],
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择告警状态',
        options: [
          {
            label: '告警中',
            value: 1,
          },
          {
            label: '已解除',
            value: 2,
          },
        ],
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'identity',
      component: 'NInput',
      label: '物模型标识',
      componentProps: {
        placeholder: '请输入物模型标识',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'dateBetween',
      component: 'NDatePicker',
      label: '告警时间',
      componentProps: {
        placeholder: '请选择',
        type: 'daterange',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (deleteAuth) {
      return reactive({
        width: 100,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '删除',
                onClick: handleDel.bind(null, record),
                ifShow: () => {
                  return deleteAuth;
                },
              },
            ],
          });
        },
      });
    }
  };
  // 表格操作列对象
  const actionColumn = actionCell();
  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:4 xl:5 2xl:5' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as LogAlarmPageParams;

    if (fieldsValue.hasOwnProperty('level')) {
      params.level = fieldsValue.level;
    }

    if (fieldsValue.hasOwnProperty('status')) {
      params.status = fieldsValue.status;
    }

    if (fieldsValue.hasOwnProperty('identity')) {
      params.identity = fieldsValue.identity;
    }

    if (fieldsValue.hasOwnProperty('dateBetween')) {
      const dateBetweenArray = fieldsValue.dateBetween;
      if (dateBetweenArray && dateBetweenArray.length === 2) {
        const startDate = format(new Date(Number(dateBetweenArray[0])), 'yyyy-MM-dd');
        const endDate = format(new Date(Number(dateBetweenArray[1])), 'yyyy-MM-dd');
        params.startDate = startDate;
        params.endDate = endDate;
      }
    }

    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getAlarmLogPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageLogModelAlarm;
    };

    if (result.status === 'success') {
      return result.data;
    } else {
      return {
        records: [],
        total: 0,
        current: params.index,
        pages: 1,
        size: params.size,
      };
    }
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.logId,
    };

    try {
      const result = (await delAlarmLog(params)) as unknown as {
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
    const ids = checkRow.value.join(',');
    const params = {
      ids,
    };

    const result = (await delAlarmLogs(params)) as unknown as {
      status: string;
      message: string;
    };
    if (result.status === 'success') {
      window['$message'].success('删除成功');
      reloadTable();
    } else {
      window['$message'].error(result.message);
    }
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
