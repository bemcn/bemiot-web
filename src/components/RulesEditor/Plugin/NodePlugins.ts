import { HtmlNode, HtmlNodeModel } from '@logicflow/core';
import { createTemplate } from './Template';

class NodePluginsView extends HtmlNode {
  private isResizing = false;
  private resizeDirection: string | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

  public minWidth = 200;
  public minHeight = 74;
  public nodeType = 'variable';
  public showLeftAnchors = true;
  public showRightAnchors = true;

  setHtml(rootEl: { innerHTML: string; appendChild: (arg0: HTMLDivElement) => void }) {
    const { properties } = this.props.model;

    // 根据属性中的高度设置节点高度
    const width = this.props.model.width || this.minWidth;
    const height = properties.height || this.minHeight;
    const elClassName = 'node-wrapper ' + this.nodeType + '-wrapper';

    const el = document.createElement('div');
    el.className = elClassName;
    el.style.height = height + 'px'; // 设置DOM元素高度
    el.style.width = width + 'px';

    el.innerHTML = createTemplate(this.nodeType);
    rootEl.innerHTML = '';
    rootEl.appendChild(el);

    // 添加鼠标事件监听器
    this.addMouseEvents(el);
  }

  // 添加鼠标事件监听
  addMouseEvents(el: HTMLElement) {
    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('mousemove', this.onMouseMove);
    el.addEventListener('mouseleave', this.onMouseLeave);
    document.addEventListener('mousemove', this.onDocMouseMove);
    document.addEventListener('mouseup', this.onDocMouseUp);
  }

  // 移除鼠标事件监听
  removeMouseEvents(el: HTMLElement) {
    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('mousemove', this.onMouseMove);
    el.removeEventListener('mouseleave', this.onMouseLeave);
    document.removeEventListener('mousemove', this.onDocMouseMove);
    document.removeEventListener('mouseup', this.onDocMouseUp);
  }

  // 鼠标按下事件 - 开始调整大小
  onMouseDown = (e: MouseEvent) => {
    if (this.resizeDirection) {
      this.isResizing = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      // @ts-ignore
      this.startWidth = this.props.model.width;
      // @ts-ignore
      this.startHeight = this.props.model.height;
      e.stopPropagation();
    }
  };

  // 鼠标在节点上移动事件 - 检测是否在边缘
  onMouseMove = (e: MouseEvent) => {
    if (this.isResizing) return;

    // @ts-ignore
    const width = this.props.model.width;
    // @ts-ignore
    const height = this.props.model.height;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edgeThreshold = 8; // 边缘检测阈值

    const onLeftEdge = x < edgeThreshold;
    const onRightEdge = x > width - edgeThreshold;
    const onTopEdge = y < edgeThreshold;
    const onBottomEdge = y > height - edgeThreshold;

    // 设置光标样式
    if ((onLeftEdge && onTopEdge) || (onRightEdge && onBottomEdge)) {
      this.rootEl.style.cursor = 'nwse-resize';
      this.resizeDirection = 'nwse';
    } else if ((onRightEdge && onTopEdge) || (onLeftEdge && onBottomEdge)) {
      this.rootEl.style.cursor = 'nesw-resize';
      this.resizeDirection = 'nesw';
    } else if (onLeftEdge || onRightEdge) {
      this.rootEl.style.cursor = 'ew-resize';
      this.resizeDirection = 'ew';
    } else if (onTopEdge || onBottomEdge) {
      this.rootEl.style.cursor = 'ns-resize';
      this.resizeDirection = 'ns';
    } else {
      this.rootEl.style.cursor = 'default';
      this.resizeDirection = null;
    }
  };

  // 鼠标离开节点事件
  onMouseLeave = () => {
    if (!this.isResizing) {
      this.rootEl.style.cursor = 'default';
      this.resizeDirection = null;
    }
  };

  // 文档鼠标移动事件 - 调整大小
  onDocMouseMove = (e: MouseEvent) => {
    if (!this.isResizing) return;

    // @ts-ignore
    const model = this.props.model;

    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    switch (this.resizeDirection) {
      case 'ew':
        newWidth = this.startWidth + deltaX;
        break;
      case 'ns':
        newHeight = this.startHeight + deltaY;
        break;
      case 'nwse':
        newWidth = this.startWidth + deltaX;
        newHeight = this.startHeight + deltaY;
        break;
      case 'nesw':
        newWidth = this.startWidth - deltaX;
        newHeight = this.startHeight + deltaY;
        break;
    }

    // 设置最小宽高
    newWidth = Math.max(this.minWidth, newWidth);
    newHeight = Math.max(this.minHeight, newHeight);

    // 更新节点尺寸
    this.updateNodeDimensions(model, newWidth, newHeight);
  };

