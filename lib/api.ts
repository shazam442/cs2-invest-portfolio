// API client for communicating with backend
import dotenv from "dotenv"
import { createClient } from '@supabase/supabase-js'

dotenv.config()

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)