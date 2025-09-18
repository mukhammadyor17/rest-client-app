import { createClient } from "@supabase/supabase-js";
import { UserRow } from "../types/supabase";

const supabaseUrl = "https://pvzqiogmdepnvkuozyaz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<{
  public: {
    Tables: {
      users: {
        Row: UserRow;
        insert: Omit<UserRow, "id">;
        Update: Partial<UserRow>;
      };
    };
  };
}>(supabaseUrl, supabaseAnonKey);
