import { type api } from '~/trpc/server';

export type Item = Awaited<ReturnType<typeof api.item.getItem.query>>;

export type RegisteredItem = Exclude<
    Exclude<Item, { ownerId: string }>,
    { status: 'non-existent' | 'non-registered' }
>;

export type MyItem = Extract<Item, { ownerId: string }>;
