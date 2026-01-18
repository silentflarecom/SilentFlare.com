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
 * Randomizes the handwritten font family
 */

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

/**
 * Render GitHub Contribution Grid with Assembly Animation
 */
async function renderContributionGrid() {
    const gridContainer = document.getElementById('contrib-grid');
    if (!gridContainer) return;

    // Fetch real contribution data from public API
    const apiUrl = `https://github-contributions-api.jogruber.de/v4/${GITHUB_CONFIG.username}?y=last`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();

        // The API returns { total: {...}, contributions: [ { date, count, level }, ... ] }
        if (data.contributions && data.contributions.length > 0) {
            renderRealGrid(gridContainer, data.contributions);
        } else {
            throw new Error('No contribution data');
        }

    } catch (e) {
        console.warn('Failed to fetch GitHub data, using mock:', e);
        generateMockGrid(gridContainer);
    }
}

/**
 * Render grid from real GitHub contribution data
 */
function renderRealGrid(container, contributions) {
    container.innerHTML = '';

    // Group contributions by week (7 days per column)
    const weeks = [];
    let currentWeek = [];

    contributions.forEach((day, index) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    // Add remaining days as last week
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // Render weeks as columns
    weeks.forEach((week, weekIndex) => {
        const col = document.createElement('div');
        col.className = 'week-col';

        week.forEach((day, dayIndex) => {
            const dayEl = document.createElement('div');
            dayEl.className = 'contrib-day';

            // Level is 0-4 from the API
            const level = day.level || 0;
            dayEl.classList.add(`level-${level}`);

            // Add tooltip with date and count
            dayEl.title = `${day.date}: ${day.count} contributions`;

            // Staggered animation delay
            const delay = (weekIndex * 0.04) + (dayIndex * 0.05);
            dayEl.style.animationDelay = `${delay}s`;

            col.appendChild(dayEl);
        });

        container.appendChild(col);
    });
}

/**
 * Generate mock grid as fallback
 */
function generateMockGrid(container) {
    container.innerHTML = '';
    const weeks = 53;
    const daysPerWeek = 7;

    for (let w = 0; w < weeks; w++) {
        const col = document.createElement('div');
        col.className = 'week-col';

        for (let d = 0; d < daysPerWeek; d++) {
            const day = document.createElement('div');
            day.className = 'contrib-day';

            const r = Math.random();
            let level = 0;
            if (r > 0.70) level = 1;
            if (r > 0.85) level = 2;
            if (r > 0.92) level = 3;
            if (r > 0.97) level = 4;

            day.classList.add(`level-${level}`);

            const delay = (w * 0.04) + (d * 0.05);
            day.style.animationDelay = `${delay}s`;

            col.appendChild(day);
        }
        container.appendChild(col);
    }
}

/**
 * Initialize Mouse Interactions (Spotlight & Parallax)
 */
/**
 * Initialize Mouse Interactions (3D Tilt & Spotlight)
 */
function initInteractions() {
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
function initMagneticButtons() {
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
function initTypingEffect() {
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

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    initBackground();
    randomizeFont();
    renderContributionGrid();
    initInteractions();
    initMagneticButtons();
    initTypingEffect();
});

