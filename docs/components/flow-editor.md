# FlowEditor

流程编辑器组件，基于 Vue Flow 实现，用于可视化流程设计。

## 基本用法

```json
{
  "com": "FlowEditor",
  "model": "flowData"
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` / `v-model` | `object` | - | 流程数据 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `height` | `string` | `'500px'` | 编辑器高度 |

## 数据结构

```typescript
interface FlowData {
  nodes: Node[]
  edges: Edge[]
}

interface Node {
  id: string
  type: string
  position: { x: number, y: number }
  data: { label: string, [key: string]: any }
}

interface Edge {
  id: string
  source: string
  target: string
  type?: string
}
```

## 示例

### 基本使用

```json
{
  "data": {
    "flowData": {
      "nodes": [
        { "id": "1", "type": "input", "position": { "x": 250, "y": 0 }, "data": { "label": "开始" } },
        { "id": "2", "type": "default", "position": { "x": 250, "y": 100 }, "data": { "label": "处理" } },
        { "id": "3", "type": "output", "position": { "x": 250, "y": 200 }, "data": { "label": "结束" } }
      ],
      "edges": [
        { "id": "e1-2", "source": "1", "target": "2" },
        { "id": "e2-3", "source": "2", "target": "3" }
      ]
    }
  },
  "com": "FlowEditor",
  "model": "flowData",
  "props": { "height": "600px" }
}
```

### 只读模式

```json
{
  "com": "FlowEditor",
  "props": {
    "value": "{{ flowData }}",
    "readonly": true
  }
}
```

### 在卡片中使用

```json
{
  "com": "NCard",
  "props": { "title": "流程设计" },
  "children": [
    {
      "com": "FlowEditor",
      "model": "flowData",
      "props": { "height": "500px" }
    }
  ]
}
```

## 功能特性

- 拖拽添加节点
- 连接节点
- 缩放和平移
- 小地图
- 控制面板
- 自定义节点类型
