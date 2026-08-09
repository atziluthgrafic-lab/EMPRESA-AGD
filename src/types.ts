export * from './types/cliente';

export type SubregionId =
  | "valle_de_aburra"
  | "oriente"
  | "suroeste"
  | "occidente"
  | "uraba"
  | "norte"
  | "bajo_cauca"
  | "nordeste"
  | "magdalena_medio";

export interface Subregion {
  id: SubregionId;
  name: string;
  description: string;
  capital: string;
  color: string; // Tailwind color class for map highlight
  municipalitiesCount: number;
  highlightedSectors: string[];
}

export interface Municipality {
  name: string;
  subregion: SubregionId;
  capitalDistanceKm?: number;
  primaryEconomy: string;
  adTip: string;
}

// Esquema TypeScript / JSON para Ficha de Cliente (Comando AGREGAR_CLIENTE)
export interface FichaClienteData {
  /** CAMPO OBLIGATORIO: Nombre / Razón Social del Cliente */
  nombre: string;
  /** CAMPO OBLIGATORIO: Ubicación o Municipio del Cliente */
  ubicacion: string;
  /** CAMPO OBLIGATORIO: Tipo de Negocio / Categoría Comercial */
  tipo_negocio: string;
  /** CAMPO OBLIGATORIO: Características Específicas / Requerimientos */
  caracteristicas: string;

  // Campos de contacto adicionales
  telefono?: string;
  email?: string;
  nit_cc?: string;
  persona_contacto?: string;
}

export interface FichaClienteEstructurada {
  comando: "AGREGAR_CLIENTE";
  id: string;
  cliente: FichaClienteData;
  vendedor: {
    id: string;
    nombre: string;
    zona?: string;
  };
  comision: {
    beneficiario_id: string;
    beneficiario_nombre: string;
    estado: "Pendiente" | "Aprobada" | "Pagada" | "Disponible para Reasignación";
  };
  fecha_registro: string;
  /** CAMPO OPCIONAL: Exclusivo para notas y observaciones del Administrador General */
  notas_administrador?: string;
}

export interface ClientPayment {
  id: string;
  concept: string;
  period: string;
  amount: number;
  date: string;
  method: string;
  paid: boolean;
  notes?: string;
}

export interface ClientUbicacion {
  municipality: string;
  address: string;
  zone: string;
}

export interface ClientCaracteristicas {
  nitCc: string;
  personaContacto: string;
  telefono: string;
  email: string;
  presupuestoEstimado: number;
  periodicidad: string;
  notasEspecificas: string;
}

export interface ClientRecord {
  id: string;
  clientName: string;
  name?: string;
  projectName?: string;
  phone?: string;
  startDate?: string;
  hostingDomainFee?: number;
  hostingDomainPaid?: boolean;
  monthlyFee?: number;
  billingDay?: number;
  notes?: string;
  payments?: ClientPayment[];

  // Rich CRM & Commission Fields
  location?: string;
  specificCharacteristics?: string;
  municipality?: string;
  address?: string;
  categoryZone?: string;
  nitCc?: string;
  contact?: string;
  fichaClienteJson?: string;
  ubicacion?: ClientUbicacion;
  businessType?: string;
  tipoDeNegocio?: string;
  caracteristicasEspecificas?: ClientCaracteristicas;
  createdBySellerId?: string;
  createdBySellerName?: string;
  vendedorId?: string;
  vendedorNombre?: string;
  beneficiarioComision?: string;
  beneficiarioNombre?: string;
  estadoComision?: 'Pendiente' | 'Aprobada' | 'Pagada' | 'Disponible para Reasignación';
  notasAdmin?: string;
  promociones?: string[];
  descuentoPorcentaje?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Business {
  id: string;
  name: string;
  category?: string;
  niche?: string;
  municipality: string;
  subregion: SubregionId;
  phone: string;
  website?: string;
  usesAI?: boolean;
  description?: string;
  logoUrl?: string;
  imageUrl?: string;
  servicesCompleted?: string[];
}

export interface SellerRecord {
  id: string;
  name: string;
  username: string;
  password?: string;
  supervisor?: string;
  phone: string;
  zone: string;
  commissionRate: number;
  municipalities: string[];
  categories: string[];
  createdAt: string;
}
