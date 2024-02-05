import AuthFormPreload from '~/app/sign-in/_components/AuthFormPreload';
import {
    ReturnedHeader,
    HeaderBalancer
} from '~/app/_components/ReturnedHeader';

export default async function SignIn() {
    return (
        <main className='flex h-full w-full max-w-xs flex-col items-center justify-center'>
            <ReturnedHeader />
            <AuthFormPreload />
            <HeaderBalancer />
        </main>
    );
}
