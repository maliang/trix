# NaiveUI 组件

Trix Admin 预注册了所有常用的 NaiveUI 组件。

## 基础组件

### NButton

```json
{
  "com": "NButton",
  "props": {
    "type": "primary",
    "size": "medium",
    "disabled": false,
    "loading": false,
    "ghost": false,
    "dashed": false,
    "circle": false,
    "round": false
  },
  "children": "按钮"
}
```

### NButtonGroup

```json
{
  "com": "NButtonGroup",
  "children": [
    { "com": "NButton", "children": "按钮1" },
    { "com": "NButton", "children": "按钮2" }
  ]
}
```

### NIcon

```json
{
  "com": "NIcon",
  "props": { "size": 24, "color": "#333" },
  "children": [
    { "com": "SvgIcon", "props": { "icon": "carbon:home" } }
  ]
}
```

### NText

```json
{
  "com": "NText",
  "props": { "type": "success", "strong": true, "depth": 1 },
  "children": "文本内容"
}
```

### NTag

```json
{
  "com": "NTag",
  "props": { "type": "success", "closable": true, "round": true },
  "children": "标签"
}
```

## 布局组件

### NSpace

```json
{
  "com": "NSpace",
  "props": { "vertical": false, "size": "medium", "wrap": true },
  "children": []
}
```

### NFlex

```json
{
  "com": "NFlex",
  "props": { "justify": "space-between", "align": "center", "vertical": false },
  "children": []
}
```

### NGrid

```json
{
  "com": "NGrid",
  "props": { "cols": 3, "xGap": 16, "yGap": 16, "responsive": "screen" },
  "children": [
    { "com": "NGridItem", "children": "内容1" },
    { "com": "NGridItem", "children": "内容2" }
  ]
}
```

### NCard

```json
{
  "com": "NCard",
  "props": { "title": "卡片标题", "bordered": true, "hoverable": false },
  "children": "卡片内容"
}
```

### NDivider

```json
{
  "com": "NDivider",
  "props": { "vertical": false, "dashed": false },
  "children": "分割线文字"
}
```

## 表单组件

### NForm

```json
{
  "com": "NForm",
  "props": {
    "model": "{{ form }}",
    "rules": "{{ rules }}",
    "labelPlacement": "left",
    "labelWidth": 80
  },
  "children": []
}
```

### NFormItem

```json
{
  "com": "NFormItem",
  "props": { "label": "用户名", "path": "username", "required": true },
  "children": [
    { "com": "NInput", "model": "form.username" }
  ]
}
```

### NInput

```json
{
  "com": "NInput",
  "model": "form.username",
  "props": {
    "placeholder": "请输入",
    "clearable": true,
    "type": "text",
    "maxlength": 100,
    "showCount": true
  }
}
```

### NInputNumber

```json
{
  "com": "NInputNumber",
  "model": "form.age",
  "props": { "min": 0, "max": 100, "step": 1 }
}
```

### NSelect

```json
{
  "com": "NSelect",
  "model": "form.status",
  "props": {
    "options": [
      { "label": "启用", "value": 1 },
      { "label": "禁用", "value": 0 }
    ],
    "placeholder": "请选择",
    "clearable": true,
    "filterable": true
  }
}
```

### NDatePicker

```json
{
  "com": "NDatePicker",
  "model": "form.date",
  "props": { "type": "date", "clearable": true }
}
```

### NSwitch

```json
{
  "com": "NSwitch",
  "model:value": "form.enabled"
}
```

### NCheckbox

```json
{
  "com": "NCheckbox",
  "model:checked": "form.agree",
  "children": "我已阅读并同意"
}
```

### NRadioGroup

```json
{
  "com": "NRadioGroup",
  "model": "form.gender",
  "children": [
    { "com": "NRadio", "props": { "value": "male" }, "children": "男" },
    { "com": "NRadio", "props": { "value": "female" }, "children": "女" }
  ]
}
```

## 数据展示

### NDataTable

```json
{
  "com": "NDataTable",
  "props": {
    "data": "{{ list }}",
    "columns": [
      { "title": "ID", "key": "id" },
      { "title": "名称", "key": "name" },
      { "title": "状态", "key": "status" }
    ],
    "loading": "{{ loading }}",
    "pagination": "{{ pagination }}",
    "rowKey": "{{ row => row.id }}"
  }
}
```

