import { ProveedorRecord, OrdenProduccion, PagoProveedor, CotizacionProveedor, DEFAULT_PROVEEDORES_CATEGORIAS } from '../types/proveedor';
import { safeDispatchEvent } from '../utils/safeEvents';

export const INITIAL_PROVEEDORES: ProveedorRecord[] = [
  {
    id: "prv_1",
    codigo: "PRV-ALM-001",
    claveAcceso: "prv-alm-001",
    nombreComercial: "Talleres Gráficos & Troquelados del Valle",
    contactoNombre: "Carlos Mario Jaramillo",
    telefonoWhatsapp: "+57 312 456 7890",
    email: "produccion@troqueladosvalle.com",
    categoria: "Almanaques",
    categorias: ["Almanaques", "Litografía Comercial", "Empaques & Cajas"],
    tokenAcceso: "prv-alm-001",
    slugAcceso: "prv-alm-001",
    activo: true,
    direccionTaller: "Calle 44 # 52-18, Sector Alpujarra, Medellín",
    municipio: "Medellín",
    datosBancarios: {
      banco: "Bancolombia",
      tipoCuenta: "Ahorros",
      numeroCuenta: "458-921844-12",
      titular: "Talleres Gráficos del Valle S.A.S.",
      documentoTitular: "NIT 901.458.772-1",
      telefonoTransferencia: "+57 312 456 7890"
    },
    notasInternas: "Especialista en troquelado de respaldo cartón duplex 300g, ojilletes y tacos mensuales.",
    createdAt: "2026-08-01"
  },
  {
    id: "prv_2",
    codigo: "PRV-TAL-002",
    claveAcceso: "prv-tal-002",
    nombreComercial: "Litografía & Formas Continuas Antioquia",
    contactoNombre: "Marta Lucía Restrepo",
    telefonoWhatsapp: "+57 300 789 1234",
    email: "pedidos@formascontinuasantioquia.com",
    categoria: "Talonarios",
    categorias: ["Talonarios", "Tarjetas", "Adhesivos"],
    tokenAcceso: "prv-tal-002",
    slugAcceso: "prv-tal-002",
    activo: true,
    direccionTaller: "Carrera 50 # 38-20, Guayabal, Medellín",
    municipio: "Medellín",
    datosBancarios: {
      banco: "Nequi / Daviplata",
      tipoCuenta: "Billetera Digital",
      numeroCuenta: "3007891234",
      titular: "Marta Lucía Restrepo",
      documentoTitular: "CC 43.892.110",
      telefonoTransferencia: "+57 300 789 1234"
    },
    notasInternas: "Papel químico autocopiante 2 y 3 copias, numeración consecutiva roja y perforado.",
    createdAt: "2026-08-05"
  },
  {
    id: "prv_3",
    codigo: "PRV-BOR-003",
    claveAcceso: "prv-bor-003",
    nombreComercial: "Bordados & Estampados Textiles del Sur",
    contactoNombre: "Jorge Iván Bedoya",
    telefonoWhatsapp: "+57 315 654 3210",
    email: "talleres@textilesdelsur.com",
    categoria: "Bordados",
    categorias: ["Bordados", "Estampados", "Gorras", "Souvenirs"],
    tokenAcceso: "prv-bor-003",
    slugAcceso: "prv-bor-003",
    activo: true,
    direccionTaller: "Calle 6 Sur # 43A-50, Itagüí, Antioquia",
    municipio: "Itagüí",
    datosBancarios: {
      banco: "Bancolombia",
      tipoCuenta: "Ahorros",
      numeroCuenta: "031-884920-55",
      titular: "Jorge Iván Bedoya",
      documentoTitular: "CC 71.345.980",
      telefonoTransferencia: "+57 315 654 3210"
    },
    notasInternas: "Bordado computarizado alta densidad y gorras 6 paneles estructuradas.",
    createdAt: "2026-08-10"
  },
  {
    id: "prv_ser_102",
    codigo: "PRV-SER-102",
    claveAcceso: "prv-ser-102",
    nombreComercial: "Servicios Gráficos, Litografía & Acabados Medellín",
    contactoNombre: "Mauricio Gómez / Producción",
    telefonoWhatsapp: "+57 310 987 6543",
    email: "taller.servicios102@atziluth.com",
    categoria: "Servicios",
    categorias: ["Servicios", "Litografía Comercial", "Empaques & Cajas", "Tarjetas", "Almanaques"],
    tokenAcceso: "prv-ser-102",
    slugAcceso: "prv-ser-102",
    activo: true,
    direccionTaller: "Calle 33 # 65-40, Barrio San Joaquín / Conquistadores, Medellín",
    municipio: "Medellín",
    datosBancarios: {
      banco: "Bancolombia",
      tipoCuenta: "Ahorros",
      numeroCuenta: "551-002934-88",
      titular: "Servicios Gráficos & Acabados S.A.S.",
      documentoTitular: "NIT 900.871.442-3",
      telefonoTransferencia: "+57 310 987 6543"
    },
    notasInternas: "Taller integral de litografía, plastificado térmico mate/brillo, reserva UV y troquelados especiales.",
    createdAt: "2026-08-12"
  },
  {
    id: "prv_alm_102",
    codigo: "PRV-ALM-102",
    claveAcceso: "prv-alm-102",
    nombreComercial: "Almanaques & Calendarios de Colombia 2026",
    contactoNombre: "Estivenson / Producción Almanaques",
    telefonoWhatsapp: "+57 300 123 4567",
    email: "almanaques102@atziluth.com",
    categoria: "Almanaques",
    categorias: ["Almanaques", "Litografía Comercial", "Empaques & Cajas"],
    tokenAcceso: "prv-alm-102",
    slugAcceso: "prv-alm-102",
    activo: true,
    direccionTaller: "Carrera 45 # 50-20, Centro / San Antonio, Medellín",
    municipio: "Medellín",
    datosBancarios: {
      banco: "Bancolombia",
      tipoCuenta: "Ahorros",
      numeroCuenta: "770-001928-34",
      titular: "Almanaques & Calendarios de Colombia S.A.S.",
      documentoTitular: "NIT 901.884.221-9",
      telefonoTransferencia: "+57 300 123 4567"
    },
    notasInternas: "Taller especializado en almanaques de pared, escritorio, tacos mensuales y repujados.",
    createdAt: "2026-08-14"
  }
];

