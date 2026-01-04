const fs = require('fs');

// Zoektermen met gewichten (30% fitness, 30% gym, 30% crossfit, 10% running)
const SEARCH_TERMS = [
  'fitness', 'fitness', 'fitness',  // 30%
  'gym', 'gym', 'gym',              // 30%
  'crossfit', 'crossfit', 'crossfit', // 30%
  'running'                          // 10%
];

const https = require('https');

let currentSearchIndex = 0;
let currentImageIndex = 0;
let currentHyroxImageIndex = 0; // Separate counter for HYROX images
const usedImageIds = new Set();

/**
 * Haal de volgende unieke Unsplash afbeelding (sequentieel, geen duplicaten)
 */
function getUnsplashImage(searchTerm) {
  return new Promise((resolve, reject) => {
    // HYROX-specifieke afbeeldingen (uitgebreid tot 12 unieke afbeeldingen)
    const hyroxImages = [
      'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=800&fit=crop'
    ];

    // Uitgebreide lijst van fitness-gerelateerde afbeeldingen van Unsplash (36 unieke afbeeldingen)
    const fitnessImages = [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1623874228601-f4193c7b1818?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1591940742878-13aba4b81587?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1547919307-1ecb10702e6f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1623874106121-3a39b18e2c79?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596357395217-80de13130e92?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1546817372-628669db4655?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1535743686920-55e4145369b9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1616279969856-759f316a5ac1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1593164842264-854604db2260?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1579758682665-53a1a614eea6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=800&h=800&fit=crop'
    ];

    // Gebruik HYROX afbeeldingen als searchTerm 'hyrox' is, anders fitness
    let imageUrl;
    if (searchTerm === 'hyrox') {
      // Voor HYROX events gebruiken we sequentiële selectie uit de HYROX lijst met aparte counter
      imageUrl = hyroxImages[currentHyroxImageIndex % hyroxImages.length];
      currentHyroxImageIndex++;
    } else {
      // Voor andere events gebruiken we sequentiële selectie uit de fitness lijst
      imageUrl = fitnessImages[currentImageIndex % fitnessImages.length];
      currentImageIndex++;
    }

    resolve(imageUrl);
  });
}

/**
 * Haal de volgende zoekterm
 */
function getNextSearchTerm() {
  const term = SEARCH_TERMS[currentSearchIndex];
  currentSearchIndex = (currentSearchIndex + 1) % SEARCH_TERMS.length;
  return term;
}

/**
 * Delay functie om rate limiting te respecteren
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Update alle events met unieke Unsplash afbeeldingen
 */
async function updateEventImages() {
  try {
    // Lees events.json
    const eventsPath = './src/data/events.json';
    const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

    console.log(`📊 Totaal aantal events: ${eventsData.length}`);

    // Verzamel eerst alle gebruikte afbeeldingen
    eventsData.forEach(event => {
      if (event.image && !event.image.includes('unsplash.com/photo-1517836357463')) {
        usedImageIds.add(event.image);
      }
    });

    console.log(`🖼️  Aantal reeds gebruikte unieke afbeeldingen: ${usedImageIds.size}`);

    let updatedCount = 0;

    // Loop door alle events
    for (let i = 0; i < eventsData.length; i++) {
      const event = eventsData[i];

      // Bepaal of dit specifieke events zijn die een nieuwe foto moeten krijgen
      // MAAR NIET hyrox-delft-2026 (die heeft een custom uploaded image)
      const needsUpdate = (event.image.includes('unsplash.com') ||
                          event.image.includes('source.unsplash.com') ||
                          event.image.includes('picsum.photos') ||
                          event.id === 'hexafit-sprint-series-tilburg-2026' ||
                          event.id === 'harbour-run-2026') &&
                          event.id !== 'hyrox-delft-2026';

      if (needsUpdate) {
        console.log(`\n🔄 Event ${i + 1}/${eventsData.length}: ${event.eventname}`);

        try {
          // Gebruik 'hyrox' als zoekterm voor HYROX events (check only organization field)
          let searchTerm;
          const isHyroxEvent = event.organizationgym && event.organizationgym.toUpperCase().includes('HYROX');
          if (isHyroxEvent) {
            searchTerm = 'hyrox';
          } else {
            searchTerm = getNextSearchTerm();
          }

          console.log(`   🔍 Zoekterm: ${searchTerm}${searchTerm === 'hyrox' ? ' (HYROX event)' : ''}`);

          const newImage = await getUnsplashImage(searchTerm);
          event.image = newImage;

          console.log(`   ✅ Nieuwe afbeelding: ${newImage}`);
          updatedCount++;

          // Korte delay om te voorkomen dat we te snel gaan
          await delay(100);
        } catch (error) {
          console.error(`   ❌ Fout bij ophalen afbeelding: ${error.message}`);
        }
      } else {
        console.log(`✓ Event ${i + 1}/${eventsData.length}: ${event.eventname} - heeft al een unieke afbeelding`);
      }
    }

    // Schrijf de bijgewerkte data terug naar events.json
    fs.writeFileSync(eventsPath, JSON.stringify(eventsData, null, 2));

    console.log(`\n✨ Klaar! ${updatedCount} events bijgewerkt met nieuwe afbeeldingen.`);
    console.log(`📁 Events opgeslagen in: ${eventsPath}`);

  } catch (error) {
    console.error('❌ Fout:', error);
  }
}

// Start het script
updateEventImages();
