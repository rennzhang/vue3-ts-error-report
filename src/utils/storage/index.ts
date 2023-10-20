/* eslint-disable no-useless-backreference */
/* eslint-disable no-useless-escape */
/*
 * Copyright 2019 WeBank
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/* \
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\ */
import { StorageTypes, DocCookies, DefaultManager, StorageManager, CookieManager } from './type';

const isProd = process.env.NODE_ENV === 'production';

const SESSION = 'session';

const LOCAL = 'local';

const COOKIE = 'cookie';

const DEFAULT_CATEGORY = LOCAL;

const docCookies: DocCookies = {
  getItem(sKey) {
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null
    );
  },
  setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    let sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
          break;
        case String:
          sExpires = '; expires=' + vEnd;
          break;
        case Date:
          sExpires = '; expires=' + vEnd.toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (bSecure ? '; secure' : '');
    return true;
  },
  removeItem(sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '');
    return true;
  },
  hasItem(sKey) {
    return new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=').test(
      document.cookie
    );
  },
  keys: /* optional method: you can safely remove it! */ function () {
    const aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },
};

/**
 * 操作cookie、sessionStorage、localStorage、缓存
 */

export const storageManager: StorageManager = {
  set(key, value, storage = StorageTypes.localStorage) {
    try {
      (window as any)[storage].setItem(key, JSON.stringify(value));
    } catch (e) {
      !isProd && console.error(e);
    }
  },
  get(key, storage = StorageTypes.localStorage) {
    try {
      if ((window as any)[storage].getItem(key)) {
        return JSON.parse((window as any)[storage].getItem(key));
      }
      return (window as any)[storage].getItem(key);
    } catch (e) {
      !isProd && console.error(e, key);
    }
  },
  clear(storage = StorageTypes.localStorage) {
    (window as any)[storage].clear();
  },
  remove(key, storage = StorageTypes.localStorage) {
    (window as any)[storage].removeItem(key);
  },
};

export const cookieManager: CookieManager = {
  set(key, value, expired) {
    if (expired) docCookies.setItem(key, value, expired);
    else docCookies.setItem(key, value);
  },
  get(key) {
    return docCookies.getItem(key);
  },
  clear() {
    docCookies.keys().forEach((key) => {
      docCookies.removeItem(key);
    });
  },
  remove(key) {
    docCookies.removeItem(key);
  },
};

/**
 * @description 默认为 session
 */
export const storage: DefaultManager = {
  set(key, value, category = DEFAULT_CATEGORY, expired) {
    const { storage, isWebStorage = true } = this._map(category);

    if (isWebStorage) {
      storageManager.set(key, value, storage);
    } else {
      cookieManager.set(key, value, expired);
    }
  },
  get(key, category = DEFAULT_CATEGORY) {
    const { storage, isWebStorage = true } = this._map(category);

    if (isWebStorage) {
      return storageManager.get(key, storage);
    }
    return cookieManager.get(key);
  },
  remove(key, category = DEFAULT_CATEGORY) {
    const { storage, isWebStorage = true } = this._map(category);

    if (isWebStorage) {
      storageManager.remove(key, storage);
    } else {
      cookieManager.remove(key);
    }
  },
  clear(category = DEFAULT_CATEGORY) {
    const { storage, isWebStorage = true } = this._map(category);

    if (isWebStorage) {
      storageManager.clear(storage);
    } else {
      cookieManager.clear();
    }
  },

  _map(category) {
    let isWebStorage = true;
    let storage: StorageTypes;

    switch (true) {
      case category === SESSION:
        storage = StorageTypes.sessionStorage;
        break;
      case category === LOCAL:
        storage = StorageTypes.localStorage;
        break;
      case category === COOKIE:
        storage = StorageTypes.cookie;
        isWebStorage = false;
        break;
      default:
        storage = StorageTypes.sessionStorage;
    }

    return { isWebStorage, storage };
  },
};
export default storage;