  // 更新节点尺寸的统一方法（参考 RulesEditor.vue 中的工作方式）
  private updateNodeDimensions(model: any, newWidth: number, newHeight: number) {
    // 直接更新节点属性并触发重绘
    const currentProperties = model.getProperties();
    model.setProperties({
      ...currentProperties,
      height: newHeight,
      width: newWidth,
    });

    // 锚点的更新坐标
    const anchorsLeftX = 0 - newWidth / 2;
    const anchorsRightX = newWidth / 2;
    let anchorsOffset: any = [];
    if (this.showLeftAnchors && this.showRightAnchors) {
      anchorsOffset = [
        [anchorsLeftX, 0], // 左侧中部
        [anchorsRightX, 0], // 右侧中部
      ];
    } else {
      if (this.showLeftAnchors) {
        anchorsOffset = [
          [anchorsLeftX, 0], // 左侧中部
        ];
      } else if (this.showRightAnchors) {
        anchorsOffset = [
          [anchorsRightX, 0], // 右侧中部
        ];
      }
    }

    // 同时更新节点模型的宽度和高度，确保视图和模型一致
    if (typeof model.setWidth === 'function') {
      model.setWidth(newWidth);
    }

    if (typeof model.setHeight === 'function') {
      model.setHeight(newHeight);
    }

    if (typeof model.setAnchorsOffset === 'function') {
      if (anchorsOffset.length > 0) {
        model.setAnchorsOffset(anchorsOffset);
      }
    }

    // 手动更新节点的width和height属性，确保LogicFlow内部模型也更新
    model.width = newWidth;
    model.height = newHeight;
    if (anchorsOffset.length > 0) {
      model.anchorsOffset = anchorsOffset;
    }

    // 直接更新DOM元素宽高
    const wrapper = this.rootEl.querySelector('.variable-wrapper');
    if (wrapper) {
      wrapper.style.width = newWidth + 'px';
      wrapper.style.height = newHeight + 'px';
    }
  }

  // 文档鼠标抬起事件 - 结束调整大小
  onDocMouseUp = () => {
    if (this.isResizing) {
      console.log('结束调整大小');
    }
    this.isResizing = false;
    this.resizeDirection = null;
    this.rootEl.style.cursor = 'default';
  };

  // 当节点属性发生变化时更新HTML
  componentDidUpdate() {
    // 总是更新HTML，不管virtual属性
    this.setHtml(this.rootEl);
  }

  // 组件销毁时移除事件监听
  componentWillUnmount() {
    this.removeMouseEvents(this.rootEl);
  }
}

class NodePluginsModel extends HtmlNodeModel {
  public minWidth = 200;
  public minHeight = 74;
  public borderColor = '';
  public showLeftAnchors = true;
  public showRightAnchors = true;

  setAttributes() {
    this.width = this.minWidth;
    this.height = this.minHeight;
    this.text.editable = false;

    const anchorsLeftX = 0 - this.width / 2;
    const anchorsRightX = this.width / 2;
    // 设置锚点 - 左右两边都有锚点
    if (this.showLeftAnchors && this.showRightAnchors) {
      this.anchorsOffset = [
        [anchorsLeftX, 0], // 左侧中部
        [anchorsRightX, 0], // 右侧中部
      ];
    } else {
      if (this.showLeftAnchors) {
        this.anchorsOffset = [
          [anchorsLeftX, 0], // 左侧中部
        ];
      } else if (this.showRightAnchors) {
        this.anchorsOffset = [
          [anchorsRightX, 0], // 右侧中部
        ];
      }
    }
  }

  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle(anchorInfo);
    style.stroke = '#666666';
    style.r = 5;
    // 确保hover样式存在再设置
    if (style.hover) {
      style.hover.r = 5;
      style.hover.fill = this.borderColor;
      style.hover.stroke = this.borderColor;
    }
    return style;
  }

  // 获取节点样式
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#48a0f7';
    return style;
  }

  // 允许作为目标节点（允许连入）
  isAllowConnectedAsTarget(_source, _sourceAnchor, targetAnchor) {
    // 右侧锚点（x > 0）不允许外部连接线连接到它
    const anchorId = targetAnchor.id;
    const idDataArray = anchorId.split('_');
    const index = parseInt(idDataArray[1]);
    if (index === 1) {
      return {
        isAllPass: false,
        msg: '禁止左侧连出',
      };
    }
    return {
      isAllPass: true,
      msg: '',
    };
  }

  // 允许作为源节点（允许连出）
  isAllowConnectedAsSource(_target, targetAnchor, _sourceAnchor) {
    const anchorId = targetAnchor.id;
    const idDataArray = anchorId.split('_');
    const index = parseInt(idDataArray[1]);
    if (index === 0) {
      return {
        isAllPass: false,
        msg: '禁止左侧连出',
      };
    }
    return {
      isAllPass: true,
      msg: '',
    };
  }

  // 更新节点高度的方法
  setHeight(height: number): void {
    this.height = height;
    this.setProperty('height', height);
  }

  // 更新节点宽度的方法
  setWidth(width: number): void {
    this.width = width;
    this.setProperty('width', width);
  }

  // 更新锚点坐标
  setAnchorsOffset(anchorsOffset: any[]): void {
    this.anchorsOffset = anchorsOffset;
    this.setProperty('anchorsOffset', anchorsOffset);
  }

  // 获取节点高度
  getHeight(): number {
    const properties: any = this.getProperties();
    const height = properties.height || this.height;
    return height;
  }

  // 获取节点宽度
  getWidth(): number {
    const properties: any = this.getProperties();
    const width = properties.width || this.width;
    return width;
  }

  // 获取锚点坐标
  getAnchorsOffset(): any[] {
    const anchorsOffset = this.anchorsOffset || [];
    return anchorsOffset;
  }
}

export default {
  type: 'NodePlugins',
  view: NodePluginsView,
  model: NodePluginsModel,
};
