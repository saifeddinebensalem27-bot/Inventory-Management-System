<?php
/**
 * Test the login endpoint
 * Run with: php test_login.php
 */

require 'vendor/autoload.php';

use Symfony\Component\Dotenv\Dotenv;

// Load .env
$dotenv = new Dotenv();
$dotenv->load(__DIR__ . '/.env');

// Test credentials
$email = 'admin@system.local';
$password = 'admin123'; // Change this to your actual password

echo "🔍 Testing login endpoint...\n";
echo "📧 Email: $email\n";
echo "🔐 Password: $password\n";
echo str_repeat("-", 60) . "\n";

// Prepare request
$url = 'http://localhost:8000/api/login';
$data = json_encode(['email' => $email, 'password' => $password]);

$options = [
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $data,
        'timeout' => 5
    ]
];

$context = stream_context_create($options);

try {
    $response = file_get_contents($url, false, $context);
    $result = json_decode($response, true);
    
    echo "✅ Response:\n";
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Make sure the Symfony server is running on http://localhost:8000\n";
}
