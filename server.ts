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

// Ensure uploads filesystem directory exists for persistent local assets customizer
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded assets statically to both local clients and users from internet
app.use("/uploads", express.static(UPLOADS_DIR));

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
    webDesignMockup: "",
    restaurantAppMockup: "",
    municipalDirectoryBanner: "",
    customBusinesses: [],
    customAds: [],
    customLithoImages: {},
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

// Helper validation middleware to verify Admin session
function requireAdmin(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer atziluth_secure_token_secret") {
    return res.status(401).json({ success: false, error: "No autorizado. Sesión inválida." });
  }
  next();
}

// 6. API: Secure Save Custom Images Configuration
app.post("/api/admin/config", requireAdmin, (req, res) => {
  try {
    const { webDesignMockup, restaurantAppMockup, municipalDirectoryBanner, customBusinesses, customAds, categories, customLithoImages } = req.body;
    
    let finalLitho = customLithoImages || {};
    if (Array.isArray(finalLitho)) {
      finalLitho = {};
    }
    
    const newConfig = {
      webDesignMockup: webDesignMockup || "",
      restaurantAppMockup: restaurantAppMockup || "",
      municipalDirectoryBanner: municipalDirectoryBanner || "",
      customBusinesses: customBusinesses || [],
      customAds: customAds || [],
      customLithoImages: finalLitho,
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

// 7. API: Secure Local File Upload to uploads folder (converts incoming base64 to binary files)
app.post("/api/admin/upload-image", requireAdmin, (req, res) => {
  try {
    const { fileName, base64Data } = req.body;
    if (!fileName || !base64Data) {
      return res.status(400).json({ success: false, error: "Nombre de archivo e imagen base64 requeridos." });
    }

    // Clean up base64 prefix
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Buffer.from(base64Clean, "base64");

    // Build a unique, web-safe file name
    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueFileName = `${timestamp}_${safeName}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueFileName);

    // Write file to filesystem
    fs.writeFileSync(targetPath, binaryData);
    
    // Return relative URL for static loading
    res.json({ success: true, url: `/uploads/${uniqueFileName}` });
  } catch (err: any) {
    console.error("Error uploading local image file:", err);
    res.status(500).json({ success: false, error: "Error de servidor al procesar el archivo subido." });
  }
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
