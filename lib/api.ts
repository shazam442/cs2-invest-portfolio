// API client for communicating with backend
import { createClient } from '@supabase/supabase-js'

if (!import.meta.env.SUPABASE_URL || !import.meta.env.SUPABASE_ACCESS_TOKEN) {
  throw new Error('SUPABASE_URL and SUPABASE_ACCESS_TOKEN must be set in .env')
}
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ACCESS_TOKEN
)

export default supabase