<template>
  <div class="main-panner">
    <div class="left-block">
      <div class="left-pannel">
        <div class="head-line">
          <div class="head-label">NVR设备列表</div>
          <div class="head-search">
            <n-input
              maxlength="20"
              v-model:value="queryKey"
              type="text"
              placeholder="请输入关键字"
              clearable
              @keyup="handleKeyUp"
              @clear="handleKeyClear"
            />
          </div>
        </div>
        <div class="data-pannel">
          <div
            :class="checkDeviceId === item.deviceId ? 'data-line checks' : 'data-line'"
            v-for="item in deviceList"
            :key="item.deviceId"
            @click="handleSelectDevice(item)"
          >
            <div class="pl-label">{{ item.deviceName }}</div>
            <div class="pl-line">
              <div class="pl-icon">
                <n-icon size="14" color="#999">
                  <TagsOutlined />
                </n-icon>
              </div>
              <div class="pl-value">{{ item.spaceRouteName }}</div>
            </div>
            <div class="pl-line">
              <div class="pl-icon">
                <n-icon size="14" color="#999">
                  <EnvironmentOutlined />
                </n-icon>
              </div>
              <div class="pl-value">{{ item.param.ipAddress }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-block">
      <n-card :bordered="false" size="small">
        <div class="head-line">录像通道</div>
        <div>
          <BasicTable
            :columns="columns"
            :request="loadDataTable"
            :row-key="(row) => row.channelId"
            ref="actionRef"
            :actionColumn="actionColumn"
            :striped="true"
            :headShow="false"
          />
        </div>
      </n-card>
    </div>
  </div>
  <VideoPlayerModal :showModel="showModal" :params="checkData" @close="() => (showModal = false)" />
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getDeviceList, DeviceParams } from '@/api/devices/device';
  import { getDeviceChannelPageList, DeviceChannelPageParams } from '@/api/video/deviceChannel';
  import { columns } from './columns';
  // @ts-ignore
  import { EnvironmentOutlined, TagsOutlined } from '@vicons/antd';
  import { debounce } from 'lodash-es';
  // @ts-ignore
  import VideoPlayerModal from './VideoPlayerModal.vue';

  const queryKey: any = ref('');
  const deviceList: any = ref<any[]>([]);
  const checkDeviceId = ref('');
  const actionRef = ref();
  const showModal = ref(false);
  const checkData = ref<any>({});

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
              label: '录像回放',
              onClick: handlePlayer.bind(null, record),
            },
          ],
        });
      },
    });
  };
  // 表格操作列对象
  const actionColumn = actionCell();

  // 查询NVR设备
  const debouncedHandleQuery = debounce(async () => {
    if (queryKey.value) {
      deviceList.value = await loadNvrList();
    } else {
      deviceList.value = [];
    }
  }, 500);
  const handleKeyUp = () => {
    debouncedHandleQuery();
  };
  const handleKeyClear = async () => {
    queryKey.value = '';
    checkDeviceId.value = '';
    reloadTable();
  };

  /**
   * 获取NVR设备
   * @param res 响应数据
   */
  const loadNvrList = async () => {
    let params = {} as DeviceParams;
    params.types = 4;
    params.status = 3;
    if (queryKey.value.trim() !== '') {
      params.key = queryKey.value.trim();
    }

    const result = (await getDeviceList(params)) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      deviceList.value = result.data;
      if (result.data.length > 0) {
        checkDeviceId.value = result.data[0].deviceId;
        reloadTable();
      }
    } else {
      deviceList.value = [];
      checkDeviceId.value = '';
      reloadTable();
    }
  };

  // 选中NVR设备
  const handleSelectDevice = (item: any) => {
    if (checkDeviceId.value !== item.deviceId) {
      checkDeviceId.value = item.deviceId;
      reloadTable();
    }
  };

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    if (checkDeviceId.value !== '') {
      let params = {} as DeviceChannelPageParams;
      params.deviceId = checkDeviceId.value;
      params.channelType = 140;
      params.index = res.page || res.current;
      params.size = res.pageSize || res.size;

      const result = (await getDeviceChannelPageList(params)) as unknown as {
        status: string;
        message: string;
        data: any;
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

  // 录像播放
  const handlePlayer = (record: Recordable) => {
    checkData.value = record;
    showModal.value = true;
  };

  onMounted(async () => {
    loadNvrList();
  });
</script>

<style lang="less" scoped>
  .main-panner {
    width: 100%;
    height: 100%;
    padding-bottom: 125px;
    padding-right: 220px;
    position: fixed;
    top: 110px;
    left: 210px;
    z-index: 10;
    .left-block {
      width: 250px;
      height: 100%;
      float: left;
      .left-pannel {
        width: 100%;
        height: 100%;
        padding: 10px;
        background-color: #ffffff;
        border-radius: 6px;
        position: relative;
        .head-line {
          width: 100%;
          padding: 10px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          .head-label {
            width: 100%;
            height: 42px;
            line-height: 32px;
            font-size: 16px;
            font-weight: 600;
          }
          .head-search {
            width: 100%;
            height: 34px;
          }
        }
        .data-pannel {
          width: 100%;
          height: 100%;
          padding-top: 92px;
          overflow-y: auto;
          .data-line {
            width: 100%;
            padding: 10px;
            border: 1px solid #eeeeee;
            border-radius: 4px;
            margin-bottom: 10px;
            cursor: pointer;
            .pl-label {
              width: 100%;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 6px;
            }
            .pl-line {
              width: 100%;
              height: 16px;
              .pl-icon {
                width: 16px;
                height: 16px;
                float: left;
              }
              .pl-value {
                height: 16px;
                line-height: 16px;
                margin-left: 16px;
                font-size: 12px;
                color: #999999;
              }
            }
          }
          .checks {
            background-color: #f7fbff;
          }
        }
      }
    }
    .right-block {
      height: 100%;
      margin-left: 265px;
      min-height: 100px;
      overflow-y: auto;
      .head-line {
        width: 100%;
        height: 42px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .card-content {
    width: 100%;
    height: 100%;
    padding: 0px 0px 20px 0px;
    color: #333333;
    font-size: 14px;
    .card-info {
      width: 100%;
      height: 48px;
      margin-bottom: 15px;
      padding: 10px 10px 10px 10px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
    .q-box {
      width: 100%;
      position: relative;
      .q-line {
        width: 100%;
        height: 24px;
        background-color: #ffffff;
        margin: 5px 0px;
        .item-icon {
          width: 24px;
          height: 22px;
          text-align: center;
          float: left;
        }
        .item-label {
          height: 22px;
          line-height: 22px;
          margin-left: 26px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .q-line:hover {
        background-color: #f5f5f5;
      }
      .active {
        background-color: #eaf3fd;
      }
    }
  }
</style>
