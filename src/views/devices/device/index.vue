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
            :data="data"
            :expand-on-click="false"
            :default-expanded-keys="['0']"
            :node-props="nodeProps"
          />
        </div>
      </n-card>
    </div>
    <div class="right-block">
      <n-card :bordered="false">
        <n-row style="padding-bottom: 15px">
          <n-col :span="12">
            <n-button style="margin-right: 10px" type="primary" v-if="addAuth" @click="handleAdd">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              新增设备
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
            <ImportExcel
              type="primary"
              :authShow="importAuth"
              modelPath="/user/modelExcel"
              importPath="/user/importExcel"
              @import-change="reloadTable"
            />
            <ExportExcel
              type="primary"
              :authShow="exportAuth"
              :queryData="queryRef"
              apiPath="/user/exportExcel"
            />
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
            :row-key="(row) => (row.deviceId ? row.deviceId : 'row_' + Math.random())"
            ref="actionRef"
            :actionColumn="actionColumn"
            :scroll-x="3260"
            :headShow="false"
            @update:checked-row-keys="onCheckedRow"
          />
        </div>
        <div v-show="!viewTable">
          <n-grid x-gap="15" cols="3 s:1 m:2 l:2 xl:3 2xl:3">
            <n-gi v-for="(item, index) in dataList" :key="index">
              <n-card
                content-style="padding: 0px;"
                footer-style="padding: 10px 15px; background: ##fafafc"
                style="margin-top: 7px; margin-bottom: 7px"
              >
                <div class="card-box">
                  <div class="top-line">
                    <div class="icons" v-if="item.installImg === null || item.installImg === ''">
                      <img
                        alt=""
                        src="/src/assets/images/zlsb.png"
                        v-if="item.product.types === 1"
                      />
                      <img
                        alt=""
                        src="/src/assets/images/wgsb.png"
                        v-if="item.product.types === 2"
                      />
                      <img
                        alt=""
                        src="/src/assets/images/jksb.png"
                        v-if="item.product.types === 3"
                      />
                      <img
                        alt=""
                        src="/src/assets/images/zsb.png"
                        v-if="item.product.types === 4"
                      />
                      <img
                        alt=""
                        src="/src/assets/images/xnsb.png"
                        v-if="item.product.types === 5"
                      />
                    </div>
                    <div
                      class="images"
                      :style="{
                        backgroundImage: 'url(' + globSetting.apiUrl + item.installImg + ')',
                      }"
                      v-else
                    >
                    </div>
                    <div class="labels">
                      <div class="names">{{ item.deviceName }}</div>
                      <div class="tags">
                        <n-tag
                          size="small"
                          :type="item.online === 0 ? 'warning' : 'success'"
                          style="margin-right: 10px"
                          >{{ item.online === 0 ? '离线' : '在线' }}</n-tag
                        >
                        <n-tag
                          size="small"
                          :color="{ color: '#fff', borderColor: '#ccc', textColor: '#999' }"
                          style="margin-right: 10px"
                          >{{ item.product?.trans }}</n-tag
                        >
                        <n-tag
                          size="small"
                          :color="{ color: '#fff', borderColor: '#ccc', textColor: '#999' }"
                          >{{ item.spaceRouteName }}</n-tag
                        >
                      </div>
                    </div>
                  </div>
                  <div class="item-box">
                    <div class="item-line">
                      <div class="item-col">
                        <div class="itemLabel">编号:</div>
                        <div class="itemValue">{{ item.deviceId }}</div>
                      </div>
                      <div class="item-col">
                        <div class="itemLabel">产品:</div>
                        <div class="itemValue">{{ item.product?.productName }}</div>
                      </div>
                    </div>
                    <div class="item-line">
                      <div class="item-col">
                        <div class="itemLabel">类型:</div>
                        <div class="itemValue">
                          {{
                            item.types === 1
                              ? '直连设备'
                              : item.types === 2
                              ? '网关设备'
                              : item.types === 3
                              ? '监控设备'
                              : item.types === 4
                              ? '视频存储设备'
                              : item.types === 5
                              ? '网关子设备'
                              : '虚拟设备'
                          }}
                        </div>
                      </div>
                      <div class="item-col">
                        <div class="itemLabel">分组:</div>
                        <div class="itemValue">{{ item.group?.groupName }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <template v-if="viewAuth || editAuth || deleteAuth" #footer>
                  <div style="text-align: center">
                    <n-button style="width: 33%" quaternary type="info" @click="handleView"
                      >详情</n-button
                    >
                    <n-button
                      style="width: 33%"
                      quaternary
                      type="info"
                      v-if="editAuth"
                      @click="handleEdit"
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
                          label: '设备模型',
                          key: 'deviceModel',
                          show: editAuth,
                          record: item,
                        },
                        {
                          label:
                            item.status === 1
                              ? '激活设备'
                              : item.status === 2
                              ? '启用设备'
                              : '禁用设备',
                          key: 'deviceStatus',
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
    :spaceOption="data"
    :groupOption="groupData"
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
    getDevicePageList,
    updateStatus,
    delDeviceById,
    delDeviceByIds,
    DevicePageParams,
  } from '@/api/devices/device';
  import { getPositionTree } from '@/api/base/position';
  import { getDeviceGroupList } from '@/api/base/deviceGroup';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  import { useGlobSetting } from '@/hooks/setting';
  import { useRoute } from 'vue-router';
  // @ts-ignore
  import {
    PlusOutlined,
    DeleteOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
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
  const route = useRoute();
  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('device');
  const viewAuth = auth.view;
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;
  const importAuth = auth.import;
  const exportAuth = auth.export;

  //数据定义
  const viewTable = ref(true); //表格视图切换
  const queryRef: any = ref(null);
  const spaceId = ref(0);
  const actionRef = ref();
  const checkRow: any = ref(null);
  const showModal = ref(false);
  const showViewModal = ref(false);
  const showIotModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const groupData = ref<any[]>([]);
  const formParams = ref<any>({});
  const dataList = ref<any[]>([]);
  const dataPage = ref<any>([]);

  // 查询组件
  const schemas: FormSchema[] = [
    {
      field: 'groupId',
      component: 'NSelect',
      label: '分组',
      componentProps: {
        placeholder: '请选择',
        options: groupData,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            value: '1',
            label: '未激活',
          },
          {
            value: '3',
            label: '启用',
          },
          {
            value: '2',
            label: '禁用',
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
              label: '设备编号',
              value: 'code',
            },
            {
              label: '设备名称',
              value: 'name',
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
    gridProps: { cols: '1 s:1 m:2 l:4 xl:4 2xl:4' },
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
                label: '物模型',
                key: 'deviceModel',
                ifShow: () => {
                  return editAuth;
                },
              },
              {
                label:
                  record.status === 1 ? '激活设备' : record.status === 2 ? '启用设备' : '禁用设备',
                key: 'deviceStatus',
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
                router.push('/devices/device?productId=' + record.productId);
              } else if (key === 'deviceModel') {
                optionDeviceModel(record);
              } else if (key === 'deviceStatus') {
                optionDeviceStatus(record);
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
   * 获取设备位置树
   */
  const createTreeData = async () => {
    const result = (await getPositionTree()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      let node = {
        key: '0',
        label: '全部位置',
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
          if (spaceId.value !== 0) {
            spaceId.value = 0;
            reloadTable();
          }
        } else {
          const changeId = option.key ? parseInt(option.key.toString(), 10) : 0;
          if (changeId > 0 && changeId !== spaceId.value) {
            spaceId.value = changeId;
            reloadTable();
          }
        }
      },
    };
  };

  /**
   * 获取设备分组
   */
  const createGroupData = async () => {
    const result = (await getDeviceGroupList()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      const list = result.data;
      let groupList = list.map((item: any) => {
        return {
          label: item.groupName,
          value: item.groupId + '',
        };
      });
      return groupList;
    } else {
      return [];
    }
  };

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as DevicePageParams;
    if (route.query.id) {
      const productId = Array.isArray(route.query.id) ? route.query.id[0] : route.query.id;
      if (productId) {
        params.productId = productId;
      }
    }
    if (spaceId.value !== 0) {
      params.spaceId = spaceId.value;
    }
    if (fieldsValue.hasOwnProperty('groupId')) {
      params.groupId = fieldsValue.groupId;
    }
    if (fieldsValue.hasOwnProperty('status')) {
      params.status = fieldsValue.status;
    }
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    params.index = res.current;
    params.size = res.size;
    queryRef.value = getFieldsValue();

    const result = (await getDevicePageList(params)) as unknown as {
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
      router.push('/devices/device?productId=' + record.productId);
    } else if (key === 'deviceModel') {
      optionDeviceModel(record);
    } else if (key === 'deviceStatus') {
      optionDeviceStatus(record);
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
    let paramsArray = [];
    try {
      if (record.paramsData) {
        paramsArray = JSON.parse(record.paramsData);
      }
    } catch (e) {
      console.error('解析paramsData失败:', e);
      paramsArray = [];
    }

    formParams.value = {
      ...record,
      paramsArray,
    };
    showViewModal.value = true;
  };

  // 设备模型
  const optionDeviceModel = (record: Recordable) => {
    formParams.value = {
      deviceId: record.deviceId,
      deviceName: record.deviceName,
    };
    showIotModal.value = true;
  };

  // 更改设备状态
  const optionDeviceStatus = async (record: Recordable) => {
    console.log(record);
    let status: number;
    if (record.status === 1 || record.status === 2) {
      status = 3;
    } else {
      status = 2;
    }
    const params = {
      id: record.deviceId,
      status,
    };

    try {
      const result = (await updateStatus(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        window['$message'].success('变更状态成功');
        reloadTable();
      } else {
        window['$message'].error(result.message);
      }
    } catch (error) {
      window['$message'].error('变更状态失败');
    }
  };

  // 新增
  const handleAdd = () => {
    const paramsArray = [];
    const monitoring = {
      deviceId: '',
      serverId: '',
      serverName: '',
      serverType: 'media',
      ipAddress: '',
      port: '',
      account: '',
      password: '',
      ptzType: '0',
    };

    formParams.value = {
      deviceId: '',
      deviceName: '',
      productId: '',
      productName: '',
      groupId: null,
      spaceId: spaceId.value > 0 ? spaceId.value + '' : null,
      spaceRoute: '',
      gatewayId: '',
      gatewayName: '',
      locateMethod: '0',
      openShadow: false,
      address: '',
      ipAddress: '',
      longitude: '',
      latitude: '',
      installImg: '',
      firmwareVersion: '',
      serverKey: '',
      videoDomain: '',
      mainChannel: 0,
      channelId: '',
      remark: '',
      paramsData: '',
      paramsArray,
      monitoring,
      types: 0,
    };

    modalTitle.value = '新增设备';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    let paramsArray = [];
    let monitoring = {
      deviceId: '',
      serverId: '',
      serverName: '',
      serverType: 'media',
      ipAddress: '',
      port: '',
      account: '',
      password: '',
      ptzType: '0',
    };
    console.log(record.param);
    if (record.types === 3 || record.types === 4) {
      const monitor = record.param;
      monitoring = {
        deviceId: monitor.deviceId,
        serverId: monitor.serverId,
        serverName: monitor.server.serverName,
        serverType: monitor.serverType,
        ipAddress: monitor.ipAddress,
        port: monitor.port + '',
        account: monitor.account,
        password: monitor.password,
        ptzType: monitor.ptzType + '',
      };
    } else {
      paramsArray = record.params;
    }

    formParams.value = {
      deviceId: record.deviceId,
      deviceName: record.deviceName,
      productId: record.productId,
      productName: record.product.productName,
      groupId: record.groupId === 0 ? null : record.groupId + '',
      spaceId: record.spaceId + '',
      spaceRoute: record.spaceRoute,
      spaceRouteName: record.spaceRouteName,
      gatewayId: record.gatewayId,
      gatewayName: record.gateway?.deviceName,
      locateMethod: record.locateMethod + '',
      openShadow: record.openShadow === 1 ? true : false,
      address: record.address,
      ipAddress: record.ipAddress,
      longitude: record.longitude + '',
      latitude: record.latitude + '',
      installImg: record.installImg,
      firmwareVersion: record.firmwareVersion,
      serverKey: record.serverKey,
      videoDomain: record.videoDomain,
      mainChannel: record.mainChannel,
      channelId: record.channelId,
      remark: record.remark,
      paramsData: record.paramsData,
      paramsArray,
      monitoring,
      types: record.product.types,
    };
    console.log(formParams.value);
    modalTitle.value = '编辑设备';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.deviceId,
    };

    try {
      const result = (await delDeviceById(params)) as unknown as {
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

    const result = (await delDeviceByIds(params)) as unknown as {
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
    data.value = await createTreeData();
    groupData.value = await createGroupData();
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
        .top-line {
          width: 100%;
          height: 80px;
          padding: 10px 15px;
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
        .item-box {
          width: 100%;
          padding: 0 15px 10px 0px;
          border-bottom: 1px solid #ebeef5;
          .item-line {
            width: 100%;
            height: 28px;
            .item-col {
              width: 50%;
              height: 28px;
              font-size: 13px;
              float: left;
              .itemLabel {
                width: 54px;
                height: 28px;
                padding-left: 15px;
                color: #8e8e8e;
                float: left;
              }
              .itemValue {
                height: 28px;
                margin-left: 54px;
                color: #5e5e5e;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
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
