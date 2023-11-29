import { cloneDeep, omit } from 'lodash-es';
export const useTable = (selectData, labelData) => {
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
    let keyNames: Array<{ name: string; code: string; value: any }> = [];
    Object.keys(labelData).forEach((index) => {
      if (cloneSelectData[0].hasOwnProperty(labelData[index].key)) {
        const keyNameItems = {
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

      cloneSelectData.forEach((ite: any) => {
        Object.keys(ite).forEach((key) => {
          if (item.code === key) {
            const component = cloneDeep(item.value);
            component.value = (ite as any)[item.code];
            newItem[`sequence_${ite.sequence}`] = markRaw(component);
          }
        });
      });
      return newItem;
    });
    return dataSource;
  };
  const columns = generateColumn();
  const dataSource = generateDataSource();
  return {
    column: columns,
    dataSource: dataSource,
  };
};
const filterCommonKey = (data: any) => {
  /*筛选出值一样的key，并且过滤掉*/
  const commonKeys: Record<string, any> = {};
  Object.keys(data[0]).forEach((key) => {
    if (data.every((obj: any) => obj[key] === data[0][key])) {
      commonKeys[key] = data[0][key];
    }
  });
  // 找到值一样的key，进行过滤
  const newData = data.map((item: any) => {
    const newItem = omit(item, Object.keys(commonKeys));
    return newItem;
  });
  return newData;
};
