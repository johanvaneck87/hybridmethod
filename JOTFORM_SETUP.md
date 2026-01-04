# Jotform Setup Instructies voor Submit Event Formulier

## Stap 1: Maak Jotform Account
1. Ga naar https://www.jotform.com
2. Maak een gratis account aan
3. Login en klik op "Create Form"

## Stap 2: Maak het formulier

### Formulier Settings:
- **Titel**: Submit a Hybrid Race Event
- **Theme**: Dark theme (past bij de website)

### Velden toevoegen (in deze volgorde):

1. **Event Name** - Short Text
   - Label: "Event Name"
   - Required: Yes
   - Placeholder: "e.g. Amsterdam Hybrid Challenge"

2. **Local Gym Event?** - Dropdown
   - Label: "Local Gym Event?"
   - Options: "Yes", "No"
   - Required: Yes

3. **Organisation / Gym** - Short Text
   - Label: "Organisation / Gym"
   - Required: Yes
   - Placeholder: "e.g. HYROX, CrossFit Amsterdam"

4. **Location** - Short Text
   - Label: "Location"
   - Required: Yes
   - Placeholder: "e.g. RAI, Amsterdam, Netherlands"

5. **Start Date** - Date Picker
   - Label: "Start Date"
   - Required: Yes
   - Date Format: DD/MM/YYYY

6. **End Date** - Date Picker
   - Label: "End Date (leave empty if single day)"
   - Required: No
   - Date Format: DD/MM/YYYY

7. **Type Race** - Checkboxes
   - Label: "Type Race (select all that apply)"
   - Options:
     - Solo
     - Duo / Buddy
     - Relay
     - Team
   - Required: Yes (at least one)

8. **Divisions** - Checkboxes
   - Label: "Divisions (select all that apply)"
   - Options:
     - Open / Normal
     - Pro / Heavy
   - Required: Yes (at least one)

9. **Ticket Price Low** - Short Text
   - Label: "Ticket Price Low (€)"
   - Required: No
   - Placeholder: "0 or 'Uitverkocht'"

10. **Ticket Price High** - Short Text
    - Label: "Ticket Price High (€)"
    - Required: No
    - Placeholder: "100"

11. **Fitness / Obstacle** - Dropdown
    - Label: "Fitness / Obstacle"
    - Options: "Fitness", "Obstacle"
    - Required: Yes
    - Default: "Fitness"

12. **Indoor / Outdoor** - Dropdown
    - Label: "Indoor / Outdoor"
    - Options: "Indoor", "Outdoor", "Indoor & Outdoor"
    - Required: Yes

13. **HYROX Workout** - Dropdown
    - Label: "HYROX Workout"
    - Options: "Yes", "No"
    - Required: Yes
    - Default: "No"

14. **About This Event** - Long Text
    - Label: "About This Event"
    - Required: Yes
    - Placeholder: "Describe the event, what makes it special, what participants can expect..."
    - Rows: 6

15. **Event Image** - File Upload ⭐
    - Label: "Event Image"
    - Required: Yes
    - Allowed file types: jpg, jpeg, png, webp
    - Max file size: 5MB
    - Instructions: "Upload a high-quality event image (minimum 800x800px recommended)"

16. **Instagram** - Short Text
    - Label: "Instagram (link)"
    - Required: No
    - Input Type: URL
    - Placeholder: "https://instagram.com/..."

17. **Website** - Short Text
    - Label: "Website (link)"
    - Required: Yes
    - Input Type: URL
    - Placeholder: "https://..."

18. **Tickets** - Short Text
    - Label: "Tickets (link)"
    - Required: No
    - Input Type: URL
    - Placeholder: "https://..."

19. **Workout** - Short Text
    - Label: "Workout (link)"
    - Required: No
    - Input Type: URL
    - Placeholder: "https://..."

20. **Weights** - Short Text
    - Label: "Weights (link)"
    - Required: No
    - Input Type: URL
    - Placeholder: "https://..."

21. **Contact / Email** - Email
    - Label: "Contact / Email"
    - Required: No
    - Placeholder: "contact@example.com"

