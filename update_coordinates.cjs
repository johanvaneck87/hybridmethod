const fs = require('fs');
const https = require('https');

// Read events.json
const eventsData = JSON.parse(fs.readFileSync('src/data/events.json', 'utf-8'));

// Function to get coordinates from OpenStreetMap Nominatim API
async function getCoordinates(location, country) {
  return new Promise((resolve, reject) => {
    // Add country to search query for better results
    const searchQuery = country ? `${location}, ${country}` : location;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;

    const options = {
      headers: {
        'User-Agent': 'HybridMethod-EventMap/1.0'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results && results.length > 0) {
            resolve({
              lat: parseFloat(results[0].lat),
              lng: parseFloat(results[0].lon)
            });
          } else {
            console.warn(`No coordinates found for: ${searchQuery}`);
            resolve(null);
          }
        } catch (error) {
          console.error(`Error parsing response for ${searchQuery}:`, error);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.error(`Error fetching coordinates for ${searchQuery}:`, error);
      resolve(null);
    });
  });
}

// Function to delay between API calls (to respect rate limits)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateAllCoordinates() {
  console.log('Starting coordinate update for all events...\n');

  for (let i = 0; i < eventsData.length; i++) {
    const event = eventsData[i];
    console.log(`[${i + 1}/${eventsData.length}] Processing: ${event.eventname}`);
    console.log(`  Location: ${event.location}`);

    const coordinates = await getCoordinates(event.location, event.country);

    if (coordinates) {
      event.coordinates = coordinates;
      console.log(`  ✓ Updated coordinates: ${coordinates.lat}, ${coordinates.lng}`);
    } else {
      console.log(`  ✗ Could not find coordinates, keeping existing: ${event.coordinates.lat}, ${event.coordinates.lng}`);
    }

    // Wait 1 second between requests to respect Nominatim rate limits
    if (i < eventsData.length - 1) {
      await delay(1000);
    }
    console.log('');
  }

  // Write updated data back to events.json
  fs.writeFileSync('src/data/events.json', JSON.stringify(eventsData, null, 2), 'utf-8');
  console.log('✓ Successfully updated events.json with new coordinates!');
}

updateAllCoordinates().catch(error => {
  console.error('Error updating coordinates:', error);
  process.exit(1);
});
