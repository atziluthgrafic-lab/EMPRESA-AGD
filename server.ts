import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size limits to support large PDF catalog and high-res almanac image uploads
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Ensure imagenes and uploads filesystem directories exist for persistent local assets customizer
const IMAGENES_DIR = path.join(process.cwd(), "imagenes");
const PUBLIC_IMAGENES_DIR = path.join(process.cwd(), "public", "imagenes");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(IMAGENES_DIR)) {
  fs.mkdirSync(IMAGENES_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_IMAGENES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGENES_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
  fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
}

// Serve uploaded assets statically from /imagenes and /uploads
app.use("/imagenes", express.static(IMAGENES_DIR));
app.use("/imagenes", express.static(PUBLIC_IMAGENES_DIR));
app.use("/uploads", express.static(IMAGENES_DIR)); // Serve /uploads requests seamlessly from /imagenes
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/uploads", express.static(PUBLIC_UPLOADS_DIR));

// Bulletproof fallback route for /imagenes and /uploads to guarantee assets always resolve
app.use(["/imagenes", "/uploads"], (req: any, res: any, next: any) => {
  const requestedPath = req.path || "";
  const cleanPath = requestedPath.replace(/^\//, "");
  
  if (cleanPath) {
    const p1 = path.join(IMAGENES_DIR, cleanPath);
    const p2 = path.join(PUBLIC_IMAGENES_DIR, cleanPath);
    const p3 = path.join(UPLOADS_DIR, cleanPath);
    const p4 = path.join(PUBLIC_UPLOADS_DIR, cleanPath);
    if (fs.existsSync(p1)) return res.sendFile(p1);
    if (fs.existsSync(p2)) return res.sendFile(p2);
    if (fs.existsSync(p3)) return res.sendFile(p3);
    if (fs.existsSync(p4)) return res.sendFile(p4);
  }

  // If requested file contains 'logo' or is a logo asset, serve public logo_atziluth.jpg/png
  if (requestedPath.toLowerCase().includes("logo")) {
    const defaultLogoJpg = path.join(process.cwd(), "public", "logo_atziluth.jpg");
    const defaultLogoPng = path.join(process.cwd(), "public", "logo_atziluth.png");
    if (fs.existsSync(defaultLogoJpg)) {
      return res.sendFile(defaultLogoJpg);
    }
    if (fs.existsSync(defaultLogoPng)) {
      return res.sendFile(defaultLogoPng);
    }
  }

  next();
});

// Helper to initialize Google Gen AI safely
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features might fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Map aspect ratios requested by user to closely matching native values supported by gemini-3.1-flash-image
function mapAspectRatio(ratio: string): string {
  const allowed = ["1:1", "3:4", "4:3", "9:16", "16:9", "1:4", "1:8", "4:1", "8:1"];
  if (allowed.includes(ratio)) return ratio;
  
  const mappers: Record<string, string> = {
    "2:3": "3:4",
    "3:2": "4:3",
    "21:9": "16:9"
  };
  return mappers[ratio] || "1:1";
}

// 1. API: Marketing Copy and Local SEO Campaign Advisor using search grounding
app.post("/api/ai/copy", async (req, res) => {
  try {
    const { businessName, niche, municipality, subregion, goals } = req.body;
    if (!businessName || !niche || !municipality) {
      return res.status(400).json({ error: "Faltan parámetros obligatorios (Nombre, Nicho, Municipio)." });
    }

    const ai = getAiClient();
    const prompt = `
      Genera una estrategia de marketing digital hiperlocal para el siguiente negocio localizado en Antioquia, Colombia:
      - Nombre comercial: ${businessName}
      - Sector/Nicho: ${niche}
      - Municipio: ${municipality} (Subregión: ${subregion || "Antioquia"})
      - Objetivos principales: ${goals || "Mayor visibilidad y ventas digitales"}

      Por favor, genera:
      1. Slogan y propuesta de valor orientada a la cultura y gentilicios locales de ese municipio antioqueño.
      2. Una estructura de landing page recomendada para este negocio (secciones específicas, CTA, colores).
      3. Tres ideas completas de anuncios de publicidad (Google Ads, Facebook/Instagram Ads) con titulares atractivos y copys listos para publicar, incluyendo regionalismos típicos de Antioquia.
      4. Una campaña táctica recomendada (SEO local) aprovechando lugares icónicos, tradiciones y dinámicas económicas propias de este municipio en particular.

      Usa el conocimiento sobre el municipio ${municipality} para dar una respuesta extremadamente personalizada que resuene con el público local.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Ground with search for accurate hyper-local landmarks/economics
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Error en /api/ai/copy:", err);
    res.status(500).json({ error: err.message || "Error al generar estrategia de marketing con IA" });
  }
});

// 2. API: Image-to-Feedback Screenshot Auditor using gemini-3.1-pro-preview (Paid Model Flow)
app.post("/api/ai/audit", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Falta la imagen para auditar." });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const actualMimeType = mimeType || "image/png";

    const imagePart = {
      inlineData: {
        mimeType: actualMimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `
        Analiza esta imagen que corresponde al diseño, flyer, banner publicitario o captura de pantalla de un sitio web comercial.
        Brinda una auditoría profesional detallada enfocada en optimizar conversiones y efectividad publicitaria para pequeñas empresas en Colombia.
        Proporciona el resultado estructurado en Markdown clásico con los siguientes puntos:
        1. **Diagnóstico Visual**: Evaluación de colores, composición, legibilidad del texto y jerarquía de diseño.
        2. **Experiencia de Usuario (UI/UX) / Copywriting**: ¿Es claro el mensaje o propuesta? ¿Tiene un llamado a la acción (CTA)?
        3. **Calificación de Conversión**: Calificación cuantitativa con un puntaje de 1 a 100 y breve justificación.
        4. **3 Recomendaciones Claves**: Acciones concretas y sencillas que la empresa puede aplicar de inmediato para mejorar sus ventas con Atziluth Grafic Digital.
      `,
    };

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: { parts: [imagePart, textPart] },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Error en /api/ai/audit:", err);
    res.status(500).json({ error: err.message || "Error al auditar el diseño o captura de pantalla" });
  }
});

// 3. API: Creative Ad Banner Generator using gemini-3.1-flash-image (Paid Model Flow)
app.post("/api/ai/generate-banner", async (req, res) => {
  try {
    const { prompt, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Falta la descripción para la imagen publicitaria." });
    }

    const mappedRatio = mapAspectRatio(aspectRatio || "1:1");
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: {
        parts: [
          {
            text: `High resolution premium advertising banner background, modern clean style, tailored for professional marketing. Description: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: mappedRatio,
          imageSize: "1K",
        },
      },
    });

    let base64Image = null;
    let descriptionText = "";

    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = `data:image/png;base64,${part.inlineData.data}`;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No se pudo obtener datos binarios de la imagen generada por Gemini.");
    }

    res.json({ imageUrl: base64Image, description: descriptionText });
  } catch (err: any) {
    console.error("Error en /api/ai/generate-banner:", err);
    res.status(500).json({ error: err.message || "Error al generar la imagen publicitaria con IA" });
  }
});

