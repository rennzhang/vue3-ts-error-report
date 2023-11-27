<template>
  <n-empty v-if="!props.details?.imgUrls?.length" description="暂无封面" />
  <template v-else>
    <n-image v-for="src in props.details?.imgUrls" :key="src" :width="props.details?.imgWidth || 200" :src="src" />
  </template>
</template>

<script lang="ts" setup>
import { DetailsItem } from '../types';
const props = defineProps<{
  details?: DetailsItem;
}>();
</script>

<style scoped lang="less"></style>
