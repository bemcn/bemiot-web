export function createTemplate(node: any): string {
  const nodeType = node.properties.nodeType;
  switch (nodeType) {
    case 'attribute':
      return createTemplate(node);
    case 'service':
      return serviceTemplate(node);
    case 'event':
      return eventTemplate(node);
    case 'metadata':
      return metadataTemplate(node);
    case 'variable':
      return variableTemplate(node);
    case 'random':
      return randomTemplate(node);
    default:
      return '';
  }
}

export function attributeTemplate(node: any): string {
  return `
      <div>
        <div class="node-head">
          <div class="ico">
            <div class="icon ${node.properties.icon || ''}"></div>
          </div>
          <div class="label">${node.properties.label || ''}</div>
          <div class="tag object-tag">属性</div>
        </div>
        <div class="node-body object-body">
          <div class="line">
            <div class="label">物模型ID</div>
            <div class="value">${node.properties.id || ''}</div>
          </div>
          <div class="line">
            <div class="label">设备名称</div>
            <div class="value">${node.properties.level || ''}</div>
          </div>
          <div class="line">
            <div class="label">空间位置</div>
            <div class="value">${node.properties.location || ''}</div>
          </div>
        </div>
        <div class="node-footer object-footer">
          <div class="label">当前值</div>
          <div class="value">${node.properties.value || ''}${node.properties.unit || ''}</div>
        </div>
      </div>
    `;
}

export function serviceTemplate(node: any): string {
  return `
      <div>
        <div class="node-head">
          <div class="ico">
            <div class="icon ${node.properties.icon || ''}"></div>
          </div>
          <div class="label">${node.properties.label || ''}</div>
          <div class="tag service-tag">功能</div>
        </div>
        <div class="node-body service-body">
          <div class="line">
            <div class="label">物模型ID</div>
            <div class="value">${node.properties.id || ''}</div>
          </div>
          <div class="line">
            <div class="label">设备名称</div>
            <div class="value">${node.properties.level || ''}</div>
          </div>
          <div class="line">
            <div class="label">空间位置</div>
            <div class="value">${node.properties.location || ''}</div>
          </div>
        </div>
        <div class="node-footer service-footer">
          <div class="label">当前值</div>
          <div class="value">${node.properties.value || ''}${node.properties.unit || ''}</div>
        </div>
      </div>
    `;
}

export function eventTemplate(node: any): string {
  return `
      <div>
        <div class="node-head">
          <div class="ico">
            <div class="icon ${node.properties.icon || ''}"></div>
          </div>
          <div class="label">${node.properties.label || ''}</div>
          <div class="tag event-tag">事件</div>
        </div>
        <div class="node-body event-body">
          <div class="line">
            <div class="label">物模型ID</div>
            <div class="value">${node.properties.id || ''}</div>
          </div>
          <div class="line">
            <div class="label">设备名称</div>
            <div class="value">${node.properties.level || ''}</div>
          </div>
          <div class="line">
            <div class="label">空间位置</div>
            <div class="value">${node.properties.location || ''}</div>
          </div>
        </div>
        <div class="node-footer event-footer">
          <div class="label">当前值</div>
          <div class="value">${node.properties.value || ''}${node.properties.unit || ''}</div>
        </div>
      </div>
    `;
}

export function metadataTemplate(node: any): string {
  return `
      <div>
        <div class="node-head">
          <div class="ico">
            <div class="icon ${node.properties.icon || ''}"></div>
          </div>
          <div class="label">${node.properties.label || ''}</div>
          <div class="tag metadata-tag">事件</div>
        </div>
        <div class="node-body metadata-body">
          <div class="line">
            <div class="label">物模型ID</div>
            <div class="value">${node.properties.id || ''}</div>
          </div>
          <div class="line">
            <div class="label">设备名称</div>
            <div class="value">${node.properties.level || ''}</div>
          </div>
          <div class="line">
            <div class="label">空间位置</div>
            <div class="value">${node.properties.location || ''}</div>
          </div>
        </div>
        <div class="node-footer metadata-footer">
          <div class="label">当前值</div>
          <div class="value">${node.properties.value || ''}${node.properties.unit || ''}</div>
        </div>
      </div>
    `;
}

export function variableTemplate(node: any): string {
  return `
      <div>
        <div class="node-head">
          <div class="ico">
            <div class="icon ${node.properties.icon || ''}"></div>
          </div>
          <div class="label">${node.properties.id || ''}</div>
          <div class="tag variable-tag">变量</div>
        </div>
        <div class="node-footer variable-footer">
          <div class="label">当前值</div>
          <div class="value">${node.properties.value || ''}</div>
        </div>
      </div>
    `;
}

export function randomTemplate(node: any): string {
  return `
      <div>
        <div class="node-head">
          <div class="ico">
            <div class="icon ${node.properties.icon || ''}"></div>
          </div>
          <div class="label">${node.properties.id || ''}</div>
          <div class="tag random-tag">随机数</div>
        </div>
        <div class="node-body random-body">
          <div class="line">
            <div class="label">范围</div>
            <div class="value">
            (${node.properties.numType || 'int'}) 
            ${node.properties.minNum || 0}-${node.properties.maxNum || 10}
            </div>
          </div>
          <div class="line">
            <div class="label">小数位</div>
            <div class="value">${
              ((node.properties.bits as number) ?? 0) > 0 ? node.properties.bits + '位' : '无'
            }</div>
          </div>
          <div class="line">
            <div class="label">刷新间隔</div>
            <div class="value">${node.properties.refresh || 10}秒</div>
          </div>
        </div>
        <div class="node-footer random-footer">
          <div class="label">当前值</div>
          <div class="value">${node.properties.value || '0'}</div>
        </div>
      </div>
    `;
}
