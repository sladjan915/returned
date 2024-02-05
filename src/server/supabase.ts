import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';
import { type Database } from '~/types/supabase';

export const adminSupabase = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_SUPABASE_SERVICE_ROLE_KEY
);
