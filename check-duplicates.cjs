const fs = require('fs');

const events = JSON.parse(fs.readFileSync('./src/data/events.json', 'utf8'));

// Count image usage
const imageMap = new Map();

events.forEach(event => {
  const img = event.image;
  if (!imageMap.has(img)) {
    imageMap.set(img, []);
  }
  imageMap.get(img).push(event.eventname);
});

// Find duplicates
console.log('Duplicate images found:\n');
let foundDuplicates = false;

imageMap.forEach((eventNames, img) => {
  if (eventNames.length > 1) {
    foundDuplicates = true;
    console.log(`Image: ${img}`);
    console.log(`Used by ${eventNames.length} events:`);
    eventNames.forEach(name => console.log(`  - ${name}`));
    console.log('');
  }
});

if (!foundDuplicates) {
  console.log('No duplicate images found!');
}
