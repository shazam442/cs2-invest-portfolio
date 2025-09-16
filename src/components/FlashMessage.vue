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
  <div :class="messageClass" role="alert" :aria-live="message.type === 'error' ? 'assertive' : 'polite'"
    @click="handleClick">
    <div class="flash-message__content">
      <span class="flash-message__icon" :aria-hidden="true">
        {{ iconClass }}
      </span>
      <span class="flash-message__text">
        {{ message.message }}
      </span>
    </div>

    <button v-if="message.dismissible" class="flash-message__dismiss" :aria-label="`Dismiss ${message.type} message`"
      type="button" @click.stop="handleDismiss">
      <span aria-hidden="true">×</span>
    </button>
  </div>
</template>

<style scoped>
.flash-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 100%;
  word-wrap: break-word;
  position: relative;
  overflow: hidden;
}

.flash-message__content {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  min-width: 0;
}

.flash-message__icon {
  font-size: 18px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.flash-message__text {
  color: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.flash-message__dismiss {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  opacity: 0.6;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
  margin-left: var(--space-sm);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flash-message__dismiss:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.flash-message__dismiss:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  opacity: 1;
}

/* Message type styles */
.flash-message--success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border-color: rgba(16, 185, 129, 0.3);
  color: #064e3b;
}

.flash-message--success::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 12px 12px 0 0;
}

.flash-message--error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border-color: rgba(239, 68, 68, 0.3);
  color: #7f1d1d;
}

.flash-message--error::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ef4444, #f87171);
  border-radius: 12px 12px 0 0;
}

.flash-message--warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border-color: rgba(245, 158, 11, 0.3);
  color: #78350f;
}

.flash-message--warning::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 12px 12px 0 0;
}

.flash-message--info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-color: rgba(59, 130, 246, 0.3);
  color: #1e3a8a;
}

.flash-message--info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 12px 12px 0 0;
}

/* Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
  }

  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .flash-message {
    padding: var(--space-sm) var(--space-md);
    border-radius: 10px;
  }

  .flash-message__text {
    font-size: 13px;
  }

  .flash-message__icon {
    font-size: 16px;
  }

  .flash-message__dismiss {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
}
</style>
