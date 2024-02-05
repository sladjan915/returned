import { fontFamily } from 'tailwindcss/defaultTheme';
import { type Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
    content: ['./src/**/*.tsx'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', ...fontFamily.sans]
            }
        }
    },
    darkMode: 'class',
    plugins: [daisyui]
} satisfies Config;
