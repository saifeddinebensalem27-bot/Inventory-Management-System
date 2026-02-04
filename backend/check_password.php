<?php
require 'vendor/autoload.php';

use Doctrine\DBAL\DriverManager;
use Symfony\Component\Dotenv\Dotenv;

// Load .env file
$dotenv = new Dotenv();
$dotenv->load(__DIR__ . '/.env');

$dbUrl = $_ENV['DATABASE_URL'] ?? '';

function parseUrl($url) {
    $parsed = parse_url($url);
    return [
        'driver' => 'pdo_' . ($parsed['scheme'] ?? 'mysql'),
        'host' => $parsed['host'] ?? 'localhost',
        'port' => $parsed['port'] ?? 3306,
        'user' => $parsed['user'] ?? 'root',
        'password' => $parsed['pass'] ?? '',
        'dbname' => ltrim($parsed['path'] ?? '', '/'),
    ];
}

try {
    $params = parseUrl($dbUrl);
    $connection = DriverManager::getConnection($params);

    // Query users with password hash
    $sql = 'SELECT id_user, email, password FROM user';
    $result = $connection->fetchAllAssociative($sql);

    if (empty($result)) {
        echo "❌ No users found in database\n";
    } else {
        echo "✅ Users in database (with hashed passwords):\n";
        echo str_repeat("-", 80) . "\n";
        foreach ($result as $user) {
            echo "ID: {$user['id_user']}\n";
            echo "Email: {$user['email']}\n";
            echo "Password Hash: {$user['password']}\n";
            echo str_repeat("-", 80) . "\n";
        }
    }
} catch (\Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}
