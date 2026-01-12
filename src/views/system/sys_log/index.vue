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
      :row-key="(row) => row.ts"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button v-if="deleteLog" style="margin-left: 10px" type="primary" @click="handleDelArray">
          <template #icon>
            <n-icon>
              <DeleteOutlined />
            </n-icon>
          </template>
          批量删除
        </n-button>
        <ExportExcel
          type="primary"
          :authShow="exportLog"
          :queryData="queryRef"
          apiPath="/log/exportExcel"
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
  import { PageLog } from '@/types/SystemModel';
  import { getLogPageList, delLogById, delLogByIds, LogPageParams } from '@/api/system/logSystem';
  import { format } from 'date-fns';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('sys_log');
  const deleteLog = auth.delete;
  const exportLog = auth.export;

  const queryRef: any = ref(null);
  const actionRef = ref();
  const checkRow: any = ref(null);

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInputGroup',
      label: '关键字',
      componentProps: {
        placeholder: '请输入账号',
        onInput: (e: any) => {
          console.log(e);
        },
      },
      subFormSchema: {
        field: 'filed',
        style: 'width: 110px;',
        componentProps: {
          options: [
            {
              label: '账号',
              value: 'userName',
            },
            {
              label: '昵称',
              value: 'nickName',
            },
            {
              label: '模块',
              value: 'modelName',
            },
          ],
          onInput: (e: any) => {
            console.log(e);
          },
        },
        defaultSelectValue: 'userName',
      },
    },
    {
      field: 'operation',
      component: 'NSelect',
      label: '操作事件',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            label: '新增',
            value: '新增',
          },
          {
            label: '编辑',
            value: '编辑',
          },
          {
            label: '删除',
            value: '删除',
          },
          {
            label: '操作',
            value: '操作',
          },
          {
            label: '下载',
            value: '下载',
          },
          {
            label: '验证',
            value: '验证',
          },
        ],
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'dateBetween',
      component: 'NDatePicker',
      label: '创建日期',
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
    if (deleteLog) {
      return reactive({
        width: 100,
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        titleAlign: 'center',
        render(record: Recordable) {
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '删除',
                onClick: handleDel.bind(null, record),
                ifShow: () => {
                  return deleteLog;
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
    gridProps: { cols: '1 s:1 m:2 l:4 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as LogPageParams;
    if (fieldsValue.hasOwnProperty('source')) {
      params.source = fieldsValue.source;
    }
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    if (fieldsValue.hasOwnProperty('operation')) {
      params.operation = fieldsValue.operation;
    }
    if (fieldsValue.hasOwnProperty('dateBetween')) {
      const dateBetweenArray = fieldsValue.dateBetween;
      if (dateBetweenArray.length === 2) {
        const startDate = format(new Date(Number(dateBetweenArray[0])), 'yyyy-MM-dd');
        const endDate = format(new Date(Number(dateBetweenArray[1])), 'yyyy-MM-dd');
        params.startDate = startDate;
        params.endDate = endDate;
      }
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getLogPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageLog;
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
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.id,
    };

    try {
      const result = (await delLogById(params)) as unknown as {
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

    const result = (await delLogByIds(params)) as unknown as {
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
