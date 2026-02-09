<template>
  <n-card :bordered="false" size="small">
    <div class="header">
      <div class="label">{{ titleLabel }}</div>
      <div class="btn-pannel">
        <div class="btn-box"
          ><n-button type="info" :loading="formBtnLoading" @click="confirmForm"
            >保存规则</n-button
          ></div
        >
        <div class="btn-box"
          ><n-button type="info" :loading="formBtnLoading" @click="confirmForm"
            >规则测试</n-button
          ></div
        >
        <div class="btn-box"><n-button @click="closeAfter">取消</n-button></div>
      </div>
    </div>
  </n-card>
  <div class="main-pannel" :style="{ height: pannelHeight + 'px' }">
    <div class="main-left">
      <div class="panel-box">
        <div class="card-box">
          <div class="card-head">组件工具</div>
          <div class="box-content">
            <div class="listbox">
              <draggable
                :list="componentList"
                :animation="100"
                item-key="id"
                :forceFallback="true"
                @end="onEndCallback"
              >
                <template #item="{ element }">
                  <div
                    class="item-line"
                    :data-type="element.type"
                    :data-group="element.group"
                    :data-node="element.nodeType"
                    :data-icon="element.iconClass"
                  >
                    <div class="icon">
                      <i :class="'icon-base ' + element.iconClass"></i>
                    </div>
                    <div class="label">{{ element.label }}</div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-right">
      <div class="panel-box">
        <div class="card-box">
          <div class="card-head">组件对象</div>
          <ComponentObject
            :data="selectedElements"
            @submit-model="handleModelSubmit"
            @submit-data="handleDataSubmit"
            @submit-editor="handleEditorSubmit"
          />
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="box-pannel">
        <div id="container" class="container" ref="container"></div>
      </div>
    </div>
  </div>
  <SelectDeviceModel
    :showModel="showModelModal"
    :id="subassemblyId"
    :deviceId="chkDeviceId"
    :identity="chkIdentity"
    :type="modelType"
    @close="() => (showModelModal = false)"
    @checked="editModelData"
  />
  <DataRules
    :showModel="showDataRulesModal"
    :id="subassemblyId"
    :type="modelType"
    :data="dataItemNode"
    @close="() => (showDataRulesModal = false)"
    @submit="editDataData"
  />
  <VariableRules
    :showModel="showVariableModal"
    :data="dataItemNode"
    @close="() => (showVariableModal = false)"
    @submit="editVariableData"
  />
  <RandomRules
    :showModel="showRandomModal"
    :data="dataItemNode"
    @close="() => (showRandomModal = false)"
    @submit="editRandomData"
  />
  <JudgmentRules
    :showModel="showJudgmentModal"
    :data="dataItemNode"
    @close="() => (showJudgmentModal = false)"
    @submit="editJudgmentData"
  />
  <SwitchRules
    :showModel="showSwitchModal"
    :data="dataItemNode"
    @close="() => (showSwitchModal = false)"
    @submit="editSwitchData"
  />
  <OperatorRules
    :showModel="showOperatorModal"
    :data="dataItemNode"
    @close="() => (showOperatorModal = false)"
    @submit="editOperatorData"
  />
  <DateOutputRules
    :showModel="showDateOutputModal"
    :data="dataItemNode"
    @close="() => (showDateOutputModal = false)"
    @submit="editDateOutputData"
  />
  <DateOperatorRules
    :showModel="showDateOperatorModal"
    :data="dataItemNode"
    @close="() => (showDateOperatorModal = false)"
    @submit="editDateOperatorData"
  />
  <FuncRules
    :showModel="showFuncModal"
    :data="dataItemNode"
    @close="() => (showFuncModal = false)"
    @submit="editFuncData"
  />
  <FormatRules
    :showModel="showFormatModal"
    :data="dataItemNode"
    @close="() => (showFormatModal = false)"
    @submit="editFormatData"
  />
  <ExportRules
    :showModel="showExportModal"
    :data="dataItemNode"
    @close="() => (showExportModal = false)"
    @submit="editExportData"
  />
  <ControlRules
    :showModel="showControlModal"
    :data="dataItemNode"
    @close="() => (showControlModal = false)"
    @submit="editControlData"
  />
  <SceneModal
    :showModel="showSceneModal"
    :title="titleLabel"
    :params="dataBase"
    :action="action"
    @close="() => (showSceneModal = false)"
    @submit="optionSaveScene"
  />
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch, nextTick, onUnmounted } from 'vue';
  import Draggable from 'vuedraggable';
  import { format } from 'date-fns';
  import '@logicflow/core/lib/style/index.css';
  import { logicFlowUtil } from './LogicFlowUtil';
  import '@logicflow/extension/lib/style/index.css';
  // 皮肤样式
  import './css/default.css';
  // @ts-ignore
  import { groupList, componentList, DraggableItemData } from './RulesColumns';
  import { canvasData } from './Component/columns';
  // @ts-ignore
  import { DownOutlined, UpOutlined, CloseOutlined } from '@vicons/antd';
  // @ts-ignore
  import ComponentObject from '@/components/RulesEditor/Component/ComponentObject.vue';
  // @ts-ignore
  import SelectDeviceModel from '@/components/SelectDeviceModel/SelectDeviceModel.vue';
  // @ts-ignore
  import SelectData from '@/components/SelectData/SelectData.vue';
  // @ts-ignore
  import DataRules from '@/components/RulesEditor/Subassembly/DataRules.vue';
  // @ts-ignore
  import VariableRules from '@/components/RulesEditor/Subassembly/VariableRules.vue';
  // @ts-ignore
  import RandomRules from '@/components/RulesEditor/Subassembly/RandomRules.vue';
  // @ts-ignore
  import JudgmentRules from '@/components/RulesEditor/Subassembly/JudgmentRules.vue';
  // @ts-ignore
  import OperatorRules from '@/components/RulesEditor/Subassembly/OperatorRules.vue';
  // @ts-ignore
  import SwitchRules from '@/components/RulesEditor/Subassembly/SwitchRules.vue';
  // @ts-ignore
  import DateOutputRules from '@/components/RulesEditor/Subassembly/DateOutputRules.vue';
  // @ts-ignore
  import DateOperatorRules from '@/components/RulesEditor/Subassembly/DateOperatorRules.vue';
  // @ts-ignore
  import FuncRules from '@/components/RulesEditor/Subassembly/FuncRules.vue';
  // @ts-ignore
  import FormatRules from '@/components/RulesEditor/Subassembly/FormatRules.vue';
  // @ts-ignore
  import ExportRules from '@/components/RulesEditor/Subassembly/ExportRules.vue';
  // @ts-ignore
  import ControlRules from '@/components/RulesEditor/Subassembly/ControlRules.vue';
  // @ts-ignore
  import SceneModal from './View/SceneModal.vue';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
    data: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  });

  const pannelHeight = ref(0); //页面高度
  const titleLabel = ref(''); //标题(传入值)
  const actionType = ref(''); //操作方式(传入值，根据传入值调取不同窗体)
  const dataBase = ref<any>({}); // 数据(传入值)
  const rulesData = ref<any>({}); // 规则数据(传入值)
  const showSceneModal = ref(false); //显示联动窗体
  const showModelModal = ref(false); //显示模型节点选择
  const showDataRulesModal = ref(false); //显示数据节点表单
  const showVariableModal = ref(false); //显示变量节点表单
  const showRandomModal = ref(false); //显示随机数节点表单
  const showJudgmentModal = ref(false); //显示判断节点表单
  const showSwitchModal = ref(false); //显示判断节点表单
  const showOperatorModal = ref(false); //显示计算节点表单
  const showDateOutputModal = ref(false); //显示日期输出节点表单
  const showDateOperatorModal = ref(false); //显示日期计算节点表单
  const showFuncModal = ref(false); //显示函数节点表单
  const showFormatModal = ref(false); //显示函数节点表单
  const showExportModal = ref(false); //显示输出节点表单
  const showControlModal = ref(false); //显示物模型控制节点表单

  const draggableData = ref<DraggableItemData | null>(null); //拖拽创建节点的数据
  const draggableX = ref<number | null>(null); // 拖拽创建节点的X坐标
  const draggableY = ref<number | null>(null); // 拖拽创建节点的y坐标
  const selectedElements = ref<any>(null); // 添加选中节点的响应式引用

  const subassemblyId = ref(''); //节点ID
  const chkDeviceId = ref('');
  const chkIdentity = ref('');
  const modelType = ref(''); //节点类型
  const dataItemNode = ref<any>(null); // 数据节点

  const formBtnLoading = ref(false); // 提交保存按钮状态

  // 回调
  const emit = defineEmits(['close', 'submit']);

  watch(
    [() => props.title, () => props.action, () => props.data],
    async ([titleModel, actionModel, dataModel]) => {
      titleLabel.value = titleModel ?? '';
      actionType.value = actionModel ?? '';
      if (dataModel && actionModel) {
        dataBase.value = dataModel;
        if (actionModel === 'addScene' || actionModel === 'editScene') {
          rulesData.value = dataModel.elDataObj;
        }
        await nextTick();
        const container = document.getElementById('container') as HTMLDivElement;
        logicFlowUtil.setContainer(container);
        logicFlowUtil.init(rulesData.value, pannelHeight.value);

        // 移除 LogicFlowUtil 中的监听器，在此处添加监听回调
        if (logicFlowUtil.logicFlow) {
          // 监听节点选中事件
          logicFlowUtil.logicFlow.on('node:click', () => {
            handleSelectionChange();
          });

          // 监听画布点击事件（用于取消选择）
          logicFlowUtil.logicFlow.on('blank:click', () => {
            handleSelectionChange();
          });

          // 监听多选事件
          logicFlowUtil.logicFlow.on('selection:selected', () => {
            handleSelectionChange();
          });
        }
      }
    }
  );

  const closeAfter = () => {
    emit('close');
  };

  // 拖拽结束回调
  const onEndCallback = (data: any) => {
    // 获取鼠标释放时的坐标
    const mouseX = data.originalEvent.clientX;
    const mouseY = data.originalEvent.clientY;

    // 检查容器是否存在
    if (logicFlowUtil.logicFlow?.container) {
      // 获取 container 相对于视口的位置
      const containerRect = logicFlowUtil.logicFlow?.container.getBoundingClientRect();

      // 判断鼠标是否在 container 内（考虑滚动偏移）
      const isInContainer =
        mouseX >= containerRect.left &&
        mouseX <= containerRect.right &&
        mouseY >= containerRect.top &&
        mouseY <= containerRect.bottom;

      if (isInContainer) {
        if (logicFlowUtil.logicFlow) {
          // 使用LogicFlow的getPointByClient方法获取坐标，它会自动处理滚动和缩放
          const point = logicFlowUtil.logicFlow.getPointByClient(mouseX, mouseY);

          draggableData.value = data.item.dataset;
          draggableX.value = point.canvasOverlayPosition.x;
          draggableY.value = point.canvasOverlayPosition.y;
          modelType.value = data.item.dataset.type;

          if (modelType.value === 'attribute' || modelType.value === 'event') {
            addModelModel();
          } else if (modelType.value === 'metadata') {
            addDataModel();
          } else if (modelType.value === 'variable') {
            addVariableRules();
          } else if (modelType.value === 'random') {
            addRandomRules();
          } else if (modelType.value === 'judgment') {
            addJudgmentRules();
          } else if (modelType.value === 'switch') {
            addSwitchRules();
          } else if (
            modelType.value === 'add' ||
            modelType.value === 'subtract' ||
            modelType.value === 'multiply' ||
            modelType.value === 'divide' ||
            modelType.value === 'modular'
          ) {
            addOperatorRules();
          } else if (modelType.value === 'dateOutput') {
            addDateOutputRules();
          } else if (modelType.value === 'dateOperator') {
            addDateOperatorRules();
          } else if (modelType.value === 'func') {
            addFuncRules();
          } else if (modelType.value === 'format') {
            addFormatRules();
          } else if (modelType.value === 'export') {
            addExportRules();
          } else if (modelType.value === 'control') {
            addControlRules();
          }
        }
      }
    }
  };
  // 通用编辑
  const handleEditorSubmit = (data: any) => {
    const nodeType = data.properties.type;
    switch (nodeType) {
      case 'variable':
        if (data.properties.valueType === 'timestamp') {
          const defaultValue = Number(data.properties.defaultValue);
          const timestampTime = format(new Date(defaultValue), 'yyyy-MM-dd HH:mm:ss');
          data.properties.defaultValue = timestampTime;
        }
        showVariableModal.value = true;
        break;
      case 'random':
        showRandomModal.value = true;
        break;
      case 'judgment':
        showJudgmentModal.value = true;
        break;
      case 'switch':
        showSwitchModal.value = true;
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
      case 'modular':
        showOperatorModal.value = true;
        break;
      case 'dateOutput':
        showDateOutputModal.value = true;
        break;
      case 'dateOperator':
        showDateOperatorModal.value = true;
        break;
      case 'func':
        showFuncModal.value = true;
        break;
      case 'format':
        showFormatModal.value = true;
        break;
      case 'export':
        showExportModal.value = true;
        break;
      case 'control':
        showControlModal.value = true;
        break;
    }
    dataItemNode.value = data;
  };

  // 选中物模型回调
  const addModelModel = () => {
    showModelModal.value = false;
    const data = logicFlowUtil.addModelNode(
      draggableData.value,
      draggableX.value,
      draggableY.value
    );
    clearTempVariable();
    handleModelSubmit(data);
  };
  const handleModelSubmit = (data: any) => {
    showModelModal.value = true;
    subassemblyId.value = data.id;
    modelType.value = data.properties.type;
    chkDeviceId.value = data.properties.deviceId;
    chkIdentity.value = data.properties.identity;
  };
  const editModelData = (data: any) => {
    showModelModal.value = false;
    logicFlowUtil.editModelNode(subassemblyId.value, data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 选中数据模型回调
  const addDataModel = () => {
    showDataRulesModal.value = false;
    const data = logicFlowUtil.addDataNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
    handleDataSubmit(data);
  };
  const handleDataSubmit = (data: any) => {
    showDataRulesModal.value = true;
    subassemblyId.value = data.id;
    modelType.value = data.properties.type;
    dataItemNode.value = data;
  };
  const editDataData = (data: any) => {
    showDataRulesModal.value = false;
    logicFlowUtil.editDataNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 变量模型表单回调
  const addVariableRules = () => {
    showVariableModal.value = false;
    const data = logicFlowUtil.addVariableNode(
      draggableData.value,
      draggableX.value,
      draggableY.value
    );
    clearTempVariable();
    handleNodeEditSet(data.id);
  };
  const editVariableData = (data: any) => {
    showVariableModal.value = false;
    logicFlowUtil.editVariableNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 随机数模型表单回调
  const addRandomRules = () => {
    showRandomModal.value = false;
    const data = logicFlowUtil.addRandomNode(
      draggableData.value,
      draggableX.value,
      draggableY.value
    );
    clearTempVariable();
    handleNodeEditSet(data.id);
  };
  const editRandomData = (data: any) => {
    showRandomModal.value = false;
    logicFlowUtil.editRandomNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加Judgment模型回调
  const addJudgmentRules = () => {
    showJudgmentModal.value = false;
    logicFlowUtil.addJudgmentNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editJudgmentData = (data: any) => {
    showJudgmentModal.value = false;
    logicFlowUtil.editJudgmentNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加Switch模型回调
  const addSwitchRules = () => {
    showSwitchModal.value = false;
    logicFlowUtil.addSwitchNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editSwitchData = (data: any) => {
    showSwitchModal.value = false;
    logicFlowUtil.editSwitchNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加计算模型回调
  const addOperatorRules = () => {
    showOperatorModal.value = false;
    logicFlowUtil.addOperatorNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editOperatorData = (data: any) => {
    showOperatorModal.value = false;
    logicFlowUtil.editOperatorNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加日期输出模型回调
  const addDateOutputRules = () => {
    showDateOutputModal.value = false;
    logicFlowUtil.addDateOutputNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editDateOutputData = (data: any) => {
    showDateOutputModal.value = false;
    logicFlowUtil.editDateOutputNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加日期计算模型回调
  const addDateOperatorRules = () => {
    showDateOperatorModal.value = false;
    logicFlowUtil.addDateOperatorNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editDateOperatorData = (data: any) => {
    showDateOperatorModal.value = false;
    logicFlowUtil.editDateOperatorNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加函数模型回调
  const addFuncRules = () => {
    showFuncModal.value = false;
    logicFlowUtil.addFuncNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editFuncData = (data: any) => {
    showFuncModal.value = false;
    logicFlowUtil.editFuncNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加格式转换模型回调
  const addFormatRules = () => {
    showFormatModal.value = false;
    logicFlowUtil.addFormatNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editFormatData = (data: any) => {
    showFormatModal.value = false;
    logicFlowUtil.editFormatNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加输出模型回调
  const addExportRules = () => {
    showExportModal.value = false;
    logicFlowUtil.addExportNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editExportData = (data: any) => {
    showExportModal.value = false;
    logicFlowUtil.editExportNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };
  // 添加物模型控制模型回调
  const addControlRules = () => {
    showControlModal.value = false;
    logicFlowUtil.addControlNode(draggableData.value, draggableX.value, draggableY.value);
    clearTempVariable();
  };
  const editControlData = (data: any) => {
    showControlModal.value = false;
    logicFlowUtil.editControlNode(data);
    selectedElements.value = canvasData;
    clearTempVariable();
  };

  // 处理选中状态变化
  const handleSelectionChange = () => {
    if (logicFlowUtil.logicFlow) {
      const elements = logicFlowUtil.getSelectedElements();
      if (elements) {
        if (Array.isArray(elements)) {
          if (elements.length === 0) {
            selectedElements.value = canvasData;
          } else if (elements.length === 1) {
            const element = elements[0];
            const elementType = element.node.properties.type;
            let data: any;
            switch (elementType) {
              case 'attribute':
              case 'event':
                data = elementModelData(element);
                break;
              case 'metadata':
                data = elementDataData(element);
                break;
              case 'variable':
                data = elementVariableData(element);
                break;
              case 'random':
                data = elementRandomData(element);
                break;
              case 'judgment':
                data = elementJudgmentData(element);
                break;
              case 'switch':
                data = elementSwitchData(element);
                break;
              case 'add':
              case 'subtract':
              case 'multiply':
              case 'divide':
              case 'modular':
                data = elementOperatorData(element);
                break;
              case 'dateOutput':
                data = elementDateOutputData(element);
                break;
              case 'dateOperator':
                data = elementDateOperatorData(element);
                break;
              case 'func':
              case 'format':
                data = elementFuncData(element);
                break;
              case 'export':
                data = elementExportData(element);
                break;
              case 'control':
                data = elementControlData(element);
                break;
              default:
                data = canvasData;
                break;
            }
            selectedElements.value = data;
          } else {
          }
        } else {
          selectedElements.value = canvasData;
        }
      } else {
        selectedElements.value = canvasData;
      }
    }
  };
  const elementModelData = (element: any) => {
    const node = element.node;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'label',
          name: '绑定物模型',
          value: node.properties.id || '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindModel',
        },
        {
          id: 'label',
          name: '物模型名称',
          value: node.properties.label || '--',
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'bind',
          name: '所属设备',
          value: node.properties.deviceName || '--',
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'location',
          name: '空间位置',
          value: node.properties.location || '--',
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'output',
          name: '输出对象',
          value: node.properties.outputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'inputValue',
          name: '输入值',
          value: node.properties.inputValue || '--',
          valueBase: node.properties.valueType,
          editor: 0,
        },
        {
          id: 'outputValue',
          name: '输出值',
          value: node.properties.inputValue || node.properties.outputValue || '--',
          valueBase: node.properties.valueType,
          editor: 0,
        },
        {
          id: 'unit',
          name: '计量单位',
          value: node.properties.unit || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      node: node,
    };
  };
  const elementDataData = (element: any) => {
    const node = element.node;

    let timeFrame = '--';
    let queryOut = '--';
    switch (node.properties.timeFrame) {
      case 'min':
        timeFrame = '分钟范围查询';
        break;
      case 'hour':
        timeFrame = '小时范围查询';
        break;
      case 'day':
        timeFrame = '日范围查询';
        break;
      case 'betweenTime':
        timeFrame = '时间范围查询';
        break;
      case 'betweenDate':
        timeFrame = '日期范围查询';
        break;
      case 'betweenDateTime':
        timeFrame = '日期时间范围查询';
        break;
    }
    switch (node.properties.timeFrame) {
      case 'initialValue':
        queryOut = '初始值';
        break;
      case 'latestValue':
        queryOut = '最新值';
        break;
      case 'countValue':
        queryOut = '数量统计';
        break;
      case 'sumValue':
        queryOut = '求和';
        break;
      case 'maxValue':
        queryOut = '最大值';
        break;
      case 'minValue':
        queryOut = '最小值';
        break;
      case 'spreadValue':
        queryOut = '最小与最大差值';
        break;
      case 'averageValue':
        queryOut = '平均值';
        break;
      case 'stddevValue':
        queryOut = '均方差';
        break;
    }

    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'output',
          name: '输出对象',
          value: node.properties.outputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'deviceId',
          name: '设备编号',
          value: node.properties.deviceId || '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindTable',
        },
        {
          id: 'deviceName',
          name: '设备名称',
          value: node.properties.deviceName || '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindTable',
        },
        {
          id: 'location',
          name: '空间位置',
          value: node.properties.location || '--',
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'modelIdentity',
          name: '物模型编号',
          value: node.properties.modelIdentity || '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindTable',
        },
        {
          id: 'modelName',
          name: '物模型名称',
          value: node.properties.modelName || '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindTable',
        },
        {
          id: 'timeFrame',
          name: '时间范围',
          value: timeFrame,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'queryOut',
          name: '查询输出',
          value: queryOut,
          valueBase: 'object',
          editor: 0,
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'inputValue',
          name: '输入值',
          value: node.properties.inputValue || '--',
          valueBase: node.properties.valueType,
          editor: 0,
        },
        {
          id: 'outputValue',
          name: '输出值',
          value: node.properties.inputValue || node.properties.outputValue || '--',
          valueBase: node.properties.valueType,
          editor: 0,
        },
        {
          id: 'unit',
          name: '计量单位',
          value: node.properties.unit,
          valueBase: 'string',
          editor: 0,
        },
      ],
      node: node,
    };
  };
  const elementVariableData = (element: any) => {
    const node = element.node;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'output',
          name: '输出对象',
          value: node.properties.outputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'value',
          name: '输出值',
          value: node.properties.inputValue || node.properties.outputValue || '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
      ],
      node: node,
    };
  };
  const elementRandomData = (element: any) => {
    const node = element.node;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'output',
          name: '输出对象',
          value: node.properties.outputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'value',
          name: '最小值',
          value: node.properties.minNum,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'value',
          name: '最大值',
          value: node.properties.maxNum,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'value',
          name: '小数位',
          value: node.properties.bits,
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'value',
          name: '输出值',
          value: node.properties.outputValue,
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
      ],
      node: node,
    };
  };
  const elementJudgmentData = (element: any) => {
    const node = element.node;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'condition',
          name: '判断规则',
          value: node.properties.condition.length > 0 ? '[object, object]' : '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
      ],
      node: node,
    };
  };
  const elementSwitchData = (element: any) => {
    const node = element.node;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'condition',
          name: '判断规则',
          value: node.properties.condition.length > 0 ? '[object, object]' : '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
      ],
      node: node,
    };
  };
  const elementOperatorData = (element: any) => {
    const node = element.node;
    let label1 = '';
    let label2 = '';
    if (node.properties.type === 'add') {
      label1 = '被加数';
      label2 = '加数';
    } else if (node.properties.type === 'subtract') {
      label1 = '被减数';
      label2 = '减数';
    } else if (node.properties.type === 'multiply') {
      label1 = '被乘数';
      label2 = '乘数';
    } else if (node.properties.type === 'divide' || node.properties.type === 'modular') {
      label1 = '被除数';
      label2 = '除数';
    }
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'output',
          name: '输出对象',
          value: node.properties.outputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || 'int',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'mainNode',
          name: label1,
          value: node.properties.mainNode === null ? '--' : node.properties.mainNode,
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
        {
          id: 'subNodes',
          name: label2,
          value: node.properties.subNodes.length > 0 ? '[object, object]' : '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
        {
          id: 'value',
          name: '输出值',
          value: node.properties.value,
          valueBase: 'string',
          editor: 0,
        },
      ],
      node: node,
    };
  };
  const elementDateOutputData = (element: any) => {
    const node = element.node;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'output',
          name: '输出对象',
          value: node.properties.outputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'value',
          name: '日期类型',
          value: node.properties.outputType,
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
        {
          id: 'value',
          name: '日期格式',
          value: node.properties.outputFormat,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'value',
          name: '输出值',
          value: node.properties.outputValue,
          valueBase: 'number',
          editor: 1,
          fromInput: 'input',
        },
      ],
      node: node,
    };
  };
  const elementDateOperatorData = (element: any) => {
    const node = element.node;
    const formula =
      node.properties.timeCompare + ' ' + node.properties.timeValue + node.properties.timeUtil;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'output',
          name: '输出对象',
          value: node.properties.outputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'formula',
          name: '计算公式',
          value: formula,
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'value',
          name: '输出值',
          value: node.properties.outputValue,
          valueBase: 'string',
          editor: 0,
        },
      ],
      node: node,
    };
  };
  const elementFuncData = (element: any) => {
    const node = element.node;
    let describe = '函数方法';
    let formula = '函数公式';
    if (node.properties.type === 'format') {
      describe = '转换方法';
      formula = '转换公式';
    }

    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'output',
          name: '执行对象',
          value: node.properties.outputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'describe',
          name: describe,
          value: node.properties.describe,
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
        {
          id: 'formula',
          name: formula,
          value: node.properties.formula,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'value',
          name: '输出值',
          value: node.properties.outputValue,
          valueBase: node.properties.valueType,
          editor: 0,
        },
      ],
      node: node,
    };
  };
  const elementExportData = (element: any) => {
    const node = element.node;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'export',
          name: '输出对象',
          value: node.properties.nodeId || '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'value',
          name: '输出值',
          value: node.properties.outputValue,
          valueBase: node.properties.valueType,
          editor: 0,
        },
      ],
      node: node,
    };
  };
  const elementControlData = (element: any) => {
    const node = element.node;
    return {
      objectId: node.id,
      objectType: 'model',
      group: [
        {
          label: '对象',
          value: 'object',
        },
        {
          label: '规格',
          value: 'specs',
        },
        {
          label: '属性',
          value: 'attribute',
        },
        {
          label: '数据',
          value: 'data',
        },
      ],
      object: [
        {
          id: 'id',
          name: 'ID',
          value: node.id,
          valueBase: 'string',
          editor: 0,
          fromInput: 'input',
        },
        {
          id: 'type',
          name: '名称',
          value: node.properties.label,
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'type',
          name: '类型',
          value: node.properties.type,
          valueBase: 'string',
          editor: 0,
        },
      ],
      specs: [
        {
          id: 'width',
          name: '宽度',
          value: node.properties.width + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'height',
          name: '高度',
          value: node.properties.height + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'width',
          name: '最小宽度',
          value: node.properties.minWidth + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'height',
          name: '最小高度',
          value: node.properties.minHeight + '',
          valueBase: 'int',
          editor: 0,
        },
        {
          id: 'x',
          name: 'x坐标',
          value: node.x + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
        {
          id: 'y',
          name: 'y坐标',
          value: node.y + '',
          valueBase: 'int',
          editor: 1,
          fromInput: 'input',
        },
      ],
      attribute: [
        {
          id: 'input',
          name: '输入对象',
          value: node.properties.inputNodes,
          valueBase: 'linkArray',
          editor: 0,
        },
        {
          id: 'modelName',
          name: '控制对象',
          value: node.properties.modelName || '--',
          valueBase: 'string',
          editor: 1,
          fromInput: 'bindEditor',
        },
        {
          id: 'deviceName',
          name: '所属设备',
          value: node.properties.deviceName || '--',
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'location',
          name: '安装位置',
          value: node.properties.location || '--',
          valueBase: 'string',
          editor: 0,
        },
        {
          id: 'valueType',
          name: '输出类型',
          value: node.properties.valueType || '--',
          valueBase: 'string',
          editor: 0,
        },
      ],
      data: [
        {
          id: 'value',
          name: '控制值',
          value: node.properties.outputValue,
          valueBase: node.properties.valueType,
          editor: 0,
        },
        {
          id: 'description',
          name: '控制描述',
          value: node.properties.description,
          valueBase: 'string',
          editor: 0,
        },
      ],
      node: node,
    };
  };

  /**
   * 清除临时数据
   */
  const clearTempVariable = () => {
    draggableX.value = null;
    draggableY.value = null;
    draggableData.value = null;
    subassemblyId.value = '';
    modelType.value = '';
    chkDeviceId.value = '';
    chkIdentity.value = '';
    dataItemNode.value = {};
  };

  // 保存
  const confirmForm = () => {
    const dataObj = logicFlowUtil.logicFlow?.getGraphData();
    dataBase.value.elData = JSON.stringify(dataObj);
    showSceneModal.value = true;
    // console.log('dataObj:', dataObj);
  };
  const optionSaveScene = () => {
    emit('submit');
  };

  const handleNodeEditSet = (nodeId: string) => {
    if (logicFlowUtil.logicFlow) {
      // 获取节点数据并打开编辑窗口
      const node = logicFlowUtil.logicFlow.getNodeModelById(nodeId);
      if (node) {
        // 设置当前节点ID和类型
        subassemblyId.value = nodeId;
        modelType.value = node.properties.type;

        // 根据节点类型执行相应的编辑操作
        if (modelType.value === 'attribute' || modelType.value === 'event') {
          handleModelSubmit(node);
        } else if (modelType.value === 'metadata') {
          handleDataSubmit(node);
        } else {
          handleEditorSubmit(node);
        }
      }
    } else {
      console.error('LogicFlow实例未初始化');
    }
  };

  onMounted(async () => {
    pannelHeight.value = window.innerHeight - 64 - 44 - 20 - 64;

    // title.value = props.name ?? '';
    // if (props.data) {
    //   rulesData.value = props.data;
    // }

    // 定义全局函数供节点按钮调用
    window.handleNodeEdit = (nodeId: string) => {
      handleNodeEditSet(nodeId);
    };

    window.handleRefRandom = (nodeId) => {
      if (logicFlowUtil.logicFlow) {
        // 获取节点数据并打开编辑窗口
        const node = logicFlowUtil.logicFlow.getNodeModelById(nodeId);
        if (node) {
          editRandomData(node);
        }
      } else {
        console.error('LogicFlow实例未初始化');
      }
    };

    window.handleNodeClose = (nodeId) => {
      if (logicFlowUtil.logicFlow) {
        // 删除指定节点
        const node = logicFlowUtil.logicFlow.getNodeModelById(nodeId);
        logicFlowUtil.onDeleteNode(node);
        // logicFlowUtil.logicFlow.deleteNode(nodeId);
      } else {
        console.error('LogicFlow实例未初始化');
      }
    };

    await nextTick();
    const container = document.getElementById('container') as HTMLDivElement;
    logicFlowUtil.setContainer(container);
    logicFlowUtil.init(rulesData.value, pannelHeight.value);

    // 移除 LogicFlowUtil 中的监听器，在此处添加监听回调
    if (logicFlowUtil.logicFlow) {
      // logicFlowUtil.logicFlow.off('node:click');
      // logicFlowUtil.logicFlow.off('blank:click');
      // logicFlowUtil.logicFlow.off('selection:selected');

      // 监听节点选中事件
      logicFlowUtil.logicFlow.on('node:click', () => {
        handleSelectionChange();
      });

      // 监听画布点击事件（用于取消选择）
      logicFlowUtil.logicFlow.on('blank:click', () => {
        handleSelectionChange();
      });

      // 监听多选事件
      logicFlowUtil.logicFlow.on('selection:selected', () => {
        handleSelectionChange();
      });
    }
  });

  // 在组件卸载前清理全局函数
  onUnmounted(() => {
    delete window.handleNodeEdit;
    delete window.handleNodeClose;
  });
</script>

<style lang="less" scoped>
  .card-box {
    .card-query {
      border-bottom: 1px solid #eeeeee;
      :deep(.n-base-selection.n-base-selection) {
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
    }
  }
</style>
