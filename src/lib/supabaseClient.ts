import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = "https://pvzqiogmdepnvkuozyaz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey
);
