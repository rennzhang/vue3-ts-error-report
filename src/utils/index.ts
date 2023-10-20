export * from './shared/index';
export * from './is';

interface UrlParams {
  [key: string]: string;
}
//取url里的参数，返回一个对象
export const getUrlParams = (): UrlParams => {
  const url: string = window.location.href;
  // const url: string = 'https://www.baidu.com/?token=5ytimbcdzbwg&name=华为技术有限公司';
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
