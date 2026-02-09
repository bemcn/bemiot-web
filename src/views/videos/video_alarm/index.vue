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
      :row-key="(row) => row.serverId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      :headShow="false"
    />
  </n-card>
  <ViewInfo :showModel="showModal" :params="formParams" @close="() => (showModal = false)" />
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { VideoServer } from '@/types/VideoModel';
  import { getVideoServerList, VideoServerParams } from '@/api/video/videoServer';
  import { columns } from './columns';
  // @ts-ignore
  import ViewInfo from './ViewInfo.vue';

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showModal = ref(false);
  const formParams = ref<any>({});

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入摄像头名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'date',
      component: 'NDatePicker',
      label: '日期',
      componentProps: {
        type: 'date',
        placeholder: '请输入录像日期',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  // 根据权限渲染表格操作列
  const actionCell = () => {
    return reactive({
      width: 190,
      title: '操作',
      key: 'action',
      fixed: 'right',
      render(record: Recordable) {
        return h(TableAction as any, {
          style: 'button',
          actions: [
            {
              label: '查看',
              onClick: handleMore.bind(null, record),
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
    return {
      records: [],
      total: 0,
      current: res.page || res.current,
      pages: 1,
      size: res.pageSize || res.size,
    };
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 详情
  const handleMore = (record: Recordable) => {
    formParams.value = {
      serverId: record.serverId,
      serverName: record.serverName,
      serverType: record.serverType,
      ipAddress: record.ipAddress,
      playProtocol: record.playProtocol,
      autoConfig: record.autoConfig === 0 ? false : true,
      receiveType: record.receiveType,
      receivePort1: record.receivePort1 + '',
      receivePort2: record.receivePort2 + '',
      httpPort: record.httpPort + '',
      httpsPort: record.httpsPort + '',
      rtmpPort: record.rtmpPort + '',
      hlsPort: record.hlsPort + '',
      webscoketPort: record.webscoketPort + '',
      storagePort: record.storagePort + '',
      remark: record.remark,
    };
    showModal.value = true;
  };

  const handleDel = (record: Recordable) => {
    console.log(record);
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
