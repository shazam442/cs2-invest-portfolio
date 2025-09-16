<script setup lang="ts">
// App.vue now serves as the main router container
import { useAuth } from '../lib/authentication';
import Sidebar from './components/Sidebar.vue';

const { user, signOut, redirectToLogin } = useAuth();


const handleLogout = async () => {
  try {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      // Redirect to login page
      redirectToLogin();
    }
  } catch (err) {
    console.error('Unexpected error during logout:', err);
  }
}
</script>

<template>
  <div class="dashboard-container">
    <Sidebar :user="user" @logout="handleLogout" />
    <router-view />
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow-y: scroll;
  background: var(--color-bg-muted);
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
}
</style>