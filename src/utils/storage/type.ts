import { StorageKeys as _StorageKeys } from '@/enums/storage';

export type _CookieKeys = '';

type StorageKeys = Extract<keyof typeof _StorageKeys, string>;

type CookieKeys = string;

export enum _StorageKeys11 {
  token = 'dnt_mc_access_token',
  tenantId = 'dnt_mc_tenantId',
  userInfo = 'dnt_mc_userInfo',
}
export enum StorageTypes {
  sessionStorage = 'sessionStorage',
  localStorage = 'localStorage',
  cookie = 'cookie',
}
export enum CategoryTypes {
  session = 'session',
  local = 'local',
  cookie = 'cookie',
}
export type CategoryType = keyof typeof CategoryTypes;
export type StorageType = keyof typeof StorageTypes;

export interface DocCookies {
  getItem: (sKey: CookieKeys) => any;
  setItem: (sKey: CookieKeys, sValue: any, vEnd?: any, sPath?: any, sDomain?: any, bSecure?: any) => Boolean;
  removeItem: (sKey: CookieKeys, sPath?: any, sDomain?: any) => Boolean;
  hasItem: (sKey: CookieKeys | string) => Boolean;
  keys: () => any[];
}

export interface DefaultManager {
  set: (key: StorageKeys, value: any, category?: CategoryType, expired?: any) => void;
  get: (key: StorageKeys, category?: CategoryType) => any;
  clear: (category?: CategoryType) => void;
  remove: (key: StorageKeys, category?: CategoryType) => void;
  _map: (category: CategoryType) => any;
}

export interface StorageManager {
  set: (key: StorageKeys, value: any, storage?: StorageType) => void;
  get: (key: StorageKeys, storage?: StorageType) => any;
  clear: (storage?: StorageType) => void;
  remove: (key: StorageKeys, storage?: StorageType) => void;
}

export interface CookieManager {
  set: (key: CookieKeys, value: any, expired: any) => void;
  get: (key: CookieKeys) => any;
  clear: () => any;
  remove: (key: CookieKeys) => any;
}
