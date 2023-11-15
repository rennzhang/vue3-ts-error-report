import { getGroupTree, type GroupCompanyRecord } from '@/api/CompanyItem';

export const useTable = () => {
  console.log('window?.$wujie?.props', window?.$wujie?.props);
  const { params } = window?.$wujie?.props || {};

  const loading = ref(false);
  const columns = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '30%',
    },
  ];

  const tableData = ref<GroupCompanyRecord[]>([]);

  const getList = async () => {
    loading.value = true;
    const { record } = params || {};
    await getGroupTree({
      className: 'CompanyItemRelation',
      thisObj: {
        companyCode: record.code,
      },
    })
      .then((res) => {
        tableData.value = res.data;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  getList();
  return {
    loading,
    columns,
    tableData,
    getList,
  };
};
