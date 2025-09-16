<script setup lang="ts">
import type { User } from "@supabase/supabase-js";
import type { Tables } from "@lib/types/supabase.types";
import { useUserProfileStore } from "@src/stores";
import { useAppStore } from "@src/stores";
import { useFlash } from "@src/composables/useFlash";
import { useAuth } from "@lib/authentication";

const { user } = useAuth();
const userProfileStore = useUserProfileStore();
const App = useAppStore();
const Flash = useFlash();

const handleUserProfileClick = (userId: string) => {
  try {
    App.isLoading = true;
    App.selectedUserId = userId;
    userProfileStore.fetch();
    App.fetchTransactions(userId);
    Flash.success("User profile and transactions fetched successfully!");
    App.isLoading = false;
  }
  catch (error) {
    console.error("An error occurred while fetching user profiles or transactions:", error);
    Flash.error("An error occurred while fetching user profiles or transactions:", error);
    App.isLoading = false;
  }
}

defineEmits<{
  logout: [];
}>();
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">CS2</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <template v-for="userProfile in userProfileStore.userProfiles">
        <a href="#" class="nav-item" :title="userProfile.display_name"
          :class="{ active: userProfile.user_id === App.selectedUserId }"
          @click="handleUserProfileClick(userProfile.user_id)">
          <span class="nav-icon">{{ userProfile.display_name.charAt(0).toUpperCase() }}</span>
        </a>
      </template>
    </nav>

    <!-- User Details -->
    <div v-if="user" class="user-details">
      <div class="user-avatar">
        <div class="avatar-circle" :title="user.email || 'User'">
          {{ user.email?.charAt(0).toUpperCase() || "U" }}
        </div>
      </div>
      <button class="logout-btn" title="Logout" @click="$emit('logout')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Compact Sidebar - Always Collapsed */
.sidebar {
  width: 70px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.sidebar-header {
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  background: var(--color-accent);
  padding: var(--space-sm);
  color: white;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.sidebar-nav {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
  font-weight: var(--font-weight-medium);
}

.nav-item:hover {
  background: var(--color-bg-muted);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-accent);
  color: white;
}

.nav-icon {
  font-size: var(--font-size-lg);
}

/* User Details */
.user-details {
  margin-top: auto;
  padding: var(--space-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  background: var(--color-bg-muted);
  flex-direction: column;
  min-height: 80px;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.logout-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.logout-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.2);
}

.logout-btn svg {
  flex-shrink: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: var(--space-md);
  }

  .nav-item {
    white-space: nowrap;
  }

  .user-details {
    padding: var(--space-md);
    margin-top: 0;
    border-top: none;
    border-left: 1px solid var(--color-border);
    flex-direction: row;
    min-height: auto;
  }

  .avatar-circle {
    width: 32px;
    height: 32px;
    font-size: var(--font-size-sm);
  }

  .logout-btn {
    width: 28px;
    height: 28px;
  }

  .logout-btn svg {
    width: 14px;
    height: 14px;
  }
}
</style>
