import { ClienteAtziluth } from '../types/cliente';

const STORAGE_KEY = 'atziluth_clientes_v1';

/**
 * Servicio de utilidad para la gestión y persistencia local de la interfaz ClienteAtziluth
 */

export const obtenerClientes = (): ClienteAtziluth[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo clientes desde localStorage:', err);
    return [];
  }
};

export const guardarCliente = (nuevoCliente: ClienteAtziluth): ClienteAtziluth[] => {
  try {
    const clientesActuales = obtenerClientes();
    // Reemplazar si existe o agregar si es nuevo
    const index = clientesActuales.findIndex(c => c.id === nuevoCliente.id);
    let actualizados: ClienteAtziluth[];
    if (index >= 0) {
      actualizados = [...clientesActuales];
      actualizados[index] = nuevoCliente;
    } else {
      actualizados = [nuevoCliente, ...clientesActuales];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
    return actualizados;
  } catch (err) {
    console.error('Error guardando cliente en localStorage:', err);
    return obtenerClientes();
  }
};

export const filtrarClientesPorZona = (zona: string): ClienteAtziluth[] => {
  const todos = obtenerClientes();
  if (!zona || zona === 'all' || zona === 'todas') return todos;
  const q = zona.toLowerCase().trim();
  return todos.filter(c => {
    if (typeof c.ubicacion === 'string') {
      return c.ubicacion.toLowerCase().includes(q);
    }
    if (c.ubicacion && typeof c.ubicacion === 'object') {
      return (
        c.ubicacion.municipality?.toLowerCase().includes(q) ||
        c.ubicacion.zone?.toLowerCase().includes(q) ||
        c.ubicacion.address?.toLowerCase().includes(q)
      );
    }
    return false;
  });
};

export const filtrarClientes = (
  filtroZona?: string,
  busqueda?: string,
  vendedorId?: string
): ClienteAtziluth[] => {
  let resultado = obtenerClientes();

  if (vendedorId && vendedorId !== 'all') {
    resultado = resultado.filter(c => c.vendedorId === vendedorId);
  }

  if (filtroZona && filtroZona !== 'all' && filtroZona !== 'todas') {
    const qZona = filtroZona.toLowerCase().trim();
    resultado = resultado.filter(c => {
      if (typeof c.ubicacion === 'string') return c.ubicacion.toLowerCase().includes(qZona);
      if (c.ubicacion && typeof c.ubicacion === 'object') {
        return (
          c.ubicacion.municipality?.toLowerCase().includes(qZona) ||
          c.ubicacion.zone?.toLowerCase().includes(qZona)
        );
      }
      return false;
    });
  }

  if (busqueda && busqueda.trim().length > 0) {
    const q = busqueda.toLowerCase().trim();
    resultado = resultado.filter(c => {
      const matchNombre = c.nombre?.toLowerCase().includes(q);
      const matchTipo = c.tipo_negocio?.toLowerCase().includes(q);
      const matchUbi = typeof c.ubicacion === 'string' 
        ? c.ubicacion.toLowerCase().includes(q) 
        : (c.ubicacion?.municipality?.toLowerCase().includes(q) || c.ubicacion?.zone?.toLowerCase().includes(q));
      
      let matchChar = false;
      if (Array.isArray(c.caracteristicas)) {
        matchChar = c.caracteristicas.some(item => item.toLowerCase().includes(q));
      } else if (typeof c.caracteristicas === 'string') {
        matchChar = c.caracteristicas.toLowerCase().includes(q);
      }

      return matchNombre || matchTipo || matchUbi || matchChar;
    });
  }

  return resultado;
};

export const actualizarNotasAdminCliente = (clientId: string, notasAdmin: string): ClienteAtziluth[] => {
  const todos = obtenerClientes();
  const index = todos.findIndex(c => c.id === clientId);
  if (index >= 0) {
    todos[index].notas_admin = notasAdmin;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
  return todos;
};
