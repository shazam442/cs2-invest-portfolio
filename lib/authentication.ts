import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import supabase from './api'
import type { User, Session } from '@supabase/supabase-js'

// Global authentication state
const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const isLoading = ref(true)

// Initialize authentication state
const initAuth = async () => {
  try {
    // Get initial session
    const { data: { session: initialSession } } = await supabase.auth.getSession()
    session.value = initialSession
    user.value = initialSession?.user ?? null

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  } catch (error) {
    console.error('Error initializing auth:', error)
  } finally {
    isLoading.value = false
  }
}

// Computed properties
const isAuthenticated = computed(() => !!user.value)
const isGuest = computed(() => !user.value)

// Authentication methods
const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

// Route guard function
const requireAuth = (_to: any, _from: any, next: any) => {
  if (isLoading.value) {
    // Wait for auth to initialize
    const unsubscribe = supabase.auth.onAuthStateChange(() => {
      unsubscribe.data.subscription.unsubscribe()
      if (isAuthenticated.value) {
        next()
      } else {
        next('/login')
      }
    })
  } else if (isAuthenticated.value) {
    next()
  } else {
    next('/login')
  }
}

// Guest-only route guard (for login page)
const requireGuest = (_to: any, _from: any, next: any) => {
  if (isLoading.value) {
    // Wait for auth to initialize
    const unsubscribe = supabase.auth.onAuthStateChange(() => {
      unsubscribe.data.subscription.unsubscribe()
      if (isGuest.value) {
        next()
      } else {
        next('/')
      }
    })
  } else if (isGuest.value) {
    next()
  } else {
    next('/')
  }
}

// Export authentication composable
export const useAuth = () => {
  const router = useRouter()

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
    
    // Navigation helpers
    redirectToLogin: () => router.push('/login'),
    redirectToDashboard: () => router.push('/'),
    
    // Initialize auth (call this in main.ts)
    initAuth
  }
}

// Export route guards
export { requireAuth, requireGuest }
