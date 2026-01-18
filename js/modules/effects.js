import { getRandomItem } from '../utils.js';

/**
 * Randomizes the handwritten font family
 */
export function randomizeFont() {
    const textElement = document.querySelector('.handwritten-path');
    if (!textElement) return;

    const fonts = [
        "'Dancing Script', cursive",
        "'Great Vibes', cursive",
        "'Sacramento', cursive"
    ];

    const randomFont = getRandomItem(fonts);
    textElement.style.fontFamily = randomFont;
    console.log(`Applied font: ${randomFont}`);
}

/**
 * Initialize Mouse Interactions (3D Tilt & Spotlight)
 */
export function initInteractions() {
    const glassPanel = document.querySelector('.glass-panel');
    const mediaContainer = document.getElementById('media-container');
    const mainContainer = document.querySelector('main');

    if (mainContainer) {
        // Add perspective to main container for 3D effect
        mainContainer.style.perspective = '1000px';
    }

    if (glassPanel) {
        // Add smooth transition for return
        glassPanel.style.transition = 'transform 0.1s ease-out';
    }

    if (mediaContainer) {
        // Set initial state to avoid jump on first mouse move
        // The scale needs to be > 1 to prevent edges showing during movement
        // 1.1 provides enough buffer for the 15px movement
        mediaContainer.style.transform = 'scale(1.1)';
        mediaContainer.style.transition = 'transform 0.1s ease-out'; // smooth movement
    }

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // 1. Spotlight Effect (Update CSS Variables)
        if (glassPanel) {
            const rect = glassPanel.getBoundingClientRect();
            const localX = x - rect.left;
            const localY = y - rect.top;
            glassPanel.style.setProperty('--mouse-x', `${localX}px`);
            glassPanel.style.setProperty('--mouse-y', `${localY}px`);

            // 2. 3D Tilt Effect logic
            // Calculate distance from center (normalized -1 to 1)
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Normalized coordinates (-1 to 1)
            const xPct = (x - centerX) / centerX;
            const yPct = (y - centerY) / centerY;

            // Rotate based on mouse position (max 3 degrees for subtle effect)
            // RotateX is controlled by Y position (tilt up/down)
            // RotateY is controlled by X position (tilt left/right)
            const rotateX = -yPct * 3;
            const rotateY = xPct * 3;

            // Use requestAnimationFrame for smoother performance if needed, 
            // but direct update with CSS transition 0.1s is often good enough for this scale.
            glassPanel.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1, 1, 1)
            `;
        }

        // Move background slightly (opposite direction for depth)
        if (mediaContainer) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const moveX = (x - centerX) / centerX;
            const moveY = (y - centerY) / centerY;

            const bgMove = 15;
            mediaContainer.style.transform = `scale(1.1) translate(${-moveX * bgMove}px, ${-moveY * bgMove}px)`;
        }
    });

    // Reset tilt on mouse leave
    document.addEventListener('mouseleave', () => {
        if (glassPanel) {
            // Slower transition for reset
            glassPanel.style.transition = 'transform 0.5s ease-out';
            glassPanel.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;

            // Reset transition after it settles
            setTimeout(() => {
                glassPanel.style.transition = 'transform 0.1s ease-out';
            }, 500);
        }
    });
}

/**
 * Initialize Magnetic Buttons
 */
export function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const btnCenterX = rect.left + rect.width / 2;
            const btnCenterY = rect.top + rect.height / 2;

            // Distance from center
            const x = e.clientX - btnCenterX;
            const y = e.clientY - btnCenterY;

            // Magnetic pull strength (higher divisor = weaker pull)
            const intensity = 4;

            // Instant follow
            btn.style.transition = 'transform 0s';
            btn.style.transform = `translate(${x / intensity}px, ${y / intensity}px) scale(1.1)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Elastic snapback
            btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

/**
 * Initialize Typing Effect
 */
export function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const phrases = [
        "Frontend Developer",
        "UI Designer",
        "Creative Coder",
        "Tech Enthusiast"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            // Deleting text
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deletion
        } else {
            // Typing text
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        // Cursor logic (add blinking cursor)
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Finished typing phrase
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new phrase
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing loop
    type();
}
