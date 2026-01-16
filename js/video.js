/**
 * SilentFlare | Video Module
 */

// Ensure App namespace exists
window.App = window.App || {};

App.Video = {
    // Modify this list with your actual video filenames in assets/videos/
    list: [
        'video1.mp4',
        'video2.mp4',
        'video3.mp4'
    ],

    init() {
        const el = document.getElementById('bg-video');
        if (!el) {
            console.warn("Element #bg-video not found.");
            return;
        }

        // 1. Pick a random video
        const randomVideo = this.list[Math.floor(Math.random() * this.list.length)];

        // 2. Set the source
        // Note: This path is relative to index.html
        const videoPath = `assets/videos/${randomVideo}`;
        el.src = videoPath;

        // 3. Error Handling
        el.addEventListener('error', (e) => {
            console.warn(`Failed to load video: ${videoPath}. Make sure the file exists in 'assets/videos/'.`, e);
        });

        console.log(`Video Module Initialized. Attempting to play: ${videoPath}`);
    }
};
