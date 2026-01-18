/**
 * SilentFlare - Main Application Entry
 */

import { initBackground } from './modules/background.js';
import { renderContributionGrid } from './modules/github.js';
import { randomizeFont, initInteractions, initMagneticButtons, initTypingEffect } from './modules/effects.js';

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    initBackground();
    randomizeFont();
    renderContributionGrid();
    initInteractions();
    initMagneticButtons();
    initTypingEffect();
});
