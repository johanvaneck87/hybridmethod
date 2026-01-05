const fs = require('fs');

// Read events.json
const eventsPath = './src/data/events.json';
const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

let updatedCount = 0;

// Loop through all events and fix country codes
for (const event of eventsData) {
    if (event.country === 'The Netherlands') {
        console.log(`✅ Fixed: ${event.eventname} - "The Netherlands" → "NL"`);
        event.country = 'NL';
        updatedCount++;
    }
}

// Write updated data back to events.json
fs.writeFileSync(eventsPath, JSON.stringify(eventsData, null, 2), 'utf-8');

console.log(`\n✨ Done! ${updatedCount} country codes fixed.`);
console.log(`📁 Events saved to: ${eventsPath}`);
