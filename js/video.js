/**
 * SilentFlare | Video Module
 * Handles background video playback with smooth transitions
 */

// Ensure App namespace exists
window.App = window.App || {};

App.Video = {
    // Video configuration
    config: {
        // Number of videos available (video1.mp4, video2.mp4, ...)
        videoCount: 3,
        // Video file prefix
        prefix: 'video',
        // Video file extension
        extension: '.mp4',
        // Path to videos folder (relative to index.html)
        basePath: 'assets/videos/',
        // Fade duration in milliseconds
        fadeDuration: 1000
    },

    el: null,

    /**
     * Generate the video list dynamically
     * Creates array like ['video1.mp4', 'video2.mp4', 'video3.mp4']
     */
    getVideoList() {
        const list = [];
        for (let i = 1; i <= this.config.videoCount; i++) {
            list.push(`${this.config.prefix}${i}${this.config.extension}`);
        }
        return list;
    },

    /**
     * Initialize the video module
     */
    init() {
        this.el = document.getElementById('bg-video');
        if (!this.el) {
            console.warn("[Video] Element #bg-video not found.");
            return;
        }

        // Set initial opacity for fade effect
        this.el.style.opacity = '0';

        // Pick a random video
        const videoList = this.getVideoList();
        const randomVideo = videoList[Math.floor(Math.random() * videoList.length)];
        const videoPath = `${this.config.basePath}${randomVideo}`;

        // Set the source
        this.el.src = videoPath;

        // Event handlers
        this.el.addEventListener('loadeddata', () => this.onVideoLoaded());
        this.el.addEventListener('error', (e) => this.onVideoError(videoPath, e));
        this.el.addEventListener('ended', () => this.onVideoEnded());

        console.log(`[Video] Initialized. Loading: ${videoPath}`);
    },

    /**
     * Called when video has loaded successfully
     */
    onVideoLoaded() {
        // Fade in the video
        this.el.style.transition = `opacity ${this.config.fadeDuration}ms ease`;
        this.el.style.opacity = '1';
        console.log("[Video] Loaded successfully.");
    },

    /**
     * Called when video fails to load
     */
    onVideoError(videoPath, e) {
        console.warn(`[Video] Failed to load: ${videoPath}`, e);
        console.info("[Video] Make sure video files (video1.mp4, video2.mp4, ...) exist in 'assets/videos/'");
    },

    /**
     * Called when video playback ends (if loop is disabled)
     */
    onVideoEnded() {
        // Video element has loop attribute, this is fallback
        if (!this.el.loop) {
            this.playNextVideo();
        }
    },

    /**
     * Play the next random video with fade transition
     */
    playNextVideo() {
        const videoList = this.getVideoList();
        const currentSrc = this.el.src;
        let nextVideo;

        // Get a different video if possible
        do {
            nextVideo = videoList[Math.floor(Math.random() * videoList.length)];
        } while (videoList.length > 1 && currentSrc.includes(nextVideo));

        const videoPath = `${this.config.basePath}${nextVideo}`;

        // Fade out
        this.el.style.opacity = '0';

        setTimeout(() => {
            this.el.src = videoPath;
            console.log(`[Video] Switching to: ${videoPath}`);
        }, this.config.fadeDuration);
    }
};
