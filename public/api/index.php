<?php
/**
 * API Router for Atziluth Grafic Digital — Hostinger Production Backend
 * Handles all dynamic panel requests in standard PHP-compatible environments.
 */

// Same-origin API: no CORS headers (the panels live on this same domain)
header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ==================== SEGURIDAD: SESIONES Y ROLES ====================
// Server-side session (HttpOnly cookie). Replaces the fixed token that was visible in the public code.
// Private files live one level ABOVE public_html (__DIR__/../../), where the web cannot reach them.
define('PRIVATE_DIR', __DIR__ . '/../..');
define('ADMINS', ['admin', 'supervisor']);
define('STAFF', ['admin', 'supervisor', 'vendedor']);
define('ADMIN_USERS', ['estiven', 'estivenson', 'estiven arango', 'estivenarango']);

function startSecureSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_name('agd_sid');
        session_set_cookie_params(['lifetime' => 43200, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
        session_start();
    }
}

function currentRole() {
    if (empty($_COOKIE['agd_sid'])) return null; // anonymous visitors do not open a session
    startSecureSession();
    return isset($_SESSION['role']) ? $_SESSION['role'] : null;
}

function requireRole(array $roles) {
    if (!in_array(currentRole(), $roles, true)) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "No autorizado. Inicia sesión de nuevo."]);
        exit;
    }
}

// Opens a session for the role and returns a random token (the panels still store one; auth uses the cookie)
function loginAs($role, $sellerId = null) {
    startSecureSession();
    session_regenerate_id(true);
    $_SESSION['role'] = $role;
    $_SESSION['sellerId'] = $sellerId;
    return bin2hex(random_bytes(24));
}

function adminPasswordOk($password) {
    $hashFile = PRIVATE_DIR . '/agd_admin_password.hash';
    if (file_exists($hashFile)) {
        return password_verify($password, trim(file_get_contents($hashFile)));
    }
    // ponytail: previous password (SHA-256) accepted ONLY until a new one is set in /admin/clave.html
    $legacy = [
        '634d5f425577734ef1bc06c95e7f77bac19b5cc1cbd551fab1ee01f28bad5573',
        '27c23dd47bbe1d6929e305d8dad731bc75a6b72b89082d973670ac6ae771d3e2'
    ];
    return in_array(hash('sha256', $password), $legacy, true);
}

function failLogin($message) {
    sleep(1); // slows down password guessing
    echo json_encode(["success" => false, "error" => $message]);
    exit;
}

function readJsonFile($file) {
    return file_exists($file) ? (json_decode(file_get_contents($file), true) ?: []) : [];
}

function writeJsonFile($file, $data) {
    // Keep the previous version as .bak before writing: data is never lost by an overwrite
    if (file_exists($file)) {
        copy($file, $file . '.bak');
    }
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

// ==================== VENDEDORES: una sola ficha por usuario ====================
define('SELLERS_FILE', PRIVATE_DIR . '/sellers_data.json');
define('SELLERS_DELETED_FILE', PRIVATE_DIR . '/sellers_deleted.json');
// Demo accounts shipped in the code (password "123"): never uploaded to the server
define('DEMO_SELLERS', ['sel_1' => 'carlos.ventas', 'sel_2' => 'camila.comercial', 'sel_3' => 'andres.oriente']);

function sellerKey($s) { return strtolower(trim((string)($s['username'] ?? ''))); }
function sellerStamp($s) { return strtotime((string)($s['updatedAt'] ?? $s['createdAt'] ?? '')) ?: 0; }

// Merges seller lists: one record per username, the most recent one wins,
// the password is never lost, and the ids of the removed duplicates are kept in mergedIds.
function mergeSellers(array $lists, array $deleted = []) {
    $byUser = [];
    foreach ($lists as $list) {
        foreach ((array)$list as $s) {
            $k = is_array($s) ? sellerKey($s) : '';
            if ($k === '') continue;
            if (isset($deleted[$k]) && sellerStamp($s) <= $deleted[$k]) continue; // deleted by the admin
            if (isset(DEMO_SELLERS[$s['id'] ?? '']) && DEMO_SELLERS[$s['id']] === $k && ($s['password'] ?? '') === '123') continue;
            if (!isset($byUser[$k])) { $byUser[$k] = $s; continue; }
            $old = $byUser[$k];
            $win = sellerStamp($s) >= sellerStamp($old) ? $s : $old;
            $lose = $win === $s ? $old : $s;
            if (empty($win['password']) && !empty($lose['password'])) $win['password'] = $lose['password'];
            $ids = array_merge((array)($old['mergedIds'] ?? []), (array)($s['mergedIds'] ?? []), [$lose['id'] ?? null]);
            $win['mergedIds'] = array_values(array_unique(array_filter($ids, function ($id) use ($win) { return $id && $id !== ($win['id'] ?? null); })));
            $byUser[$k] = $win;
        }
    }
    return array_values($byUser);
}

function sellersWithoutPasswords(array $sellers) {
    return array_map(function ($s) { unset($s['password']); return $s; }, $sellers);
}

// Only these file types can be uploaded (never .php or other executables)
function safeUploadName($fileName, array $allowedExt) {
    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt, true)) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Tipo de archivo no permitido."]);
        exit;
    }
    $base = preg_replace('/[^a-zA-Z0-9\-_]/', '_', pathinfo($fileName, PATHINFO_FILENAME));
    return time() . '_' . substr($base, 0, 80) . '.' . $ext;
}

// Get requested route
$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';

// Paths to database config and uploads folder relative to this script
// Inside dist/, the index.php will be in dist/api/index.php.
// So:
// - dist/custom_images_config.json -> __DIR__ . '/../custom_images_config.json'
// - dist/uploads/                  -> __DIR__ . '/../uploads'
$configFile = __DIR__ . '/../custom_images_config.json';
$uploadsDir = __DIR__ . '/../uploads';

/**
 * Loads image configuration or returns defaults
 */
