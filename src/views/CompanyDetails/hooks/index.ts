import { Modal } from 'n-designv3';
interface DataItem {
  key: number;
  companyName: string;
  address: string;
  children?: DataItem[];
}
export const useTable = () => {
  const columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '30%',
    },
  ];

  const tableData = ref<DataItem[]>([]);

  const getList = () => {
    setTimeout(() => {
      tableData.value = [
        {
          key: 1,
          companyName: '能科',
          address: 'New York No. 1 Lake Park',
          children: [
            {
              key: 11,
              companyName: '瑞元',
              address: 'New York No. 1 Lake Park',
            },
            {
              key: 12,
              companyName: '能科子公司1',
              address: 'New York No. 1 Lake Park',
            },
          ],
        },
        {
          key: 2,
          companyName: '北京银行',
          address: 'New York No. 1 Lake Park',
          children: [
            {
              key: 21,
              companyName: '北京银行科技',
              address: 'New York No. 1 Lake Park',
            },
            {
              key: 22,
              companyName: '北京银行分公司1',
              address: 'New York No. 1 Lake Park',
            },
          ],
        },
      ];
    }, 1500);
  };

  getList();
  return {
    columns,
    tableData,
    getList,
  };
};

export const useOperation = () => {
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: '提示',
      content: '确定 删除 选中数据吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return {
    showDeleteConfirm,
  };
};
