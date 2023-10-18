<template>
  <div class="p-16">
    <n-collapse v-model:activeKey="activeKey">
      <n-collapse-panel v-for="item in details" :key="item.name" :header="item.name">
        <n-descriptions :labelStyle="{ 'min-width': 'min-content' }" class="p-8">
          <n-descriptions-item v-for="opt in item.options" :label="opt.label">
            <template v-if="opt.key == 'companyLogo'">
              <n-empty v-if="!opt?.imgUrl" description="暂无封面" />
              <n-image :width="200" :src="opt?.imgUrl" v-else />
            </template>
            <template v-else-if="opt?.dataSource?.length">
              <n-table :dataSource="opt.dataSource" :columns="opt.columns" class="w-full mr-24"></n-table>
            </template>
            <template v-else>
              {{ opt.value }}
            </template>
          </n-descriptions-item>
        </n-descriptions>
      </n-collapse-panel>
    </n-collapse>
  </div>
</template>

<script lang="ts" setup>
import { requestCommonSetUpGetInfoDialog } from '@/api/common';
import type { SetUpGetInfoScheme } from '@/api/common/model';
import type { CompanyDetailsValues } from '@/api/common/model/ uncert';
import type { TableColumnProps } from 'n-designv3';

type DetailsItem = {
  key: string;
  label: string;
  value: string;
  imgUrl?: string;
  dataSource?: any[];
  columns?: TableColumnProps[];
};

type DetailsGroupRecord = {
  name: string;
  options: DetailsItem[];
};
const route = useRoute();
const details = ref<DetailsGroupRecord[]>([]);
const activeKey = ref<string[]>([]);

const handleSchema = (schema: SetUpGetInfoScheme<CompanyDetailsValues>) => {
  details.value = [];
  schema.form.forEach((item) => {
    let options = item.children.map((child) => {
      const result: DetailsItem = {
        key: child.field,
        label: child.name,
        value: schema.values[child.field],
      };

      // 处理表格数据
      if (child.field == 'companyAddress') {
        try {
          result.dataSource = JSON.parse(result.value);
          result.columns = child.props.lineAttribute?.map((col) => ({
            title: col.name,
            dataIndex: col.field,
          }));
        } catch (error) {
          console.log(error);
        }
      } else if (child.field == 'companyLogo') {
        try {
          result.imgUrl = JSON.parse(result.value)?.[0]?.url;
        } catch (error) {
          console.log(error);
        }
      }

      return result;
    });

    details.value.push({
      name: item.groupName,
      options,
    });
    activeKey.value.push(item.groupName);
  });
};
const getDetailSchema = () => {
  requestCommonSetUpGetInfoDialog({
    className: 'CompanyItem',
    thisObj: {
      objId: (route.query.objId as string) || '',
      className: 'CompanyItem',
    },
  }).then((res) => {
    handleSchema(res.data.scheme);
  });
};
getDetailSchema();
</script>

<style scoped lang="less"></style>