function loadImagesConfig($configFile) {
    $defaults = [
        "webDesignMockup" => "",
        "restaurantAppMockup" => "",
        "municipalDirectoryBanner" => "",
        "customBusinesses" => [],
        "customAds" => [],
        "customLithoImages" => (object)[],
        "clients" => [],
        "categories" => [
            "Ferreterías",
            "Parqueaderos",
            "Tiendas",
            "Supermercados",
            "Farmacias",
            "Peluquerías",
            "Almacenes"
        ]
    ];
    
    if (file_exists($configFile)) {
        $info = file_get_contents($configFile);
        $decoded = json_decode($info, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $merged = array_merge($defaults, $decoded);
            if (empty($merged['customLithoImages']) || is_array($merged['customLithoImages']) && count($merged['customLithoImages']) === 0) {
                $merged['customLithoImages'] = (object)[];
            }
            return $merged;
        }
    }
    return $defaults;
}

// Read raw POST body for JSON requests
$input = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true) ?: [];
}

// ==================== PROVEEDORES (oficina nueva) ====================
// Private files: providers, their production orders and invoices. Access is always filtered
// by the provider in the SESSION, never by what the browser sends.
define('PROV_FILE', PRIVATE_DIR . '/proveedores_v2.json');
define('PROV_ORD_FILE', PRIVATE_DIR . '/ordenes_proveedor.json');
define('PROV_INVOICE_DIR', PRIVATE_DIR . '/facturas_proveedor');
define('PROV_EDITABLE', ['nombreComercial', 'nit', 'contactoNombre', 'telefonoWhatsapp', 'email', 'municipio', 'direccionTaller', 'servicios', 'datosBancarios', 'notasInternas', 'activo']);

function jsonFail($code, $message) {
    http_response_code($code);
    echo json_encode(["success" => false, "error" => $message]);
    exit;
}

// Copies the providers of the old office (static file) the first time. Nothing is deleted.
function loadProveedores() {
    if (file_exists(PROV_FILE)) return readJsonFile(PROV_FILE);
    $list = [];
    foreach (readJsonFile(__DIR__ . '/../proveedores_data.json') as $p) {
        if (is_array($p) && !empty($p['id'])) $list[] = mergeLegacyProveedor([], $p);
    }
    writeJsonFile(PROV_FILE, $list);
    return $list;
}

function mergeLegacyProveedor(array $current, array $legacy) {
    $servicios = $legacy['servicios'] ?? $legacy['categorias'] ?? (isset($legacy['categoria']) ? [$legacy['categoria']] : []);
    $base = [
        "id" => $legacy['id'],
        "codigo" => $legacy['codigo'] ?? '',
        "nombreComercial" => $legacy['nombreComercial'] ?? '',
        "nit" => $legacy['nit'] ?? '',
        "contactoNombre" => $legacy['contactoNombre'] ?? '',
        "telefonoWhatsapp" => $legacy['telefonoWhatsapp'] ?? '',
        "email" => $legacy['email'] ?? '',
        "municipio" => $legacy['municipio'] ?? '',
        "direccionTaller" => $legacy['direccionTaller'] ?? '',
        "servicios" => array_values((array)$servicios),
        "datosBancarios" => $legacy['datosBancarios'] ?? null,
        "notasInternas" => $legacy['notasInternas'] ?? '',
        "activo" => $legacy['activo'] ?? true,
        "username" => strtolower((string)($legacy['codigo'] ?? $legacy['id'])),
        "createdAt" => $legacy['createdAt'] ?? date("c"),
    ];
    // Values already in the new office win; the old record is kept whole in "legacy"
    $merged = array_merge($base, array_filter($current, function ($v) { return $v !== '' && $v !== null; }));
    $merged['legacy'] = $current['legacy'] ?? $legacy;
    return $merged;
}

function proveedorPublico(array $p) {
    $p['tieneClave'] = !empty($p['passwordHash']);
    unset($p['passwordHash'], $p['legacy']);
    return $p;
}

function findIndexById(array $list, $id) {
    foreach ($list as $i => $x) { if (($x['id'] ?? null) === $id) return $i; }
    return -1;
}

function nextNumber(array $list, array $path, $prefix) {
    $max = 0;
    foreach ($list as $x) {
        $v = $x;
        foreach ($path as $k) { $v = (is_array($v) && isset($v[$k])) ? $v[$k] : null; }
        if (is_string($v) && preg_match('/(\d+)$/', $v, $mm)) $max = max($max, (int)$mm[1]);
    }
    return $prefix . str_pad((string)($max + 1), 4, '0', STR_PAD_LEFT);
}

function readablePassword() {
    $chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
    $out = '';
    for ($i = 0; $i < 10; $i++) $out .= $chars[random_int(0, strlen($chars) - 1)];
    return $out;
}

function addHistory(array &$order, $event) {
    $order['historial'][] = ["fecha" => date("c"), "evento" => $event, "por" => currentRole()];
    $order['updatedAt'] = date("c");
}

// Only the provider that owns the order (or an admin) can touch it
function loadOrderFor($id, $asProveedor) {
    $orders = readJsonFile(PROV_ORD_FILE);
    $i = findIndexById($orders, $id);
    if ($i < 0) jsonFail(404, "Orden no encontrada.");
    if ($asProveedor && ($orders[$i]['proveedorId'] ?? '') !== ($_SESSION['proveedorId'] ?? '')) jsonFail(404, "Orden no encontrada.");
    return [$orders, $i];
}

