import AuthFormPreload from '~/app/[lang]/sign-in/_components/AuthFormPreload';
import ReturnedHeader from '../_components/ReturnedHeader';
import HeaderBalancer from '../_components/HeaderBalancer';

export default async function SignInPage() {
    return (
        <main className='flex h-full w-full max-w-xs flex-col items-center justify-center'>
            <ReturnedHeader />
            <AuthFormPreload />
            <HeaderBalancer />
        </main>
    );
}
