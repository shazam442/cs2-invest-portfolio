<script setup lang="ts">
// App.vue now serves as the main container with conditional rendering
import { onMounted, ref } from "vue";
import { useAuth } from "../lib/authentication";
import Sidebar from "./components/Sidebar.vue";
import FlashContainer from "./components/FlashContainer.vue";
import Login from "./pages/Login.vue";
import Dashboard from "./pages/Dashboard.vue";
import { useUserProfileStore } from "@src/stores";
import { useAppStore } from "@src/stores/useAppStore";

const Auth = useAuth();
const userProfileStore = useUserProfileStore();
const App = useAppStore();

const handleLogout = async () => {
  try {
    const { error } = await Auth.signOut();
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

onMounted(() => {
  // Only fetch data if user is authenticated
  if (Auth.isAuthenticated.value && Auth.user.value) {
    userProfileStore.fetch();
    App.fetchTransactions(Auth.user.value.id);
    App.selectedUserId = Auth.user.value.id;
  }
  App.isLoading = false;
})
</script>

<template>
  <div v-if="App.isLoading" class="loading-container">
    <div class="loading-spinner">Loading...</div>
  </div>
  <div v-else-if="!Auth.isAuthenticated" class="login-wrapper">
    <Login />
    <FlashContainer />
  </div>
  <div v-else-if="Auth.isAuthenticated" class="dashboard-container">
    <Sidebar :user="Auth.user" :userProfiles="userProfileStore.userProfiles" @logout="handleLogout" />
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
