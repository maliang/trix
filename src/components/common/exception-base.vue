<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { $t } from '@/locales';

defineOptions({ name: 'ExceptionBase' });

type ExceptionType = '403' | '404' | '500';

interface Props {
  /**
   * 异常类型
   *
   * - 403: 无权限
   * - 404: 未找到
   * - 500: 服务错误
   */
  type: ExceptionType;
}

const props = defineProps<Props>();

const router = useRouter();

/** 使用 iconify 图标替代本地 svg */
const iconMap: Record<ExceptionType, string> = {
  '403': 'flat-color-icons:lock',
  '404': 'flat-color-icons:search',
  '500': 'flat-color-icons:high-priority'
};

const icon = computed(() => iconMap[props.type]);

function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
    <div class="flex text-400px text-primary">
      <SvgIcon :icon="icon" />
    </div>
    <NButton type="primary" @click="goHome">{{ $t('common.backToHome') }}</NButton>
  </div>
</template>

<style scoped></style>
