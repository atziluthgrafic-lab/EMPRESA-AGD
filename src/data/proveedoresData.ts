import { ProveedorRecord, OrdenProduccion, PagoProveedor, CotizacionProveedor, DEFAULT_PROVEEDORES_CATEGORIAS } from '../types/proveedor';

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

export const INITIAL_ORDENES: OrdenProduccion[] = [
  {
    id: "ord_ser_102_1",
    numeroOrden: "ORD-PRV-2026-0091",
    pedidoClienteId: "PED-1001",
    clienteNombre: "Distribuidora El Progreso S.A.S. — Medellín",
    proveedorId: "prv_ser_102",
    descripcionTrabajo: "500 Almanaques de Escritorio PyME Premium con Base Troquelada y Plastificado Mate",
    categoria: "Servicios",
    cantidad: 500,
    especificaciones: {
      medidas: "20 x 15 cm",
      material: "Cartón Maule 350g + Anillado Doble O metálico negro",
      tintas: "Policromía 4x4 + Reserva UV Brillante",
      acabados: "Troquelado de base piramidal, armado con resorte y tacos mensuales",
      notas: "Pedido de alta prioridad. Empacar en cajas de 50 unidades con protección."
    },
    archivosAdjuntos: [
      {
        nombre: "Guia_Produccion_Almanaque_Escritorio_2027.pdf",
        url: "/uploads/catalogo_almanaques_2027.pdf",
        tipo: "application/pdf",
        tamano: "4.5 MB"
      }
    ],
    precioVentaCliente: 1650000,
    costoProveedor: 890000,
    estado: "En_Produccion",
    tipoEntrega: "Recoger_Taller",
    direccionEnvio: "Calle 33 # 65-40, Barrio San Joaquín, Medellín",
    fechaAsignacion: "2026-08-16T08:30:00",
    fechaLimiteEntrega: "2026-08-25",
    notificadoAdmin: false
  },
  {
    id: "ord_ser_102_2",
    numeroOrden: "ORD-PRV-2026-0092",
    clienteNombre: "Inversiones & Eventos Antioquia S.A.S.",
    proveedorId: "prv_ser_102",
    descripcionTrabajo: "2000 Carpetas Corporativas con Bolsillo Troquelado y Portatarjeta",
    categoria: "Litografía Comercial",
    cantidad: 2000,
    especificaciones: {
      medidas: "Carta Abierta (46 x 31 cm)",
      material: "Propalcote 300g",
      tintas: "Policromía 4x0 + Plastificado Mate 1 Cara",
      acabados: "Troquelado interior para dos bolsillos y corte para tarjeta de presentación",
      notas: "Entrega programada para evento empresarial."
    },
    precioVentaCliente: 2400000,
    costoProveedor: 1350000,
    estado: "Pendiente_Cotizar",
    tipoEntrega: "Envio_Direccion",
    direccionEnvio: "Carrera 43A # 1-50, Poblado, Medellín",
    fechaAsignacion: "2026-08-17T11:00:00",
    fechaLimiteEntrega: "2026-08-28",
    notificadoAdmin: false
  },
  {
    id: "ord_alm_102_1",
    numeroOrden: "ORD-PRV-2026-0095",
    clienteNombre: "Comercializadora San Antonio — Rionegro",
    proveedorId: "prv_alm_102",
    descripcionTrabajo: "1000 Almanaques Tipo Gigante de Pared con Ojillete y Taco 2027",
    categoria: "Almanaques",
    cantidad: 1000,
    especificaciones: {
      medidas: "33 x 50 cm",
      material: "Cartón Duplex 320g + Taco Papel Bond 75g",
      tintas: "Policromía 4x0 + Barniz UV Total",
      acabados: "Ojillete metálico superior reforzado, taco mensual con festivos colombianos",
      notas: "Diseño listo aprobado por administración."
    },
    precioVentaCliente: 2100000,
    costoProveedor: 1180000,
    estado: "En_Produccion",
    tipoEntrega: "Recoger_Taller",
    direccionEnvio: "Carrera 45 # 50-20, Centro, Medellín",
    fechaAsignacion: "2026-08-15T09:00:00",
    fechaLimiteEntrega: "2026-08-24",
    notificadoAdmin: false
  },
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
    proveedorId: "prv_2",
    descripcionTrabajo: "100 Talonarios Media Carta (14x21.5cm) Químico Autocopiante 2 Copias",
    categoria: "Talonarios",
    cantidad: 100,
    especificaciones: {
      medidas: "14 x 21.5 cm",
      material: "Papel químico 70g (Blanco/Rosado) 50 juegos",
      tintas: "1x0 Tinta negra + Numeración roja consecutiva",
      acabados: "Prepicado, grapado y tapa en cartulina kraft",
      notas: "Numerar desde 0001 a 5000."
    },
    precioVentaCliente: 780000,
    costoProveedor: 480000,
    estado: "En_Produccion",
    tipoEntrega: "Envio_Direccion",
    direccionEnvio: "Carrera 50 # 38-20, Guayabal, Medellín",
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
    comprobanteTipo: "jpg",
    comprobanteNombre: "comprobante_bancolombia_rec_0001.jpg",
    fechaPago: "2026-08-13",
    registradoPor: "Estivenson Navarro (Administrador General)",
    observaciones: "Pago liquidado al 100% por entrega conforme de 1.000 almanaques de bolsillo.",
    createdAt: "2026-08-13T17:00:00"
  },
  {
    id: "pag_ser_102",
    reciboConsecutivo: "REC-PRV-2026-0002",
    proveedorId: "prv_ser_102",
    ordenProduccionId: "ord_ser_102_1",
    monto: 450000,
    metodoPago: "Transferencia Bancolombia",
    referenciaBancaria: "TRF-992817450",
    comprobanteJpgUrl: "/uploads/catalogo_almanaques_2027.pdf",
    comprobanteTipo: "pdf",
    comprobanteNombre: "comprobante_anticipo_bancolombia.pdf",
    fechaPago: "2026-08-16",
    registradoPor: "Estivenson Navarro (Administrador General)",
    observaciones: "Abono inicial 50% para arranque de producción de 500 almanaques de escritorio.",
    createdAt: "2026-08-16T15:30:00"
  },
  {
    id: "pag_alm_102",
    reciboConsecutivo: "REC-PRV-2026-0003",
    proveedorId: "prv_alm_102",
    ordenProduccionId: "ord_alm_102_1",
    monto: 600000,
    metodoPago: "Transferencia Bancolombia",
    referenciaBancaria: "TRF-774619022",
    comprobanteJpgUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    comprobanteTipo: "jpg",
    comprobanteNombre: "comprobante_anticipo_almanaques.jpg",
    fechaPago: "2026-08-15",
    registradoPor: "Estivenson Navarro (Administrador General)",
    observaciones: "Anticipo 50% para compra de cartón duplex 320g e impresión de 1000 almanaques.",
    createdAt: "2026-08-15T11:00:00"
  }
];

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
      localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(INITIAL_ORDENES));
      return INITIAL_ORDENES;
    }
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) {
      localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(INITIAL_ORDENES));
      return INITIAL_ORDENES;
    }
    const map = new Map<string, OrdenProduccion>();
    INITIAL_ORDENES.forEach((o) => map.set(o.id, o));
    list.forEach((o: OrdenProduccion) => map.set(o.id, o));
    const merged = Array.from(map.values());
    return merged;
  } catch (e) {
    console.error("Error loading ordenes from localStorage:", e);
    return INITIAL_ORDENES;
  }
}

