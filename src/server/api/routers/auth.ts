import { raise } from '~/server/error';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';

export const authRouter = createTRPCRouter({
    sendOTPCode: publicProcedure
        .input(
            z.object({
                phoneNumber: z.string()
            })
        )
        .mutation(async ({ ctx: { supabase }, input: { phoneNumber } }) => {
            const { error } = await supabase.auth.signInWithOtp({
                phone: phoneNumber
            });

            if (error) raise('unable-to-send-otp-code');
        }),
    verifyOTPCode: publicProcedure
        .input(
            z.object({
                phoneNumber: z.string(),
                otpCode: z.string()
            })
        )
        .mutation(
            async ({ ctx: { supabase }, input: { phoneNumber, otpCode } }) => {
                const { error } = await supabase.auth.verifyOtp({
                    phone: phoneNumber,
                    token: otpCode,
                    type: 'sms'
                });

                if (error) raise('unable-to-verify-otp-code');
            }
        ),
    signOut: protectedProcedure.mutation(async ({ ctx: { supabase } }) => {
        const { error } = await supabase.auth.signOut();

        if (error) raise('unable-to-sign-out');
    }),
    getUser: protectedProcedure.query(
        ({
            ctx: {
                session: { user }
            }
        }) => user
    )
});
