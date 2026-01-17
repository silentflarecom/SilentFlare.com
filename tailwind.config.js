module.exports = {
    content: ["./index.html", "./js/**/*.js"],
    theme: {
        extend: {
            colors: {
                'brand-sky': '#38bdf8',
                'brand-cyan': '#22d3ee',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'ken-burns': 'gentleSway 15s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                gentleSway: {
                    '0%': { transform: 'scale(1.05) translate(0, 0)' },
                    '25%': { transform: 'scale(1.05) translate(-1%, 0.5%)' },
                    '50%': { transform: 'scale(1.05) translate(0.5%, -1%)' },
                    '75%': { transform: 'scale(1.05) translate(-0.5%, -0.5%)' },
                    '100%': { transform: 'scale(1.05) translate(1%, 0.5%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        }
    },
    plugins: [],
}
