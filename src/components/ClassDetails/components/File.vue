<template>
  <n-empty v-if="!fileList?.length" description="暂无文件" :image="simpleImage" />
  <template v-else>
    <div>
      <div v-for="file in fileList" :key="file.uid" class="mb-4px">
        <file-outlined />
        <a target="_blank" class="mx-8px" @click="downloadFileForUrl(file.url, file.name)">
          {{ file.name }}
        </a>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { DetailsItem } from '../types';
import { downloadFileForUrl } from '@/utils';
import { Empty } from 'n-designv3';
import type { DetailsFile } from '@/api/common/model';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const props = defineProps<{
  details?: DetailsItem;
}>();

const fileList = ref<DetailsFile[]>([]);
const initData = () => {
  const { value } = props.details || {};
  try {
    fileList.value = JSON.parse(value || '[]');
  } catch (error) {
    fileList.value = [];
  }
};
initData();
</script>

<style scoped lang="less"></style>
