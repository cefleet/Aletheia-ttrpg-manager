const canvas = document.getElementById('image-canvas');
const context = canvas.getContext('2d');
let appState = {
    currentBackground: null,
    overlayImage: null,
    backgroundRotation: 0,
    backgroundScale: 1,
    currentSprite: null,
    spriteScale: 1,
    spriteRotation: 0,
    grid: false,
    gridStyle: 'rgba(255, 255, 255, 0.5)',
    gridType: 'rectangle',
    gridSize: { w: 1, h: 1 },
};

let previousState = JSON.stringify(appState);

// Resize canvas to match the window size
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderAppState();
};

// Fetch the current app state from the server
const fetchAppState = async () => {
    const response = await fetch('/current-state');
    if (!response.ok) {
        console.error('Failed to fetch app state');
        return null;
    }
    return await response.json();
};

// Draw a rectangle grid
const drawRectangleGrid = () => {
    const { w, h } = appState.gridSize;
    context.strokeStyle = appState.gridStyle;
    context.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += w * 50) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    for (let y = 0; y <= canvas.height; y += h * 50) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }
};

// Draw a flat-topped hex grid
const drawFlatHexGrid = () => {
    const radius = appState.gridSize.w * 25;
    const hexHeight = Math.sqrt(3) * radius;
    const hexWidth = 2 * radius;
    const xOffset = 3 / 2 * radius;
    const yOffset = hexHeight;

    context.strokeStyle = appState.gridStyle;
    context.lineWidth = 0.5;

    for (let row = 0; row < Math.ceil(canvas.height / yOffset); row++) {
        for (let col = 0; col < Math.ceil(canvas.width / xOffset); col++) {
            const x = col * xOffset;
            const y = row * yOffset + (col % 2 === 0 ? 0 : hexHeight / 2);
            drawHexagon(x, y, radius, false);
        }
    }
};

// Draw a pointy-topped hex grid
const drawPointyHexGrid = () => {
    const radius = appState.gridSize.w * 25;
    const hexHeight = 2 * radius;
    const hexWidth = Math.sqrt(3) * radius;
    const xOffset = hexWidth;
    const yOffset = 3 / 2 * radius;

    context.strokeStyle = appState.gridStyle;
    context.lineWidth = 0.5;

    for (let row = 0; row < Math.ceil(canvas.height / yOffset); row++) {
        for (let col = 0; col < Math.ceil(canvas.width / xOffset); col++) {
            const x = col * xOffset + (row % 2 === 0 ? 0 : hexWidth / 2);
            const y = row * yOffset;
            drawHexagon(x, y, radius, true);
        }
    }
};

// Draw a hexagon
const drawHexagon = (x, y, radius, isPointy) => {
    context.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = isPointy
            ? (Math.PI / 3) * i + Math.PI / 6
            : (Math.PI / 3) * i;
        const xOffset = x + radius * Math.cos(angle);
        const yOffset = y + radius * Math.sin(angle);
        if (i === 0) {
            context.moveTo(xOffset, yOffset);
        } else {
            context.lineTo(xOffset, yOffset);
        }
    }
    context.closePath();
    context.stroke();
};

// Render a grid based on grid type
const renderGrid = () => {
    if (!appState.grid) return;

    switch (appState.gridType) {
        case 'rectangle':
            drawRectangleGrid();
            break;
        case 'flat-hex':
            drawFlatHexGrid();
            break;
        case 'pointy-hex':
            drawPointyHexGrid();
            break;
        default:
            console.warn('Unknown grid type:', appState.gridType);
    }
};

// Render the app state on the canvas
const renderAppState = async () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (appState.currentBackground) {
        await drawTransformedImage(appState.currentBackground,'background');
    }

    if (appState.overlayImage) {
        await drawTransformedImage(appState.overlayImage);
    }

    renderGrid();

    console.log(appState.currentSprite)

    if (appState.currentSprite) {
        await drawTransformedImage(appState.currentSprite,'sprite');
    }
};

// Draw an image with transformations
const drawTransformedImage = async (imageSrc, type) => {
    if (!imageSrc) return;

    const image = new Image();
    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = imageSrc;
    });

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    context.save();
    context.translate(centerX, centerY);
    context.rotate((appState[`${type}Rotation`] || 0) * Math.PI / 180);
    const scale = appState[`${type}Scale`]|| 1;
    context.scale(scale, scale);

    const imageAspect = image.width / image.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight;
    if (imageAspect > canvasAspect) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imageAspect;
    } else {
        drawWidth = canvas.height * imageAspect;
        drawHeight = canvas.height;
    }

    context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    context.restore();
};

// Update app state and render only if changes are detected
const updateAppState = async () => {
    const newState = await fetchAppState();
    if (!newState) return;

    const newStateString = JSON.stringify(newState);
    if (newStateString !== previousState) {
        appState = newState;
        previousState = newStateString;
        renderAppState();
    }
};

// Initial setup
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
setInterval(updateAppState, 2000);
updateAppState();
