export const groupList = [
  {
    label: '数据对象',
    value: 'object',
  },
  {
    label: '条件判断',
    value: 'judgement',
  },
  {
    label: '计算符',
    value: 'compute',
  },
  {
    label: '日期时间',
    value: 'timer',
  },
  {
    label: '函数方法',
    value: 'function',
  },
  {
    label: '执行输出',
    value: 'option',
  },
  {
    label: '操作方法',
    value: 'execute',
  },
];

export const componentList = [
  {
    id: 100,
    label: '数据对象',
    type: 'attribute',
    group: 'object',
    nodeType: 'AttributeNode',
    iconClass: 'attrIco',
  },
  {
    id: 101,
    label: '事件对象',
    type: 'event',
    group: 'object',
    nodeType: 'EventNode',
    iconClass: 'eventIco',
  },
  {
    id: 102,
    label: '元数据',
    type: 'metadata',
    group: 'object',
    nodeType: 'MetadataNode',
    iconClass: 'metadataIco',
  },
  {
    id: 103,
    label: '数值变量',
    type: 'variable',
    group: 'object',
    nodeType: 'VariableNode',
    iconClass: 'variableIco',
  },
  {
    id: 104,
    label: '随机数',
    type: 'random',
    group: 'object',
    nodeType: 'RandomNode',
    iconClass: 'randomIco',
  },
  {
    id: 200,
    label: '条件判断',
    type: 'judgment',
    group: 'judgment',
    nodeType: 'JudgmentNode',
    iconClass: 'judgmentIco',
  },
  {
    id: 201,
    label: '分支判断',
    type: 'switch',
    group: 'judgment',
    nodeType: 'SwitchNode',
    iconClass: 'switchIco',
  },
  {
    id: 300,
    label: '加',
    type: 'add',
    group: 'compute',
    nodeType: 'OperatorNode',
    iconClass: 'operatorIco',
  },
  {
    id: 301,
    label: '减',
    type: 'subtract',
    group: 'compute',
    nodeType: 'OperatorNode',
    iconClass: 'operatorIco',
  },
  {
    id: 302,
    label: '乘',
    type: 'multiply',
    group: 'compute',
    nodeType: 'OperatorNode',
    iconClass: 'operatorIco',
  },
  {
    id: 303,
    label: '除',
    type: 'divide',
    group: 'compute',
    nodeType: 'OperatorNode',
    iconClass: 'operatorIco',
  },
  {
    id: 304,
    label: '取余',
    type: 'modular',
    group: 'compute',
    nodeType: 'OperatorNode',
    iconClass: 'operatorIco',
  },
  {
    id: 400,
    label: '日期输出',
    type: 'dateOutput',
    group: 'timer',
    nodeType: 'DateOutputNode',
    iconClass: 'dateIco',
  },
  {
    id: 401,
    label: '日期计算',
    type: 'dateOperator',
    group: 'timer',
    nodeType: 'DateOperatorNode',
    iconClass: 'dateIco',
  },
  {
    id: 500,
    label: '函数',
    type: 'func',
    group: 'function',
    nodeType: 'FuncNode',
    iconClass: 'funcIco',
  },
  {
    id: 501,
    label: '格式转换',
    type: 'format',
    group: 'function',
    nodeType: 'FuncNode',
    iconClass: 'funcIco',
  },
  {
    id: 601,
    label: '输出',
    type: 'export',
    group: 'option',
    nodeType: 'ExportNode',
    iconClass: 'exportIco',
  },
  {
    id: 700,
    label: '执行',
    type: 'control',
    group: 'execute',
    nodeType: 'ControlNode',
    iconClass: 'controlIco',
  },
];

export interface DraggableItemData {
  group: string;
  icon: string;
  node: string;
  type: string;
}
