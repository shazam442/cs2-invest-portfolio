<script setup lang="ts">
import { computed } from "vue";
import {
  useFlash,
  type FlashMessage,
  type FlashMessageType,
} from "../composables/useFlash";

interface Props {
  message: FlashMessage;
}

const props = defineProps<Props>();

const { removeFlash } = useFlash();

// Computed properties for styling
const messageClass = computed(() => {
  const baseClass = "flash-message";
  const typeClass = `flash-message--${props.message.type}`;
  return `${baseClass} ${typeClass}`;
});

const iconClass = computed(() => {
  const icons: Record<FlashMessageType, string> = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };
  return icons[props.message.type];
});

// Handle manual dismissal
const handleDismiss = () => {
  removeFlash(props.message.id);
};

// Handle click on message (optional - could be used for actions)
const handleClick = () => {
  // You can add custom click behavior here if needed
  // For now, we'll just prevent event bubbling
};
</script>

<template>
  <div
    :class="messageClass"
    role="alert"
    :aria-live="message.type === 'error' ? 'assertive' : 'polite'"
    @click="handleClick"
  >
    <div class="flash-message__content">
      <span class="flash-message__icon" :aria-hidden="true">
        {{ iconClass }}
      </span>
      <span class="flash-message__text">
        {{ message.message }}
      </span>
    </div>

    <button
      v-if="message.dismissible"
      class="flash-message__dismiss"
      :aria-label="`Dismiss ${message.type} message`"
      type="button"
      @click.stop="handleDismiss"
    >
      <span aria-hidden="true">×</span>
    </button>
  </div>
</template>

<style scoped>
.flash-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-sm);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid;
  animation: slideIn 0.3s ease-out;
  max-width: 100%;
  word-wrap: break-word;
}

.flash-message__content {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  min-width: 0;
}

.flash-message__icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.flash-message__text {
  color: inherit;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
}

.flash-message__dismiss {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
  margin-left: var(--space-sm);
}

.flash-message__dismiss:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

.flash-message__dismiss:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Message type styles */
.flash-message--success {
  background-color: #f0f9ff;
  border-left-color: #10b981;
  color: #065f46;
}

.flash-message--error {
  background-color: #fef2f2;
  border-left-color: #ef4444;
  color: #991b1b;
}

.flash-message--warning {
  background-color: #fffbeb;
  border-left-color: #f59e0b;
  color: #92400e;
}

.flash-message--info {
  background-color: #eff6ff;
  border-left-color: #3b82f6;
  color: #1e40af;
}

/* Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .flash-message {
    padding: var(--space-sm) var(--space-md);
    margin-bottom: var(--space-xs);
  }

  .flash-message__text {
    font-size: var(--font-size-xs);
  }

  .flash-message__icon {
    font-size: var(--font-size-md);
  }
}
</style>
