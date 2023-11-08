<template>
  <ClassDetails :className="props.className" :class="isWeCom">
    <template #header="{ currentSchema }">
      <div v-if="isWeCom" class="text-18px font-bold text-black mb-8px">
        <span>{{ route.query.pushType }}：</span>
        <span>{{ currentSchema?.values?.companyName }}</span>
      </div>
    </template>
  </ClassDetails>
</template>

<script lang="ts" setup>
import Comp from '@/components/ClassDetails/index.vue';
import type { CompanyDetailsValues } from '@/api/common/model';

const ClassDetails = Comp<CompanyDetailsValues>;

const props = defineProps<{
  className?: string;
}>();

const route = useRoute();
const isWeCom = computed(() => route.fullPath?.includes('wecom'));
</script>

<style scoped lang="less">
.isWeCom {
  .nl-collapse-borderless {
    background: #fafafa;
  }
}
</style>
