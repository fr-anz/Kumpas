const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'training', 'labels.csv');
const outPath = path.join(__dirname, '..', 'data', 'labelToId.ts');

const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');

const map = {};

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length >= 2) {
        const id = parts[0];
        const label = parts[1];
        // Ensure uppercase comparison
        map[label.toUpperCase()] = id;
    }
}

const fileContent = `// Auto-generated mapping from labels.csv
export const labelToIdMap: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;

fs.writeFileSync(outPath, fileContent);
console.log('Created labelToId.ts');