export const INITIAL_ORDENES: OrdenProduccion[] = [];

export const INITIAL_COTIZACIONES: CotizacionProveedor[] = [
  {
    id: "cot_tal_01",
    proveedorId: "prv_2",
    proveedorCodigo: "PRV-TAL-002",
    proveedorNombre: "Litografía & Formas Continuas Antioquia",
    proveedorTelefono: "+57 300 789 1234",
    proveedorMunicipio: "Medellín",
    tituloProducto: "100 Talonarios Media Carta (14x21.5cm) — Químico Autocopiante 2 Copias",
    categoria: "Talonarios",
    cantidad: 100,
    unidadMedida: "Talonarios",
    medidasFormato: "Media carta (14 x 21.5 cm)",
    materialPapel: "Papel químico autocopiante 70g (Original blanco + 1 Copia rosada o amarilla). 50 juegos por talonario (100 hojas en total).",
    tintasColores: "1x0 Tinta negra estándar o azul reflex",
    terminaciones: "Numeración consecutiva en tinta roja tipográfica, perforado con prepicado para desprendimiento fácil, engrapado con 2 grapas de alambre y tapa en cartón Kraft 240g envolvente.",
    tiempoEntregaDias: "2 a 3 días hábiles",
    descripcionDetallada: "Cotización de producción litográfica para 100 talonarios tamaño media carta. Cada talonario contiene 50 juegos (Original en papel químico blanco de 70 gramos y 1 copia en papel químico autocopiante color a elección). Incluye diseño tipográfico base, numerado consecutivo en tinta roja de 6 dígitos sin costo extra, perforado longitudinal de máxima precisión, cosido o engrapado al lomo con refuerzo de cinta lito de encuadernación y cartón de respaldo con solapa protectora separadora. Garantizamos nitidez en la copia de transferencia y entrega perfectamente empacada en paquetes termoencogidos de 10 unidades para proteger de la humedad.",
    precioCostoTotal: 480000,
    precioCostoUnitario: 4800,
    fechaCreacion: "2026-08-15T10:00:00",
    activo: true,
    destacadaAdmin: true,
    notasAdmin: "Excelente precio y acabado de numerado limpio. Opción prioritaria para pedidos medianos."
  },
  {
    id: "cot_tal_02",
    proveedorId: "prv_1",
    proveedorCodigo: "PRV-ALM-001",
    proveedorNombre: "Talleres Gráficos & Troquelados del Valle",
    proveedorTelefono: "+57 312 456 7890",
    proveedorMunicipio: "Medellín",
    tituloProducto: "100 Talonarios Cuarto de Carta (10.7x14cm) — Químico Autocopiante 2 Copias",
    categoria: "Talonarios",
    cantidad: 100,
    unidadMedida: "Talonarios",
    medidasFormato: "Cuarto de carta (10.7 x 14 cm)",
    materialPapel: "Papel químico 70g (Original blanco + 1 copia color). 50 juegos / 100 hojas por talonario.",
    tintasColores: "1x0 Tinta negra",
    terminaciones: "Numerado rojo consecutivo, prepicado de alta precisión, lomo engrapado con cinta protectora.",
    tiempoEntregaDias: "3 días hábiles",
    descripcionDetallada: "Oferta directa de taller para 100 talonarios cuarto de carta. Ideal para recibos de caja menor, comandas de restaurantes o comprobantes rápidos de entrega. Cada talonario incluye 50 juegos con papel químico de alta transferencia (blanco/amarillo). Terminación encuadernada con grapa industrial y refuerzo, portada en cartulina manila y cartón intermedio rígido de escritura.",
    precioCostoTotal: 340000,
    precioCostoUnitario: 3400,
    fechaCreacion: "2026-08-16T11:30:00",
    activo: true,
    destacadaAdmin: true,
    notasAdmin: "Tarifa muy competitiva para cuarto de carta."
  },
  {
    id: "cot_alm_01",
    proveedorId: "prv_1",
    proveedorCodigo: "PRV-ALM-001",
    proveedorNombre: "Talleres Gráficos & Troquelados del Valle",
    proveedorTelefono: "+57 312 456 7890",
    proveedorMunicipio: "Medellín",
    tituloProducto: "500 Almanaques Modelo Gigante (33x50cm) con Ojillete y Taco Mensual",
    categoria: "Almanaques",
    cantidad: 500,
    unidadMedida: "Unidades",
    medidasFormato: "Respaldo 33 x 50 cm — Taco 33 x 15 cm",
    materialPapel: "Cartón Duplex 320g plastificado brillante + Taco en papel Bond 75g de 12 hojas",
    tintasColores: "Policromía 4x0 tintas en respaldo con barniz UV brillante",
    terminaciones: "Ojillete metálico superior reforzado, taco mensual con festivos colombianos engrapado.",
    tiempoEntregaDias: "4 a 5 días hábiles",
    descripcionDetallada: "Cotización de temporada para 500 almanaques de pared tamaño gigante. Respaldo impreso en cartón duplex de 320 gramos con recubrimiento brillante UV total para máxima durabilidad y realce fotográfico. Taco de 12 meses impreso en papel bond de 75 gramos con calendario tributario, lunas y festivos nacionales oficiales. Ensamblado con doble grapa industrial y perforación con ojillete niquelado anti-óxido. Empacado plano en paquetes de 25 unidades con cantoneras.",
    precioCostoTotal: 680000,
    precioCostoUnitario: 1360,
    fechaCreacion: "2026-08-14T09:00:00",
    activo: true,
    destacadaAdmin: true,
    notasAdmin: "Calidad de ojillete y laca UV insuperable."
  },
  {
    id: "cot_tar_01",
    proveedorId: "prv_2",
    proveedorCodigo: "PRV-TAL-002",
    proveedorNombre: "Litografía & Formas Continuas Antioquia",
    proveedorTelefono: "+57 300 789 1234",
    proveedorMunicipio: "Medellín",
    tituloProducto: "1000 Tarjetas de Presentación — Propalcote 300g Mate + Brillo UV Parcial 2 Caras",
    categoria: "Tarjetas",
    cantidad: 1000,
    unidadMedida: "Unidades",
    medidasFormato: "9 x 5.5 cm",
    materialPapel: "Propalcote importado de 300 gramos calibre alto",
    tintasColores: "Policromía 4x4 (Full color ambas caras)",
    terminaciones: "Laminado mate aterciopelado en ambas caras + reserva de brillo parcial UV en logos.",
    tiempoEntregaDias: "3 días hábiles",
    descripcionDetallada: "Tarjetas premium de presentación corporativa por millar. Impresión offset de alta resolución a 2400 DPI en propalcote de 300 gramos. Proceso de termolaminado mate que brinda textura suave al tacto y resistencia al agua, con aplicación selectiva de barniz UV serigráfico curado en logos y datos clave para generar contraste visual de lujo. Corte recto electrónico de esquinas perfectas.",
    precioCostoTotal: 75000,
    precioCostoUnitario: 75,
    fechaCreacion: "2026-08-17T08:30:00",
    activo: true,
    destacadaAdmin: false
  }
];

