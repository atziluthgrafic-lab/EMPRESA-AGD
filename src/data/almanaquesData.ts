import { safeDispatchEvent } from "../utils/safeEvents";

export interface Category {
  id: number;
  name: string;
  order: number;
}

export interface ProductReference {
  id: string;
  ref: string;
  categoryId: number;
  name: string;
  description: string;
  finish: string;
  paper: string;
  price: number;
  imageUrl: string;
  gallery?: string[];
  inStock?: boolean;
}

export interface AlmanaquesData {
  pdfUrl: string;
  categories: Category[];
  products: ProductReference[];
  updatedAt: string;
}

export const DEFAULT_ALMANAQUES_DATA: AlmanaquesData = {
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
      description: "Diseño tipo pirámide con argollado Doble O metálico súper resistente, base rígida empastada en cartón grueso de 1.5mm y 12 hojas independientes con cuadrícula amplia.",
      finish: "Plastificado Mate + Barniz UV Brillo Parcial en Portada",
      paper: "Hojas en Propalcote 250g / Base Cartón Prensado 1.5mm",
      price: 6500,
      imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
      inStock: true
    },
    {
      id: "alm-102",
      ref: "ALM-102",
      categoryId: 1,
      name: "Escritorio Ejecutivo Deluxe Foil",
      description: "Calendario compacto de mesa con acabado de lujo. Incluye espacio para logotipo personalizado estampado en pan de oro/plata (Foil metálico) y planificador mensual.",
      finish: "Estampado Foil Metalizado + Argollado Doble O Dorado",
      paper: "Propalcote 300g Extra Blanco de Alta Rigidez",
      price: 8200,
      imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
      inStock: true
    },
    {
      id: "alm-201",
      ref: "ALM-201",
      categoryId: 2,
      name: "Respaldo de Taco Tradicional Santoral",
      description: "Respaldo troquelado rígido con perforación superior reforzada para colgar en pared. Soporte ideal para bloques o tacos de santoral diario tradicional de 365 días.",
      finish: "Plastificado brillante impermeable protector contra humedad",
      paper: "Cartón Maule Importado 320g",
      price: 4200,
      imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
      inStock: true
    },
    {
      id: "alm-202",
      ref: "ALM-202",
      categoryId: 2,
      name: "Respaldo de Taco Gigante Comercial",
      description: "Respaldo publicitario formato 35x50 cm con amplio espacio para encabezado de marca, teléfonos, dirección y red de distribución municipal.",
      finish: "Laminado Térmico + Ojete de Ojalatado Metálico",
      paper: "Cartulina Cemento 350g Ultra Resistente",
      price: 5800,
      imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
      inStock: true
    },
    {
      id: "alm-301",
      ref: "ALM-301",
      categoryId: 3,
      name: "Anuario Clásico 1 Varilla HD",
      description: "Almanaque de pared en una sola lámina formato 33x48 cm con ojete y varilla metálica en la parte superior. Impresión litográfica de paisajes y tradiciones de Antioquia.",
      finish: "Varilla Metálica Antioxidante + Barniz UV Total",
      paper: "Propalcote 200g Brillante",
      price: 3500,
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      inStock: true
    },
    {
      id: "alm-401",
      ref: "ALM-401",
      categoryId: 4,
      name: "Almanaque Trimestral de Pared 3 Cuerpos",
      description: "Almanaque corporativo de 3 cuerpos independientes unidos con resorte metálico. Permite visualizar mes anterior, mes actual y mes siguiente simultáneamente.",
      finish: "Argollado Doble O Triple + Visor de Fecha Móvil Rojo",
      paper: "Propalcote 240g Gloss",
      price: 9800,
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      inStock: true
    },
    {
      id: "alm-501",
      ref: "ALM-501",
      categoryId: 5,
      name: "Calendario de Bolsillo Plastificado Doble Faz",
      description: "Tarjetas tipo bolsillo formato 9x5.5 cm con esquinas redondeadas. Calendario anual al respaldo y diseño publicitario a todo color al frente.",
      finish: "Plastificado Mate/Brillante + Despunte de Bordes (Redondeado)",
      paper: "Propalcote 350g Alta Densidad",
      price: 450,
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      inStock: true
    },
    {
      id: "alm-601",
      "ref": "ALM-601",
      categoryId: 6,
      name: "Imantado Publicitario para Nevera con Taco",
      description: "Imán flexible 100% magnético en todo el respaldo con impresión full color en la carátula y micro taco calado de 12 meses desprendibles.",
      finish: "Magneto Flexible Calibre 0.4mm + Plastificado Brillante",
      paper: "Propalcote 300g sobre Respaldo Magnético",
      price: 1200,
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
      inStock: true
    }
  ],
  updatedAt: new Date().toISOString()
};

export const STORAGE_KEY = "atziluth_almanaques_data";
export const IMAGE_VAULT_KEY = "atziluth_almanaques_images_vault";

