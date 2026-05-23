const fs = require('fs');

const path = 'src/screens/RecommendationsScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace tabs and tab styles
content = content.replace(
  "tabs: { paddingHorizontal: Spacing.base, gap: 8, paddingBottom: Spacing.sm, backgroundColor: Colors.surface, paddingTop: Spacing.sm },",
  "tabs: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm, backgroundColor: Colors.surface, paddingTop: Spacing.sm },"
);

// We need to add marginRight to tab since we removed gap
const targetTab = "tab: { paddingHorizontal: 16, minHeight: 38, justifyContent: 'center', alignItems: 'center', borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },";
const newTab = "tab: { paddingHorizontal: 20, paddingVertical: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },";
content = content.replace(targetTab, newTab);

// Also let's fix tabLabel to be explicitly clear
const targetLabel = "tabLabel: { fontSize: 14, lineHeight: 20, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },";
const newLabel = "tabLabel: { fontSize: 14, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary, flexShrink: 0 },";
content = content.replace(targetLabel, newLabel);

fs.writeFileSync(path, content);
console.log('Tabs fixed');
