# VueECharts

ECharts 图表组件，用于在 JSON Schema 中渲染图表。

## 基本用法

```json
{
  "com": "VueECharts",
  "props": {
    "option": {
      "xAxis": {
        "type": "category",
        "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      "yAxis": {
        "type": "value"
      },
      "series": [
        {
          "data": [150, 230, 224, 218, 135, 147, 260],
          "type": "line"
        }
      ]
    }
  },
  "style": {
    "height": "300px"
  }
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `option` | `object` | - | ECharts 配置项 |
| `autoresize` | `boolean` | `true` | 自动调整大小 |
| `loading` | `boolean` | `false` | 显示加载状态 |
| `theme` | `string` | - | 主题名称 |

## 折线图

```json
{
  "com": "VueECharts",
  "props": {
    "option": {
      "title": { "text": "访问趋势" },
      "tooltip": { "trigger": "axis" },
      "legend": { "data": ["访问量", "独立用户"] },
      "grid": {
        "left": "3%",
        "right": "4%",
        "bottom": "3%",
        "containLabel": true
      },
      "xAxis": {
        "type": "category",
        "boundaryGap": false,
        "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
      },
      "yAxis": { "type": "value" },
      "series": [
        {
          "name": "访问量",
          "type": "line",
          "smooth": true,
          "areaStyle": { "opacity": 0.3 },
          "data": [820, 932, 901, 1234, 1290, 1330, 1520]
        },
        {
          "name": "独立用户",
          "type": "line",
          "smooth": true,
          "areaStyle": { "opacity": 0.3 },
          "data": [320, 432, 401, 634, 690, 730, 820]
        }
      ]
    }
  },
  "style": { "height": "400px" }
}
```

## 柱状图

```json
{
  "com": "VueECharts",
  "props": {
    "option": {
      "title": { "text": "销售统计" },
      "tooltip": { "trigger": "axis" },
      "xAxis": {
        "type": "category",
        "data": ["1月", "2月", "3月", "4月", "5月", "6月"]
      },
      "yAxis": { "type": "value" },
      "series": [
        {
          "name": "销售额",
          "type": "bar",
          "data": [12000, 15000, 18000, 22000, 28000, 35000],
          "itemStyle": { "borderRadius": [4, 4, 0, 0] }
        }
      ]
    }
  },
  "style": { "height": "400px" }
}
```

## 饼图

```json
{
  "com": "VueECharts",
  "props": {
    "option": {
      "title": { "text": "访问来源", "left": "center" },
      "tooltip": { "trigger": "item" },
      "legend": { "orient": "vertical", "left": "left" },
      "series": [
        {
          "name": "访问来源",
          "type": "pie",
          "radius": "50%",
          "data": [
            { "value": 1048, "name": "搜索引擎" },
            { "value": 735, "name": "直接访问" },
            { "value": 580, "name": "邮件营销" },
            { "value": 484, "name": "联盟广告" },
            { "value": 300, "name": "视频广告" }
          ],
          "emphasis": {
            "itemStyle": {
              "shadowBlur": 10,
              "shadowOffsetX": 0,
              "shadowColor": "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    }
  },
  "style": { "height": "400px" }
}
```

## 环形图

```json
{
  "com": "VueECharts",
  "props": {
    "option": {
      "tooltip": { "trigger": "item" },
      "legend": { "top": "5%", "left": "center" },
      "series": [
        {
          "name": "占比",
          "type": "pie",
          "radius": ["40%", "70%"],
          "avoidLabelOverlap": false,
          "itemStyle": { "borderRadius": 10, "borderColor": "#fff", "borderWidth": 2 },
          "label": { "show": false, "position": "center" },
          "emphasis": {
            "label": { "show": true, "fontSize": 20, "fontWeight": "bold" }
          },
          "labelLine": { "show": false },
          "data": [
            { "value": 1048, "name": "搜索引擎" },
            { "value": 735, "name": "直接访问" },
            { "value": 580, "name": "邮件营销" }
          ]
        }
      ]
    }
  },
  "style": { "height": "400px" }
}
```

## 动态数据

```json
{
  "data": {
    "chartData": []
  },
  "methods": {
    "loadChartData": [
      {
        "fetch": "/api/chart-data",
        "then": [
          { "set": "chartData", "value": "{{ $response }}" }
        ]
      }
    ]
  },
  "onMounted": { "call": "loadChartData" },
  "com": "VueECharts",
  "props": {
    "option": {
      "xAxis": {
        "type": "category",
        "data": "{{ chartData.map(i => i.date) }}"
      },
      "yAxis": { "type": "value" },
      "series": [
        {
          "type": "line",
          "data": "{{ chartData.map(i => i.value) }}"
        }
      ]
    }
  },
  "style": { "height": "300px" }
}
```

## 在卡片中使用

```json
{
  "com": "NCard",
  "props": { "title": "数据统计" },
  "children": [
    {
      "com": "VueECharts",
      "props": {
        "option": {
          "xAxis": { "type": "category", "data": ["A", "B", "C", "D", "E"] },
          "yAxis": { "type": "value" },
          "series": [{ "type": "bar", "data": [10, 20, 30, 40, 50] }]
        }
      },
      "style": { "height": "300px" }
    }
  ]
}
```

## 响应式布局

```json
{
  "com": "NGrid",
  "props": { "cols": "1 m:2", "xGap": 16, "yGap": 16 },
  "children": [
    {
      "com": "NGridItem",
      "children": [
        {
          "com": "NCard",
          "props": { "title": "图表1" },
          "children": [
            {
              "com": "VueECharts",
              "props": { "option": "{{ chart1Option }}" },
              "style": { "height": "300px" }
            }
          ]
        }
      ]
    },
    {
      "com": "NGridItem",
      "children": [
        {
          "com": "NCard",
          "props": { "title": "图表2" },
          "children": [
            {
              "com": "VueECharts",
              "props": { "option": "{{ chart2Option }}" },
              "style": { "height": "300px" }
            }
          ]
        }
      ]
    }
  ]
}
```

## 更多图表类型

ECharts 支持更多图表类型，详见 [ECharts 官方文档](https://echarts.apache.org/zh/index.html)：

- 散点图 (scatter)
- 雷达图 (radar)
- 地图 (map)
- 热力图 (heatmap)
- 树图 (tree)
- 桑基图 (sankey)
- 仪表盘 (gauge)
- 漏斗图 (funnel)
