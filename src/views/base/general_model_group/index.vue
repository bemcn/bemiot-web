<template>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.groupId"
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
          新增分组
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
      :action="action"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, onMounted, onUnmounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { GeneralModelGroup, PageGeneralModelGroup } from '@/types/BaseModel';
  import {
    getGeneralModelGroupPageList,
    updateGeneralModelGroupOrder,
    delGeneralModelGroupById,
    delGeneralModelGroupByIds,
  } from '@/api/base/generalModelGroup';
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('general_model_group');
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;

  const actionRef = ref();
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const checkRow: any = ref(null);
  const formParams = ref<any>({
    groupId: 0,
    groupName: '',
    orderNum: '',
    remark: '',
  });

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (editAuth || deleteAuth) {
      return reactive({
        width: 220,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          let editShow = false;
          if (editAuth) {
            editShow = true;
          }
          let delShow = false;
          if (deleteAuth) {
            delShow = true;
          }
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                ifShow: () => {
                  return editShow;
                },
              },
              {
                label: '删除',
                onClick: handleDel.bind(null, record),
                ifShow: () => {
                  return delShow;
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

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    let params = {
      index: res.page || res.current,
      size: res.pageSize || res.size,
    };

    const result = (await getGeneralModelGroupPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageGeneralModelGroup;
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

  // 新增
  const handleAdd = () => {
    formParams.value = {
      groupId: 0,
      groupName: '',
      orderNum: '1',
      remark: '',
    };
    modalTitle.value = '新增分组';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      groupId: record.groupId,
      groupName: record.groupName,
      orderNum: record.orderNum + '',
      remark: record.remark,
    };
    modalTitle.value = '编辑分组';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.groupId,
    };

    try {
      const result = (await delGeneralModelGroupById(params)) as unknown as {
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

    const result = (await delGeneralModelGroupByIds(params)) as unknown as {
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

  // 更新排序值的函数
  const editOrderNumber = async (index: number, value: number, record: GeneralModelGroup) => {
    try {
      // 发送请求更新后端数据
      const params = {
        id: Number(record.groupId), // 强制转换为 number 类型
        orderNum: value,
      };

      const result = (await updateGeneralModelGroupOrder(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        if (actionRef.value && typeof actionRef.value.setTableData === 'function') {
          // 如果有 setTableData 方法，可以局部更新
          const currentData = [...actionRef.value.getDataSource()];
          if (currentData[index]) {
            currentData[index].orderNum = value;
            actionRef.value.setTableData(currentData);
          }
        } else {
          // 否则刷新整个表格
          reloadTable();
        }
      } else {
        window['$message'].error(result.message || '排序值更新失败');
        // 恢复原来的值
        const currentData = [...actionRef.value.getDataSource()];
        if (currentData && currentData[index]) {
          currentData[index].orderNum = record.orderNum;
        }
      }
    } catch (error) {
      window['$message'].error('排序值更新异常');
      // 恢复原来的值
      const currentData = [...actionRef.value.getDataSource()];
      if (currentData && currentData[index]) {
        currentData[index].orderNum = record.orderNum;
      }
    }
  };

  // 监听排序值更新事件的处理函数
  const handleUpdateOrderNumber = (event: CustomEvent) => {
    const { index, value, record } = event.detail;
    // 添加防抖处理，避免频繁请求
    clearTimeout((window as any).orderNumberUpdateTimer);
    (window as any).orderNumberUpdateTimer = setTimeout(() => {
      editOrderNumber(index, value, record);
    }, 500);
  };

  // 在组件挂载时监听事件
  onMounted(() => {
    window.addEventListener('updateOrderNumber', handleUpdateOrderNumber as EventListener);
  });

  // 在组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('updateOrderNumber', handleUpdateOrderNumber as EventListener);
    // 清除定时器
    if ((window as any).orderNumberUpdateTimer) {
      clearTimeout((window as any).orderNumberUpdateTimer);
    }
  });
</script>
