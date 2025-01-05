const uploadForm = document.getElementById('upload-form');
const imageList = document.getElementById('image-list');
const gridToggle = document.getElementById('grid-toggle');
const imageScaleSlider = document.getElementById('image-scale');
const scaleValueDisplay = document.getElementById('scale-value');
const imageRotationSlider = document.getElementById('image-rotation');
const rotationValueDisplay = document.getElementById('rotation-value');
const gridSizeSlider = document.getElementById('grid-size');
const gridSizeValueDisplay = document.getElementById('grid-size-value');
const gridTypeSelect = document.getElementById('grid-type');

let appState = {
    currentImage: null,
    overlayImage: null,
    imageRotation: 0,
    imageScale: 1,
    grid: false,
    gridStyle: null,
    gridType: 'rectangle',
    gridSize: { w: 1, h: 1 },
};

// Fetch the current app state from the server
const fetchAppState = async () => {
    const response = await fetch('/current-state');
    if (!response.ok) {
        alert('Failed to fetch app state');
        return;
    }
    appState = await response.json();
    gridToggle.checked = appState.grid;
    imageScaleSlider.value = appState.imageScale || 1;
    scaleValueDisplay.textContent = appState.imageScale.toFixed(1);
    imageRotationSlider.value = appState.imageRotation || 0;
    rotationValueDisplay.textContent = appState.imageRotation || 0;
    gridSizeSlider.value = appState.gridSize.w || 1;
    gridSizeValueDisplay.textContent = appState.gridSize.w.toFixed(2);
    gridTypeSelect.value = appState.gridType || 'rectangle';
    highlightCurrentImage();
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
const highlightCurrentImage = () => {
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        const image = thumbnail.dataset.image;
        thumbnail.classList.toggle('selected', image === appState.currentImage);
    });
};

// Load available images and set up event listeners
const loadImages = async () => {
    const response = await fetch('/uploads');
    if (!response.ok) {
        alert('Failed to fetch uploaded images');
        return;
    }
    const images = await response.json();
    imageList.innerHTML = '';
    images.forEach(img => {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.dataset.image = img;

        const imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.alt = img;

        thumbnail.appendChild(imgElement);
        imageList.appendChild(thumbnail);

        thumbnail.addEventListener('click', () => {
            appState.currentImage = img;
            updateAppState();
            highlightCurrentImage();
        });
    });
    highlightCurrentImage();
};

// Event listeners
gridToggle.addEventListener('change', () => {
    appState.grid = gridToggle.checked;
    updateAppState();
});
imageScaleSlider.addEventListener('input', () => {
    const scale = parseFloat(imageScaleSlider.value);
    appState.imageScale = scale;
    scaleValueDisplay.textContent = scale.toFixed(1);
    updateAppState();
});
imageRotationSlider.addEventListener('input', () => {
    const rotation = parseInt(imageRotationSlider.value, 10);
    appState.imageRotation = rotation;
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
    const formData = new FormData(uploadForm);
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });
    if (response.ok) {
        alert('Image uploaded successfully');
        await loadImages();
    } else {
        alert('Failed to upload image');
    }
});

// Initial load
(async () => {
    await fetchAppState();
    await loadImages();
})();
