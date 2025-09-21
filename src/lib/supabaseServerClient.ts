import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServerClient: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  { auth: { persistSession: false } }
);