export function getImageVault(): Record<string, string> {
  try {
    const raw = localStorage.getItem(IMAGE_VAULT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveImageToVault(idOrRef: string, imageUrl: string): void {
  if (!idOrRef || !imageUrl) return;
  try {
    const vault = getImageVault();
    vault[idOrRef] = imageUrl;
    localStorage.setItem(IMAGE_VAULT_KEY, JSON.stringify(vault));
    // Backup to server vault
    fetch("/api/almanaques/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [idOrRef]: imageUrl })
    }).catch(() => {});
  } catch (e) {
    console.warn("Error saving image to vault:", e);
  }
}

export function removeImageFromVault(idOrRef: string): void {
  if (!idOrRef) return;
  try {
    const vault = getImageVault();
    delete vault[idOrRef];
    localStorage.setItem(IMAGE_VAULT_KEY, JSON.stringify(vault));
    fetch("/api/almanaques/vault", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: idOrRef })
    }).catch(() => {});
  } catch (e) {
    console.warn("Error removing image from vault:", e);
  }
}

export function applyImageVault(data: AlmanaquesData): AlmanaquesData {
  const vault = getImageVault();
  if (!vault || Object.keys(vault).length === 0) return data;

  const updatedProducts = data.products.map(p => {
    const customImg = vault[p.ref] || vault[p.id];
    if (customImg && customImg.trim()) {
      return { ...p, imageUrl: customImg };
    }
    return p;
  });

  return { ...data, products: updatedProducts };
}

function sanitizeAlmanaquesData(data: AlmanaquesData): AlmanaquesData {
  const categories = data.categories && data.categories.length >= 6
    ? data.categories
    : DEFAULT_ALMANAQUES_DATA.categories;

  // STRICTLY preserve user's products array and order! Do not re-inject deleted products.
  const products = Array.isArray(data.products)
    ? data.products
    : [];

  return {
    pdfUrl: data.pdfUrl || DEFAULT_ALMANAQUES_DATA.pdfUrl,
    categories,
    products,
    updatedAt: data.updatedAt || new Date().toISOString()
  };
}

export function getAlmanaquesData(): AlmanaquesData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return applyImageVault(DEFAULT_ALMANAQUES_DATA);
    }
    const parsed = JSON.parse(raw);
    if (!parsed.categories || !Array.isArray(parsed.products)) {
      return applyImageVault(DEFAULT_ALMANAQUES_DATA);
    }
    if (parsed.products.length === 0) {
      return applyImageVault(DEFAULT_ALMANAQUES_DATA);
    }
    const sanitized = sanitizeAlmanaquesData(parsed);
    return applyImageVault(sanitized);
  } catch (e) {
    return applyImageVault(DEFAULT_ALMANAQUES_DATA);
  }
}

