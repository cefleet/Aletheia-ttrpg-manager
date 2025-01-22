const fs = require('fs/promises');
const path = require('path');
const tf = require("@tensorflow/tfjs-node");

const use = require("@tensorflow-models/universal-sentence-encoder");

let constants = {
  embeddings:{},
  documents:{},
  model:null
}

async function prepareData() {
  constants.model = await use.load();

  const rulebookDir = path.resolve(__dirname, 'rulebooks');

  const rulebooks = await fs.readdir(rulebookDir);

  for (const rulebookFileName of rulebooks) {
    let rulebookName, rulebookData;
    try {
      rulebookData = await fs.readFile(`${rulebookDir}/${rulebookFileName}`, 'utf-8');
      rulebookName = rulebookFileName.replace('.json', '');
    } catch (e) {
      console.warn(e);
      console.warn('Problem loading Rulebook')
    }
    constants.documents[rulebookName] = JSON.parse(rulebookData);

    createEmbeddings(rulebookName);

  }

}
async function createEmbeddings(gameName) {

  const rulebook = constants.documents[gameName];

  if (!constants.embeddings[gameName]) {
    constants.embeddings[gameName] = {}; // Initialize category
  }

  for (const [key, entry] of Object.entries(rulebook)) {
    const entryEmbedding = await constants.model.embed([JSON.stringify(entry)]);
    constants.embeddings[gameName][key] = entryEmbedding.arraySync()[0];
  }

}

module.exports = prepareData;
module.exports.constants = constants;