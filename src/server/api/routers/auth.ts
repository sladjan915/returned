import { createTRPCRouter, publicProcedure } from '../trpc';
import Supabase from '~/server/data/supabase';
import { z } from 'zod';

export const authRouter = createTRPCRouter({
    sendOTPCode: publicProcedure
        .input(
            z.object({
                phoneNumber: z.string()
            })
        )
        .mutation(({ input: { phoneNumber } }) =>
            Supabase.sendOTPCode({ phoneNumber })
        ),
    verifyOTPCode: publicProcedure
        .input(
            z.object({
                phoneNumber: z.string(),
                otpCode: z.string()
            })
        )
        .mutation(({ input: { phoneNumber, otpCode } }) =>
            Supabase.verifyOTPCode({ phoneNumber, otpCode })
        )
});
