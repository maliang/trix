<script setup lang="ts">
/**
 * MarkdownEditor - Markdown 编辑器组件
 *
 * 基于 Vditor 封装，支持：
 * - 三种编辑模式（即时渲染/所见即所得/分屏预览）
 * - 主题跟随系统明暗切换
 * - 丰富的工具栏配置
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useThemeStore } from '@/store/modules/theme';

type EditorMode = 'ir' | 'wysiwyg' | 'sv';

interface Props {
  /** 绑定值 */
  modelValue?: string;
  /** 编辑器高度 */
  height?: number | string;
  /** 编辑模式：ir(即时渲染) / wysiwyg(所见即所得) / sv(分屏预览) */
  mode?: EditorMode;
  /** 占位文本 */
  placeholder?: string;
  /** 是否只读 */
  readonly?: boolean;
  /** 工具栏配置 */
  toolbar?: string[];
  /** 图片上传配置 */
  upload?: {
    /** 上传地址 */
    url: string;
    /** 文件字段名 */
    fieldName?: string;
    /** 请求头 */
    headers?: Record<string, string>;
  };
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 400,
  mode: 'ir',
  placeholder: '请输入内容...',
  readonly: false,
  toolbar: () => [
    'emoji', 'headings', 'bold', 'italic', 'strike', 'link', '|',
    'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
    'quote', 'line', 'code', 'inline-code', 'insert-before', 'insert-after', '|',
    'upload', 'table', '|',
    'undo', 'redo', '|',
    'fullscreen', 'edit-mode', 'outline', 'preview'
  ],
  upload: undefined
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
  focus: [];
  blur: [];
}>();

// 主题
const themeStore = useThemeStore();

// 编辑器实例
const editorRef = ref<HTMLElement | null>(null);
const vditor = ref<Vditor | null>(null);
const isReady = ref(false);

// 计算高度
const editorHeight = typeof props.height === 'number' ? props.height : parseInt(props.height, 10) || 400;

// 获取主题
function getTheme(): 'dark' | 'classic' {
  return themeStore.darkMode ? 'dark' : 'classic';
}

// 初始化编辑器
function initEditor() {
  if (!editorRef.value) return;

  const options: any = {
    height: editorHeight,
    mode: props.mode,
    placeholder: props.placeholder,
    theme: getTheme(),
    toolbar: props.toolbar,
    cache: { enable: false },
    input: (value: string) => {
      emit('update:modelValue', value);
      emit('change', value);
    },
    focus: () => emit('focus'),
    blur: () => emit('blur'),
    after: () => {
      isReady.value = true;
      if (props.modelValue) {
        vditor.value?.setValue(props.modelValue);
      }
      if (props.readonly) {
        vditor.value?.disabled();
      }
    }
  };

  // 添加上传配置
  if (props.upload?.url) {
    options.upload = {
      url: props.upload.url,
      fieldName: props.upload.fieldName || 'file',
      headers: props.upload.headers || {}
    };
  }

  vditor.value = new Vditor(editorRef.value, options);
}

// 监听值变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (isReady.value && vditor.value && newVal !== vditor.value.getValue()) {
      vditor.value.setValue(newVal || '');
    }
  }
);

// 监听主题变化
watch(
  () => themeStore.darkMode,
  () => {
    if (vditor.value) {
      vditor.value.setTheme(getTheme());
    }
  }
);

// 监听只读状态
watch(
  () => props.readonly,
  (readonly) => {
    if (vditor.value) {
      readonly ? vditor.value.disabled() : vditor.value.enable();
    }
  }
);

onMounted(() => {
  nextTick(() => {
    initEditor();
  });
});

onBeforeUnmount(() => {
  vditor.value?.destroy();
  vditor.value = null;
});

// 暴露方法
defineExpose({
  /** 获取 Vditor 实例 */
  getInstance: () => vditor.value,
  /** 获取内容 */
  getValue: () => vditor.value?.getValue() || '',
  /** 设置内容 */
  setValue: (value: string) => vditor.value?.setValue(value),
  /** 插入内容 */
  insertValue: (value: string) => vditor.value?.insertValue(value),
  /** 聚焦 */
  focus: () => vditor.value?.focus(),
  /** 失焦 */
  blur: () => vditor.value?.blur(),
  /** 清空 */
  clear: () => vditor.value?.setValue('')
});
</script>

<template>
  <div ref="editorRef" class="markdown-editor" />
</template>

<style scoped>
.markdown-editor {
  width: 100%;
}

/* 暗色主题适配 */
:deep(.vditor--dark) {
  --panel-background-color: #1e1e1e;
}
</style>
