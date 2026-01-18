import { fetchGitHubFiles, getRandomItem } from '../utils.js';

// Cache for media files (to avoid repeated API calls)
let mediaCache = {
    videos: null,
    pictures: null,
};

const mediaContainer = document.getElementById('media-container');

/**
 * Initializes the background with a random image or video
 */
export async function initBackground() {
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
