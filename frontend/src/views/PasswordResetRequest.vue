<template>
    <div>
      <h2>Forgot Password</h2>
      <form @submit.prevent="requestPasswordReset">
        <input type="email" v-model="email" placeholder="Enter your email" required />
        <button type="submit">Reset Password</button>
      </form>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        successMessage: '',
        errorMessage: ''
      };
    },
    methods: {
      async requestPasswordReset() {
        try {
          const response = await this.$store.dispatch('requestPasswordReset', { email: this.email });
          this.successMessage = response.message;
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = error.response.data.error;
          this.successMessage = '';
        }
      }
    }
  };
  </script>
  