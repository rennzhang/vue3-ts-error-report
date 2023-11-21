import { requestCommonGetHistoryList, type HistoryRecord } from '@/api/common/index';

export const useTable = () => {
  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '版本记录',
      dataIndex: 'sequence',
      key: 'sequence',
    },
    {
      title: '修改人',
      dataIndex: 'displayModifier',
      key: 'displayModifier',
    },
    {
      title: '修改时间',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: '20%',
    },
  ];
  const tableData = ref<HistoryRecord[]>([]);
  const getList = async () => {
    const objId = window.$wujie?.props.params.record.objId;
    const className = window.$wujie?.props.params.record.className;
    //'1704055851523801088'  ---'1714929505862160384, ---1714929505862160384--1'
    const data = await requestCommonGetHistoryList({
      className: className || 'ActivityItem',
      thisObj: {
        objId: objId,
      },
    });
    tableData.value = data.data;
  };
  getList();
  return {
    columns,
    dataSource: tableData,
  };
};
