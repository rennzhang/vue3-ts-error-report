<template>
  <div class="h-[100vh] p-8px flex flex-col">
    <div class="flex">
      <n-input
        v-model:value="companyName"
        class="w-full mb-6px bg-white mr-4px"
        placeholder="输入企业名称搜索"
        allow-clear
        size="large"
        @change="onChange"
        @pressEnter="onSearch"
      />

      <n-button class="min-w-min !px-4px" size="large" :loading="loading" @click="onSearch">
        <template #icon><SearchOutlined /></template>
      </n-button>
      <!-- <n-button type="primary" ghost size="large" @click="reset" :loading="loading">重置</n-button> -->
    </div>
    <div class="overflow-auto h-full py-6px">
      <n-spin :spinning="loading">
        <div v-for="item in dataList" :key="item.code" class="item" @click="viewDetails(item)">
          {{ item.name }}
        </div>
        <div v-if="!isAllLoaded" class="text-center py-8px">
          <n-button v-if="!loading" type="primary" ghost size="small" @click="loadMore">点击加载更多数据</n-button>
        </div>
        <div v-else class="text-slate-300 text-center py-8px">
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
          key: 'name',
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
        'name',
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

// const reset = () => {
//   companyName.value = '';
//   loadMoreTimes.value = 1;
//   isAllLoaded.value = false;
//   getList();
// };

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
