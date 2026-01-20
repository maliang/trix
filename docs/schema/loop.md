# 循环渲染

使用 `for` 属性实现列表循环渲染。

## 基本语法

```json
{
  "data": {
    "list": [
      { "id": 1, "name": "苹果" },
      { "id": 2, "name": "香蕉" },
      { "id": 3, "name": "橙子" }
    ]
  },
  "com": "NTag",
  "for": "item in list",
  "key": "item.id",
  "children": "{{ item.name }}"
}
```

## for 语法

### item in list

```json
{ "for": "item in list" }
```

可用变量：
- `item`：当前项
- `index`：当前索引

### (item, index) in list

```json
{ "for": "(item, index) in list" }
```

### 自定义变量名

```json
{ "for": "user in users" }
{ "for": "option in options" }
{ "for": "(row, rowIndex) in tableData" }
```

## key 属性

为循环项指定唯一 key，提升渲染性能：

```json
{
  "for": "item in list",
  "key": "item.id"
}
```

使用索引作为 key（不推荐）：

```json
{
  "for": "item in list",
  "key": "index"
}
```

## 常用示例

### 标签列表

```json
{
  "com": "NSpace",
  "children": [
    {
      "com": "NTag",
      "for": "tag in tags",
      "key": "tag.id",
      "props": { "type": "{{ tag.type }}" },
      "children": "{{ tag.name }}"
    }
  ]
}
```

### 选项列表

```json
{
  "com": "NSelect",
  "model": "selectedValue",
  "props": {
    "options": "{{ options.map(o => ({ label: o.name, value: o.id })) }}"
  }
}
```

### 菜单列表

```json
{
  "com": "NMenu",
  "props": {
    "options": "{{ menus }}"
  }
}
```

### 卡片列表

```json
{
  "com": "NGrid",
  "props": { "cols": 3, "xGap": 16, "yGap": 16 },
  "children": [
    {
      "com": "NGridItem",
      "for": "item in list",
      "key": "item.id",
      "children": [
        {
          "com": "NCard",
          "props": { "title": "{{ item.title }}" },
          "children": "{{ item.description }}"
        }
      ]
    }
  ]
}
```

### 表格数据

```json
{
  "com": "NDataTable",
  "props": {
    "data": "{{ list }}",
    "columns": [
      { "title": "ID", "key": "id" },
      { "title": "名称", "key": "name" },
      { "title": "状态", "key": "status" }
    ]
  }
}
```

### 时间线

```json
{
  "com": "NTimeline",
  "children": [
    {
      "com": "NTimelineItem",
      "for": "item in activities",
      "key": "item.id",
      "props": {
        "type": "{{ item.type }}",
        "title": "{{ item.title }}",
        "time": "{{ item.time }}"
      },
      "children": "{{ item.content }}"
    }
  ]
}
```

### 描述列表

```json
{
  "com": "NDescriptions",
  "children": [
    {
      "com": "NDescriptionsItem",
      "for": "field in fields",
      "key": "field.key",
      "props": { "label": "{{ field.label }}" },
      "children": "{{ data[field.key] }}"
    }
  ]
}
```

## 嵌套循环

```json
{
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "水果",
        "items": [
          { "id": 1, "name": "苹果" },
          { "id": 2, "name": "香蕉" }
        ]
      },
      {
        "id": 2,
        "name": "蔬菜",
        "items": [
          { "id": 3, "name": "白菜" },
          { "id": 4, "name": "萝卜" }
        ]
      }
    ]
  },
  "com": "div",
  "children": [
    {
      "com": "NCard",
      "for": "category in categories",
      "key": "category.id",
      "props": { "title": "{{ category.name }}" },
      "children": [
        {
          "com": "NTag",
          "for": "item in category.items",
          "key": "item.id",
          "props": { "style": { "marginRight": "8px" } },
          "children": "{{ item.name }}"
        }
      ]
    }
  ]
}
```

## 与条件渲染配合

### 过滤显示

```json
{
  "com": "NTag",
  "for": "item in list",
  "if": "item.visible",
  "key": "item.id",
  "children": "{{ item.name }}"
}
```

### 条件样式

```json
{
  "com": "NTag",
  "for": "item in list",
  "key": "item.id",
  "props": {
    "type": "{{ item.status === 'active' ? 'success' : 'default' }}"
  },
  "children": "{{ item.name }}"
}
```

## 索引使用

### 显示序号

```json
{
  "com": "NList",
  "children": [
    {
      "com": "NListItem",
      "for": "(item, index) in list",
      "key": "item.id",
      "children": "{{ index + 1 }}. {{ item.name }}"
    }
  ]
}
```

### 奇偶行样式

```json
{
  "com": "div",
  "for": "(item, index) in list",
  "key": "item.id",
  "style": {
    "background": "{{ index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}"
  }
}
```

## 空列表处理

```json
{
  "com": "div",
  "children": [
    {
      "com": "NSpace",
      "if": "list.length > 0",
      "children": [
        {
          "com": "NTag",
          "for": "item in list",
          "key": "item.id",
          "children": "{{ item.name }}"
        }
      ]
    },
    {
      "com": "NEmpty",
      "if": "list.length === 0",
      "props": { "description": "暂无数据" }
    }
  ]
}
```

## 性能优化

### 1. 始终使用 key

```json
{
  "for": "item in list",
  "key": "item.id"  // ✅ 使用唯一标识
}
```

### 2. 避免在循环中使用复杂计算

```json
// ❌ 不推荐
{
  "for": "item in list.filter(i => i.status === 1).sort((a, b) => a.order - b.order)"
}

// ✅ 推荐：预先计算
{
  "data": {
    "filteredList": []
  },
  "methods": {
    "computeList": [
      { "set": "filteredList", "value": "{{ list.filter(i => i.status === 1).sort((a, b) => a.order - b.order) }}" }
    ]
  },
  "for": "item in filteredList"
}
```

### 3. 大列表使用虚拟滚动

对于大量数据，使用 NDataTable 或 NVirtualList：

```json
{
  "com": "NDataTable",
  "props": {
    "virtualScroll": true,
    "maxHeight": 400,
    "data": "{{ largeList }}"
  }
}
```
