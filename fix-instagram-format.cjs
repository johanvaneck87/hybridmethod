const fs = require('fs');

// Function to format Instagram to @username
function formatInstagram(instagram) {
    if (!instagram || instagram === '') {
        return '';
    }

    instagram = instagram.trim();

    // If already starts with @, return as is
    if (instagram.startsWith('@')) {
        return instagram;
    }

    // Extract username from various Instagram URL formats
    const patterns = [
        /https?:\/\/(?:www\.)?instagram\.com\/([^/?]+)/i,
        /instagram\.com\/([^/?]+)/i,
        /@?([a-zA-Z0-9._]+)/
    ];

    for (const pattern of patterns) {
        const match = instagram.match(pattern);
        if (match) {
            // Remove trailing slash if present
            const username = match[1].replace(/\/$/, '');
            return '@' + username;
        }
    }

    // If no pattern matched, just add @ at the beginning
    return '@' + instagram;
}

// Read events.json
const eventsPath = './src/data/events.json';
const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

console.log(`📊 Totaal aantal events: ${eventsData.length}`);

let updatedCount = 0;

// Loop through all events and fix Instagram format
for (const event of eventsData) {
    if (event.instagram && event.instagram !== '') {
        const originalInstagram = event.instagram;
        const formattedInstagram = formatInstagram(event.instagram);

        if (originalInstagram !== formattedInstagram) {
            console.log(`\n🔄 Event: ${event.eventname}`);
            console.log(`   📷 Was: ${originalInstagram}`);
            console.log(`   ✅ Nu:  ${formattedInstagram}`);

            event.instagram = formattedInstagram;
            updatedCount++;
        }
    }
}

// Write updated data back to events.json
fs.writeFileSync(eventsPath, JSON.stringify(eventsData, null, 2), 'utf-8');

console.log(`\n✨ Klaar! ${updatedCount} events bijgewerkt met @username format.`);
console.log(`📁 Events opgeslagen in: ${eventsPath}`);
