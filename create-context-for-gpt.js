
const MAX_CONTEXT_SIZE = 8 * 1024; // 8 kb

// Function to calculate the byte size of a string
function getStringSizeInBytes(str) {
    return Buffer.byteLength(str, 'utf8');
}

// Function to construct context based on a query
async function constructContext(query, game) {

    const { constants:{embeddings, documents, model} } = require("./prepare-data.js")

    console.log(!!model)

    if (!embeddings[game]) {
        throw new Error(`Game ${game} does not exist.`);
    }

    const queryEmbedding = (await model.embed([query])).arraySync()[0];

    const scoredDocs = Object.entries(embeddings[game]).map(([id, embedding]) => {
        const similarity = cosineSimilarity(queryEmbedding, embedding);
        return { id, similarity };
    });

    scoredDocs.sort((a, b) => b.similarity - a.similarity);


    let context = '';
    let currentSize = 0;

    for (const { id } of scoredDocs) {
        const docContent = JSON.stringify(documents[game][id]);
        const docSize = getStringSizeInBytes(docContent);

        if (currentSize + docSize > MAX_CONTEXT_SIZE) {
            break;
        }

        context += docContent + '\n';
        currentSize += docSize;
    }

    return context;
}

function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
}

module.exports = constructContext;