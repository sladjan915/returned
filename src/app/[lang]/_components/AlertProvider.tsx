/* eslint-disable @typescript-eslint/no-empty-function */

'use client';

import {
    type PropsWithChildren,
    createContext,
    useContext,
    useState,
    useEffect,
    useRef
} from 'react';
import { cn } from '~/utils/cn';

type Alert = {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
};

const AlertContext = createContext<{
    showMessage: ({ message, type }: Alert) => void;
    showInfoMessage: (message: Alert['message']) => void;
    showSuccessMessage: (message: Alert['message']) => void;
    showWarningMessage: (message: Alert['message']) => void;
    showErrorMessage: (message: Alert['message']) => void;
}>({
    showMessage: () => {},
    showInfoMessage: () => {},
    showSuccessMessage: () => {},
    showWarningMessage: () => {},
    showErrorMessage: () => {}
});

export function useAlert() {
    return useContext(AlertContext);
}

export default function AlertProvider({ children }: PropsWithChildren) {
    const ALERT_DURATION = 3000;

    const [alert, setAlert] = useState<Alert>({ message: '', type: 'info' });
    const [isVisible, setVisible] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isVisible) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(
                () => setVisible(false),
                ALERT_DURATION
            );
        }
    }, [isVisible]);

    const showMessage = (alert: Alert) => {
        setAlert(alert);
        setVisible(true);
    };

    return (
        <>
            <Alert
                className={cn(
                    'pointer-events-none absolute bottom-5 left-1/2 max-w-xs origin-bottom -translate-x-1/2 scale-0 opacity-0 transition-all',
                    isVisible && 'scale-100 opacity-100'
                )}
                alert={alert}
            />
            <AlertContext.Provider
                value={{
                    showMessage,
                    showInfoMessage: (message) =>
                        showMessage({ message, type: 'info' }),
                    showSuccessMessage: (message) =>
                        showMessage({ message, type: 'success' }),
                    showWarningMessage: (message) =>
                        showMessage({ message, type: 'warning' }),
                    showErrorMessage: (message) =>
                        showMessage({ message, type: 'error' })
                }}
                children={children}
            />
        </>
    );
}

function Alert({ className, alert }: { className: string; alert: Alert }) {
    // DO NOT DELETE!
    // Tailwind needs this in order to create these classes.
    'alert-info alert-success alert-waring alert-error';

    return (
        <div
            className={cn(`alert alert-${alert.type}`, className)}
            role='alert'
        >
            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                className='h-6 w-6 stroke-current'
            >
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d={
                        alert.type === 'info'
                            ? 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            : alert.type === 'success'
                              ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                              : alert.type === 'warning'
                                ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                : alert.type === 'error'
                                  ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                                  : ''
                    }
                ></path>
            </svg>
            <span className='text-sm font-medium'>{alert.message}</span>
        </div>
    );
}
