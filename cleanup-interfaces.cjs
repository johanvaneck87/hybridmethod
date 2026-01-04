const fs = require('fs');

const files = [
  'src/components/EventMap.tsx',
  'src/components/EventTileImage.tsx',
  'src/components/EventsPage.tsx',
  'src/components/HybridRacesLandingPage.tsx',
  'src/components/HybridRacesPage.tsx',
  'src/components/InstagramPage.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove lines that look like interface properties
  const lines = content.split('\n');
  const cleaned = [];
  let skipUntilClosingBrace = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if this looks like a leftover interface property
    if (trimmed.match(/^(id|eventname|localgym|organizationgym|startdate|enddate|location|coordinates|typerace|divisions|ticketpricelow|ticketpricehigh|fitnessobstacle|indooroutdoor|hyroxworkout|description|image|instagram|website|ticketUrl|workout|weights|contactEmail|country|name|date|type|difficulty|url):/)) {
      skipUntilClosingBrace = true;
      continue;
    }

    // Check if this is a standalone closing brace after skipping
    if (skipUntilClosingBrace && trimmed === '}') {
      skipUntilClosingBrace = false;
      continue;
    }

    if (!skipUntilClosingBrace) {
      cleaned.push(line);
    }
  }

  content = cleaned.join('\n');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed ${file}`);
});

console.log('Done!');