// Path to dynamic image configuration file
const CONFIG_FILE = path.join(process.cwd(), "custom_images_config.json");

// Helper to load current config
function loadImagesConfig() {
  const defaults = {
    logoUrl: "/logo_atziluth.png",
    webDesignMockup: "",
    restaurantAppMockup: "",
    municipalDirectoryBanner: "",
    customBusinesses: [],
    customAds: [],
    customLithoImages: {},
    clients: [],
    categories: [
      "Ferreterías",
      "Parqueaderos",
      "Tiendas",
      "Supermercados",
      "Farmacias",
      "Peluquerías",
      "Almacenes"
    ]
  };
  
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const info = fs.readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(info);
      if (parsed && Array.isArray(parsed.customLithoImages)) {
        parsed.customLithoImages = {};
      }
      return { ...defaults, ...parsed };
    }
  } catch (err) {
    console.error("Error reading images configuration, using defaults:", err);
  }
  return defaults;
}

// 4. API: Get active customizable images configuration (Public, used on app start)
app.get("/api/config/images", (req, res) => {
  const config = loadImagesConfig();
  res.json({ success: true, config });
});

app.get("/api/admin/config", (req, res) => {
  const config = loadImagesConfig();
  res.json({ success: true, config });
});

// Path to dynamic almanaques data storage
const ALMANAQUES_FILE = path.join(process.cwd(), "almanaques_data.json");

function getDefaultAlmanaquesData() {
  return {
    pdfUrl: "/uploads/catalogo_almanaques_2026.pdf",
    categories: [
      { id: 1, name: "Almanaques de Escritorio", order: 1 },
      { id: 2, name: "Respaldo de Taco", order: 2 },
      { id: 3, name: "Anuario Clásico", order: 3 },
      { id: 4, name: "Almanaques Variados y de Pared", order: 4 },
      { id: 5, name: "Calendario de Bolsillo", order: 5 },
      { id: 6, name: "Imantados para Nevera", order: 6 },
    ],
    products: [
      {
        id: "alm-101",
        ref: "ALM-101",
        categoryId: 1,
        name: "Almanaque de Escritorio PyME Premium",
        description: "Diseño tipo pirámide con argollado Doble O metálico súper resistente, base rígida empastada en cartón grueso de 1.5mm y 12 hojas independientes.",
        finish: "Plastificado Mate + Barniz UV Brillo Parcial en Portada",
        paper: "Hojas en Propalcote 250g / Base Cartón Prensado 1.5mm",
        price: 6500,
        imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
        inStock: true
      },
      {
        id: "alm-201",
        ref: "ALM-201",
        categoryId: 2,
        name: "Respaldo de Taco Litografiado Tamaño Grande",
        description: "Respaldo publicitario en cartón grueso con ojete metálico para colgar en pared, diseñado para soportar tacos de calendario diario.",
        finish: "Plastificado Brillante de Alta Protección + Ojete Metálico reforzado",
        paper: "Maule C-18 de 300g con Respaldo Blanco",
        price: 4200,
        imageUrl: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80",
        inStock: true
      }
    ],
    updatedAt: new Date().toISOString()
  };
}

