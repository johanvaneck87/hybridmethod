const fs = require('fs');

/**
 * This script validates that new events have unique images
 * Usage: node validate-new-events.cjs
 */

const events = JSON.parse(fs.readFileSync('./src/data/events.json', 'utf8'));

// Count image usage
const imageMap = new Map();

events.forEach((event, index) => {
  const img = event.image;
  if (!imageMap.has(img)) {
    imageMap.set(img, []);
  }
  imageMap.get(img).push({
    index,
    id: event.id,
    name: event.eventname,
    date: event.startdate
  });
});

// Find duplicates
let hasDuplicates = false;

console.log('=== Image Duplication Check ===\n');

imageMap.forEach((eventList, img) => {
  if (eventList.length > 1) {
    hasDuplicates = true;
    console.log(`❌ DUPLICATE FOUND - ${eventList.length} events using:`);
    console.log(`   ${img}`);
    eventList.forEach(e => {
      console.log(`   - ${e.name} (${e.id})`);
    });
    console.log('');
  }
});

if (!hasDuplicates) {
  console.log('✅ All events have unique images!');
  process.exit(0);
} else {
  console.log('⚠️  Please ensure new events use unique images.');
  console.log('   Existing event images should never be changed.');
  process.exit(1);
}
