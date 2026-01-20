# Basic Structure

This section details the basic structure of JSON Schema and the usage of each field.

## Complete Structure

```json
{
  "data": {
    "form": { "name": "", "age": 0 },
    "list": [],
    "loading": false
  },
  "methods": {
    "submit": [
      { "set": "loading", "value": true },
      { "fetch": "/api/submit", "method": "POST", "body": "{{ form }}" }
    ]
  },
  "onMounted": { "call": "loadData" },
  "onUnmounted": { "call": "cleanup" },
  "com": "NCard",
  "props": { "title": "Form" },
  "style": { "marginTop": "20px" },
  "class": "my-card",
  "children": [],
  "slots": {},
  "events": {},
  "if": "showCard",
  "for": "",
  "key": ""
}
```

## Data Definition (data)

`data` defines the reactive data for the page:

```json
{
  "data": {
    "message": "Hello",
    "count": 0,
    "visible": true,
    "form": {
      "username": "",
      "password": ""
    },
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 0
    }
  }
}
```

### Data Types

All JSON data types are supported:

- String: `"message": "Hello"`
- Number: `"count": 0`
- Boolean: `"visible": true`
- Object: `"form": { "name": "" }`
- Array: `"list": []`
- null: `"data": null`

## Component (com)

`com` specifies the component to render:

```json
{ "com": "NButton" }
{ "com": "NCard" }
{ "com": "div" }
{ "com": "span" }
```

### HTML Elements

Native HTML elements can be used:

```json
{ "com": "div", "children": "Content" }
{ "com": "span", "props": { "class": "text-red" } }
{ "com": "a", "props": { "href": "https://example.com" } }
```

### Vue Components

Registered Vue components can be used:

```json
{ "com": "NButton" }
{ "com": "SvgIcon" }
{ "com": "VueECharts" }
```

## Properties (props)

`props` passes properties to the component:

```json
{
  "com": "NButton",
  "props": {
    "type": "primary",
    "size": "large",
    "disabled": false,
    "loading": "{{ loading }}"
  }
}
```

### Dynamic Properties

Use `{{ }}` to bind dynamic values:

```json
{
  "props": {
    "disabled": "{{ !form.username }}",
    "placeholder": "{{ $t('common.input') }}"
  }
}
```

## Style (style)

`style` defines inline styles:

```json
{
  "com": "div",
  "style": {
    "padding": "20px",
    "backgroundColor": "#f5f5f5",
    "borderRadius": "8px"
  }
}
```

### Dynamic Styles

```json
{
  "style": {
    "color": "{{ active ? 'red' : 'black' }}",
    "display": "{{ visible ? 'block' : 'none' }}"
  }
}
```

## Class (class)

`class` defines CSS class names:

```json
{
  "com": "div",
  "class": "container flex items-center"
}
```

### Dynamic Classes

```json
{
  "class": "{{ active ? 'active' : '' }} base-class"
}
```

## Children (children)

`children` defines child content:

### Text Content

```json
{
  "com": "NButton",
  "children": "Click Me"
}
```

### Dynamic Text

```json
{
  "com": "NText",
  "children": "Hello, {{ username }}"
}
```

### Component Array

```json
{
  "com": "NSpace",
  "children": [
    { "com": "NButton", "children": "Button 1" },
    { "com": "NButton", "children": "Button 2" }
  ]
}
```

### Nested Structure

```json
{
  "com": "NCard",
  "props": { "title": "Card" },
  "children": [
    {
      "com": "NForm",
      "children": [
        {
          "com": "NFormItem",
          "props": { "label": "Username" },
          "children": [
            { "com": "NInput", "model": "form.username" }
          ]
        }
      ]
    }
  ]
}
```

## Slots (slots)

`slots` defines named slots:

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      { "com": "NText", "children": "Custom Header" }
    ],
    "footer": [
      { "com": "NButton", "children": "OK" }
    ]
  },
  "children": "Card Content"
}
```

### Common Slot Examples

```json
{
  "com": "NInput",
  "model": "form.username",
  "slots": {
    "prefix": [
      { "com": "SvgIcon", "props": { "icon": "carbon:user" } }
    ],
    "suffix": [
      { "com": "SvgIcon", "props": { "icon": "carbon:close" } }
    ]
  }
}
```

## Events (events)

`events` defines event handlers:

```json
{
  "com": "NButton",
  "events": {
    "click": { "set": "count", "value": "{{ count + 1 }}" }
  }
}
```

See [Event Handling](/en/schema/events) for details.

## Two-way Binding (model)

`model` implements two-way data binding:

```json
{
  "com": "NInput",
  "model": "form.username"
}
```

### Custom model

```json
{
  "com": "NSwitch",
  "model:value": "form.enabled"
}
```

```json
{
  "com": "NCheckbox",
  "model:checked": "form.agree"
}
```

## Conditional Rendering (if)

`if` controls whether the component is rendered:

```json
{
  "com": "NButton",
  "if": "showButton",
  "children": "Button"
}
```

See [Conditional Rendering](/en/schema/conditional) for details.

## Loop Rendering (for)

`for` implements list rendering:

```json
{
  "com": "NTag",
  "for": "item in list",
  "key": "item.id",
  "children": "{{ item.name }}"
}
```

See [Loop Rendering](/en/schema/loop) for details.

## Method Definition (methods)

`methods` defines reusable methods:

```json
{
  "methods": {
    "loadData": [
      { "set": "loading", "value": true },
      { "fetch": "/api/list", "then": [{ "set": "list", "value": "{{ $response }}" }] },
      { "set": "loading", "value": false }
    ],
    "handleSubmit": [
      { "call": "validate" },
      { "fetch": "/api/submit", "method": "POST", "body": "{{ form }}" }
    ]
  }
}
```

See [Method Definition](/en/schema/methods) for details.

## Lifecycle

### onMounted

Executed when the component is mounted:

```json
{
  "onMounted": { "call": "loadData" }
}
```

### onUnmounted

Executed when the component is unmounted:

```json
{
  "onUnmounted": { "call": "cleanup" }
}
```

See [Lifecycle](/en/schema/lifecycle) for details.
