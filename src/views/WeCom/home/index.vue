<template>
  <div class="h-[100vh] p-8 flex flex-col">
    <div class="flex">
      <n-input
        class="w-full mb-6 bg-white mr-4"
        v-model:value="companyName"
        placeholder="输入企业名称搜索"
        @change="onChange"
        @pressEnter="onSearch"
        allowClear
        size="large"
      />

      <n-button class="min-w-min !px-4" size="large" @click="onSearch" :loading="loading">
        <template #icon><SearchOutlined /></template>
      </n-button>
      <!-- <n-button type="primary" ghost size="large" @click="reset" :loading="loading">重置</n-button> -->
    </div>
    <div class="overflow-auto h-full py-6">
      <n-spin :spinning="loading">
        <div class="item" v-for="item in dataList" :key="item.code" @click="viewDetails(item)">
          {{ item.companyName }}
        </div>
        <div class="text-center py-8" v-if="!isAllLoaded">
          <n-button type="primary" ghost size="small" @click="loadMore" v-if="!loading">点击加载更多数据</n-button>
        </div>
        <div v-else class="text-slate-300 text-center py-8">
          {{ dataList.length ? '已加载全部数据~' : '暂无数据~' }}
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QueryAgentCompanyRecord, requestCommonQueryAgent } from '@/api/common';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();

const companyName = ref('');

const loading = ref(false);
// 每次下拉增加10条数据
const loadMoreTimes = ref(1);
const dataList = ref<QueryAgentCompanyRecord[]>([]);
// 是否全部加载完毕
const isAllLoaded = ref(false);

const loadMore = () => {
  loadMoreTimes.value = loadMoreTimes.value + 1;
  getList();
};

const onChange = () => {
  loadMoreTimes.value = 1;
  // 清除时重新加载列表
  if (!companyName.value) {
    getList();
  }
};

const onSearch = () => {
  if (!companyName.value) {
    isAllLoaded.value = false;
    dataList.value = [];
  }
  getList();
};

const getList = () => {
  loading.value = true;
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

    isAllLoaded.value = res.data.data.length === +res.data.total;
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
