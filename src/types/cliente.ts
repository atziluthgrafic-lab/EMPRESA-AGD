/**
 * Interfaz estandarizada para Ficha de Cliente Atziluth
 * Garantiza la integridad de datos requerida para el registro de clientes y asignación de comisiones.
 */
export interface ClienteAtziluth {
  /** Nombre o Razón Social del Cliente (Obligatorio) */
  nombre: string;
  /** Ubicación o Municipio (Obligatorio) */
  ubicacion: string | { municipality?: string; address?: string; zone?: string };
  /** Tipo de Negocio / Categoría (Obligatorio) */
  tipo_negocio: string;
  /** Características Específicas / Requerimientos del Proyecto (Obligatorio) */
  caracteristicas: string[] | string;

  /** Notas y observaciones del Administrador General (Opcional) */
  notas_admin?: string;

  // Campos adicionales de soporte para integridad del sistema de comisiones
  id?: string;
  vendedorId?: string;
  vendedorNombre?: string;
  estadoComision?: 'Pendiente' | 'Aprobada' | 'Pagada' | 'Disponible para Reasignación';
  estadoComercial?: 'Prospecto' | 'Activo' | 'Inactivo' | string;
  fechaRegistro?: string;
}
