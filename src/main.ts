import { createApp } from 'vue';
import { loadViews } from '@/layouts/load';
import { createPinia } from 'pinia';
// @ts-ignore
import router from './router'
import naive from './naive'
import App from '@/App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(naive);

loadViews(app);

app.mount('#app');
