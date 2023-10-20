export const getDownloadPath = (fileName: string, data: string) => {
  const blob = new Blob([data]); //处理文档流
  return URL.createObjectURL(blob);
};
export const downloadFileForStr = (fileName: string, data: string) => {
  const blob = new Blob([data]); //处理文档流
  const eLink = document.createElement('a');
  eLink.download = fileName;
  eLink.style.display = 'none';
  eLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eLink);
  eLink.click();
  URL.revokeObjectURL(eLink.href); // 释放URL 对象
  document.body.removeChild(eLink);
};

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
