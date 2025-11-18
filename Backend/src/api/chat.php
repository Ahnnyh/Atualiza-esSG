<?php
header("Content-Type: application/json");
require_once "../config/db.php";
require_once "../config/firebase_verify.php";

// 1. Validar Firebase Token
$headers = getallheaders();
if (!isset($headers["Authorization"])) {
    http_response_code(401);
    echo json_encode(["error" => "Missing Authorization header"]);
    exit;
}

list($type, $token) = explode(" ", $headers["Authorization"]);

if ($type !== "Bearer") {
    http_response_code(401);
    echo json_encode(["error" => "Invalid Authorization format"]);
    exit;
}

$payload = verify_firebase_token($token);

if (!$payload || !isset($payload["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid Firebase ID token"]);
    exit;
}

$uid = $payload["user_id"];

// -------------------------------
// ROTAS DO CHAT
// -------------------------------
$action = $_REQUEST["action"] ?? "";

switch ($action) {

    case "get_or_create_conversation":
        $comprador = $_POST["comprador_uid"];
        $vendedor = $_POST["vendedor_uid"];
        $produto = $_POST["produto_id"];

        $stmt = $pdo->prepare("SELECT id FROM conversas WHERE comprador_uid=? AND vendedor_uid=? AND produto_id=?");
        $stmt->execute([$comprador, $vendedor, $produto]);

        if ($c = $stmt->fetch()) {
            echo json_encode(["conversation_id" => $c["id"]]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO conversas (comprador_uid, vendedor_uid, produto_id, atualizada_em) VALUES (?,?,?,NOW())");
        $stmt->execute([$comprador, $vendedor, $produto]);

        echo json_encode(["conversation_id" => $pdo->lastInsertId()]);
        exit;

    case "send_message":
        $cid  = $_POST["conversa_id"];
        $dest = $_POST["destinatario_uid"];
        $msg  = $_POST["mensagem"];

        $stmt = $pdo->prepare(
            "INSERT INTO mensagens (conversa_id, remetente_uid, destinatario_uid, mensagem) 
             VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([$cid, $uid, $dest, $msg]);

        $pdo->prepare("UPDATE conversas SET ultima_msg=?, atualizada_em=NOW() WHERE id=?")
            ->execute([$msg, $cid]);

        echo json_encode(["ok" => true]);
        exit;

    case "get_messages":
        $cid = $_GET["conversa_id"];

        $stmt = $pdo->prepare("SELECT * FROM mensagens WHERE conversa_id=? ORDER BY enviada_em ASC");
        $stmt->execute([$cid]);

        echo json_encode(["messages" => $stmt->fetchAll()]);
        exit;

    case "list_conversations":
        $stmt = $pdo->prepare(
            "SELECT * FROM conversas 
             WHERE comprador_uid=? OR vendedor_uid=? 
             ORDER BY atualizada_em DESC"
        );
        $stmt->execute([$uid, $uid]);

        echo json_encode(["conversations" => $stmt->fetchAll()]);
        exit;

    default:
        echo json_encode(["error" => "Ação inválida"]);
        exit;
}
