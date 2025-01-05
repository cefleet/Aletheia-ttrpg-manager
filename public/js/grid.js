export const grid = (() => {
    const gridToggle = document.getElementById('grid-toggle');
    const gridTypeSelect = document.getElementById('grid-type');
    const gridSizeSlider = document.getElementById('grid-size');
    const gridSizeValueDisplay = document.getElementById('grid-size-value');
   

    const setupGrid = (updateAppState) => {
        gridToggle.addEventListener('change', () => {
            updateAppState({ grid: gridToggle.checked });
        });

        gridTypeSelect.addEventListener('change', (event) => {
            updateAppState({ gridType: event.target.value });
        });

        gridSizeSlider.addEventListener('input', () => {
            const size = parseFloat(gridSizeSlider.value);
            updateAppState({ gridSize: { w: size, h: size } });
            gridSizeValueDisplay.textContent = size.toFixed(2);
        });

    };

    return {
        setupGrid,
    };
})();
