<?php
/**
 * Send event submission email
 *
 * @param array $eventData The event data array
 * @param string $jsonCode The formatted JSON code
 * @return array Success status and message/error
 */
function sendEventEmail($eventData, $jsonCode) {
    $to = 'hybridraces@gmail.com';
    $subject = 'New Race Submission - ' . $eventData['eventname'];

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

    // Email headers
    $headers = [];
    $headers[] = 'From: Hybrid Races Form <noreply@hybridraces.fit>';
    $headers[] = 'Reply-To: noreply@hybridraces.fit';
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';

    // Send email
    $success = mail($to, $subject, $body, implode("\r\n", $headers));

    if ($success) {
        return [
            'success' => true,
            'message' => 'Email sent successfully'
        ];
    } else {
        return [
            'success' => false,
            'error' => 'Failed to send email. Please check your PHP mail configuration.'
        ];
    }
}
