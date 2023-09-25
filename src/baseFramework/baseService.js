import { of, switchMap } from 'rxjs';

export default class BaseService {
  constructor(router, store) {
    this.router = router;
    this.store = store;
  }
  setStore(store) {
    !this.store && store && store.dispatch && (this.store = store);
  }
}

export const GenerateService = api => {
  return params => {
    return of(params).pipe(switchMap(p => api(p)));
  };
};
