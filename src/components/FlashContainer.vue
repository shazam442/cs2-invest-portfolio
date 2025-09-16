<script setup lang="ts">
import { computed } from "vue";
import { useFlash } from "@src/composables/useFlash.ts";
import FlashMessage from "@src/components/FlashMessage.vue";

const { messages } = useFlash();

// Computed property to limit the number of visible messages
const visibleMessages = computed(() => {
  // Show maximum 5 messages at once to prevent UI overflow
  return messages.value.slice(-5);
});
</script>

<template>
  <div v-if="messages.length > 0" class="flash-container">
    <TransitionGroup name="flash" tag="div" class="flash-container__messages">
      <FlashMessage v-for="message in visibleMessages" :key="message.id" :message="message" />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.flash-container {
  position: fixed;
  top: var(--space-md);
  right: var(--space-md);
  z-index: 1000;
  max-width: 400px;
  width: 100%;
  pointer-events: none;
}

.flash-container__messages {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
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
    top: var(--space-sm);
    right: var(--space-sm);
    left: var(--space-sm);
    max-width: none;
  }
}

@media (max-width: 480px) {
  .flash-container {
    top: var(--space-xs);
    right: var(--space-xs);
    left: var(--space-xs);
  }
}
</style>
