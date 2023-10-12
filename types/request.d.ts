interface HttpRes<T = any> {
  data: T;
  errors?: any;
  mfail?: string;
  msg?: any;
}
