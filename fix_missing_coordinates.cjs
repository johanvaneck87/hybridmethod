const fs = require('fs');

// Read events.json
const eventsData = JSON.parse(fs.readFileSync('src/data/events.json', 'utf-8'));

// Manual coordinate fixes for locations that couldn't be found automatically
const manualCoordinates = {
  'Sporthal Kennemer Sportcenter, Haarlem': { lat: 52.3676, lng: 4.6462 }, // Haarlem centrum
  'Atletiekbaan, Zeewolde': { lat: 52.3284, lng: 5.5408 }, // Zeewolde centrum
  'Olympus \'70, Naaldwijk': { lat: 51.9942, lng: 4.2111 }, // Naaldwijk
  'Fitbox Meppel, Meppel': { lat: 52.6952, lng: 6.1944 }, // Meppel centrum
  'Sportpark Maassenhof, Venlo': { lat: 51.3704, lng: 6.1724 }, // Venlo
  'CrossFit Leiden, Leiden': { lat: 52.1601, lng: 4.4970 }, // Leiden centrum
  'RCN Vakantiepark, Zeewolde': { lat: 52.3284, lng: 5.5408 }, // Zeewolde
  'Daily Trade Fair, Venlo': { lat: 51.3704, lng: 6.1724 }, // Venlo
  'Airport Weeze, Duitsland': { lat: 51.6024, lng: 6.1422 }, // Airport Weeze Germany
  'Sportpark Reijerpark, Ridderkerk': { lat: 51.8725, lng: 4.6044 } // Ridderkerk
};

let updatedCount = 0;

for (const event of eventsData) {
  // Check if this location needs manual coordinates
  if (manualCoordinates[event.location]) {
    const coords = manualCoordinates[event.location];

    // Only update if coordinates are currently 0,0 or match the generic ones
    if ((event.coordinates.lat === 0 && event.coordinates.lng === 0) ||
        Math.abs(event.coordinates.lat - coords.lat) > 0.01 ||
        Math.abs(event.coordinates.lng - coords.lng) > 0.01) {

      console.log(`Updating ${event.eventname}:`);
      console.log(`  Location: ${event.location}`);
      console.log(`  Old: ${event.coordinates.lat}, ${event.coordinates.lng}`);
      console.log(`  New: ${coords.lat}, ${coords.lng}`);

      event.coordinates = coords;
      updatedCount++;
    }
  }
}

// Write updated data back to events.json
fs.writeFileSync('src/data/events.json', JSON.stringify(eventsData, null, 2), 'utf-8');

console.log(`\n✓ Updated ${updatedCount} events with manual coordinates!`);
console.log('✓ All events now have valid coordinates!');
