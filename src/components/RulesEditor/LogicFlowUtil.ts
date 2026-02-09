import LogicFlow, { BaseNodeModel } from '@logicflow/core';
import { Control, Menu, SelectionSelect, MiniMap } from '@logicflow/extension';
import { dateUtils } from '../../utils/dateUtils';
import { funcUtils } from '../../utils/funcUtils';
import { formatUtils } from '../../utils/formatUtils';
import '@logicflow/extension/lib/style/index.css';
import { realTimeData, historicalOne } from '@/api/iot/iot';

import AttributeNode from './Node/AttributeNode';
import EventNode from './Node/EventNode';
import MetadataNode from './Node/MetadataNode';
import VariableNode from './Node/VariableNode';
import RandomNode from './Node/RandomNode';
import JudgmentNode from './Node/JudgmentNode';
import SwitchNode from './Node/SwitchNode';
import OperatorNode from './Node/OperatorNode';
import DateOutputNode from './Node/DateOutputNode';
import DateOperatorNode from './Node/DateOperatorNode';
import FuncNode from './Node/FuncNode';
import ExportNode from './Node/ExportNode';
import ControlNode from './Node/ControlNode';
import TextEdge from './Edge/TextEdge';

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
      edgeType: 'TextEdge', // 先使用默认边类型，稍后注册TextEdge后会覆盖
      snapline: true,
      // 启用画布滚动功能
      multipleSelectKey: 'ctrl',
      autoResize: true,
      keyboard: {
        enabled: true,
      },
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
      this.logicFlow.register(EventNode);
      this.logicFlow.register(MetadataNode);
      this.logicFlow.register(VariableNode);
      this.logicFlow.register(RandomNode);
      this.logicFlow.register(JudgmentNode);
      this.logicFlow.register(SwitchNode);
      this.logicFlow.register(OperatorNode);
      this.logicFlow.register(DateOutputNode);
      this.logicFlow.register(DateOperatorNode);
      this.logicFlow.register(FuncNode);
      this.logicFlow.register(ExportNode);
      this.logicFlow.register(ControlNode);
      this.logicFlow.register(TextEdge);

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
      this.logicFlow.on('connection:not-allowed', (data: any) => {
        if (data.msg.startsWith('msg:')) {
          const errorMsg = data.msg.replace('msg:', '');
          alert(errorMsg);
        }
      });

      // 监听锚点连线事件
      this.logicFlow.on('edge:add', (data: any) => {
        const sourceNodeId = data.data.sourceNodeId; // 源节点ID
        if (sourceNodeId.startsWith('judgment')) {
          this.linkEdgeByJudgment(data);
        } else if (sourceNodeId.startsWith('switch')) {
          this.linkEdgeBySwitch(data);
        }
        this.logicFlowOption();
      });

      // 监听锚点连线删除事件
      this.logicFlow.on('edge:delete', (data: any) => {
        const pointData = data.data;
        console.log('锚点连线删除事件:', pointData);
        // 在这里可以添加自定义处理逻辑
        this.handleEdgeDelete(pointData);
      });

      this.logicFlow.render(rulesData);

      // 渲染完成后，记录已有节点ID到映射中，防止后续创建新节点时发生冲突
      this.recordExistingNodeIds(rulesData);
    }
  }
  linkEdgeByJudgment(data: any) {
    const sourceNodeId = data.data.sourceNodeId; // 源节点ID
    const targetNodeId = data.data.targetNodeId; // 目标节点ID
    // 获取sourceNodeId的Node节点
    const sourceNode = this.logicFlow?.getNodeModelById(sourceNodeId);
    const properties = sourceNode?.properties;
    const ifNodeId = properties?.ifNodeId;
    const elseNodeId = properties?.elseNodeId;

    // 根据edgeId获取edge对象
    const edgeId = data.data.id;
    if (ifNodeId === targetNodeId) {
      // 修改edge对象的text为IF
      const edgeModel = this.logicFlow?.graphModel.getEdgeModelById(edgeId);
      if (edgeModel) {
        edgeModel.setProperty('text', 'IF');
        edgeModel.setAttributes();
      }
    } else if (elseNodeId === targetNodeId) {
      // 修改edge对象的text为ELSE
      const edgeModel = this.logicFlow?.graphModel.getEdgeModelById(edgeId);
      if (edgeModel) {
        edgeModel.setProperty('text', 'ELSE');
        edgeModel.setAttributes();
      }
    }
  }
  linkEdgeBySwitch(data: any) {
    if (this.logicFlow) {
      const sourceNodeId = data.data.sourceNodeId; // 源节点ID
      const targetNodeId = data.data.targetNodeId; // 目标节点ID
      // 获取sourceNodeId的Node节点
      const sourceNode = this.logicFlow.getNodeModelById(sourceNodeId);
      if (sourceNode) {
        const properties = sourceNode.properties;
        const conditionArray = properties.condition;

        let text = '';
        let hasCase = false;
        for (let i = 0; i < conditionArray.length; i++) {
          const condition = conditionArray[i];
          const toNodeId = condition.toNodeId;
          if (toNodeId === targetNodeId) {
            hasCase = true;
            text = 'Case ' + condition.caseValue;
            break;
          }
        }

        if (!hasCase) {
          text = 'Default';
        }

        // 根据edgeId获取edge对象
        const edgeId = data.data.id;
        const edgeModel = this.logicFlow?.graphModel.getEdgeModelById(edgeId);
        if (edgeModel) {
          edgeModel.setProperty('text', text);
          edgeModel.setAttributes();
        }
      }
    }
  }

  /**
   * 创建物模型节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y

   */
  addModelNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): any {
    if (!draggableData) {
      throw new Error('draggableData is null');
    }
    const x = draggableX ?? 100;
    const y = draggableY ?? 100;
    const id = this.createNodeModelId(draggableData.type);

    let height = 220;
    if (draggableData.type === 'event') {
      height = 200;
    }

    const itemNode = {
      id,
      type: draggableData.node,
      x,
      y,
      properties: {
        id: '',
        width: 240,
        height,
        minWidth: 240,
        minHeight: height,
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
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
    return itemNode;
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
          identity: data.modelIdentity,
          deviceId: data.deviceId,
          deviceName: data.deviceName,
          location: data.spaceRouteName,
          valueType: data.dataType,
          defaultValue,
          outputValue: nodeModel.properties.inputValue === '' ? defaultValue : data.inputValue,
          unit: unit,
          configure: true,
          error,
          message,
        };
        console.log('更新节点属性:', newProperties);
        this.logicFlow.setProperties(id, newProperties);
      }
    }
  }

  /**
   * 创建元数据节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addDataNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): any {
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
        defaultValue: '',
        inputValue: '',
        outputValue: '',
        unit: '',
        configure: false,
        error: true,
        message: '模型数据为空',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
    return itemNode;
  }
  async editDataNode(data: any): Promise<void> {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      // 调用接口，获取数据
      // identity: data.properties.orderBy,
      const params = {
        deviceId: data.properties.deviceId,
        identity: data.properties.modelIdentity,
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
          configure: true,
          error,
          message,
        };
        this.logicFlow.setProperties(data.id, newProperties);
      }
    }
  }

  /**
   * 创建变量节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addVariableNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): any {
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
        outputValue: '0',
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
    return itemNode;
  }
  editVariableNode(data: any): void {
    if (!data) {
      throw new Error('data is null');
    }

    if (this.logicFlow) {
      const valueType = data.properties.valueType;
      let defaultValue = data.properties.defaultValue;
      if (valueType === 'timestamp') {
        defaultValue = new Date(defaultValue).getTime() + '';
      }

      // 获取节点模型
      const nodeModel = this.logicFlow.getNodeModelById(data.id);
      if (nodeModel) {
        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          valueType: data.properties.valueType,
          defaultValue,
          outputValue:
            nodeModel.properties.inputValue === '' ? defaultValue : data.properties.inputValue,
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
      }
    }
  }

  /**
   * 创建随机数节点
   * @param draggableData 拖拽对象
   * @param draggableX 节点坐标x
   * @param draggableY 节点坐标y
   */
  addRandomNode(draggableData: any, draggableX?: number | null, draggableY?: number | null): any {
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
        configure: false,
        error: true,
        message: '模型数据为空',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
    return itemNode;
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
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
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
        width: 220,
        height: 86,
        minWidth: 220,
        minHeight: 86,
        label: '条件判断',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        condition: [],
        otherwise: '',
        ifNodeId: '',
        elseNodeId: '',
        configure: false,
        error: true,
        message: '模型数据为空',
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
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
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
        width: 200,
        height: 86,
        minWidth: 200,
        minHeight: 86,
        label: '多分支判断',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        condition: [],
        otherwise: '',
        configure: false,
        error: true,
        message: '模型数据为空',
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
        const oldProperties = nodeModel.getProperties();
        const oldOtherwise = oldProperties.otherwise;
        const newCondition = data.properties.condition;
        // 获取节点连接的边
        const edges = this.logicFlow.getEdgeModels({
          sourceNodeId: data.id,
        });
        console.log('edges', edges);
        if (edges && edges.length > 0) {
          const edgeArray: any[] = [];
          for (let i = 0; i < edges.length; i++) {
            if (edges[i].targetNodeId !== oldOtherwise) {
              edgeArray.push(edges[i]);
            }
          }

          for (let i = 0; i < edgeArray.length; i++) {
            const targetNodeId = edgeArray[i].targetNodeId;
            let hasCase = false;
            for (let j = 0; j < newCondition.length; j++) {
              if (newCondition[j].toNodeId === targetNodeId) {
                hasCase = true;
                break;
              }
            }
            if (!hasCase) {
              this.logicFlow.deleteEdgeByNodeId({
                sourceNodeId: data.id,
                targetNodeId: targetNodeId,
              });
            }
          }
        }

        // 更新节点属性
        const newProperties = {
          ...nodeModel.getProperties(),
          condition: newCondition,
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
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
        mainNode: null,
        subNodes: [],
        valueType: 'int',
        outputValue: '0',
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
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
        const count = data.properties.subNodes.length;
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
          mainNode: data.properties.mainNode,
          subNodes: data.properties.subNodes,
          valueType: data.properties.valueType,
          outputValue: data.properties.outputValue,
          minHeight: newHeight,
          height: newHeight,
          configure: true,
        };
        nodeModel.setProperties(newProperties);

        // 更新DOM元素高度
        if (nodeModel.rootEl) {
          const wrapper = nodeModel.rootEl.querySelector('.operator-wrapper');
          if (wrapper) {
            wrapper.style.height = newHeight + 'px';
          }
        }
        this.logicFlow.setProperties(data.id, newProperties);
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
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
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
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
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
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
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
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
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
        height: 150,
        minWidth: 240,
        minHeight: 150,
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
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
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
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
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
        height: 150,
        minWidth: 240,
        minHeight: 150,
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
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
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
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
      }
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
        height: 132,
        minWidth: 200,
        minHeight: 132,
        label: '输出',
        group: draggableData.group,
        icon: draggableData.icon,
        type: draggableData.type,
        inputNodes: null,
        outputNodes: null,
        nodeId: '',
        valueType: '',
        outputValue: '',
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
      },
    };

    if (this.logicFlow) {
      this.logicFlow.addNode(itemNode);
    }
  }
  editExportNode(data: any): void {
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
          nodeId: data.properties.nodeId,
          valueType: data.properties.valueType,
          outputValue: data.properties.outputValue,
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
      }
    }
  }

  /**
   * 创建控制执行节点
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
        ifElse: '',
        caseValue: '',
        configure: false,
        error: true,
        message: '模型数据为空',
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
          configure: true,
        };
        this.logicFlow.setProperties(data.id, newProperties);
      }
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
        if (nodeType !== 'attribute' && nodeType !== 'event' && nodeType !== 'metadata') {
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
        console.warn('节点克隆失败:', node.id);
      }
    }
  }

  /**
   * 删除node
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
   * 监听删除Edge事件响应
   */
  handleEdgeDelete(pointData: any): void {
    if (this.logicFlow) {
      const sourceNodeId: string = pointData.sourceNodeId; //左节点
      const targetNodeId: string = pointData.targetNodeId; //右节点
      const sourceNodeModel = this.logicFlow.getNodeModelById(sourceNodeId);
      const targetNodeModel = this.logicFlow.getNodeModelById(targetNodeId);

      // 左节点操作
      if (sourceNodeModel) {
        const leftProperties = sourceNodeModel.getProperties();
        const leftType = leftProperties.type;
        if (leftType === 'judgment') {
          this.delEdgeLeftByJudgment(sourceNodeId, targetNodeId);
        } else if (leftType === 'switch') {
          this.delEdgeLeftBySwitch(sourceNodeId, targetNodeId);
        } else {
          this.delEdgeLeftByOther(sourceNodeId, targetNodeId);
        }
      }

      // 右节点操作
      if (targetNodeModel) {
        const rightProperties = targetNodeModel.getProperties();
        const rightType = rightProperties.type;
        if (rightType === 'attribute' || rightType === 'variable') {
          this.delEdgeRightByData(sourceNodeId, targetNodeId);
        } else if (rightType === 'judgment') {
          this.delEdgeRightByJudgment(sourceNodeId, targetNodeId);
        } else if (rightType === 'switch') {
          this.delEdgeRightBySwitch(sourceNodeId, targetNodeId);
        } else if (rightType === 'export') {
          this.delEdgeRightByExport(sourceNodeId, targetNodeId);
        } else {
          this.delEdgeRightByOther(sourceNodeId, targetNodeId);
        }
      }
      this.logicFlowOption();
    }
  }
  delEdgeLeftByJudgment(sourceNodeId: string, targetNodeId: string) {
    if (this.logicFlow) {
      const sourceNodeModel = this.logicFlow.getNodeModelById(sourceNodeId);
      if (sourceNodeModel) {
        const leftProperties = sourceNodeModel.getProperties();
        const outputNodes: string[] = leftProperties.outputNodes;
        let newOutputNodes: string[] | null = [];
        for (let i = 0; i < outputNodes.length; i++) {
          if (outputNodes[i] !== targetNodeId) {
            newOutputNodes.push(outputNodes[i]);
          }
        }
        if (newOutputNodes.length === 0) {
          newOutputNodes = null;
        }

        let newOutProperties: any;
        if (leftProperties.ifNodeId === targetNodeId) {
          newOutProperties = {
            ...sourceNodeModel.getProperties(),
            outputNodes: newOutputNodes,
            ifNodeId: '',
          };
        } else {
          newOutProperties = {
            ...sourceNodeModel.getProperties(),
            outputNodes: newOutputNodes,
            elseNodeId: '',
          };
        }
        this.logicFlow.setProperties(sourceNodeId, newOutProperties);
      }
    }
  }
  delEdgeLeftBySwitch(sourceNodeId: string, targetNodeId: string) {
    if (this.logicFlow) {
      const sourceNodeModel = this.logicFlow.getNodeModelById(sourceNodeId);
      if (sourceNodeModel) {
        const leftProperties = sourceNodeModel.getProperties();
        const outputNodes: string[] = leftProperties.outputNodes;
        let newOutputNodes: string[] | null = [];
        for (let i = 0; i < outputNodes.length; i++) {
          if (outputNodes[i] !== targetNodeId) {
            newOutputNodes.push(outputNodes[i]);
          }
        }
        if (newOutputNodes.length === 0) {
          newOutputNodes = null;
        }

        let newOutProperties: any;
        const conditionArray = leftProperties.condition;
        if (leftProperties.otherwise === targetNodeId) {
          newOutProperties = {
            ...sourceNodeModel.getProperties(),
            outputNodes: newOutputNodes,
            otherwise: '',
          };
          this.logicFlow.setProperties(sourceNodeId, newOutProperties);
        } else {
          console.log('switch节点删除条件判断', leftProperties);
          if (conditionArray && conditionArray.length > 0) {
            for (let i = 0; i < conditionArray.length; i++) {
              if (conditionArray[i].toNodeId === targetNodeId) {
                conditionArray[i].toNodeId = '';
                break;
              }
            }
            newOutProperties = {
              ...sourceNodeModel.getProperties(),
              outputNodes: newOutputNodes,
              condition: conditionArray,
            };
            this.logicFlow.setProperties(sourceNodeId, newOutProperties);
          }
        }
      }
    }
  }
  delEdgeLeftByOther(sourceNodeId: string, targetNodeId: string) {
    if (this.logicFlow) {
      const sourceNodeModel = this.logicFlow.getNodeModelById(sourceNodeId);
      if (sourceNodeModel) {
        const leftProperties = sourceNodeModel.getProperties();
        const outputNodes: string[] = leftProperties.outputNodes;
        let newOutputNodes: string[] | null = [];
        for (let i = 0; i < outputNodes.length; i++) {
          if (outputNodes[i] !== targetNodeId) {
            newOutputNodes.push(outputNodes[i]);
          }
        }
        if (newOutputNodes.length === 0) {
          newOutputNodes = null;
        }

        const newOutProperties = {
          ...sourceNodeModel.getProperties(),
          outputNodes: newOutputNodes,
        };
        this.logicFlow.setProperties(sourceNodeId, newOutProperties);
      }
    }
  }
  delEdgeRightByData(sourceNodeId: string, targetNodeId: string) {
    if (this.logicFlow) {
      const targetNodeModel = this.logicFlow.getNodeModelById(targetNodeId);
      if (targetNodeModel) {
        const rightProperties = targetNodeModel.getProperties();
        const inputNodes: string[] = rightProperties.inputNodes;
        let newInputNodes: string[] | null = [];
        for (let i = 0; i < inputNodes.length; i++) {
          if (inputNodes[i] !== sourceNodeId) {
            newInputNodes.push(inputNodes[i]);
          }
        }
        if (newInputNodes.length === 0) {
          newInputNodes = null;
        }

        const valueType = rightProperties.valueType;
        const defaultValue = rightProperties.defaultValue;
        let outputValue: any;
        switch (valueType) {
          case 'int':
            outputValue = parseInt(defaultValue);
            break;
          case 'number':
            outputValue = parseFloat(defaultValue);
            break;
          case 'bool':
            // 载为bool值
            outputValue = Boolean(defaultValue);
            break;
          case 'enum':
            outputValue = parseInt(defaultValue);
            break;
          default:
            outputValue = defaultValue;
        }
        const newInProperties = {
          ...targetNodeModel.getProperties(),
          inputNodes: newInputNodes,
          outputValue: outputValue,
        };
        this.logicFlow.setProperties(targetNodeId, newInProperties);
      }
    }
  }
  delEdgeRightByJudgment(sourceNodeId: string, targetNodeId: string) {
    if (this.logicFlow) {
      const targetNodeModel = this.logicFlow.getNodeModelById(targetNodeId);
      if (targetNodeModel) {
        const rightProperties = targetNodeModel.getProperties();
        const inputNodes: string[] = rightProperties.inputNodes;
        let newInputNodes: string[] | null = [];
        for (let i = 0; i < inputNodes.length; i++) {
          if (inputNodes[i] !== sourceNodeId) {
            newInputNodes.push(inputNodes[i]);
          }
        }
        if (newInputNodes.length === 0) {
          newInputNodes = null;
        }

        const conditionArray = rightProperties.condition;
        const newConditionArray: any[] = [];
        let lastLink = '';
        let isLastItem = false;
        for (let i = 0; i < conditionArray.length; i++) {
          const item = conditionArray[i];
          if (item.nodeId === sourceNodeId) {
            lastLink = item.link;
            isLastItem = true;
          } else {
            if (isLastItem) {
              item.link = lastLink;
              lastLink = '';
              isLastItem = false;
            }
            newConditionArray.push(item);
          }
        }
        const newInProperties = {
          ...targetNodeModel.getProperties(),
          inputNodes: newInputNodes,
          condition: newConditionArray,
        };
        this.logicFlow.setProperties(targetNodeId, newInProperties);
      }
    }
  }
  delEdgeRightBySwitch(sourceNodeId: string, targetNodeId: string) {
    if (this.logicFlow) {
      const targetNodeModel = this.logicFlow.getNodeModelById(targetNodeId);
      if (targetNodeModel) {
        const rightProperties = targetNodeModel.getProperties();
        const inputNodes: string[] = rightProperties.inputNodes;
        let newInputNodes: string[] | null = [];
        for (let i = 0; i < inputNodes.length; i++) {
          if (inputNodes[i] !== sourceNodeId) {
            newInputNodes.push(inputNodes[i]);
          }
        }
        if (newInputNodes.length === 0) {
          newInputNodes = null;
        }
        console.log('delEdgeRightBySwitch1', sourceNodeId);
        console.log('delEdgeRightBySwitch2', targetNodeId);

        if (this.logicFlow) {
          this.logicFlow.deleteEdgeByNodeId({
            sourceNodeId: targetNodeId,
          });
        }

        const newInProperties = {
          ...targetNodeModel.getProperties(),
          inputNodes: [],
          condition: [],
        };
        this.logicFlow.setProperties(targetNodeId, newInProperties);
      }
    }
  }
  delEdgeRightByExport(sourceNodeId: string, targetNodeId: string) {
    if (this.logicFlow) {
      const targetNodeModel = this.logicFlow.getNodeModelById(targetNodeId);
      if (targetNodeModel) {
        const rightProperties = targetNodeModel.getProperties();
        const inputNodes: string[] = rightProperties.inputNodes;
        let newInputNodes: string[] | null = [];
        for (let i = 0; i < inputNodes.length; i++) {
          if (inputNodes[i] !== sourceNodeId) {
            newInputNodes.push(inputNodes[i]);
          }
        }
        if (newInputNodes.length === 0) {
          newInputNodes = null;
        }

        const newInProperties = {
          ...targetNodeModel.getProperties(),
          inputNodes: newInputNodes,
          nodeId: '',
          valueType: '',
          outputValue: '',
        };
        this.logicFlow.setProperties(targetNodeId, newInProperties);
      }
    }
  }
  delEdgeRightByOther(sourceNodeId: string, targetNodeId: string) {
    if (this.logicFlow) {
      const targetNodeModel = this.logicFlow.getNodeModelById(targetNodeId);
      if (targetNodeModel) {
        const rightProperties = targetNodeModel.getProperties();
        const inputNodes: string[] = rightProperties.inputNodes;
        let newInputNodes: string[] | null = [];
        for (let i = 0; i < inputNodes.length; i++) {
          if (inputNodes[i] !== sourceNodeId) {
            newInputNodes.push(inputNodes[i]);
          }
        }
        if (newInputNodes.length === 0) {
          newInputNodes = null;
        }

        const newInProperties = {
          ...targetNodeModel.getProperties(),
          inputNodes: newInputNodes,
        };
        this.logicFlow.setProperties(targetNodeId, newInProperties);
      }
    }
  }

  /**
   * 模型计算(待完善)
   * @param node 开始计算节点
   */
  logicFlowOption(): void {
    if (this.logicFlow) {
      const logicData: any = this.logicFlow.getGraphData();
      if (logicData) {
        // 获取起点Node
        logicData.nodes.forEach((node: any) => {
          const nodeProperties: any = node.properties;
          const inputNodes: string[] = nodeProperties.inputNodes || [];
          //开始节点
          if (nodeProperties.inputNodes === null || inputNodes.length === 0) {
            this.startNodeOption(node.id);
          }
        });
      }
    }
  }
  startNodeOption(id: string): void {
    if (this.logicFlow) {
      const node = this.logicFlow.getNodeModelById(id);
      if (node) {
        const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
        const configure = nodeProperties.configure;
        const nodeType = nodeProperties.type;
        if (configure) {
          switch (nodeType) {
            case 'attribute':
            case 'event':
              this.objectNodeOption(node);
              break;
            case 'metadata':
              this.metadataNodeOption(node);
              break;
            case 'variable':
              this.variableNodeOption(node);
              break;
            case 'random':
              this.randomNodeOption(node);
              break;
            case 'judgment':
            case 'switch':
              this.judgmentNodeOption(node);
              break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'modular':
              this.computeNodeOption(node);
              break;
            case 'dateOutput':
              this.dateOutputNodeOption(node);
              break;
            case 'dateOperator':
              this.dateOperatorNodeOption(node);
              break;
            case 'func':
              this.funcNodeOption(node);
              break;
            case 'format':
              this.formatNodeOption(node);
              break;
            case 'export':
              this.exportNodeOption(node);
              break;
          }
        }
      }
    }
  }
  async objectNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): Promise<void> {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const deviceId = nodeProperties.deviceId;
      const identity = nodeProperties.identity;
      const inputNodes: string[] | null = nodeProperties.inputNodes;
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      let isInputValue = false;
      let inputValue = '';
      if (inputNodes && inputNodes.length > 0) {
        const inputNodeId = inputNodes[0];
        if (!inputNodeId.startsWith('judgment') && !inputNodeId.startsWith('switch')) {
          isInputValue = true;
          // 获取左侧的值
          const leftNode = this.logicFlow.getNodeModelById(inputNodeId);
          if (leftNode) {
            const leftProperties: any = leftNode.getProperties();
            inputValue = leftProperties.outputValue;
          }
        }
      }

      let defaultValue: number | string | object | any | any[] | null;
      let error: boolean;
      let message: string;
      // 调用接口，获取数据
      const params = {
        deviceId,
        identity,
      };
      const result = (await realTimeData(params)) as unknown as {
        status: string;
        message: string;
        data: any;
      };

      if (result.status === 'success') {
        defaultValue = result.data.value + '';
        error = !result.data.hasValue;
        message = result.data.message;
      } else {
        defaultValue = 'none';
        error = false;
        message = '接口调用错误';
      }
      const outputValue = isInputValue ? inputValue : defaultValue;

      const newProperties = {
        ...nodeProperties,
        inputValue,
        defaultValue,
        outputValue,
        error,
        message,
      };

      // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
      setTimeout(() => {
        this.logicFlow?.setProperties(id, newProperties);
      }, 200);

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  async metadataNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): Promise<void> {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const deviceId = nodeProperties.deviceId;
      const identity = nodeProperties.modelIdentity;
      const timeFrame = nodeProperties.timeFrame;
      const timeData = nodeProperties.timeData;
      const queryOut = nodeProperties.queryOut;
      const inputNodes: string[] | null = nodeProperties.inputNodes;
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      let isInputValue = false;
      let inputValue = '';
      if (inputNodes && inputNodes.length > 0) {
        const inputNodeId = inputNodes[0];
        if (!inputNodeId.startsWith('judgment') && !inputNodeId.startsWith('switch')) {
          isInputValue = true;
          // 获取左侧的值
          const leftNode = this.logicFlow.getNodeModelById(inputNodeId);
          if (leftNode) {
            const leftProperties: any = leftNode.getProperties();
            inputValue = leftProperties.outputValue;
          }
        }
      }

      let defaultValue: number | string | object | any | any[] | null;
      let error: boolean;
      let message: string;
      // 调用接口，获取数据
      const params = {
        deviceId,
        identity,
        timeFrame,
        timeData,
        queryOut,
      };
      const result = (await historicalOne(params)) as unknown as {
        status: string;
        message: string;
        data: any;
      };
      if (result.status === 'success') {
        defaultValue = result.data.value + '';
        error = !result.data.hasValue;
        message = result.data.message;
      } else {
        defaultValue = 'none';
        error = false;
        message = '接口调用错误';
      }
      const outputValue = isInputValue ? inputValue : defaultValue;

      const newProperties = {
        ...nodeProperties,
        inputValue,
        defaultValue,
        outputValue,
        error,
        message,
      };

      // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
      setTimeout(() => {
        this.logicFlow?.setProperties(id, newProperties);
      }, 200);

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  variableNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const defaultValue = nodeProperties.defaultValue;
      const inputNodes: string[] | null = nodeProperties.inputNodes;
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      let isInputValue = false;
      let inputValue = '';
      if (inputNodes && inputNodes.length > 0) {
        const inputNodeId = inputNodes[0];
        if (!inputNodeId.startsWith('judgment') && !inputNodeId.startsWith('switch')) {
          isInputValue = true;
          // 获取左侧的值
          const leftNode = this.logicFlow.getNodeModelById(inputNodeId);
          if (leftNode) {
            const leftProperties: any = leftNode.getProperties();
            inputValue = leftProperties.outputValue;
          }
        }
      }
      const outputValue = isInputValue ? inputValue : defaultValue;

      const newProperties = {
        ...nodeProperties,
        inputValue,
        outputValue,
      };

      // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
      setTimeout(() => {
        this.logicFlow?.setProperties(id, newProperties);
      }, 200);

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  randomNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const minNum = nodeProperties.minNum;
      const maxNum = nodeProperties.maxNum;
      const bits = nodeProperties.bits;
      const valueType = nodeProperties.valueType;
      const outputNodes: string[] | null = nodeProperties.outputNodes;
      const outputValue = this.randomNumber(minNum, maxNum, bits, valueType);

      const newProperties = {
        ...nodeProperties,
        outputValue,
      };

      // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
      setTimeout(() => {
        this.logicFlow?.setProperties(id, newProperties);
      }, 200);

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  judgmentNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  computeNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const nodeType = nodeProperties.type;
      const mainNodeId = nodeProperties.mainNode;
      const subNodeIds: string[] = nodeProperties.subNodes;
      const valueType = nodeProperties.valueType;
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      let isError = true;
      let outputValue = '0';
      if (!mainNodeId && mainNodeId !== '') {
        if (subNodeIds.length > 0) {
          const mainNode = this.logicFlow.getNodeModelById(mainNodeId);
          if (mainNode) {
            const nodeProperties: LogicFlow.PropertiesType = mainNode.getProperties();
            let mainValue = nodeProperties.outputValue;
            if (mainValue || mainValue === '' || mainValue === 'none') {
              mainValue = '0';
            }
            let outputVal = Number(mainValue);

            for (let i = 0; i < subNodeIds.length; i++) {
              const subNode = this.logicFlow.getNodeModelById(subNodeIds[i]);
              let subValue = '0';
              if (subNode) {
                const nodeProperties: LogicFlow.PropertiesType = subNode.getProperties();
                subValue = nodeProperties.outputValue;
              }
              if (subValue || subValue === '' || subValue === 'none') {
                subValue = '0';
              }
              const subVal = Number(subValue);

              switch (nodeType) {
                case 'add':
                  outputVal = outputVal + subVal;
                  break;
                case 'subtract':
                  outputVal = outputVal - subVal;
                  break;
                case 'multiply':
                  outputVal = outputVal * subVal;
                  break;
                case 'divide':
                  outputVal = outputVal / subVal;
                  outputVal = Number(outputVal.toFixed(4));
                  break;
                case 'modular':
                  outputVal = outputVal % subVal;
                  break;
              }
            }
            if (valueType === 'int') {
              outputVal = parseInt(outputVal + '');
            }
            outputValue = outputVal + '';
            isError = false;
          }
        }
      }

      let message = '';
      if (isError) {
        message = '计算错误，请检查计算参数';
      }
      const newProperties = {
        ...nodeProperties,
        outputValue,
        error: isError,
        message,
      };

      // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
      setTimeout(() => {
        this.logicFlow?.setProperties(id, newProperties);
      }, 200);

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  dateOutputNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const inputType = nodeProperties.inputType;
      const outputTypeId = nodeProperties.outputTypeId;
      const outputFormat = nodeProperties.outputFormat;
      const inputNodes: string[] | null = nodeProperties.inputNodes;
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      let isInputValue = false;
      let inputValue = '';
      if (inputNodes && inputNodes.length > 0) {
        const inputNodeId = inputNodes[0];
        if (!inputNodeId.startsWith('judgment') && !inputNodeId.startsWith('switch')) {
          isInputValue = true;
          // 获取左侧的值
          const leftNode = this.logicFlow.getNodeModelById(inputNodeId);
          if (leftNode) {
            const leftProperties: any = leftNode.getProperties();
            inputValue = leftProperties.outputValue;
          }
        }
      }
      if (isInputValue) {
        let outputBase: string[];
        if (inputType === 'date') {
          outputBase = dateUtils.conversionByDate(inputValue, outputTypeId, outputFormat);
        } else if (inputType === 'datetime') {
          outputBase = dateUtils.conversionByDateTime(inputValue, outputTypeId, outputFormat);
        } else if (inputType === 'timestamp') {
          outputBase = dateUtils.conversionByTimestamp(inputValue, outputTypeId, outputFormat);
        } else {
          outputBase = dateUtils.conversionByTime(inputValue, outputTypeId, outputFormat);
        }
        const outputValue = outputBase[0];
        const valueType = outputBase[1];

        const newProperties = {
          ...nodeProperties,
          valueType,
          outputValue,
        };

        // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
        setTimeout(() => {
          this.logicFlow?.setProperties(id, newProperties);
        }, 200);
      }

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  dateOperatorNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const inputType = nodeProperties.inputType;
      const timeCompare = nodeProperties.timeCompare;
      const timeValue = nodeProperties.timeValue;
      const timeUtil = nodeProperties.timeUtil;
      const inputNodes: string[] | null = nodeProperties.inputNodes;
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      let isInputValue = false;
      let inputValue = '';
      if (inputNodes && inputNodes.length > 0) {
        const inputNodeId = inputNodes[0];
        if (!inputNodeId.startsWith('judgment') && !inputNodeId.startsWith('switch')) {
          isInputValue = true;
          // 获取左侧的值
          const leftNode = this.logicFlow.getNodeModelById(inputNodeId);
          if (leftNode) {
            const leftProperties: any = leftNode.getProperties();
            inputValue = leftProperties.outputValue;
          }
        }
      }
      if (isInputValue) {
        let outputValue = '';
        if (inputType === 'date') {
          outputValue = dateUtils.computeByDate(inputValue, timeCompare, timeValue, timeUtil);
        } else if (inputType === 'datetime') {
          outputValue = dateUtils.computeByDateTime(inputValue, timeCompare, timeValue, timeUtil);
        } else if (inputType === 'timestamp') {
          outputValue = dateUtils.computeByTimestamp(inputValue, timeCompare, timeValue, timeUtil);
        } else {
          outputValue = dateUtils.computeByTime(inputValue, timeCompare, timeValue, timeUtil);
        }

        const newProperties = {
          ...nodeProperties,
          outputValue,
        };

        // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
        setTimeout(() => {
          this.logicFlow?.setProperties(id, newProperties);
        }, 200);
      }

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  funcNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const inputId1 = nodeProperties.inputId1;
      const inputId2 = nodeProperties.inputId2;
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      if (inputId1 !== '') {
        const nodeData1 = this.logicFlow.getNodeModelById(inputId1);
        let nodeData2: any = {};
        if (inputId2 !== '') {
          nodeData2 = this.logicFlow.getNodeModelById(inputId2);
        }

        let funcDataArray: string[];
        if (nodeProperties.func === 'string') {
          funcDataArray = funcUtils.executionString(nodeProperties, nodeData1, nodeData2);
        } else {
          funcDataArray = funcUtils.executionMath(nodeProperties, nodeData1, nodeData2);
        }
        const outputValue = funcDataArray[0];
        const valueType = funcDataArray[1];

        const newProperties = {
          ...nodeProperties,
          valueType,
          outputValue,
        };

        // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
        setTimeout(() => {
          this.logicFlow?.setProperties(id, newProperties);
        }, 200);
      }

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  formatNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const inputId1 = nodeProperties.inputId1;
      const outputNodes: string[] | null = nodeProperties.outputNodes;

      if (inputId1 !== '') {
        const nodeData = this.logicFlow.getNodeModelById(inputId1);
        let dataArray: string[];
        if (nodeProperties.funcType === 'string') {
          dataArray = formatUtils.conversionString(nodeProperties, nodeData);
        } else if (nodeProperties.funcType === 'int') {
          dataArray = formatUtils.conversionInt(nodeProperties, nodeData);
        } else if (nodeProperties.funcType === 'number') {
          dataArray = formatUtils.conversionNumber(nodeProperties, nodeData);
        } else {
          dataArray = formatUtils.conversionBool(nodeProperties, nodeData);
        }
        const outputValue = dataArray[0];
        const valueType = dataArray[1];

        const newProperties = {
          ...nodeProperties,
          valueType,
          outputValue,
        };

        // 延迟200毫秒更新节点属性，确保数据更新后再进行计算
        setTimeout(() => {
          this.logicFlow?.setProperties(id, newProperties);
        }, 200);
      }

      if (outputNodes && outputNodes.length > 0) {
        for (let i = 0; i < outputNodes.length; i++) {
          this.startNodeOption(outputNodes[i]);
        }
      }
    }
  }
  exportNodeOption(node: BaseNodeModel<LogicFlow.PropertiesType>): void {
    if (this.logicFlow) {
      const id = node.id;
      const nodeProperties: LogicFlow.PropertiesType = node.getProperties();
      const nodeId = nodeProperties.nodeId;

      if (nodeId !== '') {
        const exportNode: any = this.logicFlow.getNodeModelById(nodeId);
        const exportPropertie = exportNode.properties;
        const outputValue = exportPropertie.outputValue;

        const newProperties = {
          ...nodeProperties,
          outputValue,
        };
        this.logicFlow?.setProperties(id, newProperties);
      }
    }
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

  /**
   * 记录已存在的节点ID，避免新节点与历史节点的ID冲突
   * @param rulesData 规则数据
   */
  recordExistingNodeIds(rulesData: any): void {
    if (!rulesData || !rulesData.nodes || !Array.isArray(rulesData.nodes)) {
      return;
    }

    for (const node of rulesData.nodes) {
      if (node && node.id && typeof node.id === 'string') {
        // 提取节点类型（从ID中获取前缀，如：attribute1, event2等）
        const nodeId = node.id;
        const nodeTypeMatch = nodeId.match(/^([a-zA-Z]+)(\d+)$/);

        if (nodeTypeMatch) {
          const nodeType = nodeTypeMatch[1];
          const nodeNumber = parseInt(nodeTypeMatch[2], 10);

          // 更新idMap，记录该类型的最大编号
          if (!this.idMap.hasOwnProperty(nodeType)) {
            this.idMap[nodeType] = 0;
          }
          if (nodeNumber > this.idMap[nodeType]) {
            this.idMap[nodeType] = nodeNumber;
          }

          // 更新nodeIdMap，记录该类型的所有ID
          if (!this.nodeIdMap.hasOwnProperty(nodeType)) {
            this.nodeIdMap[nodeType] = [];
          }
          if (!this.nodeIdMap[nodeType].includes(nodeId)) {
            this.nodeIdMap[nodeType].push(nodeId);
          }
        } else {
          // 如果ID不符合标准格式，直接记录到nodeIdMap中，但不计入计数
          console.warn(`节点ID "${nodeId}" 不符合标准格式，将被单独记录`);
          // 尝试提取类型部分
          const parts = nodeId.split(/(\d+)/);
          if (parts.length >= 2) {
            const nodeType = parts[0];
            if (!this.nodeIdMap.hasOwnProperty(nodeType)) {
              this.nodeIdMap[nodeType] = [];
            }
            if (!this.nodeIdMap[nodeType].includes(nodeId)) {
              this.nodeIdMap[nodeType].push(nodeId);
            }
          }
        }
      }
    }
  }
}

export const logicFlowUtil = new LogicFlowUtil();