export async function fetchAlmanaquesDataServer(): Promise<AlmanaquesData> {
  const localData = getAlmanaquesData();
  const vault = getImageVault();

  try {
    const res = await fetch("/api/almanaques/data");
    const json = await res.json();
    if (json.success && json.data && Array.isArray(json.data.products)) {
      const serverData = json.data as AlmanaquesData;
      
      // If local storage has items but server has 0, protect local data and push to server
      if (localData.products && localData.products.length > 0 && serverData.products.length === 0) {
        saveAlmanaquesData(localData);
        return localData;
      }

      if (serverData.products.length > 0) {
        const mergedProducts = serverData.products.map(sp => {
          const vaultImg = vault[sp.ref] || vault[sp.id];
          if (vaultImg && vaultImg.trim()) {
            return { ...sp, imageUrl: vaultImg };
          }
          return sp;
        });

        const finalData = sanitizeAlmanaquesData({
          ...serverData,
          products: mergedProducts
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
        safeDispatchEvent("almanaques-updated", finalData);
        return finalData;
      }
    }
  } catch (e) {
    console.warn("Error obteniendo datos de almanaques del servidor:", e);
  }
  return localData;
}

export function saveAlmanaquesData(data: AlmanaquesData): void {
  try {
    data.updatedAt = new Date().toISOString();
    
    // Automatically register all product images into the persistent image vault
    if (Array.isArray(data.products)) {
      data.products.forEach(p => {
        if (p.imageUrl && p.imageUrl.trim()) {
          saveImageToVault(p.ref, p.imageUrl);
          if (p.id) saveImageToVault(p.id, p.imageUrl);
        }
      });
    }

    const sanitized = sanitizeAlmanaquesData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    safeDispatchEvent("almanaques-updated", sanitized);
    
    // Async push to server
    fetch("/api/almanaques/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized)
    }).catch(console.error);
  } catch (e) {
    console.error("Error guardando datos de Almanaques:", e);
  }
}

export function getAlmanaqueFallbackSvg(p: Partial<ProductReference>): string {
  const ref = p.ref || "ALM";
  const name = (p.name || "Almanaque Atziluth").replace(/[<>&"]/g, " ");
  const finish = (p.finish || "Litografía Premium").replace(/[<>&"]/g, " ");
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
    <defs>
      <linearGradient id="bg-${ref}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#161f36" />
        <stop offset="100%" stop-color="#0b1120" />
      </linearGradient>
      <linearGradient id="acc-${ref}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="50%" stop-color="#ec4899" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
      <filter id="shadow-${ref}" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="800" height="1000" fill="url(#bg-${ref})" />
    <g opacity="0.08" stroke="#ffffff" stroke-width="1.5">
      <line x1="0" y1="200" x2="800" y2="200" />
      <line x1="0" y1="400" x2="800" y2="400" />
      <line x1="0" y1="600" x2="800" y2="600" />
      <line x1="0" y1="800" x2="800" y2="800" />
      <line x1="200" y1="0" x2="200" y2="1000" />
      <line x1="400" y1="0" x2="400" y2="1000" />
      <line x1="600" y1="0" x2="600" y2="1000" />
    </g>
    
    <rect x="230" y="55" width="340" height="42" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="400" y="82" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="3">ATZILUTH GRÁFIC</text>
    
    <g transform="translate(130, 130)" filter="url(#shadow-${ref})">
      <rect x="0" y="50" width="540" height="600" rx="24" fill="#ffffff" />
      <path d="M0,74 Q0,50 24,50 L516,50 Q540,50 540,74 L540,170 L0,170 Z" fill="url(#acc-${ref})" />
      <text x="270" y="115" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="2">ALMANAQUE 2026 - 2027</text>
      <text x="270" y="145" fill="#ffffff" opacity="0.9" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="1">LITOGRAFÍA &amp; PUBLICIDAD CORPORATIVA</text>
      
      <g fill="#475569" stroke="#94a3b8" stroke-width="3">
        <rect x="40" y="35" width="20" height="30" rx="10" />
        <rect x="110" y="35" width="20" height="30" rx="10" />
        <rect x="180" y="35" width="20" height="30" rx="10" />
        <rect x="250" y="35" width="20" height="30" rx="10" />
        <rect x="320" y="35" width="20" height="30" rx="10" />
        <rect x="390" y="35" width="20" height="30" rx="10" />
        <rect x="460" y="35" width="20" height="30" rx="10" />
      </g>
      
      <g transform="translate(50, 210)" font-family="system-ui, -apple-system, sans-serif">
        <rect x="0" y="0" width="440" height="36" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="220" y="24" fill="#0f172a" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">CALENDARIO MENSUAL</text>
        
        <g transform="translate(0, 65)" font-size="13" font-weight="800" text-anchor="middle">
          <text x="30" y="0" fill="#f97316">DOM</text>
          <text x="95" y="0" fill="#64748b">LUN</text>
          <text x="160" y="0" fill="#64748b">MAR</text>
          <text x="225" y="0" fill="#64748b">MIÉ</text>
          <text x="290" y="0" fill="#64748b">JUE</text>
          <text x="355" y="0" fill="#64748b">VIE</text>
          <text x="415" y="0" fill="#f97316">SÁB</text>
          <line x1="0" y1="12" x2="440" y2="12" stroke="#e2e8f0" stroke-width="1.5" />
        </g>
        
        <g transform="translate(0, 105)" font-size="14" font-weight="700" fill="#334155" text-anchor="middle">
          <text x="30" y="15" fill="#ef4444">1</text><text x="95" y="15">2</text><text x="160" y="15">3</text><text x="225" y="15">4</text><text x="290" y="15">5</text><text x="355" y="15">6</text><text x="415" y="15">7</text>
          <text x="30" y="55" fill="#ef4444">8</text><text x="95" y="55">9</text><text x="160" y="55">10</text><text x="225" y="55">11</text><text x="290" y="55">12</text><text x="355" y="55">13</text><text x="415" y="55">14</text>
          <text x="30" y="95" fill="#ef4444">15</text><text x="95" y="95">16</text><text x="160" y="95">17</text><text x="225" y="95">18</text><text x="290" y="95">19</text><text x="355" y="95">20</text><text x="415" y="95">21</text>
          <text x="30" y="135" fill="#ef4444">22</text><text x="95" y="135">23</text><text x="160" y="135">24</text><text x="225" y="135" fill="#f97316" font-weight="900">25</text><text x="290" y="135">26</text><text x="355" y="135">27</text><text x="415" y="135">28</text>
          <text x="30" y="175" fill="#ef4444">29</text><text x="95" y="175">30</text><text x="160" y="175">31</text>
        </g>
        
        <rect x="0" y="325" width="440" height="85" rx="12" fill="#fff7ed" stroke="#fed7aa" />
        <text x="220" y="358" fill="#ea580c" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="1">ESPACIO PUBLICITARIO PERSONALIZADO</text>
        <text x="220" y="385" fill="#78716c" font-size="12" font-weight="600" text-anchor="middle">Logotipo • Teléfonos • Dirección • Redes Sociales</text>
      </g>
    </g>
    
    <rect x="80" y="810" width="640" height="135" rx="20" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
    <rect x="105" y="835" width="120" height="34" rx="8" fill="#f97316" />
    <text x="165" y="857" fill="#ffffff" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">REF: ${ref}</text>
    <text x="245" y="858" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="800">${name.substring(0, 32)}</text>
    <text x="105" y="905" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500">${finish.substring(0, 52)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
