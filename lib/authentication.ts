import { ref, computed } from "vue";
import supabase from "./api";
import type { User, Session } from "@supabase/supabase-js";

// Global authentication state
const user = ref<User | null>(null);
const session = ref<Session | null>(null);
const isLoading = ref(true);

// Initialize authentication state
const initAuth = async () => {
  try {
    // Get initial session
    const {
      data: { session: initialSession },
    } = await supabase.auth.getSession();
    session.value = initialSession;
    user.value = initialSession?.user ?? null;

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession;
      user.value = newSession?.user ?? null;
    });

    // Set up periodic session validation to catch expired sessions
    // This helps prevent the AuthSessionMissingError by keeping local state in sync
    setInterval(async () => {
      if (user.value) { // Only validate if user appears to be logged in
        await validateSession();
      }
    }, 30000); // Check every 30 seconds
  } catch (error) {
    console.error("Error initializing auth:", error);
  } finally {
    isLoading.value = false;
  }
};

// Session validation helper
const validateSession = async () => {
  try {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    // Update local state if it differs from actual session
    if (currentSession !== session.value) {
      session.value = currentSession;
      user.value = currentSession?.user ?? null;
    }
    
    return !!currentSession;
  } catch (error) {
    console.error("Error validating session:", error);
    // Clear local state on validation error
    session.value = null;
    user.value = null;
    return false;
  }
};

// Computed properties
const isAuthenticated = computed(() => !!user.value);
const isGuest = computed(() => !user.value);


// Authentication methods
const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

const signOut = async () => {
  try {
    // Validate current session state
    const hasValidSession = await validateSession();
    
    if (!hasValidSession) {
      // No active session, just clear local state
      session.value = null;
      user.value = null;
      return { error: null };
    }

    // Proceed with sign out if session exists
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    // Even if signOut fails, clear local state to prevent UI inconsistencies
    session.value = null;
    user.value = null;
    return { error };
  }
};


// Export authentication composable
export const useAuth = () => {
  return {
    // State
    user: computed(() => user.value),
    session: computed(() => session.value),
    isAuthenticated,
    isGuest,
    isLoading: computed(() => isLoading.value),

    // Methods
    signIn,
    signUp,
    signOut,
    validateSession,

    // Initialize auth (call this in main.ts)
    initAuth,
  };
};
