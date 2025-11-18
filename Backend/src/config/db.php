<?php
$host = "3307";
$db = "SafraGo";
$user = "root";
$pass = "senac";
$charset = "utf8mb4";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=$charset",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Falha ao conectar: " . $e->getMessage()]);
    exit;
}
