# FlowEditor

Flow editor component based on Vue Flow for visual workflow design.

## Basic Usage

```json
{
  "com": "FlowEditor",
  "model": "flowData"
}
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` / `v-model` | `object` | - | Flow data |
| `readonly` | `boolean` | `false` | Whether readonly |
| `height` | `string` | `'500px'` | Editor height |

## Data Structure

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

## Examples

### Basic Usage

```json
{
  "data": {
    "flowData": {
      "nodes": [
        { "id": "1", "type": "input", "position": { "x": 250, "y": 0 }, "data": { "label": "Start" } },
        { "id": "2", "type": "default", "position": { "x": 250, "y": 100 }, "data": { "label": "Process" } },
        { "id": "3", "type": "output", "position": { "x": 250, "y": 200 }, "data": { "label": "End" } }
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

### Readonly Mode

```json
{
  "com": "FlowEditor",
  "props": {
    "value": "{{ flowData }}",
    "readonly": true
  }
}
```

## Features

- Drag and drop nodes
- Connect nodes
- Zoom and pan
- Minimap
- Control panel
- Custom node types
