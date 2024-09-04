import { createApp } from 'vue';
import axios from '@/axios.js'; // Correct the import path according to your folder structure
import App from '@/App.vue'; // Ensure the import path is correct according to your folder structure
// import '@/assets/output.css';
import '@/assets/tailwind.css';
import router from './router'
import store from './store';


const app = createApp(App);

app.use(router); // Use the router
app.use(store);

store.dispatch('initializeAuthenticationState');

app.config.globalProperties.$axios = axios; // Set axios

app.mount('#app'); // Mount the app once
