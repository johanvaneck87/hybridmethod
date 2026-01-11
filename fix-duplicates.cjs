const fs = require('fs');

const events = JSON.parse(fs.readFileSync('./src/data/events.json', 'utf8'));

// New unique images for duplicates
const replacements = {
  '6BLOX': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=800&fit=crop',
  'Hybrid Games NL 3rd Edition': 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800&h=800&fit=crop',
  'RidderSterk': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=800&fit=crop',
  'STYREKX Amsterdam': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=800&fit=crop',
  'HYROX Simulation Valkenswaard': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&h=800&fit=crop',
  'HYROX Simulation 2BEFIT': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&h=800&fit=crop',
  'The Change Games': 'https://images.unsplash.com/photo-1598971861713-54ad16e4b744?w=800&h=800&fit=crop'
};

let modified = false;

events.forEach(event => {
  if (replacements[event.eventname]) {
    console.log(`Updating ${event.eventname}: ${event.image} -> ${replacements[event.eventname]}`);
    event.image = replacements[event.eventname];
    modified = true;
  }
});

if (modified) {
  fs.writeFileSync('./src/data/events.json', JSON.stringify(events, null, 2));
  console.log('\nSuccessfully updated events.json!');
} else {
  console.log('No changes needed.');
}
