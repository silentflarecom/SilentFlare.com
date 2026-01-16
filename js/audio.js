/**
 * SilentFlare | Audio Module
 */

// Ensure App namespace exists
window.App = window.App || {};

App.Audio = {
    isPlaying: false,
    el: null,
    btnIcon: null,

    init() {
        this.el = document.getElementById('bg-music');
        const btn = document.getElementById('play-pause-btn');
        const slider = document.getElementById('volume-slider');

        if (!this.el || !btn) {
            console.warn("Audio elements not found.");
            return;
        }

        this.btnIcon = btn.querySelector('i');

        // Event Listeners
        btn.addEventListener('click', () => this.toggle());
        slider.addEventListener('input', (e) => {
            this.el.volume = e.target.value;
        });

        console.log("Audio Module Initialized.");
    },

    toggle() {
        if (!this.el) return;

        if (this.isPlaying) {
            this.el.pause();
        } else {
            this.el.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updateUI();
    },

    start() {
        if (!this.el) return;

        this.el.volume = 0.5; // Default volume
        // Attempt autoplay
        this.el.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
            console.log("Audio started automatically.");
        }).catch((err) => {
            console.log("Autoplay blocked by browser policy (normal). Waiting for user interaction.", err);
            this.isPlaying = false;
            this.updateUI();
        });
    },

    updateUI() {
        if (!this.btnIcon) return;
        this.btnIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
};
