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
        echo json_encode(["success" => true, "orders" => readJsonFile($ordersFile)]);
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
        
        $newOrder = [
            "id" => "ord-" . time(),
            "orderNumber" => $orderNumStr,
            "date" => date("d/m/Y"),
            "sellerId" => isset($input['sellerId']) ? $input['sellerId'] : 'sel-admin',
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
        $seller = array_merge($existing ?: ["id" => "sel-" . time(), "status" => "ACTIVO", "createdAt" => date("c")], [
            "name" => $input['name'] ?? ($existing['name'] ?? 'Vendedor'),
            "username" => $username,
            "password" => $password !== '' ? $password : ($existing['password'] ?? ''),
            "zone" => $input['zone'] ?? ($existing['zone'] ?? 'General'),
            "municipalities" => $input['municipalities'] ?? ($existing['municipalities'] ?? []),
            "categories" => $input['categories'] ?? ($existing['categories'] ?? []),
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
