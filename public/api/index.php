<?php
/**
 * API Router for Atziluth Grafic Digital — Hostinger Production Backend
 * Handles all dynamic panel requests in standard PHP-compatible environments.
 */

// Enable CORS and define JSON response type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

// Handle preflight CORS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Fallback implementation for getallheaders() if not running under Apache mod_php
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
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

/**
 * Validates authentication token in headers
 */
function requireAdmin() {
    $headers = getallheaders();
    $authHeader = '';
    foreach ($headers as $key => $val) {
        if (strcasecmp($key, 'Authorization') === 0) {
            $authHeader = $val;
            break;
        }
    }
    
    if ($authHeader !== 'Bearer atziluth_secure_token_secret') {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "No autorizado. Sesión inválida."]);
        exit;
    }
}

// ==================== ROUTING SYSTEM ====================

if ($route === 'config/images') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $config = loadImagesConfig($configFile);
        echo json_encode(["success" => true, "config" => $config]);
        exit;
    }
} elseif ($route === 'admin/login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = isset($input['username']) ? trim($input['username']) : '';
        $password = isset($input['password']) ? trim($input['password']) : '';
        
        $isAdminUser = in_array(strtolower($username), ['estiven', 'admin', 'estiven arango', 'estivenarango']);
        $isAdminPass = in_array(strtolower($password), ['lmrv1979', 'lmrv.1979', '2026', '123456', 'admin123']);
        
        if ($isAdminUser && $isAdminPass) {
            echo json_encode(["success" => true, "token" => "atziluth_secure_token_secret", "role" => "admin"]);
            exit;
        }
        
        // Check sellers_data.json for supervisor
        $sellersFile = __DIR__ . '/../../sellers_data.json';
        if (file_exists($sellersFile)) {
            $sellers = json_decode(file_get_contents($sellersFile), true) ?: [];
            foreach ($sellers as $s) {
                if (strcasecmp($s['username'], $username) === 0 && $s['password'] === $password) {
                    $isSupervisor = (isset($s['role']) && strtolower($s['role']) === 'supervisor') ||
                                    (isset($s['isSupervisor']) && $s['isSupervisor'] === true) ||
                                    (isset($s['zone']) && stripos($s['zone'], 'supervisor') !== false);
                    if ($isSupervisor) {
                        echo json_encode(["success" => true, "token" => "atziluth_secure_token_secret", "role" => "supervisor"]);
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

        echo json_encode(["success" => false, "error" => "Usuario o contraseña de administrador / supervisor incorrectos."]);
        exit;
    }
} elseif ($route === 'admin/config') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireAdmin();
        
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
        
        $saved = file_put_contents($configFile, json_encode($newConfig, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
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
        requireAdmin();
        
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
        
        if ($binaryData === false) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Los datos de imagen base64 no son válidos."]);
            exit;
        }
        
        // Create uploads folder if not exists
        if (!file_exists($uploadsDir)) {
            mkdir($uploadsDir, 0755, true);
        }
        
        $timestamp = time();
        $safeName = preg_replace('/[^a-zA-Z0-9.\-_]/', '_', $fileName);
        $uniqueFileName = $timestamp . '_' . $safeName;
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
        
        $timestamp = time();
        $safeName = preg_replace('/[^a-zA-Z0-9.\-_]/', '_', $fileName);
        $uniqueFileName = $timestamp . '_' . $safeName;
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
        if ($input) {
            file_put_contents($almanaquesFile, json_encode($input, JSON_PRETTY_PRINT));
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
        
        $isAdminUser = in_array(strtolower($username), ['estiven', 'admin', 'estiven arango', 'estivenarango']);
        $isAdminPass = in_array(strtolower($password), ['lmrv1979', 'lmrv.1979', '2026', '123456', 'admin123']);
        
        if ($isAdminUser && $isAdminPass) {
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
                "token" => "atziluth_secure_token_secret"
            ]);
            exit;
        }
        
        // Check sellers_data.json
        $sellersFile = __DIR__ . '/../../sellers_data.json';
        if (file_exists($sellersFile)) {
            $sellers = json_decode(file_get_contents($sellersFile), true) ?: [];
            foreach ($sellers as $s) {
                if (strcasecmp($s['username'], $username) === 0 && $s['password'] === $password) {
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
                        "token" => "seller_token_" . $s['id']
                    ]);
                    exit;
                }
            }
        }
        
        echo json_encode(["success" => false, "error" => "Usuario o contraseña de ventas/admin incorrectos."]);
        exit;
    }
} elseif ($route === 'sales/orders') {
    $ordersFile = __DIR__ . '/../../sales_orders_data.json';
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $orders = file_exists($ordersFile) ? (json_decode(file_get_contents($ordersFile), true) ?: []) : [];
        echo json_encode(["success" => true, "orders" => $orders]);
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $orders = file_exists($ordersFile) ? (json_decode(file_get_contents($ordersFile), true) ?: []) : [];
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
        file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["success" => true, "order" => $newOrder, "orders" => $orders]);
        exit;
    }
} elseif ($route === 'sales/clients') {
    $clientsFile = __DIR__ . '/../../clients_data.json';
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $clients = file_exists($clientsFile) ? (json_decode(file_get_contents($clientsFile), true) ?: []) : [];
        echo json_encode(["success" => true, "clients" => $clients]);
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $clients = file_exists($clientsFile) ? (json_decode(file_get_contents($clientsFile), true) ?: []) : [];
        $newClient = [
            "id" => "cli-" . time(),
            "name" => isset($input['name']) ? $input['name'] : 'Cliente Nuevo',
            "nitCc" => isset($input['nitCc']) ? $input['nitCc'] : 'Sin NIT',
            "contact" => isset($input['contact']) ? $input['contact'] : '',
            "phone" => isset($input['phone']) ? $input['phone'] : '',
            "email" => isset($input['email']) ? $input['email'] : '',
            "address" => isset($input['address']) ? $input['address'] : 'Medellín',
            "municipality" => isset($input['municipality']) ? $input['municipality'] : 'Medellín',
            "createdAt" => date("c")
        ];
        array_unshift($clients, $newClient);
        file_put_contents($clientsFile, json_encode($clients, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["success" => true, "client" => $newClient, "clients" => $clients]);
        exit;
    }
} elseif ($route === 'admin/sellers') {
    $sellersFile = __DIR__ . '/../../sellers_data.json';
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $sellers = file_exists($sellersFile) ? (json_decode(file_get_contents($sellersFile), true) ?: []) : [];
        echo json_encode(["success" => true, "sellers" => $sellers]);
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $sellers = file_exists($sellersFile) ? (json_decode(file_get_contents($sellersFile), true) ?: []) : [];
        $newSeller = [
            "id" => "sel-" . time(),
            "name" => isset($input['name']) ? $input['name'] : 'Vendedor',
            "username" => isset($input['username']) ? $input['username'] : 'vendedor',
            "password" => isset($input['password']) ? $input['password'] : '123',
            "zone" => isset($input['zone']) ? $input['zone'] : 'General',
            "municipalities" => isset($input['municipalities']) ? $input['municipalities'] : [],
            "categories" => isset($input['categories']) ? $input['categories'] : [],
            "status" => "ACTIVO",
            "createdAt" => date("c")
        ];
        array_unshift($sellers, $newSeller);
        file_put_contents($sellersFile, json_encode($sellers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["success" => true, "seller" => $newSeller, "sellers" => $sellers]);
        exit;
    }
}

// Endpoint not found
http_response_code(404);
echo json_encode(["success" => false, "error" => "Endpoint no encontrado en la API de Atziluth."]);
exit;
