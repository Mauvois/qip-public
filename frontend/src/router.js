import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Dashboard from '@/views/Dashboard.vue'
import PasswordResetRequest from '@/views/PasswordResetRequest.vue';
import PasswordResetConfirm from '@/views/PasswordResetConfirm.vue';
import store from './store' // Import the store

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    {
        path: '/password-reset',
        name: 'PasswordResetRequest',
        component: PasswordResetRequest
    },
    {
        path: '/password-reset-confirm/:uidb64/:token',
        name: 'PasswordResetConfirm',
        component: PasswordResetConfirm
    },
    // Include other routes such as Login and Signup here
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated; // Adjust according to your store
    if (isAuthenticated && (to.name === 'Login' || to.name === 'Signup')) {
        next({ name: 'Dashboard' }); // Redirect to Dashboard
    } else {
        next(); // Proceed as normal
    }
})

export default router;
