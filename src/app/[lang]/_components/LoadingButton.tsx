import { type ElementProps } from '~/utils/element-props';
import { cn } from '~/utils/cn';

export default function LoadingButton({
    className,
    children,

    isLoading,
    ...props
}: ElementProps<'button'> & {
    isLoading: boolean;
}) {
    return (
        <button className={cn('btn btn-accent', className)} {...props}>
            {isLoading ? (
                <span className='loading loading-bars loading-xs' />
            ) : (
                children
            )}
        </button>
    );
}
