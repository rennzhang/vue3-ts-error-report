import { cloneDeep, keys, omit } from 'lodash-es';
// import { matchReg } from '@/utils';
interface HistoryRecord {
  [key: string]: any;
}
export const useTable = (selectData: HistoryRecord[], labelData) => {
  if (selectData.length < 2) {
    return selectData;
  }

  let cloneSelectData = cloneDeep(selectData);
  cloneSelectData = cloneSelectData.map((item) => {
    let newItem = {};
    Object.keys(labelData).forEach((key) => {
      if (item[labelData[key].key]) {
        newItem['sequence'] = item.sequence;
        newItem[labelData[key].key] = item[labelData[key].key];
      }
    });
    return newItem;
  });
  cloneSelectData = filterCommonKey(cloneSelectData);
  console.log(cloneSelectData, 'cloneSelectData');
  //获取表头
  const generateColumn = () => {
    let columns = [
      {
        title: '版本',
        dataIndex: 'compareItem',
        key: 'compareItem',
        fixed: true,
      },
    ];
    cloneSelectData.forEach((item) => {
      columns.push({
        title: item.sequence,
        dataIndex: `sequence_${item.sequence}`,
        key: 'sequence',
        fixed: false,
      });
    });
    return columns;
  };
  const generateDataSource = () => {
    let keyNameItems = {};
    let keyNames = [];
    Object.keys(labelData).forEach((index) => {
      if (cloneSelectData[0].hasOwnProperty(labelData[index].key)) {
        keyNameItems = {
          name: labelData[index].label,
          code: labelData[index].key,
          value: labelData[index],
        };
        keyNames.push(keyNameItems);
      }
    });
    const dataSource = keyNames.map((item) => {
      let newItem: {
        compareItem: any;
        [key: string]: any;
      } = {
        compareItem: item.name,
      };
      const component = cloneDeep(item.value);
      cloneSelectData.forEach((ite: any) => {
        Object.keys(ite).forEach((key) => {
          if (item.code === key) {
            component.value = (ite as any)[item.code];
            newItem[`sequence_${ite.sequence}`] = component;
          }
        });
      });
      return newItem;
    });

    return dataSource;
  };
  const columns = generateColumn();
  const dataSource = generateDataSource();
  console.log(dataSource, 'dataSource');
  return {
    column: columns,
    dataSource: dataSource,
  };
};
const filterCommonKey = (data: any) => {
  /*
    1. 筛选出值一样的key，并且过滤掉
    data：历史列表选中的值
 */
  const commonKeys: Record<string, any> = {};
  // 遍历第一个对象的所有键
  Object.keys(data[0]).forEach((key) => {
    // 检查所有对象中该键的值是否相同
    if (data.every((obj: any) => obj[key] === data[0][key])) {
      // 如果相同，将该键加入结果对象中
      commonKeys[key] = data[0][key];
    }
  });
  // 找到值一样的key，进行过滤
  const newData = data.map((item: any) => {
    const newItem = omit(item, Object.keys(commonKeys));
    return newItem;
  });
  //去除无用字段
  return newData;
};
