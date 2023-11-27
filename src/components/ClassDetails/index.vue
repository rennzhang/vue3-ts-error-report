<template>
  <n-spin :spinning="spinning" class="!h-95vh">
    <div class="p-16px">
      <slot name="header" v-bind="{ currentSchema }"></slot>
      <n-collapse v-model:activeKey="activeKey" :bordered="false" class="!bg-white">
        <n-collapse-panel v-for="item in detailsGroup" :key="item.name" :header="item.name">
          <n-descriptions :label-style="{ 'white-space': 'normal' }" class="pt-16px px-12px">
            <template v-for="details in item.options" :key="details.key">
              <n-descriptions-item :label="details.label" :style="{ display: details.fullLine ? 'block' : '' }">
                <component :is="details.component" :details="details" />
              </n-descriptions-item>
            </template>
          </n-descriptions>
        </n-collapse-panel>
      </n-collapse>
      <slot name="footer" v-bind="{ currentSchema }"></slot>
    </div>
  </n-spin>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { useDetails } from './hooks';

const props = defineProps<{
  className?: string;
}>();

const activeKey = ref<string[]>([]);

const { spinning, currentSchema, detailsGroup, queryDetailSchema } = useDetails<T>({ className: props.className });

onMounted(async () => {
  queryDetailSchema();
});
watch(detailsGroup, (val) => {
  if (val.length) {
    activeKey.value = val.map((item) => item.name);
  }
});
</script>

<style scoped lang="less"></style>