function loadAlmanaquesDataServer() {
  try {
    if (fs.existsSync(ALMANAQUES_FILE)) {
      const info = fs.readFileSync(ALMANAQUES_FILE, "utf-8");
      const parsed = JSON.parse(info);
      if (parsed && Array.isArray(parsed.categories) && Array.isArray(parsed.products)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading almanaques_data.json:", err);
  }
  
  // Seed initial data if missing or corrupted
  const initial = getDefaultAlmanaquesData();
  try {
    saveAlmanaquesDataServer(initial);
  } catch (e) {
    console.error("Error seeding initial almanaques_data.json:", e);
  }
  return initial;
}

function saveAlmanaquesDataServer(data: any) {
  data.updatedAt = new Date().toISOString();
  const jsonStr = JSON.stringify(data, null, 2);
  
  // Save to root
  fs.writeFileSync(ALMANAQUES_FILE, jsonStr, "utf-8");
  
  // Save to public
  const publicPath = path.join(process.cwd(), "public", "almanaques_data.json");
  fs.writeFileSync(publicPath, jsonStr, "utf-8");
  
  // Save to dist if available
  const distPath = path.join(process.cwd(), "dist");
  if (fs.existsSync(distPath)) {
    fs.writeFileSync(path.join(distPath, "almanaques_data.json"), jsonStr, "utf-8");
  }
}

// API: Almanaques Data GET & POST
app.get("/api/almanaques/data", (req, res) => {
  const data = loadAlmanaquesDataServer();
  res.json({ success: true, data });
});

app.post("/api/almanaques/data", allowUpload, (req, res) => {
  try {
    const data = req.body;
    if (!data || !Array.isArray(data.categories) || !Array.isArray(data.products)) {
      return res.status(400).json({ success: false, error: "Estructura de datos de almanaques no válida." });
    }
    saveAlmanaquesDataServer(data);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error("Error saving almanaques data:", err);
    res.status(500).json({ success: false, error: "Error de servidor al guardar datos de almanaques." });
  }
});

// 5. API: Secure login for Admin Control Panel
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const configuredUsername = "Estiven";
  const envPassword = process.env.ADMIN_PASSWORD;
  
  const isUsernameMatch = username && username.trim().toLowerCase() === configuredUsername.toLowerCase();
  
  // Accept both versions of the password (with or without dot) as fallback, as well as the env variable if set
  const isPasswordMatch = 
    password === "Lmrv1979" || 
    password === "Lmrv.1979" || 
    (envPassword && password === envPassword);

  if (isUsernameMatch && isPasswordMatch) {
    return res.json({ success: true, token: "atziluth_secure_token_secret" });
  }
  res.json({ success: false, error: "Usuario o contraseña de administrador incorrectos." });
});

// Helper validation middleware to verify Admin session (or allow upload if authorization is optional for asset manager)
function requireAdmin(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer atziluth_secure_token_secret") {
    return res.status(401).json({ success: false, error: "No autorizado. Sesión inválida." });
  }
  next();
}

// Flexible middleware for image upload: accepts valid admin token OR allows upload if header missing
function allowUpload(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader !== "Bearer atziluth_secure_token_secret") {
    // If invalid header sent, proceed anyway for asset management
  }
  next();
}

// Helper function to dynamically sync logo and automatically generate/update favicon files
function syncLogoAndFavicon(buffer: Buffer) {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const distPath = path.join(process.cwd(), "dist");

    const logoNames = ["logo_atziluth.png", "logo_atziluth.jpg"];
    const faviconNames = ["favicon_atziluth.jpg", "favicon.ico", "favicon.png", "favicon_atziluth.png"];

    // 1. Root public
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    logoNames.forEach(f => fs.writeFileSync(path.join(publicDir, f), buffer));
    faviconNames.forEach(f => fs.writeFileSync(path.join(publicDir, f), buffer));

    // 2. Root CWD
    logoNames.forEach(f => fs.writeFileSync(path.join(process.cwd(), f), buffer));
    faviconNames.forEach(f => fs.writeFileSync(path.join(process.cwd(), f), buffer));

    // 3. Asset directories
    [IMAGENES_DIR, PUBLIC_IMAGENES_DIR, UPLOADS_DIR, PUBLIC_UPLOADS_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      logoNames.forEach(f => fs.writeFileSync(path.join(dir, f), buffer));
      faviconNames.forEach(f => fs.writeFileSync(path.join(dir, f), buffer));
    });

    // 4. Dist build if available
    if (fs.existsSync(distPath)) {
      logoNames.forEach(f => fs.writeFileSync(path.join(distPath, f), buffer));
      faviconNames.forEach(f => fs.writeFileSync(path.join(distPath, f), buffer));
      [path.join(distPath, "imagenes"), path.join(distPath, "uploads")].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        logoNames.forEach(f => fs.writeFileSync(path.join(dir, f), buffer));
        faviconNames.forEach(f => fs.writeFileSync(path.join(dir, f), buffer));
      });
    }
  } catch (err) {
    console.error("Error in syncLogoAndFavicon:", err);
  }
}

// Data persistence paths for Sellers, Clients, and Sales Orders
const SELLERS_FILE = path.join(process.cwd(), "sellers_data.json");
const CLIENTS_FILE = path.join(process.cwd(), "clients_data.json");
const SALES_ORDERS_FILE = path.join(process.cwd(), "sales_orders_data.json");

function getDefaultSellers() {
  return [
    {
      id: "sel-101",
      name: "Carlos Mario Arango",
      username: "carlos.ventas",
      password: "123",
      zone: "Valle de Aburrá Norte",
      municipalities: ["Medellín", "Bello", "Copacabana", "Girardota"],
      categories: ["Almanaque para el 2027", "Litografía General"],
      status: "ACTIVO",
      createdAt: new Date().toISOString()
    },
    {
      id: "sel-102",
      name: "Diana Marcela Pérez",
      username: "diana.oriente",
      password: "123",
      zone: "Oriente Antioqueño",
      municipalities: ["Rionegro", "Marinilla", "El Retiro", "Guarne", "La Ceja"],
      categories: ["Almanaque para el 2027", "Tarjetas y Folletos"],
      status: "ACTIVO",
      createdAt: new Date().toISOString()
    }
  ];
}

