import { appState, updateAppState } from "./admin.js";
import {loadFiles, uploadFile} from "./files.js";
import renderThumbnails from "./thumbnails.js";
const CATEGORY = 'backgrounds';

export const backgrounds = (() => {
    const backgroundList = document.getElementById('background-list');
    const uploadForm = document.getElementById('background-upload-form');
    const fileInput = document.getElementById('background-upload');

    const backgroundScaleSlider = document.getElementById('background-scale');
    const scaleValueDisplay = document.getElementById('background-scale-value');
    const backgroundRotationSlider = document.getElementById('background-rotation');
    const rotationValueDisplay = document.getElementById('background-rotation-value');
    const clearBackgroundButton = document.getElementById('clear-background');

    const loadBackgrounds = async () => {
        
        const backgrounds = await loadFiles(CATEGORY);

        const onClick = (file) => {
            updateAppState({ currentBackground: file });
            highlightCurrentBackground(file);
        }

        renderThumbnails(backgroundList, backgrounds, onClick);
        
    };

    const highlightCurrentBackground = (currentBackground) => {
        document.querySelectorAll('.thumbnail').forEach(thumbnail => {
            thumbnail.classList.toggle('selected', thumbnail.dataset.image === currentBackground);
        });
    };

    const setupUploadForm = () => {
        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const file = fileInput.files[0];
            if (!file) {
                alert('Please select a file before uploading.');
                return;
            }

           await uploadFile(file, CATEGORY, loadBackgrounds);
           fileInput.value = null;
        });
    };

    //add listeners
    backgroundScaleSlider.addEventListener('input', () => {
        const scale = parseFloat(backgroundScaleSlider.value);
        updateAppState({ backgroundScale: scale });
        scaleValueDisplay.textContent = scale.toFixed(1);
    });

    backgroundRotationSlider.addEventListener('input', () => {
        const rotation = parseInt(backgroundRotationSlider.value, 10);
        updateAppState({ backgroundRotation: rotation });
        rotationValueDisplay.textContent = rotation;
    });

    clearBackgroundButton.addEventListener('click', ()=>{
        updateAppState({currentBackground:null});
        document.querySelectorAll('.thumbnail').forEach(thumbnail => {
            thumbnail.classList.toggle('selected', false);
        });
    })

    return {
        loadBackgrounds,
        setupUploadForm,
    };
})();
