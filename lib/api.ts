// API client for communicating with backend
import { createClient } from "@supabase/supabase-js";

const URL = 
  import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;

const TOKEN = 
  import.meta.env.VITE_SUPABASE_PUBLIC_ACCESS_TOKEN || process.env.VITE_SUPABASE_PUBLIC_ACCESS_TOKEN;

if (!URL || !TOKEN) {
  throw new Error(
    "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLIC_ACCESS_TOKEN were not found",
  );
}
const supabase = createClient(
  URL,
  TOKEN,
);

export default supabase;