export const INITIAL_PAGOS: PagoProveedor[] = [];

const STORAGE_KEYS = {
  PROVEEDORES: "atziluth_proveedores_records",
  ORDENES: "atziluth_ordenes_produccion",
  PAGOS: "atziluth_pagos_proveedores",
  CATEGORIAS: "atziluth_prov_categorias",
  COTIZACIONES: "atziluth_cotizaciones_proveedores"
};

export function getStoredCategorias(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIAS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(DEFAULT_PROVEEDORES_CATEGORIAS));
      return DEFAULT_PROVEEDORES_CATEGORIAS;
    }
    const parsed: string[] = JSON.parse(raw);
    // Merge defaults ensuring no duplicates
    const set = new Set([...DEFAULT_PROVEEDORES_CATEGORIAS, ...parsed]);
    return Array.from(set);
  } catch (e) {
    console.error("Error loading categorias from localStorage:", e);
    return DEFAULT_PROVEEDORES_CATEGORIAS;
  }
}

export function saveStoredCategorias(list: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving categorias to localStorage:", e);
  }
}

export function getStoredProveedores(): ProveedorRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROVEEDORES);
    const map = new Map<string, ProveedorRecord>();

    // Seed defaults first so default providers (like prv_ser_102, prv_alm_102) always exist
    INITIAL_PROVEEDORES.forEach((p) => {
      const cats = Array.isArray(p.categorias) && p.categorias.length > 0
        ? p.categorias
        : (p.categoria ? [p.categoria] : ['Servicios']);
      const key = p.claveAcceso || p.slugAcceso || p.tokenAcceso || p.codigo.toLowerCase();
      map.set(p.id, {
        ...p,
        claveAcceso: key,
        tokenAcceso: key,
        slugAcceso: key,
        categorias: cats,
        categoria: cats[0] || 'Servicios'
      });
    });

    if (raw) {
      const list: ProveedorRecord[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((p) => {
          const existing = map.get(p.id);
          const cats = Array.isArray(p.categorias) && p.categorias.length > 0
            ? p.categorias
            : (p.categoria ? [p.categoria] : existing?.categorias || ['Servicios']);
          const key = p.claveAcceso || p.slugAcceso || p.tokenAcceso || p.codigo?.toLowerCase() || existing?.claveAcceso || 'taller';
          map.set(p.id, {
            ...(existing || {}),
            ...p,
            claveAcceso: key,
            tokenAcceso: p.tokenAcceso || key,
            slugAcceso: p.slugAcceso || key,
            categorias: cats,
            categoria: cats[0] || 'Servicios'
          });
        });
      }
    }

    const merged = Array.from(map.values());
    localStorage.setItem(STORAGE_KEYS.PROVEEDORES, JSON.stringify(merged));
    return merged;
  } catch (e) {
    console.error("Error loading proveedores from localStorage:", e);
    return INITIAL_PROVEEDORES;
  }
}

