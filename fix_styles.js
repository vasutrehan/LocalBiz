const fs = require('fs');

const path = 'src/screens/RecommendationsScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const target1 = "tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },";
const replacement1 = "tab: { paddingHorizontal: 16, minHeight: 38, justifyContent: 'center', alignItems: 'center', borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },";

const target2 = "tabLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },";
const replacement2 = "tabLabel: { fontSize: 14, lineHeight: 20, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },";

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync(path, content);
console.log('Done');
