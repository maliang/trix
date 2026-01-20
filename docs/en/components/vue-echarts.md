# VueECharts

ECharts chart component for rendering charts in JSON Schema.

## Basic Usage

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `option` | `object` | - | ECharts configuration options |
| `autoresize` | `boolean` | `true` | Auto resize |
| `loading` | `boolean` | `false` | Show loading state |
| `theme` | `string` | - | Theme name |

## Line Chart

```json
{
  "com": "VueECharts",
  "props": {
    "option": {
      "title": { "text": "Traffic Trends" },
      "tooltip": { "trigger": "axis" },
      "legend": { "data": ["Page Views", "Unique Visitors"] },
      "xAxis": {
        "type": "category",
        "boundaryGap": false,
        "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      "yAxis": { "type": "value" },
      "series": [
        {
          "name": "Page Views",
          "type": "line",
          "smooth": true,
          "areaStyle": { "opacity": 0.3 },
          "data": [820, 932, 901, 1234, 1290, 1330, 1520]
        }
      ]
    }
  },
  "style": { "height": "400px" }
}
```

## Bar Chart

```json
{
  "com": "VueECharts",
  "props": {
    "option": {
      "title": { "text": "Sales Statistics" },
      "tooltip": { "trigger": "axis" },
      "xAxis": {
        "type": "category",
        "data": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      },
      "yAxis": { "type": "value" },
      "series": [
        {
          "name": "Sales",
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


## Pie Chart

```json
{
  "com": "VueECharts",
  "props": {
    "option": {
      "title": { "text": "Traffic Sources", "left": "center" },
      "tooltip": { "trigger": "item" },
      "legend": { "orient": "vertical", "left": "left" },
      "series": [
        {
          "name": "Traffic Source",
          "type": "pie",
          "radius": "50%",
          "data": [
            { "value": 1048, "name": "Search Engine" },
            { "value": 735, "name": "Direct" },
            { "value": 580, "name": "Email" },
            { "value": 484, "name": "Affiliate" },
            { "value": 300, "name": "Video Ads" }
          ]
        }
      ]
    }
  },
  "style": { "height": "400px" }
}
```

## Dynamic Data

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

## More Chart Types

ECharts supports many chart types. See [ECharts Documentation](https://echarts.apache.org/en/index.html):

- Scatter
- Radar
- Map
- Heatmap
- Tree
- Sankey
- Gauge
- Funnel