### NDescriptions

```json
{
  "com": "NDescriptions",
  "props": { "column": 2, "labelPlacement": "left" },
  "children": [
    { "com": "NDescriptionsItem", "props": { "label": "姓名" }, "children": "{{ user.name }}" },
    { "com": "NDescriptionsItem", "props": { "label": "邮箱" }, "children": "{{ user.email }}" }
  ]
}
```

### NStatistic

```json
{
  "com": "NStatistic",
  "props": { "label": "总用户数", "value": "{{ stats.total }}" }
}
```

### NTimeline

```json
{
  "com": "NTimeline",
  "children": [
    {
      "com": "NTimelineItem",
      "props": { "type": "success", "title": "步骤1", "time": "2024-01-01" },
      "children": "完成"
    }
  ]
}
```

### NTree

```json
{
  "com": "NTree",
  "props": {
    "data": "{{ treeData }}",
    "checkable": true,
    "selectable": true,
    "defaultExpandAll": true
  }
}
```

## 反馈组件

### NModal

```json
{
  "com": "NModal",
  "model:show": "modalVisible",
  "props": { "preset": "card", "title": "弹窗标题", "style": { "width": "600px" } },
  "children": "弹窗内容"
}
```

### NDrawer

```json
{
  "com": "NDrawer",
  "model:show": "drawerVisible",
  "props": { "width": 500 },
  "children": [
    { "com": "NDrawerContent", "props": { "title": "抽屉标题" }, "children": "内容" }
  ]
}
```

### NPopconfirm

```json
{
  "com": "NPopconfirm",
  "props": {
    "onPositiveClick": { "call": "handleDelete" }
  },
  "slots": {
    "trigger": [{ "com": "NButton", "children": "删除" }]
  },
  "children": "确定删除吗？"
}
```

### NTooltip

```json
{
  "com": "NTooltip",
  "slots": {
    "trigger": [{ "com": "NButton", "children": "悬停" }]
  },
  "children": "提示内容"
}
```

### NSpin

```json
{
  "com": "NSpin",
  "props": { "show": "{{ loading }}", "size": "large" },
  "children": "加载中的内容"
}
```

### NEmpty

```json
{
  "com": "NEmpty",
  "props": { "description": "暂无数据" }
}
```

### NResult

```json
{
  "com": "NResult",
  "props": { "status": "success", "title": "操作成功", "description": "描述信息" }
}
```

## 导航组件

### NMenu

```json
{
  "com": "NMenu",
  "props": {
    "options": "{{ menuOptions }}",
    "mode": "vertical",
    "collapsed": false
  }
}
```

### NTabs

```json
{
  "com": "NTabs",
  "model": "activeTab",
  "props": { "type": "line" },
  "children": [
    { "com": "NTabPane", "props": { "name": "tab1", "tab": "标签1" }, "children": "内容1" },
    { "com": "NTabPane", "props": { "name": "tab2", "tab": "标签2" }, "children": "内容2" }
  ]
}
```

### NBreadcrumb

```json
{
  "com": "NBreadcrumb",
  "children": [
    { "com": "NBreadcrumbItem", "children": "首页" },
    { "com": "NBreadcrumbItem", "children": "列表" },
    { "com": "NBreadcrumbItem", "children": "详情" }
  ]
}
```

### NDropdown

```json
{
  "com": "NDropdown",
  "props": {
    "options": [
      { "label": "选项1", "key": "1" },
      { "label": "选项2", "key": "2" }
    ],
    "onSelect": { "call": "handleSelect", "args": ["{{ $args[0] }}"] }
  },
  "slots": {
    "default": [{ "com": "NButton", "children": "下拉菜单" }]
  }
}
```

### NPagination

```json
{
  "com": "NPagination",
  "props": {
    "page": "{{ pagination.page }}",
    "pageSize": "{{ pagination.pageSize }}",
    "itemCount": "{{ pagination.total }}",
    "showSizePicker": true,
    "pageSizes": [10, 20, 50]
  },
  "events": {
    "update:page": { "call": "handlePageChange", "args": ["{{ $args[0] }}"] },
    "update:page-size": { "call": "handlePageSizeChange", "args": ["{{ $args[0] }}"] }
  }
}
```

## 更多组件

完整组件列表请参考 [NaiveUI 官方文档](https://www.naiveui.com/)。
