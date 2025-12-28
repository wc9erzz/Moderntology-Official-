
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../utils/tarotData.ts');
const outputPath = path.join(__dirname, '../public/tarot_prompts.md');

const fileContent = fs.readFileSync(inputPath, 'utf8');

// Regex to capture objects roughly
// This assumes the structure is consistent
const cardRegex = /name:\s*"([^"]+)",[\s\S]*?suit:\s*"([^"]+)",[\s\S]*?symbolism:\s*"([^"]+)"/g;

let match;
let cards = [];

while ((match = cardRegex.exec(fileContent)) !== null) {
    cards.push({
        name: match[1],
        suit: match[2],
        symbolism: match[3]
    });
}

const artStyle = "Art style: celestial gold and obsidian, mystical, highly detailed, ethereal, vector art style, flat design with rich textures, dark background with glowing gold accents.";

let mdContent = `# Tarot Card Generative Prompts\n\n**Style Token**: \`${artStyle}\`\n\n`;

const suits = ['major', 'wands', 'cups', 'swords', 'pentacles'];

suits.forEach(suit => {
    mdContent += `## ${suit.charAt(0).toUpperCase() + suit.slice(1)}\n\n`;
    cards.filter(c => c.suit === suit).forEach(c => {
        const prompt = `A Tarot card design for '${c.name}'. ${c.symbolism} ${artStyle}`;
        mdContent += `### ${c.name}\n\`\`\`\n${prompt}\n\`\`\`\n\n`;
    });
});

fs.writeFileSync(outputPath, mdContent);
console.log(`Generated prompts for ${cards.length} cards at ${outputPath}`);
