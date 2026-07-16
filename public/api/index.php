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
        "customLithoImages" => [],
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
            return array_merge($defaults, $decoded);
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
        $password = isset($input['password']) ? $input['password'] : '';
        
        $configuredUsername = "Estiven";
        
        $isUsernameMatch = strcasecmp($username, $configuredUsername) === 0;
        $isPasswordMatch = ($password === "Lmrv1979" || $password === "Lmrv.1979");
        
        if ($isUsernameMatch && $isPasswordMatch) {
            echo json_encode(["success" => true, "token" => "atziluth_secure_token_secret"]);
            exit;
        } else {
            echo json_encode(["success" => false, "error" => "Usuario o contraseña de administrador incorrectos."]);
            exit;
        }
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
        
        $newConfig = [
            "webDesignMockup" => $webDesignMockup,
            "restaurantAppMockup" => $restaurantAppMockup,
            "municipalDirectoryBanner" => $municipalDirectoryBanner,
            "customBusinesses" => $customBusinesses,
            "customAds" => $customAds,
            "categories" => $categories,
            "customLithoImages" => $customLithoImages
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
}

// Endpoint not found
http_response_code(404);
echo json_encode(["success" => false, "error" => "Endpoint no encontrado en la API de Atziluth."]);
exit;
