import LogicFlow from '@logicflow/core';
import { Control, Menu, SelectionSelect, MiniMap } from '@logicflow/extension';
// 引入LogicFlow扩展的样式文件
import '@logicflow/extension/lib/style/index.css';

import { realTimeData, historicalOne } from '@/api/iot/iot';

import AttributeNode from './Node/AttributeNode';
import ServiceNode from './Node/ServiceNode';
import EventNode from './Node/EventNode';
import MetadataNode from './Node/MetadataNode';
import VariableNode from './Node/VariableNode';
import RandomNode from './Node/RandomNode';
import JudgmentNode from './Node/JudgmentNode';
import SwitchNode from './Node/SwitchNode';
import OperatorNode from './Node/OperatorNode';
import DateOutputNode from './Node/DateOutputNode';
import DateOperatorNode from './Node/DateOperatorNode';
import TimerNode from './Node/TimerNode';
import DelayNode from './Node/DelayNode';
import CountdownNode from './Node/CountdownNode';
import FuncNode from './Node/FuncNode';
import ParallelNode from './Node/ParallelNode';
import ExportNode from './Node/ExportNode';
import ControlNode from './Node/ControlNode';
import DataStorageNode from './Node/DataStorageNode';
import BridgingNode from './Node/BridgingNode';
import PopupNode from './Node/PopupNode';

/**
 * 规则引擎类
 */
export default class LogicFlowUtil {
  private container: HTMLDivElement | null | undefined = null;
  private minMapShow = true;
  public logicFlow: LogicFlow | null = null;

  public idMap: any = {};
  public nodeIdMap: any = {};

  constructor() {
    LogicFlow.use(Control); // 控制面板
    LogicFlow.use(Menu); // 右键菜单
    LogicFlow.use(SelectionSelect); //框选
    LogicFlow.use(MiniMap); // 小地图
  }

  /**
   * 设置容器元素
   * @param container 容器DOM元素
   */
  setContainer(container: HTMLDivElement): void {
    this.container = container;
  }

  /**
   * 初始化引擎
   * @param rulesData 传值数据
   * @param pannelHeight 容器高度
   */
  init(rulesData: any, _pannelHeight: number): void {
    if (!this.container) {
      throw new Error('Container is not set');
    }

    this.logicFlow = new LogicFlow({
      container: this.container,
      grid: true,
      // 工具配置
      textEdit: false,
      isSilentMode: false,
      edgeType: 'polyline',
      snapline: true,
      // 启用画布滚动功能
      multipleSelectKey: 'ctrl',
      autoResize: true,
      keyboard: {
        enabled: true,
      },
    });

    this.logicFlow?.on('connection:drop', (data) => {
      // 当连线放下时，记录目标节点ID
      if (data.targetNode) {
        // 更新AttributeNode中的latestTargetNodeId
        const { default: AttributeNode } = require('./Node/AttributeNode');
        if (AttributeNode && AttributeNode.model) {
          AttributeNode.model.latestTargetNodeId = data.targetNode.id;
        }
      }
    });

    this.logicFlow?.on('connection:connect', (data) => {
      // 当连线完成时，更新AttributeNode中的latestTargetNodeId
      if (data.targetNode) {
        const { default: AttributeNode } = require('./Node/AttributeNode');
        if (AttributeNode && AttributeNode.model) {
          AttributeNode.model.latestTargetNodeId = data.targetNode.id;
        }
      }
    });

    if (this.logicFlow) {
      if (this.logicFlow.extension.menu instanceof Menu) {
        this.logicFlow.extension.menu.setMenuConfig({
          nodeMenu: [
            { text: '删除', callback: (node) => this.onDeleteNode(node) },
            { text: '复制', callback: (node) => this.onCloneNode(node) }, //logicFlow?.cloneNode(node.id)
          ],
          edgeMenu: [{ text: '删除', callback: (edge) => this.logicFlow?.deleteEdge(edge.id) }],
          graphMenu: [],
        });
      }

      this.logicFlow.register(AttributeNode);
      this.logicFlow.register(ServiceNode);
      this.logicFlow.register(EventNode);
      this.logicFlow.register(MetadataNode);
      this.logicFlow.register(VariableNode);
      this.logicFlow.register(RandomNode);
      this.logicFlow.register(JudgmentNode);
      this.logicFlow.register(SwitchNode);
      this.logicFlow.register(OperatorNode);
      this.logicFlow.register(DateOutputNode);
      this.logicFlow.register(DateOperatorNode);
      this.logicFlow.register(TimerNode);
      this.logicFlow.register(DelayNode);
      this.logicFlow.register(CountdownNode);
      this.logicFlow.register(FuncNode);
      this.logicFlow.register(ParallelNode);
      this.logicFlow.register(ExportNode);
      this.logicFlow.register(ControlNode);
      this.logicFlow.register(DataStorageNode);
      this.logicFlow.register(BridgingNode);
      this.logicFlow.register(PopupNode);

      (this.logicFlow.extension.control as any).addItem({
        key: 'select-area',
        iconClass: 'selectAreaIco',
        title: '选区',
        text: '选区',
        onClick: (_ev: any) => {
          if (this.logicFlow) {
            (this.logicFlow.extension.selectionSelect as any).openSelectionSelect();
            this.logicFlow.once('selection:selected', () => {
              if (this.logicFlow) {
                (this.logicFlow.extension.selectionSelect as any).closeSelectionSelect();
              }
            });
          }
        },
      });

      (this.logicFlow.extension.control as any).addItem({
        key: 'min-map',
        iconClass: 'minMapIco',
        title: '地图',
        text: '小地图',
        onClick: (_ev: any) => {
          // 获取当前画布的可视区域尺寸
          const containerRect = this.container?.getBoundingClientRect();
          const containerWidth = containerRect?.width || 0;
          const containerHeight = containerRect?.height || 0;

          // 计算小地图的位置，使其位于右下角
          const x = containerWidth - 200;
          const y = containerHeight - 280;

          if (this.logicFlow) {
            if (this.minMapShow === false) {
              (this.logicFlow.extension.miniMap as any).show(x, y);
              this.minMapShow = true;
            } else {
              (this.logicFlow.extension.miniMap as any).hide();
              this.minMapShow = false;
            }
          }
        },
      });

      // 初始化完成后默认显示小地图
      setTimeout(() => {
        if (this.logicFlow && this.minMapShow) {
          const containerRect = this.container?.getBoundingClientRect();
          const containerWidth = containerRect?.width || 0;
          const containerHeight = containerRect?.height || 0;
          const x = containerWidth - 200;
          const y = containerHeight - 280;
          (this.logicFlow.extension.miniMap as any)?.show(x, y);
        }
      }, 150);

      // 监听连接不被允许的事件
      this.logicFlow.on('connection:not-allowed', (msg: any) => {
        console.log('连接不被允许:', msg);
        if (msg.msg.startsWith('msg:')) {
          const errorMsg = msg.msg.replace('msg:', '');
          alert(errorMsg);
        }
      });

      // 监听锚点连线事件
      this.logicFlow.on('edge:add', (data: any) => {
        console.log('锚点连线事件:', data);
        // 在这里可以添加自定义处理逻辑
        this.handleNodeLink(data);
      });

      // 监听节点删除事件
      this.logicFlow.on('node:delete', (data: any) => {
        console.log('节点删除事件:', data);
        // 在这里可以添加自自定义处理逻辑
        this.handleNodeDelete(data);
      });

      // 监听锚点连线删除事件
      this.logicFlow.on('edge:delete', (data: any) => {
        console.log('锚点连线删除事件:', data);
        // 在这里可以添加自定义处理逻辑
        this.handleEdgeDelete(data);
      });

      this.logicFlow.render(rulesData.value);
    }
  }

