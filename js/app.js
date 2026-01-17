/**
 * SilentFlare - Application Logic
 * 
 * Background Media Configuration:
 * - Place your video files in the /vid folder
 * - Place your image files in the /pic folder
 * - Set your GitHub username and repo name below
 */

const GITHUB_CONFIG = {
    // Your GitHub username
    username: 'silentflarecom',
    // Your repository name (usually same as username.github.io or custom domain)
    repo: 'SilentFlare.com',
    // Branch name
    branch: 'main',
};

// Cache for media files (to avoid repeated API calls)
let mediaCache = {
    videos: null,
    pictures: null,
};

const mediaContainer = document.getElementById('media-container');

/**
 * Fetch file list from GitHub API
 */
async function fetchGitHubFiles(folder) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${folder}?ref=${GITHUB_CONFIG.branch}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`Failed to fetch ${folder} from GitHub API`);
            return [];
        }
        const files = await response.json();
        // Filter only files (not directories) and return names
        return files
            .filter(item => item.type === 'file')
            .map(item => item.name);
    } catch (error) {
        console.warn(`Error fetching ${folder}:`, error);
        return [];
    }
}

/**
 * Randomly selects an item from an array
 */
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Initializes the background with a random image or video
 */
async function initBackground() {
    if (!mediaContainer) return;
    mediaContainer.innerHTML = '';

    // Fetch media lists from GitHub (or use cache)
    if (!mediaCache.videos) {
        mediaCache.videos = await fetchGitHubFiles('vid');
    }
    if (!mediaCache.pictures) {
        mediaCache.pictures = await fetchGitHubFiles('pic');
    }

    const videos = mediaCache.videos;
    const pictures = mediaCache.pictures;

    const hasVideos = videos.length > 0;
    const hasPictures = pictures.length > 0;

    // Determine what to show
    let showVideo = false;
    if (hasVideos && hasPictures) {
        showVideo = Math.random() > 0.5;
    } else if (hasVideos) {
        showVideo = true;
    } else if (hasPictures) {
        showVideo = false;
    } else {
        console.warn('No media files found in vid/ or pic/ folders.');
        return;
    }

    if (showVideo) {
        const videoFile = getRandomItem(videos);
        createVideoElement(`vid/${videoFile}`);
    } else {
        const imageFile = getRandomItem(pictures);
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
        if (mediaCache.pictures && mediaCache.pictures.length > 0) {
            mediaContainer.innerHTML = '';
            const imageFile = getRandomItem(mediaCache.pictures);
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

/**
 * Randomizes the handwritten font family
 */
function randomizeFont() {
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

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    initBackground();
    createVisualizer();
    randomizeFont();
});
