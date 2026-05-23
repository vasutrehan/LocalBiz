const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens');

fs.readdirSync(screensDir).forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(screensDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Only match SafeAreaView inside an import statement from 'react-native'
    // A simple way is to match 'SafeAreaView,' or ', SafeAreaView' or 'SafeAreaView' inside the import block.
    // Let's do it carefully:
    // First find the react-native import block
    const rnImportRegex = /import\s+{([^}]+)}\s+from\s+['"]react-native['"]\s*;/;
    const match = content.match(rnImportRegex);
    
    if (match && match[1].includes('SafeAreaView')) {
        let newImports = match[1].replace(/\bSafeAreaView\b\s*,?/g, '');
        // Clean up trailing commas
        newImports = newImports.replace(/,\s*$/, '').replace(/^,\s*/, '');
        
        let newImportStatement = `import { ${newImports} } from 'react-native';`;
        if (newImports.trim() === '') {
            newImportStatement = ''; // removed all imports
        }
        
        content = content.replace(rnImportRegex, newImportStatement);
        
        // Add safe area context import
        if (!content.includes('react-native-safe-area-context')) {
            content = `import { SafeAreaView } from 'react-native-safe-area-context';\n` + content;
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed', file);
    }
  }
});
