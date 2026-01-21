<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { post } from '@/service/request';

defineOptions({
  name: 'LangSwitch'
});

interface Props {
  /** 当前语言（可选，默认从 store 获取） */
  lang?: App.I18n.LangType;
  /** 语言选项（可选，默认从 store 获取） */
  langOptions?: App.I18n.LangOption[];
  /** 默认语言 */
  defaultLang?: App.I18n.LangType;
  /** 切换语言时提交的 API 地址，为空则不提交 */
  submitUrl?: string;
  /** 显示提示 */
  showTooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lang: undefined,
  langOptions: undefined,
  defaultLang: undefined,
  submitUrl: '',
  showTooltip: true
});

type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void;
};

const emit = defineEmits<Emits>();

const appStore = useAppStore();

/** 当前语言 */
const currentLang = computed(() => props.lang ?? appStore.locale);

/** 语言选项 */
const currentLangOptions = computed(() => props.langOptions ?? appStore.localeOptions);

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.lang');
});

/** 为除最后一个选项外的所有选项添加底部边距，以实现适当的视觉分隔 */
const dropdownOptions = computed(() => {
  const options = currentLangOptions.value;
  if (!options || options.length === 0) return [];
  
  const lastIndex = options.length - 1;

  return options.map((option, index) => ({
    ...option,
    props: {
      class: index < lastIndex ? 'mb-1' : undefined
    }
  }));
});

/**
 * 向服务器提交语言切换请求
 */
async function submitLangChange(lang: App.I18n.LangType) {
  if (!props.submitUrl) return;

  // 使用系统标准请求
  const { error } = await post(props.submitUrl, { lang }, {
    showErrorMessage: false
  });

  if (error) {
    console.error('[LangSwitch] 提交语言切换请求失败:', error.message);
  }
}

async function changeLang(lang: App.I18n.LangType) {
  // 提交到服务器
  await submitLangChange(lang);
  
  // 触发事件
  emit('changeLang', lang);
  
  // 更新 store
  appStore.changeLocale(lang);
}

// 初始化默认语言
onMounted(() => {
  if (props.defaultLang && props.defaultLang !== appStore.locale) {
    appStore.changeLocale(props.defaultLang);
  }
});
</script>

<template>
  <NDropdown :value="currentLang" :options="dropdownOptions" trigger="hover" @select="changeLang">
    <div>
      <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
        <SvgIcon icon="heroicons:language" />
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
