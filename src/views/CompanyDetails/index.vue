<template>
  <n-spin :spinning="spinning">
    <div class="p-16">
      <div v-if="isWeCom" class="text-18 font-bold text-black mb-8">
        <span>{{ route.query.pushType }}：</span>
        <span>{{ currentSchema?.values?.companyName }}</span>
      </div>
      <n-collapse v-model:activeKey="activeKey" :bordered="false">
        <n-collapse-panel v-for="item in details" :key="item.name" :header="item.name">
          <n-descriptions :labelStyle="{ 'min-width': 'min-content' }" class="px-16">
            <template v-for="opt in item.options">
              <n-descriptions-item :label="opt.label">
                <template v-if="opt?.dataSource?.length">
                  <n-table
                    bordered
                    :dataSource="opt.dataSource"
                    :columns="opt.columns"
                    class="w-full mr-24"
                    :pagination="false"
                  ></n-table>
                </template>
                <template v-else-if="opt.key == 'companyLogo'">
                  <n-empty v-if="!opt?.imgUrl" description="暂无封面" />
                  <n-image :width="200" :src="opt?.imgUrl" v-else />
                </template>
                <template v-else>
                  {{ opt.value }}
                </template>
              </n-descriptions-item>
            </template>
          </n-descriptions>
        </n-collapse-panel>
      </n-collapse>
    </div>
  </n-spin>
</template>

<script lang="ts" setup>
import { requestCommonSetUpGetInfoDialog } from '@/api/common';
import type { SetUpGetInfoScheme } from '@/api/common/model';
import type { CompanyDetailsValues } from '@/api/common/model/uncert';
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
const spinning = ref(false);
const route = useRoute();
const isWeCom = computed(() => route.fullPath?.includes('wecom'));
const details = ref<DetailsGroupRecord[]>([]);
const activeKey = ref<string[]>([]);
const currentSchema = ref<SetUpGetInfoScheme<CompanyDetailsValues>>();

const handleSchema = (schema: SetUpGetInfoScheme<CompanyDetailsValues>) => {
  currentSchema.value = schema;
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
  spinning.value = true;
  requestCommonSetUpGetInfoDialog({
    className: 'CompanyItem',
    thisObj: {
      objId: (route.query.objId as string) || '',
      className: 'CompanyItem',
    },
  })
    .then((res) => {
      handleSchema(res.data.scheme);
    })
    .finally(() => {
      spinning.value = false;
    });
};
getDetailSchema();
</script>

<style scoped lang="less">
.nl-collapse-borderless {
  background: #fafafa;
}
</style>
