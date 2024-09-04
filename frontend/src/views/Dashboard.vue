<template>
  <div class="dashboard">
    <Sidebar @show-settings="toggleSettingsVisibility" @show-profile="toggleProfileVisibility" />

    <div class="content">
      <!-- Content -->
      <div class="timelines">
        <Timeline
          v-for="timescale in timescales"
          :key="timescale"
          :posts="posts"
          :media="media"
          :tagColors="tagColors"
          :timescale="timescale"
          @show-modal="showModal"
        />
      </div>
    </div>
    <Tags @update:selectedTags="handleTagSelected" />

    <Settings v-if="isSettingsVisible" @close="toggleSettingsVisibility" />
    <Profile v-if="isProfileVisible" @close="toggleProfileVisibility" />
    <button @click="toggleAddVisibility" class="add-icon-button">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#6C8AA8" class="add-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    </button>

    <!-- Add Component -->
    <Add v-if="isAddVisible" @close="toggleAddVisibility" :tags="tags" />

    <Modal v-if="isDetailVisible" :content="detailModalContent" @close="toggleDetailVisibility" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from '@/axios.js';
import Sidebar from './Sidebar.vue';
import Timeline from './Timeline.vue';
import Settings from './Settings.vue';
import Profile from './Profile.vue';
import Tags from './Tags.vue';
import Add from './Add.vue';
import Modal from './Detail.vue';

const store = useStore();

const posts = ref([]);
const media = ref([]);
const socket = ref(null);

const isSettingsVisible = computed(() => store.state.isSettingsVisible);
const isProfileVisible = computed(() => store.state.isProfileVisible);
const isDetailVisible = computed(() => store.state.isDetailVisible);
const isAddVisible = computed(() => store.state.isAddVisible);

const detailModalContent = computed(() => store.state.detailModalContent);
const tags = ref([]);  // Define the tags ref to avoid undefined error
const tagColors = ref({});

const timescales = ['hour', 'day', 'week', 'month', 'year', 'decade', 'century'];

onMounted(() => {
  connectWebSocket();
  fetchTags();  // Fetch tags on mount
  // Initialize authentication state to ensure token is set
  store.dispatch('initializeAuthenticationState');
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});

function connectWebSocket() {
  socket.value = new WebSocket('ws://localhost:8000/ws/some_path/');
  socket.value.onmessage = (event) => {
    let data = JSON.parse(event.data);
    posts.value = data.message;
  };
  socket.value.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
  };
}

async function fetchTags() {
  try {
    const response = await axios.get('/tags/');
    tags.value = response.data;
    console.log("Tags fetched:", tags.value);
  } catch (error) {
    console.error('Failed to fetch tags:', error);
  }
}

function toggleSettingsVisibility() {
  store.commit('toggleSettingsVisibility');
  console.log('Settings button clicked!');
}

function toggleProfileVisibility() {
  store.commit('toggleProfileVisibility');
  console.log('Profile button clicked!');
}

function toggleAddVisibility() {
  store.commit('toggleAddVisibility');
}

function toggleDetailVisibility() {
  store.commit('toggleDetailVisibility');
}

async function handleTagSelected(data) {
  const { tags: selectedTags, tagColors: selectedTagColors } = data;
  tagColors.value = selectedTagColors;
  if (selectedTags.length > 0) {
    const tagIds = selectedTags.map(tag => tag.id).join(',');
    await fetchPostsByTag(tagIds);
    await fetchMediaByTag(tagIds);
  } else {
    posts.value = [];
    media.value = [];
  }
}

async function fetchPostsByTag(tagIds) {
  try {
    const response = await axios.get(`posts/?tag=${tagIds}`);
    posts.value = response.data;
    console.log("Posts fetched:", posts.value);
  } catch (error) {
    console.error('Failed to fetch posts by tag:', error);
  }
}

async function fetchSignedUrlsForMedia(mediaItems) {
  try {
      for (let mediaItem of mediaItems) {
          const response = await axios.get(`/media-detail/${mediaItem.id}`);
          const { id, signed_url, caption, media_type, user } = response.data;
          const mediaIndex = media.value.findIndex(item => item.id === id);
          if (mediaIndex !== -1) {
              media.value[mediaIndex] = {
                  ...media.value[mediaIndex],
                  signed_url,
                  caption,
                  media_type,
                  user
              };
          }
      }
  } catch (error) {
      console.error('Failed to fetch signed URLs for media:', error);
  }
}

async function fetchMediaByTag(tagIds) {
  try {
    const response = await axios.get(`media/?tag=${tagIds}`);
    media.value = response.data;
    console.log("Media items fetched:", media.value);
    await fetchSignedUrlsForMedia(media.value);
  } catch (error) {
    console.error('Failed to fetch media by tag:', error);
  }
}

function showModal(item, itemType) {
  store.commit('setDetailModalContent', { item, itemType });
  toggleDetailVisibility();
}
</script>




<style scoped>
.sidebar {
    z-index: 500;
    overflow: visible;
    /* max-width: 10%; */
}

.dashboard {
    display: flex;
    height: 100vh;
    flex-direction: row;
}

.content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

}

.timelines {
    display: flex;
    width: 100%;
    height: 100%;
    color: #6C8AA8;
}

.timelines>* {
    flex: 1;

}

.timelines>*:nth-child(odd) {
    background-color: #f4f4f4;
    z-index: 500;
}

.timelines>*:nth-child(even) {
    background-color: #ebedee;
    z-index: 500;
}

.menu-dropdown {
    position: fixed;
    z-index: 1000;
    background-color: #56595C;
    color: #E6EDF5;

}

.add-icon {
    position: fixed;
    bottom: 10px;
    right: 11px;
    width: 50px;
    height: 68px;
    fill: 6C8AA8#6C8AA8;
    /* Change the color as needed */
    cursor: pointer;
    z-index: 1000;
    /* Ensure it's above other elements */
}

.tags-search-container {
    position: absolute;
    bottom: 0px;
    /* height: 80%; */

}

@media (max-width: 600px) {
    .dashboard {
        display: flex;
        flex-direction: column;

    }

    .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-bottom: 11vh;
        margin-top: 10px;
        overflow: visible;

    }

    .sidebar {
        position: auto;
        z-index: 501;
        height: 8%;
        overflow: visible;


    }

    .dashboard>.content {
        position: fixed;
        height: 100%;
        width: 100%;
        padding-top: 12%;
        padding-bottom: 10%;
    }

    .tags-search-container {
        /* position: fixed; */
        bottom: 0;
        width: 100%;
        background-color: #4B6075;
        height: 9%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
    }

    .timelines {
        position: fixed;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        overflow-x: scroll;
        overflow-y: visible;
        justify-content: stretch;
        align-items: stretch;
        width: 100%;
        height: 85%;


    }

    .timelines>* {
        flex: 1 0 33.3333%;
    }

    .add-icon {
        bottom: 9%;

    }

    .menu-dropdown {
        position: absolute;
        z-index: 1000;
        overflow: visible;
        background-color: #56595C;
        color: #E6EDF5;
    }
}
</style>