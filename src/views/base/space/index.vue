<template>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :dataSource="list"
      :row-key="(row) => row.spaceId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      :pagination="false"
    >
      <template #tableTitle>
        <n-button v-if="addSpace" type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增空间位置
        </n-button>
        <ImportExcel
          type="primary"
          :authShow="importSpace"
          modelPath="/position/modelExcel"
          importPath="/position/importExcel"
          @import-change="reloadTable"
        />
        <ExportExcel
          type="primary"
          :authShow="exportSpace"
          :queryData="queryRef"
          apiPath="/position/exportExcel"
        />
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <InfoFromModal
      :showModel="showModal"
      :title="modalTitle"
      :params="formParams"
      :levels="optionArrays"
      :action="action"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, onMounted, onUnmounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { SpacePosition, SpacePositionTable, SpacePositionTree } from '@/types/BaseModel';
  import {
    getPositionTreeTable,
    getPositionTree,
    updatePositionOrderNumber,
    delPositionById,
    delPositionByIds,
  } from '@/api/base/position';
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('space');
  const addSpace = auth.add;
  const editSpace = auth.edit;
  const deleteSpace = auth.delete;
  const importSpace = auth.import;
  const exportSpace = auth.export;

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const formParams = ref<any>({
    spaceId: 0,
    spaceName: '',
    levelId: 0,
  });
  const list = ref<any>([]);
  const optionArrays = ref<any>([]);

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (editSpace || deleteSpace) {
      return reactive({
        width: 170,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          let editShow = false;
          if (editSpace) {
            editShow = true;
          }
          let delShow = false;
          if (deleteSpace) {
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
  const loadDataTable = async () => {
    const result = (await getPositionTreeTable()) as unknown as {
      status: string;
      message: string;
      data: SpacePositionTable[];
    };
    if (result.status === 'success') {
      list.value = result.data;
    }
  };

  /**
   * 获取树数据
   * @param res 响应数据
   */
  const loadDataTree = async () => {
    const result = (await getPositionTree()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      let options = [
        {
          label: '无上级空间位置',
          value: '0',
        },
      ];
      optionArrays.value = options.concat(result.data);
    }
  };

  // 刷新表格
  const reloadTable = () => {
    showModal.value = false;
    loadDataTable();
  };

  // 新增
  const handleAdd = () => {
    formParams.value = {
      spaceId: 0,
      spaceName: '',
      levelId: '0',
    };
    modalTitle.value = '新增空间位置';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      spaceId: record.spaceId,
      spaceName: record.spaceName,
      levelId: record.levelId + '',
    };
    modalTitle.value = '编辑空间位置';
    action.value = 'edit';
    showModal.value = true;
  };

  // 更新排序值的函数
  const editOrderNumber = async (index: number, value: number, record: SpacePosition) => {
    try {
      // 发送请求更新后端数据
      const params = {
        id: Number(record.spaceId), // 强制转换为 number 类型
        orderNum: value,
      };

      const result = (await updatePositionOrderNumber(params)) as unknown as {
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

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.spaceId,
    };

    try {
      const result = (await delPositionById(params)) as unknown as {
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

  // 监听排序值更新事件的处理函数
  const handleUpdateOrderNumber = (event: CustomEvent) => {
    const { index, value, record } = event.detail;
    // 添加防抖处理，避免频繁请求
    clearTimeout((window as any).orderNumberUpdateTimer);
    (window as any).orderNumberUpdateTimer = setTimeout(() => {
      editOrderNumber(index, value, record);
    }, 500);
  };

  onMounted(() => {
    loadDataTable();
    loadDataTree();
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
