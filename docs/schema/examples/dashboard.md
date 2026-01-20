# 仪表盘示例

完整的仪表盘页面 JSON Schema 示例。

## 效果

仪表盘包含：
- 统计卡片（用户数、订单数、收入等）
- 数据图表（折线图、柱状图）
- 最近活动时间线
- 快捷操作入口
- 系统信息展示

## Schema 结构

```json
{
  "data": {
    "stats": {
      "totalUsers": 0,
      "activeUsers": 0,
      "totalOrders": 0,
      "revenue": 0
    },
    "recentActivities": [],
    "loading": true
  },
  "methods": {
    "loadDashboardData": [
      { "set": "loading", "value": true },
      {
        "fetch": "/mock/api/dashboard-stats.json",
        "then": [{ "set": "stats", "value": "{{ $response }}" }]
      },
      {
        "fetch": "/mock/api/dashboard-activities.json",
        "then": [{ "set": "recentActivities", "value": "{{ $response.list || [] }}" }],
        "finally": [{ "set": "loading", "value": false }]
      }
    ]
  },
  "onMounted": { "call": "loadDashboardData" },
  "com": "NSpace",
  "props": { "vertical": true, "size": "large" },
  "children": [
    {
      "com": "NGrid",
      "props": { "cols": "1 s:2 m:4", "xGap": 16, "yGap": 16, "responsive": "screen" },
      "children": [
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "children": [{
              "com": "NStatistic",
              "props": { "label": "总用户数", "value": "{{ stats.totalUsers }}" },
              "slots": {
                "prefix": [{ "com": "SvgIcon", "props": { "icon": "carbon:user-multiple", "class": "text-primary text-2xl mr-2" } }]
              }
            }]
          }]
        },
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "children": [{
              "com": "NStatistic",
              "props": { "label": "活跃用户", "value": "{{ stats.activeUsers }}" },
              "slots": {
                "prefix": [{ "com": "SvgIcon", "props": { "icon": "carbon:activity", "class": "text-success text-2xl mr-2" } }]
              }
            }]
          }]
        },
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "children": [{
              "com": "NStatistic",
              "props": { "label": "总订单数", "value": "{{ stats.totalOrders }}" },
              "slots": {
                "prefix": [{ "com": "SvgIcon", "props": { "icon": "carbon:shopping-cart", "class": "text-warning text-2xl mr-2" } }]
              }
            }]
          }]
        },
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "children": [{
              "com": "NStatistic",
              "props": { "label": "总收入", "value": "{{ stats.revenue }}" },
              "slots": {
                "prefix": [{ "com": "NText", "props": { "class": "text-error text-2xl mr-2" }, "children": "¥" }]
              }
            }]
          }]
        }
      ]
    },
    {
      "com": "NGrid",
      "props": { "cols": "1 m:2", "xGap": 16, "yGap": 16, "responsive": "screen" },
      "children": [
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "props": { "title": "访问趋势", "class": "h-400px" },
            "children": [{
              "com": "VueECharts",
              "props": {
                "option": {
                  "tooltip": { "trigger": "axis" },
                  "legend": { "data": ["访问量", "独立用户"], "top": 0 },
                  "grid": { "left": "3%", "right": "4%", "top": "15%", "bottom": "3%", "containLabel": true },
                  "xAxis": { "type": "category", "boundaryGap": false, "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] },
                  "yAxis": { "type": "value" },
                  "series": [
                    { "name": "访问量", "type": "line", "smooth": true, "areaStyle": { "opacity": 0.3 }, "data": [820, 932, 901, 1234, 1290, 1330, 1520] },
                    { "name": "独立用户", "type": "line", "smooth": true, "areaStyle": { "opacity": 0.3 }, "data": [320, 432, 401, 634, 690, 730, 820] }
                  ]
                }
              },
              "style": { "height": "100%" }
            }]
          }]
        },
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "props": { "title": "销售统计", "class": "h-400px" },
            "children": [{
              "com": "VueECharts",
              "props": {
                "option": {
                  "tooltip": { "trigger": "axis" },
                  "xAxis": { "type": "category", "data": ["1月", "2月", "3月", "4月", "5月", "6月"] },
                  "yAxis": { "type": "value" },
                  "series": [{ "type": "bar", "data": [12000, 15000, 18000, 22000, 28000, 35000], "itemStyle": { "borderRadius": [4, 4, 0, 0] } }]
                }
              },
              "style": { "height": "100%" }
            }]
          }]
        }
      ]
    },
    {
      "com": "NCard",
      "props": { "title": "最近活动" },
      "children": [{
        "com": "NSpin",
        "props": { "show": "{{ loading }}" },
        "children": [{
          "com": "NTimeline",
          "children": [{
            "com": "NTimelineItem",
            "for": "item in recentActivities",
            "props": { "type": "{{ item.type }}", "title": "{{ item.title }}", "time": "{{ item.time }}" },
            "children": "{{ item.content }}"
          }]
        }]
      }]
    },
    {
      "com": "NGrid",
      "props": { "cols": "1 m:3", "xGap": 16, "yGap": 16, "responsive": "screen" },
      "children": [
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "props": { "title": "快捷操作" },
            "children": [{
              "com": "NSpace",
              "props": { "wrap": true },
              "children": [
                { "com": "NButton", "props": { "type": "primary", "secondary": true }, "events": { "click": { "call": "$router.push", "args": ["/system/user"] } }, "children": "用户管理" },
                { "com": "NButton", "props": { "type": "info", "secondary": true }, "events": { "click": { "call": "$router.push", "args": ["/system/role"] } }, "children": "角色管理" },
                { "com": "NButton", "props": { "type": "success", "secondary": true }, "events": { "click": { "call": "$router.push", "args": ["/system/menu"] } }, "children": "菜单管理" }
              ]
            }]
          }]
        },
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "props": { "title": "系统信息" },
            "children": [{
              "com": "NDescriptions",
              "props": { "column": 1, "labelPlacement": "left" },
              "children": [
                { "com": "NDescriptionsItem", "props": { "label": "系统版本" }, "children": "1.0.0" },
                { "com": "NDescriptionsItem", "props": { "label": "Vue 版本" }, "children": "3.5.x" },
                { "com": "NDescriptionsItem", "props": { "label": "Naive UI" }, "children": "2.43.x" }
              ]
            }]
          }]
        },
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "props": { "title": "项目信息" },
            "children": [{
              "com": "NDescriptions",
              "props": { "column": 1, "labelPlacement": "left" },
              "children": [
                { "com": "NDescriptionsItem", "props": { "label": "项目名称" }, "children": "Trix Admin" },
                { "com": "NDescriptionsItem", "props": { "label": "技术栈" }, "children": "Vue 3 + TypeScript" },
                { "com": "NDescriptionsItem", "props": { "label": "渲染引擎" }, "children": "@maliang47/vschema" }
              ]
            }]
          }]
        }
      ]
    }
  ]
}
```

## 关键点

### 1. 数据加载

页面挂载时加载数据：

```json
{
  "onMounted": { "call": "loadDashboardData" }
}
```

### 2. 响应式布局

使用 NGrid 实现响应式：

```json
{
  "props": { "cols": "1 s:2 m:4", "responsive": "screen" }
}
```

- 移动端：1 列
- 小屏幕：2 列
- 中等屏幕：4 列

### 3. 图表组件

使用 VueECharts 渲染图表：

```json
{
  "com": "VueECharts",
  "props": { "option": { ... } },
  "style": { "height": "100%" }
}
```

### 4. 循环渲染

使用 for 渲染活动列表：

```json
{
  "com": "NTimelineItem",
  "for": "item in recentActivities",
  "props": { "title": "{{ item.title }}" }
}
```
