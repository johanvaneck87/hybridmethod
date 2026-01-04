const fs = require('fs');
const path = require('path');

const files = [
  'src/components/EventDetailPage.tsx',
  'src/components/EventMap.tsx',
  'src/components/EventTileImage.tsx',
  'src/components/EventsPage.tsx',
  'src/components/HybridRacesLandingPage.tsx',
  'src/components/HybridRacesPage.tsx',
  'src/components/InstagramPage.tsx'
];

const eventInterfaceRegex = /interface Event \{[^}]*\}/s;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if file already has the import
  if (!content.includes("import type { Event } from '../types/Event'")) {
    // Remove the Event interface declaration
    content = content.replace(eventInterfaceRegex, '');

    // Add the import after other imports
    const importMatch = content.match(/(import .*\n)+/);
    if (importMatch) {
      const lastImportIndex = importMatch[0].lastIndexOf('\n');
      const beforeImports = content.substring(0, importMatch.index + lastImportIndex + 1);
      const afterImports = content.substring(importMatch.index + lastImportIndex + 1);
      content = beforeImports + "import type { Event } from '../types/Event'\n" + afterImports;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Skipped ${file} - already has import`);
  }
});

console.log('Done!');
