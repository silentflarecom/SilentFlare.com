import { GITHUB_CONFIG } from '../config.js';

/**
 * Render GitHub Contribution Grid with Assembly Animation
 */
export async function renderContributionGrid() {
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
