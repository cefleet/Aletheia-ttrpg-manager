// admin.js
import { backgrounds } from './backgrounds.js';
import {sprites} from "./sprites.js";
import { grid } from './grid.js';

import {question} from "./question.js";

let appState = {
    currentBackground: null,
    overlayBackground: null,
    backgroundRotation: 0,
    backgroundScale: 1,
    grid: false,
    gridStyle: null,
    gridType: 'rectangle',
    gridSize: { w: 1, h: 1 },
};

const fetchAppState = async () => {
    const response = await fetch('/current-state');
    if (!response.ok) {
        alert('Failed to fetch app state');
        return;
    }
    appState = await response.json();
    syncUIWithState();
};

const updateAppState = (newState) => {
    appState = { ...appState, ...newState };
    fetch('/set-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appState),
    }).catch(() => alert('Failed to update app state'));
};

const syncUIWithState = () => {
    document.getElementById('grid-toggle').checked = appState.grid;
    document.getElementById('grid-type').value = appState.gridType;
    document.getElementById('grid-size').value = appState.gridSize.w;
    document.getElementById('grid-size-value').textContent = appState.gridSize.w.toFixed(2);
    document.getElementById('background-scale').value = appState.backgroundScale;
    document.getElementById('background-scale-value').textContent = appState.backgroundScale.toFixed(1);
    document.getElementById('background-rotation').value = appState.backgroundRotation;
    document.getElementById('background-rotation-value').textContent = appState.backgroundRotation;

    document.getElementById('sprite-scale').value = appState.backgroundScale;
    document.getElementById('sprite-scale-value').textContent = appState.backgroundScale.toFixed(1);
    document.getElementById('sprite-rotation').value = appState.backgroundRotation;
    document.getElementById('sprite-rotation-value').textContent = appState.backgroundRotation;
};

// Initialize everything
(async () => {
    await fetchAppState();
    backgrounds.loadBackgrounds();
    backgrounds.setupUploadForm(updateAppState, backgrounds.loadFiles);
    sprites.loadSprites();
    sprites.setupUploadForm(updateAppState, sprites.loadFiles);
    grid.setupGrid(updateAppState);
    question.setupQuestion();
})();

export {
    appState,
    updateAppState,
    fetchAppState
}