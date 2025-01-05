import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';
import 'leaflet/dist/leaflet.css';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(VCalendar, {});
app.mount('#app');
