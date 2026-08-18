import { ProveedorRecord, OrdenProduccion, PagoProveedor, DEFAULT_PROVEEDORES_CATEGORIAS } from '../types/proveedor';

export const INITIAL_PROVEEDORES: ProveedorRecord[] = [
  {
    id: "prv_1",
    codigo: "PRV-ALM-001",
    nombreComercial: "Talleres Gráficos & Troquelados del Valle",
    contactoNombre: "Carlos Mario Jaramillo",
    telefonoWhatsapp: "+57 312 456 7890",
    email: "produccion@troqueladosvalle.com",
    categoria: "Almanaques",
    categorias: ["Almanaques", "Litografía Comercial", "Empaques & Cajas"],
    tokenAcceso: "token_almanaques_valle_9921a",
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
    nombreComercial: "Litografía & Formas Continuas Antioquia",
    contactoNombre: "Marta Lucía Restrepo",
    telefonoWhatsapp: "+57 300 789 1234",
    email: "pedidos@formascontinuasantioquia.com",
    categoria: "Talonarios",
    categorias: ["Talonarios", "Tarjetas", "Adhesivos"],
    tokenAcceso: "token_talonarios_antioquia_7734b",
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
    nombreComercial: "Bordados & Estampados Textiles del Sur",
    contactoNombre: "Jorge Iván Bedoya",
    telefonoWhatsapp: "+57 315 654 3210",
    email: "talleres@textilesdelsur.com",
    categoria: "Bordados",
    categorias: ["Bordados", "Estampados", "Gorras", "Souvenirs"],
    tokenAcceso: "token_bordados_sur_1145c",
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
  }
];

export const INITIAL_ORDENES: OrdenProduccion[] = [
  {
    id: "ord_p1",
    numeroOrden: "ORD-PRV-2026-0081",
    pedidoClienteId: "ORD-CLI-2026-0120",
    clienteNombre: "Agroinsumos del Oriente — Rionegro",
    proveedorId: "prv_1",
    descripcionTrabajo: "500 Almanaques Modelo Gigante (33x50cm) con Taco Mensual grapado y ojillete reforzado",
    categoria: "Almanaques",
    cantidad: 500,
    especificaciones: {
      medidas: "33 x 50 cm",
      material: "Cartón Duplex 320g + Taco Papel Bond 75g",
      tintas: "Policromía 4x0 + Barniz UV Brillante",
      acabados: "Ojillete metálico superior y taco grapado con 2 grapas industriales",
      notas: "Diseño aprobado por cliente. Entregar empacado en paquetes de 50 unidades."
    },
    archivosAdjuntos: [
      {
        nombre: "Arte_Almanaque_Agroinsumos_33x50.pdf",
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
        tipo: "application/pdf",
        tamano: "14.2 MB"
      },
      {
        nombre: "Previsualizacion_Tiro.jpg",
        url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
        tipo: "image/jpeg",
        tamano: "1.8 MB"
      }
    ],
    precioVentaCliente: 1250000,
    costoProveedor: 680000,
    estado: "En_Produccion",
    tipoEntrega: "Recoger_Taller",
    direccionEnvio: "Sede Principal Atziluth — Medellín",
    fechaAsignacion: "2026-08-14T09:30:00",
    fechaLimiteEntrega: "2026-08-22",
    notificadoAdmin: false
  },
  {
    id: "ord_p2",
    numeroOrden: "ORD-PRV-2026-0082",
    pedidoClienteId: "ORD-CLI-2026-0125",
    clienteNombre: "Supermercado La Colmena — Marinilla",
    proveedorId: "prv_1",
    descripcionTrabajo: "300 Almanaques Tipo Respaldo de Taco #4 (15x50cm)",
    categoria: "Almanaques",
    cantidad: 300,
    especificaciones: {
      medidas: "15 x 50 cm",
      material: "Cartulina Kimberly 280g",
      tintas: "4x0 Tintas directas",
      acabados: "Perforado para colgar + Taco pegado",
      notas: "Urgente para entrega en Marinilla antes de fin de mes."
    },
    precioVentaCliente: 540000,
    costoProveedor: 270000,
    estado: "Pendiente_Cotizar",
    fechaAsignacion: "2026-08-16T14:00:00",
    fechaLimiteEntrega: "2026-08-25",
    notificadoAdmin: false
  },
  {
    id: "ord_p3",
    numeroOrden: "ORD-PRV-2026-0078",
    pedidoClienteId: "ORD-CLI-2026-0105",
    clienteNombre: "Ferretería El Tornillo Dorado — Sabaneta",
    proveedorId: "prv_1",
    descripcionTrabajo: "1000 Almanaques Bolsillo (7x10cm) Plastificado Mate 2 Caras",
    categoria: "Almanaques",
    cantidad: 1000,
    especificaciones: {
      medidas: "7 x 10 cm",
      material: "Propalcote 300g",
      tintas: "4x4 Tintas",
      acabados: "Plastificado mate y despunte en 4 esquinas",
      notas: "Pedido entregado conforme."
    },
    precioVentaCliente: 420000,
    costoProveedor: 210000,
    estado: "Terminado",
    tipoEntrega: "Recoger_Taller",
    fechaAsignacion: "2026-08-08T10:00:00",
    fechaLimiteEntrega: "2026-08-13",
    fechaFinalizado: "2026-08-12T16:45:00",
    notificadoAdmin: true,
    mensajeNotificacion: "Trabajo terminado y empaquetado en cajas de 250 unidades listo para recoger en taller."
  }
];

export const INITIAL_PAGOS: PagoProveedor[] = [
  {
    id: "pag_1",
    reciboConsecutivo: "REC-PRV-2026-0001",
    proveedorId: "prv_1",
    ordenProduccionId: "ord_p3",
    monto: 210000,
    metodoPago: "Transferencia Bancolombia",
    referenciaBancaria: "TRF-883920194",
    comprobanteJpgUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    fechaPago: "2026-08-13",
    registradoPor: "Estivenson Navarro (Administrador General)",
    observaciones: "Pago liquidado al 100% por entrega conforme de 1.000 almanaques de bolsillo.",
    createdAt: "2026-08-13T17:00:00"
  }
];

const STORAGE_KEYS = {
  PROVEEDORES: "atziluth_proveedores_records",
  ORDENES: "atziluth_ordenes_produccion",
  PAGOS: "atziluth_pagos_proveedores",
  CATEGORIAS: "atziluth_prov_categorias"
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
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROVEEDORES, JSON.stringify(INITIAL_PROVEEDORES));
      return INITIAL_PROVEEDORES;
    }
    const list: ProveedorRecord[] = JSON.parse(raw);
    // Normalize providers so all have valid categorias array
    return list.map(p => {
      const cats = Array.isArray(p.categorias) && p.categorias.length > 0
        ? p.categorias
        : (p.categoria ? [p.categoria] : ['Servicios']);
      return {
        ...p,
        categorias: cats,
        categoria: cats[0] || 'Servicios'
      };
    });
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
      localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(INITIAL_ORDENES));
      return INITIAL_ORDENES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error loading ordenes from localStorage:", e);
    return INITIAL_ORDENES;
  }
}

export function saveStoredOrdenes(list: OrdenProduccion[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving ordenes to localStorage:", e);
  }
}

export function getStoredPagos(): PagoProveedor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAGOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(INITIAL_PAGOS));
      return INITIAL_PAGOS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error loading pagos from localStorage:", e);
    return INITIAL_PAGOS;
  }
}

export function saveStoredPagos(list: PagoProveedor[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving pagos to localStorage:", e);
  }
}
