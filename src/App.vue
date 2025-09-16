<script setup lang="ts">
// App.vue now serves as the main container with conditional rendering
import { onMounted, ref, watch } from "vue";
import { useAuth } from "../lib/authentication";
import Sidebar from "./components/Sidebar.vue";
import FlashContainer from "./components/FlashContainer.vue";
import Login from "./pages/Login.vue";
import Dashboard from "./pages/Dashboard.vue";
import { useUserProfileStore } from "@src/stores";
import { usePriceCheckStore } from "@src/stores";
import { useAppStore } from "@src/stores/useAppStore";

const Auth = useAuth();
const { isLoading, isAuthenticated, user } = Auth;
const userProfileStore = useUserProfileStore();
const App = useAppStore();
const PriceChecks = usePriceCheckStore();

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
  if (isAuthenticated.value && user.value) {
    userProfileStore.fetch();
    App.fetchTransactions(user.value.id);
    App.selectedUserId = user.value.id;
    PriceChecks.fetch();
  }
})

// React to authentication changes (login/logout) after mount
watch([isAuthenticated, user], ([authed, currentUser]) => {
  if (authed && currentUser) {
    userProfileStore.fetch();
    App.fetchTransactions(currentUser.id);
    App.selectedUserId = currentUser.id;
    PriceChecks.fetch();
  } else {
    App.selectedUserId = undefined as unknown as string;
    App.transactions = [] as any;
  }
});
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner">Loading...</div>
  </div>
  <div v-else-if="!isAuthenticated" class="login-wrapper">
    <Login />
    <FlashContainer />
  </div>
  <div v-else-if="isAuthenticated" class="dashboard-container">
    <Sidebar :user="user" :userProfiles="userProfileStore.userProfiles" @logout="handleLogout" />
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
