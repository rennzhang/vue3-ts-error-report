<template>
  <n-empty v-if="!imgUrls?.length" description="暂无封面" />
  <template v-else>
    <n-image v-for="src in imgUrls" :key="src" :width="props.details?.imgWidth || 200" :src="src" />
  </template>
</template>

<script lang="ts" setup>
import { DetailsItem } from '../types';
import { matchReg } from '@/utils';

const props = defineProps<{
  details?: DetailsItem;
}>();

const imgUrls = ref<string[]>([]);

const initData = () => {
  const { value } = props.details || {};
  imgUrls.value = matchReg(value, 'imgUrl');
};

initData();
</script>

<style scoped lang="less"></style>
