# SvgIcon

SVG 图标组件，支持 Iconify 图标和本地 SVG 图标。

## 基本用法

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "carbon:home"
  }
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `icon` | `string` | - | 图标名称，支持 Iconify 图标集 |
| `localIcon` | `string` | - | 本地 SVG 图标名称 |
| `size` | `number \| string` | `1em` | 图标大小 |
| `color` | `string` | `currentColor` | 图标颜色 |

## Iconify 图标

使用 Iconify 图标集，格式为 `集合名:图标名`：

```json
// Carbon 图标集
{ "com": "SvgIcon", "props": { "icon": "carbon:home" } }
{ "com": "SvgIcon", "props": { "icon": "carbon:user" } }
{ "com": "SvgIcon", "props": { "icon": "carbon:settings" } }

// Material Design Icons
{ "com": "SvgIcon", "props": { "icon": "mdi:home" } }
{ "com": "SvgIcon", "props": { "icon": "mdi:account" } }

// Ant Design Icons
{ "com": "SvgIcon", "props": { "icon": "ant-design:home-outlined" } }
```

## 本地图标

使用 `localIcon` 属性引用本地 SVG 图标：

```json
{
  "com": "SvgIcon",
  "props": {
    "localIcon": "logo"
  }
}
```

本地图标文件放在 `src/assets/svg-icon/` 目录下。

## 设置大小

```json
// 使用数字（像素）
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "size": 24 } }

// 使用字符串
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "size": "2em" } }
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "size": "32px" } }
```

## 设置颜色

```json
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "color": "#1890ff" } }
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "color": "red" } }
```

动态颜色：

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "carbon:checkmark",
    "color": "{{ status === 'success' ? 'green' : 'gray' }}"
  }
}
```

## 使用 CSS 类

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "carbon:home",
    "class": "text-primary text-2xl"
  }
}
```

## 在按钮中使用

```json
{
  "com": "NButton",
  "children": [
    { "com": "SvgIcon", "props": { "icon": "carbon:add", "style": { "marginRight": "4px" } } },
    "新增"
  ]
}
```

## 在输入框中使用

```json
{
  "com": "NInput",
  "model": "searchText",
  "slots": {
    "prefix": [
      { "com": "SvgIcon", "props": { "icon": "carbon:search" } }
    ]
  }
}
```

## 常用图标

### 操作类

```json
{ "icon": "carbon:add" }           // 添加
{ "icon": "carbon:edit" }          // 编辑
{ "icon": "carbon:trash-can" }     // 删除
{ "icon": "carbon:save" }          // 保存
{ "icon": "carbon:close" }         // 关闭
{ "icon": "carbon:checkmark" }     // 确认
{ "icon": "carbon:search" }        // 搜索
{ "icon": "carbon:filter" }        // 筛选
{ "icon": "carbon:download" }      // 下载
{ "icon": "carbon:upload" }        // 上传
{ "icon": "carbon:refresh" }       // 刷新
```

### 导航类

```json
{ "icon": "carbon:home" }          // 首页
{ "icon": "carbon:menu" }          // 菜单
{ "icon": "carbon:settings" }      // 设置
{ "icon": "carbon:user" }          // 用户
{ "icon": "carbon:notification" }  // 通知
{ "icon": "carbon:help" }          // 帮助
```

### 状态类

```json
{ "icon": "carbon:checkmark-filled" }  // 成功
{ "icon": "carbon:close-filled" }      // 失败
{ "icon": "carbon:warning-filled" }    // 警告
{ "icon": "carbon:information-filled" } // 信息
```

### 方向类

```json
{ "icon": "carbon:arrow-left" }    // 左箭头
{ "icon": "carbon:arrow-right" }   // 右箭头
{ "icon": "carbon:arrow-up" }      // 上箭头
{ "icon": "carbon:arrow-down" }    // 下箭头
{ "icon": "carbon:chevron-left" }  // 左尖括号
{ "icon": "carbon:chevron-right" } // 右尖括号
```

## 图标搜索

可以在 [Iconify](https://icon-sets.iconify.design/) 网站搜索更多图标。
