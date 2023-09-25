import router from '@/router';
const whiteList = ['/404', '/error', '/login'];

// router拦截
router.beforeEach(async (to, from, next) => {
  // wujie接入
  if (window?.__POWERED_BY_WUJIE__) {
    next();
    return;
  }

  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    next({ name: 'Error' });
  }
});

export default router;