export function saveStoredProveedores(list: ProveedorRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROVEEDORES, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving proveedores to localStorage:", e);
  }
}

export function getStoredOrdenes(): OrdenProduccion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDENES);
    if (!raw) {
      return [];
    }
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) {
      return [];
    }
    return list;
  } catch (e) {
    console.error("Error loading ordenes from localStorage:", e);
    return [];
  }
}

export function saveStoredOrdenes(list: OrdenProduccion[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(list));
    // Emit storage event for same-window listeners
    safeDispatchEvent("storage");
    safeDispatchEvent("atziluth_prov_data_change");
  } catch (e) {
    console.error("Error saving ordenes to localStorage:", e);
  }
}

export function getStoredPagos(): PagoProveedor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAGOS);
    if (!raw) {
      return [];
    }
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) {
      return [];
    }
    return list;
  } catch (e) {
    console.error("Error loading pagos from localStorage:", e);
    return [];
  }
}

export function saveStoredPagos(list: PagoProveedor[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(list));
    safeDispatchEvent("storage");
    safeDispatchEvent("atziluth_prov_data_change");
  } catch (e) {
    console.error("Error saving pagos to localStorage:", e);
  }
}

export function getStoredCotizaciones(): CotizacionProveedor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COTIZACIONES);
    if (!raw) {
      return [];
    }
    const list: CotizacionProveedor[] = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error("Error loading cotizaciones from localStorage:", e);
    return [];
  }
}

