import { RouteRecordRaw } from 'vue-router';

const SignInRoute = () => import('@/pages/public/sign-in');
const SignUpRoute = () => import('@/pages/public/sign-up');
const NotFoundRoute = () => import('@/pages/public/not-found');

const DashboardRoute = () => import('@/pages/app/dashboard');
const ProfileRoute = () => import('@/pages/app/profile');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'sign-in',
    component: SignInRoute,
    meta: {
      title: 'Sign In',
      requiresAuth: false,
    },
  },
  {
    path: '/signup',
    name: 'sign-up',
    component: SignUpRoute,
    meta: {
      title: 'Sign Up',
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardRoute,
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileRoute,
    meta: {
      title: 'Profile',
      requiresAuth: true,
    },
  },
  {
    path: '/:_(.+)+',
    name: 'not-found',
    component: NotFoundRoute,
    meta: {
      title: 'Page Not Found'
    },
  }
]

export default routes
