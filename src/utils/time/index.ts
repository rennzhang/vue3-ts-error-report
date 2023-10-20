import 'dayjs/locale/zh-cn';
import dayjs, { Dayjs } from 'dayjs';
dayjs.locale('zh-cn');

export const formatSecond = (value: number) => {
  let theTime = value; // 秒
  let middle = 0; // 分
  let hour = 0; // 小时

  if (theTime >= 60) {
    middle = Math.floor(theTime / 60);
    theTime = theTime % 60;
    if (middle >= 60) {
      hour = Math.floor(middle / 60);
      middle = middle % 60;
    }
  }
  let result = '' + theTime + '秒';
  if (middle > 0) {
    result = '' + middle + '分' + result;
  }
  if (hour > 0) {
    result = '' + hour + '小时' + result;
  }
  return result;
};

// 查询今天(value==0)、昨天(value==-1)、明天(value==1)，value以此类推
export const getDate = <V extends number = 0, F extends string = 'endOf'>(
  value?: V,
  format?: F
): F extends null ? Dayjs : string => {
  let result: Dayjs | string = '';
  result = dayjs(+dayjs() + 86400000 * (value || 0));
  if (format === null) return result as any;
  // @ts-ignore
  return dayjs(result)[format || 'endOf']('day');
};

// 获取一个时间段传入参数为天数,常用的昨天(value==-1)，最近7天(value==-7)，最近30天(value==-30)
export const quickPeriod = (value = 0) => {
  let end;
  let start;
  if ([0, -1, 1].includes(value)) {
    start = getDate(value, 'startOf');

    end = getDate(value, 'endOf');
  } else {
    start = dayjs(+dayjs() + 86400000 * (value - 1)).startOf('day');
    end = dayjs().endOf('day');
  }
  return [start, end];
};

/** @description 转换时间格式为 1小时7分钟38秒 */
export const formatCostTimeText = (sTime: string | number): string => {
  if (!sTime || Number(sTime) <= 0) return '0秒';
  if (Number(sTime) < 1) return `${parseFloat(String(Number(sTime) * 1000)).toFixed(0)}毫秒`;
  const time = Number(sTime) / 1;
  const hour = Math.floor(time / 60 / 60) || 0;
  const minute = Math.floor(time / 60) % 60 || 0;
  const second = Math.floor(time) % 60 || 0;
  return `${hour > 0 ? hour + '小时' : ''}${minute}分钟${second}秒`;
};

/** @description 格式化时间戳 */
export const formatTime = (value?: string, format?: string) => {
  const t = value ? dayjs(value) : dayjs();
  return t.format(format || 'YYYY-MM-DD HH:mm:ss');
};
