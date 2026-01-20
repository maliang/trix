<script setup lang="ts">
/**
 * Schema 编辑器组件
 * 支持实时编辑和预览 JSON schema，用于开发调试
 * 需求: 9.1 - 开发模式下提供 JSON schema 编辑器用于实时编辑
 */
import { ref, computed, watch, resolveComponent, h, onMounted } from 'vue';
import {
  NCard,
  NGrid,
  NGridItem,
  NInput,
  NButton,
  NSpace,
  NAlert,
  NSwitch,
  NText,
  NScrollbar,
  NDivider,
  NCollapse,
  NCollapseItem,
  useMessage
} from 'naive-ui';
import type { JsonNode } from '@maliang47/vschema';

// 使用 resolveComponent 获取全局注册的 VSchema 组件
const VSchema = resolveComponent('VSchema');

defineOptions({
  name: 'SchemaEditor'
});

// Props 定义
interface Props {
  /** 初始 schema */
  initialSchema?: JsonNode | string;
  /** 是否显示预览 */
  showPreview?: boolean;
  /** 编辑器高度 */
  height?: string | number;
  /** 是否只读 */
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPreview: true,
  height: '500px',
  readonly: false
});

// Emits 定义
const emit = defineEmits<{
  /** Schema 变更 */
  change: [schema: JsonNode | null, raw: string];
  /** 解析错误 */
  error: [error: Error];
  /** Schema 有效 */
  valid: [schema: JsonNode];
}>();

const message = useMessage();

// 状态
const schemaText = ref('');
const parsedSchema = ref<JsonNode | null>(null);
const parseError = ref<string | null>(null);
const isAutoPreview = ref(true);
const previewKey = ref(0);

/**
 * 计算编辑器高度样式
 */
const editorHeight = computed(() => {
  if (typeof props.height === 'number') {
    return `${props.height}px`;
  }
  return props.height;
});

/**
 * 默认 schema 模板
 */
const defaultSchema: JsonNode = {
  com: 'NCard',
  props: {
    title: '示例页面'
  },
  children: [
    {
      com: 'NSpace',
      props: { vertical: true },
      children: [
        {
          com: 'NText',
          children: '这是一个示例页面，您可以编辑左侧的 JSON 来修改页面内容。'
        },
        {
          com: 'NButton',
          props: { type: 'primary' },
          children: '点击按钮'
        }
      ]
    }
  ]
};

/**
 * 解析 schema 文本
 */
function parseSchema(text: string): { schema: JsonNode | null; error: string | null } {
  if (!text.trim()) {
    return { schema: null, error: '请输入 JSON Schema' };
  }

  try {
    const parsed = JSON.parse(text);
    
    // 基本验证：检查是否有 com 属性
    if (!parsed.com && !Array.isArray(parsed)) {
      return { schema: null, error: 'Schema 必须包含 "com" 属性或为数组' };
    }

    return { schema: parsed, error: null };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '解析失败';
    return { schema: null, error: `JSON 解析错误: ${errorMessage}` };
  }
}

/**
 * 处理 schema 文本变更
 */
function handleSchemaChange(value: string) {
  schemaText.value = value;
  
  const { schema, error } = parseSchema(value);
  parseError.value = error;
  
  if (schema) {
    parsedSchema.value = schema;
    emit('valid', schema);
    
    if (isAutoPreview.value) {
      previewKey.value++;
    }
  } else if (error) {
    emit('error', new Error(error));
  }
  
  emit('change', schema, value);
}

/**
 * 格式化 JSON
 */
function formatJson() {
  try {
    const parsed = JSON.parse(schemaText.value);
    schemaText.value = JSON.stringify(parsed, null, 2);
    message.success('格式化成功');
  } catch (e) {
    message.error('JSON 格式错误，无法格式化');
  }
}

/**
 * 压缩 JSON
 */
function minifyJson() {
  try {
    const parsed = JSON.parse(schemaText.value);
    schemaText.value = JSON.stringify(parsed);
    message.success('压缩成功');
  } catch (e) {
    message.error('JSON 格式错误，无法压缩');
  }
}

/**
 * 复制到剪贴板
 */
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(schemaText.value);
    message.success('已复制到剪贴板');
  } catch (e) {
    message.error('复制失败');
  }
}

/**
 * 重置为默认 schema
 */
function resetToDefault() {
  const defaultText = JSON.stringify(defaultSchema, null, 2);
  handleSchemaChange(defaultText);
  message.info('已重置为默认 Schema');
}

/**
 * 刷新预览
 */
function refreshPreview() {
  previewKey.value++;
  message.success('预览已刷新');
}

/**
 * 清空编辑器
 */
function clearEditor() {
  handleSchemaChange('');
  message.info('已清空');
}

// 初始化
onMounted(() => {
  let initialText = '';
  
  if (props.initialSchema) {
    if (typeof props.initialSchema === 'string') {
      initialText = props.initialSchema;
    } else {
      initialText = JSON.stringify(props.initialSchema, null, 2);
    }
  } else {
    initialText = JSON.stringify(defaultSchema, null, 2);
  }
  
  handleSchemaChange(initialText);
});