function saveUploadedInvoice($orderId, $fileName, $base64) {
    $ext = strtolower(pathinfo((string)$fileName, PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf', 'jpg', 'jpeg', 'png'], true)) jsonFail(400, "La factura debe ser PDF, JPG o PNG.");
    $bin = base64_decode(preg_replace('/^data:[^;]+;base64,/', '', (string)$base64), true);
    if ($bin === false || strlen($bin) === 0) jsonFail(400, "El archivo de la factura no es válido.");
    if (strlen($bin) > 10 * 1024 * 1024) jsonFail(400, "La factura supera 10 MB.");
    if (!is_dir(PROV_INVOICE_DIR)) mkdir(PROV_INVOICE_DIR, 0750, true);
    $name = preg_replace('/[^A-Za-z0-9_\-]/', '_', $orderId) . '_' . time() . '.' . $ext;
    file_put_contents(PROV_INVOICE_DIR . '/' . $name, $bin, LOCK_EX);
    return $name;
}

if ($route === 'proveedor/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = strtolower(trim((string)($input['username'] ?? '')));
    $password = (string)($input['password'] ?? '');
    foreach (loadProveedores() as $p) {
        if (($p['username'] ?? '') === $username && !empty($p['passwordHash']) && ($p['activo'] ?? true) && password_verify($password, $p['passwordHash'])) {
            loginAs('proveedor');
            $_SESSION['proveedorId'] = $p['id'];
            echo json_encode(["success" => true, "proveedor" => proveedorPublico($p)]);
            exit;
        }
    }
    failLogin("Usuario o contraseña de proveedor incorrectos.");
} elseif ($route === 'proveedor/me' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    requireRole(['proveedor']);
    $list = loadProveedores();
    $i = findIndexById($list, $_SESSION['proveedorId']);
    if ($i < 0) jsonFail(401, "Proveedor no encontrado.");
    $mine = array_values(array_filter(readJsonFile(PROV_ORD_FILE), function ($o) { return ($o['proveedorId'] ?? '') === $_SESSION['proveedorId']; }));
    echo json_encode(["success" => true, "proveedor" => proveedorPublico($list[$i]), "ordenes" => $mine]);
    exit;
} elseif ($route === 'proveedor/perfil' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireRole(['proveedor']);
    $list = loadProveedores();
    $i = findIndexById($list, $_SESSION['proveedorId']);
    if ($i < 0) jsonFail(401, "Proveedor no encontrado.");
    foreach (['contactoNombre', 'telefonoWhatsapp', 'email', 'direccionTaller', 'datosBancarios'] as $k) {
        if (array_key_exists($k, $input)) $list[$i][$k] = $input[$k];
    }
    $list[$i]['updatedAt'] = date("c");
    writeJsonFile(PROV_FILE, $list);
    echo json_encode(["success" => true, "proveedor" => proveedorPublico($list[$i])]);
    exit;
} elseif (preg_match('#^proveedor/ordenes/([A-Za-z0-9_\-]+)/estado$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // The provider moves its own order: sent -> in production -> dispatched
    requireRole(['proveedor']);
    [$orders, $i] = loadOrderFor($m[1], true);
    $next = (string)($input['estado'] ?? '');
    $allowed = ['enviada' => 'en_produccion', 'en_produccion' => 'despachada'];
    if (($allowed[$orders[$i]['estado']] ?? null) !== $next) jsonFail(400, "Ese cambio de estado no es posible ahora.");
    $orders[$i]['estado'] = $next;
    if ($next === 'despachada') $orders[$i]['entrega']['proveedor'] = date("c");
    addHistory($orders[$i], $next === 'despachada' ? 'Proveedor marcó despachado / entregado' : 'Proveedor inició producción');
    writeJsonFile(PROV_ORD_FILE, $orders);
    echo json_encode(["success" => true, "orden" => $orders[$i]]);
    exit;
} elseif (preg_match('#^proveedor/ordenes/([A-Za-z0-9_\-]+)/factura$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Only after BOTH confirmations (dispatched by the provider + received by the admin)
    requireRole(['proveedor']);
    [$orders, $i] = loadOrderFor($m[1], true);
    if ($orders[$i]['estado'] !== 'recibida') jsonFail(400, "Puedes cargar la factura cuando Atziluth confirme que recibió el trabajo.");
    $numero = trim((string)($input['numero'] ?? ''));
    $valor = (float)($input['valor'] ?? 0);
    if ($numero === '' || $valor <= 0) jsonFail(400, "Número y valor de la factura son obligatorios.");
    $archivo = saveUploadedInvoice($orders[$i]['id'], $input['fileName'] ?? '', $input['base64Data'] ?? '');
    $orders[$i]['factura'] = ["numero" => $numero, "valor" => $valor, "archivo" => $archivo, "fecha" => date("c")];
    $orders[$i]['ordenPago'] = ["numero" => nextNumber($orders, ['ordenPago', 'numero'], 'OP-'), "valor" => $valor, "estado" => "pendiente", "fecha" => date("c")];
    $orders[$i]['estado'] = 'facturada';
    addHistory($orders[$i], "Proveedor cargó la factura $numero; se generó la orden de pago " . $orders[$i]['ordenPago']['numero']);
    writeJsonFile(PROV_ORD_FILE, $orders);
    echo json_encode(["success" => true, "orden" => $orders[$i]]);
    exit;
} elseif (preg_match('#^(proveedor|admin)/ordenes-proveedor/([A-Za-z0-9_\-]+)/factura-archivo$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $asProveedor = $m[1] === 'proveedor';
    requireRole($asProveedor ? ['proveedor'] : ADMINS);
    [$orders, $i] = loadOrderFor($m[2], $asProveedor);
    $file = PROV_INVOICE_DIR . '/' . basename((string)($orders[$i]['factura']['archivo'] ?? ''));
    if (!is_file($file)) jsonFail(404, "La orden no tiene factura cargada.");
    $types = ['pdf' => 'application/pdf', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png'];
    header('Content-Type: ' . ($types[strtolower(pathinfo($file, PATHINFO_EXTENSION))] ?? 'application/octet-stream'));
    header('Content-Disposition: inline; filename="factura-' . basename($file) . '"');
    readfile($file);
    exit;
} elseif ($route === 'admin/proveedores') {
    requireRole(ADMINS);
    $list = loadProveedores();
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode(["success" => true, "proveedores" => array_map('proveedorPublico', $list)]);
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = (string)($input['id'] ?? '');
        $i = $id !== '' ? findIndexById($list, $id) : -1;
        $username = strtolower(trim((string)($input['username'] ?? ($i >= 0 ? $list[$i]['username'] : ''))));
        $nombre = trim((string)($input['nombreComercial'] ?? ($i >= 0 ? $list[$i]['nombreComercial'] : '')));
        if ($nombre === '' || $username === '') jsonFail(400, "Nombre del proveedor y usuario son obligatorios.");
        foreach ($list as $j => $p) { if ($j !== $i && ($p['username'] ?? '') === $username) jsonFail(400, "Ese usuario ya lo tiene otro proveedor."); }
        $p = $i >= 0 ? $list[$i] : ["id" => "prv_" . time() . "_" . bin2hex(random_bytes(2)), "codigo" => nextNumber($list, ['codigo'], 'PRV-'), "activo" => true, "createdAt" => date("c")];
        foreach (PROV_EDITABLE as $k) { if (array_key_exists($k, $input)) $p[$k] = $input[$k]; }
        $p['username'] = $username;
        $pass = (string)($input['password'] ?? '');
        if ($pass !== '') {
            if (strlen($pass) < 6) jsonFail(400, "La contraseña debe tener mínimo 6 caracteres.");
            $p['passwordHash'] = password_hash($pass, PASSWORD_DEFAULT);
        }
        $p['updatedAt'] = date("c");
        if ($i >= 0) $list[$i] = $p; else $list[] = $p;
        writeJsonFile(PROV_FILE, $list);
        echo json_encode(["success" => true, "proveedor" => proveedorPublico($p), "proveedores" => array_map('proveedorPublico', $list)]);
        exit;
    }
} elseif (preg_match('#^admin/proveedores/([A-Za-z0-9_\-]+)/generar-clave$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // The server creates the password and shows it ONCE so the admin can send it to the provider
    requireRole(ADMINS);
    $list = loadProveedores();
    $i = findIndexById($list, $m[1]);
    if ($i < 0) jsonFail(404, "Proveedor no encontrado.");
    $pass = readablePassword();
    $list[$i]['passwordHash'] = password_hash($pass, PASSWORD_DEFAULT);
    $list[$i]['updatedAt'] = date("c");
    writeJsonFile(PROV_FILE, $list);
    echo json_encode(["success" => true, "username" => $list[$i]['username'], "password" => $pass]);
    exit;
} elseif ($route === 'admin/proveedores/importar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Copies what the old office left in the admin's browser. Merges by id, never deletes.
    requireRole(ADMINS);
    $list = loadProveedores();
    $added = 0;
    foreach ((array)($input['proveedores'] ?? []) as $legacy) {
        if (!is_array($legacy) || empty($legacy['id'])) continue;
        $i = findIndexById($list, $legacy['id']);
        if ($i >= 0) { $list[$i] = mergeLegacyProveedor($list[$i], $legacy); }
        else { $list[] = mergeLegacyProveedor([], $legacy); $added++; }
    }
    writeJsonFile(PROV_FILE, $list);
    $legacyFile = PRIVATE_DIR . '/proveedores_legacy_navegador.json';
    $prev = readJsonFile($legacyFile);
    $prev[] = ["fecha" => date("c"), "ordenes" => $input['ordenes'] ?? [], "pagos" => $input['pagos'] ?? []];
    writeJsonFile($legacyFile, $prev);
    echo json_encode(["success" => true, "nuevos" => $added, "total" => count($list), "proveedores" => array_map('proveedorPublico', $list)]);
    exit;
} elseif ($route === 'admin/ordenes-proveedor') {
    requireRole(ADMINS);
    $orders = readJsonFile(PROV_ORD_FILE);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode(["success" => true, "ordenes" => $orders]);
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $prov = null;
        foreach (loadProveedores() as $p) { if ($p['id'] === ($input['proveedorId'] ?? '')) $prov = $p; }
        if (!$prov) jsonFail(400, "Selecciona un proveedor válido.");
        if (trim((string)($input['descripcion'] ?? '')) === '') jsonFail(400, "Describe el trabajo de la orden.");
        $orden = [
            "id" => "opr_" . time() . "_" . bin2hex(random_bytes(2)),
            "numero" => nextNumber($orders, ['numero'], 'OPR-'),
            "proveedorId" => $prov['id'],
            "proveedorNombre" => $prov['nombreComercial'],
            "pedidoClienteId" => (string)($input['pedidoClienteId'] ?? ''),
            "clienteNombre" => (string)($input['clienteNombre'] ?? ''),
            "descripcion" => (string)$input['descripcion'],
            "cantidad" => (int)($input['cantidad'] ?? 0),
            "valorAcordado" => (float)($input['valorAcordado'] ?? 0),
            "fechaEntrega" => (string)($input['fechaEntrega'] ?? ''),
            "estado" => "enviada",
            "entrega" => ["proveedor" => null, "admin" => null],
            "historial" => [],
            "createdAt" => date("c")
        ];
        addHistory($orden, "Orden creada y enviada al proveedor");
        $orders[] = $orden;
        writeJsonFile(PROV_ORD_FILE, $orders);
        echo json_encode(["success" => true, "orden" => $orden, "ordenes" => $orders]);
        exit;
    }
} elseif (preg_match('#^admin/ordenes-proveedor/([A-Za-z0-9_\-]+)/recibir$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Second confirmation: Atziluth received the work the provider dispatched
    requireRole(ADMINS);
    [$orders, $i] = loadOrderFor($m[1], false);
    if ($orders[$i]['estado'] !== 'despachada') jsonFail(400, "El proveedor todavía no ha marcado la orden como despachada.");
    $orders[$i]['estado'] = 'recibida';
    $orders[$i]['entrega']['admin'] = date("c");
    addHistory($orders[$i], "Atziluth confirmó que recibió el trabajo completo");
    writeJsonFile(PROV_ORD_FILE, $orders);
    echo json_encode(["success" => true, "orden" => $orders[$i]]);
    exit;
} elseif (preg_match('#^admin/ordenes-proveedor/([A-Za-z0-9_\-]+)/pagar$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireRole(ADMINS);
    [$orders, $i] = loadOrderFor($m[1], false);
    if (($orders[$i]['ordenPago']['estado'] ?? '') !== 'pendiente') jsonFail(400, "Esta orden no tiene una orden de pago pendiente.");
    $orders[$i]['ordenPago'] = array_merge($orders[$i]['ordenPago'], [
        "estado" => "pagada",
        "fechaPago" => date("c"),
        "metodo" => (string)($input['metodo'] ?? ''),
        "referencia" => (string)($input['referencia'] ?? '')
    ]);
    $orders[$i]['estado'] = 'pagada';
    addHistory($orders[$i], "Orden de pago " . $orders[$i]['ordenPago']['numero'] . " marcada como pagada");
    writeJsonFile(PROV_ORD_FILE, $orders);
    echo json_encode(["success" => true, "orden" => $orders[$i]]);
    exit;
}

// ==================== VENTAS: abonos, entrega con doble confirmación y factura ====================
function loadSalesOrderFor($id) {
    $file = PRIVATE_DIR . '/sales_orders_data.json';
    $orders = readJsonFile($file);
    $i = findIndexById($orders, $id);
    if ($i < 0) jsonFail(404, "Pedido no encontrado.");
    // A seller can only touch his own orders
    if (currentRole() === 'vendedor' && ($orders[$i]['sellerId'] ?? '') !== ($_SESSION['sellerId'] ?? '')) jsonFail(404, "Pedido no encontrado.");
    return [$file, $orders, $i];
}

if (preg_match('#^sales/orders/([A-Za-z0-9_\-]+)/abono$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireRole(STAFF);
    [$file, $orders, $i] = loadSalesOrderFor($m[1]);
    $amount = (float)($input['amount'] ?? 0);
    if ($amount <= 0) jsonFail(400, "El valor del abono debe ser mayor a cero.");
    $allAbonos = [];
    foreach ($orders as $x) { foreach ((array)($x['abonos'] ?? []) as $a) $allAbonos[] = $a; }
    $o = $orders[$i];
    $o['abonos'][] = [
        "id" => "ab-" . (count($o['abonos'] ?? []) + 1),
        "date" => date("d/m/Y"),
        "amount" => $amount,
        "paymentMethod" => (string)($input['paymentMethod'] ?? 'Efectivo / Transferencia'),
        "note" => (string)($input['note'] ?? ''),
        "receiptNumber" => nextNumber($allAbonos, ['receiptNumber'], 'REC-')
    ];
    $o['totalPaid'] = array_sum(array_map(function ($a) { return (float)$a['amount']; }, $o['abonos']));
    $o['balance'] = max(0, (float)$o['totalAmount'] - $o['totalPaid']);
    $o['status'] = $o['balance'] == 0 ? "PAGADO_TOTAL" : "PAGO_PARCIAL";
    $o['updatedAt'] = date("c");
    $orders[$i] = $o;
    writeJsonFile($file, $orders);
    echo json_encode(["success" => true, "order" => $o]);
    exit;
} elseif (preg_match('#^sales/orders/([A-Za-z0-9_\-]+)/entregado$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // First confirmation: the seller delivered the product to the client
    requireRole(STAFF);
    [$file, $orders, $i] = loadSalesOrderFor($m[1]);
    $orders[$i]['entrega']['vendedor'] = date("c");
    $orders[$i]['updatedAt'] = date("c");
    writeJsonFile($file, $orders);
    echo json_encode(["success" => true, "order" => $orders[$i]]);
    exit;
} elseif (preg_match('#^sales/orders/([A-Za-z0-9_\-]+)/confirmar-entrega$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Second confirmation (admin): generates the client's invoice
    requireRole(ADMINS);
    [$file, $orders, $i] = loadSalesOrderFor($m[1]);
    if (empty($orders[$i]['entrega']['vendedor'])) jsonFail(400, "Primero el vendedor debe marcar el pedido como entregado.");
    if (empty($orders[$i]['invoice'])) {
        $orders[$i]['entrega']['admin'] = date("c");
        $orders[$i]['invoice'] = ["numero" => nextNumber($orders, ['invoice', 'numero'], 'FAC-'), "fecha" => date("d/m/Y"), "tipo" => "interna"];
        $orders[$i]['updatedAt'] = date("c");
        writeJsonFile($file, $orders);
    }
    echo json_encode(["success" => true, "order" => $orders[$i]]);
    exit;
}

// ==================== ROUTING SYSTEM ====================

if ($route === 'auth/logout') {
    startSecureSession();
    $_SESSION = [];
    session_destroy();
    echo json_encode(["success" => true]);
    exit;
} elseif ($route === 'auth/me') {
    echo json_encode(["success" => true, "role" => currentRole()]);
    exit;
} elseif ($route === 'admin/password') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireRole(['admin']);
        $current = isset($input['current']) ? (string)$input['current'] : '';
        $new = isset($input['new']) ? (string)$input['new'] : '';
        if (!adminPasswordOk($current)) failLogin("La contraseña actual no es correcta.");
        if (strlen($new) < 10) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "La nueva contraseña debe tener al menos 10 caracteres."]);
            exit;
        }
        if (file_put_contents(PRIVATE_DIR . '/agd_admin_password.hash', password_hash($new, PASSWORD_DEFAULT), LOCK_EX) === false) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "No se pudo guardar la nueva contraseña."]);
            exit;
        }
        echo json_encode(["success" => true]);
        exit;
    }
} elseif ($route === 'config/images') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $config = loadImagesConfig($configFile);
        echo json_encode(["success" => true, "config" => $config]);
        exit;
    }
} elseif ($route === 'admin/login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = isset($input['username']) ? trim($input['username']) : '';
        $password = isset($input['password']) ? trim($input['password']) : '';
        
        if (in_array(strtolower($username), ADMIN_USERS, true) && adminPasswordOk($password)) {
            echo json_encode(["success" => true, "token" => loginAs('admin'), "role" => "admin"]);
            exit;
        }

        // Check sellers_data.json for supervisor
        $sellersFile = PRIVATE_DIR . '/sellers_data.json';
        if (file_exists($sellersFile) && $password !== '') {
            $sellers = json_decode(file_get_contents($sellersFile), true) ?: [];
            foreach ($sellers as $s) {
                if (isset($s['username'], $s['password']) && strcasecmp($s['username'], $username) === 0 && hash_equals((string)$s['password'], $password)) {
                    $isSupervisor = (isset($s['role']) && strtolower($s['role']) === 'supervisor') ||
                                    (isset($s['isSupervisor']) && $s['isSupervisor'] === true) ||
                                    (isset($s['zone']) && stripos($s['zone'], 'supervisor') !== false);
                    if ($isSupervisor) {
                        echo json_encode(["success" => true, "token" => loginAs('supervisor', $s['id']), "role" => "supervisor"]);
                        exit;
                    } else {
                        http_response_code(403);
                        echo json_encode([
                            "success" => false,
                            "error" => "Acceso denegado: Los vendedores no tienen acceso al Panel General Administrador. Ingrese exclusivamente al Módulo de Ventas & Facturación (/admin/ventas.html)."
                        ]);
                        exit;
                    }
                }
            }
        }

        failLogin("Usuario o contraseña de administrador / supervisor incorrectos.");
    }
} elseif ($route === 'admin/config') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireRole(ADMINS);
        
        $webDesignMockup = isset($input['webDesignMockup']) ? $input['webDesignMockup'] : "";
        $restaurantAppMockup = isset($input['restaurantAppMockup']) ? $input['restaurantAppMockup'] : "";
        $municipalDirectoryBanner = isset($input['municipalDirectoryBanner']) ? $input['municipalDirectoryBanner'] : "";
        $customBusinesses = isset($input['customBusinesses']) ? $input['customBusinesses'] : [];
        $customAds = isset($input['customAds']) ? $input['customAds'] : [];
        $categories = isset($input['categories']) ? $input['categories'] : [];
        $customLithoImages = isset($input['customLithoImages']) ? $input['customLithoImages'] : [];
        $clients = isset($input['clients']) ? $input['clients'] : [];
        
        if (empty($categories)) {
            $categories = [
                "Ferreterías",
                "Parqueaderos",
                "Tiendas",
                "Supermercados",
                "Farmacias",
                "Peluquerías",
                "Almacenes"
            ];
        }

        if (empty($customLithoImages) || is_array($customLithoImages) && count($customLithoImages) === 0) {
            $customLithoImages = (object)[];
        }
        
        $newConfig = [
            "webDesignMockup" => $webDesignMockup,
            "restaurantAppMockup" => $restaurantAppMockup,
            "municipalDirectoryBanner" => $municipalDirectoryBanner,
            "customBusinesses" => $customBusinesses,
            "customAds" => $customAds,
            "categories" => $categories,
            "customLithoImages" => $customLithoImages,
            "clients" => $clients
        ];
        
        // Ensure parent directory of configuration exists
        $dir = dirname($configFile);
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
        
        $saved = writeJsonFile($configFile, $newConfig);
        
        if ($saved !== false) {
            echo json_encode(["success" => true, "config" => $newConfig]);
            exit;
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Error de escritura. Verifica los permisos de escritura del hosting en la raíz."]);
            exit;
        }
    }
} elseif ($route === 'admin/upload-image') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireRole(ADMINS);

        $fileName = isset($input['fileName']) ? $input['fileName'] : '';
        $base64Data = isset($input['base64Data']) ? $input['base64Data'] : '';
        
        if (empty($fileName) || empty($base64Data)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Nombre de archivo e imagen base64 requeridos."]);
            exit;
        }
        
        // Decode base64 string
        $base64Clean = preg_replace('/^data:image\/\w+;base64,/', '', $base64Data);
        $binaryData = base64_decode($base64Clean);
        
        if ($binaryData === false || @getimagesizefromstring($binaryData) === false && stripos($fileName, '.svg') === false) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Los datos de imagen base64 no son válidos."]);
            exit;
        }

        // Create uploads folder if not exists
        if (!file_exists($uploadsDir)) {
            mkdir($uploadsDir, 0755, true);
        }

        $uniqueFileName = safeUploadName($fileName, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'ico']);
        $targetPath = $uploadsDir . '/' . $uniqueFileName;
        
        if (file_put_contents($targetPath, $binaryData) !== false) {
            echo json_encode(["success" => true, "url" => "/uploads/" . $uniqueFileName]);
            exit;
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Fallo al escribir la imagen subida en el servidor. Revisa los permisos."]);
            exit;
        }
    }
} elseif ($route === 'admin/upload-file' || $route === 'upload-file') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireRole(ADMINS);
        $fileName = isset($input['fileName']) ? $input['fileName'] : 'archivo.pdf';
        $base64Data = isset($input['base64Data']) ? $input['base64Data'] : '';
        
        if (empty($base64Data)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "No se proporcionaron datos de archivo."]);
            exit;
        }
        
        $base64Clean = preg_replace('/^data:[^;]+;base64,/', '', $base64Data);
        $binaryData = base64_decode($base64Clean);
        
        if ($binaryData === false || strlen($binaryData) === 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Los datos del archivo no son válidos."]);
            exit;
        }
        
        if (!file_exists($uploadsDir)) {
            mkdir($uploadsDir, 0755, true);
        }
        
        $uniqueFileName = safeUploadName($fileName, ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'ico']);
        $targetPath = $uploadsDir . '/' . $uniqueFileName;

        if (file_put_contents($targetPath, $binaryData) !== false) {
            echo json_encode(["success" => true, "url" => "/uploads/" . $uniqueFileName, "fileName" => $uniqueFileName]);
            exit;
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Fallo al escribir el archivo subido en el servidor."]);
            exit;
        }
    }
} elseif ($route === 'almanaques/data') {
    $almanaquesFile = __DIR__ . '/../../almanaques_data.json';
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (file_exists($almanaquesFile)) {
            $content = file_get_contents($almanaquesFile);
            $parsed = json_decode($content, true);
            echo json_encode(["success" => true, "data" => $parsed]);
        } else {
            echo json_encode(["success" => true, "data" => null]);
        }
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireRole(ADMINS);
        if ($input) {
            writeJsonFile($almanaquesFile, $input);
            echo json_encode(["success" => true, "data" => $input]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "No se recibieron datos."]);
        }
        exit;
    }
} elseif ($route === 'sales/login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = isset($input['username']) ? trim($input['username']) : '';
        $password = isset($input['password']) ? trim($input['password']) : '';
        
        if (in_array(strtolower($username), ADMIN_USERS, true) && adminPasswordOk($password)) {
            $token = loginAs('admin');
            echo json_encode([
                "success" => true,
                "role" => "admin",
                "seller" => [
                    "id" => "admin-master",
                    "name" => "Estivenson Navarro (Administrador General)",
                    "username" => "Estivenson",
                    "zone" => "Todas las Zonas (Antioquia / Nacional)",
                    "municipalities" => ["Todos los Municipios"],
                    "categories" => ["Almanaque para el 2027", "Litografía Completa"]
                ],
                "token" => $token
            ]);
            exit;
        }

        // Check sellers_data.json
        $sellersFile = PRIVATE_DIR . '/sellers_data.json';
        if (file_exists($sellersFile) && $password !== '') {
            $sellers = json_decode(file_get_contents($sellersFile), true) ?: [];
            foreach ($sellers as $s) {
                if (isset($s['username'], $s['password']) && strcasecmp($s['username'], $username) === 0 && hash_equals((string)$s['password'], $password)) {
                    if (isset($s['status']) && $s['status'] === 'INACTIVO') {
                        echo json_encode(["success" => false, "error" => "El usuario vendedor se encuentra inactivo."]);
                        exit;
                    }
                    echo json_encode([
                        "success" => true,
                        "role" => "vendedor",
                        "seller" => [
                            "id" => $s['id'],
                            "name" => $s['name'],
                            "username" => $s['username'],
                            "zone" => isset($s['zone']) ? $s['zone'] : 'General',
                            "municipalities" => isset($s['municipalities']) ? $s['municipalities'] : [],
                            "categories" => isset($s['categories']) ? $s['categories'] : []
                        ],
                        "token" => loginAs('vendedor', $s['id'])
                    ]);
                    exit;
                }
            }
        }

        failLogin("Usuario o contraseña de ventas/admin incorrectos.");
    }
} elseif ($route === 'sales/orders') {
    requireRole(STAFF);
    $ordersFile = PRIVATE_DIR . '/sales_orders_data.json';
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $orders = readJsonFile($ordersFile);
        if (currentRole() === 'vendedor') {
            // A seller only sees his own sales
            $orders = array_values(array_filter($orders, function ($o) { return ($o['sellerId'] ?? '') === ($_SESSION['sellerId'] ?? ''); }));
        }
        echo json_encode(["success" => true, "orders" => $orders]);
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $orders = readJsonFile($ordersFile);
        $orderNumStr = "PED-" . (1000 + count($orders) + 1);
        $totalAmount = isset($input['totalAmount']) ? floatval($input['totalAmount']) : 0;
        $initialAbono = isset($input['initialAbono']) ? floatval($input['initialAbono']) : 0;
        $balance = max(0, $totalAmount - $initialAbono);
        
        $abonosList = [];
        if ($initialAbono > 0) {
            $abonosList[] = [
                "id" => "ab-1",
                "date" => date("d/m/Y"),
                "amount" => $initialAbono,
                "paymentMethod" => isset($input['paymentMethod']) ? $input['paymentMethod'] : "Efectivo / Transferencia",
                "note" => "Abono inicial en creación del pedido",
                "receiptNumber" => "REC-" . (5000 + rand(100, 999))
            ];
        }
        
        if (currentRole() === 'vendedor') {
            // The seller's name and zone come from the server, not from the browser
            foreach (readJsonFile(SELLERS_FILE) as $sv) {
                if (($sv['id'] ?? '') === $_SESSION['sellerId']) {
                    $input['sellerName'] = $sv['name'] ?? '';
                    $input['sellerUsername'] = $sv['username'] ?? '';
                    $input['sellerZone'] = $sv['zone'] ?? 'General';
                }
            }
        }
        $newOrder = [
            "id" => "ord-" . time() . "-" . bin2hex(random_bytes(3)),
            "orderNumber" => $orderNumStr,
            "date" => date("d/m/Y"),
            // A seller always registers the order under his own id
            "sellerId" => currentRole() === 'vendedor' ? $_SESSION['sellerId'] : (isset($input['sellerId']) ? $input['sellerId'] : 'sel-admin'),
            "sellerName" => isset($input['sellerName']) ? $input['sellerName'] : 'Estivenson Navarro',
            "sellerUsername" => isset($input['sellerUsername']) ? $input['sellerUsername'] : 'Estivenson',
            "sellerZone" => isset($input['sellerZone']) ? $input['sellerZone'] : 'General',
            "clientId" => isset($input['clientId']) ? $input['clientId'] : 'cli-gen',
            "clientName" => isset($input['clientName']) ? $input['clientName'] : 'Cliente',
            "clientNit" => isset($input['clientNit']) ? $input['clientNit'] : 'Sin NIT',
            "clientPhone" => isset($input['clientPhone']) ? $input['clientPhone'] : 'Sin teléfono',
            "clientMunicipality" => isset($input['clientMunicipality']) ? $input['clientMunicipality'] : 'Medellín',
            "clientAddress" => isset($input['clientAddress']) ? $input['clientAddress'] : 'Medellín',
            "items" => isset($input['items']) ? $input['items'] : [],
            "subtotal" => $totalAmount,
            "discount" => 0,
            "totalAmount" => $totalAmount,
            "abonos" => $abonosList,
            "totalPaid" => $initialAbono,
            "balance" => $balance,
            "status" => $balance === 0 ? "PAGADO_TOTAL" : "PAGO_PARCIAL",
            "createdAt" => date("c"),
            "updatedAt" => date("c")
        ];
        array_unshift($orders, $newOrder);
        writeJsonFile($ordersFile, $orders);
        if (currentRole() === 'vendedor') {
            $orders = array_values(array_filter($orders, function ($o) { return ($o['sellerId'] ?? '') === ($_SESSION['sellerId'] ?? ''); }));
        }
        echo json_encode(["success" => true, "order" => $newOrder, "orders" => $orders]);
        exit;
    }
} elseif ($route === 'sales/clients') {
    $clientsFile = PRIVATE_DIR . '/clients_data.json';
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        requireRole(STAFF);
        echo json_encode(["success" => true, "clients" => readJsonFile($clientsFile)]);
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Public registration form: anyone may CREATE a client, but only staff gets the list back
        $field = function ($key, $default = '') use ($input) {
            // Max 300 characters (UTF-8 safe, does not depend on the mbstring extension)
            return isset($input[$key]) ? preg_replace('/^(.{0,300}).*$/us', '$1', trim((string)$input[$key])) : $default;
        };
        $clients = readJsonFile($clientsFile);
        $newClient = [
            "id" => "cli-" . time() . "-" . bin2hex(random_bytes(3)),
            "name" => $field('name', 'Cliente Nuevo'),
            "nitCc" => $field('nitCc', 'Sin NIT'),
            "contact" => $field('contact'),
            "phone" => $field('phone'),
            "email" => $field('email'),
            "address" => $field('address', 'Medellín'),
            "municipality" => $field('municipality', 'Medellín'),
            "createdAt" => date("c")
        ];
        array_unshift($clients, $newClient);
        writeJsonFile($clientsFile, $clients);
        $isStaff = in_array(currentRole(), STAFF, true);
        echo json_encode($isStaff
            ? ["success" => true, "client" => $newClient, "clients" => $clients]
            : ["success" => true, "client" => $newClient]);
        exit;
    }
} elseif ($route === 'admin/sellers') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        requireRole(STAFF);
        $sellers = mergeSellers([readJsonFile(SELLERS_FILE)], readJsonFile(SELLERS_DELETED_FILE));
        echo json_encode(["success" => true, "sellers" => sellersWithoutPasswords($sellers)]);
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create OR update by username: the same seller is never created twice
        requireRole(ADMINS);
        $username = strtolower(trim((string)($input['username'] ?? '')));
        $current = readJsonFile(SELLERS_FILE);
        $existing = null;
        foreach ($current as $s) { if (sellerKey($s) === $username) { $existing = $s; break; } }
        $password = (string)($input['password'] ?? '');
        if ($username === '' || (!$existing && strlen($password) < 6)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Usuario y contraseña (mínimo 6 caracteres) son obligatorios."]);
            exit;
        }
        $seller = array_merge($existing ?: ["id" => "sel-" . time() . "-" . bin2hex(random_bytes(3)), "status" => "ACTIVO", "createdAt" => date("c")], [
            "name" => $input['name'] ?? ($existing['name'] ?? 'Vendedor'),
            "username" => $username,
            "password" => $password !== '' ? $password : ($existing['password'] ?? ''),
            "zone" => $input['zone'] ?? ($existing['zone'] ?? 'General'),
            "municipalities" => $input['municipalities'] ?? ($existing['municipalities'] ?? []),
            "categories" => $input['categories'] ?? ($existing['categories'] ?? []),
            "phone" => $input['phone'] ?? ($existing['phone'] ?? ''),
            "commission" => $input['commission'] ?? $input['commissionRate'] ?? ($existing['commission'] ?? 5),
            "commissionRate" => $input['commissionRate'] ?? $input['commission'] ?? ($existing['commissionRate'] ?? 5),
            "supervisor" => $input['supervisor'] ?? ($existing['supervisor'] ?? ''),
            "status" => $input['status'] ?? ($existing['status'] ?? 'ACTIVO'),
            "updatedAt" => date("c")
        ]);
        $deleted = readJsonFile(SELLERS_DELETED_FILE);
        unset($deleted[$username]); // re-created on purpose
        writeJsonFile(SELLERS_DELETED_FILE, $deleted);
        $sellers = mergeSellers([$current, [$seller]], $deleted);
        writeJsonFile(SELLERS_FILE, $sellers);
        unset($seller['password']);
        echo json_encode(["success" => true, "seller" => $seller, "sellers" => sellersWithoutPasswords($sellers)]);
        exit;
    }
} elseif ($route === 'admin/sellers/sync') {
    // The admin's browser uploads its seller list: duplicates are merged and passwords are kept
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireRole(ADMINS);
        $current = readJsonFile(SELLERS_FILE);
        $incoming = isset($input['sellers']) && is_array($input['sellers']) ? $input['sellers'] : [];
        $deleted = readJsonFile(SELLERS_DELETED_FILE);
        $sellers = mergeSellers([$current, $incoming], $deleted);
        writeJsonFile(SELLERS_FILE, $sellers);
        echo json_encode([
            "success" => true,
            "sellers" => $sellers, // with passwords: admins manage them in the panel
            "received" => count($incoming) + count($current),
            "unique" => count($sellers)
        ]);
        exit;
    }
} elseif (preg_match('#^admin/sellers/([A-Za-z0-9_\-]+)$#', $route, $m)) {
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        requireRole(ADMINS);
        $current = readJsonFile(SELLERS_FILE);
        $deleted = readJsonFile(SELLERS_DELETED_FILE);
        $kept = [];
        foreach ($current as $s) {
            $ids = array_merge([$s['id'] ?? ''], (array)($s['mergedIds'] ?? []));
            if (in_array($m[1], $ids, true)) { $deleted[sellerKey($s)] = time(); continue; }
            $kept[] = $s;
        }
        writeJsonFile(SELLERS_DELETED_FILE, $deleted);
        writeJsonFile(SELLERS_FILE, $kept);
        echo json_encode(["success" => true, "sellers" => $kept]);
        exit;
    }
}

// Endpoint not found
http_response_code(404);
echo json_encode(["success" => false, "error" => "Endpoint no encontrado en la API de Atziluth."]);
exit;
