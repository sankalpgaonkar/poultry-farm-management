const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (() => {
      console.warn('Missing Supabase environment variables in backend – JWT-only auth will be used.');
      return {
        auth: {
          getUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
        },
      };
    })();

module.exports = supabase;