export function saveStoredCotizaciones(list: CotizacionProveedor[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COTIZACIONES, JSON.stringify(list));
    safeDispatchEvent("storage");
    safeDispatchEvent("atziluth_prov_data_change");
  } catch (e) {
    console.error("Error saving cotizaciones to localStorage:", e);
  }
}

/**
 * Normaliza y busca de forma ultra flexible cualquier taller / proveedor
 * por Token, Slug, Código oficial, ID, Teléfono, WhatsApp o Nombre Comercial.
 */
export function findProviderByAnyQuery(
  providers: ProveedorRecord[],
  rawQuery: string
): ProveedorRecord | undefined {
  if (!rawQuery || typeof rawQuery !== "string") return undefined;

  let query = rawQuery.trim();

  // Si pegaron una URL completa (ej: http://.../?token=prv-ser-102#proveedor), extraer el valor
  if (query.includes("?") || query.includes("#") || query.includes("http")) {
    let extracted = false;
    try {
      if (typeof URL === "function") {
        const parsedUrl = new URL(query.startsWith("http") ? query : `https://temp.local/${query}`);
        const tokenFromQuery = parsedUrl.searchParams?.get("token") || parsedUrl.searchParams?.get("proveedor") || parsedUrl.searchParams?.get("prv");
        if (tokenFromQuery) {
          query = tokenFromQuery;
          extracted = true;
        } else if (parsedUrl.hash) {
          const hashClean = parsedUrl.hash.replace("#", "");
          if (hashClean.includes("token=")) {
            const match = hashClean.match(/token=([^&]+)/);
            if (match && match[1]) {
              query = match[1];
              extracted = true;
            }
          }
        }
      }
    } catch (_) {}

    if (!extracted) {
      // Fallback regex extraction
      const match = query.match(/[?&#](token|proveedor|prv|id)=([^&#]+)/i);
      if (match && match[2]) {
        try {
          query = decodeURIComponent(match[2]);
        } catch (_) {
          query = match[2];
        }
      }
    }
  }

  const cleanLower = query.toLowerCase().trim();
  if (!cleanLower) return undefined;

  // Versión sin guiones, puntos, espacios ni subrayados (para matching tolerante)
  const strippedQuery = cleanLower.replace(/[^a-z0-9]/g, "");

  // 1. Coincidencia exacta (case-insensitive) con Clave de Acceso, Token, Slug, Código o ID
  const directMatch = providers.find((p) => {
    const clave = (p.claveAcceso || "").toLowerCase().trim();
    const token = (p.tokenAcceso || "").toLowerCase().trim();
    const slug = (p.slugAcceso || "").toLowerCase().trim();
    const code = (p.codigo || "").toLowerCase().trim();
    const id = (p.id || "").toLowerCase().trim();
    return (
      clave === cleanLower ||
      token === cleanLower ||
      slug === cleanLower ||
      code === cleanLower ||
      id === cleanLower
    );
  });
  if (directMatch) return directMatch;

  // 2. Coincidencia con historial de claves anteriores
  const historyMatch = providers.find((p) => {
    if (!Array.isArray(p.historialCodigosAcceso)) return false;
    return p.historialCodigosAcceso.some((h) => {
      const prev = (h.codigoAnterior || "").toLowerCase().trim();
      const next = (h.codigoNuevo || "").toLowerCase().trim();
      return prev === cleanLower || next === cleanLower;
    });
  });
  if (historyMatch) return historyMatch;

  // 3. Coincidencia normalizada sin caracteres especiales
  // ej: 'prv-alm-102', 'prv_alm_102', 'PRV ALM 102' -> 'prvalm102'
  if (strippedQuery.length >= 3) {
    const strippedMatch = providers.find((p) => {
      const sClave = (p.claveAcceso || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const sToken = (p.tokenAcceso || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const sSlug = (p.slugAcceso || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const sCode = (p.codigo || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const sId = (p.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        sClave === strippedQuery ||
        sToken === strippedQuery ||
        sSlug === strippedQuery ||
        sCode === strippedQuery ||
        sId === strippedQuery ||
        (sClave.length > 3 && (sClave.includes(strippedQuery) || strippedQuery.includes(sClave))) ||
        (sToken.length > 5 && sToken.includes(strippedQuery)) ||
        (sCode.length > 3 && (sCode.includes(strippedQuery) || strippedQuery.includes(sCode)))
      );
    });
    if (strippedMatch) return strippedMatch;
  }

  // 4. Coincidencia por Número de WhatsApp / Teléfono (sólo dígitos)
  const queryDigits = cleanLower.replace(/\D/g, "");
  if (queryDigits.length >= 7) {
    const phoneMatch = providers.find((p) => {
      const pPhone = (p.telefonoWhatsapp || "").replace(/\D/g, "");
      const bPhone = (p.datosBancarios?.telefonoTransferencia || "").replace(/\D/g, "");
      return (
        (pPhone && (pPhone.includes(queryDigits) || queryDigits.includes(pPhone))) ||
        (bPhone && (bPhone.includes(queryDigits) || queryDigits.includes(bPhone)))
      );
    });
    if (phoneMatch) return phoneMatch;
  }

  // 5. Coincidencia por Email
  if (cleanLower.includes("@")) {
    const emailMatch = providers.find((p) => {
      const pEmail = (p.email || "").toLowerCase().trim();
      const bEmail = (p.datosBancarios?.emailNotificaciones || "").toLowerCase().trim();
      return pEmail === cleanLower || bEmail === cleanLower;
    });
    if (emailMatch) return emailMatch;
  }

  // 6. Coincidencia parcial por Nombre Comercial (mínimo 4 caracteres)
  if (cleanLower.length >= 4) {
    const nameMatch = providers.find((p) => {
      const name = (p.nombreComercial || "").toLowerCase();
      const contact = (p.contactoNombre || "").toLowerCase();
      return name.includes(cleanLower) || contact.includes(cleanLower);
    });
    if (nameMatch) return nameMatch;
  }

  return undefined;
}

/**
 * Sincroniza en tiempo real los proveedores guardados localmente con el backend API
 */
export async function fetchAndSyncProveedores(): Promise<ProveedorRecord[]> {
  try {
    const localList = getStoredProveedores();
    const map = new Map<string, ProveedorRecord>();

    // Incorporar primero los predeterminados/locales
    localList.forEach((p) => map.set(p.id, p));

    const res = await fetch('/api/proveedores');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.proveedores) && json.proveedores.length > 0) {
        // Actualizar/agregar desde el servidor
        json.proveedores.forEach((serverP: ProveedorRecord) => {
          const existing = map.get(serverP.id);
          const key = serverP.claveAcceso || serverP.slugAcceso || serverP.tokenAcceso || serverP.codigo?.toLowerCase() || existing?.claveAcceso || existing?.tokenAcceso || serverP.codigo.toLowerCase();
          map.set(serverP.id, {
            ...existing,
            ...serverP,
            claveAcceso: key,
            tokenAcceso: serverP.tokenAcceso || key,
            slugAcceso: serverP.slugAcceso || key
          });
        });

        const merged = Array.from(map.values());
        saveStoredProveedores(merged);
        return merged;
      }
    }
  } catch (e) {
    console.warn("fetchAndSyncProveedores offline fallback:", e);
  }
  return getStoredProveedores();
}

/**
 * Valida de forma ultra flexible e infalible si una orden de trabajo le pertenece a un taller/proveedor
 */
export function isOrderBelongingToProvider(
  order: OrdenProduccion,
  provider: ProveedorRecord
): boolean {
  if (!order || !provider) return false;
  const pId = (provider.id || "").trim().toLowerCase();
  const pCode = (provider.codigo || "").trim().toLowerCase();
  const pClave = (provider.claveAcceso || "").trim().toLowerCase();
  const pToken = (provider.tokenAcceso || "").trim().toLowerCase();
  const pSlug = (provider.slugAcceso || "").trim().toLowerCase();
  const pName = (provider.nombreComercial || "").trim().toLowerCase();

  const oProvId = (order.proveedorId || "").trim().toLowerCase();
  const oProvCode = ((order as any).proveedorCodigo || "").trim().toLowerCase();
  const oProvName = ((order as any).proveedorNombre || "").trim().toLowerCase();

  if (
    oProvId === pId ||
    oProvId === pCode ||
    oProvId === pClave ||
    oProvId === pToken ||
    oProvId === pSlug ||
    (oProvCode && (oProvCode === pCode || oProvCode === pId || oProvCode === pClave)) ||
    (oProvName && pName && (oProvName === pName || (pName.length > 5 && oProvName.includes(pName))))
  ) {
    return true;
  }

  // Matching tolerante sin guiones ni caracteres especiales (ej: prv_ser_102 == prv-ser-102 == PRV-SER-102)
  const cleanO = oProvId.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPId = pId.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPCode = pCode.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPClave = pClave.replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (
    cleanO.length >= 3 &&
    (cleanO === cleanPId || cleanO === cleanPCode || cleanO === cleanPClave)
  ) {
    return true;
  }

  if (oProvCode) {
    const cleanOCode = oProvCode.replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (
      cleanOCode.length >= 3 &&
      (cleanOCode === cleanPId || cleanOCode === cleanPCode || cleanOCode === cleanPClave)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Valida de forma infalible si un comprobante/pago le pertenece a un taller/proveedor
 */
export function isPaymentBelongingToProvider(
  payment: PagoProveedor,
  provider: ProveedorRecord
): boolean {
  if (!payment || !provider) return false;
  const pId = (provider.id || "").trim().toLowerCase();
  const pCode = (provider.codigo || "").trim().toLowerCase();
  const pClave = (provider.claveAcceso || "").trim().toLowerCase();
  const pToken = (provider.tokenAcceso || "").trim().toLowerCase();
  const pSlug = (provider.slugAcceso || "").trim().toLowerCase();

  const oProvId = (payment.proveedorId || "").trim().toLowerCase();
  if (
    oProvId === pId ||
    oProvId === pCode ||
    oProvId === pClave ||
    oProvId === pToken ||
    oProvId === pSlug
  ) {
    return true;
  }

  const cleanO = oProvId.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPId = pId.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPCode = pCode.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPClave = pClave.replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (
    cleanO.length >= 3 &&
    (cleanO === cleanPId || cleanO === cleanPCode || cleanO === cleanPClave)
  ) {
    return true;
  }

  return false;
}

/**
 * Sincroniza las órdenes de producción desde el backend central con localStorage
 */
export async function fetchAndSyncOrdenes(): Promise<OrdenProduccion[]> {
  try {
    const res = await fetch("/api/proveedores/ordenes");
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.ordenes)) {
        saveStoredOrdenes(json.ordenes);
        return json.ordenes;
      }
    }
  } catch (e) {
    console.warn("fetchAndSyncOrdenes offline fallback:", e);
  }
  return getStoredOrdenes();
}

/**
 * Sincroniza los pagos y comprobantes desde el backend central con localStorage
 */
export async function fetchAndSyncPagos(): Promise<PagoProveedor[]> {
  try {
    const res = await fetch("/api/proveedores/pagos");
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.pagos)) {
        saveStoredPagos(json.pagos);
        return json.pagos;
      }
    }
  } catch (e) {
    console.warn("fetchAndSyncPagos offline fallback:", e);
  }
  return getStoredPagos();
}

