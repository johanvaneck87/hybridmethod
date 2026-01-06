# SMTP Email Setup Guide

Dit document beschrijft hoe je email notificaties kunt opzetten voor form submissions.

## Overzicht

Het formulier gebruikt PHPMailer met SMTP voor betrouwbare email verzending. Dit werkt veel beter dan de standaard PHP `mail()` functie.

## Stap 1: Kopieer het configuratie bestand

Op de server waar `form.php` staat:

```bash
cp smtp-config.example.php smtp-config.php
```

## Stap 2: Configureer Gmail (Aanbevolen)

### Gmail App Password Aanmaken

1. Ga naar je Google Account: https://myaccount.google.com/
2. Klik op **Security** in het linker menu
3. Zorg dat **2-Step Verification** is ingeschakeld
   - Als niet: Schakel het in en volg de stappen
4. Scroll naar beneden naar **2-Step Verification**
5. Klik op **App passwords** onderaan de pagina
6. Selecteer:
   - App: **Mail**
   - Device: **Other (Custom name)** → Typ "Hybrid Races Website"
7. Klik op **Generate**
8. Kopieer het 16-character wachtwoord (bijv: `abcd efgh ijkl mnop`)

### smtp-config.php Bewerken

Open `smtp-config.php` en vul in:

```php
<?php
return [
    // SMTP Server Settings
    'host' => 'smtp.gmail.com',
    'port' => 587,
    'encryption' => 'tls',

    // Authentication
    'username' => 'hybridraces@gmail.com',      // Je Gmail adres
    'password' => 'abcd efgh ijkl mnop',        // Het App Password van stap 2

    // Sender Information
    'from_email' => 'noreply@hybridraces.fit',
    'from_name' => 'Hybrid Races Form',

    // Recipient
    'to_email' => 'hybridraces@gmail.com',      // Waar de emails naartoe gaan
    'to_name' => 'Hybrid Races Admin',

    // Debug (0 = uit, 2 = gedetailleerd)
    'debug' => 0                                 // Zet op 2 voor debugging
];
```

## Stap 3: Upload Bestanden naar Server

Zorg dat deze bestanden op de server staan:

```
/
├── form.php
├── mail.php
├── smtp-config.php         ← Nieuw (bevat je wachtwoord)
├── smtp-config.example.php ← Template
├── phpmailer/              ← Nieuwe directory
│   ├── Exception.php
│   ├── PHPMailer.php
│   └── SMTP.php
└── submissions.log         ← Wordt automatisch aangemaakt
```

## Stap 4: Test het Formulier

1. Ga naar: `https://hybridraces.fit/submit-a-race`
2. Vul een test event in
3. Klik op Submit
4. Check:
   - ✅ `submissions.log` voor de JSON data
   - ✅ Je inbox (`hybridraces@gmail.com`) voor de email
   - ✅ Server error logs voor PHPMailer debug info

## Troubleshooting

### Email komt niet aan

1. **Check error logs**:
   ```bash
   tail -f /var/log/apache2/error.log
   # of
   tail -f /var/log/nginx/error.log
   ```

2. **Enable debug mode**:
   In `smtp-config.php`:
   ```php
   'debug' => 2
   ```
   Dit logt alle SMTP communicatie naar de error log.

3. **Check submissions.log**:
   ```bash
   tail -f submissions.log
   ```
   Hier staat altijd de JSON data, ook als email faalt.

### Gmail Errors

**Error: "Username and Password not accepted"**
- Je gebruikt je normale wachtwoord in plaats van een App Password
- Oplossing: Maak een App Password aan (zie Stap 2)

**Error: "SMTP connect() failed"**
- Port 587 is geblokkeerd door firewall
- Oplossing: Probeer port 465 met `'encryption' => 'ssl'`

**Error: "Could not authenticate"**
- 2-Step Verification is niet ingeschakeld
- Oplossing: Schakel 2-Step Verification in (zie Stap 2)

### Andere Email Providers

#### Outlook/Hotmail
```php
'host' => 'smtp.office365.com',
'port' => 587,
'encryption' => 'tls',
'username' => 'jouw@outlook.com',
'password' => 'jouw-wachtwoord',
```

#### SendGrid (Professioneel)
```php
'host' => 'smtp.sendgrid.net',
'port' => 587,
'encryption' => 'tls',
'username' => 'apikey',
'password' => 'jouw-sendgrid-api-key',
```

#### Mailgun (Professioneel)
```php
'host' => 'smtp.mailgun.org',
'port' => 587,
'encryption' => 'tls',
'username' => 'postmaster@jouw-domain.mailgun.org',
'password' => 'jouw-mailgun-smtp-wachtwoord',
```

## Beveiliging

⚠️ **BELANGRIJK**: `smtp-config.php` bevat gevoelige informatie!

- ✅ Het bestand staat in `.gitignore` en wordt NIET gecommit
- ✅ Zorg dat het bestand niet publiek toegankelijk is
- ✅ Gebruik ALTIJD een App Password, nooit je echte wachtwoord
- ✅ Bewaar een backup van je SMTP credentials op een veilige plek

## Email Backup

Als email tijdelijk niet werkt:
- Alle submissions worden automatisch gelogd in `submissions.log`
- De JSON code staat klaar om te kopiëren naar `events.json`
- Gebruik `tail -f submissions.log` om nieuwe submissions real-time te zien

## Handmatig Testen

Je kunt de email functie handmatig testen met:

```php
<?php
require_once 'mail.php';

$testEvent = [
    'id' => 'test-event-2025',
    'eventname' => 'Test Event',
    'startdate' => '2025-12-31',
    'enddate' => '',
    'location' => 'Amsterdam',
    'country' => 'NL',
    'coordinates' => ['lat' => 52.3676, 'lng' => 4.9041],
    'localgym' => 'No',
    'organizationgym' => 'Test Gym',
    'typerace' => ['Solo'],
    'divisions' => ['Open'],
    'ticketpricelow' => '50',
    'ticketpricehigh' => '75',
    'fitnessobstacle' => 'Fitness',
    'indooroutdoor' => 'Indoor',
    'hyroxworkout' => 'Yes',
    'description' => 'Test event',
    'instagram' => '@test',
    'website' => 'https://test.com',
    'ticketUrl' => 'https://tickets.com',
    'workoutWeights' => 'https://workout.com',
    'contactEmail' => 'test@example.com',
    'image' => 'https://example.com/image.jpg'
];

$jsonCode = json_encode($testEvent, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
$result = sendEventEmail($testEvent, $jsonCode);

print_r($result);
```

Bewaar dit als `test-email.php` en run: `php test-email.php`
