import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { supabase } from '@/services/supabase';

const SignInRoute = () => import('@/routes/public/sign-in');
const SignUpRoute = () => import('@/routes/public/sign-up');
const NotFoundRoute = () => import('@/routes/public/not-found');

const DashboardRoute = () => import('@/routes/app/dashboard');
const ProfileRoute = () => import('@/routes/app/profile');

const defaultTitle = 'Real Vue Supabase Starter';

let appStore: any;

export const defaultRoutes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Sign In',
		component: SignInRoute,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/signup',
		name: 'Sign Up',
		component: SignUpRoute,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: DashboardRoute,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/profile',
		name: 'Profile',
		component: ProfileRoute,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/:_(.+)+',
		name: 'Page Not Found',
		component: NotFoundRoute
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes: defaultRoutes,
});

router.beforeEach(async (to, from, next) => {
	if (!appStore) {
		appStore = useAppStore();
	}

	if (!from.name) {
		appStore.initialPath = to.path;
	}

	if (to.path === '/' && appStore.supabaseSession) {
		next({ path: '/purchase' });
		return;
	}

	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!appStore.supabaseSession) {
			next({ path: '/' });
		} else {
			next();
		}
	} else {
		next();
	}
});

router.afterEach((to) => {
	document.title = to.name ? String(to.name) : defaultTitle;
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