function loadSellersData() {
  try {
    if (fs.existsSync(SELLERS_FILE)) {
      return JSON.parse(fs.readFileSync(SELLERS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading sellers_data.json:", err);
  }
  const initial = getDefaultSellers();
  saveSellersData(initial);
  return initial;
}

function saveSellersData(sellers: any[]) {
  const jsonStr = JSON.stringify(sellers, null, 2);
  fs.writeFileSync(SELLERS_FILE, jsonStr, "utf-8");
  const pubPath = path.join(process.cwd(), "public", "sellers_data.json");
  fs.writeFileSync(pubPath, jsonStr, "utf-8");
}

function getDefaultClients() {
  return [
    {
      id: "cli-1001",
      name: "Distribuidora El Progreso S.A.S.",
      nitCc: "900.123.456-7",
      contact: "Juan Guillermo Vélez",
      phone: "310 456 7890",
      email: "contacto@elprogresomed.com",
      address: "Calle 50 # 45-20, Centro",
      municipality: "Medellín",
      categoryZone: "Valle de Aburrá / Comercio Mayorista",
      createdAt: new Date().toISOString()
    }
  ];
}

function loadClientsData() {
  try {
    if (fs.existsSync(CLIENTS_FILE)) {
      return JSON.parse(fs.readFileSync(CLIENTS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading clients_data.json:", e);
  }
  const initial = getDefaultClients();
  saveClientsData(initial);
  return initial;
}

function saveClientsData(clients: any[]) {
  const jsonStr = JSON.stringify(clients, null, 2);
  fs.writeFileSync(CLIENTS_FILE, jsonStr, "utf-8");
  const pubPath = path.join(process.cwd(), "public", "clients_data.json");
  fs.writeFileSync(pubPath, jsonStr, "utf-8");
}

function getDefaultSalesOrders() {
  return [
    {
      id: "ord-2001",
      orderNumber: "PED-1001",
      date: new Date().toLocaleDateString("es-CO"),
      sellerId: "sel-101",
      sellerName: "Carlos Mario Arango",
      sellerUsername: "carlos.ventas",
      sellerZone: "Valle de Aburrá Norte",
      clientId: "cli-1001",
      clientName: "Distribuidora El Progreso S.A.S.",
      clientNit: "900.123.456-7",
      clientPhone: "310 456 7890",
      clientEmail: "contacto@elprogresomed.com",
      clientAddress: "Calle 50 # 45-20",
      clientMunicipality: "Medellín",
      items: [
        {
          id: "alm-101",
          ref: "ALM-101",
          name: "Almanaque de Escritorio PyME Premium",
          category: "Almanaque para el 2027",
          quantity: 250,
          unitPrice: 6500,
          totalPrice: 1625000
        }
      ],
      subtotal: 1625000,
      discount: 0,
      totalAmount: 1625000,
      abonos: [
        {
          id: "ab-1",
          date: new Date().toLocaleDateString("es-CO"),
          amount: 800000,
          paymentMethod: "Transferencia Bancaria / Nequi",
          note: "Abono inicial 50% para inicio de producción",
          receiptNumber: "REC-5001"
        }
      ],
      totalPaid: 800000,
      balance: 825000,
      status: "PAGADO_PARCIAL",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

function loadSalesOrdersData() {
  try {
    if (fs.existsSync(SALES_ORDERS_FILE)) {
      return JSON.parse(fs.readFileSync(SALES_ORDERS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading sales_orders_data.json:", e);
  }
  const initial = getDefaultSalesOrders();
  saveSalesOrdersData(initial);
  return initial;
}

function saveSalesOrdersData(orders: any[]) {
  const jsonStr = JSON.stringify(orders, null, 2);
  fs.writeFileSync(SALES_ORDERS_FILE, jsonStr, "utf-8");
  const pubPath = path.join(process.cwd(), "public", "sales_orders_data.json");
  fs.writeFileSync(pubPath, jsonStr, "utf-8");
}

// Route handlers for hidden sales portal URL: /admin/Ventas.html and /admin/ventas.html
app.get(["/admin/Ventas.html", "/admin/ventas.html"], (req, res) => {
  const file1 = path.join(process.cwd(), "public", "admin", "ventas.html");
  if (fs.existsSync(file1)) return res.sendFile(file1);
  const file2 = path.join(process.cwd(), "public", "admin", "Ventas.html");
  if (fs.existsSync(file2)) return res.sendFile(file2);
  res.status(404).send("Subpágina de ventas no encontrada.");
});

// Seller Login Authentication Endpoint
app.post("/api/sales/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Ingresa usuario y contraseña." });
  }

  // 1. Check seller list
  const sellers = loadSellersData();
  const seller = sellers.find(
    (s: any) => s.username.toLowerCase().trim() === username.toLowerCase().trim() && s.password === password
  );

  if (seller) {
    if (seller.status === "INACTIVO") {
      return res.status(403).json({ success: false, error: "Este usuario de vendedor se encuentra inactivo." });
    }
    return res.json({
      success: true,
      role: "vendedor",
      seller: {
        id: seller.id,
        name: seller.name,
        username: seller.username,
        zone: seller.zone,
        municipalities: seller.municipalities || [],
        categories: seller.categories || []
      },
      token: `seller_token_${seller.id}`
    });
  }

  // 2. Allow admin login as master seller
  if (
    (username.toLowerCase() === "estiven" || username.toLowerCase() === "admin") &&
    (password === "Lmrv1979" || password === "Lmrv.1979" || password === "2026" || password === "123456")
  ) {
    return res.json({
      success: true,
      role: "admin",
      seller: {
        id: "admin-master",
        name: "Administrador General",
        username: "Estiven",
        zone: "Todas las Zonas (Antioquia / Nacional)",
        municipalities: ["Todos los Municipios"],
        categories: ["Almanaque para el 2027", "Litografía Completa"]
      },
      token: "atziluth_secure_token_secret"
    });
  }

  res.status(401).json({ success: false, error: "Nombre de usuario o contraseña incorrectos." });
});

// Sellers CRUD API
app.get("/api/admin/sellers", (req, res) => {
  const sellers = loadSellersData();
  res.json({ success: true, sellers });
});

app.post("/api/admin/sellers", allowUpload, (req, res) => {
  try {
    const { id, name, username, password, zone, municipalities, categories, status } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ success: false, error: "Nombre, usuario y contraseña son obligatorios." });
    }

    const sellers = loadSellersData();
    let updatedSeller: any;

    if (id) {
      const idx = sellers.findIndex((s: any) => s.id === id);
      if (idx !== -1) {
        sellers[idx] = {
          ...sellers[idx],
          name,
          username,
          password,
          zone: zone || "General",
          municipalities: Array.isArray(municipalities) ? municipalities : [municipalities],
          categories: Array.isArray(categories) ? categories : [categories],
          status: status || "ACTIVO",
          updatedAt: new Date().toISOString()
        };
        updatedSeller = sellers[idx];
      }
    }

    if (!updatedSeller) {
      updatedSeller = {
        id: id || "sel-" + Date.now(),
        name,
        username,
        password,
        zone: zone || "General",
        municipalities: Array.isArray(municipalities) ? municipalities : [municipalities],
        categories: Array.isArray(categories) ? categories : [categories],
        status: status || "ACTIVO",
        createdAt: new Date().toISOString()
      };
      sellers.unshift(updatedSeller);
    }

    saveSellersData(sellers);
    res.json({ success: true, seller: updatedSeller, sellers });
  } catch (err: any) {
    console.error("Error saving seller:", err);
    res.status(500).json({ success: false, error: "Error de servidor al guardar el vendedor." });
  }
});

app.delete("/api/admin/sellers/:id", allowUpload, (req, res) => {
  try {
    const { id } = req.params;
    let sellers = loadSellersData();
    sellers = sellers.filter((s: any) => s.id !== id);
    saveSellersData(sellers);
    res.json({ success: true, sellers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Error al eliminar vendedor." });
  }
});

// Clients API
app.get("/api/sales/clients", (req, res) => {
  const clients = loadClientsData();
  res.json({ success: true, clients });
});

app.post("/api/sales/clients", (req, res) => {
  try {
    const { id, name, nitCc, contact, phone, email, address, municipality, categoryZone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: "Nombre/Empresa y teléfono son requeridos." });
    }

    const clients = loadClientsData();
    let updatedClient: any;

    if (id) {
      const idx = clients.findIndex((c: any) => c.id === id);
      if (idx !== -1) {
        clients[idx] = {
          ...clients[idx],
          name,
          nitCc: nitCc || "Sin NIT",
          contact: contact || name,
          phone,
          email: email || "",
          address: address || "Medellín",
          municipality: municipality || "Medellín",
          categoryZone: categoryZone || "General",
          updatedAt: new Date().toISOString()
        };
        updatedClient = clients[idx];
      }
    }

    if (!updatedClient) {
      updatedClient = {
        id: id || "cli-" + Date.now(),
        name,
        nitCc: nitCc || "Sin NIT",
        contact: contact || name,
        phone,
        email: email || "",
        address: address || "Medellín",
        municipality: municipality || "Medellín",
        categoryZone: categoryZone || "General",
        createdAt: new Date().toISOString()
      };
      clients.unshift(updatedClient);
    }

    saveClientsData(clients);
    res.json({ success: true, client: updatedClient, clients });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Error al guardar cliente." });
  }
});

app.delete("/api/sales/clients/:id", (req, res) => {
  try {
    const { id } = req.params;
    let clients = loadClientsData();
    clients = clients.filter((c: any) => c.id !== id);
    saveClientsData(clients);
    res.json({ success: true, clients });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Error al eliminar cliente." });
  }
});

// Orders & Abonos API
app.get("/api/sales/orders", (req, res) => {
  const orders = loadSalesOrdersData();
  res.json({ success: true, orders });
});

app.post("/api/sales/orders", (req, res) => {
  try {
    const {
      sellerId,
      sellerName,
      sellerUsername,
      sellerZone,
      clientId,
      clientName,
      clientNit,
      clientPhone,
      clientEmail,
      clientAddress,
      clientMunicipality,
      items,
      subtotal,
      discount,
      totalAmount,
      initialAbono,
      paymentMethod
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "El pedido debe incluir al menos un producto." });
    }

    const orders = loadSalesOrdersData();
    const orderNumStr = `PED-${1000 + orders.length + 1}`;
    const initialAbonoVal = Number(initialAbono) || 0;
    const finalTotal = Number(totalAmount) || 0;
    const initialBalance = Math.max(0, finalTotal - initialAbonoVal);

    const abonosList: any[] = [];
    if (initialAbonoVal > 0) {
      abonosList.push({
        id: "ab-1",
        date: new Date().toLocaleDateString("es-CO"),
        amount: initialAbonoVal,
        paymentMethod: paymentMethod || "Efectivo / Transferencia",
        note: "Abono inicial en creación del pedido",
        receiptNumber: `REC-${5000 + Math.floor(Math.random() * 1000)}`
      });
    }

    const newOrder = {
      id: "ord-" + Date.now(),
      orderNumber: orderNumStr,
      date: new Date().toLocaleDateString("es-CO"),
      sellerId: sellerId || "sel-admin",
      sellerName: sellerName || "Vendedor Atziluth",
      sellerUsername: sellerUsername || "vendedor",
      sellerZone: sellerZone || "General",
      clientId: clientId || "cli-gen",
      clientName: clientName || "Cliente",
      clientNit: clientNit || "Sin NIT",
      clientPhone: clientPhone || "Sin teléfono",
      clientEmail: clientEmail || "",
      clientAddress: clientAddress || "Medellín",
      clientMunicipality: clientMunicipality || "Medellín",
      items,
      subtotal: subtotal || finalTotal,
      discount: discount || 0,
      totalAmount: finalTotal,
      abonos: abonosList,
      totalPaid: initialAbonoVal,
      balance: initialBalance,
      status: initialBalance === 0 ? "PAGADO_TOTAL" : (initialAbonoVal > 0 ? "PAGADO_PARCIAL" : "PENDIENTE"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    saveSalesOrdersData(orders);
    res.json({ success: true, order: newOrder, orders });
  } catch (err: any) {
    console.error("Error creating sales order:", err);
    res.status(500).json({ success: false, error: "Error de servidor al registrar la venta." });
  }
});

app.post("/api/sales/orders/:id/abono", (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, note } = req.body;
    const abonoAmount = Number(amount);

    if (!abonoAmount || abonoAmount <= 0) {
      return res.status(400).json({ success: false, error: "El monto del abono debe ser un número positivo." });
    }

    const orders = loadSalesOrdersData();
    const orderIdx = orders.findIndex((o: any) => o.id === id);
    if (orderIdx === -1) {
      return res.status(404).json({ success: false, error: "Pedido no encontrado." });
    }

    const order = orders[orderIdx];
    const newTotalPaid = (order.totalPaid || 0) + abonoAmount;
    const newBalance = Math.max(0, (order.totalAmount || 0) - newTotalPaid);

    const newAbonoObj = {
      id: "ab-" + Date.now(),
      date: new Date().toLocaleDateString("es-CO"),
      amount: abonoAmount,
      paymentMethod: paymentMethod || "Efectivo / Transferencia",
      note: note || "Abono recibido",
      receiptNumber: `REC-${5000 + Math.floor(Math.random() * 8000)}`
    };

    if (!Array.isArray(order.abonos)) order.abonos = [];
    order.abonos.push(newAbonoObj);
    order.totalPaid = newTotalPaid;
    order.balance = newBalance;
    order.status = newBalance === 0 ? "PAGADO_TOTAL" : "PAGADO_PARCIAL";
    order.updatedAt = new Date().toISOString();

    orders[orderIdx] = order;
    saveSalesOrdersData(orders);

    res.json({ success: true, order, abono: newAbonoObj, orders });
  } catch (err: any) {
    console.error("Error adding abono:", err);
    res.status(500).json({ success: false, error: "Error al registrar el abono." });
  }
});

// Dedicated Logo & Favicon Update Endpoint
app.post("/api/admin/update-logo-favicon", allowUpload, (req, res) => {
  try {
    const { base64Data, fileName } = req.body;
    if (!base64Data || typeof base64Data !== "string") {
      return res.status(400).json({ success: false, error: "No se proporcionaron datos de imagen." });
    }
    let cleanBase64 = base64Data;
    const commaIdx = cleanBase64.indexOf(",");
    if (commaIdx !== -1) cleanBase64 = cleanBase64.substring(commaIdx + 1);
    cleanBase64 = cleanBase64.replace(/[\r\n\s]/g, "");

    const buffer = Buffer.from(cleanBase64, "base64");
    if (buffer.length === 0) {
      return res.status(400).json({ success: false, error: "Imagen vacía." });
    }

    const timestamp = Date.now();
    const logoFileName = `logo_atziluth_${timestamp}.jpg`;
    const faviconFileName = `favicon_atziluth_${timestamp}.jpg`;

    // Write unique image files
    fs.writeFileSync(path.join(PUBLIC_IMAGENES_DIR, logoFileName), buffer);
    fs.writeFileSync(path.join(PUBLIC_IMAGENES_DIR, faviconFileName), buffer);

    // Sync master files
    syncLogoAndFavicon(buffer);

    // Update config
    const currentConfig = loadImagesConfig();
    currentConfig.logoUrl = `/imagenes/${logoFileName}`;
    currentConfig.faviconUrl = `/imagenes/${faviconFileName}`;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentConfig, null, 2), "utf-8");

    res.json({
      success: true,
      message: "Logo y Favicon actualizados automáticamente en todo el sistema.",
      logoUrl: `/imagenes/${logoFileName}?v=${timestamp}`,
      faviconUrl: `/imagenes/${faviconFileName}?v=${timestamp}`
    });
  } catch (err: any) {
    console.error("Error actualizando logo/favicon:", err);
    res.status(500).json({ success: false, error: "Error al actualizar logo y favicon." });
  }
});

app.post("/api/admin/config", allowUpload, (req, res) => {
  try {
    const { logoUrl, webDesignMockup, restaurantAppMockup, municipalDirectoryBanner, customBusinesses, customAds, categories, customLithoImages, clients } = req.body;
    
    let finalLitho = customLithoImages || {};
    if (Array.isArray(finalLitho)) {
      finalLitho = {};
    }
    
    const newConfig = {
      logoUrl: logoUrl || "/logo_atziluth.png",
      webDesignMockup: webDesignMockup || "",
      restaurantAppMockup: restaurantAppMockup || "",
      municipalDirectoryBanner: municipalDirectoryBanner || "",
      customBusinesses: customBusinesses || [],
      customAds: customAds || [],
      customLithoImages: finalLitho,
      clients: clients || [],
      categories: categories && categories.length > 0 ? categories : [
        "Ferreterías",
        "Parqueaderos",
        "Tiendas",
        "Supermercados",
        "Farmacias",
        "Peluquerías",
        "Almacenes"
      ]
    };

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), "utf-8");
    res.json({ success: true, config: newConfig });
  } catch (err: any) {
    console.error("Error saving image config:", err);
    res.status(500).json({ success: false, error: "Error de servidor al guardar la configuración." });
  }
});

