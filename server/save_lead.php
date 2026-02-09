<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';

function respond(bool $ok, ?string $error = null, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode(
        $ok ? ['ok' => true] : ['ok' => false, 'error' => $error ?? 'Erro desconhecido'],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Método não permitido.', 405);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$rawBody = file_get_contents('php://input');
$data = [];

if (stripos($contentType, 'application/json') !== false) {
    $decoded = json_decode($rawBody ?: '', true);
    if (is_array($decoded)) {
        $data = $decoded;
    }
} else {
    $data = $_POST;
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$messageRaw = trim((string)($data['message'] ?? ''));
$message = $messageRaw !== '' ? $messageRaw : null;

$name = strip_tags($name);
$email = filter_var($email, FILTER_SANITIZE_EMAIL) ?: '';
$phoneDigits = preg_replace('/\D+/', '', $phone) ?: '';

if ($name === '') {
    respond(false, 'Nome é obrigatório.', 422);
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'E-mail inválido.', 422);
}

if (strlen($phoneDigits) < 8) {
    respond(false, 'Telefone inválido.', 422);
}

if (mb_strlen($name) > 120) {
    respond(false, 'Nome excede o limite permitido.', 422);
}

if (mb_strlen($email) > 160) {
    respond(false, 'E-mail excede o limite permitido.', 422);
}

if (mb_strlen($phone) > 30) {
    respond(false, 'Telefone excede o limite permitido.', 422);
}

try {
    $pdo = getPdo();

    $stmt = $pdo->prepare(
        'INSERT INTO leads (name, email, phone, message) VALUES (:name, :email, :phone, :message)'
    );

    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':message' => $message,
    ]);

    respond(true);
} catch (Throwable $exception) {
    error_log('save_lead error: ' . $exception->getMessage());
    respond(false, 'Falha ao salvar lead no banco de dados.', 500);
}
