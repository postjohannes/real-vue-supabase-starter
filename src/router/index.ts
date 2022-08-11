import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { supabase } from '@/services/supabase';
import routes from './routes'

const defaultTitle = 'Real Vue Supabase Starter';

let appStore: any;

const history = createWebHistory()

const router = createRouter({history, routes})

router.beforeEach(async (to, from, next) => {
  if (!appStore) {
    appStore = useAppStore();
  }

  if (!from.name) {
    appStore.initialPath = to.path;
  }

  if (to.path === '/' && appStore.supabaseSession) {
    next({path: '/'});
    return;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!appStore.supabaseSession) {
      next({path: '/'});
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title ? to.meta.title : defaultTitle;
});

supabase.auth.onAuthStateChange(async (event, session) => {
  if (!appStore) {
    appStore = useAppStore();
  }

  if (!session?.user) {
    appStore.reset()
    router.push('/');
    return
  }

  appStore.supabaseSession = session;

  console.log("event: " + event)
  if (appStore.initialPath) {
    const initialPath = appStore.initialPath;
    appStore.initialPath = '';
    router.push(initialPath);
  }
});

export default router