// 监听 initialSchema 变化
watch(() => props.initialSchema, (newSchema) => {
  if (newSchema) {
    const text = typeof newSchema === 'string' 
      ? newSchema 
      : JSON.stringify(newSchema, null, 2);
    handleSchemaChange(text);
  }
});
</script>

<template>
  <div class="schema-editor">
    <NGrid :cols="props.showPreview ? 2 : 1" :x-gap="16" :y-gap="16">
      <!-- 编辑器面板 -->
      <NGridItem>
        <NCard title="Schema 编辑器" size="small">
          <template #header-extra>
            <NSpace size="small">
              <NButton size="small" @click="formatJson">格式化</NButton>
              <NButton size="small" @click="minifyJson">压缩</NButton>
              <NButton size="small" @click="copyToClipboard">复制</NButton>
              <NButton size="small" @click="resetToDefault">重置</NButton>
              <NButton size="small" type="error" @click="clearEditor">清空</NButton>
            </NSpace>
          </template>

          <!-- 错误提示 -->
          <NAlert
            v-if="parseError"
            type="error"
            :title="parseError"
            class="mb-3"
            closable
          />

          <!-- 编辑区域 -->
          <NScrollbar :style="{ maxHeight: editorHeight }">
            <NInput
              :value="schemaText"
              type="textarea"
              :rows="20"
              :readonly="props.readonly"
              placeholder="请输入 JSON Schema..."
              font-family="monospace"
              :style="{ fontFamily: 'monospace', fontSize: '13px' }"
              @update:value="handleSchemaChange"
            />
          </NScrollbar>

          <!-- 底部工具栏 -->
          <NDivider style="margin: 12px 0" />
          <NSpace justify="space-between" align="center">
            <NSpace align="center">
              <NText depth="3">自动预览</NText>
              <NSwitch v-model:value="isAutoPreview" size="small" />
            </NSpace>
            <NSpace>
              <NText depth="3" size="small">
                {{ schemaText.length }} 字符
              </NText>
              <NButton
                v-if="!isAutoPreview"
                size="small"
                type="primary"
                @click="refreshPreview"
              >
                刷新预览
              </NButton>
            </NSpace>
          </NSpace>
        </NCard>
      </NGridItem>

      <!-- 预览面板 -->
      <NGridItem v-if="props.showPreview">
        <NCard title="实时预览" size="small">
          <template #header-extra>
            <NButton size="small" @click="refreshPreview">刷新</NButton>
          </template>

          <NScrollbar :style="{ maxHeight: editorHeight }">
            <div class="preview-container p-2">
              <!-- 有效 Schema 时渲染 -->
              <component
                :is="VSchema"
                v-if="parsedSchema && !parseError"
                :key="previewKey"
                :schema="parsedSchema"
              />

              <!-- 无效或空 Schema 时显示提示 -->
              <div
                v-else
                class="empty-preview flex items-center justify-center h-full text-gray-400"
              >
                <NSpace vertical align="center">
                  <span class="text-4xl">📝</span>
                  <NText depth="3">
                    {{ parseError ? '请修复 JSON 错误' : '请输入有效的 JSON Schema' }}
                  </NText>
                </NSpace>
              </div>
            </div>
          </NScrollbar>
        </NCard>
      </NGridItem>
    </NGrid>

    <!-- Schema 帮助文档 -->
    <NCollapse class="mt-4">
      <NCollapseItem title="Schema 语法帮助" name="help">
        <div class="help-content text-sm">
          <p class="mb-2"><strong>基本结构：</strong></p>
          <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs mb-3">{
  "com": "组件名称",
  "props": { "属性名": "属性值" },
  "children": "子内容或子组件数组"
}</pre>

          <p class="mb-2"><strong>常用组件：</strong></p>
          <ul class="list-disc list-inside mb-3 text-gray-600 dark:text-gray-400">
            <li>NCard - 卡片容器</li>
            <li>NButton - 按钮</li>
            <li>NInput - 输入框</li>
            <li>NForm / NFormItem - 表单</li>
            <li>NDataTable - 数据表格</li>
            <li>NSpace - 间距布局</li>
            <li>NGrid / NGridItem - 网格布局</li>
          </ul>

          <p class="mb-2"><strong>表达式语法：</strong></p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-400">
            <li><code v-pre>{{ 变量名 }}</code> - 绑定数据</li>
            <li><code v-pre>{{ $app.locale }}</code> - 访问全局状态</li>
            <li><code v-pre>{{ condition ? 'a' : 'b' }}</code> - 条件表达式</li>
          </ul>
        </div>
      </NCollapseItem>
    </NCollapse>
  </div>
</template>

<style scoped>
.schema-editor {
  width: 100%;
}

.preview-container {
  min-height: 200px;
  background: var(--n-color);
  border-radius: 4px;
}

.empty-preview {
  min-height: 300px;
}

.help-content pre {
  overflow-x: auto;
}

.help-content code {
  background: var(--n-color-embedded);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
