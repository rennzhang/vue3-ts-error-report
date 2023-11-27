<template>
  <div>
    {{ displayText }}
  </div>
</template>

<script lang="ts" setup>
import { DetailsItem } from '../types';
import { useDetailsStore } from '../store';

const props = defineProps<{
  details?: DetailsItem;
}>();

const store = useDetailsStore();
const displayText = computed(() => {
  const { key = '', value = '' } = props.details || {};
  return store.getLovLabel(key, value) || value;
});
</script>

<style scoped lang="less"></style>
