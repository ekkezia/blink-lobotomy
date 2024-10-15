import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lmgbcuolwhkqoowxnaik.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ2JjdW9sd2hrcW9vd3huYWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM4MzE5NDAsImV4cCI6MjAwOTQwNzk0MH0.bjHVqxQ8NTH1S0LeuHEpRaeliEcFEEqSoU0bJR1tYJs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
