import { h } from '@logicflow/core';
import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core';

class TextEdge extends PolylineEdge {
  getEdge() {
    const { model } = this.props;
    // 获取基础边
    const edge = super.getEdge();

    // 如果有文本，则绘制文本
    if (model.properties.text) {
      // 获取文本相关信息
      const textValue = model.properties.text;
      const textX = model.text.x;
      const textY = model.text.y;

      // 估算文本的宽度和高度，用于背景矩形
      const textWidth = textValue.length * 8; // 每个字符约8px宽
      const textHeight = 16; // 文本高度
      const padding = 4; // 内边距

      // 创建文本背景矩形
      const textBackground = h('rect', {
        x: textX - textWidth / 2 - padding,
        y: textY - textHeight / 2 - padding,
        width: textWidth + padding * 2,
        height: textHeight + padding * 1,
        fill: '#333333', // 背景色
        stroke: '#ffffff', // 边框色
        strokeWidth: 0, // 边框宽度
        rx: 3, // 圆角
        ry: 3,
      });

      // 创建文本元素
      const text = h(
        'text',
        {
          x: textX,
          y: textY,
          fill: '#ffffff',
          fontSize: 12,
          textAnchor: 'middle',
          dominantBaseline: 'middle',
        },
        textValue
      );

      // 确保edge存在后再返回包含边、背景和文本的组合
      if (edge) {
        return h('g', {}, [edge, textBackground, text]);
      } else {
        // 如果edge不存在，返回背景和文本
        return h('g', {}, [null, textBackground, text]);
      }
    }

    // 即使没有文本也要返回边，这是关键修复
    return edge || null;
  }
}

class TextEdgeModel extends PolylineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    const { properties } = this;
    if (properties.isActived) {
      style.strokeDasharray = '4 4';
    }
    style.stroke = '#333333';
    return style;
  }
}

export default {
  type: 'TextEdge',
  view: TextEdge,
  model: TextEdgeModel,
};
