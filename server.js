const { config } = require('dotenv');
config();
const constructContext = require("./create-context-for-gpt.js")

// const prepareData = require("./prepare-data.js");
// const { OpenAI } = require("openai");

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());

//const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY});

// Directory for storing uploaded images
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// In-memory application state
const appState = {
    currentBackground: null,
    overlayImage: null,
    backgroundRotation: 0,
    backgroundScale: 1,
    currentSprite: null,
    spriteScale: 1,
    spriteRotation: 0,
    grid: false,
    gridStyle: null,
    gridType: 'rectangle', // Default grid type
    gridSize: { w: 1, h: 1 },
};


// Admin view
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Display view
app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/display.html'));
});

app.get('/edit-pc-sheet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/edit-pc-sheet.html'));
});

app.get('/play-pc-sheet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/play-pc-sheet.html'));
});

// Get the current app state
app.get('/current-state', (req, res) => {
    res.json(appState);
});

// Middleware for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const category = req.body.category; // Expect 'category' from the client
            const categoryPath = path.join(UPLOAD_DIR, category);
            if (!fs.existsSync(categoryPath)) {
                fs.mkdirSync(categoryPath, { recursive: true });
            }
            cb(null, categoryPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    }),
});

app.post('/upload', upload.single('file'), (req, res) => {

    // Multer expects the field name to be 'file'
    const category = req.body.category;
    if (!category || !fs.existsSync(path.join(UPLOAD_DIR, category))) {
        return res.status(400).send('Invalid or missing category');
    }
    res.json({ filePath: `/uploads/${category}/${req.file.filename}` });
});


// List all files by category
app.get('/uploads/:category', (req, res) => {
    const categoryPath = path.join(UPLOAD_DIR, req.params.category);
    if (!fs.existsSync(categoryPath)) {
        return res.status(404).send('Category not found');
    }
    fs.readdir(categoryPath, (err, files) => {
        if (err) {
            console.error('Failed to read directory:', err);
            return res.status(500).send('Failed to retrieve files');
        }
        const fileUrls = files.map(file => `/uploads/${req.params.category}/${file}`);
        res.json(fileUrls);
    });
});


// app.post("/search", async (req, res) => {
//     try {
//       const { question, game } = req.body;

//       // Embed the user's question
//       const context = await constructContext(question, game);

//       console.log(context);

//       // Query ChatGPT with the context
//       const response = await openai.chat.completions.create({
//         //model: "gpt-3.5-turbo",
//         model:process.env.MODEL_NAME,
//         messages: [
//           { role: "system", content: `You are a highly knowledgeable assistant focused on answering questions about the Table Top RPG called (${game}) that this model has been trained on. Your knowldge does not go beyond the rulebook other then general understanding of languages. If a prompt request to create, generate, or otherwise develop a game component, inform the prompter that this is something you cannot do.` },
//           { role: "user", content: `Here is the context:\n${context}\n\nQuestion: ${question}` },
//         ],
//         max_tokens: 300,
//       });

//       console.log(response.choices[0].message)

//       res.json({ answer: response.choices[0].message });

//      //res.json({ context })
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error processing your request.");
//     }
//   });

// Serve static files
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));


// Update the app state
app.post('/set-state', express.json(), (req, res) => {
    const {
        currentBackground,
        overlayImage,
        backgroundRotation,
        backgroundScale,
        currentSprite,
        spriteRotation,
        spriteScale,
        grid,
        gridStyle,
        gridType, // Updated naming
        gridSize,
    } = req.body;
    if (overlayImage !== undefined) appState.overlayImage = overlayImage;

    if (currentBackground !== undefined) appState.currentBackground = currentBackground;
    if (backgroundRotation !== undefined) appState.backgroundRotation = backgroundRotation;
    if (backgroundScale !== undefined) appState.backgroundScale = backgroundScale;

    if (currentSprite !== undefined) appState.currentSprite = currentSprite;
    if (spriteRotation !== undefined) appState.spriteRotation = spriteRotation;
    if (spriteScale !== undefined) appState.spriteScale = spriteScale;

    if (grid !== undefined) appState.grid = grid;
    if (gridStyle !== undefined) appState.gridStyle = gridStyle;

    // Validate gridType and update if valid
    const validGridTypes = ['rectangle', 'flat-hex', 'pointy-hex'];
    if (gridType !== undefined && validGridTypes.includes(gridType)) {
        appState.gridType = gridType;
    }

    // Validate gridSize and update if valid
    if (gridSize !== undefined && typeof gridSize === 'object' && gridSize.w > 0 && gridSize.h > 0) {
        appState.gridSize = gridSize;
    }

    res.json(appState);
});

async function startup() {

    //await prepareData();


    app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
}

startup();

