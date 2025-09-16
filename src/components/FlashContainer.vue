<script setup lang="ts">
import { computed } from "vue";
import { useFlash } from "../composables/useFlash";
import FlashMessage from "./FlashMessage.vue";

const { messages, clearAll } = useFlash();

// Computed property to limit the number of visible messages
const visibleMessages = computed(() => {
  // Show maximum 5 messages at once to prevent UI overflow
  return messages.value.slice(-5);
});

// Handle clearing all messages
const handleClearAll = () => {
  clearAll();
};
</script>

<template>
  <div v-if="messages.length > 0" class="flash-container">
    <div class="flash-container__header">
      <span class="flash-container__count">
        {{ messages.length }} message{{ messages.length === 1 ? "" : "s" }}
      </span>
      <button
        class="flash-container__clear-all"
        type="button"
        aria-label="Clear all messages"
        @click="handleClearAll"
      >
        > > Clear All
      </button>
    </div>

    <div class="flash-container__messages">
      <TransitionGroup name="flash" tag="div">
        <FlashMessage
          v-for="message in visibleMessages"
          :key="message.id"
          :message="message"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.flash-container {
  position: fixed;
  top: var(--space-lg);
  right: var(--space-lg);
  z-index: 1000;
  max-width: 400px;
  width: 100%;
  pointer-events: none;
}

.flash-container__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  pointer-events: auto;
}

.flash-container__count {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.flash-container__clear-all {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.flash-container__clear-all:hover {
  background: var(--color-bg-muted);
  color: var(--color-text);
}

.flash-container__messages {
  pointer-events: auto;
}

/* Transition animations */
.flash-enter-active {
  transition: all 0.3s ease-out;
}

.flash-leave-active {
  transition: all 0.3s ease-in;
}

.flash-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.flash-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.flash-move {
  transition: transform 0.3s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .flash-container {
    top: var(--space-md);
    right: var(--space-md);
    left: var(--space-md);
    max-width: none;
  }

  .flash-container__header {
    padding: var(--space-xs);
  }

  .flash-container__count {
    font-size: var(--font-size-xs);
  }

  .flash-container__clear-all {
    font-size: var(--font-size-xs);
    padding: var(--space-xs);
  }
}

@media (max-width: 480px) {
  .flash-container {
    top: var(--space-sm);
    right: var(--space-sm);
    left: var(--space-sm);
  }
}
</style>
