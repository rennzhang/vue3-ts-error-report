import { cloneDeep, omit } from 'lodash-es';
// import { matchReg } from '@/utils';
export const useTable = () => {};
const filterCommonKey = (data: any) => {
  const commonKeys: Record<string, any> = {};
  Object.keys(data[0]).forEach((key) => {
    if (data.every((obj: any) => obj[key] === data[0][key])) {
      commonKeys[key] = data[0][key];
    }
  });
  return data.map((item) => omit(item, Object.keys(commonKeys)));
};
