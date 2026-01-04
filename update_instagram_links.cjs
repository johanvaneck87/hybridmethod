const fs = require('fs');

// Read events.json
const eventsData = JSON.parse(fs.readFileSync('src/data/events.json', 'utf-8'));

// Function to extract Instagram username from URL
function extractInstagramUsername(url) {
  if (!url) return '';

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Extract username from various Instagram URL formats
  const patterns = [
    /instagram\.com\/([^/?]+)/i,
    /instagr\.am\/([^/?]+)/i,
    /@([^/?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Return with @ prefix
      return `@${match[1]}`;
    }
  }

  // If it's already in @username format, return as is
  if (url.startsWith('@')) {
    return url;
  }

  // If no match, return the original
  return url;
}

let updatedCount = 0;

for (const event of eventsData) {
  if (event.instagram) {
    const oldValue = event.instagram;
    const newValue = extractInstagramUsername(event.instagram);

    if (oldValue !== newValue) {
      console.log(`${event.eventname}:`);
      console.log(`  Old: ${oldValue}`);
      console.log(`  New: ${newValue}`);
      event.instagram = newValue;
      updatedCount++;
    }
  }
}

// Write updated data back to events.json
fs.writeFileSync('src/data/events.json', JSON.stringify(eventsData, null, 2), 'utf-8');

console.log(`\n✓ Updated ${updatedCount} Instagram links to @username format!`);
