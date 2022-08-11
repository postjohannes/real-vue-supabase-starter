import { App, defineAsyncComponent } from 'vue';
import PublicView from './public';

const AppView = defineAsyncComponent(() => import('./app'));

export function loadViews(app: App): void {
	app.component('PublicView', PublicView);
	app.component('AppView', AppView);
}
