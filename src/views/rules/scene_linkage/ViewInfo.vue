<template>
  <!-- 查看 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 720px"
    title="查看物模型"
    @after-leave="closeModalAfter"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
      style="padding-top: 0px !important; padding-bottom: 0px !important"
    >
      <div class="from-group">
        <n-form-item label="模型标识">
          <div class="from-value">{{ localParams.modelIdentity }}</div>
        </n-form-item>
        <n-form-item label="模型名称" path="modelName">
          <div class="from-value">{{ localParams.modelName }}</div>
        </n-form-item>
        <n-form-item label="所属分组" path="groupId" v-if="localParams.isGeneral">
          <div class="from-value">{{ localParams.groupName }}</div>
        </n-form-item>
        <n-form-item label="模型类别">
          <div class="from-value">{{
            localParams.modelType == 1 ? '属性' : localParams.modelType == 2 ? '功能' : '事件'
          }}</div>
        </n-form-item>
        <n-form-item label="模型特性">
          <n-tag v-if="localParams.charts == 1" type="success" round style="margin-right: 10px"
            >图表展示</n-tag
          >
          <n-tag v-if="localParams.modelType == 1" type="success" round style="margin-right: 10px"
            >实时监测</n-tag
          >
          <n-tag v-if="localParams.readonly == 1" type="success" round style="margin-right: 10px"
            >只读数据</n-tag
          >
          <n-tag v-if="localParams.history == 1" type="success" round style="margin-right: 10px"
            >历史存储</n-tag
          >
          <n-tag v-if="localParams.share == 1" type="success" round>分享权限</n-tag>
        </n-form-item>
      </div>
      <div class="from-group">
        <n-form-item label="数据类型">
          <div class="from-value">{{ escapeDataType(localParams.dataType) }}</div>
        </n-form-item>
        <!-- 数据类型 => int, number -->
        <div
          v-if="showState && (localParams.dataType === 'int' || localParams.dataType === 'number')"
        >
          <n-form-item>
            <template #label>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon size="16" color="#666666">
                    <QuestionCircleFilled />
                  </n-icon>
                </template>
                该取值范围只作用于数据下发，数据上报不受其影响
              </n-tooltip>
              取值范围
            </template>
            <div class="from-value">
              <span>{{ localParams.datas.min }}</span>
              <span style="margin: 0px 10px">到</span>
              <span>{{ localParams.datas.max }}</span>
            </div>
          </n-form-item>
          <n-form-item label="单位">
            <div class="from-value">{{ localParams.datas.unit }}</div>
          </n-form-item>
          <n-form-item label="步长">
            <div class="from-value">{{ localParams.datas.step }}</div>
          </n-form-item>
        </div>
        <!-- 数据类型 => text -->
        <div v-if="showState && localParams.dataType === 'text'">
          <n-form-item label="最大长度">
            <div class="from-value">{{ localParams.datas.maxLength }}</div>
          </n-form-item>
        </div>
        <!-- 数据类型 => date -->
        <div v-if="showState && localParams.dataType === 'date'">
          <n-form-item label="数据格式">
            <div class="from-value">{{ escapeDataSource(localParams.datas.source) }}</div>
          </n-form-item>
          <n-form-item label="输出格式">
            <div class="from-value">{{ localParams.datas.format }}</div>
          </n-form-item>
        </div>
        <!-- 数据类型 => bool -->
        <div v-if="showState && localParams.dataType === 'bool'">
          <n-form-item label="False值">
            <div class="from-value">{{ localParams.datas.falseText }}</div>
          </n-form-item>
          <n-form-item label="True值">
            <div class="from-value">{{ localParams.datas.trueText }}</div>
          </n-form-item>
        </div>
        <!-- 数据类型 => array -->
        <div v-if="showState && localParams.dataType === 'array'">
          <n-form-item label="元素个数">
            <div class="from-value">{{ localParams.datas.length }}</div>
          </n-form-item>
          <n-form-item label="数组类型">
            <div class="from-value">{{
              localParams.datas.itemType === 'int'
                ? '整数'
                : localParams.datas.itemType === 'number'
                ? '小数'
                : '字符串'
            }}</div>
          </n-form-item>
        </div>
        <!-- 数据类型 => enum -->
        <div v-if="showState && localParams.dataType === 'enum'">
          <n-form-item label="展示方式">
            <div class="from-value">{{
              localParams.datas.subassembly === 'select' ? '下拉框' : '按钮'
            }}</div>
          </n-form-item>
          <n-form-item label="枚举项">
            <div class="enum-params">
              <div class="enum-line" v-for="(item, index) in localParams.datas.values" :key="index">
                <div class="from-value">
                  <span>{{ item.value }}</span>
                  <span style="margin: 0px 15px 0px 4px">:</span>
                  <span>{{ item.label }}</span>
                </div>
              </div>
            </div>
          </n-form-item>
        </div>
      </div>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { QuestionCircleFilled } from '@vicons/antd';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        modelIdentity: '',
        modelName: '',
        groupId: null,
        modelType: '1',
        dataType: 'int',
        dataDefinition: '',
        datas: {
          min: null,
          max: null,
          unit: '',
          step: null,
        },
        charts: 0,
        monitor: 0,
        history: 0,
        readonly: 0,
        share: 0,
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formRef: any = ref(null);

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
    // 确保 localParams.value 不为 undefined
    if (newParams) {
      localParams.value = JSON.parse(JSON.stringify(newParams));
      // 如果 datas 不存在，则初始化它
      if (!localParams.value.datas) {
        localParams.value.datas = initDataDefinition(localParams.value.dataType);
      }
    } else {
      localParams.value = {
        modelIdentity: '',
        modelName: '',
        groupId: null,
        modelType: '1',
        dataType: 'int',
        datas: {
          min: null,
          max: null,
          unit: '',
          step: null,
        },
        charts: 0,
        monitor: 0,
        history: 0,
        readonly: 0,
        share: 0,
      };
    }
  });
  const initDataDefinition = (dataType: string) => {
    switch (dataType) {
      case 'int':
      case 'number':
        return {
          min: null,
          max: null,
          unit: '',
          step: null,
        };
      case 'text':
        return {
          maxLength: null,
        };
      case 'date':
        return {
          source: 'timestamp',
          format: 'yyyy-MM-dd',
        };
      case 'bool':
        return {
          falseText: '',
          trueText: '',
        };
      case 'array':
        return {
          length: '0',
          itemType: 'int',
        };
      case 'enum':
        return {
          subassembly: 'select', // select/button
          values: [
            {
              value: '',
              label: '',
            },
          ],
        };
      default:
        return {
          min: null,
          max: null,
          unit: '',
          step: null,
        };
    }
  };

  // 转换数据类型标识
  const escapeDataType = (dataType: string) => {
    switch (dataType) {
      case 'int':
        return '整数';
      case 'number':
        return '小数';
      case 'text':
        return '字符串';
      case 'date':
        return '日期时间';
      case 'bool':
        return '布尔值';
      case 'array':
        return '数组';
      case 'enum':
        return '枚举';
      default:
        return '整数';
    }
  };
  // 转换日期时间来源类型标识
  const escapeDataSource = (dataType: string) => {
    switch (dataType) {
      case 'timestamp':
        return '时间戳';
      case 'date':
        return '日期';
      case 'time':
        return '时间';
      case 'datetime':
        return '日期+时间';
      default:
        return '时间戳';
    }
  };
</script>

<style lang="less" scoped>
  .from-value {
    width: 100%;
    height: 36px;
    line-height: 36px;
    color: #666666;
  }
  .from-group {
    width: 100%;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    padding-top: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
  }

  .enum-params {
    width: 100%;
    .enum-line {
      width: 100%;
      height: 46px;
    }
  }
</style>
