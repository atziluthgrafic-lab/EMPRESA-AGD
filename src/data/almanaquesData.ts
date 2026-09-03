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
