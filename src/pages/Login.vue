<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuth } from "../../lib/authentication";

const { signIn } = useAuth();
const isLoading = ref(false);
const errorMessage = ref("");

const formData = reactive({
  email: "",
  password: "",
});

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (): boolean => {
  if (!formData.email.trim()) {
    errorMessage.value = "Email is required";
    return false;
  }

  if (!validateEmail(formData.email)) {
    errorMessage.value = "Please enter a valid email address";
    return false;
  }

  if (!formData.password.trim()) {
    errorMessage.value = "Password is required";
    return false;
  }

  if (formData.password.length < 6) {
    errorMessage.value = "Password must be at least 6 characters";
    return false;
  }

  return true;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const { data, error } = await signIn(formData.email, formData.password);

    if (error) {
      errorMessage.value =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
    } else {
      // Login successful - the App.vue will automatically show the dashboard
      console.log("Login successful:", data);
    }
  } catch (err) {
    errorMessage.value = "An unexpected error occurred. Please try again.";
    console.error("Login error:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    handleLogin();
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">dein Vater</h1>
        <p class="login-subtitle">Im sorry miss jackson, I am for <i>reeeaaaall</i></p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            autocomplete="email"
            class="form-input"
            :class="{ error: errorMessage && !formData.email.trim() }"
            placeholder="hans-peter@familie-müller.com"
            :disabled="isLoading"
            @keypress="handleKeyPress"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            autocomplete="current-password"
            class="form-input"
            :class="{ error: errorMessage && !formData.password.trim() }"
            placeholder="Hodenkobold123"
            :disabled="isLoading"
            @keypress="handleKeyPress"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
          :class="{ loading: isLoading }"
        >
          <span v-if="!isLoading">Sign In</span>
          <span v-else class="loading-spinner">Signing In...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-bg-muted) 0%,
    var(--color-surface) 100%
  );
  padding: 1rem;
}

.login-card {
  background: var(--color-bg);
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--color-border);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.login-subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.875rem;
  letter-spacing: 0.025em;
}

.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--color-bg);
  color: var(--color-text);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.login-button {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-button.loading {
  background: #6b7280;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner::after {
  content: "";
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.footer-text {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.footer-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-container {
    padding: 0.5rem;
  }

  .login-card {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 1.75rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: #1f2937;
    border-color: #374151;
  }

  .form-input {
    background: #111827;
    border-color: #374151;
    color: #f9fafb;
  }

  .form-input:focus {
    border-color: var(--color-accent);
  }

  .error-message {
    background: #7f1d1d;
    border-color: #991b1b;
    color: #fca5a5;
  }
}
</style>