export function saveStoredOrdenes(list: OrdenProduccion[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(list));
    // Emit storage event for same-window listeners
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
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
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) {
      localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(INITIAL_PAGOS));
      return INITIAL_PAGOS;
    }
    const map = new Map<string, PagoProveedor>();
    INITIAL_PAGOS.forEach((p) => map.set(p.id, p));
    list.forEach((p: PagoProveedor) => map.set(p.id, p));
    return Array.from(map.values());
  } catch (e) {
    console.error("Error loading pagos from localStorage:", e);
    return INITIAL_PAGOS;
  }
}

export function saveStoredPagos(list: PagoProveedor[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(list));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
  } catch (e) {
    console.error("Error saving pagos to localStorage:", e);
  }
}

export function getStoredCotizaciones(): CotizacionProveedor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COTIZACIONES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COTIZACIONES, JSON.stringify(INITIAL_COTIZACIONES));
      return INITIAL_COTIZACIONES;
    }
    const list: CotizacionProveedor[] = JSON.parse(raw);
    return list;
  } catch (e) {
    console.error("Error loading cotizaciones from localStorage:", e);
    return INITIAL_COTIZACIONES;
  }
}

export function saveStoredCotizaciones(list: CotizacionProveedor[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COTIZACIONES, JSON.stringify(list));
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
    try {
      const parsedUrl = new URL(query.startsWith("http") ? query : `https://temp.local/${query}`);
      const tokenFromQuery = parsedUrl.searchParams.get("token") || parsedUrl.searchParams.get("proveedor") || parsedUrl.searchParams.get("prv");
      if (tokenFromQuery) query = tokenFromQuery;
      else if (parsedUrl.hash) {
        const hashClean = parsedUrl.hash.replace("#", "");
        if (hashClean.includes("token=")) {
          const match = hashClean.match(/token=([^&]+)/);
          if (match && match[1]) query = match[1];
        }
      }
    } catch (_) {
      // Fallback regex extraction
      const match = query.match(/[?&#]token=([^&#]+)/);
      if (match && match[1]) query = decodeURIComponent(match[1]);
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

  const oProvId = (order.proveedorId || "").trim().toLowerCase();
  if (
    oProvId === pId ||
    oProvId === pCode ||
    oProvId === pClave ||
    oProvId === pToken ||
    oProvId === pSlug
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
    const local = getStoredOrdenes();
    const map = new Map<string, OrdenProduccion>();
    local.forEach((o) => map.set(o.id, o));

    const res = await fetch("/api/proveedores/ordenes");
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.ordenes) && json.ordenes.length > 0) {
        json.ordenes.forEach((o: OrdenProduccion) => map.set(o.id, o));
        const merged = Array.from(map.values());
        saveStoredOrdenes(merged);
        return merged;
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
    const local = getStoredPagos();
    const map = new Map<string, PagoProveedor>();
    local.forEach((p) => map.set(p.id, p));

    const res = await fetch("/api/proveedores/pagos");
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.pagos) && json.pagos.length > 0) {
        json.pagos.forEach((p: PagoProveedor) => map.set(p.id, p));
        const merged = Array.from(map.values());
        saveStoredPagos(merged);
        return merged;
      }
    }
  } catch (e) {
    console.warn("fetchAndSyncPagos offline fallback:", e);
  }
  return getStoredPagos();
}


