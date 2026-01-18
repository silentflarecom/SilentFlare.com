import { GITHUB_CONFIG } from './config.js';

/**
 * Fetch file list from GitHub API
 */
export async function fetchGitHubFiles(folder) {
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
export function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
