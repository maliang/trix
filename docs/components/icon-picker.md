# IconPicker

图标选择器组件，支持搜索和选择 Iconify 图标。

## 基本用法

```json
{
  "com": "IconPicker",
  "model": "form.icon"
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` / `v-model` | `string` | - | 选中的图标名称 |
| `placeholder` | `string` | `'请选择图标'` | 占位文本 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `clearable` | `boolean` | `true` | 是否可清除 |

## 示例

### 基本使用

```json
{
  "data": {
    "selectedIcon": ""
  },
  "com": "NFormItem",
  "props": { "label": "图标" },
  "children": [
    {
      "com": "IconPicker",
      "model": "selectedIcon"
    }
  ]
}
```

### 显示选中图标

```json
{
  "com": "NFlex",
  "props": { "align": "center" },
  "children": [
    { "com": "IconPicker", "model": "form.icon" },
    {
      "com": "SvgIcon",
      "if": "form.icon",
      "props": { "icon": "{{ form.icon }}", "size": 24, "style": { "marginLeft": "8px" } }
    }
  ]
}
```

### 在表单中使用

```json
{
  "com": "NForm",
  "props": { "model": "{{ form }}" },
  "children": [
    {
      "com": "NFormItem",
      "props": { "label": "菜单名称" },
      "children": [{ "com": "NInput", "model": "form.name" }]
    },
    {
      "com": "NFormItem",
      "props": { "label": "菜单图标" },
      "children": [{ "com": "IconPicker", "model": "form.icon" }]
    }
  ]
}
```

## 功能特性

- 支持搜索图标
- 支持多个图标集（Carbon、Material Design 等）
- 支持分页浏览
- 支持清除选择
- 支持键盘导航
