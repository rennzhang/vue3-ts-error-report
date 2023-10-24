<template>
  <div class="h-[100vh] p-8 flex flex-col">
    <div class="flex">
      <n-input-search
        class="w-full mb-6 bg-white mr-4"
        v-model:value="companyName"
        placeholder="输入企业名称搜索"
        @search="getList"
        size="large"
      />
      <n-button type="primary" ghost size="large" @click="reset" :loading="loading">重置</n-button>
    </div>
    <div class="overflow-auto h-full py-6">
      <n-spin :spinning="loading">
        <div class="item" v-for="item in dataList" :key="item.code" @click="viewDetails(item)">
          {{ item.companyName }}
        </div>
        <div class="text-center py-8" v-if="!isAllLoaded">
          <n-button type="primary" ghost size="small" @click="loadMore" :loading="loading">点击加载更多数据</n-button>
        </div>
        <div v-else class="text-slate-300 text-center py-8">已加载全部数据~</div>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { requestCommonQueryAgent, QueryAgentCompanyRecord } from '@/api/common';
const router = useRouter();
const route = useRoute();
const companyName = ref('');
const loading = ref(false);
// 每次下拉增加10条数据
const loadMoreTimes = ref(1);
const dataList = ref<QueryAgentCompanyRecord[]>([]);
const lastTotal = ref(0);
// 是否全部加载完毕
const isAllLoaded = ref(false);
const loadMore = () => {
  loadMoreTimes.value = loadMoreTimes.value + 1;
  getList();
};

const getList = () => {
  loading.value = true;
  if (isAllLoaded.value) {
    loading.value = false;
    return;
  }
  requestCommonQueryAgent<QueryAgentCompanyRecord[]>({
    queryArgs: {
      condition: [
        {
          key: 'companyName',
          value: companyName.value,
          compare: 'LIKE',
        },
      ],
      page: {
        pageNo: 1,
        pageSize: loadMoreTimes.value * 10,
      },
      attrSet: [
        'code',
        'companyName',
        'companyAlias',
        'companyLevel',
        'displayCreator',
        'displayModifier',
        'objId',
        'className',
      ],
    },
    className: 'CompanyItem',
  }).then((res) => {
    loading.value = false;
    dataList.value = res.data.data;

    if (res.data.data.length === lastTotal.value) {
      isAllLoaded.value = true;
    }
    lastTotal.value = Number(res.data.total);
  });
};

const reset = () => {
  companyName.value = '';
  loadMoreTimes.value = 1;
  isAllLoaded.value = false;
  getList();
};

const viewDetails = (item: QueryAgentCompanyRecord) => {
  console.log('item', item);
  router.push({
    path: '/wecom/company-details',
    query: {
      ...route.query,
      objId: item.objId,
      pushType: '详情查看',
    },
  });
};
getList();
</script>

<style scoped>
.item {
  /* color: #447dfd; */
  /* border-radius: 4px; */
  /* padding: 10px 0;
  border-bottom: 1px solid #ccc; */
  padding: 10px 8px;
  /* border-bottom: 1px solid #ccc; */
  margin: 10px 4px;
  box-shadow: 1px 2px 5px 1px rgba(0, 0, 0, 0.1);
}
</style>
