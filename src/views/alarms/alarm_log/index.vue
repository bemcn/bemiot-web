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
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1000"
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

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('alarm_log');
  const deleteLog = auth.delete;

  const actionRef = ref();
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
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
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
    if (deleteLog) {
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

    // 模拟数据请求
    const result = {
      records: [
        {
          id: '1',
          level: 1,
          deviceName: '温湿度传感器01',
          content: '设备温度超过阈值，当前温度为55℃',
          createTime: '2025-10-30T10:30:25',
        },
        {
          id: '2',
          level: 2,
          deviceName: '空气质量监测仪03',
          content: '设备通信中断，超过5分钟未收到数据',
          createTime: '2025-10-30T09:15:42',
        },
        {
          id: '3',
          level: 3,
          deviceName: '智能电表05',
          content: '设备电池电量低于20%',
          createTime: '2025-10-30T08:22:17',
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
