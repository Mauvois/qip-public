<template>
  <div class="about">
    <h1>About</h1>
  </div>
</template>

<script>
export default {
  name: 'AboutPage', 
  async mounted() {
    try {
      const response = await this.$axios.get('/endpoint');
      console.log(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  },
};
</script>