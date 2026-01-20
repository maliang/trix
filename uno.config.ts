import { defineConfig } from '@unocss/vite';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import presetWind3 from '@unocss/preset-wind3';
import type { Theme } from '@unocss/preset-uno';
import { presetSoybeanAdmin } from '@trix/uno-preset';
import { themeVars } from './src/styles/vars';

/**
 * UnoCSS Safelist 配置
 * 用于预定义 JSON Schema 中可能使用的 Tailwind/UnoCSS 类名
 * 确保动态类名能够被正确生成
 */
const safelist = [
  // ==================== 布局 ====================
  // Flexbox
  'flex', 'flex-col', 'flex-row', 'flex-wrap', 'flex-nowrap', 'flex-1', 'flex-auto', 'flex-none',
  'items-center', 'items-start', 'items-end', 'items-baseline', 'items-stretch',
  'justify-center', 'justify-start', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly',
  'self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch',
  // Grid
  'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6',
  'grid-cols-7', 'grid-cols-8', 'grid-cols-9', 'grid-cols-10', 'grid-cols-11', 'grid-cols-12',
  'grid-rows-1', 'grid-rows-2', 'grid-rows-3', 'grid-rows-4', 'grid-rows-5', 'grid-rows-6',
  'col-span-1', 'col-span-2', 'col-span-3', 'col-span-4', 'col-span-5', 'col-span-6',
  'col-span-7', 'col-span-8', 'col-span-9', 'col-span-10', 'col-span-11', 'col-span-12', 'col-span-full',
  'row-span-1', 'row-span-2', 'row-span-3', 'row-span-4', 'row-span-5', 'row-span-6', 'row-span-full',
  // Gap
  'gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10', 'gap-12',
  'gap-x-0', 'gap-x-1', 'gap-x-2', 'gap-x-3', 'gap-x-4', 'gap-x-5', 'gap-x-6', 'gap-x-8',
  'gap-y-0', 'gap-y-1', 'gap-y-2', 'gap-y-3', 'gap-y-4', 'gap-y-5', 'gap-y-6', 'gap-y-8',

  // ==================== 间距 ====================
  ...['p', 'm', 'px', 'py', 'mx', 'my', 'pt', 'pb', 'pl', 'pr', 'mt', 'mb', 'ml', 'mr'].flatMap(
    prefix => [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32].map(n => `${prefix}-${n}`)
  ),
  // 负间距
  ...['m', 'mx', 'my', 'mt', 'mb', 'ml', 'mr'].flatMap(
    prefix => [1, 2, 3, 4, 5, 6, 8].map(n => `-${prefix}-${n}`)
  ),

  // ==================== 宽高 ====================
  'w-full', 'w-auto', 'w-screen', 'w-min', 'w-max', 'w-fit',
  'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-2/4', 'w-3/4',
  'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5',
  'w-1/6', 'w-5/6',
  ...Array.from({ length: 100 }, (_, i) => `w-${i + 1}`),
  'h-full', 'h-auto', 'h-screen', 'h-min', 'h-max', 'h-fit',
  'h-1/2', 'h-1/3', 'h-2/3', 'h-1/4', 'h-2/4', 'h-3/4',
  ...Array.from({ length: 100 }, (_, i) => `h-${i + 1}`),
  'min-w-0', 'min-w-full', 'min-w-min', 'min-w-max', 'min-w-fit',
  'max-w-none', 'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl',
  'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full',
  'min-h-0', 'min-h-full', 'min-h-screen', 'min-h-min', 'min-h-max', 'min-h-fit',
  'max-h-none', 'max-h-full', 'max-h-screen', 'max-h-min', 'max-h-max', 'max-h-fit',

  // ==================== 文字 ====================
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl',
  'font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium',
  'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
  'text-left', 'text-center', 'text-right', 'text-justify',
  'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',
  'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',
  'whitespace-normal', 'whitespace-nowrap', 'whitespace-pre', 'whitespace-pre-line', 'whitespace-pre-wrap',
  'break-normal', 'break-words', 'break-all', 'truncate',
  'underline', 'line-through', 'no-underline',
  'uppercase', 'lowercase', 'capitalize', 'normal-case',
  // 文字颜色
  'text-primary', 'text-success', 'text-warning', 'text-error', 'text-info',
  'text-white', 'text-black', 'text-transparent',
  ...['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'].flatMap(
    color => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(n => `text-${color}-${n}`)
  ),

  // ==================== 背景 ====================
  'bg-primary', 'bg-success', 'bg-warning', 'bg-error', 'bg-info',
  'bg-white', 'bg-black', 'bg-transparent',
  ...['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'].flatMap(
    color => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(n => `bg-${color}-${n}`)
  ),
  'bg-opacity-0', 'bg-opacity-25', 'bg-opacity-50', 'bg-opacity-75', 'bg-opacity-100',

  // ==================== 边框 ====================
  'border', 'border-0', 'border-1', 'border-2', 'border-4', 'border-8',
  'border-t', 'border-r', 'border-b', 'border-l',
  'border-t-0', 'border-r-0', 'border-b-0', 'border-l-0',
  'border-t-2', 'border-r-2', 'border-b-2', 'border-l-2',
  'border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-none',
  'border-primary', 'border-success', 'border-warning', 'border-error', 'border-info',
  'border-white', 'border-black', 'border-transparent',
  ...['gray', 'red', 'blue', 'green'].flatMap(
    color => [100, 200, 300, 400, 500].map(n => `border-${color}-${n}`)
  ),
  // 圆角
  'rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
  'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l',
  'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl',
  'rounded-t-none', 'rounded-r-none', 'rounded-b-none', 'rounded-l-none',
  'rounded-t-lg', 'rounded-r-lg', 'rounded-b-lg', 'rounded-l-lg',

  // ==================== 阴影 ====================
  'shadow-none', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner',

  // ==================== 显示 ====================
  'hidden', 'block', 'inline', 'inline-block', 'inline-flex', 'inline-grid',
  'visible', 'invisible',
  'opacity-0', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100',

  // ==================== 定位 ====================
  'relative', 'absolute', 'fixed', 'sticky', 'static',
  'inset-0', 'inset-auto', 'inset-x-0', 'inset-y-0',
  'top-0', 'top-1', 'top-2', 'top-4', 'top-auto', 'top-full', 'top-1/2',
  'right-0', 'right-1', 'right-2', 'right-4', 'right-auto', 'right-full', 'right-1/2',
  'bottom-0', 'bottom-1', 'bottom-2', 'bottom-4', 'bottom-auto', 'bottom-full', 'bottom-1/2',
  'left-0', 'left-1', 'left-2', 'left-4', 'left-auto', 'left-full', 'left-1/2',
  '-top-1', '-top-2', '-right-1', '-right-2', '-bottom-1', '-bottom-2', '-left-1', '-left-2',
  'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50', 'z-auto',

  // ==================== 溢出 ====================
  'overflow-auto', 'overflow-hidden', 'overflow-visible', 'overflow-scroll',
  'overflow-x-auto', 'overflow-x-hidden', 'overflow-x-visible', 'overflow-x-scroll',
  'overflow-y-auto', 'overflow-y-hidden', 'overflow-y-visible', 'overflow-y-scroll',

  // ==================== 动画与过渡 ====================
  'transition', 'transition-none', 'transition-all', 'transition-colors', 'transition-opacity', 'transition-shadow', 'transition-transform',
  'duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000',
  'ease-linear', 'ease-in', 'ease-out', 'ease-in-out',
  'delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-500',
  'animate-none', 'animate-spin', 'animate-ping', 'animate-pulse', 'animate-bounce',

  // ==================== 变换 ====================
  'transform', 'transform-none',
  'scale-0', 'scale-50', 'scale-75', 'scale-90', 'scale-95', 'scale-100', 'scale-105', 'scale-110', 'scale-125', 'scale-150',
  'rotate-0', 'rotate-45', 'rotate-90', 'rotate-180', '-rotate-45', '-rotate-90', '-rotate-180',
  'translate-x-0', 'translate-x-1', 'translate-x-2', 'translate-x-4', 'translate-x-full', '-translate-x-full',
  'translate-y-0', 'translate-y-1', 'translate-y-2', 'translate-y-4', 'translate-y-full', '-translate-y-full',
  'origin-center', 'origin-top', 'origin-top-right', 'origin-right', 'origin-bottom-right',
  'origin-bottom', 'origin-bottom-left', 'origin-left', 'origin-top-left',

  // ==================== 光标 ====================
  'cursor-auto', 'cursor-default', 'cursor-pointer', 'cursor-wait', 'cursor-text',
  'cursor-move', 'cursor-not-allowed', 'cursor-grab', 'cursor-grabbing',

  // ==================== 用户选择 ====================
  'select-none', 'select-text', 'select-all', 'select-auto',

  // ==================== 指针事件 ====================
  'pointer-events-none', 'pointer-events-auto',

  // ==================== 滚动行为 ====================
  'scroll-auto', 'scroll-smooth',
  'snap-start', 'snap-end', 'snap-center', 'snap-align-none',
  'snap-normal', 'snap-always',
  'snap-none', 'snap-x', 'snap-y', 'snap-both', 'snap-mandatory', 'snap-proximity',

  // ==================== 列表 ====================
  'list-none', 'list-disc', 'list-decimal',
  'list-inside', 'list-outside',

  // ==================== 表格 ====================
  'table-auto', 'table-fixed',
  'border-collapse', 'border-separate',

  // ==================== 响应式前缀（常用断点） ====================
  // sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
  ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(bp => [
    `${bp}:flex`, `${bp}:hidden`, `${bp}:block`, `${bp}:inline-flex`,
    `${bp}:flex-row`, `${bp}:flex-col`,
    `${bp}:grid-cols-1`, `${bp}:grid-cols-2`, `${bp}:grid-cols-3`, `${bp}:grid-cols-4`, `${bp}:grid-cols-6`, `${bp}:grid-cols-12`,
    `${bp}:w-full`, `${bp}:w-auto`, `${bp}:w-1/2`, `${bp}:w-1/3`, `${bp}:w-1/4`,
    `${bp}:text-left`, `${bp}:text-center`, `${bp}:text-right`,
    `${bp}:p-4`, `${bp}:p-6`, `${bp}:p-8`,
    `${bp}:gap-4`, `${bp}:gap-6`, `${bp}:gap-8`,
  ]),

  // ==================== 深色模式 ====================
  ...['dark'].flatMap(mode => [
    `${mode}:bg-gray-800`, `${mode}:bg-gray-900`, `${mode}:bg-black`,
    `${mode}:text-white`, `${mode}:text-gray-100`, `${mode}:text-gray-200`, `${mode}:text-gray-300`,
    `${mode}:border-gray-600`, `${mode}:border-gray-700`,
  ]),

  // ==================== 悬停状态 ====================
  'hover:bg-primary', 'hover:bg-gray-100', 'hover:bg-gray-200',
  'hover:text-primary', 'hover:text-white',
  'hover:border-primary',
  'hover:shadow-md', 'hover:shadow-lg',
  'hover:opacity-80', 'hover:opacity-100',
  'hover:scale-105', 'hover:scale-110',

  // ==================== 焦点状态 ====================
  'focus:outline-none', 'focus:ring', 'focus:ring-2', 'focus:ring-primary',
  'focus:border-primary',

  // ==================== 激活状态 ====================
  'active:bg-primary', 'active:scale-95',

  // ==================== 禁用状态 ====================
  'disabled:opacity-50', 'disabled:cursor-not-allowed',
];

export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
      include: [
        /\.(vue|ts|tsx|js|jsx)$/,
        /\.json$/, // 扫描 JSON 文件中的类名
      ],
    },
    // 额外扫描的文件系统路径（用于 mock 目录等）
    filesystem: [
      'src/**/*.json',
      'mock/**/*.json',
      'public/mock/**/*.json',
    ],
  },
  safelist,
  theme: {
    ...themeVars,
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      icon: '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem'
    }
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm'
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [presetWind3({ dark: 'class' }), presetSoybeanAdmin()]
});