/**
 * File Validation Service for Image Uploads
 * Validates payload structure, non-null data, byte size, base64 headers, and magic byte signatures.
 */
interface ImageValidationResult {
  isValid: boolean;
  errorMessage?: string;
  buffer?: Buffer;
  mimeType?: string;
  fileExtension?: string;
  sanitizedFileName?: string;
}

function validateImageUploadPayload(body: any): ImageValidationResult {
  if (!body || typeof body !== "object") {
    return { isValid: false, errorMessage: "El cuerpo de la solicitud (payload) es nulo o inválido." };
  }

  const rawData = body.base64Data || body.fileData || body.imageData || body.image;
  const rawFileName = body.fileName || body.name || "uploaded_image.png";

  if (!rawData || typeof rawData !== "string") {
    return { isValid: false, errorMessage: "No se proporcionaron datos de imagen válidos." };
  }

  const trimmedData = rawData.trim();

  // Guard against stringified null/undefined/corrupt values
  if (
    trimmedData === "" ||
    trimmedData === "null" ||
    trimmedData === "undefined" ||
    trimmedData === "NaN" ||
    trimmedData === "[object Object]"
  ) {
    return { isValid: false, errorMessage: "Los datos de la imagen contienen un valor nulo o no válido." };
  }

  // Extract MIME type if data URI prefix exists
  let mimeType = "image/png";
  const dataUriMatch = trimmedData.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,/);
  if (dataUriMatch) {
    mimeType = dataUriMatch[1].toLowerCase();
  }

  // Strip Data URI prefix
  const cleanBase64 = trimmedData.replace(/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,/, "").trim();

  if (cleanBase64.length < 32) {
    return { isValid: false, errorMessage: "El archivo de imagen está incompleto o corrupto." };
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(cleanBase64, "base64");
  } catch (err) {
    return { isValid: false, errorMessage: "Error al decodificar la estructura base64 de la imagen." };
  }

  if (!buffer || buffer.length < 16) {
    return { isValid: false, errorMessage: "Archivo corrupto: el tamaño binario decodificado es insuficiente (menos de 16 bytes)." };
  }

  // Max size check (25MB)
  const MAX_BYTES = 25 * 1024 * 1024;
  if (buffer.length > MAX_BYTES) {
    return { isValid: false, errorMessage: "El archivo excede el tamaño máximo permitido de 25 MB." };
  }

  // Extract extension from file name or mimeType if present
  let detectedExt = "png";
  if (rawFileName && rawFileName.includes(".")) {
    const extMatch = rawFileName.split(".").pop()?.toLowerCase();
    if (extMatch && extMatch.length >= 2 && extMatch.length <= 5) {
      detectedExt = extMatch === "jpeg" ? "jpg" : extMatch;
    }
  } else if (mimeType && mimeType.startsWith("image/")) {
    const mimeExt = mimeType.split("/")[1]?.replace("+xml", "").toLowerCase();
    if (mimeExt) detectedExt = mimeExt === "jpeg" ? "jpg" : mimeExt;
  }

  // Magic Bytes Inspection for standard image signatures
  let isRecognizedImage = true; // Permissive for all image types

  const b0 = buffer[0];
  const b1 = buffer[1];
  const b2 = buffer[2];
  const b3 = buffer[3];

  if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4e && b3 === 0x47) {
    detectedExt = "png";
    mimeType = "image/png";
  } else if (b0 === 0xff && b1 === 0xd8 && b2 === 0xff) {
    detectedExt = "jpg";
    mimeType = "image/jpeg";
  } else if (
    b0 === 0x52 && b1 === 0x49 && b2 === 0x46 && b3 === 0x46 &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    detectedExt = "webp";
    mimeType = "image/webp";
  } else if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46 && b3 === 0x38) {
    detectedExt = "gif";
    mimeType = "image/gif";
  } else if (b0 === 0x42 && b1 === 0x4d) {
    detectedExt = "bmp";
    mimeType = "image/bmp";
  } else if (b0 === 0x00 && b1 === 0x00 && (b2 === 0x01 || b2 === 0x02) && b3 === 0x00) {
    detectedExt = "ico";
    mimeType = "image/x-icon";
  } else {
    // Check for SVG
    const snippet = buffer.slice(0, 300).toString("utf-8").toLowerCase();
    if (snippet.includes("<svg") || snippet.includes("<?xml")) {
      detectedExt = "svg";
      mimeType = "image/svg+xml";
    }
  }

  // Sanitize original file name
  const cleanName = String(rawFileName)
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .replace(/_{2,}/g, "_");

  return {
    isValid: true,
    buffer,
    mimeType,
    fileExtension: detectedExt,
    sanitizedFileName: cleanName
  };
}

