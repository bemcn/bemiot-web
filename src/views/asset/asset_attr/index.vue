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
  <div class="main-panner">
    <div class="left-block">
      <n-card :bordered="false" style="height: 100%; overflow-y: auto; padding-bottom: 15px">
        <div class="label-head">空间位置</div>
        <div class="class-tree">
          <n-tree
            block-line
            :data="treeData"
            :expand-on-click="false"
            :default-expanded-keys="['0']"
            :node-props="nodeProps"
          />
        </div>
      </n-card>
    </div>
    <div class="right-block">
      <n-card :bordered="false">
        <BasicTable
          :columns="columns"
          :request="loadDataTable"
          :row-key="(row) => (row.attrId ? row.attrId : 'row_' + Math.random())"
          ref="actionRef"
          :actionColumn="actionColumn"
          :scroll-x="1280"
          @update:checked-row-keys="onCheckedRow"
        >
          <template #tableTitle>
            <n-button v-if="addAuth && chkTreeType === 'product'" type="primary" @click="handleAdd">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              新增属性
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
      </n-card>
    </div>
  </div>
  <InfoFromModal
    :showModel="showModal"
    :title="modalTitle"
    :params="formParams"
    :action="action"
    @close="() => (showModal = false)"
    @submit="reloadTable"
  />
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { TreeOption } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageProduct } from '@/types/DeviceModel';
  import {
    getProductAttrPageList,
    delProductAttrById,
    delProductAttrByIds,
    ProductAttrPageParams,
  } from '@/api/asset/productAttr';
  import { getProductTree } from '@/api/devices/product';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('asset_attr');
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;

  //数据定义
  const queryRef: any = ref(null);
  const checkRow: any = ref(null);
  const chkTreeId = ref('');
  const chkTreeType = ref('');
  const chkTreeLabel = ref('');
  const actionRef = ref();
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const formParams = ref<any>({});

  // 查询组件
  const schemas: FormSchema[] = [
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
  ];
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:5' },
    labelWidth: 80,
    schemas,
  });

  // 表格操作列
  const actionCell = () => {
    if (editAuth || deleteAuth) {
      return reactive({
        width: 140,
        title: '操作',
        key: 'action',
        fixed: 'right' as const,
        render(record: Recordable) {
          return h(TableAction as any, {
            style: 'button',
            actions: [
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
                  return deleteAuth;
                },
              },
            ],
          });
        },
      });
    } else {
      return null;
    }
  };
  const actionColumn = actionCell();

  /**
   * 获取产品树
   */
  const createTreeData = async () => {
    const result = (await getProductTree()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      let node = {
        key: '0',
        label: '全部类别',
        value: '0',
        type: '',
        children: result.data,
      };
      return [node];
    } else {
      return [];
    }
  };
  //树定义
  const treeData = ref<any[]>([]);
  const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
      onClick() {
        if (option.key === '') {
          if (chkTreeId.value !== '') {
            chkTreeId.value = '';
            chkTreeType.value = '';
            chkTreeLabel.value = '';
            reloadTable();
          }
        } else {
          const changeId = option.key ? option.key.toString() : '';
          const changeType = option.type ? option.type.toString() : '';
          if (changeId !== '') {
            if (changeId !== chkTreeId.value || changeType !== chkTreeType.value) {
              chkTreeId.value = changeId;
              chkTreeType.value = changeType;
              chkTreeLabel.value = option.label ? option.label.toString() : '';
              reloadTable();
            }
          } else {
            chkTreeId.value = '';
            chkTreeType.value = '';
            chkTreeLabel.value = '';
            reloadTable();
          }
        }
      },
    };
  };

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as ProductAttrPageParams;
    if (chkTreeId.value !== '') {
      if (chkTreeType.value === 'class') {
        params.classId = parseInt(chkTreeId.value);
      } else {
        params.productId = chkTreeId.value;
      }
    }
    if (fieldsValue.hasOwnProperty('key')) {
      params.key = fieldsValue.key;
    }
    params.index = res.current;
    params.size = res.size;
    queryRef.value = getFieldsValue();

    const result = (await getProductAttrPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageProduct;
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return null;
    }
  };

  // 刷新表格
  const reloadTable = async () => {
    actionRef.value.reload();
  };

  // 新增
  const handleAdd = () => {
    let productId;
    let productName;
    if (chkTreeType.value === 'product') {
      productId = chkTreeId.value;
      productName = chkTreeLabel.value;
    } else {
      productId = null;
      productName = '';
    }

    formParams.value = {
      attrId: 0,
      productId: productId,
      productName: productName,
      classRoute: '',
      fieldKey: '',
      fieldLabel: '',
      fieldType: 'input',
      description: '',
    };
    modalTitle.value = '新增资产属性';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      attrId: record.attrId,
      productId: record.productId,
      productName: record.product.productName,
      classRoute: record.classRoute,
      fieldKey: record.fieldKey,
      fieldLabel: record.fieldLabel,
      fieldType: record.fieldType,
      description: record.description,
    };
    modalTitle.value = '编辑资产属性';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.certificateId,
    };

    try {
      const result = (await delProductAttrById(params)) as unknown as {
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

    const result = (await delProductAttrByIds(params)) as unknown as {
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
    treeData.value = await createTreeData();
  });
</script>
<style lang="less" scoped>
  .main-panner {
    width: 100%;
    height: 100%;
    padding-bottom: 207px;
    padding-right: 220px;
    position: fixed;
    top: 197px;
    left: 210px;
    z-index: 10;
    .left-block {
      width: 250px;
      height: 100%;
      float: left;
      .label-head {
        width: 100%;
        height: 34px;
        font-size: 15px;
        font-weight: 600;
      }
    }
    .right-block {
      height: 100%;
      margin-left: 265px;
      min-height: 100px;
      overflow-y: auto;
    }
  }
</style>
