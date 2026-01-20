<script setup lang="ts">
/**
 * RichEditor - 富文本编辑器组件
 *
 * 基于 wangEditor 封装，支持：
 * - 默认/简洁两种模式
 * - 暗色主题适配
 * - 丰富的编辑功能
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import { useThemeStore } from '@/store/modules/theme';

type EditorMode = 'default' | 'simple';

interface Props {
  /** 绑定值 */
  modelValue?: string;
  /** 编辑器高度 */
  height?: number | string;
  /** 编辑模式 */
  mode?: EditorMode;
  /** 占位文本 */
  placeholder?: string;
  /** 是否只读 */
  readonly?: boolean;
  /** 上传配置 */
  upload?: {
    /** 上传地址 */
    url: string;
    /** 文件字段名 */
    fieldName?: string;
    /** 请求头 */
    headers?: Record<string, string>;
    /** 视频上传地址（不设置则使用 url） */
    videoUrl?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 400,
  mode: 'default',
  placeholder: '请输入内容...',
  readonly: false,
  upload: undefined
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
  focus: [editor: IDomEditor];
  blur: [editor: IDomEditor];
}>();

// 主题
const themeStore = useThemeStore();

// 编辑器实例
const editorRef = shallowRef<IDomEditor | null>(null);
const isReady = ref(false);

// 计算高度（确保最小 300px）
const editorHeight = computed(() => {
  const h = typeof props.height === 'number' ? props.height : parseInt(props.height, 10) || 400;
  return Math.max(h, 300);
});

// 工具栏配置
const toolbarConfig = computed<Partial<IToolbarConfig>>(() => ({
  mode: props.mode
}));

// 编辑器配置
const editorConfig = computed<Partial<IEditorConfig>>(() => {
  const config: Partial<IEditorConfig> = {
    placeholder: props.placeholder,
    readOnly: props.readonly,
    MENU_CONF: {}
  };

  // 配置图片上传
  if (props.upload?.url) {
    config.MENU_CONF!.uploadImage = {
      server: props.upload.url,
      fieldName: props.upload.fieldName || 'file',
      headers: props.upload.headers || {},
      // 上传成功后插入图片
      customInsert(res: any, insertFn: (url: string, alt?: string, href?: string) => void) {
        // 根据后端返回格式调整，默认取 res.data.url
        const url = res?.data?.url || res?.url || '';
        if (url) {
          insertFn(url);
        }
      }
    };

    // 配置视频上传（使用 videoUrl 或默认 url）
    config.MENU_CONF!.uploadVideo = {
      server: props.upload.videoUrl || props.upload.url,
      fieldName: props.upload.fieldName || 'file',
      headers: props.upload.headers || {},
      // 上传成功后插入视频
      customInsert(res: any, insertFn: (url: string, poster?: string) => void) {
        const url = res?.data?.url || res?.url || '';
        if (url) {
          insertFn(url);
        }
      }
    };
  }

  return config;
});

// 暗色主题样式
const darkModeStyle = computed(() => {
  if (!themeStore.darkMode) return {};
  return {
    '--w-e-textarea-bg-color': '#1e1e1e',
    '--w-e-textarea-color': '#d4d4d4',
    '--w-e-toolbar-bg-color': '#252526',
    '--w-e-toolbar-color': '#cccccc',
    '--w-e-toolbar-active-bg-color': '#37373d',
    '--w-e-toolbar-active-color': '#ffffff',
    '--w-e-toolbar-border-color': '#3c3c3c'
  } as Record<string, string>;
});

// 编辑器创建完成
function handleCreated(editor: IDomEditor) {
  editorRef.value = editor;
  isReady.value = true;
}

// 内容变化
function handleChange(editor: IDomEditor) {
  const html = editor.getHtml();
  emit('update:modelValue', html);
  emit('change', html);
}

// 聚焦
function handleFocus(editor: IDomEditor) {
  emit('focus', editor);
}

// 失焦
function handleBlur(editor: IDomEditor) {
  emit('blur', editor);
}

// 监听只读状态
watch(
  () => props.readonly,
  (readonly) => {
    if (editorRef.value) {
      readonly ? editorRef.value.disable() : editorRef.value.enable();
    }
  }
);

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy();
  }
});

// 暴露方法
defineExpose({
  /** 获取编辑器实例 */
  getInstance: () => editorRef.value,
  /** 获取 HTML 内容 */
  getHtml: () => editorRef.value?.getHtml() || '',
  /** 获取纯文本 */
  getText: () => editorRef.value?.getText() || '',
  /** 设置 HTML 内容 */
  setHtml: (html: string) => editorRef.value?.setHtml(html),
  /** 聚焦 */
  focus: () => editorRef.value?.focus(),
  /** 失焦 */
  blur: () => editorRef.value?.blur(),
  /** 清空 */
  clear: () => editorRef.value?.clear()
});
</script>

<template>
  <div class="rich-editor" :style="darkModeStyle">
    <Toolbar
      class="rich-editor-toolbar"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="rich-editor-content"
      :style="{ height: `${editorHeight}px` }"
      :model-value="modelValue"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
      @on-change="handleChange"
      @on-focus="handleFocus"
      @on-blur="handleBlur"
    />
  </div>
</template>

<style scoped>
.rich-editor {
  border: 1px solid var(--w-e-toolbar-border-color, #e8e8e8);
  border-radius: 4px;
  overflow: hidden;
}

.rich-editor-toolbar {
  border-bottom: 1px solid var(--w-e-toolbar-border-color, #e8e8e8);
}

.rich-editor-content {
  overflow-y: auto;
}
</style>
