
<template>
  <div class="container">
    <RouterView></RouterView>
  </div>
</template>

<script>
import { RouterView, RouterLink } from 'vue-router';
import axios from '@/axios.js';

export default {
  components: {
    RouterView,
    RouterLink,
  },
};
</script>
<style>
/* Global styles (if you want to use it for all texts by default) */
body {
  font-family: 'Space Grotesk', sans-serif;
}
</style>