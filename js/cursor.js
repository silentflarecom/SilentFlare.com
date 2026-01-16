/* Custom Cursor Logic */
document.addEventListener('DOMContentLoaded', () => {
    const cursorSpotlight = document.getElementById('cursor-spotlight');
    const cursorDot = document.getElementById('cursor-dot');

    // Only activate custom cursor on non-touch devices
    if (matchMedia('(pointer:fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorSpotlight.style.left = `${e.clientX}px`;
                cursorSpotlight.style.top = `${e.clientY}px`;
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
            });
        });

        // Add hover effects for interactive elements
        const interpretInteractive = (element) => {
            element.addEventListener('mouseenter', () => {
                cursorSpotlight.style.width = '150px';
                cursorSpotlight.style.height = '150px';
                cursorSpotlight.style.background = 'radial-gradient(circle, rgba(204, 255, 0, 0.3) 0%, rgba(138, 43, 226, 0.1) 40%, transparent 70%)';
            });
            element.addEventListener('mouseleave', () => {
                cursorSpotlight.style.width = '400px';
                cursorSpotlight.style.height = '400px';
                cursorSpotlight.style.background = 'radial-gradient(circle, rgba(204, 255, 0, 0.15) 0%, rgba(138, 43, 226, 0.05) 40%, transparent 70%)';
            });
        };

        const interactiveElements = document.querySelectorAll('a, button, .bento-item, .tech-card');
        interactiveElements.forEach(interpretInteractive);
    }
});
