const fs = require('fs');

const events = JSON.parse(fs.readFileSync('./src/data/events.json', 'utf8'));

// Count image usage
const imageMap = new Map();

events.forEach((event, index) => {
  const img = event.image;
  if (!imageMap.has(img)) {
    imageMap.set(img, []);
  }
  imageMap.get(img).push({ index, id: event.id, name: event.eventname });
});

// Available unique images for fitness/gym events
const availableImages = [
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1598971861713-54ad16e4b744?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&h=800&fit=crop'
];

let imageIndex = 0;
let modified = false;

// Fix duplicates - keep first occurrence, change others
imageMap.forEach((eventList, img) => {
  if (eventList.length > 1) {
    console.log(`\nFound ${eventList.length} events using: ${img}`);
    // Skip first, change others
    for (let i = 1; i < eventList.length; i++) {
      const event = eventList[i];
      // Find unused image
      let newImage;
      do {
        newImage = availableImages[imageIndex % availableImages.length];
        imageIndex++;
      } while (events.some(e => e.image === newImage));

      console.log(`  Changing ${event.name} (${event.id}) to new image`);
      events[event.index].image = newImage;
      modified = true;
    }
  }
});

if (modified) {
  fs.writeFileSync('./src/data/events.json', JSON.stringify(events, null, 2));
  console.log('\n✓ Successfully updated events.json!');
} else {
  console.log('No duplicates found.');
}
