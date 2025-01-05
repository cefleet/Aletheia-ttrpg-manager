import { appState, updateAppState } from "./admin.js";
import {loadFiles, uploadFile} from "./files.js";
import renderThumbnails from "./thumbnails.js";
const CATEGORY = 'sprites';

export const sprites = (() => {
    const spriteList = document.getElementById('sprite-list');
    const uploadForm = document.getElementById('sprite-upload-form');
    const fileInput = document.getElementById('sprite-upload');

    const spriteScaleSlider = document.getElementById('sprite-scale');
    const scaleValueDisplay = document.getElementById('sprite-scale-value');
    const spriteRotationSlider = document.getElementById('sprite-rotation');
    const rotationValueDisplay = document.getElementById('sprite-rotation-value');
    const clearSpriteButton = document.getElementById('clear-sprite');

    const loadSprites = async () => {
        
        const sprites = await loadFiles(CATEGORY);

        const onClick = (file) => {
            updateAppState({ currentSprite: file });
            highlightCurrentSprite(file);
        }

        renderThumbnails(spriteList, sprites, onClick);
        
    };

    const highlightCurrentSprite = (currentSprite) => {
        document.querySelectorAll('.thumbnail').forEach(thumbnail => {
            thumbnail.classList.toggle('selected', thumbnail.dataset.image === currentSprite);
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

           await uploadFile(file, CATEGORY, loadSprites);
           fileInput.value = null;
        });
    };

    //add listeners
    spriteScaleSlider.addEventListener('input', () => {
        const scale = parseFloat(spriteScaleSlider.value);
        updateAppState({ spriteScale: scale });
        scaleValueDisplay.textContent = scale.toFixed(1);
    });

    spriteRotationSlider.addEventListener('input', () => {
        const rotation = parseInt(spriteRotationSlider.value, 10);
        updateAppState({ spriteRotation: rotation });
        rotationValueDisplay.textContent = rotation;
    });

    clearSpriteButton.addEventListener('click', ()=>{
        updateAppState({currentSprite:null});
        document.querySelectorAll('.thumbnail').forEach(thumbnail => {
            thumbnail.classList.toggle('selected', false);
        });
    })

    return {
        loadSprites,
        setupUploadForm,
    };
})();
