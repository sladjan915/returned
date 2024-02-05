import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        NODE_ENV: z
            .enum(['development', 'test', 'production'])
            .default('development'),

        NEXT_SUPABASE_SERVICE_ROLE_KEY: z.string(),

        IPINFO_API_KEY: z.string(),

        TWILIO_ACCOUNT_SID: z.string(),
        TWILIO_MESSAGING_AUTH_TOKEN: z.string()
    },

    client: {
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string()
    },

    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,

        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_SUPABASE_SERVICE_ROLE_KEY:
            process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY,

        IPINFO_API_KEY: process.env.IPINFO_API_KEY,

        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        TWILIO_MESSAGING_AUTH_TOKEN: process.env.TWILIO_MESSAGING_AUTH_TOKEN
    },

    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true
});
