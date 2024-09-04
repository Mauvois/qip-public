<template>
    <div>
      <h2>Reset Password</h2>
      <form @submit.prevent="resetPassword">
        <input type="password" v-model="password" placeholder="Enter new password" required />
        <input type="password" v-model="passwordConfirm" placeholder="Confirm new password" required />
        <button type="submit">Submit</button>
      </form>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        password: '',
        passwordConfirm: '',
        successMessage: '',
        errorMessage: ''
      };
    },
    methods: {
      async resetPassword() {
        try {
          const { uidb64, token } = this.$route.params;
          const response = await this.$store.dispatch('resetPassword', { uidb64, token, password: this.password, password_confirm: this.passwordConfirm });
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
  