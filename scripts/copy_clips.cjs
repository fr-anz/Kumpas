const fs = require('fs');
const path = require('path');

const mapObj = {};

const srcDir = path.join(__dirname, '..', 'training', 'clips', 'clips');
const destDir = path.join(__dirname, '..', 'public', 'clips');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const folders = fs.readdirSync(srcDir);

folders.forEach(folder => {
    const folderPath = path.join(srcDir, folder);
    if (fs.statSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath).filter(f => f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.mov'));
        if (files.length > 0) {
            const firstFile = files[0];
            const srcFile = path.join(folderPath, firstFile);
            const ext = path.extname(firstFile).toLowerCase();
            const destFile = path.join(destDir, `${folder}${ext}`);
            fs.copyFileSync(srcFile, destFile);
            mapObj[folder] = `/clips/${folder}${ext}`;
            console.log(`Copied ${folder}/${firstFile} to public/clips/${folder}${ext}`);
        }
    }
});

const mapFilePath = path.join(__dirname, '..', 'data', 'clipMap.ts');
fs.writeFileSync(mapFilePath, `export const clipMap: Record<string, string> = ${JSON.stringify(mapObj, null, 2)};`);
console.log('Copy complete! Wrote clipMap.ts');