/**
 * Valida de forma infalible si una cotización o tarifa le pertenece a un taller/proveedor
 */
export function isQuotationBelongingToProvider(
  quotation: CotizacionProveedor,
  provider: ProveedorRecord
): boolean {
  if (!quotation || !provider) return false;
  const pId = (provider.id || "").trim().toLowerCase();
  const pCode = (provider.codigo || "").trim().toLowerCase();
  const pClave = (provider.claveAcceso || "").trim().toLowerCase();
  const pToken = (provider.tokenAcceso || "").trim().toLowerCase();
  const pSlug = (provider.slugAcceso || "").trim().toLowerCase();

  const qProvId = (quotation.proveedorId || "").trim().toLowerCase();
  const qProvCode = (quotation.proveedorCodigo || "").trim().toLowerCase();

  if (
    qProvId === pId ||
    qProvId === pCode ||
    qProvId === pClave ||
    qProvId === pToken ||
    qProvId === pSlug ||
    qProvCode === pCode ||
    qProvCode === pId ||
    qProvCode === pClave
  ) {
    return true;
  }

  const cleanQ = qProvId.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanQCode = qProvCode.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPId = pId.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPCode = pCode.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const cleanPClave = pClave.replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (
    cleanQ.length >= 3 &&
    (cleanQ === cleanPId || cleanQ === cleanPCode || cleanQ === cleanPClave)
  ) {
    return true;
  }

  if (
    cleanQCode.length >= 3 &&
    (cleanQCode === cleanPId || cleanQCode === cleanPCode || cleanQCode === cleanPClave)
  ) {
    return true;
  }

  return false;
}

/**
 * Sincroniza las cotizaciones de los talleres desde el backend central con localStorage
 */
export async function fetchAndSyncCotizaciones(): Promise<CotizacionProveedor[]> {
  try {
    const res = await fetch("/api/proveedores/cotizaciones");
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.cotizaciones)) {
        saveStoredCotizaciones(json.cotizaciones);
        return json.cotizaciones;
      }
    }
  } catch (e) {
    console.warn("fetchAndSyncCotizaciones offline fallback:", e);
  }
  return getStoredCotizaciones();
}



