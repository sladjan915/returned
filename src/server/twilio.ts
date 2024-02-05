import 'server-only';

import TwilioSDK from 'twilio';
import { env } from '~/env';

export const twilio = TwilioSDK(
    env.TWILIO_ACCOUNT_SID,
    env.TWILIO_MESSAGING_AUTH_TOKEN
);
