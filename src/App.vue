<script setup lang="ts">
// App.vue now serves as the main container with conditional rendering
import { useAuth } from "../lib/authentication";
import Sidebar from "./components/Sidebar.vue";
import FlashContainer from "./components/FlashContainer.vue";
import Login from "./pages/Login.vue";
import Dashboard from "./pages/Dashboard.vue";

const { user, isAuthenticated, isLoading, signOut } = useAuth();

const handleLogout = async () => {
  try {
    const { error } = await signOut();
    if (error) {
      console.error("Error signing out:", error);
      // The signOut function now handles session clearing even on error,
      // so the user will be logged out regardless
    }
  } catch (err) {
    console.error("Unexpected error during logout:", err);
    // Even if there's an unexpected error, the user should still be logged out
    // The signOut function handles this case
  }
};
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner">Loading...</div>
  </div>
  <div v-else-if="!isAuthenticated" class="login-wrapper">
    <Login />
    <FlashContainer />
  </div>
  <div v-else class="dashboard-container">
    <Sidebar :user="user" @logout="handleLogout" />
    <Dashboard />
    <FlashContainer />
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--color-bg-muted);
}

.loading-spinner {
  font-size: 1.2rem;
  color: var(--color-text);
  font-weight: 500;
}

.login-wrapper {
  min-height: 100vh;
  background: var(--color-bg-muted);
}

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
