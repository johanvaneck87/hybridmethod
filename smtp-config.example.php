<?php
/**
 * SMTP Configuration Example
 *
 * Copy this file to smtp-config.php and fill in your SMTP details.
 * DO NOT commit smtp-config.php to git (it's in .gitignore)
 */

return [
    // SMTP Server Settings
    'host' => 'smtp.gmail.com',        // Gmail SMTP server (or your email provider)
    'port' => 587,                      // 587 for TLS, 465 for SSL
    'encryption' => 'tls',              // 'tls' or 'ssl'

    // Authentication
    'username' => 'your-email@gmail.com',     // Your email address
    'password' => 'your-app-password',        // App password (NOT your regular password!)

    // Sender Information
    'from_email' => 'noreply@hybridraces.fit',
    'from_name' => 'Hybrid Races Form',

    // Recipient
    'to_email' => 'hybridraces@gmail.com',
    'to_name' => 'Hybrid Races Admin',

    // Debug (set to 0 in production, 2 for detailed debugging)
    'debug' => 0
];

/**
 * GMAIL SETUP INSTRUCTIONS:
 *
 * 1. Go to your Google Account (https://myaccount.google.com/)
 * 2. Go to Security
 * 3. Enable 2-Step Verification (if not already enabled)
 * 4. Go to "App passwords" under 2-Step Verification
 * 5. Generate a new app password for "Mail"
 * 6. Use that 16-character password as 'password' above
 *
 * OTHER EMAIL PROVIDERS:
 *
 * - Outlook/Hotmail: smtp.office365.com, port 587, TLS
 * - Yahoo: smtp.mail.yahoo.com, port 587, TLS
 * - SendGrid: smtp.sendgrid.net, port 587, TLS (API key as password)
 * - Mailgun: smtp.mailgun.org, port 587, TLS
 */
