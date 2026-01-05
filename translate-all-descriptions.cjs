const fs = require('fs');

// Read events.json
const eventsPath = './src/data/events.json';
const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

// English translations for each event type
const translations = {
  'HexaFit': 'HexaFit is the ultimate test of strength and endurance. Six strength and six endurance components challenge you to push your limits. Choose from 10K, 15K, or 21K distances and compete solo or in a team of 2. Whether you\'re a beginner or experienced athlete, HexaFit offers a challenge for everyone.',

  'Hybrid Games': 'Brings strength and endurance together. An outdoor race where hybrid athletes push themselves to the max in a unique combination of functional fitness and running.',

  'Myrox': 'Myrox - The ultimate HYROX race at Mifit. Test your endurance and fitness during our Myrox event with 8 challenging workout stations.',

  'GRIT Game': 'In a world where fitness races are becoming increasingly extreme, expensive, and complex, we\'re going back to basics. GRIT Game: raw, accessible, and pure - a test of your true grit.',

  'HYROX': 'HYROX is conquering the fitness world! The race was inspired by millions of athletes around the world who compete in the same global format. Eight 1km runs alternated with eight functional workout stations - a true test of fitness.',

  'HealthROX': 'New edition with extra heats and festival atmosphere. Challenge yourself as an athlete across 8 explosive workouts combined with running. Experience the ultimate fitness race in a vibrant setting.',

  'Hybride Extreme': 'Participants complete multiple HYROX/HYBRID BATTLE rounds, alternated with functional workouts. Or opt for the MAX variant with even more rounds. This is extreme hybrid fitness racing.',

  'HYROX Simulation': 'In mid-January 2026, FIT ELITE, the only true HYROX GYM in Zwolle, is organizing another HYROX SIM. This simulation race prepares you perfectly for official HYROX events.',

  'Hybride Battle': 'The next edition of the Hybrid Battle takes place on Saturday, March 7, 2026, at Daily Trade Fair in Amsterdam. An intense combination of strength, endurance, and functional fitness.',

  'Harbour Run': 'Rotterdam Harbour City! Discover it on October 4, 2026, during the 13th edition of the Harbour Run Rotterdam. Run through the iconic port with distances for every level.',

  'Protocol Series': 'Welcome to the beginning of a new standard in functional racing. Protocol 2026 is raw, intense, and unfiltered. No frills, just pure performance. Are you ready to set a new standard?'
};

let updatedCount = 0;

// Function to detect which event type and apply correct translation
function translateDescription(event) {
  // Check if description contains Dutch words
  const hasDutch = event.description && (
    event.description.includes(' je ') ||
    event.description.includes(' de ') ||
    event.description.includes('jouw') ||
    event.description.includes('Deze') ||
    event.description.includes('jezelf') ||
    event.description.includes('Daag') ||
    event.description.includes('Welkom') ||
    event.description.includes('Ontdek')
  );

  if (!hasDutch) return false;

  // Match to correct translation
  if (event.eventname.includes('HexaFit')) {
    event.description = translations['HexaFit'];
    return true;
  } else if (event.eventname.includes('Hybrid Games')) {
    event.description = translations['Hybrid Games'];
    return true;
  } else if (event.eventname.includes('Myrox')) {
    event.description = translations['Myrox'];
    return true;
  } else if (event.eventname.includes('GRIT Game')) {
    event.description = translations['GRIT Game'];
    return true;
  } else if (event.eventname.includes('HYROX Simulation')) {
    event.description = translations['HYROX Simulation'];
    return true;
  } else if (event.eventname.includes('HYROX')) {
    event.description = translations['HYROX'];
    return true;
  } else if (event.eventname.includes('HealthROX')) {
    event.description = translations['HealthROX'];
    return true;
  } else if (event.eventname.includes('Hybride Extreme')) {
    event.description = translations['Hybride Extreme'];
    return true;
  } else if (event.eventname.includes('Hybride Battle')) {
    event.description = translations['Hybride Battle'];
    return true;
  } else if (event.eventname.includes('Harbour Run')) {
    event.description = translations['Harbour Run'];
    return true;
  } else if (event.eventname.includes('Protocol Series')) {
    event.description = translations['Protocol Series'];
    return true;
  }

  return false;
}

// Loop through all events and translate
for (const event of eventsData) {
  if (translateDescription(event)) {
    console.log(`✅ Translated: ${event.eventname}`);
    updatedCount++;
  }
}

// Write updated data back to events.json
fs.writeFileSync(eventsPath, JSON.stringify(eventsData, null, 2), 'utf-8');

console.log(`\n✨ Done! ${updatedCount} event descriptions translated to English.`);
console.log(`📁 Events saved to: ${eventsPath}`);
