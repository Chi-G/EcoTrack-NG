import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#10B981',
                    dark: '#059669',
                },
                secondary: '#064E3B',
                accent: '#F59E0B',
            },
            backgroundImage: {
                'emerald-grad': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            }
        },
    },

    plugins: [forms],
};