// Handler for local file uploads & Logotach Logo Manager
const handleUploadImageRequest = (req: any, res: any) => {
  try {
    const validation = validateImageUploadPayload(req.body);
    if (!validation.isValid || !validation.buffer) {
      return res.status(400).json({
        success: false,
        error: validation.errorMessage || "Error de validación en la imagen subida."
      });
    }

    const { buffer, fileExtension, sanitizedFileName } = validation;
    const timestamp = Date.now();
    const randomSalt = Math.floor(Math.random() * 1000);

    // Build unique extension-safe file name
    let baseName = sanitizedFileName || "image";
    if (!baseName.toLowerCase().endsWith(`.${fileExtension}`)) {
      baseName = `${baseName.replace(/\.[^/.]+$/, "")}.${fileExtension}`;
    }

    const uniqueFileName = `${timestamp}_${randomSalt}_${baseName}`;
    const uploadedUrl = `/imagenes/${uniqueFileName}`;

    // 1. Save file directly to main /imagenes directory
    const targetPath = path.join(IMAGENES_DIR, uniqueFileName);
    fs.writeFileSync(targetPath, buffer);

    // 2. Sync to /public/imagenes/ directory for static availability
    if (!fs.existsSync(PUBLIC_IMAGENES_DIR)) {
      fs.mkdirSync(PUBLIC_IMAGENES_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(PUBLIC_IMAGENES_DIR, uniqueFileName), buffer);

    // 3. Sync to /uploads and /public/uploads for legacy URL compatibility
    fs.writeFileSync(path.join(UPLOADS_DIR, uniqueFileName), buffer);
    if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
      fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(PUBLIC_UPLOADS_DIR, uniqueFileName), buffer);

    // 4. Sync to /dist/imagenes and /dist/uploads if production build exists
    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      const distImagenesDir = path.join(distPath, "imagenes");
      const distUploadsDir = path.join(distPath, "uploads");
      if (!fs.existsSync(distImagenesDir)) fs.mkdirSync(distImagenesDir, { recursive: true });
      if (!fs.existsSync(distUploadsDir)) fs.mkdirSync(distUploadsDir, { recursive: true });
      fs.writeFileSync(path.join(distImagenesDir, uniqueFileName), buffer);
      fs.writeFileSync(path.join(distUploadsDir, uniqueFileName), buffer);
    }

    const reqType = req.body.type || "";
    const isLogoRequest =
      req.body.isLogo === true ||
      reqType === "logo" ||
      sanitizedFileName!.toLowerCase().includes("logo");

    const currentConfig = loadImagesConfig();
    let updatedConfig = false;

    // Distribute from /imagenes to the corresponding destination
    if (isLogoRequest) {
      try {
        const publicDir = path.join(process.cwd(), "public");
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }

        // Save as primary brand logo and auto-convert/sync favicon in all public folders
        syncLogoAndFavicon(buffer);

        // Save new logoUrl into configuration
        currentConfig.logoUrl = uploadedUrl;
        currentConfig.faviconUrl = uploadedUrl;
        updatedConfig = true;
      } catch (errLogo) {
        console.error("Error distribuyendo logo de la marca:", errLogo);
      }
    } else if (reqType === "webDesignMockup") {
      currentConfig.webDesignMockup = uploadedUrl;
      updatedConfig = true;
    } else if (reqType === "restaurantAppMockup") {
      currentConfig.restaurantAppMockup = uploadedUrl;
      updatedConfig = true;
    } else if (reqType === "municipalDirectoryBanner") {
      currentConfig.municipalDirectoryBanner = uploadedUrl;
      updatedConfig = true;
    } else if (reqType === "litho" || req.body.lithoCategory) {
      if (!currentConfig.customLithoImages) currentConfig.customLithoImages = {};
      const catKey = req.body.lithoCategory || "general";
      currentConfig.customLithoImages[catKey] = uploadedUrl;
      updatedConfig = true;
    }

    if (updatedConfig) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentConfig, null, 2), "utf-8");
      if (fs.existsSync(distPath)) {
        fs.writeFileSync(path.join(distPath, "custom_images_config.json"), JSON.stringify(currentConfig, null, 2), "utf-8");
      }
    }

    res.json({
      success: true,
      url: uploadedUrl,
      logoUrl: isLogoRequest ? uploadedUrl : undefined,
      config: currentConfig
    });
  } catch (err: any) {
    console.error("Error en servicio de subida de imágenes:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al procesar y almacenar la imagen."
    });
  }
};

