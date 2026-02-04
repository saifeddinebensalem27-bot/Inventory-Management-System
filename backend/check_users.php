<?php
require 'vendor/autoload.php';

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;
use Symfony\Component\Dotenv\Dotenv;

// Load .env file
$dotenv = new Dotenv();
$dotenv->load(__DIR__ . '/.env');

// Parse DATABASE_URL from .env
$dbUrl = $_ENV['DATABASE_URL'] ?? '';

if (empty($dbUrl)) {
    die("❌ DATABASE_URL not found in .env\n");
}

try {
    // Parse the URL and create connection config
    $params = parseUrl($dbUrl);
    
    $connection = DriverManager::getConnection($params);

    // Query users
    $sql = 'SELECT id_user, email, roles FROM user';
    $result = $connection->fetchAllAssociative($sql);

    if (empty($result)) {
        echo "❌ No users found in database\n";
    } else {
        echo "✅ Users in database:\n";
        echo str_repeat("-", 60) . "\n";
        foreach ($result as $user) {
            echo "ID: {$user['id_user']}, Email: {$user['email']}, Roles: {$user['roles']}\n";
        }
        echo str_repeat("-", 60) . "\n";
    }
} catch (\Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}

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