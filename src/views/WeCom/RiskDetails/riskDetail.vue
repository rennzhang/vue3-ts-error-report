<template>
  <div class="risk-detail-container">
    <div class="title">
      <p>风险控制:华为技术有限公司</p>
    </div>
    <n-descriptions>
      <n-descriptions-item v-for="(item, index) in listData" :label="item.name" :labelStyle="labelStyle">{{
        item.value
      }}</n-descriptions-item>
      <n-descriptions-item label="列入日期">2023/2/28</n-descriptions-item>
      >
    </n-descriptions>
  </div>
</template>

<script lang="ts" setup>
interface ListItem {
  // 定义列表项的属性
  value: string;
  name: string;
  key: string;
  // 其他属性...
}
import { requestCommonSetUpGetInfoDialog } from '@/api/common/index';
const listData = ref<Array<ListItem>>([]);
const labelStyle: object = {
  'white-space': 'normal',
};
type renderList = {
  value: string;
  name: string;
  key: string;
};
const getRiskDetail = () => {
  requestCommonSetUpGetInfoDialog({
    className: 'CompanyRiskWarning',
    thisObj: {
      objId: '1714570235433975808',
      className: 'CompanyRiskWarning',
    },
  }).then((res) => {
    const values = res.data.scheme.values;
    const form = res.data.scheme.form[0].children;
    const renderList: Array<renderList> = [];
    form.map((item, index) => {
      if (values.hasOwnProperty(item.field)) {
        renderList.push({
          name: item.name,
          value: values[item.field],
          key: item.field,
        });
      }
    });
    listData.value = renderList;
  });
};
getRiskDetail();
interface UrlParams {
  [key: string]: string;
}
//取url里的参数，返回一个对象
const getParams = (): UrlParams => {
  // const url: string = window.location.href;
  const url: string = 'https://www.baidu.com/?token=5ytimbcdzbwg&name=华为技术有限公司';
  const obj: UrlParams = {};

  if (url.lastIndexOf('?') === -1 || url.lastIndexOf('?') === url.length - 1) {
    return obj;
  }

  const search: string = url.substring(url.lastIndexOf('?') + 1);
  const params: string[] = search.split('&');

  for (let i = 0; i < params.length; i++) {
    const pair: string[] = params[i].split('=');
    obj[pair[0]] = pair[1];
  }

  return obj;
};
const params = getParams();
</script>

<style lang="less" scoped>
.risk-detail-container {
  .title {
    p {
      font-size: 18px;
      color: #000;
      font-weight: 600;
      text-align: center;
      margin-top: 3%;
    }
  }
  .nl-descriptions {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
