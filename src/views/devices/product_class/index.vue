<template>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :dataSource="list"
      :row-key="(row) => row.classId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      :pagination="false"
    >
      <template #tableTitle>
        <n-button v-if="addClass" type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增分类
        </n-button>
        <ImportExcel
          type="primary"
          :authShow="importClass"
          modelPath="/productClass/modelExcel"
          importPath="/productClass/importExcel"
          @import-change="reloadTable"
        />
        <ExportExcel
          type="primary"
          :authShow="exportClass"
          :queryData="queryRef"
          apiPath="/productClass/exportExcel"
        />
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <InfoFromModal
      :showModel="showModal"
      :title="modalTitle"
      :params="formParams"
      :levels="levelArrays"
      :action="action"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, onMounted, onUnmounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { ProductClass, ProductClassTable } from '@/types/DeviceModel';
  import {
    getProductClassTreeTable,
    updateProductClassOrder,
    delProductClassById,
  } from '@/api/devices/productClass';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('product_class');
  const addClass = auth.add;
  const editClass = auth.edit;
  const deleteClass = auth.delete;
  const importClass = auth.import;
  const exportClass = auth.export;

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const formParams = ref<any>({
    classId: 0,
    className: '',
    levelId: 0,
    remark: '',
  });
  const list = ref<any>([]);
  const levelArrays = ref<any>([]);

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (editClass || deleteClass) {
      return reactive({
        width: 170,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          let editShow = false;
          if (editClass) {
            editShow = true;
          }
          let delShow = false;
          if (deleteClass) {
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
    const result = (await getProductClassTreeTable()) as unknown as {
      status: string;
      message: string;
      data: ProductClassTable[];
    };
    if (result.status === 'success') {
      const resultList = result.data;
      let selectOptions: { value: string; label: string }[] = [];
      selectOptions.push({ value: '0', label: '顶级分类' });
      for (let i = 0; i < resultList.length; i++) {
        const optionItem = {
          value: resultList[i].classId + '',
          label: '> ' + resultList[i].className,
        };
        selectOptions.push(optionItem);
      }
      list.value = result.data;
      levelArrays.value = selectOptions;
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
      classId: 0,
      className: '',
      levelId: '0',
      remark: '',
    };
    modalTitle.value = '新增分类';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      classId: record.classId,
      className: record.className,
      levelId: record.levelId + '',
      remark: record.remark,
    };
    modalTitle.value = '编辑分类';
    action.value = 'edit';
    showModal.value = true;
  };

  // 更新排序值的函数
  const editOrderNumber = async (index: number, value: number, record: ProductClass) => {
    try {
      // 发送请求更新后端数据
      const params = {
        id: Number(record.classId), // 强制转换为 number 类型
        orderNum: value,
      };

      const result = (await updateProductClassOrder(params)) as unknown as {
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
      id: record.classId,
    };

    try {
      const result = (await delProductClassById(params)) as unknown as {
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