## Stap 3: Email Notificatie Setup

1. Ga naar **Settings** > **Emails**
2. Klik op **Notification Emails**
3. Voeg jouw email toe: `johanvaneck87@gmail.com`
4. Klik op **Edit Email**

### Email Template:

**Subject**: New Event Submission: {eventname}

**Email Body** (gebruik HTML editor):

```html
<h2>New Event Submission</h2>

<p>Een nieuw event is ingediend via het formulier. Hieronder vind je alle informatie in JSON formaat dat je direct kunt kopiëren naar events.json:</p>

<pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto;">
{
  "id": "GENERATE_FROM_NAME_AND_YEAR",
  "eventname": "{eventname}",
  "localgym": "{localgym}",
  "organizationgym": "{organisationgym}",
  "startdate": "{startdate:YYYY-MM-DD}",
  "enddate": "{enddate:YYYY-MM-DD}",
  "location": "{location}",
  "coordinates": {
    "lat": 0,
    "lng": 0
  },
  "typerace": [{typerace}],
  "divisions": [{divisions}],
  "ticketpricelow": "{ticketpricelow}",
  "ticketpricehigh": "{ticketpricehigh}",
  "fitnessobstacle": "{fitnessobstacle}",
  "indooroutdoor": "{indooroutdoor}",
  "hyroxworkout": "{hyroxworkout}",
  "description": "{aboutthisevent}",
  "image": "UPLOAD_TO_IMGUR",
  "instagram": "{instagram}",
  "website": "{website}",
  "ticketUrl": "{tickets}",
  "workout": "{workout}",
  "weights": "{weights}",
  "contactEmail": "{contactemail}",
  "country": "NL"
}
</pre>

<h3>Event Image</h3>
<p>Download de afbeelding hieronder en upload naar Imgur:</p>
<p>{eventimage}</p>

<h3>Stappen om het event toe te voegen:</h3>
<ol>
  <li>Download de event afbeelding van Jotform</li>
  <li>Upload naar <a href="https://imgur.com/upload">Imgur</a></li>
  <li>Kopieer de Imgur URL (rechtsklik op afbeelding > "Copy image address")</li>
  <li>Vervang "UPLOAD_TO_IMGUR" met de Imgur URL</li>
  <li>Genereer een uniek ID (naam-jaar of naam-jaar-maand)</li>
  <li>Gebruik Google Maps om lat/lng coordinates te vinden voor de locatie</li>
  <li>Kopieer het JSON object naar events.json</li>
  <li>Run: <code>npm run dev</code> om te testen</li>
</ol>

<hr>

<h3>Alle Ingediende Gegevens:</h3>
{all_fields}
```

## Stap 4: Formulier Embedden

1. Ga naar **Publish** in Jotform
2. Kopieer de **Embed Code**
3. De form ID vind je in de URL: `https://form.jotform.com/YOUR_FORM_ID`

Gebruik dit form ID in de SubmitEventPage component.

## Stap 5: Test het formulier

1. Vul het formulier in met test data
2. Upload een test afbeelding
3. Check of je de email ontvangt met alle data
4. Controleer of de afbeelding download link werkt

## Alternative: Imgur API Integratie (Advanced)

Als je wilt dat afbeeldingen automatisch naar Imgur worden geüpload:

1. Maak een Imgur account
2. Ga naar https://api.imgur.com/oauth2/addclient
3. Maak een nieuwe applicatie (Application Type: "Anonymous usage without user authorization")
4. Kopieer de **Client ID**
5. Gebruik Jotform's **Webhooks** om na submit automatisch naar Imgur te uploaden via een serverless function (Vercel/Netlify)

Dit is complexer maar volledig geautomatiseerd.

---

## Quick Start - Gebruik mijn Template

Je kunt ook mijn vooraf geconfigureerde template gebruiken:

1. Vraag mij om de Jotform template link
2. Clone de template naar jouw account
3. Pas de email notificatie aan naar jouw email
4. Embed in de website

Laat het me weten als je hulp nodig hebt!
