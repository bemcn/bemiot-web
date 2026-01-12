import { HtmlNode, HtmlNodeModel } from '@logicflow/core';

class JudgmentView extends HtmlNode {
  private isResizing = false;
  private resizeDirection: string | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

  public minWidth = 250;
  public minHeight = 126;

  setHtml(rootEl: SVGForeignObjectElement) {
    const { properties } = this.props.model;

    // 根据属性中的高度设置节点高度
    const width = this.props.model.width || this.minWidth;
    const height = properties.height || this.minHeight;

    const el = document.createElement('div');
    el.className = 'node-wrapper judgment-wrapper';
    el.style.height = height + 'px'; // 设置DOM元素高度
    el.style.width = width + 'px';

    let conditionBy = 'none';
    if (
      properties.condition &&
      Array.isArray(properties.condition) &&
      properties.condition.length > 0
    ) {
      let index = 0;
      conditionBy = '';
      for (const item of properties.condition as any[]) {
        let link = '';
        if (item.link === 'and') {
          link = '和';
        } else if (item.link === 'or') {
          link = '或';
        }
        if (index === 0) {
          conditionBy += `
              <span class="spanItem" style="color: #2216a0">${item.nodeId || ''}</span>
              <span class="spanItem" style="color: #333333">${item.operator || ''}</span>
          `;
        } else {
          conditionBy += `
              <span class="spanItem" style="color: #63603b">${link}</span>
              <span class="spanItem" style="color: #2216a0">${item.nodeId || ''}</span>
              <span class="spanItem" style="color: #333333">${item.operator || ''}</span>
          `;
        }
        if (item.valueType === 'bool' || item.valueType === 'int' || item.valueType === 'number') {
          conditionBy += `
              <span class="spanItem" style="color: #2a7055">${item.value || ''}</span>
          `;
        } else {
          conditionBy += `
              <span class="spanItem" style="color: #333333">"</span>
              <span class="spanItem" style="color: #6d2528">${item.value || ''}</span>
              <span class="spanItem" style="color: #333333">"</span>
          `;
        }
        index++;
      }
    }

    const html = `
      <div class="nodeBox">
        <div class="node-head judgment-head">
          <div class="tag judgment-tag">${properties.label}</div>
          <div class="label">${properties.id || ''}</div>
          <div class="editBox">
            <button class="btn-edit" title="编辑属性" onclick="handleNodeEdit('${
              this.props.model.id
            }')" />
            <button class="btn-close" title="删除" onclick="handleNodeClose('${
              this.props.model.id
            }')" />
          </div>
        </div>
        <div class="node-body" style="padding-bottom: 0px;">
          <div class="node-content" style="height: 100%;">
            <div class="ifLine">
              <div class="label">
                <div class="term">IF</div>
              </div>
              <div class="value">${conditionBy}</div>
            </div>
            <div class="jgLine" style="">
              <div class="label">
                <div class="term">ELSE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    el.innerHTML = html;
    rootEl.innerHTML = '';
    rootEl.appendChild(el);

    // 添加鼠标事件监听器到rootEl而不是el
    this.addMouseEvents(rootEl as unknown as HTMLElement);
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

    const rect = this.rootEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edgeThreshold = 4; // 边缘检测阈值，设置为4像素

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
    } else if (onLeftEdge) {
      this.rootEl.style.cursor = 'ew-resize';
      this.resizeDirection = 'left-ew'; // 左侧边缘
    } else if (onRightEdge) {
      this.rootEl.style.cursor = 'ew-resize';
      this.resizeDirection = 'right-ew'; // 右侧边缘
    } else if (onTopEdge) {
      this.rootEl.style.cursor = 'ns-resize';
      this.resizeDirection = 'top-ns'; // 顶部边缘
    } else if (onBottomEdge) {
      this.rootEl.style.cursor = 'ns-resize';
      this.resizeDirection = 'bottom-ns'; // 底部边缘
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
    const maxWidth: number = (model.properties.minWidth as number) || this.minWidth;
    const maxheight: number = (model.properties.minHeight as number) || this.minHeight;

    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    switch (this.resizeDirection) {
      case 'left-ew': // 左侧边缘，反转宽度变化逻辑
        newWidth = this.startWidth - deltaX;
        break;
      case 'right-ew': // 右侧边缘，保持原有逻辑
        newWidth = this.startWidth + deltaX;
        break;
      case 'top-ns': // 顶部边缘，反转高度变化逻辑
        newHeight = this.startHeight - deltaY;
        break;
      case 'bottom-ns': // 底部边缘，保持原有逻辑
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
    newWidth = Math.max(maxWidth, newWidth);
    newHeight = Math.max(maxheight, newHeight);

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
    const widthAnc = newWidth / 2;
    const xHeight = 0 - newHeight / 2;
    const heightAnc1 = xHeight + 36 + 6 + 18;
    const heightFootAnc = heightAnc1 + 45;
    const anchorsOffset = [
      [-widthAnc, heightAnc1], // 左侧输入
      [widthAnc, heightAnc1], // 右侧IF第1项
      [widthAnc, heightFootAnc], // 右侧Else
    ];

    // 同时更新节点模型的宽度和高度，确保视图和模型一致
    if (typeof model.setWidth === 'function') {
      model.setWidth(newWidth);
    }

    if (typeof model.setHeight === 'function') {
      model.setHeight(newHeight);
    }

    if (typeof model.setAnchorsOffset === 'function') {
      model.setAnchorsOffset(anchorsOffset);
    }

    // 手动更新节点的width和height属性，确保LogicFlow内部模型也更新
    model.width = newWidth;
    model.height = newHeight;
    model.anchorsOffset = anchorsOffset;

    // 直接更新DOM元素宽高
    const wrapper = this.rootEl.querySelector('.variable-wrapper') || 
                   this.rootEl.querySelector('.node-wrapper');
    if (wrapper) {
      wrapper.style.width = newWidth + 'px';
      wrapper.style.height = newHeight + 'px';
    }
    
    // 强制刷新画布以确保视图更新
    const logicFlow = (window as any).logicFlowUtil?.logicFlow;
    if (logicFlow) {
      try {
        logicFlow.refresh();
      } catch (e) {
        const graphData = logicFlow.getGraphData();
        if (graphData) {
          logicFlow.render(graphData);
        }
      }
    }
  }

  // 文档鼠标抬起事件 - 结束调整大小
  onDocMouseUp = () => {
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

class JudgmentModel extends HtmlNodeModel {
  setAttributes() {
    this.width = 250;
    this.height = 126;
    this.text.editable = false;
    // 设置锚点 - 左右两边都有锚点
    const widthAnc = this.width / 2;
    const xHeight = 0 - this.height / 2;
    const heightAnc1 = xHeight + 36 + 6 + 18;
    const heightRightFootAnc = heightAnc1 + 45;
    this.anchorsOffset = [
      [-widthAnc, heightAnc1], // 左侧输入
      [widthAnc, heightAnc1], // 右侧IF
      [widthAnc, heightRightFootAnc], // 右侧Else
    ];
  }

  getAnchorStyle(anchorInfo: any) {
    const style = super.getAnchorStyle(anchorInfo);
    style.stroke = '#666666';
    style.r = 5;
    // 确保hover样式存在再设置
    if (style.hover) {
      style.hover.r = 5;
      style.hover.fill = 'rgb(24, 125, 255)';
      style.hover.stroke = 'rgb(24, 125, 255)';
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

  // 更新节点宽度的方法
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

  // 获取锚点偏移值
  getAnchorsOffset(): any[] {
    const anchorsOffset = this.anchorsOffset || [];
    return anchorsOffset;
  }
}

export default {
  type: 'JudgmentNode',
  view: JudgmentView,
  model: JudgmentModel,
};
