// API client for communicating with backend
import { createClient } from '@supabase/supabase-js'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ACCESS_TOKEN) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ACCESS_TOKEN must be set in .env')
}
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ACCESS_TOKEN
)

export default supabase