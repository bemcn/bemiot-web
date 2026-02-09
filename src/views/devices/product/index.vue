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
        <div class="label-head">产品分类</div>
        <div class="class-tree">
          <n-tree
            block-line
            :data="data"
            expand-on-click
            :default-expand-all="true"
            :node-props="nodeProps"
          />
        </div>
      </n-card>
    </div>
    <div class="right-block">
      <n-card :bordered="false">
        <n-row style="padding-bottom: 15px">
          <n-col :span="12">
            <n-button type="primary" style="margin-right: 10px" v-if="addAuth" @click="handleAdd">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              新增产品
            </n-button>
          </n-col>
          <n-col :span="12" style="text-align: right">
            <n-button
              style="margin-right: 10px"
              :title="viewTable ? '网格视图' : '列表视图'"
              @click="handleDataView"
            >
              <template #icon>
                <n-icon>
                  <AppstoreOutlined v-if="viewTable" />
                  <UnorderedListOutlined v-else />
                </n-icon>
              </template>
            </n-button>
            <n-button title="刷新" @click="reloadTable">
              <template #icon>
                <n-icon>
                  <ReloadOutlined />
                </n-icon>
              </template>
            </n-button>
          </n-col>
        </n-row>
        <div v-show="viewTable">
          <BasicTable
            :columns="columns"
            :request="loadDataTable"
            :row-key="(row) => (row.productId ? row.productId : 'row_' + Math.random())"
            ref="actionRef"
            :actionColumn="actionColumn"
            :scroll-x="1260"
            :headShow="false"
          />
        </div>
        <div v-show="!viewTable">
          <n-grid x-gap="15" y-gap="15" cols="3 s:1 m:2 l:2 xl:3 2xl:3">
            <n-gi v-for="(item, index) in dataList" :key="index">
              <n-card
                content-style="padding: 0px"
                footer-style="padding: 10px 15px; background: ##fafafc"
              >
                <div class="card-box">
                  <div class="status-box">
                    <n-tag :bordered="false" :type="item.status === 1 ? 'warning' : 'success'">
                      {{ item.status === 1 ? '待发布' : '已发布' }}
                      <template #icon>
                        <n-icon :component="InfoCircleFilled" v-if="item.status === 1" />
                        <n-icon :component="CheckCircleFilled" v-else />
                      </template>
                    </n-tag>
                  </div>
                  <div class="top-line">
                    <div class="icons" v-if="item.images === null || item.images === ''">
                      <img alt="" src="/src/assets/images/zlsb.png" v-if="item.types === 1" />
                      <img alt="" src="/src/assets/images/wgsb.png" v-if="item.types === 2" />
                      <img alt="" src="/src/assets/images/jksb.png" v-if="item.types === 3" />
                      <img alt="" src="/src/assets/images/zsb.png" v-if="item.types === 4" />
                      <img alt="" src="/src/assets/images/xnsb.png" v-if="item.types === 5" />
                    </div>
                    <div
                      class="images"
                      :style="{ backgroundImage: 'url(' + globSetting.apiUrl + item.images + ')' }"
                      v-else
                    >
                    </div>
                    <div class="labels">
                      <div class="names">{{ item.productName }}</div>
                      <div class="tags">
                        <n-tag
                          size="small"
                          style="margin-right: 10px"
                          :color="{ color: '#fff', borderColor: '#ccc', textColor: '#999' }"
                          >{{
                            item.types === 1
                              ? '直连设备'
                              : item.types === 2
                              ? '网关设备'
                              : item.types === 3
                              ? '监控设备'
                              : item.types === 4
                              ? '网关子设备'
                              : '虚拟设备'
                          }}</n-tag
                        >
                        <n-tag
                          size="small"
                          :color="{ color: '#fff', borderColor: '#ccc', textColor: '#999' }"
                          >{{ item.drive.driveName }}</n-tag
                        >
                      </div>
                    </div>
                  </div>
                  <div class="item-line">
                    <n-descriptions
                      label-placement="left"
                      :column="2"
                      label-style="font-size:14px; color:#999"
                      content-style="font-size:14px; color:#666"
                    >
                      <n-descriptions-item label="所属分类">{{
                        item.productClass.className
                      }}</n-descriptions-item>
                      <n-descriptions-item label="认证方式">{{
                        item.types === 0
                          ? '无认证'
                          : item.types === 1
                          ? '简单认证'
                          : item.types === 2
                          ? '加密认证'
                          : '简单+加密认证'
                      }}</n-descriptions-item>
                      <n-descriptions-item label="定位方式">{{
                        item.types === 0
                          ? '无定位'
                          : item.types === 1
                          ? '自动定位'
                          : item.types === 2
                          ? '设备定位'
                          : '自定义位置'
                      }}</n-descriptions-item>
                      <n-descriptions-item label="设备授权">
                        <n-tag
                          size="small"
                          :color="{ color: '#fff', borderColor: '#ccc', textColor: '#999' }"
                          v-if="item.authEquipment === 0"
                          >未启用</n-tag
                        >
                        <n-tag size="small" type="success" v-else>已启用</n-tag>
                      </n-descriptions-item>
                    </n-descriptions>
                  </div>
                </div>
                <template v-if="viewAuth || editAuth || deleteAuth" #footer>
                  <div style="text-align: center">
                    <n-button style="width: 33%" quaternary type="info" @click="handleView(item)"
                      >详情</n-button
                    >
                    <n-button
                      style="width: 33%"
                      quaternary
                      type="info"
                      v-if="editAuth"
                      @click="handleEdit(item)"
                      >编辑</n-button
                    >
                    <n-dropdown
                      trigger="click"
                      :options="[
                        {
                          label: '关联设备',
                          key: 'device',
                          show: editAuth,
                          record: item,
                        },
                        {
                          label: '产品模型',
                          key: 'productModel',
                          show: editAuth,
                          record: item,
                        },
                        {
                          label: item.status === 1 ? '发布产品' : '停止发布',
                          key: 'productStatus',
                          show: editAuth,
                          record: item,
                        },
                        {
                          label: '删除',
                          key: 'delete',
                          show: deleteAuth,
                          record: item,
                        },
                      ]"
                      @select="handleDropSelect"
                    >
                      <n-button quaternary style="width: 33%" type="info" icon-placement="right">
                        更多
                        <template #icon>
                          <n-icon>
                            <DownOutlined />
                          </n-icon>
                        </template>
                      </n-button>
                    </n-dropdown>
                  </div>
                </template>
              </n-card>
            </n-gi>
          </n-grid>
          <div class="page-line">
            <div class="pager">
              <n-pagination
                v-model:page="dataPage.page"
                :page-count="dataPage.pageCount"
                :page-size="dataPage.pageSize"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-slot="7"
                size="medium"
                :prefix="() => `共 ${dataPage.itemCount} 条`"
                show-quick-jumper
                show-size-picker
                @update:page="updatePage"
                @update:page-size="updatePageSize"
              />
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
  <InfoFromModal
    :showModel="showModal"
    :title="modalTitle"
    :action="action"
    :classOption="data"
    :params="formParams"
    @close="() => (showModal = false)"
    @submit="reloadTable"
  />
  <ViewInfo
    :showModel="showViewModal"
    :params="formParams"
    @close="() => (showViewModal = false)"
  />
  <IotModel :showModel="showIotModal" :params="formParams" @close="() => (showIotModal = false)" />
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { DropdownOption, TreeOption } from 'naive-ui';
  import { useRouter } from 'vue-router';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageProduct } from '@/types/DeviceModel';
  import {
    getProductPageList,
    editProductStatus,
    delProductById,
    ProductPageParams,
  } from '@/api/devices/product';
  import { getProductClassTree } from '@/api/base/productClass';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  import { useGlobSetting } from '@/hooks/setting';
  // @ts-ignore
  import {
    PlusOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    InfoCircleFilled,
    CheckCircleFilled,
    DownOutlined,
  } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';
  // @ts-ignore
  import ViewInfo from './ViewInfo.vue';
  // @ts-ignore
  import IotModel from './IotModel.vue';

  const router = useRouter();
  const globSetting = useGlobSetting();
  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('product');
  const viewAuth = auth.view;
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;

  //数据定义
  const viewTable = ref(true); //表格视图切换
  const queryRef: any = ref(null);
  const classId = ref(0);
  const actionRef = ref();
  const showModal = ref(false);
  const showViewModal = ref(false);
  const showIotModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const formParams = ref<any>({});
  const dataList = ref<any[]>([]);
  const dataPage = ref<any>([]);

  // 查询组件
  const schemas: FormSchema[] = [
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            value: 1,
            label: '未发布',
          },
          {
            value: 2,
            label: '已发布',
          },
        ],
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'types',
      component: 'NSelect',
      label: '产品类型',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            value: 1,
            label: '直连设备',
          },
          {
            value: 2,
            label: '网关设备',
          },
          {
            value: 3,
            label: '监控设备',
          },
          {
            value: 4,
            label: '网关子设备',
          },
          {
            value: 5,
            label: '虚拟设备',
          },
        ],
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
        style: 'width: 150px;',
        componentProps: {
          options: [
            {
              label: '产品名称',
              value: 'name',
            },
            {
              label: '产品型号',
              value: 'models',
            },
          ],
          onInput: (e: any) => {
            console.log(e);
          },
        },
        defaultSelectValue: 'name',
      },
    },
  ];
  // 查询组件工具对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  // 表格操作列
  const actionCell = () => {
    if (viewAuth || editAuth || deleteAuth) {
      return reactive({
        width: 220,
        title: '操作',
        key: 'action',
        fixed: 'right' as const,
        render(record: Recordable) {
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '详情',
                onClick: handleView.bind(null, record),
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                ifShow: () => {
                  return editAuth;
                },
              },
            ],
            dropDownActions: [
              {
                label: '关联设备',
                key: 'device',
                ifShow: () => {
                  return editAuth;
                },
              },
              {
                label: '产品模型',
                key: 'productModel',
                ifShow: () => {
                  return editAuth;
                },
              },
              {
                label: record.status === 1 ? '发布产品' : '停止发布',
                key: 'productStatus',
                ifShow: () => {
                  return editAuth;
                },
              },
              {
                label: '删除',
                key: 'delete',
                ifShow: () => {
                  return deleteAuth;
                },
              },
            ],
            select: (key) => {
              if (key === 'device') {
                router.push({ path: '/devices/device', query: { id: record.productId } });
              } else if (key === 'productModel') {
                optionProductModel(record);
              } else if (key === 'productStatus') {
                optionProductStatus(record);
              } else if (key === 'delete') {
                handleDel(record);
              }
            },
          });
        },
      });
    } else {
      return null;
    }
  };
  // 表格操作列对象
  const actionColumn = actionCell();

  /**
   * 获取产品分类
   */
  const createTreeData = async () => {
    const result = (await getProductClassTree()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      let node = {
        key: '0',
        label: '全部分类',
        levelId: 0,
        hasChildren: true,
        children: result.data,
      };
      return [node];
    } else {
      return [];
    }
  };
  //树定义
  const data = ref<any[]>([]);
  const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
      onClick() {
        if (option.key === '0') {
          if (classId.value !== 0) {
            classId.value = 0;
            reloadTable();
          }
        } else {
          if (!option.hasChildren) {
            const changeId = option.key ? parseInt(option.key.toString(), 10) : 0;
            if (changeId > 0 && changeId !== classId.value) {
              classId.value = changeId;
              reloadTable();
            }
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
    let params = {} as ProductPageParams;
    if (classId.value !== 0) {
      params.classId = classId.value;
    }
    if (fieldsValue.hasOwnProperty('status')) {
      params.status = fieldsValue.status;
    }
    if (fieldsValue.hasOwnProperty('types')) {
      params.types = fieldsValue.types;
    }
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    params.index = res.current;
    params.size = res.size;
    queryRef.value = getFieldsValue();

    const result = (await getProductPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageProduct;
    };
    if (result.status === 'success') {
      dataList.value = result.data.records;
      dataPage.value.page = result.data.current;
      dataPage.value.pageSize = result.data.size;
      dataPage.value.pageCount = result.data.pages;
      dataPage.value.itemCount = result.data.total;
      return result.data;
    } else {
      dataList.value = [];
      dataPage.value.page = res.page;
      dataPage.value.pageSize = res.pageSize;
      dataPage.value.pageCount = 1;
      dataPage.value.itemCount = 0;
      return {
        records: [],
        total: 0,
        current: dataPage.value.page,
        pages: 1,
        size: dataPage.value.pageSize,
      };
    }
  };

  const handleDropSelect = (key: string | number, option: DropdownOption) => {
    const record: any = option.record;
    if (key === 'device') {
      router.push({ path: '/devices/device', query: { productId: record.productId } });
    } else if (key === 'productModel') {
      optionProductModel(record);
    } else if (key === 'productStatus') {
      optionProductStatus(record);
    } else if (key === 'delete') {
      handleDel(record);
    }
  };

  //页码切换
  const updatePage = (page: number) => {
    dataPage.value.page = page;
    if (actionRef.value) {
      actionRef.value.updatePage(page);
    }
  };

  //分页数量切换
  const updatePageSize = (size: number) => {
    dataPage.value.page = 1;
    dataPage.value.pageSize = size;
    if (actionRef.value) {
      actionRef.value.updatePageSize(size);
    }
  };

  // 切换数据显示，表格或卡片
  const handleDataView = () => {
    if (viewTable.value) {
      viewTable.value = false;
    } else {
      viewTable.value = true;
    }
  };

  // 刷新表格
  const reloadTable = async () => {
    actionRef.value.reload();
  };

  // 查看
  const handleView = (record: Recordable) => {
    let attributeArray: { label: string; value: string }[];
    if (record.attribute === null || record.attribute === '' || record.attribute === '[]') {
      attributeArray = [];
    } else {
      attributeArray = JSON.parse(record.attribute);
    }

    formParams.value = {
      productId: record.productId,
      productName: record.productName,
      className: record.productClass.className,
      models: record.models,
      images: record.images,
      attribute: record.attribute,
      attributeArray,
      types: record.types + '',
      manufacturer: record.manufacturer,
      supplier: record.supplier,
      firmwareId: record.firmwareId,
      firmwareName: record.firmwareId > 0 ? record.firmware.firmwareName : '',
      driveCode: record.driveCode,
      driveName: record.drive.driveName,
      trans: record.trans,
      collectType: record.collectType + '',
      authMethod: record.authMethod + '',
      netMethod: record.netMethod + '',
      locateMethod: record.locateMethod + '',
      authEquipment: record.authEquipment === 1 ? true : false,
      remark: record.remark,
    };
    showViewModal.value = true;
  };

  // 产品模型
  const optionProductModel = (record: Recordable) => {
    formParams.value = {
      productId: record.productId,
      productName: record.productName,
    };
    showIotModal.value = true;
  };

  // 待发布/已发布
  const optionProductStatus = async (record: Recordable) => {
    const status = record.status === 1 ? 2 : 1;
    const params = {
      id: record.productId,
      status,
    };

    try {
      const result = (await editProductStatus(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        window['$message'].success('状态变更成功');
        reloadTable();
      } else {
        window['$message'].error(result.message);
      }
    } catch (error) {
      window['$message'].error('状态变更失败');
    }
  };

  // 新增
  const handleAdd = () => {
    const attributeArray = [
      {
        label: '',
        value: '',
      },
    ];
    formParams.value = {
      productId: 0,
      productName: '',
      classId: classId.value > 0 ? classId.value + '' : null,
      models: '',
      images: '',
      attribute: '',
      attributeArray,
      types: '2',
      manufacturer: '',
      supplier: '',
      firmwareId: 0,
      firmwareName: '',
      driveCode: '',
      driveName: '',
      trans: 'bem-json',
      collectType: '0',
      authMethod: '1',
      netMethod: '1',
      locateMethod: '0',
      authEquipment: false,
      remark: '',
    };
    modalTitle.value = '新增产品';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    let attributeArray: { label: string; value: string }[];
    if (record.attribute === null || record.attribute === '' || record.attribute === '[]') {
      attributeArray = [
        {
          label: '',
          value: '',
        },
      ];
    } else {
      attributeArray = JSON.parse(record.attribute);
    }

    formParams.value = {
      productId: record.productId,
      productName: record.productName,
      classId: record.classId + '',
      models: record.models,
      images: record.images,
      attribute: record.attribute,
      attributeArray,
      types: record.types + '',
      manufacturer: record.manufacturer,
      supplier: record.supplier,
      firmwareId: record.firmwareId,
      firmwareName: record.firmwareId > 0 ? record.firmware.firmwareName : '',
      driveCode: record.driveCode,
      driveName: record.drive.driveName,
      trans: record.trans,
      collectType: record.collectType + '',
      authMethod: record.authMethod + '',
      netMethod: record.netMethod + '',
      locateMethod: record.locateMethod + '',
      authEquipment: record.authEquipment === 1 ? true : false,
      remark: record.remark,
    };
    modalTitle.value = '编辑产品';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.productId,
    };

    try {
      const result = (await delProductById(params)) as unknown as {
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

  // 查询点击
  const handleSubmit = () => {
    reloadTable();
  };

  // 重置点击
  const handleReset = () => {
    reloadTable();
  };

  onMounted(async () => {
    data.value = await createTreeData();
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
      .card-box {
        width: 100%;
        position: relative;
        .status-box {
          width: 80px;
          height: 32px;
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
        }
        .top-line {
          width: 100%;
          height: 100px;
          padding: 15px;
          .images {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            background-size: cover;
            background-position: center;
            float: left;
          }
          .icons {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            background-color: #e4f0fd;
            display: flex;
            justify-content: center;
            align-items: center;
            float: left;
            img {
              width: 36px;
              height: 36px;
            }
          }
          .labels {
            height: 60px;
            margin-left: 75px;
            .names {
              width: 100%;
              height: 34px;
              font-size: 16px;
            }
            .tags {
              width: 100%;
              height: 22px;
            }
          }
        }
        .item-line {
          width: 100%;
          padding: 0 15px 15px 15px;
          border-bottom: 1px solid #ebeef5;
        }
      }
      .page-line {
        width: 100%;
        height: 28px;
        margin-top: 10px;
        position: relative;
        .pager {
          width: auto;
          height: 28px;
          float: right;
        }
      }
    }
  }
</style>
