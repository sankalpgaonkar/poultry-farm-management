const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Missing Supabase environment variables in backend – JWT-only auth will be used.');
  // Stub so imports do not crash; Supabase-based auth will be skipped in middleware
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
    },
  };
}

module.exports = supabase;
