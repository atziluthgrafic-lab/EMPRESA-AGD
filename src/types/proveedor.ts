export const DEFAULT_PROVEEDORES_CATEGORIAS: string[] = [
  'Almanaques',
  'Talonarios',
  'Tarjetas',
  'Estampados',
  'Bordados',
  'Gorras',
  'Souvenirs',
  'Sublimación',
  'Adhesivos',
  'Pendones',
  'Avisos',
  'Servicios',
  'Litografía Comercial',
  'Empaques & Cajas',
  'Sellos & Grabados'
];

export type ProveedorCategoria = string;

export interface ProveedorBankDetails {
  banco: string; // Ej: Bancolombia, Nequi, Daviplata, BBVA, Banco de Bogotá
  tipoCuenta: 'Ahorros' | 'Corriente' | 'Billetera Digital';
  numeroCuenta: string;
  titular: string;
  documentoTitular: string;
  telefonoTransferencia?: string;
  emailNotificaciones?: string;
}

export interface HistorialCodigoAcceso {
  id?: string;
  codigoAnterior?: string;
  codigoNuevo: string;
  fecha: string;
  modificadoPor?: string;
  motivo?: string;
}

export interface ProveedorRecord {
  id: string;
  codigo: string; // Ej: PRV-ALM-001
  nombreComercial: string;
  contactoNombre: string;
  telefonoWhatsapp: string;
  email?: string;
  categoria?: string; // Compatibilidad legacy (primera categoría)
  categorias: string[]; // Varias categorías o líneas de producción asignadas al taller
  tokenAcceso: string; // Token único o ID para oficina virtual
  slugAcceso?: string; // Slug o dirección personalizada configurable por el admin (ej: taller-almohadas-medellin)
  activo: boolean;
  datosBancarios: ProveedorBankDetails;
  direccionTaller?: string;
  municipio?: string;
  notasInternas?: string;
  historialCodigosAcceso?: HistorialCodigoAcceso[]; // Historial de cambios de código de acceso
  createdAt: string;
  updatedAt?: string;
}

export type OrdenProduccionEstado =
  | 'Pendiente_Cotizar'
  | 'En_Produccion'
  | 'Terminado'
  | 'Entregado'
  | 'Cancelado';

export type OrdenProduccionTipoEntrega =
  | 'Recoger_Taller'
  | 'Envio_Direccion';

export interface OrdenArchivoAdjunto {
  nombre: string;
  url: string;
  tipo?: string;
  tamano?: string;
}

export interface OrdenProduccion {
  id: string;
  numeroOrden: string; // Ej: ORD-PRV-2026-0042
  pedidoClienteId?: string; // Vínculo con pedido de ventas
  clienteNombre?: string;
  proveedorId: string;
  descripcionTrabajo: string;
  categoria: ProveedorCategoria;
  cantidad: number;
  especificaciones?: {
    medidas?: string;
    material?: string;
    tintas?: string;
    acabados?: string;
    notas?: string;
  };
  archivosAdjuntos?: OrdenArchivoAdjunto[];
  
  // Financiero
  precioVentaCliente: number; // Lo que paga el cliente
  costoProveedor: number;      // Lo que el proveedor cotiza o cobra
  
  // Estados y Logística
  estado: OrdenProduccionEstado;
  tipoEntrega?: OrdenProduccionTipoEntrega;
  direccionEnvio?: string;
  guiaTransporte?: string;
  observacionesLogistica?: string;
  
  // Tiempos
  fechaAsignacion: string;
  fechaLimiteEntrega?: string;
  fechaFinalizado?: string;
  notificadoAdmin: boolean;
  mensajeNotificacion?: string;
}

export interface CotizacionProveedor {
  id: string;
  proveedorId: string;
  proveedorCodigo?: string;
  proveedorNombre?: string;
  proveedorTelefono?: string;
  proveedorMunicipio?: string;
  tituloProducto: string; // Ej: 100 Talonarios media carta autocopiante 2 copias
  categoria: ProveedorCategoria; // Ej: Talonarios, Almanaques, etc.
  cantidad: number; // Ej: 100
  unidadMedida?: string; // Ej: Talonarios, Unidades, Millares, Paquetes
  medidasFormato?: string; // Ej: Media carta (14x21.5cm), Cuarto de carta (10.7x14cm)
  materialPapel?: string; // Ej: Papel químico autocopiante 70g (Original blanco + copia rosada)
  tintasColores?: string; // Ej: 1x0 Tinta negra o 4x0 policromía
  terminaciones?: string; // Ej: Numerado consecutivo rojo, prepicado, engrapado con tapa kraft
  tiempoEntregaDias?: string; // Ej: 2 a 3 días hábiles
  descripcionDetallada: string; // Espacio amplio para 500 a 1000 palabras con todas las especificaciones y condiciones
  precioCostoTotal: number; // Valor total cobrado por el lote/pedido en COP
  precioCostoUnitario?: number; // Calculado precioCostoTotal / cantidad
  fechaCreacion: string;
  fechaActualizacion?: string;
  activo: boolean; // Si está activa para que el admin la consulte
  destacadaAdmin?: boolean; // Marcada como favorita/mejor costo por admin
  notasAdmin?: string; // Anotaciones internas del administrador
}

export interface PagoProveedor {
  id: string;
  reciboConsecutivo: string; // Ej: REC-PRV-2026-0012
  proveedorId: string;
  ordenProduccionId?: string;
  monto: number;
  metodoPago: 'Transferencia Bancolombia' | 'Nequi' | 'Daviplata' | 'Efectivo' | 'Cheque' | 'Otro';
  referenciaBancaria?: string;
  comprobanteJpgUrl: string; // URL o DataURL en base64 de la imagen JPG/PNG o archivo PDF
  comprobanteTipo?: 'jpg' | 'png' | 'pdf' | string; // Tipo de comprobante (JPG, PNG o PDF)
  comprobanteNombre?: string; // Nombre original del archivo adjunto
  fechaPago: string;
  registradoPor: string;
  observaciones?: string;
  createdAt: string;
}
