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

    // Query roles
    $sql = 'SELECT id_role, name_role FROM role';
    $result = $connection->fetchAllAssociative($sql);

    if (empty($result)) {
        echo "❌ No roles found in database\n";
    } else {
        echo "✅ Roles in database:\n";
        echo str_repeat("-", 60) . "\n";
        foreach ($result as $role) {
            echo "ID: {$role['id_role']}, Role: {$role['name_role']}\n";
        }
        echo str_repeat("-", 60) . "\n";
    }
} catch (\Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}
