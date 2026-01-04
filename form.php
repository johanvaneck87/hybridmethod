<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Function to generate event ID from name and year
function generateEventId($eventName, $startDate) {
    // Convert event name to lowercase slug
    $slug = strtolower($eventName);
    // Replace spaces and special characters with hyphens
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    // Remove leading/trailing hyphens
    $slug = trim($slug, '-');

    // Extract year from start date
    $year = '';
    if (!empty($startDate)) {
        $dateObj = DateTime::createFromFormat('Y-m-d', $startDate);
        if ($dateObj) {
            $year = $dateObj->format('Y');
        }
    }

    // If we couldn't parse the year, use current year as fallback
    if (empty($year)) {
        $year = date('Y');
    }

    return $slug . '-' . $year;
}

// Function to geocode location with enhanced retry logic
function geocodeLocation($location, $country = '') {
    // Add country to search query if provided
    $searchQuery = trim($location);
    if (!empty($country)) {
        $searchQuery .= ', ' . $country;
    } else {
        // Default to Netherlands if no country specified
        $searchQuery .= ', Netherlands';
    }

    $encodedLocation = urlencode($searchQuery);
    $url = "https://nominatim.openstreetmap.org/search?format=json&q={$encodedLocation}&limit=5&addressdetails=1";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'HybridRaces/1.0');
    curl_setopt($ch, CURLOPT_TIMEOUT, 15); // Increased timeout
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    // Log errors for debugging
    if ($httpCode !== 200) {
        error_log("Geocoding failed for '{$searchQuery}': HTTP {$httpCode}, Error: {$curlError}");
    }

    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        if (!empty($data) && isset($data[0]['lat']) && isset($data[0]['lon'])) {
            // Rate limiting: sleep for 1 second to respect Nominatim usage policy
            sleep(1);

            return [
                'lat' => (float)$data[0]['lat'],
                'lng' => (float)$data[0]['lon']
            ];
        }
    }

    return null;
}

// Search terms with weights (30% fitness, 30% gym, 30% crossfit, 10% running)
// Note: deze worden niet meer gebruikt voor zoeken, maar voor variatie in seed
$SEARCH_TERMS = [
    'fitness', 'fitness', 'fitness',  // 30%
    'gym', 'gym', 'gym',              // 30%
    'crossfit', 'crossfit', 'crossfit', // 30%
    'running'                          // 10%
];

// Function to get auto-assigned placeholder image
function getAutoPlaceholderImage() {
    // Uitgebreide lijst van fitness-gerelateerde afbeeldingen van Unsplash (36 unieke afbeeldingen)
    $fitnessImages = [
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

    $randomImageUrl = $fitnessImages[array_rand($fitnessImages)];

    return $randomImageUrl;
}

// Function to handle image upload
function handleImageUpload($file, $eventId) {
    $uploadDir = __DIR__ . '/uploads/';

    // Create uploads directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Check if file was uploaded
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        return ['success' => false, 'error' => 'No file uploaded'];
    }

    // Check file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        return ['success' => false, 'error' => 'File size exceeds 5MB limit'];
    }

    // Check file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        return ['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, and WebP are allowed'];
    }

    // Use event ID as filename with original extension
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $eventId . '.' . strtolower($extension);
    $filepath = $uploadDir . $filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Return the public URL
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'];
        $imageUrl = $protocol . $host . '/uploads/' . $filename;

        return ['success' => true, 'url' => $imageUrl, 'filename' => $filename];
    } else {
        return ['success' => false, 'error' => 'Failed to save uploaded file'];
    }
}

// Function to format Instagram to @username
function formatInstagram($instagram) {
    if (empty($instagram)) {
        return '';
    }

    $instagram = trim($instagram);

    // If already starts with @, return as is
    if (strpos($instagram, '@') === 0) {
        return $instagram;
    }

    // Extract username from various Instagram URL formats
    $patterns = [
        '#https?://(?:www\.)?instagram\.com/([^/?]+)#i',
        '#instagram\.com/([^/?]+)#i',
        '#@?([a-zA-Z0-9._]+)#'
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $instagram, $matches)) {
            // Remove trailing slash if present
            $username = rtrim($matches[1], '/');
            return '@' . $username;
        }
    }

    // If no pattern matched, just add @ at the beginning
    return '@' . $instagram;
}

