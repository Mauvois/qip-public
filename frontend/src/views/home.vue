<template>
  <div class="home flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <section class="auth-section bg-white p-8 rounded-md" style="max-width: 340px; width: 100%;">
      <div class="tabs flex mb-4">
        <button @click="activeTab = 'login'"
          :class="{ 'text-white': activeTab === 'login', 'text-gray-500': activeTab !== 'login' }"
          class="flex-1 py-2 px-4 rounded-l-md focus:outline-none"
          :style="{ backgroundColor: activeTab === 'login' ? '#56595C' : '', borderColor: activeTab === 'login' ? '#56595C' : '#e2e8f0' }"
          @mouseover="this.style.backgroundColor = '#3D3D3D'"
          @mouseleave="this.style.backgroundColor = activeTab === 'login' ? '#56595C' : ''">Login</button>
        
        
        <button @click="activeTab = 'signup'"
          :class="{ 'text-white': activeTab === 'signup', 'text-gray-500': activeTab !== 'signup' }"
          class="flex-1 py-2 px-4 rounded-r-md focus:outline-none"
          :style="{ backgroundColor: activeTab === 'signup' ? '#56595C' : '', borderColor: activeTab === 'signup' ? '#56595C' : '#e2e8f0' }"
          @mouseover="this.style.backgroundColor = '#3D3D3D'"
          @mouseleave="this.style.backgroundColor = activeTab === 'signup' ? '#56595C' : ''">Sign Up</button>


      </div>

      <div class="flex flex-col space-y-4">
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <input v-model="loginUsername" placeholder="Username"
            class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500" />
          <input type="password" v-model="loginPassword" placeholder="Password"
            class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500" />

          <!-- Error message display here -->
          <p class="text-green-500" v-if="successMessage">{{ successMessage }}</p>
          <p class="text-red-500" v-if="errorMessage">{{ errorMessage }}</p>

          <button type="submit" class="w-full py-2 text-white rounded-md focus:outline-none"
            :class="{ 'bg-gray-500': activeTab === 'login', 'text-gray-500': activeTab !== 'login' }"
            :style="{ backgroundColor: activeTab === 'login' ? '#4B6075' : '' }"
            @mouseover="activeTab === 'login' && (this.style.backgroundColor = '#567189')"
            @mouseleave="activeTab === 'login' && (this.style.backgroundColor = '#4B6075')"
            :disabled="activeTab !== 'login'">
            Login
          </button>

          <div class="flex justify-between">
            <router-link to="/password-reset" class="text-blue-500">Forgot Password?</router-link>
          </div>
        </form>

        <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="space-y-4">
          <input v-model="signupUsername" placeholder="Username"
            class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500" />
          <input v-model="signupFirstName" placeholder="First Name"
            class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500" />
          <input v-model="signupLastName" placeholder="Last Name"
            class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500" />
          <input v-model="signupEmail" type="email" placeholder="Email"
            class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500" />
          <input type="password" v-model="signupPassword" placeholder="Password"
            class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500" />
          <input type="password" v-model="signupPasswordConfirmation" placeholder="Confirm Password"
            class="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500" />



          <!-- Error message display here -->
          <p class="text-green-500" v-if="successMessage">{{ successMessage }}</p>
          <p class="text-red-500" v-if="errorMessage">{{ errorMessage }}</p>
          <button type="submit" class="w-full py-2 text-white rounded-md focus:outline-none"
            :class="{ 'bg-gray-500': activeTab === 'signup', 'text-gray-500': activeTab !== 'signup' }"
            :style="{ backgroundColor: activeTab === 'signup' ? '#4B6075' : '' }"
            @mouseover="activeTab === 'signup' && (this.style.backgroundColor = '#567189')"
            @mouseleave="activeTab === 'signup' && (this.style.backgroundColor = '#4B6075')"
            :disabled="activeTab !== 'signup'">
            Sign Up
          </button>

        </form>
      </div>
    </section>




    <section class="info-section mt-12 text-center">
      <img src="@/assets/logos/logo_bleu_transparent.png" alt="Logo" class="mt-4 mx-auto h-60">


    </section>
  </div>
</template>


<script>
import { mapActions } from 'vuex';

export default {
  name: 'HomePage',
  data() {
    return {
      activeTab: 'login',
      loginUsername: '',
      loginPassword: '',
      signupUsername: '',
      signupFirstName: '',
      signupLastName: '',
      signupEmail: '',
      signupPassword: '',
      signupPasswordConfirmation: '',
      errorMessage: '',
      successMessage: '',
      isLoading: false
    };
  },
  methods: {
    ...mapActions(['login', 'signup']),

    async handleLogin() {
      this.isLoading = true;

      if (!this.loginUsername.trim() || !this.loginPassword.trim()) {
        this.errorMessage = "Both fields are required!";
        this.isLoading = false;
        return;
      }

      try {
        await this.login({
          username: this.loginUsername,
          password: this.loginPassword
        });
        this.successMessage = 'Logged in successfully!';
        this.$router.push('/dashboard');
      } catch (error) {
        console.error("Login failed:", error);
        this.errorMessage = 'Invalid credentials';
      } finally {
        this.isLoading = false;
      }
    },

    async handleSignup() {
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.signupFirstName.trim() || !this.signupLastName.trim() || !this.signupUsername.trim() || !this.signupEmail.trim() || !this.signupPassword.trim() || !this.signupPasswordConfirmation.trim()) {
        this.errorMessage = "All fields are required!";
        return;
      }

      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,7}$/;
      if (!emailRegex.test(this.signupEmail)) {
        this.errorMessage = "Invalid email format!";
        return;
      }
      if (this.signupPassword !== this.signupPasswordConfirmation) {
        this.errorMessage = "Passwords do not match!";
        return;
      }

      try {
        await this.signup({
          first_name: this.signupFirstName,
          last_name: this.signupLastName,
          username: this.signupUsername,
          email: this.signupEmail,
          password: this.signupPassword
        });

        this.successMessage = 'Signed up successfully!';
        this.$router.push('/dashboard');
      } catch (error) {
        console.error("Signup failed:", error);
        this.errorMessage = 'Signup failed. Please try again.';
      }
    },
  },
};
</script>


<style>
.home {
  background-color: #E6EDF5;
}

.auth-section {
  background-color: #E6EDF5;
}
</style>