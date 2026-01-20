# Dashboard Example

A complete dashboard page JSON Schema example.

## Features

The dashboard includes:
- Statistics cards (users, orders, revenue, etc.)
- Data charts (line charts, bar charts)
- Recent activity timeline
- Quick action shortcuts
- System information display

## Schema Structure

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
              "props": { "label": "Total Users", "value": "{{ stats.totalUsers }}" },
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
              "props": { "label": "Active Users", "value": "{{ stats.activeUsers }}" },
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
              "props": { "label": "Total Orders", "value": "{{ stats.totalOrders }}" },
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
              "props": { "label": "Revenue", "value": "{{ stats.revenue }}" },
              "slots": {
                "prefix": [{ "com": "NText", "props": { "class": "text-error text-2xl mr-2" }, "children": "$" }]
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
            "props": { "title": "Traffic Trends", "class": "h-400px" },
            "children": [{
              "com": "VueECharts",
              "props": {
                "option": {
                  "tooltip": { "trigger": "axis" },
                  "legend": { "data": ["Page Views", "Unique Visitors"], "top": 0 },
                  "grid": { "left": "3%", "right": "4%", "top": "15%", "bottom": "3%", "containLabel": true },
                  "xAxis": { "type": "category", "boundaryGap": false, "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
                  "yAxis": { "type": "value" },
                  "series": [
                    { "name": "Page Views", "type": "line", "smooth": true, "areaStyle": { "opacity": 0.3 }, "data": [820, 932, 901, 1234, 1290, 1330, 1520] },
                    { "name": "Unique Visitors", "type": "line", "smooth": true, "areaStyle": { "opacity": 0.3 }, "data": [320, 432, 401, 634, 690, 730, 820] }
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
            "props": { "title": "Sales Statistics", "class": "h-400px" },
            "children": [{
              "com": "VueECharts",
              "props": {
                "option": {
                  "tooltip": { "trigger": "axis" },
                  "xAxis": { "type": "category", "data": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
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
      "props": { "title": "Recent Activities" },
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
            "props": { "title": "Quick Actions" },
            "children": [{
              "com": "NSpace",
              "props": { "wrap": true },
              "children": [
                { "com": "NButton", "props": { "type": "primary", "secondary": true }, "events": { "click": { "call": "$router.push", "args": ["/system/user"] } }, "children": "User Management" },
                { "com": "NButton", "props": { "type": "info", "secondary": true }, "events": { "click": { "call": "$router.push", "args": ["/system/role"] } }, "children": "Role Management" },
                { "com": "NButton", "props": { "type": "success", "secondary": true }, "events": { "click": { "call": "$router.push", "args": ["/system/menu"] } }, "children": "Menu Management" }
              ]
            }]
          }]
        },
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "props": { "title": "System Info" },
            "children": [{
              "com": "NDescriptions",
              "props": { "column": 1, "labelPlacement": "left" },
              "children": [
                { "com": "NDescriptionsItem", "props": { "label": "Version" }, "children": "1.0.0" },
                { "com": "NDescriptionsItem", "props": { "label": "Vue" }, "children": "3.5.x" },
                { "com": "NDescriptionsItem", "props": { "label": "Naive UI" }, "children": "2.43.x" }
              ]
            }]
          }]
        },
        {
          "com": "NGridItem",
          "children": [{
            "com": "NCard",
            "props": { "title": "Project Info" },
            "children": [{
              "com": "NDescriptions",
              "props": { "column": 1, "labelPlacement": "left" },
              "children": [
                { "com": "NDescriptionsItem", "props": { "label": "Name" }, "children": "Trix Admin" },
                { "com": "NDescriptionsItem", "props": { "label": "Stack" }, "children": "Vue 3 + TypeScript" },
                { "com": "NDescriptionsItem", "props": { "label": "Renderer" }, "children": "@maliang47/vschema" }
              ]
            }]
          }]
        }
      ]
    }
  ]
}
```

## Key Points

### 1. Data Loading

Load data when page mounts:

```json
{
  "onMounted": { "call": "loadDashboardData" }
}
```

### 2. Responsive Layout

Use NGrid for responsive design:

```json
{
  "props": { "cols": "1 s:2 m:4", "responsive": "screen" }
}
```

- Mobile: 1 column
- Small screen: 2 columns
- Medium screen: 4 columns

### 3. Chart Components

Use VueECharts for rendering charts:

```json
{
  "com": "VueECharts",
  "props": { "option": { ... } },
  "style": { "height": "100%" }
}
```

### 4. Loop Rendering

Use `for` to render activity list:

```json
{
  "com": "NTimelineItem",
  "for": "item in recentActivities",
  "props": { "title": "{{ item.title }}" }
}
```
