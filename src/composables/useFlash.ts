import { ref, reactive, computed } from "vue";

/**
 * Flash Message Composable
 *
 * Provides a comprehensive flash message system for Vue 3 applications.
 *
 * Features:
 * - Multiple message types (success, error, warning, info)
 * - Auto-dismiss with configurable timeout
 * - Manual dismissal
 * - Global state management
 * - TypeScript support
 * - Accessibility features
 *
 * Usage:
 * ```typescript
 * import { useFlash } from '@/composables/useFlash'
 *
 * const { success, error, warning, info, addFlash } = useFlash()
 *
 * // Simple usage
 * success('Operation completed successfully!')
 * error('Something went wrong!')
 *
 * // Advanced usage with options
 * addFlash('Custom message', {
 *   type: 'info',
 *   duration: 10000, // 10 seconds
 *   dismissible: false
 * })
 * ```
 */

export type FlashMessageType = "success" | "error" | "warning" | "info";

export interface FlashMessage {
  id: string;
  type: FlashMessageType;
  message: string;
  duration?: number;
  dismissible?: boolean;
  timestamp: number;
}

export interface FlashOptions {
  duration?: number;
  dismissible?: boolean;
  type?: FlashMessageType;
}

const flashMessages = ref<FlashMessage[]>([]);
let messageIdCounter = 0;

export function useFlash() {
  // Generate unique ID for each message
  const generateId = (): string => {
    return `flash-${Date.now()}-${++messageIdCounter}`;
  };

  // Add a new flash message
  const addFlash = (message: string, options: FlashOptions = {}): string => {
    const id = generateId();
    const flashMessage: FlashMessage = {
      id,
      type: options.type || "info",
      message,
      duration: options.duration ?? 5000, // Default 5 seconds
      dismissible: options.dismissible ?? true,
      timestamp: Date.now(),
    };

    flashMessages.value.push(flashMessage);

    // Auto-dismiss if duration is set
    if (flashMessage.duration && flashMessage.duration > 0) {
      setTimeout(() => {
        removeFlash(id);
      }, flashMessage.duration);
    }

    return id;
  };

  // Remove a specific flash message
  const removeFlash = (id: string): void => {
    const index = flashMessages.value.findIndex((msg) => msg.id === id);
    if (index > -1) {
      flashMessages.value.splice(index, 1);
    }
  };

  // Clear all flash messages
  const clearAll = (): void => {
    flashMessages.value = [];
  };

  // Convenience methods for different message types
  const success = (
    message: string,
    options: Omit<FlashOptions, "type"> = {},
  ): string => {
    return addFlash(message, { ...options, type: "success" });
  };

  const error = (
    message: string,
    options: Omit<FlashOptions, "type"> = {},
  ): string => {
    return addFlash(message, { ...options, type: "error" });
  };

  const warning = (
    message: string,
    options: Omit<FlashOptions, "type"> = {},
  ): string => {
    return addFlash(message, { ...options, type: "warning" });
  };

  const info = (
    message: string,
    options: Omit<FlashOptions, "type"> = {},
  ): string => {
    return addFlash(message, { ...options, type: "info" });
  };

  // Computed properties
  const messages = computed(() => flashMessages.value);
  const hasMessages = computed(() => flashMessages.value.length > 0);
  const messageCount = computed(() => flashMessages.value.length);

  // Get messages by type
  const getMessagesByType = (type: FlashMessageType) => {
    return computed(() =>
      flashMessages.value.filter((msg) => msg.type === type),
    );
  };

  // Get latest message
  const latestMessage = computed(() => {
    if (flashMessages.value.length === 0) return null;
    return flashMessages.value[flashMessages.value.length - 1];
  });

  return {
    // State
    messages,
    hasMessages,
    messageCount,
    latestMessage,

    // Methods
    addFlash,
    removeFlash,
    clearAll,
    success,
    error,
    warning,
    info,
    getMessagesByType,
  };
}

// Global flash state for app-wide access
export const globalFlash = reactive({
  messages: flashMessages,
  hasMessages: computed(() => flashMessages.value.length > 0),
  messageCount: computed(() => flashMessages.value.length),
});