  /**
   * 创建物模型节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y

   */
  addModelNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;
    const id = this.createNodeModelId(draggableData.type);

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id: '',
        width: 240,
        height: 200,
        minWidth: 240,
        minHeight: 200,
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        label: '',
        identity: '',
        deviceId: '',
        deviceName: '',
        location: '',
        inputNodes: null,
        outputNodes: null,
        valueType: '',
        defaultValue: '',
        inputValue: '',
        outputValue: '',
        unit: '',
        error: false,
        message: '无模型数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  async editModelNode(id: string, data: any): Promise<void> {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      const dataDefinition = data.dataDefinition;
      let unit = '';
      if (data.dataDefinition) {
        const definition = JSON.parse(dataDefinition);
        if (definition.hasOwnProperty('unit')) {
          unit = definition.unit;
        }
      }

      // 调用接口，获取数据
      const params = {
        deviceId: data.deviceId,
        identity: data.identity,
      };
      const result = (await realTimeData(params)) as unknown as {
        status: string;
        message: string;
        data: any;
      };

      let defaultValue: number | string | object | any | any[] | null;
      let error: boolean;
      let message: string;
      if (result.status === 'success') {
        defaultValue = result.data.value + '';
        error = !result.data.hasValue;
        message = result.data.message;
      } else {
        defaultValue = 'none';
        error = false;
        message = '接口调用错误';
      }

      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          id: data.modelId,
          label: data.modelName,
          identity: data.identity,
          deviceId: data.deviceId,
          deviceName: data.deviceName,
          location: data.spaceRouteName,
          valueType: data.dataType,
          defaultValue,
          outputValue: nodeModel.properties.inputValue === '' ? defaultValue : data.inputValue,
          unit: unit,
          error,
          message,
        };
        console.log('newProperties:', newProperties);
        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建元数据节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addDataNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;
    const id = this.createNodeModelId(draggableData.type);

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id: '',
        width: 240,
        height: 220,
        minWidth: 240,
        minHeight: 220,
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        label: '元数据',
        inputNodes: null,
        outputNodes: null,
        deviceId: '',
        deviceName: '',
        location: '',
        productId: '',
        modelIdentity: '',
        modelName: '',
        timeFrame: 'min',
        timeData: '10',
        queryOut: 'latestValue',
        valueType: '',
        inputValue: '',
        outputValue: '',
        unit: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  async editDataNode(data: any): Promise<void> {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 调用接口，获取数据
      const params = {
        deviceId: data.properties.deviceId,
        identity: data.properties.orderBy,
        timeFrame: data.properties.timeFrame,
        timeData: data.properties.timeData,
        queryOut: data.properties.queryOut,
      };

      const result = (await historicalOne(params)) as unknown as {
        status: string;
        message: string;
        data: any;
      };

      let defaultValue: number | string | object | any | any[] | null;
      let error: boolean;
      let message: string;
      if (result.status === 'success') {
        defaultValue = result.data.value + '';
        error = !result.data.hasValue;
        message = result.data.message;
      } else {
        defaultValue = 'none';
        error = false;
        message = '接口调用错误';
      }

      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          id: data.properties.id,
          deviceId: data.properties.deviceId,
          deviceName: data.properties.deviceName,
          location: data.properties.location,
          productId: data.properties.productId,
          modelIdentity: data.properties.modelIdentity,
          modelName: data.properties.modelName,
          timeFrame: data.properties.timeFrame,
          timeData: data.properties.timeData,
          queryOut: data.properties.queryOut,
          inputValue: data.properties.inputValue,
          valueType: data.properties.dataType,
          defaultValue,
          outputValue:
            nodeModel.properties.inputValue === '' ? defaultValue : data.properties.inputValue,
          unit: data.properties.unit,
          error,
          message,
        };
        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建变量节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addVariableNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }
    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 240,
        height: 132,
        minWidth: 240,
        minHeight: 132,
        label: '变量',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        valueType: 'number',
        defaultValue: '0',
        inputValue: '',
        outputValue: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editVariableNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          valueType: data.properties.valueType,
          defaultValue: data.properties.defaultValue,
          outputValue:
            data.properties.inputValue === ''
              ? data.properties.defaultValue
              : data.properties.inputValue,
        };
        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建随机数节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addRandomNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const outputValue = this.randomNumber('0', '10', '0', 'int');

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 240,
        height: 150,
        minWidth: 240,
        minHeight: 150,
        label: '随机数',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        minNum: '0',
        maxNum: '10',
        bits: '0',
        refresh: '10',
        valueType: 'int',
        outputValue,
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editRandomNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    const outputValue = this.randomNumber(
      data.properties.minNum,
      data.properties.maxNum,
      data.properties.bits,
      data.properties.valueType
    );

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          minNum: data.properties.minNum,
          maxNum: data.properties.maxNum,
          bits: data.properties.bits,
          refresh: data.properties.refresh,
          valueType: data.properties.valueType,
          outputValue,
        };
        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建条件判断节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addJudgmentNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 250,
        height: 126,
        minWidth: 250,
        minHeight: 126,
        label: '条件判断',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        condition: [],
        otherwise: '',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editJudgmentNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }
    console.log('data', data);

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          nodeId: data.properties.nodeId,
          inputValueType: data.properties.inputValueType,
          condition: data.properties.condition,
        };
        // 设置新属性
        nodeModel.setProperties(newProperties);

        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建多分支判断节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addSwitchNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 250,
        height: 146,
        minWidth: 250,
        minHeight: 146,
        label: '多分支判断',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        nodeId: '',
        inputValueType: 'int',
        condition: [],
        otherwise: '',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editSwitchNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        const count = data.properties.condition.length;
        console.log('count', count);
        const properties = nodeModel.getProperties();
        let newHeight = properties.height ?? 146;
        const newWidth = properties.width ?? 250;
        let anchorsOffset: any[] = [];
        const addHeight = 32 * (count - 1);
        newHeight = newHeight + addHeight;

        const widthAnc = newWidth / 2;
        const xHeight = 0 - newHeight / 2;
        const heightAnc = xHeight + 36 + 6 + 18;
        const heightAnc1 = heightAnc + 32;
        if (count === 1) {
          const heightFootAnc = heightAnc1 + 32;
          anchorsOffset = [
            [-widthAnc, heightAnc], // 左侧输入
            [widthAnc, heightAnc1], // 右侧case第1项
            [widthAnc, heightFootAnc], // 右侧default
          ];
        } else {
          let hhAnc = heightAnc1;
          for (let i = 0; i < count; i++) {
            if (i === 0) {
              anchorsOffset.push([-widthAnc, heightAnc]); // 左侧输入
              anchorsOffset.push([widthAnc, hhAnc]);
            } else {
              anchorsOffset.push([widthAnc, hhAnc]);
            }
            hhAnc = hhAnc + 32;
          }
          anchorsOffset.push([widthAnc, hhAnc]);
        }

        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          nodeId: data.properties.nodeId,
          inputValueType: data.properties.inputValueType,
          condition: data.properties.condition,
          minHeight: newHeight,
          height: newHeight,
        };
        // 设置新属性
        nodeModel.setProperties(newProperties);

        if (nodeModel.rootEl) {
          const wrapper = nodeModel.rootEl.querySelector('.variable-wrapper');
          if (wrapper) {
            wrapper.style.width = newWidth + 'px';
            wrapper.style.height = newHeight + 'px';
          }
        }

        // 同时更新节点模型的高度，确保视图和模型一致
        if (typeof (nodeModel as any).setWidth === 'function') {
          (nodeModel as any).setWidth(newWidth);
        }
        if (typeof (nodeModel as any).setHeight === 'function') {
          (nodeModel as any).setHeight(newHeight);
        }
        if (typeof (nodeModel as any).setAnchorsOffset === 'function') {
          (nodeModel as any).setAnchorsOffset(anchorsOffset);
        }

        // 手动更新节点的height属性，确保LogicFlow内部模型也更新
        (nodeModel as any).width = newWidth;
        (nodeModel as any).height = newHeight;
        (nodeModel as any).anchorsOffset = anchorsOffset;

        console.log('nodeModel----', nodeModel);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建计算符节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addOperatorNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    let label = '';
    switch (draggableData.type) {
      case 'add':
        label = '加';
        break;
      case 'subtract':
        label = '减';
        break;
      case 'multiply':
        label = '乘';
        break;
      case 'divide':
        label = '除';
        break;
      case 'modular':
        label = '取余';
        break;
    }

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 200,
        height: 126,
        minWidth: 200,
        minHeight: 126,
        label,
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        principal: null,
        inputValue: [],
        valueType: 'int',
        outputValue: '0',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editOperatorNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        const count = data.properties.inputValue.length;
        console.log('count', count);
        const properties = nodeModel.getProperties();
        let newHeight = properties.height ?? 126;
        const addHeight = 22 * (count - 1);
        newHeight = newHeight + addHeight;

        // 手动更新节点的height属性，确保LogicFlow内部模型也更新
        nodeModel.height = newHeight;
        nodeModel.setProperty('height', newHeight);

        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          principal: data.properties.principal,
          inputValue: data.properties.inputValue,
          valueType: data.properties.valueType,
          outputValue: data.properties.outputValue,
          minHeight: newHeight,
          height: newHeight,
        };
        nodeModel.setProperties(newProperties);

        // 更新DOM元素高度
        if (nodeModel.rootEl) {
          const wrapper = nodeModel.rootEl.querySelector('.operator-wrapper');
          if (wrapper) {
            wrapper.style.height = newHeight + 'px';
          }
        }

        // 强制刷新节点以确保视图更新
        nodeModel.setSelected(false);
        setTimeout(() => {
          nodeModel.setSelected(true);
          console.log('nodeModel----', nodeModel);
          // 再次刷新整个画布
          try {
            this.logicFlow?.refresh();
          } catch (e) {
            // 如果refresh方法不存在，使用备用方法
            const graphData = this.logicFlow?.getGraphData();
            if (graphData) {
              this.logicFlow?.render(graphData);
            }
          }
        }, 100);
      }
    }
  }

  /**
   * 创建日期输出节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addDateOutputNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 240,
        height: 150,
        minWidth: 240,
        minHeight: 150,
        label: '日期输出',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        outputTypeId: '',
        outputType: '',
        outputFormat: '',
        inputType: '',
        inputValue: '',
        valueType: 'text',
        outputValue: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editDateOutputNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          outputTypeId: data.properties.outputTypeId,
          outputType: data.properties.outputType,
          outputFormat: data.properties.outputFormat,
          valueType: data.properties.valueType,
          outputValue: data.properties.outputValue,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建日期计算节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addDateOperatorNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 260,
        height: 150,
        minWidth: 270,
        minHeight: 150,
        label: '日期计算',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        timeCompare: '',
        timeValue: '',
        timeUtil: '',
        inputType: '',
        inputValue: '',
        valueType: 'text',
        outputValue: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editDateOperatorNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          timeCompare: data.properties.timeCompare,
          timeValue: data.properties.timeValue,
          timeUtil: data.properties.timeUtil,
          valueType: data.properties.valueType,
          outputValue: data.properties.outputValue,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建定时器节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addTimerNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 240,
        height: 132,
        minWidth: 240,
        minHeight: 132,
        label: '定时器',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        cron: '',
        description: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editTimerNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          cron: data.properties.cron,
          description: data.properties.description,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建延时器节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addDelayNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 200,
        height: 74,
        minWidth: 200,
        minHeight: 74,
        label: '延时器',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        timeValue: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editDelayNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          timeValue: data.properties.timeValue,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建倒计时节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addCountdownNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 240,
        height: 96,
        minWidth: 240,
        minHeight: 96,
        label: '倒计时',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        timeValue: '',
        runTimeValue: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editCountdownNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          timeValue: data.properties.timeValue,
          runTimeValue: data.properties.runTimeValue,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建函数节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addFuncNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 240,
        height: 126,
        minWidth: 240,
        minHeight: 126,
        label: '函数',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        funcType: '',
        func: '',
        formula: '',
        describe: '',
        inputIdNum: 0,
        inputId1: '',
        inputId2: '',
        inputIdType1: '',
        inputIdType2: '',
        paramNum: 0,
        paramValue1: '',
        paramValue2: '',
        paramType1: '',
        paramType2: '',
        valueType: '',
        outputValue: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editFuncNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          funcType: data.properties.funcType,
          func: data.properties.func,
          formula: data.properties.formula,
          describe: data.properties.describe,
          inputIdNum: data.properties.inputIdNum,
          inputId1: data.properties.inputId1,
          inputId2: data.properties.inputId2,
          inputIdType1: data.properties.inputIdType1,
          inputIdType2: data.properties.inputIdType2,
          paramNum: data.properties.paramNum,
          paramValue1: data.properties.paramValue1,
          paramValue2: data.properties.paramValue2,
          paramType1: data.properties.paramType1,
          paramType2: data.properties.paramType2,
          valueType: data.properties.valueType,
          outputValue: data.properties.outputValue,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建格式转换节点
   * @param draggableData 拖拽对象
   * @param modelData 节点提交数据
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addFormatNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 240,
        height: 126,
        minWidth: 240,
        minHeight: 126,
        label: '格式转换',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        funcType: '',
        func: '',
        formula: '',
        describe: '',
        inputIdNum: 0,
        inputId1: '',
        inputId2: '',
        inputIdType1: '',
        inputIdType2: '',
        paramNum: 0,
        paramValue1: '',
        paramValue2: '',
        paramType1: '',
        paramType2: '',
        valueType: '',
        outputValue: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editFormatNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          funcType: data.properties.funcType,
          func: data.properties.func,
          formula: data.properties.formula,
          describe: data.properties.describe,
          inputIdNum: data.properties.inputIdNum,
          inputId1: data.properties.inputId1,
          inputId2: data.properties.inputId2,
          inputIdType1: data.properties.inputIdType1,
          inputIdType2: data.properties.inputIdType2,
          paramNum: data.properties.paramNum,
          paramValue1: data.properties.paramValue1,
          paramValue2: data.properties.paramValue2,
          paramType1: data.properties.paramType1,
          paramType2: data.properties.paramType2,
          valueType: data.properties.valueType,
          outputValue: data.properties.outputValue,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建执行节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addParallelNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 200,
        height: 74,
        minWidth: 200,
        minHeight: 74,
        label: '执行',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }

  /**
   * 创建输出节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addExportNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 200,
        height: 74,
        minWidth: 200,
        minHeight: 74,
        label: '输出',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }

  /**
   * 创建物模型控制节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addControlNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 200,
        height: 176,
        minWidth: 200,
        minHeight: 176,
        label: '物模型控制',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        modelId: '',
        modelName: '',
        deviceName: '',
        location: '',
        dataDefinition: '',
        valueType: '',
        outputValue: '',
        description: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editControlNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          modelId: data.properties.modelId,
          modelName: data.properties.modelName,
          deviceName: data.properties.deviceName,
          location: data.properties.location,
          dataDefinition: data.properties.dataDefinition,
          valueType: data.properties.valueType,
          outputValue: data.properties.outputValue,
          description: data.properties.description,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建数据存储节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addDataStorageNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    const id = this.createNodeModelId(draggableData.type);
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 240,
        height: 98,
        minWidth: 240,
        minHeight: 98,
        label: '数据存储',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        deviceId: '',
        deviceName: '',
        location: '',
        productId: '',
        modelIdentity: '',
        modelName: '',
        timeFrame: '',
        queryOut: '',
        inputValue: '',
        outputValue: '',
        unit: '',
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editDataStorageNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          deviceId: data.properties.deviceId,
          deviceName: data.properties.deviceName,
          location: data.properties.spaceRouteName,
          productId: data.properties.productId,
          modelIdentity: data.properties.modelIdentity,
          modelName: data.properties.modelName,
          timeFrame: data.properties.timeFrame,
          queryOut: data.properties.queryOut,
          outputValue: data.properties.outputValue,
          unit: data.properties.unit,
        };

        // 设置新属性
        nodeModel.setProperties(newProperties);
        // 刷新整个画布
        try {
          this.logicFlow?.refresh();
        } catch (e) {
          // 如果refresh方法不存在，使用备用方法
          const graphData = this.logicFlow?.getGraphData();
          if (graphData) {
            this.logicFlow?.render(graphData);
          }
        }
      }
    }
  }

  /**
   * 创建数据推送节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addDataPushNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null,
    subassemblyId?: string | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    let id = '';
    if (subassemblyId && subassemblyId !== '') {
      id = this.formatVerifyId(subassemblyId);
    } else {
      id = this.createNodeModelId(draggableData.type);
    }
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 200,
        height: 98,
        minWidth: 200,
        minHeight: 98,
        label: '数据存储',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        bridgeId: '',
        bridgeName: '',
        httpUrl: '',
        inputData: [],
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }

  /**
   * 创建消息推送节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addMessagePushNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null,
    subassemblyId?: string | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    let id = '';
    if (subassemblyId && subassemblyId !== '') {
      id = this.formatVerifyId(subassemblyId);
    } else {
      id = this.createNodeModelId(draggableData.type);
    }
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 200,
        height: 98,
        minWidth: 200,
        minHeight: 98,
        label: '数据存储',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        bridgeId: '',
        bridgeName: '',
        mqttUrl: '',
        inputData: [],
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }

  /**
   * 创建消息提醒节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   * @param subassemblyId 编辑传入的ID
   */
  addPopupNode(
    draggableData: any,
    draggableX?: number | null,
    draggableY?: number | null,
    subassemblyId?: string | null
  ): void {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }

    let id = '';
    if (subassemblyId && subassemblyId !== '') {
      id = this.formatVerifyId(subassemblyId);
    } else {
      id = this.createNodeModelId(draggableData.type);
    }
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id,
        width: 200,
        height: 98,
        minWidth: 200,
        minHeight: 98,
        label: '消息提醒',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        templateId: '',
        templateName: '',
        sendType: '',
        inputData: [],
        error: false,
        message: '无元数据',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }

  /**
   * 复制节点
   * @param logicFlow 引擎对象
   * @param node Node对象
   */
  onCloneNode(node: any): void {
    if (this.logicFlow) {
      const nodeWidth = node.properties.width;
      const nodeHeight = node.properties.height;
      const newId = this.createNodeModelId(node.properties.type);
      const newNode = this.logicFlow.cloneNode(node.id);
      if (newNode) {
        this.logicFlow.changeNodeId(newNode.id, newId);
        const nodeType = newNode.properties?.type;
        if (
          nodeType !== 'attribute' &&
          nodeType !== 'service' &&
          nodeType !== 'event' &&
          nodeType !== 'metadata'
        ) {
          const newNodeModel = this.logicFlow.getNodeModelById(newId);
          if (newNodeModel) {
            const currentProperties = newNodeModel.getProperties();
            newNodeModel.setProperties({
              ...currentProperties,
              id: newId,
            });
          }
        }

        this.editByNodeHeight(nodeWidth, nodeHeight, true, true);
      } else {
        console.warn('Failed to clone node:', node.id);
      }
    }
  }

  /**
   * 删除节点
   * @param node Node对象
   */
  onDeleteNode(node: any): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeType = node.properties.type;
      const idBase = this.formatVerifyIdBase(id);
      const key = idBase[0];
      const indexStr = idBase[1];
      if (indexStr !== '') {
        const index = parseInt(indexStr);
        if (this.nodeIdMap.hasOwnProperty(nodeType)) {
          let idArray = this.nodeIdMap[key];
          if (Array.isArray(idArray)) {
            idArray = idArray.filter((itemVal) => itemVal !== id);
            this.nodeIdMap[key] = idArray;
          }
        }

        const maxId = this.idMap[key];
        if (index === maxId) {
          if (index > 0) {
            const newMaxId = index - 1;
            this.idMap[key] = newMaxId;
          }
        }
      }
      this.logicFlow.deleteNode(id);
    }
  }

  /**
   * 节点连线事件响应
   */
  handleNodeLink(node: any): void {
    console.log('开始计算节点');
  }

  /**
   * 删除节点事件响应
   */
  handleNodeDelete(node: any): void {
    const subNodeIds = node.properties.outputNodes;
    console.log('开始计算节点：', subNodeIds);
  }

  /**
   * 删除节点连线事件响应
   */
  handleEdgeDelete(node: any): void {
    const subNodeIds = node.properties.outputNodes;
    console.log('开始计算节点：', subNodeIds);
  }

  /**
   * 关联模型计算(待完善)
   * @param node 开始计算节点
   */
  modelCalculation(node: any): void {
    const subNodeIds = node.properties.outputNodes;
    console.log('开始计算节点：', subNodeIds);
  }

  /**
   * 生成节点ID
   * @param nodeType 节点类型
   */
  createNodeModelId(nodeType: string): string {
    let id = '';
    if (this.idMap.hasOwnProperty(nodeType)) {
      id = this.createId(nodeType);
      if (this.nodeIdMap.hasOwnProperty(nodeType)) {
        this.nodeIdMap[nodeType].push(id);
      } else {
        this.nodeIdMap[nodeType] = [id];
      }
    } else {
      this.idMap[nodeType] = 1;
      id = nodeType + 1;
      this.nodeIdMap[nodeType] = [id];
    }
    return id;
  }
  createId(nodeType: string): string {
    const idNumber = this.idMap[nodeType] + 1;
    const id = nodeType + idNumber;
    this.idMap[nodeType] = idNumber;

    // 检查 nodeIdMap[nodeType] 是否存在
    const idArray = this.nodeIdMap[nodeType];
    let isExist = false;

    // 只有当 idArray 存在且为数组时才遍历
    if (idArray && Array.isArray(idArray)) {
      for (let i = 0; i < idArray.length; i++) {
        if (idArray[i] === id) {
          isExist = true;
          break;
        }
      }
    }

    if (isExist) {
      return this.createId(nodeType);
    } else {
      return id;
    }
  }

  /**
   * 从字符串ID中提取末尾的数字部分
   * @param id 字符串ID
   * @returns 末尾的整数值，如果没有则返回0
   */
  formatVerifyId(id: string): string {
    // 使用正则表达式匹配字符串末尾的数字
    const match = id.match(/(\d+)$/);
    const idNumber = match ? parseInt(match[1], 10) : null;
    let idNames = '';
    let index = -1;
    if (idNumber) {
      const len = (idNumber + '').length;
      idNames = id.slice(0, -len);
      index = idNumber;
    } else {
      idNames = id;
    }
    const newId = this.createFormatId(idNames, index);
    if (this.nodeIdMap.hasOwnProperty(idNames)) {
      this.nodeIdMap[idNames].push(newId);
    } else {
      this.nodeIdMap[idNames] = [newId];
    }
    return newId;
  }
  formatVerifyIdBase(id: string): string[] {
    // 使用正则表达式匹配字符串末尾的数字
    const match = id.match(/(\d+)$/);
    const idNumber = match ? parseInt(match[1], 10) : null;
    let idNames = '';
    let index = -1;
    if (idNumber) {
      const len = (idNumber + '').length;
      idNames = id.slice(0, -len);
      index = idNumber;
    } else {
      idNames = id;
    }
    if (index > -1) {
      return [idNames, index + ''];
    } else {
      return [idNames, ''];
    }
  }
  // 创建ID
  createFormatId(idNames: string, index: number): string {
    let isExist = false;
    let id = idNames;
    if (index == -1) {
      index = 0;
    } else {
      index + index + 1;
      id += index;
      this.idMap[idNames] = index;
    }

    const idArray = this.nodeIdMap[idNames];
    if (idArray && Array.isArray(idArray)) {
      for (let i = 0; i < idArray.length; i++) {
        if (idArray[i] === id) {
          isExist = true;
          break;
        }
      }
      if (isExist) {
        return this.createFormatId(idNames, index);
      } else {
        return id;
      }
    } else {
      return id;
    }
  }
  // 生成随机数
  randomNumber(minStr: string, maxStr: string, bitStr: string, valueType: string): number {
    let min: number;
    let max: number;
    let bit = parseInt(bitStr + '');
    if (valueType === 'int') {
      min = parseInt(minStr);
      max = parseInt(maxStr);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      if (bit > 4) {
        bit = 4;
      }
      let multiplier: number;
      switch (bit) {
        case 1:
          multiplier = 10;
          break;
        case 2:
          multiplier = 100;
          break;
        case 3:
          multiplier = 1000;
          break;
        case 4:
          multiplier = 10000;
          break;
        default:
          multiplier = 0;
          break;
      }
      if (bit === 0) {
        min = parseInt(minStr);
        max = parseInt(maxStr);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        min = parseFloat(minStr);
        max = parseFloat(maxStr);
        min = min * multiplier;
        max = max * multiplier;
        min = parseInt(min + '');
        max = parseInt(max + '');
        const value = Math.floor(Math.random() * (max - min + 1)) + min;
        return value / multiplier;
      }
    }
  }

  /**
   * 选中节点宽高修改
   * @param width 宽度
   * @param height 高度
   */
  editByNodeHeight(
    width: number,
    height: number,
    showLeftAnchors: boolean,
    showRightAnchors: boolean
  ): LogicFlow.NodeData | undefined {
    if (this.logicFlow) {
      // 使用正确的方法获取选中的元素
      const selectedElements = this.logicFlow.getSelectElements();
      if (selectedElements.nodes && selectedElements.nodes.length > 0) {
        const node = selectedElements.nodes[0];
        // 强制更新视图
        //selectedElements.nodes.forEach((node: any) => {
        const nodeModel = this.logicFlow.getNodeModelById(node.id);
        if (nodeModel) {
          // 直接更新节点属性并触发重绘
          const currentProperties = nodeModel.getProperties();
          nodeModel.setProperties({
            ...currentProperties,
            width,
            height,
          });

          //

          // 锚点的更新坐标
          const anchorsLeftX = 0 - width / 2;
          const anchorsRightX = width / 2;
          // const anchorsOffset = [
          //   [anchorsLeftX, 0], // 左侧中部
          //   [anchorsRightX, 0], // 右侧中部
          // ];
          let anchorsOffset: any = [];
          if (showLeftAnchors && showRightAnchors) {
            anchorsOffset = [
              [anchorsLeftX, 0], // 左侧中部
              [anchorsRightX, 0], // 右侧中部
            ];
          } else {
            if (showLeftAnchors) {
              anchorsOffset = [
                [anchorsLeftX, 0], // 左侧中部
              ];
            } else if (showRightAnchors) {
              anchorsOffset = [
                [anchorsRightX, 0], // 右侧中部
              ];
            }
          }
          // 同时更新节点模型的高度，确保视图和模型一致
          if (typeof (nodeModel as any).setWidth === 'function') {
            (nodeModel as any).setWidth(width);
          }
          if (typeof (nodeModel as any).setHeight === 'function') {
            (nodeModel as any).setHeight(height);
          }
          if (typeof (nodeModel as any).setAnchorsOffset === 'function') {
            (nodeModel as any).setAnchorsOffset(anchorsOffset);
          }

          // 手动更新节点的height属性，确保LogicFlow内部模型也更新
          (nodeModel as any).width = width;
          (nodeModel as any).height = height;
          (nodeModel as any).anchorsOffset = anchorsOffset;
        }
        return node;
      }
    } else {
      throw new Error('logicFlow is null');
    }
  }

  /**
   * 处理选中状态变化
   * 获取当前选中的节点，并根据结果返回数据或false
   */
  handleSelectionChange(): void {
    const selectedElements = this.getSelectedElements();
    if (selectedElements) {
      console.log('选中的节点:', selectedElements);
    } else {
      console.log('未选中任何节点');
    }
  }

  /**
   * 获取当前选中的节点
   * @returns 如果有选中的节点，返回包含它们数据的对象数组；否则返回false
   */
  getSelectedElements(): any[] | boolean {
    if (!this.logicFlow) {
      return false;
    }

    const selection = this.logicFlow.getSelectElements();
    // 检查是否有选中的节点
    const hasSelectedNodes = selection.nodes && selection.nodes.length > 0;

    if (hasSelectedNodes) {
      // 获取选中节点的详细信息，包括连接信息
      const nodesWithConnections = selection.nodes.map((node) => {
        return this.getNodeWithConnections(node.id);
      });

      return nodesWithConnections;
    } else {
      // 如果没有选中的节点，返回false
      return false;
    }
  }

  /**
   * 获取节点及其连接信息
   * @param nodeId 节点ID
   * @returns 包含节点数据和连接信息的对象
   */
  getNodeWithConnections(nodeId: string): any {
    if (!this.logicFlow) {
      return false;
    }

    // 获取节点数据
    const nodeData = this.logicFlow.getNodeDataById(nodeId);

    // 获取所有边数据
    const graphData: { nodes: LogicFlow.NodeData[]; edges: LogicFlow.EdgeData[] } =
      this.logicFlow.getGraphData() as { nodes: LogicFlow.NodeData[]; edges: LogicFlow.EdgeData[] };
    const allEdges: LogicFlow.EdgeData[] = (graphData.edges as LogicFlow.EdgeData[]) || [];

    // 查找与该节点相连的边
    const connectedEdges = allEdges.filter(
      (edge) => edge.sourceNodeId === nodeId || edge.targetNodeId === nodeId
    );

    // 分别获取左边和右边的连接节点数据
    const leftNodes = connectedEdges
      .filter((edge) => edge.targetNodeId === nodeId)
      .map((edge) => this.logicFlow?.getNodeDataById(edge.sourceNodeId))
      .filter((node) => node !== undefined);

    const rightNodes = connectedEdges
      .filter((edge) => edge.sourceNodeId === nodeId)
      .map((edge) => this.logicFlow?.getNodeDataById(edge.targetNodeId))
      .filter((node) => node !== undefined);

    return {
      node: nodeData,
      leftNodes: leftNodes.length > 0 ? leftNodes : false,
      rightNodes: rightNodes.length > 0 ? rightNodes : false,
    };
  }

  /**
   * 获取当前选中的节点数据
   * @returns 如果有选中的节点，返回包含它们完整数据的对象数组；否则返回false
   */
  getSelectedElementsData(): any[] | boolean {
    if (!this.logicFlow) {
      return false;
    }

    const selection = this.logicFlow.getSelectElements();

    // 检查是否有选中的节点
    const hasSelectedNodes = selection.nodes && selection.nodes.length > 0;

    if (hasSelectedNodes) {
      // 获取完整的节点数据
      const nodesData = selection.nodes.map((node) => this.logicFlow?.getNodeDataById(node.id));

      return nodesData.filter((node) => node !== undefined) as any[];
    }

    // 如果没有选中的节点，返回false
    return false;
  }
}

export const logicFlowUtil = new LogicFlowUtil();
