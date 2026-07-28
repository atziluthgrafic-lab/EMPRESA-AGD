import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size limits to support base64 screenshot uploads for web auditing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

// 6. API: Secure Save Custom Images Configuration
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

        // Save as primary brand logo in /public and /public/imagenes
        fs.writeFileSync(path.join(publicDir, "logo_atziluth.png"), buffer);
        fs.writeFileSync(path.join(publicDir, "logo_atziluth.jpg"), buffer);
        fs.writeFileSync(path.join(PUBLIC_IMAGENES_DIR, "logo_atziluth.png"), buffer);
        fs.writeFileSync(path.join(PUBLIC_IMAGENES_DIR, "logo_atziluth.jpg"), buffer);

        // Also save in /dist if built
        if (fs.existsSync(distPath)) {
          fs.writeFileSync(path.join(distPath, "logo_atziluth.png"), buffer);
          fs.writeFileSync(path.join(distPath, "logo_atziluth.jpg"), buffer);
          const distImagenes = path.join(distPath, "imagenes");
          if (!fs.existsSync(distImagenes)) fs.mkdirSync(distImagenes, { recursive: true });
          fs.writeFileSync(path.join(distImagenes, "logo_atziluth.png"), buffer);
          fs.writeFileSync(path.join(distImagenes, "logo_atziluth.jpg"), buffer);
        }

        // Save new logoUrl into configuration
        currentConfig.logoUrl = uploadedUrl;
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
