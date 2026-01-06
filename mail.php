<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer
require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

/**
 * Send event submission email using PHPMailer with SMTP
 *
 * @param array $eventData The event data array
 * @param string $jsonCode The formatted JSON code
 * @return array Success status and message/error
 */
function sendEventEmail($eventData, $jsonCode) {
    // Load SMTP configuration
    $configFile = __DIR__ . '/smtp-config.php';
    if (!file_exists($configFile)) {
        return [
            'success' => false,
            'error' => 'SMTP configuration file not found. Please create smtp-config.php from smtp-config.example.php'
        ];
    }

    $config = require $configFile;

    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $config['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['username'];
        $mail->Password   = $config['password'];
        $mail->SMTPSecure = $config['encryption'];
        $mail->Port       = $config['port'];
        $mail->CharSet    = 'UTF-8';

        // Debug (0 = off, 2 = detailed)
        $mail->SMTPDebug  = $config['debug'] ?? 0;
        $mail->Debugoutput = function($str, $level) {
            error_log("PHPMailer Debug [$level]: $str");
        };

        // Recipients
        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($config['to_email'], $config['to_name']);
        $mail->addReplyTo($config['from_email'], $config['from_name']);

        // Content
        $mail->isHTML(false); // Plain text email
        $mail->Subject = 'New Race Submission - ' . $eventData['eventname'];

        // Build email body
        $body = "New race event submission received!\n\n";
        $body .= "Event Details:\n";
        $body .= "================\n";
        $body .= "Event Name: " . $eventData['eventname'] . "\n";
        $body .= "Start Date: " . $eventData['startdate'] . "\n";
        if (!empty($eventData['enddate'])) {
            $body .= "End Date: " . $eventData['enddate'] . "\n";
        }
        $body .= "Location: " . $eventData['location'] . "\n";
        $body .= "Country: " . $eventData['country'] . "\n";
        $body .= "Local Gym: " . $eventData['localgym'] . "\n";
        $body .= "Organization/Gym: " . $eventData['organizationgym'] . "\n";

        if (!empty($eventData['typerace']) && is_array($eventData['typerace'])) {
            $body .= "Race Types: " . implode(', ', $eventData['typerace']) . "\n";
        }

        if (!empty($eventData['divisions']) && is_array($eventData['divisions'])) {
            $body .= "Divisions: " . implode(', ', $eventData['divisions']) . "\n";
        }

        $body .= "Event Type: " . $eventData['fitnessobstacle'] . "\n";
        $body .= "Venue: " . $eventData['indooroutdoor'] . "\n";
        $body .= "HYROX Workout: " . $eventData['hyroxworkout'] . "\n";

        if (!empty($eventData['ticketpricelow']) || !empty($eventData['ticketpricehigh'])) {
            $body .= "Price Range: €" . $eventData['ticketpricelow'] . " - €" . $eventData['ticketpricehigh'] . "\n";
        }

        $body .= "\nLinks:\n";
        $body .= "Website: " . $eventData['website'] . "\n";
        $body .= "Instagram: " . $eventData['instagram'] . "\n";

        if (!empty($eventData['ticketUrl'])) {
            $body .= "Tickets: " . $eventData['ticketUrl'] . "\n";
        }

        if (!empty($eventData['workoutWeights'])) {
            $body .= "Workout & Weights: " . $eventData['workoutWeights'] . "\n";
        }

        if (!empty($eventData['contactEmail'])) {
            $body .= "Contact Email: " . $eventData['contactEmail'] . "\n";
        }

        if (!empty($eventData['image'])) {
            $body .= "\nImage URL: " . $eventData['image'] . "\n";
        }

        $body .= "Coordinates: " . $eventData['coordinates']['lat'] . ", " . $eventData['coordinates']['lng'] . "\n";
        $body .= "\n================\n\n";
        $body .= "JSON CODE - READY TO COPY TO events.json:\n";
        $body .= "==========================================\n\n";
        $body .= $jsonCode;
        $body .= "\n\n==========================================\n\n";
        $body .= "INSTRUCTIONS TO ADD THIS EVENT:\n";
        $body .= "1. Copy the JSON object above (the entire { ... } block)\n";
        $body .= "2. Open src/data/events.json in your editor\n";
        $body .= "3. Go to the end of the file, find the last event's closing }\n";
        $body .= "4. Add a comma after that }\n";
        $body .= "5. Paste the JSON object on a new line\n";
        $body .= "6. Save the file\n";
        $body .= "7. Run: git add src/data/events.json\n";
        $body .= "8. Run: git commit -m \"Add new event: " . $eventData['eventname'] . "\"\n";
        $body .= "9. Run: git push\n";
        $body .= "10. Deploy to production\n";

        $mail->Body = $body;

        // Send email
        $mail->send();

        return [
            'success' => true,
            'message' => 'Email sent successfully via SMTP'
        ];

    } catch (Exception $e) {
        error_log("PHPMailer Error: " . $mail->ErrorInfo);
        return [
            'success' => false,
            'error' => 'Email could not be sent. Error: ' . $mail->ErrorInfo
        ];
    }
}
