import { createRouter, createWebHistory} from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import LoginButton from '../components/LoginButton.vue';
import Callback from '../views/Callback.vue';
import RecentTracks from '../views/RecentTracks.vue';
import ErrorPage from '../views/ErrorPage.vue';
import RecentlyPlayed from '@/components/RecentlyPlayed.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: LoginButton,
  },
  {
    path: '/callback',
    name: 'CallBack',
    component: Callback,
  },
  {
    path: '/recently',
    name: 'RecentTracks',
    component: RecentTracks,
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorPage,
  },
  {
    path: '/api',
    name: 'RecentlyPlayed',
    component: RecentlyPlayed,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
