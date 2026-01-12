<template>
  <div>
    <n-card :bordered="false" class="mt-3" content-style="padding: 5px 0px !important;">
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
    <n-card :bordered="false" class="mt-3" content-style="padding: 0px !important;">
      <BasicTable
        :columns="logAlarmColumns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        :scroll-x="1280"
        :striped="true"
        :style="{ height: '360px' }"
        flex-height
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-button @click="handleDelArray">
            <template #icon>
              <n-icon>
                <DeleteOutlined />
              </n-icon>
            </template>
            批量删除
          </n-button>
        </template>
        <template #toolbar></template>
      </BasicTable>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, watch } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { NButton } from 'naive-ui';
  import { PageLogModelAlarm } from '@/types/AlarmModel';
  import { logAlarmColumns } from '../columns';
  import {
    getAlarmLogPageList,
    delAlarmLog,
    delAlarmLogs,
    LogAlarmPageParams,
  } from '@/api/alarm/logModelAlarm';
  import { format } from 'date-fns';
  // @ts-ignore
  import { DeleteOutlined } from '@vicons/antd';

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
  const queryRef: any = ref(null);
  const actionRef = ref();
  const checkRow: any = ref(null);
  const deviceId: any = ref(null);
  const alarmTypeOptions = ref<any[]>([
    {
      value: 'execute',
      label: '执行服务',
    },
    {
      value: 'executeReply',
      label: '执行反馈',
    },
  ]);

  const schemas: FormSchema[] = [
    {
      field: 'alarmType',
      component: 'NSelect',
      label: '告警类型',
      componentProps: {
        placeholder: '请选择',
        options: alarmTypeOptions,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'dateBetween',
      component: 'NDatePicker',
      label: '告警日期',
      componentProps: {
        placeholder: '请选择',
        type: 'daterange',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
  const actionCell = () => {
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
            },
          ],
        });
      },
    });
  };
  const actionColumn = actionCell();
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:4 xl:4 2xl:4' },
    labelWidth: 74,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    if (deviceId.value) {
      const fieldsValue = getFieldsValue();
      let params = {} as LogAlarmPageParams;
      params.deviceId = deviceId.value;
      if (fieldsValue.hasOwnProperty('alarmType')) {
        params.type = fieldsValue.alarmType;
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
          current: res.page || res.current,
          pages: 1,
          size: res.pageSize || res.size,
        };
      }
    }
  };

  watch(
    [() => props.id],
    ([newId]) => {
      if (newId && newId.length > 0) {
        deviceId.value = newId;
      }
    },
    { immediate: true }
  );

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
