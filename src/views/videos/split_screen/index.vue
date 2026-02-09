<template>
  <div class="main-panner">
    <!--分屏显示-->
    <div class="main-box">
      <n-grid cols="12" responsive="screen" :x-gap="15" :y-gap="15" style="height: 100%">
        <n-grid-item span="3">
          <n-card size="small" :bordered="false" style="min-height: 600px">
            <template #header>
              <n-input
                maxlength="20"
                v-model:value="queryKey"
                type="text"
                placeholder="请输入关键字"
                clearable
                @keyup="handleKeyUp"
                @clear="handleKeyClear"
              />
            </template>
            <div class="card-content" style="max-height: 600px; overflow-y: auto">
              <n-tree
                block-line
                :data="treeOptions"
                :expand-on-click="true"
                :default-expanded-keys="['0']"
                :node-props="nodeProps"
                v-show="!queryKey"
              />
              <div class="q-box" v-show="queryKey">
                <div class="q-line">
                  <div class="item-icon">
                    <n-icon size="10" color="#777">
                      <CaretRightFilled />
                    </n-icon>
                  </div>
                  <div class="item-label">主楼1</div>
                </div>
                <div class="q-line">
                  <div class="item-icon">
                    <n-icon size="10" color="#777">
                      <CaretRightFilled />
                    </n-icon>
                  </div>
                  <div class="item-label">主楼1</div>
                </div>
                <div class="q-line">
                  <div class="item-icon">
                    <n-icon size="10" color="#777">
                      <CaretRightFilled />
                    </n-icon>
                  </div>
                  <div class="item-label">主楼1</div>
                </div>
              </div>
            </div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="9" style="height: 100%">
          <n-card size="small" :bordered="false" style="height: 100%; padding: 0px 10px 15px 10px">
            <template #header>
              <n-button
                :type="splitNum === 1 ? 'primary' : 'default'"
                style="margin-right: 15px"
                @click="handleSplit(1)"
              >
                <template #icon>
                  <n-icon>
                    <ExpandOutlined />
                  </n-icon>
                </template>
                单屏
              </n-button>
              <n-button
                :type="splitNum === 2 ? 'primary' : 'default'"
                style="margin-right: 15px"
                @click="handleSplit(2)"
              >
                <template #icon>
                  <n-icon>
                    <AppstoreOutlined />
                  </n-icon>
                </template>
                四屏
              </n-button>
              <n-button :type="splitNum === 3 ? 'primary' : 'default'" @click="handleSplit(3)">
                <template #icon>
                  <n-icon>
                    <TableOutlined />
                  </n-icon>
                </template>
                九屏
              </n-button>
            </template>
            <div class="card-content">
              <n-grid :x-gap="6" :y-gap="6" :cols="splitNum" style="height: 100%">
                <n-gi v-for="num in blockNum" :key="num" :class="selectIndex === num ? 'v-box active' : 'v-box'" @click="handleBoxClick(num)">
                  <div class="default-box">{{ num }}</div>
                </n-gi>
              </n-grid>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { getDevicesTree } from '@/api/devices/device';
  import { getDeviceGroupList } from '@/api/base/deviceGroup';
  import { getProductList } from '@/api/devices/product';
  import { TreeOption, useMessage } from 'naive-ui';
  // @ts-ignore
  import { CaretRightFilled, ExpandOutlined, AppstoreOutlined, TableOutlined } from '@vicons/antd';
  // @ts-ignore
  import MapBox from './MapBox.vue';
  import { debounce } from 'lodash-es';

  const queryParams = ref({
    types: null,
    groupId: null,
    userId: null,
    spaceId: null as number | null,
    productId: null,
  });
  const treeOptions = ref<any[]>([]);
  const queryKey = ref('');
  const splitNum = ref(1);
  const blockNum = ref(1);
  const selectIndex = ref(0);

  /**
   * 获取设备位置树
   */
  const createTreeData = async () => {
    const params = {
      types: 3,
      lastType: 2,
    };

    const result = (await getDevicesTree(params)) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [];
    }
  };
  const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
      onClick() {
        if (option.key === '0') {
          if (queryParams.value.spaceId !== 0) {
            queryParams.value.spaceId = 0;
            //reloadTable();
          }
        } else {
          const changeId = option.key ? parseInt(option.key.toString(), 10) : 0;
          if (changeId > 0 && changeId !== queryParams.value.spaceId) {
            queryParams.value.spaceId = changeId;
            //reloadTable();
          }
        }
      },
    };
  };
  // 防抖处理查询函数
  const debouncedHandleQuery = debounce(() => {
    if (queryKey.value) {
      console.log('OK');
    } else {
      console.log('NULL');
    }
    console.log('key:', queryKey.value);
  }, 500);
  const handleKeyUp = () => {
    debouncedHandleQuery();
  };
  const handleKeyClear = () => {
    queryKey.value = '';
  };

  // 分屏切换
  const handleSplit = (num: number) => {
    splitNum.value = num;
    blockNum.value = num * num;
  };

  // 选中分屏
  const handleBoxClick = (index: number) => {
    if (index === selectIndex.value) {
      selectIndex.value = 0;
    } else {
      selectIndex.value = index;
    }
  };

  onMounted(async () => {
    treeOptions.value = await createTreeData();
  });
</script>

<style lang="less" scoped>
  .main-panner {
    width: 100%;
    height: 100%;
    padding-right: 220px;
    padding-bottom: 128px;
    padding-top: 10px;
    position: fixed;
    top: 108px;
    left: 210px;
    z-index: 1;
    .main-box {
      width: 100%;
      height: 100%;
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
    }
    .v-box {
      height: 100%;
      background-color: #000;
      cursor: pointer;
      .default-box {
        width: 100%;
        height: 100%;
        font-size: 32px;
        color: #fff;
        display: grid;
        place-items: center;
      }
    }
    .active {
      border: 4px solid #409eff;
      background-color: #111111;
    }
  }
</style>
