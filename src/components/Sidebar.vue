<script setup lang="ts">
import { ref } from "vue";
import type { User } from "@supabase/supabase-js";

defineProps<{
  user: User | null;
}>();

defineEmits<{
  logout: [];
}>();

// Sidebar collapse state - collapsed by default
const isCollapsed = ref(true);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">I</div>
        <span v-if="!isCollapsed" class="logo-text">Portfolio</span>
      </div>
      <button
        class="toggle-btn"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleSidebar"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="{ rotated: !isCollapsed }"
        >
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>
    </div>
    <nav class="sidebar-nav">
      <a href="#" class="nav-item active">
        <span class="nav-icon">🎮</span>
        <span v-if="!isCollapsed" class="nav-text">CS2</span>
      </a>
    </nav>

    <!-- User Details -->
    <div v-if="user" class="user-details">
      <div class="user-avatar">
        <div class="avatar-circle">
          {{ user.email?.charAt(0).toUpperCase() || "U" }}
        </div>
      </div>
      <div v-if="!isCollapsed" class="user-info">
        <div class="user-name">{{ user.email || "User" }}</div>
        <div class="user-status">Online</div>
      </div>
      <button class="logout-btn" title="Logout" @click="$emit('logout')">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Sidebar */
.sidebar {
  width: 280px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 60px;
}

.sidebar:not(.collapsed) .sidebar-header {
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  min-width: 0;
  justify-content: center;
}

.sidebar:not(.collapsed) .logo {
  justify-content: flex-start;
}

.toggle-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
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
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
}

.sidebar:not(.collapsed) .toggle-btn {
  position: static;
  transform: none;
}

.toggle-btn:hover {
  background: var(--color-bg-muted);
  color: var(--color-text);
  border-color: var(--color-accent);
}

.toggle-btn svg {
  transition: transform 0.2s ease;
}

.toggle-btn svg.rotated {
  transform: rotate(180deg);
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

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-nav {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sidebar.collapsed .sidebar-nav {
  padding: var(--space-md);
}

.sidebar.collapsed .user-details {
  padding: var(--space-md);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
  font-weight: var(--font-weight-medium);
  justify-content: center;
}

.sidebar:not(.collapsed) .nav-item {
  justify-content: flex-start;
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

.nav-text {
  font-size: var(--font-size-sm);
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

/* User Details */
.user-details {
  margin-top: auto;
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-bg-muted);
  justify-content: center;
  flex-direction: column;
  min-height: 80px;
}

.sidebar:not(.collapsed) .user-details {
  justify-content: flex-start;
  flex-direction: row;
  min-height: auto;
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

.user-info {
  flex: 1;
  min-width: 0;
  transition: opacity 0.3s ease;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-status::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .sidebar.collapsed {
    width: 70px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
  }

  .sidebar.collapsed {
    width: 100%;
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
  }

  .user-name {
    font-size: var(--font-size-xs);
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

  .toggle-btn {
    display: none;
  }
}
</style>
