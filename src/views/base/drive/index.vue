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
      :row-key="(row) => row.driveCode"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button v-if="addAuth" type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增驱动
        </n-button>
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
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <InfoFromModal
      :showModel="showModal"
      :title="modalTitle"
      :params="formParams"
      :options="optionsArrays"
      :action="action"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />

    <DriveParams
      :showModel="showParamsModal"
      :params="recordParams"
      @close="() => (showParamsModal = false)"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { Protocols, PageDrive } from '@/types/BaseModel';
  import {
    getDrivePageList,
    startDrive,
    stopDrive,
    delDriveById,
    delDriveByIds,
    DrivePageParams,
  } from '@/api/base/drives';
  import { getProtocolsList } from '@/api/base/protocols';
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { format } from 'date-fns';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';
  // @ts-ignore
  import DriveParams from './DriveParams.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('drive');
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showModal = ref(false);
  const showParamsModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const checkRow: any = ref(null);
  const formParams = ref<any>({});
  const recordParams = ref<any>({});
  const optionsArrays = ref<any>([]);
  const statusArrays = ref<any>([
    {
      value: 1,
      label: '停止',
    },
    {
      value: 2,
      label: '启动',
    },
  ]);

  /**
   * 获取通讯协议列表
   * @param res 响应数据
   */
  const getProtocolsArray = async () => {
    const result = (await getProtocolsList()) as unknown as {
      status: string;
      message: string;
      data: Protocols[];
    };
    if (result.status === 'success') {
      const dataList = result.data;
      let list: Array<{ value: string; label: string }> = [];
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i];
        const itemData = {
          value: item.protocolId + '',
          label: item.protocolName,
        };
        list.push(itemData);
      }
      return list;
    } else {
      return [];
    }
  };

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择',
        options: statusArrays,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'key',
      component: 'NInputGroup',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
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
              label: '驱动编号',
              value: 'code',
            },
            {
              label: '驱动名称',
              value: 'name',
            },
          ],
          onInput: (e: any) => {
            console.log(e);
          },
        },
        defaultSelectValue: 'code',
      },
    },
    {
      field: 'dateBetween',
      component: 'NDatePicker',
      label: '发行日期',
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
    if (editAuth || deleteAuth) {
      return reactive({
        width: 270,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          let statusBtn = '启动';
          if (record.status === 2) {
            statusBtn = '停止';
          }
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '驱动参数',
                onClick: handleParams.bind(null, record),
                ifShow: () => {
                  return editAuth;
                },
              },
              {
                label: statusBtn,
                loading: record.runerLoading,
                onClick: handleRuner.bind(null, record),
                ifShow: () => {
                  return editAuth;
                },
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                ifShow: () => {
                  return editAuth;
                },
              },
              {
                label: '删除',
                onClick: handleDel.bind(null, record),
                ifShow: () => {
                  return deleteAuth && record.defaultDrive === 0;
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
    let params = {} as DrivePageParams;
    if (fieldsValue.hasOwnProperty('status')) {
      params.status = fieldsValue.status;
    }
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
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

    const result = (await getDrivePageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageDrive;
    };
    if (result.status === 'success') {
      let records = result.data.records;
      for (let i = 0; i < records.length; i++) {
        records[i].runerLoading = false;
      }
      result.data.records = records;
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

  // 驱动参数
  const handleParams = (record: Recordable) => {
    recordParams.value = {
      driveCode: record.driveCode,
      driveName: record.driveName,
    };
    showParamsModal.value = true;
  };

  // 新增
  const handleAdd = () => {
    const date = new Date();
    const releaseTime = format(date, 'yyyy-MM-dd');
    formParams.value = {
      driveCode: '',
      driveName: '',
      protocolId: null,
      version: '',
      driveSource: 'Bem CN',
      remark: '',
      packageUrl: '',
      releaseTime: releaseTime,
    };
    modalTitle.value = '新增驱动';
    action.value = 'add';
    showModal.value = true;
  };

  // 启动/停止
  const handleRuner = async (record: Recordable) => {
    record.runerLoading = true;
    const status = record.status === 1 ? 2 : 1;
    const params = {
      driveCode: record.driveCode,
      status: status,
    };

    try {
      let result: { status: any; message: any };
      if (record.status === 1) {
        result = (await startDrive(params)) as unknown as {
          status: string;
          message: string;
        };
      } else {
        result = (await stopDrive(params)) as unknown as {
          status: string;
          message: string;
        };
      }

      if (result.status === 'success') {
        window['$message'].success('操作成功');
        setTimeout(() => {
          record.runerLoading = false;
          reloadTable();
        }, 2000);
      } else {
        window['$message'].error(result.message);
        setTimeout(() => {
          record.runerLoading = false;
        }, 2000);
      }
    } catch (error) {
      window['$message'].error('操作失败');
    }
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    const date = new Date(record.releaseTime);
    const releaseTime = format(date, 'yyyy-MM-dd');

    formParams.value = {
      driveCode: record.driveCode,
      driveName: record.driveName,
      protocolId: record.protocolId + '',
      version: record.version,
      driveSource: record.driveSource,
      remark: record.remark,
      packageUrl: record.packageUrl,
      releaseTime: releaseTime,
    };
    modalTitle.value = '编辑驱动';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      driveCode: record.driveCode,
    };

    try {
      const result = (await delDriveById(params)) as unknown as {
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

    const result = (await delDriveByIds(params)) as unknown as {
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

  onMounted(async () => {
    optionsArrays.value = await getProtocolsArray();
  });
</script>
