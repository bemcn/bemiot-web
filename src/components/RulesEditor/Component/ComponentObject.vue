<template>
  <!-- 组件对象 -->
  <div class="obj-panner">
    <div class="panner">
      <div v-for="g in localData.group" :key="g.value">
        <div class="label">{{ g.label }}</div>
        <div v-for="(item, index) in localData[g.value]" :key="index">
          <div class="lines" v-if="item.editor === 1">
            <div class="title">{{ item.name }}</div>
            <div class="value2">
              <n-input
                type="text"
                size="tiny"
                :placeholder="item.name"
                :value="String(item.value)"
                :allow-input="
                  item.valueBase === 'int'
                    ? onlyAllowInt
                    : item.valueBase === 'number'
                    ? onlyAllowNumber
                    : ''
                "
                v-if="item.fromInput === 'input'"
              />
              <n-input-group v-if="item.fromInput === 'bindModel'">
                <n-input
                  type="text"
                  size="tiny"
                  :value="String(item.value)"
                  :style="{ width: '80%' }"
                  readonly
                />
                <n-button size="tiny" tertiary @click="handleBindModel(localData.node)">
                  <template #icon>
                    <n-icon><EllipsisOutlined /></n-icon>
                  </template>
                </n-button>
              </n-input-group>
              <n-input-group v-if="item.fromInput === 'bindTable'">
                <n-input
                  type="text"
                  size="tiny"
                  :value="String(item.value)"
                  :style="{ width: '80%' }"
                  readonly
                />
                <n-button size="tiny" tertiary @click="handleBindTable(localData.node)">
                  <template #icon>
                    <n-icon><EllipsisOutlined /></n-icon>
                  </template>
                </n-button>
              </n-input-group>
              <n-input-group v-if="item.fromInput === 'bindEditor'">
                <n-input
                  type="text"
                  size="tiny"
                  :value="String(item.value)"
                  :style="{ width: '80%' }"
                />
                <n-button size="tiny" tertiary @click="handleBindEditor(localData.node)">
                  <template #icon>
                    <n-icon><EllipsisOutlined /></n-icon>
                  </template>
                </n-button>
              </n-input-group>
            </div>
          </div>
          <div class="lines" v-else>
            <div class="title">{{ item.name }}</div>
            <div class="values" v-if="item.valueBase === 'linkArray'">
              <div class="vals" v-if="item.value === null">--</div>
              <div v-else>
                <div class="itemValue" v-for="linkId in item.value" :key="linkId">
                  <div class="xLabel">{{ linkId }}</div>
                </div>
              </div>
            </div>
            <div class="value1" v-else>{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { canvasData } from './columns';
  // @ts-ignore
  import { EllipsisOutlined } from '@vicons/antd';

  const props = defineProps({
    data: {
      type: Object as PropType<any>,
      default: () => {},
    },
  });

  // 回调
  const emit = defineEmits(['submitModel', 'submitData', 'submitEditor', 'submit']);

  const localData: any = ref(canvasData);

  watch([() => props.data], ([newData]) => {
    if (newData) {
      localData.value = newData;
    } else {
      localData.value = canvasData;
    }
  });

  const onlyAllowNumber = (value: string) => !value || /^[\d.]+$/.test(value);
  const onlyAllowInt = (value: string) => !value || /^\d+$/.test(value);

  // 编辑物模型绑定
  const handleBindModel = (data: any) => {
    emit('submitModel', data);
  };
  // 编辑元数据绑定
  const handleBindTable = (data: any) => {
    emit('submitData', data);
  };

  const handleBindEditor = (data: any) => {
    emit('submitEditor', data);
  };

  onMounted(async () => {
    localData.value = canvasData;
  });
</script>
<style lang="less" scoped>
  .obj-panner {
    width: 100%;
    height: 100%;
    padding-top: 32px;
    .panner {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      .label {
        width: 100%;
        height: 28px;
        padding: 0px 10px;
        font-size: 14px;
        font-weight: 600;
        line-height: 28px;
        background-color: #efefef;
      }
      .lines {
        width: 100%;
        min-height: 33px;
        padding: 0px 10px;
        border-bottom: 1px solid #eeeeee;
        .title {
          width: 70px;
          height: 32px;
          line-height: 32px;
          font-size: 13px;
          color: #333333;
          float: left;
        }
        .value1 {
          height: 32px;
          color: #888888;
          font-size: 13px;
          line-height: 32px;
          margin-left: 70px;
          padding-left: 10px;
          border-left: 1px solid #eeeeee;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .value2 {
          height: 32px;
          margin-left: 70px;
          padding-top: 6px;
          border-left: 1px solid #eeeeee;
          padding-left: 10px;
          :deep(.n-input) {
            --n-border: 0px !important;
            --n-border-disabled: 0px !important;
            --n-border-hover: 0px !important;
            --n-border-focus: 0px !important;
            --n-border-radius: 0px !important;
            --n-border-warning: 0px !important;
            --n-border-focus-warning: 0px !important;
            --n-border-hover-warning: 0px !important;
            --n-border-error: 0px !important;
            --n-border-focus-error: 0px !important;
            --n-border-hover-error: 0px !important;
            --n-box-shadow-active: 0px !important;
            --n-box-shadow-focus: 0px !important;
          }
          :deep(.n-input .n-input-wrapper) {
            padding: 0px;
          }
          :deep(.n-color-picker) {
            --n-border: 0px !important;
            --n-border-radius: 0px !important;
          }
          :deep(.n-color-picker-trigger .n-color-picker-trigger__fill) {
            left: 0px;
            right: 0px;
            top: 2px;
            bottom: 2px;
          }
          :deep(.n-color-picker-trigger__value) {
            font-size: 12px;
          }
          :deep(.n-base-selection) {
            --n-border: 0px !important;
            --n-border-active: 0px !important;
            --n-border-focus: 0px !important;
            --n-border-hover: 0px !important;
            --n-border-radius: 0px !important;
            --n-border-warning: 0px !important;
            --n-border-focus-warning: 0px !important;
            --n-border-hover-warning: 0px !important;
            --n-border-active-warning: 0px !important;
            --n-border-error: 0px !important;
            --n-border-focus-error: 0px !important;
            --n-border-hover-error: 0px !important;
            --n-border-active-error: 0px !important;
            --n-box-shadow-active: 0px !important;
            --n-box-shadow-focus: 0px !important;
          }
          :deep(.n-base-selection-input) {
            padding: 0px;
          }
        }
        .values {
          margin-left: 70px;
          color: #888888;
          font-size: 13px;
          border-left: 1px solid #eeeeee;
          padding-left: 10px;
          .vals {
            height: 32px;
            line-height: 32px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .itemValue {
            width: 100%;
            height: 32px;
            border-top: 1px double #eeeeee;
            .mores {
              width: 32px;
              height: 32px;
              padding-top: 5px;
              text-align: right;
              float: right;
            }
            .valLabel {
              height: 32px;
              margin-right: 36px;
              line-height: 32px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .xLabel {
              height: 32px;
              line-height: 32px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .itemValue:first-child {
            border-top: 0px;
          }
        }
      }
    }
  }

  .viewBox {
    width: 280px;
    padding-bottom: 10px;
    color: #ffffff;
    .viewTitle {
      width: 100%;
      height: 28px;
      font-size: 14px;
      font-weight: 600;
    }
    .tableBox {
      width: 100%;
      border: 1px solid #999999;
      .thBodyLine {
        width: 100%;
        height: 25px;
        border-top: 1px solid #999999;
        font-size: 13px;
        padding: 0px 10px;
        .tdLeft {
          width: 70px;
          height: 24px;
          line-height: 24px;
          color: #999999;
          float: left;
        }
        .tdRight {
          height: 24px;
          line-height: 24px;
          margin-left: 80px;
          text-align: right;
          color: #cccccc;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .thBodyLine:first-child {
        border-top: none;
      }
    }
  }
</style>
