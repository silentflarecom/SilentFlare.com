/**
 * SilentFlare - Application Logic
 * 
 * Background Media Configuration:
 * - Place your video files in the /vid folder
 * - Place your image files in the /pic folder
 * - Update the arrays below with your file names
 */

const MEDIA_CONFIG = {
    // List of video filenames in the /vid folder
    videos: [
        'singularity-station-moewalls-com.mp4',
        // Add more videos here...
    ],

    // List of image filenames in the /pic folder
    pictures: [
        'wallhaven-9oo8k1.jpg',
        // Add more images here...
    ],
};

const mediaContainer = document.getElementById('media-container');

/**
 * Randomly selects an item from an array
 */
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Initializes the background with a random image or video
 */
function initBackground() {
    if (!mediaContainer) return;
    mediaContainer.innerHTML = '';

    const hasVideos = MEDIA_CONFIG.videos.length > 0;
    const hasPictures = MEDIA_CONFIG.pictures.length > 0;

    // If both are available, randomly pick; otherwise use whichever exists
    let showVideo = false;
    if (hasVideos && hasPictures) {
        showVideo = Math.random() > 0.5;
    } else if (hasVideos) {
        showVideo = true;
    } else if (hasPictures) {
        showVideo = false;
    } else {
        // No media available, show a solid background
        console.warn('No media files configured.');
        return;
    }

    if (showVideo) {
        const videoFile = getRandomItem(MEDIA_CONFIG.videos);
        createVideoElement(`vid/${videoFile}`);
    } else {
        const imageFile = getRandomItem(MEDIA_CONFIG.pictures);
        createImageElement(`pic/${imageFile}`);
    }
}

/**
 * Creates and appends a video element
 */
function createVideoElement(src) {
    const video = document.createElement('video');
    video.src = src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.className = 'w-full h-full object-cover opacity-0 transition-opacity duration-1000';

    // Fade in when loaded
    video.oncanplay = () => video.classList.remove('opacity-0');

    // Handle error: fallback to image if available
    video.onerror = () => {
        console.warn(`Video failed to load: ${src}`);
        if (MEDIA_CONFIG.pictures.length > 0) {
            mediaContainer.innerHTML = '';
            const imageFile = getRandomItem(MEDIA_CONFIG.pictures);
            createImageElement(`pic/${imageFile}`);
        }
    };

    mediaContainer.appendChild(video);
}

/**
 * Creates and appends an image element with gentle sway animation
 */
function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = "Background";
    img.className = 'w-full h-full object-cover animate-ken-burns';

    // Handle error
    img.onerror = () => {
        console.warn(`Image failed to load: ${src}`);
    };

    mediaContainer.appendChild(img);
}

/**
 * Generate Visualizer Bars around the avatar
 */
function createVisualizer() {
    const container = document.getElementById('visualizer');
    if (!container) return;

    // Clear existing bars
    container.innerHTML = '';

    const totalBars = 36; // Number of bars

    for (let i = 0; i < totalBars; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');

        // Calculate angle for radial positioning
        const angle = (360 / totalBars) * i;

        // Randomize animation for irregular look
        const duration = 0.5 + Math.random() * 0.8; // 0.5s - 1.3s
        const delay = Math.random() * 1; // 0 - 1s delay

        // Position and animate
        bar.style.transform = `rotate(${angle}deg) translateY(-65px)`;
        bar.style.animation = `jump ${duration}s ease-in-out infinite alternate`;
        bar.style.animationDelay = `-${delay}s`;

        container.appendChild(bar);
    }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    initBackground();
    createVisualizer();
});
