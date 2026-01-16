/**
 * SilentFlare | Main Script
 * Orchestrates the application modules and overlay logic.
 */

// Ensure App namespace exists
window.App = window.App || {};

App.init = function () {
    console.log("App Initializing...");

    // Initialize Modules
    if (App.Video) App.Video.init();
    if (App.Audio) App.Audio.init();

    // Core Interaction: Enter Overlay
    const overlay = document.getElementById('enter-overlay');
    const main = document.getElementById('main-content');
    const player = document.getElementById('music-player');

    const enter = () => {
        // 1. Fade out overlay
        overlay.classList.add('fade-out');

        // 2. Show Main Content
        if (main) {
            main.classList.remove('hidden');
            setTimeout(() => main.classList.add('visible'), 100);
        }

        // 3. Show Music Player
        if (player) {
            player.classList.remove('hidden');
            setTimeout(() => player.classList.add('visible'), 600);
        }

        // 4. Start Audio (User interaction allows this now)
        if (App.Audio) App.Audio.start();

        // 5. Cleanup Overlay
        // Remove listener to prevent re-triggering
        overlay.removeEventListener('click', enter);
        // Remove from DOM/Layout after animation
        setTimeout(() => overlay.style.display = 'none', 800);
    };

    if (overlay) {
        overlay.addEventListener('click', enter);
    } else {
        console.warn("Enter overlay not found. Check HTML.");
    }
};

// Start the App when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