// Get basic form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$location = isset($_POST['location']) ? trim($_POST['location']) : '';
$instagramUrl = isset($_POST['instagram']) ? formatInstagram(trim($_POST['instagram'])) : '';
$startDate = isset($_POST['startDate']) ? trim($_POST['startDate']) : (isset($_POST['eventDate']) ? trim($_POST['eventDate']) : '');

// Validate required fields
if (empty($name) || empty($location)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields. Please fill in: name and location.'
    ]);
    exit();
}

// Generate event ID from name and start date
$eventId = generateEventId($name, $startDate);

// Get country early for geocoding
$country = isset($_POST['country']) ? trim($_POST['country']) : '';

// Handle image upload or auto-assign Unsplash image
$imageResult = null;
$imageUrl = '';
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    // User uploaded an image
    $imageResult = handleImageUpload($_FILES['image'], $eventId);
    if (!$imageResult['success']) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Image upload failed: ' . $imageResult['error']
        ]);
        exit();
    }
    $imageUrl = $imageResult['url'];
} else {
    // No image uploaded, auto-assign unique placeholder image
    $imageUrl = getAutoPlaceholderImage();
}

// Geocode location to get coordinates (pass country for better accuracy)
$coordinates = geocodeLocation($location, $country);
if (!$coordinates) {
    // If geocoding fails, log warning and use default coordinates
    error_log("WARNING: Geocoding failed for location '{$location}', country '{$country}'. Using default coordinates [0,0].");
    $coordinates = ['lat' => 0, 'lng' => 0];
}

// Get all form fields
$localGym = isset($_POST['localGym']) ? trim($_POST['localGym']) : '';
$organizationGym = isset($_POST['gym']) ? trim($_POST['gym']) : (isset($_POST['organization']) ? trim($_POST['organization']) : '');
$endDate = isset($_POST['endDate']) ? trim($_POST['endDate']) : '';
$priceMin = isset($_POST['priceMin']) ? trim($_POST['priceMin']) : '';
$priceMax = isset($_POST['priceMax']) ? trim($_POST['priceMax']) : '';
$eventType = isset($_POST['eventType']) ? trim($_POST['eventType']) : '';
$venue = isset($_POST['venue']) ? trim($_POST['venue']) : '';
$hyroxWorkout = isset($_POST['hyroxWorkout']) ? trim($_POST['hyroxWorkout']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$website = isset($_POST['website']) ? trim($_POST['website']) : '';
$tickets = isset($_POST['tickets']) ? trim($_POST['tickets']) : '';
$workoutWeights = isset($_POST['workoutWeights']) ? trim($_POST['workoutWeights']) : '';
$contactEmail = isset($_POST['contactEmail']) ? trim($_POST['contactEmail']) : '';

// Race types (divisions) from checkboxes
$raceTypes = [];
if (isset($_POST['raceTypes'])) {
    $raceTypes = array_map('trim', explode(',', $_POST['raceTypes']));
}

// Divisions from checkboxes
$divisions = [];
if (isset($_POST['division'])) {
    $divisions = array_map('trim', explode(',', $_POST['division']));
}

// Create event JSON object with correct field order
$eventData = [
    'id' => $eventId,
    'image' => $imageUrl,
    'eventname' => $name,
    'localgym' => $localGym,
    'organizationgym' => $organizationGym,
    'startdate' => $startDate,
    'enddate' => $endDate,
    'location' => $location,
    'country' => $country,
    'coordinates' => $coordinates,
    'typerace' => $raceTypes,
    'divisions' => $divisions,
    'ticketpricelow' => $priceMin,
    'ticketpricehigh' => $priceMax,
    'fitnessobstacle' => $eventType,
    'indooroutdoor' => $venue,
    'hyroxworkout' => $hyroxWorkout,
    'description' => $description,
    'instagram' => $instagramUrl !== '' ? $instagramUrl : '',
    'website' => $website,
    'ticketUrl' => $tickets,
    'workoutWeights' => $workoutWeights,
    'contactEmail' => $contactEmail
];

// Format JSON for email (pretty print)
$jsonCode = json_encode($eventData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

// Include mail.php and send email
require_once __DIR__ . '/mail.php';
$emailResult = sendEventEmail($eventData, $jsonCode);

if ($emailResult['success']) {
    echo json_encode([
        'success' => true,
        'message' => 'Event submitted successfully! You will receive a confirmation email shortly.',
        'eventId' => $eventId
    ]);
} else {
    // Email failed, but we still processed the form
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Form processed but email sending failed: ' . $emailResult['error']
    ]);
}
