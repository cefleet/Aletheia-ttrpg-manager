const uploadForm = document.getElementById('upload-form');
const backgroundlist = document.getElementById('background-list');
const gridToggle = document.getElementById('grid-toggle');
const backgroundScaleSlider = document.getElementById('background-scale');
const scaleValueDisplay = document.getElementById('scale-value');
const backgroundRotationSlider = document.getElementById('background-rotation');
const rotationValueDisplay = document.getElementById('rotation-value');
const gridSizeSlider = document.getElementById('grid-size');
const gridSizeValueDisplay = document.getElementById('grid-size-value');
const gridTypeSelect = document.getElementById('grid-type');

let appState = {
    currentBackground: null,
    overlayImage: null,
    backgroundRotation: 0,
    backgroundScale: 1,
    grid: false,
    gridStyle: null,
    gridType: 'rectangle',
    gridSize: { w: 1, h: 1 },
};

// Current category (hardcoded to "backgrounds" for now)
const currentCategory = 'backgrounds';

// Fetch the current app state from the server
const fetchAppState = async () => {
    const response = await fetch('/current-state');
    if (!response.ok) {
        alert('Failed to fetch app state');
        return;
    }
    appState = await response.json();
    gridToggle.checked = appState.grid;
    backgroundScaleSlider.value = appState.backgroundScale || 1;
    scaleValueDisplay.textContent = appState.backgroundScale.toFixed(1);
    backgroundRotationSlider.value = appState.backgroundRotation || 0;
    rotationValueDisplay.textContent = appState.backgroundRotation || 0;
    gridSizeSlider.value = appState.gridSize.w || 1;
    gridSizeValueDisplay.textContent = appState.gridSize.w.toFixed(2);
    gridTypeSelect.value = appState.gridType || 'rectangle';
    highlightCurrentBackground();
};

// Update the app state on the server
const updateAppState = async () => {
    const response = await fetch('/set-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appState),
    });
    if (!response.ok) {
        alert('Failed to update app state');
    }
};

// Highlight the current image in the UI
const highlightCurrentBackground = () => {
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        const image = thumbnail.dataset.image;
        thumbnail.classList.toggle('selected', image === appState.currentBackground);
    });
};

// Load files for the current category
const loadFiles = async () => {
    const response = await fetch(`/uploads/${currentCategory}`);
    if (!response.ok) {
        alert('Failed to fetch uploaded files');
        return;
    }
    const files = await response.json();
    backgroundlist.innerHTML = '';
    files.forEach(file => {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.dataset.image = file;

        const imgElement = document.createElement('img');
        imgElement.src = file;
        imgElement.alt = file;

        thumbnail.appendChild(imgElement);
        backgroundlist.appendChild(thumbnail);

        thumbnail.addEventListener('click', () => {
            appState.currentBackground = file;
            updateAppState();
            highlightCurrentBackground();
        });
    });
    highlightCurrentBackground();
};

// Event listeners
gridToggle.addEventListener('change', () => {
    appState.grid = gridToggle.checked;
    updateAppState();
});
backgroundScaleSlider.addEventListener('input', () => {
    const scale = parseFloat(backgroundScaleSlider.value);
    appState.backgroundScale = scale;
    scaleValueDisplay.textContent = scale.toFixed(1);
    updateAppState();
});
backgroundRotationSlider.addEventListener('input', () => {
    const rotation = parseInt(backgroundRotationSlider.value, 10);
    appState.backgroundRotation = rotation;
    rotationValueDisplay.textContent = rotation;
    updateAppState();
});
gridSizeSlider.addEventListener('input', () => {
    const size = parseFloat(gridSizeSlider.value);
    appState.gridSize = { w: size, h: size };
    gridSizeValueDisplay.textContent = size.toFixed(2);
    updateAppState();
});
gridTypeSelect.addEventListener('change', (event) => {
    const selectedType = event.target.value;
    appState.gridType = selectedType;
    updateAppState();
});
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('category', currentCategory); // Add category to the form data
    

    formData.append('file', document.getElementById('background-upload').files[0]); // Explicitly add the file with the correct field name


    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('File uploaded successfully');
        await loadFiles(); // Reload files for the current category
    } else {
        alert('Failed to upload file');
    }
});


// Initial load
(async () => {
    await fetchAppState();
    await loadFiles();
})();
