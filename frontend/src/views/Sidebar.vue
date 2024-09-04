<template>
    <div class="sidebar-container">
        <div class="sidebar-content">
            <img src="@/assets/logos/logo_bleu_clair_transparent.png" alt="Logo" class="logo">
            <div v-if="user" class="user-interaction">
                <div class="user-info">
                    {{ user.username }}
                    <svg @click="toggleMenu" ref="menuButton" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="menu-icon">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                    </svg>
                </div>
                <div v-if="showMenu" ref="menu" class="menu-dropdown">
                    <a href="#" @click.prevent="showSettings" class="menu-item">Settings</a>
                    <a href="#" @click.prevent="showProfile" class="menu-item">Profile</a>
                    <a href="#" @click.prevent="logout" class="menu-item">Logout</a>
                </div>
            </div>
        </div>
        <Tags v-if="isLargeScreen" @update:selectedTags="handleTagSelected" />
    </div>
    <Settings v-if="openMenu === 'settings'" @close="openMenu = null" />
    <Profile v-if="openMenu === 'profile'" @close="openMenu = null" />
</template>

<script>
import { mapState } from 'vuex';
import axios from '@/axios.js';

export default {
    name: 'Sidebar',
    computed: {
        ...mapState(['user']),
    },
    data() {
        return {
            showMenu: false,
            openMenu: null,
            isLargeScreen: false,

        };
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
        window.removeEventListener('resize', this.checkScreenSize);
        s
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu;
            console.log("Menu toggle clicked. Current state of showMenu:", this.showMenu);
        },
        showSettings() {
            this.openMenu = this.openMenu === 'settings' ? null : 'settings';
            this.showMenu = false;
            this.$emit('show-settings');
        },
        showProfile() {
            this.openMenu = this.openMenu === 'profile' ? null : 'profile';
            this.showMenu = false;
            this.$store.commit('toggleProfileVisibility');
        },
        handleClickOutside(event) {
            if (!this.$refs.menuButton.contains(event.target) &&
                (!this.$refs.menu || !this.$refs.menu.contains(event.target))) {
                this.showMenu = false;
            }
        },
        checkScreenSize() {
            this.isLargeScreen = window.innerWidth > 600; // Adjust 600 to your breakpoint
        },
        async logout() {
            try {
                await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}logout/`);
                this.$store.commit('setUser', null);
                this.$router.push('/');
            } catch (error) {
                console.error('An error occurred during logout:', error);
            }
        },
    },
};
</script>

<style scoped>
.sidebar-container {
    background-color: #4B6075;
    width: 16%;
    z-index: 20;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.sidebar-content {
    display: flex;
    /* flex-direction: column ; */
    justify-content: space-between;
    align-items: center;
}

.logo {
    max-height: 75px;
    width: auto;
    align-self: flex-start;
}

.user-interaction {
    cursor: pointer;
    position: relative;
}

.user-info {
    display: flex;
    align-items: center;
    color: #E6EDF5;
}

.menu-icon {
    margin-left: 0.5rem;
    width: 24px;
    height: 24px;
    stroke: #E6EDF5;
}

.menu-dropdown {
    position: absolute;
    z-index: 1010;
    background-color: #56595C;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;
    padding: 0.5rem;
    width: auto;
    top: 100%;
    left: 0;
    color: #9EA3A8;
}

.menu-item {
    text-align: center;
    padding: 0.25rem 1rem;
    width: 100%;
}

.menu-item:hover {
    background-color: #E5E7EB;
}

@media (min-width: 600px) {

    /* Adjust 600px to your breakpoint */
    .sidebar-container {
        /* Existing styles */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 40%;
        /* Ensure tags are aligned to the bottom */
    }

    .sidebar-content {
        flex-direction: column;
        /* flex: 2; */
        padding-bottom: 10%;
    }

    .logo {
        max-height: 100px;
        width: auto;
        align-self: center;
    }
}

@media (max-width: 600px) {
    .sidebar-container {
        background-color: #4B6075;
        position: fixed;
        top: 0;
        left: 0;
        height: 8%;
        width: 100%;
        padding-top: 0;
        justify-content: space-between;
    }

    .user-info {
        min-height: 50px;
    }

    .menu-dropdown {
        background-color: #56595C;
        border-radius: 0.5rem;
        margin-top: 0;
        padding: 0.2rem;
        top: 75%;
        left: 10%;
    }

    .menu-item:hover {
        background-color: #56595C;
        color: #E6EDF5;
    }
}
</style>
