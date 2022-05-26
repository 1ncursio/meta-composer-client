const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './react-components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        // colors: {
        //   transparent: 'transparent',
        //   current: 'currentColor',
        //   primary: {
        //     default: colors.amber['400'],
        //     hover: colors.amber['500'],
        //     active: colors.amber['600'],
        //     disabled: colors.amber['300'],
        //   },
        //   secondary: colors.sky['500'],
        //   success: '#5bc3a2',
        //   warning: '#ecbf58',
        //   danger: '#d84a49',
        //   info: '#6fb1c7',
        //   black: colors.gray['900'],
        //   gray: {
        //     50: colors.gray['50'],
        //     100: colors.gray['100'],
        //     200: colors.gray['200'],
        //     300: colors.gray['300'],
        //     400: colors.gray['400'],
        //     500: colors.gray['500'],
        //     600: colors.gray['600'],
        //     700: colors.gray['700'],
        //     800: colors.gray['800'],
        //   },
        //   white: colors.white,
        // },
        container: {
            center: true,
            padding: '0.5rem',
        },
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        styled: true,
        themes: [{
            light: {
                primary: '#f59e0b',
                'primary-focus': '#e67a00',
                'primary-content': '#ffffff',

                secondary: '#38bdf8',
                'secondary-focus': '#0ea5e9',
                'secondary-content': '#ffffff',

                accent: '#37cdbe',
                'accent-focus': '#2ba69a',
                'accent-content': '#ffffff',

                neutral: '#3b424e',
                'neutral-focus': '#2a2e37',
                'neutral-content': '#ffffff',

                'base-100': '#ffffff',
                'base-200': '#f9fafb',
                'base-300': '#ced3d9',
                'base-content': '#1e2734',

                info: '#1c92f2',
                success: '#009485',
                warning: '#ff9900',
                error: '#ff5724',

                '--rounded-box': '1rem',
                '--rounded-btn': '0.5rem',
                '--rounded-badge': '1.9rem',

                '--animation-btn': '0.25s',
                '--animation-input': '0.2s',

                '--btn-text-case': 'uppercase',
                '--navbar-padding': '0.5rem',
                '--border-btn': '1px',
            },
        }, ],
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        darkTheme: 'light',
    },
};