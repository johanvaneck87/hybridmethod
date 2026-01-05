const fs = require('fs');

// Read events.json
const eventsPath = './src/data/events.json';
const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

// GYMRACE English translation
const gymraceEnglish = "GYMRACE challenges you to test your fitness and have a great day. The average finish time is 1 hour and 20 minutes. You can race solo or with your buddy. With your buddy, you run together from start to finish and divide the work at the stations. There are different weights for women, men, and... there's the heavy category. In the heavy category, the strength stations are heavier. Choose a category that suits you and challenges you. You can do more than you think.";

let updatedCount = 0;

// Loop through all events and translate Dutch descriptions
for (const event of eventsData) {
    if (event.description && event.description.includes('Bij GYMRACE')) {
        console.log(`\n🔄 Translating: ${event.eventname} (${event.id})`);
        console.log(`   Was: ${event.description.substring(0, 50)}...`);

        event.description = gymraceEnglish;
        updatedCount++;

        console.log(`   ✅ Now: ${event.description.substring(0, 50)}...`);
    }
}

// Write updated data back to events.json
fs.writeFileSync(eventsPath, JSON.stringify(eventsData, null, 2), 'utf-8');

console.log(`\n✨ Done! ${updatedCount} event descriptions translated to English.`);
console.log(`📁 Events saved to: ${eventsPath}`);