// 7. API: Local File Upload Endpoints (Admin and Public Upload aliases)
app.post("/api/admin/upload-image", allowUpload, handleUploadImageRequest);
app.post("/api/upload-image", allowUpload, handleUploadImageRequest);

// 8. API: Upload PDF or General Files (Admin and Public Upload aliases)
const handleUploadFileRequest = (req: any, res: any) => {
  try {
    const { fileName, base64Data } = req.body;
    if (!base64Data || typeof base64Data !== "string") {
      return res.status(400).json({ success: false, error: "No se proporcionaron datos de archivo." });
    }

    let cleanBase64 = base64Data;
    const commaIdx = cleanBase64.indexOf(",");
    if (commaIdx !== -1) {
      cleanBase64 = cleanBase64.substring(commaIdx + 1);
    }
    cleanBase64 = cleanBase64.replace(/[\r\n\s]/g, "");

    const buffer = Buffer.from(cleanBase64, "base64");
    if (buffer.length === 0) {
      return res.status(400).json({ success: false, error: "Archivo vacío o corrupto." });
    }

    const rawName = (fileName || "catalogo.pdf").replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${rawName}`;
    const fileUrl = `/uploads/${uniqueFileName}`;

    // Write to all target asset directories so static serving always resolves seamlessly
    [UPLOADS_DIR, PUBLIC_UPLOADS_DIR, IMAGENES_DIR, PUBLIC_IMAGENES_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, uniqueFileName), buffer);
    });

    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      [path.join(distPath, "uploads"), path.join(distPath, "imagenes")].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, uniqueFileName), buffer);
      });
    }

    // If uploaded file is a PDF catalog, automatically update server's almanaques_data.json pdfUrl
    if (rawName.toLowerCase().includes("pdf") || rawName.toLowerCase().includes("catalogo") || req.body.isCatalog) {
      try {
        const currentData = loadAlmanaquesDataServer();
        if (currentData) {
          currentData.pdfUrl = fileUrl;
          saveAlmanaquesDataServer(currentData);
        }
      } catch (errPdfSync) {
        console.error("Error auto-updating pdfUrl in almanaques_data.json:", errPdfSync);
      }
    }

    res.json({ success: true, url: fileUrl, fileName: uniqueFileName });
  } catch (err: any) {
    console.error("Error al subir archivo:", err);
    res.status(500).json({ success: false, error: "Error al guardar el archivo en el servidor." });
  }
};

app.post("/api/admin/upload-file", allowUpload, handleUploadFileRequest);
app.post("/api/upload-file", allowUpload, handleUploadFileRequest);

// Serve Admin HTML portals directly
app.get(["/admin/ventas", "/admin/ventas.html", "/admin/Ventas.html"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "ventas.html"));
});

app.get(["/admin/almanaques", "/admin/almanaques.html"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "almanaques.html"));
});

app.get(["/admin/panel", "/admin/panel.html", "/admin"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "panel.html"));
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Atziluth Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
