import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { UNREACHABLE_CODE } from '~/utils/unreachable-code';
import { adminSupabase } from '~/server/supabase';
import { twilio } from '~/server/twilio';
import { raise } from '~/server/error';

export const itemRouter = createTRPCRouter({
    registerItem: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                tag: z.string()
            })
        )
        .mutation(
            async ({
                ctx: {
                    session: { user }
                },
                input: { id, tag }
            }) => {
                const { data: nonRegisteredItem } = await adminSupabase
                    .from('NonRegisteredItems')
                    .select()
                    .eq('id', id)
                    .single();

                if (!nonRegisteredItem) raise('item-not-available');

                const deletePromise = adminSupabase
                    .from('NonRegisteredItems')
                    .delete()
                    .eq('id', id)
                    .single();

                const registerItemPromise = adminSupabase
                    .from('RegisteredItems')
                    .insert({
                        id: nonRegisteredItem.id,
                        tag: tag,
                        ownerId: user.id,
                        createdAt: nonRegisteredItem.createdAt
                    });

                await Promise.all([deletePromise, registerItemPromise]);
            }
        ),
    unregisterItem: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(
            async ({
                ctx: {
                    session: { user }
                },
                input: { id }
            }) => {
                const { data: registeredItem } = await adminSupabase
                    .from('RegisteredItems')
                    .select()
                    .eq('id', id)
                    .single();

                if (!registeredItem) raise('item-not-registered');
                if (registeredItem.ownerId !== user.id)
                    raise('insufficent-permissions');

                await adminSupabase
                    .from('RegisteredItems')
                    .delete()
                    .eq('id', id)
                    .single();
            }
        ),
    getMyItems: protectedProcedure.query(
        async ({
            ctx: {
                session: { user }
            }
        }) => {
            const { data: myItems } = await adminSupabase
                .from('RegisteredItems')
                .select(`*, foundHistory:FoundItems (*)`)
                .eq('ownerId', user.id)
                .order('registeredAt', { ascending: false });

            return (
                myItems?.map(
                    (item) =>
                        ({
                            ...item,
                            status: item.foundHistory.some(
                                (item) => !item.isReturned
                            )
                                ? 'found'
                                : 'registered'
                        }) as const
                ) ?? []
            );
        }
    ),
    getItem: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx: { session }, input: { id } }) => {
            const nonRegisteredItemPromise = adminSupabase
                .from('NonRegisteredItems')
                .select()
                .eq('id', id)
                .single();

            const registeredItemPromise = adminSupabase
                .from('RegisteredItems')
                .select(`*, foundHistory:FoundItems (*)`)
                .eq('id', id)
                .single();

            const { data: nonRegisteredItem } = await nonRegisteredItemPromise;
            const { data: registeredItem } = await registeredItemPromise;

            const isNonRegistered = nonRegisteredItem !== null;
            const isRegistered = registeredItem !== null;
            const isFound =
                isRegistered &&
                registeredItem.foundHistory.some((item) => !item.isReturned);

            const isNonExistent = !isNonRegistered && !isRegistered;

            if (isNonExistent) {
                return { status: 'non-existent' } as const;
            }

            if (isNonRegistered) {
                return {
                    ...nonRegisteredItem,
                    status: 'non-registered'
                } as const;
            }

            if (isRegistered) {
                if (registeredItem.ownerId === session?.user.id) {
                    return {
                        ...registeredItem,
                        status: isFound ? 'found' : 'registered'
                    } as const;
                }

                return {
                    id: registeredItem.id,
                    createdAt: registeredItem.createdAt,
                    status: isFound ? 'found' : 'registered'
                } as const;
            }

            UNREACHABLE_CODE();
        }),
    notifyOwner: publicProcedure
        .input(
            z.object({
                itemId: z.string(),
                finderPhoneNumber: z.string()
            })
        )
        .mutation(async ({ input: { itemId, finderPhoneNumber } }) => {
            const { data: registeredItem } = await adminSupabase
                .from('RegisteredItems')
                .select(`*, foundHistory:FoundItems (*)`)
                .eq('id', itemId)
                .single();

            if (!registeredItem) raise('item-not-registered');
            if (registeredItem.foundHistory.some((item) => !item.isReturned))
                raise('owner-already-notified');

            const {
                data: { user: owner }
            } = await adminSupabase.auth.admin.getUserById(
                registeredItem.ownerId
            );

            if (!owner) raise('user-non-existent');

            await twilio.messages.create({
                body: `Someone has found your '${registeredItem.tag}'!\nContact them via this number for more information: ${finderPhoneNumber}`,
                from: '+19133533796',
                to: `+${owner.phone!}`
            });

            await adminSupabase.from('FoundItems').insert({
                id: registeredItem.id,
                finderPhoneNumber: finderPhoneNumber
            });
        }),
    markAsReturned: protectedProcedure
        .input(
            z.object({
                itemId: z.string()
            })
        )
        .mutation(
            async ({
                ctx: {
                    session: { user }
                },
                input: { itemId }
            }) => {
                const { data: registeredItem } = await adminSupabase
                    .from('RegisteredItems')
                    .select()
                    .eq('id', itemId)
                    .single();

                if (!registeredItem) raise('item-not-registered');
                if (registeredItem.ownerId !== user.id)
                    raise('insufficent-permissions');

                await adminSupabase
                    .from('FoundItems')
                    .update({
                        isReturned: true
                    })
                    .eq('id', itemId)
                    .eq('isReturned', false);
            }
        )
});
