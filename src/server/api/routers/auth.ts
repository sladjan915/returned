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

            if (error) throw Error(error.message);
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

                if (error) throw Error(error.message);
            }
        ),
    signOut: protectedProcedure.mutation(async ({ ctx: { supabase } }) => {
        const { error } = await supabase.auth.signOut();
        if (error) throw Error(error.message);
    }),
    getUser: protectedProcedure.query(
        ({
            ctx: {
                session: { user }
            }
        }) => user
    )
});
