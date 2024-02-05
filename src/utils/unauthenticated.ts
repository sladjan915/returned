import 'server-only';

import { redirect } from 'next/navigation';
import { api } from '~/trpc/server';

export async function ensureAuthenticated() {
    try {
        await api.auth.getUser.query();
    } catch {
        redirect('/sign-in');
    }
}

export async function ensureNotAuthenticated() {
    try {
        console.log(await api.auth.getUser.query());
        redirect('/dashboard');
    } catch {}
}
