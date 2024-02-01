import 'server-only';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

async function sendOTPCode({ phoneNumber }: { phoneNumber: string }) {
    const supabase = createServerActionClient({ cookies });

    await supabase.auth.signInWithOtp({
        phone: phoneNumber
    });
}

async function verifyOTPCode({
    phoneNumber,
    otpCode
}: {
    phoneNumber: string;
    otpCode: string;
}) {
    const supabase = createServerActionClient({ cookies });

    const authResponse = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpCode,
        type: 'sms'
    });

    return !!authResponse.data;
}

const Supabase = {
    sendOTPCode,
    verifyOTPCode
};

export default Supabase;
