const fs = require('fs');
const path = require('path');

// 1. Export normaliseBusiness
const storePath = path.join(__dirname, 'src', 'store', 'businessStore.ts');
let storeContent = fs.readFileSync(storePath, 'utf8');
storeContent = storeContent.replace('const normaliseBusiness =', 'export const normaliseBusiness =');
fs.writeFileSync(storePath, storeContent, 'utf8');

// 2. Fix RecommendationsScreen
const recPath = path.join(__dirname, 'src', 'screens', 'RecommendationsScreen.tsx');
let recContent = fs.readFileSync(recPath, 'utf8');
if (!recContent.includes('normaliseBusiness')) {
    recContent = recContent.replace("import { useBusinessStore }", "import { useBusinessStore, normaliseBusiness }");
    recContent = recContent.replace(/res\.data\.data\.map\(\(b: any\) => \(\{ \.\.\.b, id: b\._id \?\? b\.id \}\)\)/g, "res.data.data.map(normaliseBusiness)");
    fs.writeFileSync(recPath, recContent, 'utf8');
}

// 3. Fix MapScreen
const mapPath = path.join(__dirname, 'src', 'screens', 'MapScreen.tsx');
let mapContent = fs.readFileSync(mapPath, 'utf8');
if (!mapContent.includes('<UrlTile')) {
    mapContent = mapContent.replace('{/* User radius circle */}', '<UrlTile urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />\n          {/* User radius circle */}');
    fs.writeFileSync(mapPath, mapContent, 'utf8');
}

console.log('Bugs fixed');
