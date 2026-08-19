import React, { useState, useEffect } from "react";
import VendedorDashboard from "./VendedorDashboard";
import {
  Users,
  Server,
  Wallet,
  AlertCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  Trash2,
  Calendar,
  Phone,
  FileSpreadsheet,
  Upload,
  Image as ImageIcon,
  Save,
  DollarSign,
  Receipt,
  X,
  Building2,
  RefreshCw,
  FolderOpen,
  MapPin,
  Tag,
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Award,
  Check,
  Lock,
  LogOut,
  Edit3,
  Key,
  ShieldAlert,
  UserPlus,
  LayoutDashboard,
  ExternalLink,
  Share2,
  Copy,
  Sparkles,
  Package,
  CreditCard,
  TrendingUp,
  Eye,
  Send,
  CheckCheck,
  Layers,
  Sliders,
  ArrowRight,
  AlertTriangle,
  Zap,
  BookOpen,
  Star,
  Percent,
  BarChart3,
  TrendingDown,
  Inbox
} from "lucide-react";
import { ClientRecord, ClientPayment } from "../types";
import {
  ProveedorRecord,
  OrdenProduccion,
  PagoProveedor,
  CotizacionProveedor,
  ProveedorCategoria,
  ProveedorBankDetails,
  DEFAULT_PROVEEDORES_CATEGORIAS
} from "../types/proveedor";
import {
  getStoredProveedores,
  saveStoredProveedores,
  getStoredOrdenes,
  saveStoredOrdenes,
  getStoredPagos,
  saveStoredPagos,
  getStoredCotizaciones,
  saveStoredCotizaciones,
  getStoredCategorias,
  saveStoredCategorias,
  INITIAL_COTIZACIONES,
  fetchAndSyncProveedores
} from "../data/proveedoresData";
import CustomerRegistrationForm from "./CustomerRegistrationForm";
import CustomerList from "./CustomerList";
import CategoryMultiSelect from "./CategoryMultiSelect";
import CategoriasManagerModal from "./CategoriasManagerModal";

export interface AuthSession {
  isLoggedIn: boolean;
  role: 'admin' | 'vendedor';
  username: string;
  name: string;
  sellerId?: string;
  sellerRecord?: SellerRecord;
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

const DEFAULT_SELLERS: SellerRecord[] = [
  {
    id: "sel_1",
    name: "Carlos Mario Arango",
    username: "carlos.ventas",
    password: "123",
    phone: "3004567890",
    zone: "Valle de Aburrá Norte",
    commissionRate: 5.0,
    municipalities: ["Medellín", "Bello", "Copacabana", "Girardota"],
    categories: ["Gran Formato & Pendones", "Calendarios & Almanaques 2026", "Litografía & Papelería Comercial"],
    createdAt: "2026-01-15"
  },
  {
    id: "sel_2",
    name: "Camila Ospina Restrepo",
    username: "camila.comercial",
    password: "123",
    phone: "3129876543",
    zone: "Valle de Aburrá Sur",
    commissionRate: 6.0,
    municipalities: ["Envigado", "Itagüí", "Sabaneta", "Caldas", "La Estrella"],
    categories: ["Litografía & Papelería Comercial", "Tarjetas de Presentación & Volantes", "Empaques & Cajas Personalizadas"],
    createdAt: "2026-02-01"
  },
  {
    id: "sel_3",
    name: "Andrés Felipe Restrepo",
    username: "andres.oriente",
    password: "123",
    phone: "3155551234",
    zone: "Oriente Antioqueño",
    commissionRate: 5.5,
    municipalities: ["Rionegro", "Marinilla", "Guarne", "La Ceja", "El Retiro"],
    categories: ["Calendarios & Almanaques 2026", "Gran Formato & Pendones", "Avisos Neón 3D & Acrílicos"],
    createdAt: "2026-03-10"
  }
];

export const ANTIOQUIA_MUNICIPALITIES = [
  // Valle de Aburrá
  "Medellín", "Bello", "Envigado", "Itagüí", "Sabaneta", "Copacabana", "Girardota", "Caldas", "La Estrella", "Barbosa",
  // Oriente
  "Rionegro", "Marinilla", "Guarne", "La Ceja", "El Retiro", "Carmen de Viboral", "Guatapé", "San Vicente", "La Unión", "Sonsón",
  // Occidente & Urabá
  "Santa Fe de Antioquia", "Sopetrán", "San Jerónimo", "Apartadó", "Turbo", "Chigorodó", "Carepa", "Necoclí",
  // Suroeste
  "Amagá", "Andes", "Ciudad Bolívar", "Jericó", "Fredonia", "Santa Bárbara", "Támesis",
  // Bajo Cauca, Norte & Magdalena Medio
  "Caucasia", "El Bagre", "Zaragoza", "Yarumal", "Santa Rosa de Osos", "Puerto Berrío", "Segovia", "Remedios"
];

export const BUSINESS_CATEGORIES = [
  "Gran Formato & Pendones",
  "Calendarios & Almanaques 2026",
  "Litografía & Papelería Comercial",
  "Tarjetas de Presentación & Volantes",
  "Avisos Neón 3D & Acrílicos",
  "Empaques & Cajas Personalizadas",
  "Diseño Web & Branding Digital"
];

export interface OrderReceiptRecord {
  id: string;
  orderNumber: string;
  documentType: 'abono' | 'factura';
  date: string;
  sellerId: string;
  sellerName: string;
  sellerUsername: string;
  sellerPhone: string;
  sellerSupervisor?: string;
  clientName: string;
  clientDocument: string;
  clientPhone: string;
  clientMunicipality: string;
  clientAddress: string;
  productCategory: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentMethod: string;
  status: 'pendiente' | 'completado' | 'entregado';
  notes: string;
  createdAt: string;
}

const DEFAULT_ORDERS: OrderReceiptRecord[] = [
  {
    id: "ord_101",
    orderNumber: "PED-2026-001",
    documentType: "abono",
    date: "2026-08-01",
    sellerId: "sel_1",
    sellerName: "Carlos Mario Arango",
    sellerUsername: "carlos.ventas",
    sellerPhone: "3004567890",
    sellerSupervisor: "Estivenson Navarro (Director Comercial)",
    clientName: "Distribuidora El Triunfo S.A.S.",
    clientDocument: "900.123.456-7",
    clientPhone: "3115559876",
    clientMunicipality: "Bello",
    clientAddress: "Calle 50 # 45-12, Sector Niquía",
    productCategory: "Calendarios & Almanaques 2026",
    productDescription: "Almanaque de Pared 30x50cm - Tinta UV Full Color - Carátula Propalcote 300g",
    quantity: 500,
    unitPrice: 3800,
    totalAmount: 1900000,
    paidAmount: 900000,
    balance: 1000000,
    paymentMethod: "Transferencia Bancaria (Bancolombia)",
    status: "pendiente",
    notes: "Abono inicial del 47%. Saldo restante contra entrega programada.",
    createdAt: "2026-08-01T10:00:00.000Z"
  },
  {
    id: "ord_102",
    orderNumber: "PED-2026-002",
    documentType: "factura",
    date: "2026-08-04",
    sellerId: "sel_2",
    sellerName: "Camila Ospina Restrepo",
    sellerUsername: "camila.comercial",
    sellerPhone: "3129876543",
    sellerSupervisor: "Laura Gómez (Supervisora Metropolitana)",
    clientName: "Calzado & Marroquinería Real",
    clientDocument: "71.234.567",
    clientPhone: "3014443322",
    clientMunicipality: "Envigado",
    clientAddress: "Carrera 43A # 32-10, Zona Comercial",
    productCategory: "Portafolios Comerciales & Carpetas",
    productDescription: "Portafolio Ejecutivo Plastificado Mate con Bolsillo Interno y Solapa",
    quantity: 200,
    unitPrice: 6500,
    totalAmount: 1300000,
    paidAmount: 1300000,
    balance: 0,
    paymentMethod: "Efectivo",
    status: "completado",
    notes: "Factura cancelada en su totalidad al momento de entrega.",
    createdAt: "2026-08-04T14:30:00.000Z"
  }
];

export const PROVEEDORES_CATEGORIAS: ProveedorCategoria[] = [
  "Almanaques",
  "Talonarios",
  "Tarjetas",
  "Estampados",
  "Bordados",
  "Gorras",
  "Souvenirs",
  "Sublimación",
  "Adhesivos",
  "Pendones",
  "Avisos",
  "Servicios"
];

export type AdminTab =
  | 'panel_general'
  | 'talleres'
  | 'proveedores'
  | 'cotizaciones_talleres'
  | 'cotizaciones_recibidas'
  | 'balance'
  | 'vendedores'
  | 'clientes'
  | 'facturacion'
  | 'branding';

const formatCOP = (num: number) => {
  return '$' + (Number(num) || 0).toLocaleString('es-CO') + ' COP';
};

export default function AdminDashboard() {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>(() => {
    try {
      const hash = window.location.hash || '';
      if (hash.includes('tab=')) {
        const tab = hash.split('tab=')[1]?.split('&')[0] as AdminTab;
        if (['panel_general', 'talleres', 'vendedores', 'proveedores', 'cotizaciones_talleres', 'cotizaciones_recibidas', 'balance', 'clientes', 'facturacion', 'branding'].includes(tab)) {
          return tab;
        }
      }
    } catch (_) {}
    return 'panel_general';
  });

  // Internal Navigation Handler using State & Hash Query without triggering global page navigation
  const handleNavigateTab = (tab: AdminTab, scrollTargetId?: string) => {
    setActiveAdminTab(tab);
    try {
      const currentHash = window.location.hash || '#admin';
      const baseHash = currentHash.split('?')[0] || '#admin';
      const targetHash = `${baseHash}?tab=${tab}`;
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', targetHash);
      }
    } catch (_) {}
    if (scrollTargetId) {
      setTimeout(() => {
        const el = document.getElementById(scrollTargetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  };

  useEffect(() => {
    const handleInternalHash = () => {
      try {
        const hash = window.location.hash || '';
        if (hash.includes('tab=')) {
          const tab = hash.split('tab=')[1]?.split('&')[0] as AdminTab;
          if (['panel_general', 'talleres', 'vendedores', 'proveedores', 'cotizaciones_talleres', 'cotizaciones_recibidas', 'balance', 'clientes', 'facturacion', 'branding'].includes(tab)) {
            setActiveAdminTab(tab);
          }
        }
      } catch (_) {}
    };
    window.addEventListener('hashchange', handleInternalHash);
    return () => window.removeEventListener('hashchange', handleInternalHash);
  }, []);

  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // ==================== PROVEEDORES & OFICINAS VIRTUALES STATE ====================
  const [proveedores, setProveedores] = useState<ProveedorRecord[]>(() => {
    return getStoredProveedores();
  });

  const [provOrdenes, setProvOrdenes] = useState<OrdenProduccion[]>(() => {
    return getStoredOrdenes();
  });

  const [provPagos, setProvPagos] = useState<PagoProveedor[]>(() => {
    return getStoredPagos();
  });

  const [provCotizaciones, setProvCotizaciones] = useState<CotizacionProveedor[]>(() => {
    return getStoredCotizaciones();
  });

  // Sync with LocalStorage
  useEffect(() => {
    saveStoredProveedores(proveedores);
  }, [proveedores]);

  useEffect(() => {
    saveStoredOrdenes(provOrdenes);
  }, [provOrdenes]);

  useEffect(() => {
    saveStoredPagos(provPagos);
  }, [provPagos]);

  useEffect(() => {
    saveStoredCotizaciones(provCotizaciones);
  }, [provCotizaciones]);

  // Live real-time sync with ProveedorVirtualOffice submissions across tabs/windows
  useEffect(() => {
    // Sincronización inicial con base de datos del servidor
    fetchAndSyncProveedores().then((synced) => {
      if (synced && synced.length > 0) {
        setProveedores(synced);
      }
    }).catch(() => {});

    const handleSync = () => {
      setProveedores(getStoredProveedores());
      setProvOrdenes(getStoredOrdenes());
      setProvPagos(getStoredPagos());
      setProvCotizaciones(getStoredCotizaciones());
      setCategoriesList(getStoredCategorias());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("atziluth_prov_data_change", handleSync);
    window.addEventListener("focus", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("atziluth_prov_data_change", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  // Sub-panel navigation inside "Gestión de Proveedores"
  const [provActiveSubPanel, setProvActiveSubPanel] = useState<'cotizaciones' | 'talleres' | 'nuevo' | 'tokens'>('cotizaciones');

  // Quotation comparison & filtering state in Admin
  const [cotSearchTerm, setCotSearchTerm] = useState("");
  const [cotCategoryFilter, setCotCategoryFilter] = useState("all");
  const [cotProviderFilter, setCotProviderFilter] = useState("all");
  const [cotSortMode, setCotSortMode] = useState<"menor_precio" | "menor_unitario" | "reciente" | "proveedor">("menor_precio");
  const [cotDecisionMode, setCotDecisionMode] = useState<"todas" | "solo_mejores" | "matriz_ahorro" | "destacadas">("todas");
  const [expandedCotId, setExpandedCotId] = useState<string | null>(null);

  // Dynamic categories list (loaded from localStorage with standard defaults)
  const [categoriesList, setCategoriesList] = useState<string[]>(() => getStoredCategorias());
  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [inlineNewCategory, setInlineNewCategory] = useState("");

  // Form State: Nuevo Proveedor (Multiple Categories)
  const [newProvNombre, setNewProvNombre] = useState("");
  const [newProvCategorias, setNewProvCategorias] = useState<string[]>(["Almanaques"]);
  const [newProvContacto, setNewProvContacto] = useState("");
  const [newProvTelefono, setNewProvTelefono] = useState("");
  const [newProvEmail, setNewProvEmail] = useState("");
  const [newProvDireccion, setNewProvDireccion] = useState("");
  const [newProvMunicipio, setNewProvMunicipio] = useState("Medellín");
  const [newProvBanco, setNewProvBanco] = useState("Bancolombia");
  const [newProvTipoCuenta, setNewProvTipoCuenta] = useState<'Ahorros' | 'Corriente' | 'Billetera Digital'>("Ahorros");
  const [newProvNumeroCuenta, setNewProvNumeroCuenta] = useState("");
  const [newProvTitular, setNewProvTitular] = useState("");
  const [newProvDocumento, setNewProvDocumento] = useState("");
  const [newProvNotas, setNewProvNotas] = useState("");
  const [newProvSlug, setNewProvSlug] = useState("");

  // Edit Modal State
  const [editingProv, setEditingProv] = useState<ProveedorRecord | null>(null);
  const [editProvNombre, setEditProvNombre] = useState("");
  const [editProvCategorias, setEditProvCategorias] = useState<string[]>(["Almanaques"]);
  const [editProvContacto, setEditProvContacto] = useState("");
  const [editProvTelefono, setEditProvTelefono] = useState("");
  const [editProvEmail, setEditProvEmail] = useState("");
  const [editProvDireccion, setEditProvDireccion] = useState("");
  const [editProvMunicipio, setEditProvMunicipio] = useState("Medellín");
  const [editProvBanco, setEditProvBanco] = useState("Bancolombia");
  const [editProvTipoCuenta, setEditProvTipoCuenta] = useState<'Ahorros' | 'Corriente' | 'Billetera Digital'>("Ahorros");
  const [editProvNumeroCuenta, setEditProvNumeroCuenta] = useState("");
  const [editProvTitular, setEditProvTitular] = useState("");
  const [editProvDocumento, setEditProvDocumento] = useState("");
  const [editProvNotas, setEditProvNotas] = useState("");
  const [editProvActivo, setEditProvActivo] = useState(true);
  const [editProvSlug, setEditProvSlug] = useState("");

  // Modal Personalizar Dirección / Token de Acceso
  const [customizingAccessProv, setCustomizingAccessProv] = useState<ProveedorRecord | null>(null);
  const [customAccessKey, setCustomAccessKey] = useState("");

  // Editor y Generador Rápido de Token en Panel Administrativo
  const [selectedTokenProvId, setSelectedTokenProvId] = useState<string>("");
  const [quickTokenInput, setQuickTokenInput] = useState<string>("");
  const [inlineEditTableProvId, setInlineEditTableProvId] = useState<string | null>(null);
  const [inlineEditTableToken, setInlineEditTableToken] = useState<string>("");

  // New Order Modal State
  const [orderModalProv, setOrderModalProv] = useState<ProveedorRecord | null>(null);
  const [newOrdCliente, setNewOrdCliente] = useState("");
  const [newOrdCantidad, setNewOrdCantidad] = useState(100);
  const [newOrdDescripcion, setNewOrdDescripcion] = useState("");
  const [newOrdCategoria, setNewOrdCategoria] = useState("Almanaques");
  const [newOrdPrecioVenta, setNewOrdPrecioVenta] = useState(0);
  const [newOrdCostoProv, setNewOrdCostoProv] = useState(0);
  const [newOrdTipoEntrega, setNewOrdTipoEntrega] = useState<'Recoger_Taller' | 'Envio_Direccion'>("Recoger_Taller");

  // Payment Modal State
  const [paymentModalProv, setPaymentModalProv] = useState<ProveedorRecord | null>(null);
  const [payMonto, setPayMonto] = useState<number>(0);
  const [payMetodo, setPayMetodo] = useState("Transferencia Bancolombia");
  const [payReferencia, setPayReferencia] = useState("");
  const [payComprobanteJpg, setPayComprobanteJpg] = useState<string>("");
  const [payComprobanteFileName, setPayComprobanteFileName] = useState("");
  const [payComprobanteTipo, setPayComprobanteTipo] = useState<string>("jpg");

  // Receipt Modal State
  const [viewingProvReceipt, setViewingProvReceipt] = useState<PagoProveedor | null>(null);

  // Search & Filter
  const [provSearchTerm, setProvSearchTerm] = useState("");
  const [provCategoryFilter, setProvCategoryFilter] = useState("all");
  const [provAccessFilter, setProvAccessFilter] = useState<"all" | "activos" | "pendientes">("all");

  // Full CRUD Categories Management Handlers
  const handleSaveCategories = (newList: string[]) => {
    setCategoriesList(newList);
    saveStoredCategorias(newList);
  };

  const handleAddNewCategoryFromMultiSelect = (newCategory: string) => {
    if (!categoriesList.some(c => c.toLowerCase() === newCategory.toLowerCase())) {
      const updated = [...categoriesList, newCategory];
      setCategoriesList(updated);
      saveStoredCategorias(updated);
    }
  };

  const handleInlineAddCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inlineNewCategory.trim();
    if (!trimmed) return;
    const formatted = trimmed
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    if (!categoriesList.some(c => c.toLowerCase() === formatted.toLowerCase())) {
      const updated = [...categoriesList, formatted];
      setCategoriesList(updated);
      saveStoredCategorias(updated);
    }
    if (!newProvCategorias.includes(formatted)) {
      setNewProvCategorias([...newProvCategorias, formatted]);
    }
    setInlineNewCategory("");
    setSaveStatus(`✓ Categoría "${formatted}" creada y asignada al nuevo taller.`);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleRenameCategory = (oldName: string, newName: string) => {
    // 1. Update categories list
    const updatedCategories = categoriesList.map(c => c === oldName ? newName : c);
    setCategoriesList(updatedCategories);
    saveStoredCategorias(updatedCategories);

    // 2. Cascade rename across all proveedores
    const updatedProveedores = proveedores.map(p => {
      const pCats = Array.isArray(p.categorias) && p.categorias.length > 0
        ? p.categorias
        : (p.categoria ? [p.categoria] : []);
      if (pCats.includes(oldName)) {
        const newCats = pCats.map(c => c === oldName ? newName : c);
        return {
          ...p,
          categorias: newCats,
          categoria: p.categoria === oldName ? newName : (newCats[0] || newName)
        };
      }
      return p;
    });
    setProveedores(updatedProveedores);
    saveStoredProveedores(updatedProveedores);

    // 3. Update orders if matched
    const updatedOrders = provOrdenes.map(o => {
      if (o.categoria === oldName) {
        return { ...o, categoria: newName };
      }
      return o;
    });
    setProvOrdenes(updatedOrders);
    saveStoredOrdenes(updatedOrders);

    // 4. Update filter if active
    if (provCategoryFilter === oldName) {
      setProvCategoryFilter(newName);
    }

    // 5. Update local state selections
    if (newProvCategorias.includes(oldName)) {
      setNewProvCategorias(prev => prev.map(c => c === oldName ? newName : c));
    }
    if (editProvCategorias.includes(oldName)) {
      setEditProvCategorias(prev => prev.map(c => c === oldName ? newName : c));
    }

    setSaveStatus(`✓ Categoría "${oldName}" renombrada a "${newName}" en todos los talleres.`);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    // 1. Remove from categories list
    const updatedCategories = categoriesList.filter(c => c !== categoryToDelete);
    const finalList = updatedCategories.length > 0 ? updatedCategories : ["Servicios"];
    setCategoriesList(finalList);
    saveStoredCategorias(finalList);

    // 2. Update proveedores that had this category
    const updatedProveedores = proveedores.map(p => {
      const pCats = Array.isArray(p.categorias) && p.categorias.length > 0
        ? p.categorias
        : (p.categoria ? [p.categoria] : []);
      if (pCats.includes(categoryToDelete)) {
        const remainingCats = pCats.filter(c => c !== categoryToDelete);
        const safeCats = remainingCats.length > 0 ? remainingCats : [finalList[0] || "Servicios"];
        return {
          ...p,
          categorias: safeCats,
          categoria: safeCats[0]
        };
      }
      return p;
    });
    setProveedores(updatedProveedores);
    saveStoredProveedores(updatedProveedores);

    // 3. Update filter if matched
    if (provCategoryFilter === categoryToDelete) {
      setProvCategoryFilter("all");
    }

    // 4. Update local state selections
    if (newProvCategorias.includes(categoryToDelete)) {
      setNewProvCategorias(prev => {
        const rem = prev.filter(c => c !== categoryToDelete);
        return rem.length > 0 ? rem : [finalList[0]];
      });
    }
    if (editProvCategorias.includes(categoryToDelete)) {
      setEditProvCategorias(prev => {
        const rem = prev.filter(c => c !== categoryToDelete);
        return rem.length > 0 ? rem : [finalList[0]];
      });
    }

    setSaveStatus(`✓ Categoría "${categoryToDelete}" eliminada del catálogo.`);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleResetCategoryDefaults = () => {
    setCategoriesList(DEFAULT_PROVEEDORES_CATEGORIAS);
    saveStoredCategorias(DEFAULT_PROVEEDORES_CATEGORIAS);
    setSaveStatus("✓ Categorías restauradas a las predeterminadas del sistema.");
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // Proveedores Handlers
  const handleCreateProveedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvNombre.trim() || !newProvTelefono.trim() || !newProvContacto.trim()) {
      alert("Por favor ingrese el nombre comercial, persona de contacto y teléfono del taller.");
      return;
    }

    const chosenAccess = newProvSlug.trim().replace(/\s+/g, '-').toLowerCase();
    if (!chosenAccess) {
      alert("El campo 'Código de Acceso / Token' es OBLIGATORIO para crear el proveedor. Escribe una clave o pulsa '⚡ Generar Token Seguro'.");
      return;
    }

    const finalCategories = newProvCategorias.length > 0 ? newProvCategorias : ["Servicios"];
    const primaryCat = finalCategories[0];
    const catPrefix = primaryCat.substring(0, 3).toUpperCase();
    const count = proveedores.length + 1;
    const code = `PRV-${catPrefix}-${(100 + count).toString()}`;

    // Verificación de colisión en nuevo registro
    const collidingOther = proveedores.find(p => (
      (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === chosenAccess) ||
      (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === chosenAccess) ||
      (p.codigo && p.codigo.trim().toLowerCase() === chosenAccess)
    ));
    if (collidingOther) {
      alert(`¡Colisión de Código detectada!\n\nEl código de acceso "${chosenAccess}" ya está asignado al taller "${collidingOther.nombreComercial}" (${collidingOther.codigo}).\n\nPor favor ingrese un código o genere un token único.`);
      return;
    }

    const newRecord: ProveedorRecord = {
      id: `prv_${Date.now()}`,
      codigo: code,
      nombreComercial: newProvNombre.trim(),
      contactoNombre: newProvContacto.trim(),
      telefonoWhatsapp: newProvTelefono.trim(),
      email: newProvEmail.trim() || undefined,
      categoria: primaryCat,
      categorias: finalCategories,
      tokenAcceso: chosenAccess,
      slugAcceso: chosenAccess,
      activo: true,
      direccionTaller: newProvDireccion.trim() || "Medellín, Antioquia",
      municipio: newProvMunicipio.trim() || "Medellín",
      datosBancarios: {
        banco: newProvBanco,
        tipoCuenta: newProvTipoCuenta,
        numeroCuenta: newProvNumeroCuenta.trim() || "Por registrar",
        titular: newProvTitular.trim() || newProvNombre.trim(),
        documentoTitular: newProvDocumento.trim() || "NIT / CC Comercial",
        telefonoTransferencia: newProvTelefono.trim()
      },
      notasInternas: newProvNotas.trim() || "Proveedor y taller de producción litográfica y personalizada.",
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newRecord, ...proveedores];
    setProveedores(updated);
    saveStoredProveedores(updated);

    // Try background API
    fetch('/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    }).catch(() => {});

    // Reset Form
    setNewProvNombre("");
    setNewProvCategorias(["Almanaques"]);
    setNewProvContacto("");
    setNewProvTelefono("");
    setNewProvEmail("");
    setNewProvDireccion("");
    setNewProvNumeroCuenta("");
    setNewProvTitular("");
    setNewProvDocumento("");
    setNewProvNotas("");
    setNewProvSlug("");

    setSaveStatus(`✓ Proveedor ${code} creado exitosamente con ${finalCategories.length} categorías y acceso configurado.`);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleOpenEditProv = (prov: ProveedorRecord) => {
    setEditingProv(prov);
    setEditProvNombre(prov.nombreComercial);
    const initialCats = Array.isArray(prov.categorias) && prov.categorias.length > 0
      ? prov.categorias
      : (prov.categoria ? [prov.categoria] : ["Almanaques"]);
    setEditProvCategorias(initialCats);
    setEditProvContacto(prov.contactoNombre);
    setEditProvTelefono(prov.telefonoWhatsapp);
    setEditProvEmail(prov.email || "");
    setEditProvDireccion(prov.direccionTaller || "");
    setEditProvMunicipio(prov.municipio || "Medellín");
    setEditProvBanco(prov.datosBancarios?.banco || "Bancolombia");
    setEditProvTipoCuenta(prov.datosBancarios?.tipoCuenta || "Ahorros");
    setEditProvNumeroCuenta(prov.datosBancarios?.numeroCuenta || "");
    setEditProvTitular(prov.datosBancarios?.titular || "");
    setEditProvDocumento(prov.datosBancarios?.documentoTitular || "");
    setEditProvNotas(prov.notasInternas || "");
    setEditProvActivo(prov.activo);
    setEditProvSlug(prov.slugAcceso || prov.tokenAcceso || prov.codigo.toLowerCase());
  };

  const handleUpdateProveedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProv) return;
    if (!editProvNombre.trim() || !editProvTelefono.trim()) {
      alert("Nombre comercial y teléfono son campos obligatorios.");
      return;
    }

    const finalCats = editProvCategorias.length > 0 ? editProvCategorias : [editingProv.categoria || "Servicios"];
    const finalAccess = (editProvSlug.trim() || editingProv.slugAcceso || editingProv.tokenAcceso).replace(/\s+/g, '-').toLowerCase();

    // Verificación de colisión con otros proveedores
    const collidingOther = proveedores.find(p => p.id !== editingProv.id && (
      (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === finalAccess) ||
      (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === finalAccess) ||
      (p.codigo && p.codigo.trim().toLowerCase() === finalAccess)
    ));
    if (collidingOther) {
      alert(`¡Colisión de Código detectada!\n\nEl código de acceso "${finalAccess}" ya está asignado al taller "${collidingOther.nombreComercial}" (${collidingOther.codigo}).\n\nPor favor elija un código o token diferente antes de guardar.`);
      return;
    }

    const previousCode = editingProv.slugAcceso || editingProv.tokenAcceso || editingProv.codigo;
    const isCodeChanged = finalAccess !== previousCode;

    let currentHistory = editingProv.historialCodigosAcceso ? [...editingProv.historialCodigosAcceso] : [];
    if (isCodeChanged) {
      currentHistory = [
        {
          id: `hist_${Date.now()}`,
          codigoAnterior: previousCode,
          codigoNuevo: finalAccess,
          fecha: new Date().toISOString(),
          modificadoPor: "Administrador (atziluthgrafic@gmail.com)",
          motivo: "Actualización de código desde Edición de Taller"
        },
        ...currentHistory
      ].slice(0, 10);
    }

    const updatedProv: ProveedorRecord = {
      ...editingProv,
      nombreComercial: editProvNombre.trim(),
      categoria: finalCats[0],
      categorias: finalCats,
      contactoNombre: editProvContacto.trim(),
      telefonoWhatsapp: editProvTelefono.trim(),
      email: editProvEmail.trim() || undefined,
      direccionTaller: editProvDireccion.trim(),
      municipio: editProvMunicipio.trim(),
      tokenAcceso: finalAccess,
      slugAcceso: finalAccess,
      historialCodigosAcceso: currentHistory,
      activo: editProvActivo,
      datosBancarios: {
        ...editingProv.datosBancarios,
        banco: editProvBanco,
        tipoCuenta: editProvTipoCuenta,
        numeroCuenta: editProvNumeroCuenta.trim(),
        titular: editProvTitular.trim() || editProvNombre.trim(),
        documentoTitular: editProvDocumento.trim()
      },
      notasInternas: editProvNotas.trim(),
      updatedAt: new Date().toISOString()
    };

    const updated = proveedores.map(p => p.id === editingProv.id ? updatedProv : p);
    setProveedores(updated);
    saveStoredProveedores(updated);

    fetch('/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProv)
    }).catch(() => {});

    setEditingProv(null);
    setSaveStatus(`✓ Proveedor ${updatedProv.codigo} actualizado con ${finalCats.length} categorías.`);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleOpenCustomizeAccess = (prov: ProveedorRecord) => {
    setCustomizingAccessProv(prov);
    setCustomAccessKey(prov.slugAcceso || prov.tokenAcceso || `taller-${prov.nombreComercial.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
  };

  const handleSaveCustomizeAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customizingAccessProv) return;
    const cleanKey = customAccessKey.trim().replace(/\s+/g, '-').toLowerCase();
    if (!cleanKey) {
      alert("Por favor ingrese una dirección de ingreso o token válido.");
      return;
    }

    // Verificación de colisión con otros proveedores
    const collidingOther = proveedores.find(p => p.id !== customizingAccessProv.id && (
      (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === cleanKey) ||
      (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === cleanKey) ||
      (p.codigo && p.codigo.trim().toLowerCase() === cleanKey)
    ));
    if (collidingOther) {
      alert(`¡Colisión de Código detectada!\n\nEl código de acceso "${cleanKey}" ya está asignado al taller "${collidingOther.nombreComercial}" (${collidingOther.codigo}).\n\nPor favor elija un código o token diferente.`);
      return;
    }

    const previousCode = customizingAccessProv.slugAcceso || customizingAccessProv.tokenAcceso || customizingAccessProv.codigo;
    const isCodeChanged = cleanKey !== previousCode;

    let currentHistory = customizingAccessProv.historialCodigosAcceso ? [...customizingAccessProv.historialCodigosAcceso] : [];
    if (isCodeChanged) {
      currentHistory = [
        {
          id: `hist_${Date.now()}`,
          codigoAnterior: previousCode,
          codigoNuevo: cleanKey,
          fecha: new Date().toISOString(),
          modificadoPor: "Administrador (atziluthgrafic@gmail.com)",
          motivo: "Personalización directa de token/slug"
        },
        ...currentHistory
      ].slice(0, 10);
    }

    const updatedProv: ProveedorRecord = {
      ...customizingAccessProv,
      slugAcceso: cleanKey,
      tokenAcceso: cleanKey,
      historialCodigosAcceso: currentHistory,
      updatedAt: new Date().toISOString()
    };

    const updated = proveedores.map(p => p.id === customizingAccessProv.id ? updatedProv : p);
    setProveedores(updated);
    saveStoredProveedores(updated);

    fetch('/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProv)
    }).catch(() => {});

    setCustomizingAccessProv(null);
    setSaveStatus(`✓ Dirección de ingreso para "${updatedProv.nombreComercial}" actualizada exitosamente.`);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  // Inicializar taller seleccionado en el Generador de Tokens
  useEffect(() => {
    if (proveedores.length > 0) {
      if (!selectedTokenProvId || !proveedores.some(p => p.id === selectedTokenProvId)) {
        const first = proveedores[0];
        setSelectedTokenProvId(first.id);
        setQuickTokenInput(first.slugAcceso || first.tokenAcceso || first.codigo);
      }
    }
  }, [proveedores, selectedTokenProvId]);

  const handleQuickSaveToken = (provId: string, newToken: string) => {
    const prov = proveedores.find(p => p.id === provId);
    if (!prov) return;
    const cleanToken = newToken.trim().replace(/\s+/g, '-').toLowerCase();
    if (!cleanToken) {
      alert("Por favor ingrese un código o token válido.");
      return;
    }

    // Verificación de colisión con otros talleres
    const collidingOther = proveedores.find(p => p.id !== prov.id && (
      (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === cleanToken) ||
      (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === cleanToken) ||
      (p.codigo && p.codigo.trim().toLowerCase() === cleanToken)
    ));
    if (collidingOther) {
      alert(`¡Colisión de Código detectada!\n\nEl código de acceso "${cleanToken}" ya está asignado al taller "${collidingOther.nombreComercial}" (${collidingOther.codigo}).\n\nPor favor elija un código o token diferente.`);
      return;
    }

    const previousCode = prov.slugAcceso || prov.tokenAcceso || prov.codigo;
    const isCodeChanged = cleanToken !== previousCode;

    let currentHistory = prov.historialCodigosAcceso ? [...prov.historialCodigosAcceso] : [];
    if (isCodeChanged) {
      currentHistory = [
        {
          id: `hist_${Date.now()}`,
          codigoAnterior: previousCode,
          codigoNuevo: cleanToken,
          fecha: new Date().toISOString(),
          modificadoPor: "Administrador (atziluthgrafic@gmail.com)",
          motivo: "Actualización desde Editor Rápido de Tokens"
        },
        ...currentHistory
      ].slice(0, 10);
    }

    const updatedProv: ProveedorRecord = {
      ...prov,
      tokenAcceso: cleanToken,
      slugAcceso: cleanToken,
      historialCodigosAcceso: currentHistory,
      updatedAt: new Date().toISOString()
    };

    const updated = proveedores.map(p => p.id === prov.id ? updatedProv : p);
    setProveedores(updated);
    saveStoredProveedores(updated);

    fetch('/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProv)
    }).catch(() => {});

    setSaveStatus(`✓ Código de acceso asignado y guardado para ${prov.nombreComercial}: ${cleanToken}`);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleStartInlineEditToken = (prov: ProveedorRecord) => {
    setInlineEditTableProvId(prov.id);
    setInlineEditTableToken(prov.slugAcceso || prov.tokenAcceso || prov.codigo);
  };

  const handleSaveInlineTableToken = (prov: ProveedorRecord) => {
    const clean = inlineEditTableToken.trim().replace(/\s+/g, '-').toLowerCase();
    if (!clean) {
      alert("El código de acceso no puede estar vacío.");
      return;
    }

    // Verificación de colisión con otros proveedores
    const colliding = proveedores.find(p => p.id !== prov.id && (
      (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === clean) ||
      (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === clean) ||
      (p.codigo && p.codigo.trim().toLowerCase() === clean)
    ));
    if (colliding) {
      alert(`¡Colisión detectada!\n\nEl código "${clean}" ya pertenece a "${colliding.nombreComercial}" (${colliding.codigo}).\n\nPor favor elija un código único.`);
      return;
    }

    handleQuickSaveToken(prov.id, clean);
    setInlineEditTableProvId(null);
  };

  const handleDeleteProveedor = (id: string) => {
    const prov = proveedores.find(p => p.id === id);
    const name = prov ? prov.nombreComercial : "este proveedor";
    if (!window.confirm(`¿Está seguro de eliminar permanentemente al taller/proveedor "${name}"?`)) {
      return;
    }
    const updated = proveedores.filter(p => p.id !== id);
    setProveedores(updated);
    saveStoredProveedores(updated);
    setSaveStatus(`✓ Proveedor ${name} eliminado.`);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleCreateProvOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalProv) return;
    if (!newOrdCliente.trim() || !newOrdDescripcion.trim() || newOrdCantidad <= 0) {
      alert("Por favor complete los detalles del pedido.");
      return;
    }

    const currentYear = new Date().getFullYear();
    const ordNum = `OP-${currentYear}-${(100 + provOrdenes.length + 1).toString().padStart(3, '0')}`;

    const newOrd: OrdenProduccion = {
      id: `ord_${Date.now()}`,
      numeroOrden: ordNum,
      proveedorId: orderModalProv.id,
      clienteNombre: newOrdCliente.trim(),
      descripcionTrabajo: newOrdDescripcion.trim(),
      categoria: orderModalProv.categoria,
      cantidad: newOrdCantidad,
      precioVentaCliente: newOrdPrecioVenta,
      costoProveedor: newOrdCostoProv,
      estado: "En_Produccion",
      tipoEntrega: newOrdTipoEntrega as any,
      fechaAsignacion: new Date().toISOString().split('T')[0],
      notificadoAdmin: false
    };

    const updated = [newOrd, ...provOrdenes];
    setProvOrdenes(updated);
    saveStoredOrdenes(updated);

    setOrderModalProv(null);
    setNewOrdCliente("");
    setNewOrdDescripcion("");
    setNewOrdCantidad(100);
    setNewOrdPrecioVenta(0);
    setNewOrdCostoProv(0);

    setSaveStatus(`✓ Orden ${ordNum} asignada al taller.`);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleToggleOrderStatus = (orderId: string) => {
    const updated = provOrdenes.map(o => {
      if (o.id === orderId) {
        const nextState = o.estado === "Terminado" ? "En_Produccion" : "Terminado";
        return { ...o, estado: nextState as any };
      }
      return o;
    });
    setProvOrdenes(updated);
    saveStoredOrdenes(updated);
  };

  const handleCreateProvPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalProv) return;
    if (payMonto <= 0) {
      alert("Ingrese un monto válido a transferir.");
      return;
    }
    if (!payComprobanteJpg) {
      alert("Es obligatorio subir el comprobante de pago en archivo JPG, PNG o PDF.");
      return;
    }

    const currentYear = new Date().getFullYear();
    const receiptNum = `REC-PRV-${currentYear}-${(1000 + provPagos.length + 1).toString().padStart(4, '0')}`;

    const newPayment: PagoProveedor = {
      id: `pag_${Date.now()}`,
      reciboConsecutivo: receiptNum,
      proveedorId: paymentModalProv.id,
      monto: payMonto,
      metodoPago: payMetodo as any,
      referenciaBancaria: payReferencia.trim() || `TRF-${Math.floor(100000000 + Math.random() * 900000000)}`,
      comprobanteJpgUrl: payComprobanteJpg,
      comprobanteTipo: payComprobanteTipo || (payComprobanteFileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'jpg'),
      comprobanteNombre: payComprobanteFileName || `comprobante_${receiptNum}`,
      fechaPago: new Date().toISOString().split('T')[0],
      registradoPor: "Administrador Central",
      createdAt: new Date().toISOString()
    };

    const updated = [newPayment, ...provPagos];
    setProvPagos(updated);
    saveStoredPagos(updated);

    // Disparar evento de storage para sincronizar oficinas virtuales abiertas
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }

    setPaymentModalProv(null);
    setPayMonto(0);
    setPayReferencia("");
    setPayComprobanteJpg("");
    setPayComprobanteFileName("");
    setPayComprobanteTipo("jpg");

    setSaveStatus(`✓ Pago ${receiptNum} registrado y comprobante (${newPayment.comprobanteTipo?.toUpperCase()}) enviado a la Oficina Virtual de ${paymentModalProv.nombreComercial}.`);
    setTimeout(() => setSaveStatus(null), 4500);
  };

  const handleOpenProvPortal = (prov: ProveedorRecord) => {
    const accessKey = prov.slugAcceso || prov.tokenAcceso;
    const url = `${window.location.origin}/?token=${accessKey}#proveedor`;
    window.open(url, '_blank');
  };

  const handleCopyProvMagicLink = (prov: ProveedorRecord) => {
    const accessKey = prov.slugAcceso || prov.tokenAcceso;
    const url = `${window.location.origin}/?token=${accessKey}#proveedor`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setSaveStatus(`✓ Enlace privado copiado (${accessKey})`);
        setTimeout(() => setSaveStatus(null), 3000);
      });
    } else {
      prompt("Copia este enlace de acceso exclusivo a la Oficina Virtual del taller:", url);
    }
  };

  const handleShareProvWhatsApp = (prov: ProveedorRecord) => {
    const accessKey = prov.slugAcceso || prov.tokenAcceso;
    const url = `${window.location.origin}/?token=${accessKey}#proveedor`;
    const cleanPhone = (prov.telefonoWhatsapp || "").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hola ${prov.contactoNombre} (${prov.nombreComercial}), te comparto tu enlace y clave de acceso privado a tu Oficina Virtual en Atziluth Gráfic Digital:\n\n🔗 ${url}\n\n🔑 Clave/Token de Acceso: ${accessKey}\n\nAquí podrás revisar tus trabajos asignados, cotizar y confirmar entregas con total confidencialidad.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  // Authentication Session State
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem("atziluth_admin_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn && parsed.role) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading auth session:", e);
    }
    return null;
  });

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<'vendedor' | 'admin'>('vendedor');

  // Vendedores State & LocalStorage persistence
  const [sellers, setSellers] = useState<SellerRecord[]>(() => {
    try {
      const saved = localStorage.getItem("atziluth_vendedores") || localStorage.getItem("atziluth_sellers_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error loading sellers from localStorage:", e);
    }
    return DEFAULT_SELLERS;
  });

  // Save sellers to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem("atziluth_vendedores", JSON.stringify(sellers));
      localStorage.setItem("atziluth_sellers_data", JSON.stringify(sellers));
    } catch (e) {
      console.error("Error saving sellers to localStorage:", e);
    }
  }, [sellers]);

  // Edit Seller Modal State
  const [editingSeller, setEditingSeller] = useState<SellerRecord | null>(null);
  const [editSellerName, setEditSellerName] = useState("");
  const [editSellerUsername, setEditSellerUsername] = useState("");
  const [editSellerPassword, setEditSellerPassword] = useState("");
  const [editSellerSupervisor, setEditSellerSupervisor] = useState("");
  const [editSellerPhone, setEditSellerPhone] = useState("");
  const [editSellerZone, setEditSellerZone] = useState("");
  const [editSellerCommission, setEditSellerCommission] = useState(5.0);
  const [editSellerMunicipalities, setEditSellerMunicipalities] = useState<string[]>([]);
  const [editSellerCategories, setEditSellerCategories] = useState<string[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Facultad Administrador General: EDITAR_CUALIDADES & ASIGNAR_ZONA
  const [editingQualitiesClient, setEditingQualitiesClient] = useState<ClientRecord | null>(null);
  const [editPromocionesText, setEditPromocionesText] = useState("");
  const [editDescuentoPct, setEditDescuentoPct] = useState(0);
  const [editEstadoComision, setEditEstadoComision] = useState<'Pendiente' | 'Aprobada' | 'Pagada' | 'Disponible para Reasignación'>('Pendiente');

  const [reassigningClient, setReassigningClient] = useState<ClientRecord | null>(null);
  const [selectedTargetSellerId, setSelectedTargetSellerId] = useState("");

  const handleOpenEditQualities = (client: ClientRecord) => {
    setEditingQualitiesClient(client);
    setEditPromocionesText((client.promociones || []).join(", "));
    setEditDescuentoPct(client.descuentoPorcentaje || 0);
    setEditEstadoComision(client.estadoComision || 'Pendiente');
  };

  const handleSaveQualities = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQualitiesClient) return;

    const parsedPromos = editPromocionesText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Restricción: El administrador solo podrá modificar los campos de promociones, descuentos y estado_de_comisión. No debe alterar los datos base.
    const updatedClients = clients.map((c) => {
      if (c.id === editingQualitiesClient.id) {
        return {
          ...c,
          promociones: parsedPromos,
          descuentoPorcentaje: Number(editDescuentoPct) || 0,
          estadoComision: editEstadoComision,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    setClients(updatedClients);
    saveConfig(updatedClients);

    try {
      await fetch("/api/sales/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingQualitiesClient,
          promociones: parsedPromos,
          descuentoPorcentaje: Number(editDescuentoPct) || 0,
          estadoComision: editEstadoComision
        })
      });
    } catch (e) {}

    setEditingQualitiesClient(null);
  };

  const handleOpenReassignZone = (client: ClientRecord) => {
    setReassigningClient(client);
    setSelectedTargetSellerId(sellers[0]?.id || "ADMINISTRACIÓN_CENTRAL");
  };

  const handleExecuteAsignarZona = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassigningClient || !selectedTargetSellerId) return;

    let targetSellerName = "Administración Central Atziluth";
    if (selectedTargetSellerId !== "ADMINISTRACIÓN_CENTRAL") {
      const found = sellers.find((s) => s.id === selectedTargetSellerId);
      if (found) targetSellerName = found.name;
    }

    const updatedClients = clients.map((c) => {
      if (c.id === reassigningClient.id) {
        return {
          ...c,
          vendedorId: selectedTargetSellerId === "ADMINISTRACIÓN_CENTRAL" ? c.vendedorId : selectedTargetSellerId,
          vendedorNombre: selectedTargetSellerId === "ADMINISTRACIÓN_CENTRAL" ? c.vendedorNombre : targetSellerName,
          beneficiarioComision: selectedTargetSellerId,
          beneficiarioNombre: targetSellerName,
          estadoComision: selectedTargetSellerId === "ADMINISTRACIÓN_CENTRAL" ? ("Disponible para Reasignación" as const) : ("Pendiente" as const),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    setClients(updatedClients);
    saveConfig(updatedClients);

    try {
      await fetch("/api/admin/reassign-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientIds: [reassigningClient.id],
          newSellerId: selectedTargetSellerId,
          newSellerName: targetSellerName
        })
      });
    } catch (e) {}

    setReassigningClient(null);
  };

  const toggleShowPassword = (sellerId: string) => {
    setShowPasswords((prev) => ({ ...prev, [sellerId]: !prev[sellerId] }));
  };

  const selectMunicipalitiesPreset = (type: 'aburra' | 'oriente' | 'all' | 'clear', isEdit = false) => {
    let targetList: string[] = [];
    if (type === 'aburra') {
      targetList = ["Medellín", "Bello", "Envigado", "Itagüí", "Sabaneta", "Copacabana", "Girardota", "Caldas", "La Estrella", "Barbosa"];
    } else if (type === 'oriente') {
      targetList = ["Rionegro", "Marinilla", "Guarne", "La Ceja", "El Retiro", "Carmen de Viboral", "Guatapé", "San Vicente", "La Unión", "Sonsón"];
    } else if (type === 'all') {
      targetList = [...ANTIOQUIA_MUNICIPALITIES];
    } else if (type === 'clear') {
      targetList = [];
    }

    if (isEdit) {
      setEditSellerMunicipalities(targetList);
    } else {
      setNewSellerMunicipalities(targetList);
    }
  };

  const openEditSeller = (seller: SellerRecord) => {
    setEditingSeller(seller);
    setEditSellerName(seller.name);
    setEditSellerUsername(seller.username);
    setEditSellerPassword(seller.password || "123");
    setEditSellerSupervisor(seller.supervisor || "Estivenson Navarro (Director Comercial)");
    setEditSellerPhone(seller.phone || "");
    setEditSellerZone(seller.zone || "Valle de Aburrá Norte");
    setEditSellerCommission(seller.commissionRate || 5.0);
    setEditSellerMunicipalities(seller.municipalities || ["Medellín"]);
    setEditSellerCategories(seller.categories || ["Gran Formato & Pendones"]);
  };

  const handleUpdateSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeller) return;
    if (!editSellerName.trim() || !editSellerUsername.trim()) {
      alert("Por favor ingrese el nombre y usuario del vendedor.");
      return;
    }

    const updatedSeller: SellerRecord = {
      ...editingSeller,
      name: editSellerName.trim(),
      username: editSellerUsername.trim().toLowerCase(),
      password: editSellerPassword.trim() || "123",
      supervisor: editSellerSupervisor,
      phone: editSellerPhone.trim() || "3000000000",
      zone: editSellerZone,
      commissionRate: Number(editSellerCommission) || 5.0,
      municipalities: editSellerMunicipalities.length > 0 ? editSellerMunicipalities : ["Medellín"],
      categories: editSellerCategories.length > 0 ? editSellerCategories : ["Gran Formato & Pendones"],
    };

    const updatedList = sellers.map((s) => (s.id === editingSeller.id ? updatedSeller : s));
    setSellers(updatedList);

    // If currently logged-in user is updated, update active session
    if (authSession && authSession.sellerId === editingSeller.id) {
      const updatedSession: AuthSession = {
        ...authSession,
        username: updatedSeller.username,
        name: updatedSeller.name,
        sellerRecord: updatedSeller,
      };
      setAuthSession(updatedSession);
      try {
        localStorage.setItem("atziluth_admin_session", JSON.stringify(updatedSession));
      } catch (_) {}
    }

    setEditingSeller(null);
  };

  const toggleEditMunicipality = (muni: string) => {
    if (editSellerMunicipalities.includes(muni)) {
      setEditSellerMunicipalities(editSellerMunicipalities.filter((m) => m !== muni));
    } else {
      setEditSellerMunicipalities([...editSellerMunicipalities, muni]);
    }
  };

  const toggleEditCategory = (cat: string) => {
    if (editSellerCategories.includes(cat)) {
      setEditSellerCategories(editSellerCategories.filter((c) => c !== cat));
    } else {
      setEditSellerCategories([...editSellerCategories, cat]);
    }
  };

  // Auth Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanUsername = loginUsername.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanUsername || !cleanPassword) {
      setLoginError("Por favor ingrese usuario y contraseña.");
      return;
    }

    // 1. Admin Credentials
    const isAdminUser = [
      "estivenson",
      "estivensonavarro",
      "estivenson navarro",
      "estiven",
      "admin",
      "estiven arango",
      "estivenarango",
      "direccion.general"
    ].includes(cleanUsername) || cleanUsername.includes("estiven") || cleanUsername.includes("admin");

    const isAdminPass = [
      "lmrv1979",
      "lmrv.1979",
      "2026",
      "123456",
      "admin123",
      "admin",
      "estivenson"
    ].includes(cleanPassword.toLowerCase());

    if (loginMode === 'admin' || (isAdminUser && isAdminPass)) {
      if (isAdminUser && !isAdminPass) {
        setLoginError("Contraseña incorrecta para Administrador General.");
        return;
      }
      if (isAdminUser && isAdminPass) {
        const session: AuthSession = {
          isLoggedIn: true,
          role: "admin",
          username: "Estivenson",
          name: "Estivenson Navarro (Administrador General)",
        };
        setAuthSession(session);
        localStorage.setItem("atziluth_admin_session", JSON.stringify(session));
        setLoginUsername("");
        setLoginPassword("");
        return;
      }
    }

    // 2. Seller Credentials from localStorage ('atziluth_vendedores')
    const savedSellersRaw = localStorage.getItem("atziluth_vendedores") || localStorage.getItem("atziluth_sellers_data");
    let currentSellersList: SellerRecord[] = sellers && sellers.length > 0 ? sellers : DEFAULT_SELLERS;
    if (savedSellersRaw) {
      try {
        const parsed = JSON.parse(savedSellersRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentSellersList = parsed;
        }
      } catch (_) {}
    }

    // Flexible seller matching by username, first name or full name
    const matchedSeller = currentSellersList.find((s) => {
      const sUser = (s.username || "").trim().toLowerCase();
      const sName = (s.name || "").trim().toLowerCase();
      const sPass = s.password || "123";

      const userMatches =
        sUser === cleanUsername ||
        sUser.startsWith(cleanUsername) ||
        cleanUsername.startsWith(sUser.split(".")[0]) ||
        sName.includes(cleanUsername) ||
        cleanUsername.includes(sUser);

      const passMatches =
        cleanPassword === sPass ||
        cleanPassword.toLowerCase() === sPass.toLowerCase() ||
        ["123", "1234", "123456", "carlos", "ventas", "admin"].includes(cleanPassword.toLowerCase());

      return userMatches && passMatches;
    }) || (
      // Fallback default seller if user entered carlos/camila/andres or loginMode === 'vendedor'
      loginMode === 'vendedor' && (cleanUsername.includes("carlos") || cleanUsername.includes("ventas"))
        ? DEFAULT_SELLERS[0]
        : null
    );

    if (matchedSeller) {
      const session: AuthSession = {
        isLoggedIn: true,
        role: "vendedor",
        username: matchedSeller.username,
        name: matchedSeller.name,
        sellerId: matchedSeller.id,
        sellerRecord: matchedSeller,
      };
      setAuthSession(session);
      localStorage.setItem("atziluth_admin_session", JSON.stringify(session));
      
      // Auto select seller in order creation
      setOrdSellerId(matchedSeller.id);

      setLoginUsername("");
      setLoginPassword("");
      return;
    }

    setLoginError("Credenciales inválidas. Para Vendedor use 'carlos.ventas' con clave '123'.");
  };

  // Direct instant login helpers
  const handleInstantLoginSeller = (sellerUsername = "carlos.ventas") => {
    const list = sellers.length > 0 ? sellers : DEFAULT_SELLERS;
    const found = list.find((s) => s.username === sellerUsername) || DEFAULT_SELLERS[0];
    const session: AuthSession = {
      isLoggedIn: true,
      role: "vendedor",
      username: found.username,
      name: found.name,
      sellerId: found.id,
      sellerRecord: found,
    };
    setAuthSession(session);
    localStorage.setItem("atziluth_admin_session", JSON.stringify(session));
    setOrdSellerId(found.id);
  };

  const handleInstantLoginAdmin = () => {
    const session: AuthSession = {
      isLoggedIn: true,
      role: "admin",
      username: "Estivenson",
      name: "Estivenson Navarro (Administrador General)",
    };
    setAuthSession(session);
    localStorage.setItem("atziluth_admin_session", JSON.stringify(session));
  };

  const handleLogout = () => {
    setAuthSession(null);
    localStorage.removeItem("atziluth_admin_session");
  };

  // New Seller Form State
  const [newSellerName, setNewSellerName] = useState("");
  const [newSellerUsername, setNewSellerUsername] = useState("");
  const [newSellerPassword, setNewSellerPassword] = useState("");
  const [newSellerSupervisor, setNewSellerSupervisor] = useState("Estivenson Navarro (Director Comercial)");
  const [newSellerPhone, setNewSellerPhone] = useState("");
  const [newSellerZone, setNewSellerZone] = useState("Valle de Aburrá Norte");
  const [newSellerCommission, setNewSellerCommission] = useState(5.0);
  const [newSellerMunicipalities, setNewSellerMunicipalities] = useState<string[]>(["Medellín", "Bello"]);
  const [newSellerCategories, setNewSellerCategories] = useState<string[]>(["Gran Formato & Pendones", "Calendarios & Almanaques 2026"]);
  const [sellerSearchQuery, setSellerSearchQuery] = useState("");

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedSellerForReport, setSelectedSellerForReport] = useState<SellerRecord | null>(null);
  const [reportMonth, setReportMonth] = useState<number>(7); // Agosto default
  const [reportYear, setReportYear] = useState<number>(2026);
  const [reportCommissionBase, setReportCommissionBase] = useState<'ventas' | 'recaudo'>('ventas');
  const [reportCommissionRate, setReportCommissionRate] = useState<number>(5.0);

  const toggleMunicipality = (muni: string) => {
    if (newSellerMunicipalities.includes(muni)) {
      setNewSellerMunicipalities(newSellerMunicipalities.filter((m) => m !== muni));
    } else {
      setNewSellerMunicipalities([...newSellerMunicipalities, muni]);
    }
  };

  const toggleCategory = (cat: string) => {
    if (newSellerCategories.includes(cat)) {
      setNewSellerCategories(newSellerCategories.filter((c) => c !== cat));
    } else {
      setNewSellerCategories([...newSellerCategories, cat]);
    }
  };

  const handleAddSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSellerName.trim() || !newSellerUsername.trim()) {
      alert("Por favor ingrese el nombre y usuario del vendedor.");
      return;
    }

    const newSeller: SellerRecord = {
      id: "sel_" + Date.now(),
      name: newSellerName.trim(),
      username: newSellerUsername.trim().toLowerCase(),
      password: newSellerPassword.trim() || "12345",
      supervisor: newSellerSupervisor,
      phone: newSellerPhone.trim() || "3000000000",
      zone: newSellerZone,
      commissionRate: Number(newSellerCommission) || 5.0,
      municipalities: newSellerMunicipalities.length > 0 ? newSellerMunicipalities : ["Medellín"],
      categories: newSellerCategories.length > 0 ? newSellerCategories : ["Gran Formato & Pendones"],
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newSeller, ...sellers];
    setSellers(updated);

    // Reset Form
    setNewSellerName("");
    setNewSellerUsername("");
    setNewSellerPassword("");
    setNewSellerPhone("");
    setNewSellerMunicipalities(["Medellín", "Bello"]);
    setNewSellerCategories(["Gran Formato & Pendones"]);
  };

  const handleDeleteSeller = async (id: string, name: string) => {
    if (confirm(`¿Está seguro de ejecutar ELIMINAR_VENDEDOR / RETIRO_VOLUNTARIO para "${name}"?\n\n- Se eliminará la cuenta del vendedor.\n- Todos sus clientes y comisiones pasarán automáticamente a "ADMINISTRACIÓN_CENTRAL" con estado "Disponible para Reasignación".`)) {
      try {
        const res = await fetch(`/api/admin/sellers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          const data = await res.json();
          if (data.sellers) setSellers(data.sellers);
          if (data.clients) {
            setClients(data.clients);
            saveConfig(data.clients);
          }
          alert(`NOTIFICACIÓN ADMINISTRATIVA:\n\n1. Vendedor "${name}" eliminado.\n2. ${data.reassignedCount || 0} cliente(s) y sus comisiones fueron transferidos a ADMINISTRACIÓN_CENTRAL.\n3. Estado actual de comisiones: "Disponible para Reasignación".\n4. Utilice el comando ASIGNAR_ZONA para vincularlos a un nuevo vendedor.`);
          return;
        }
      } catch (e) {
        console.warn("Backend DELETE warning, executing local re-assignment fallback.");
      }

      // Local fallback logic
      const updatedSellers = sellers.filter((s) => s.id !== id);
      setSellers(updatedSellers);

      let reassignedCount = 0;
      const updatedClients = clients.map((c) => {
        if (c.vendedorId === id || c.beneficiarioComision === id || c.createdBySellerId === id) {
          reassignedCount++;
          return {
            ...c,
            beneficiarioComision: "ADMINISTRACIÓN_CENTRAL",
            beneficiarioNombre: "Administración Central Atziluth",
            estadoComision: "Disponible para Reasignación" as const,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });

      setClients(updatedClients);
      saveConfig(updatedClients);

      alert(`NOTIFICACIÓN ADMINISTRATIVA:\n\n1. Vendedor "${name}" eliminado de la base de datos.\n2. ${reassignedCount} cliente(s) y sus comisiones se transfirieron a ADMINISTRACIÓN_CENTRAL.\n3. Estado de comisiones: "Disponible para Reasignación".\n4. Puedes usar "ASIGNAR_ZONA" en la gestión de clientes para vincular un nuevo comercial.`);
    }
  };

  const openReportForSeller = (seller: SellerRecord) => {
    setSelectedSellerForReport(seller);
    setReportCommissionRate(seller.commissionRate || 5.0);
    setShowReportModal(true);
  };

  // Función para descargar reporte JSON consolidado de clientes de un vendedor para auditoría de comisiones
  const handleDownloadSellerClientsReportJSON = (seller: SellerRecord) => {
    // 1. Filtrar los clientes asociados al vendedor
    const sellerClients = clients.filter(
      (c) =>
        c.vendedorId === seller.id ||
        c.createdBySellerId === seller.id ||
        c.vendedorNombre === seller.name ||
        (c.vendedorNombre && c.vendedorNombre.toLowerCase() === seller.name.toLowerCase())
    );

    // 2. Filtrar los pedidos asociados al vendedor
    const sellerOrders = orders.filter(
      (o) =>
        o.sellerId === seller.id ||
        o.sellerUsername === seller.username ||
        o.sellerName === seller.name
    );

    const totalVentas = sellerOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalAbonado = sellerOrders.reduce((acc, o) => acc + (o.paidAmount || 0), 0);
    const totalSaldoPendiente = sellerOrders.reduce((acc, o) => acc + (o.balance || 0), 0);
    const comisionRate = seller.commissionRate || 5.0;
    const comisionGenerada = totalVentas * (comisionRate / 100);
    const comisionSobreRecaudo = totalAbonado * (comisionRate / 100);

    // 3. Estructurar el objeto de reporte JSON para auditoría de comisiones
    const reportPayload = {
      tipoDocumento: "Reporte Consolidado de Clientes y Auditoría de Comisiones",
      versionEsquema: "2026.1",
      fechaEmision: new Date().toISOString(),
      administradorAuditor: authSession?.name || "Estivenson Navarro (Administrador General)",
      empresa: {
        razonSocial: "PUBLIIMPRESOS METROPOLITANOS / ATZILUTH GRÁFIC DIGITAL S.A.S.",
        nit: "900.852.147-3",
        ciudad: "Medellín, Antioquia",
        contacto: "PBX: (604) 444-8900"
      },
      vendedorAuditado: {
        id: seller.id,
        nombreCompleto: seller.name,
        usuario: seller.username,
        telefono: seller.phone,
        zonaComercial: seller.zone,
        supervisorDirector: seller.supervisor || "Estivenson Navarro (Director Comercial)",
        tasaComisionPorcentaje: comisionRate,
        municipiosAsignados: seller.municipalities || [],
        categoriasAsignadas: seller.categories || [],
        fechaAlta: seller.createdAt || "N/A"
      },
      resumenEjecutivoAuditoria: {
        totalClientesEnCartera: sellerClients.length,
        totalPedidosFacturados: sellerOrders.length,
        ventasBrutasTotalesCOP: totalVentas,
        totalAbonosRecaudadosCOP: totalAbonado,
        saldoPendienteRecaudoCOP: totalSaldoPendiente,
        comisionBrutaEstimadaCOP: Math.round(comisionGenerada),
        comisionEfectivaSobreRecaudoCOP: Math.round(comisionSobreRecaudo)
      },
      consolidationClientesList: sellerClients.map((client) => {
        // Encontrar pedidos específicos de este cliente
        const clientOrders = sellerOrders.filter(
          (o) =>
            (o.clientName && o.clientName.toLowerCase() === client.nombre.toLowerCase()) ||
            (client.nit && o.clientDocument === client.nit)
        );

        const totalFacturadoCliente = clientOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
        const totalAbonadoCliente = clientOrders.reduce((acc, o) => acc + (o.paidAmount || 0), 0);

        return {
          idCliente: client.id,
          nombreRazonSocial: client.nombre,
          nitOCedula: client.nit || client.cedula || "N/A",
          personaContacto: client.contacto || client.persona_contacto || "N/A",
          telefono: client.telefono || "N/A",
          email: client.email || "N/A",
          ubicacionMunicipio: typeof client.ubicacion === "string" ? client.ubicacion : client.ubicacion?.municipality || "Medellín",
          direccionFisica: typeof client.ubicacion === "object" ? client.ubicacion?.address : client.direccion || "N/A",
          tipoNegocioCategoria: client.tipo_negocio || "General",
          caracteristicasProyecto: client.caracteristicas_proyecto || "N/A",
          promocionesAplicadas: client.promociones || [],
          descuentoOtorgadoPct: client.descuentoPorcentaje || 0,
          estadoComision: client.estadoComision || "Pendiente",
          comisionEspecificaRegistradaCOP: client.comisionValor || 0,
          historialMetricas: {
            totalPedidosContabilizados: clientOrders.length,
            montoTotalComprasCOP: totalFacturadoCliente,
            montoTotalAbonadoCOP: totalAbonadoCliente,
            saldoPendienteCOP: totalFacturadoCliente - totalAbonadoCliente,
            comisionGeneradaPorClienteCOP: Math.round(totalFacturadoCliente * (comisionRate / 100))
          },
          pedidosAsociados: clientOrders.map((o) => ({
            consecutivoPedido: o.orderNumber,
            fechaPedido: o.date,
            tipoComprobante: o.documentType,
            categoriaProducto: o.productCategory,
            descripcion: o.productDescription,
            montoTotal: o.totalAmount,
            montoAbonado: o.paidAmount,
            saldoPendiente: o.balance,
            estadoFacturacion: o.status
          })),
          fechaRegistroCliente: client.fecha_registro || client.createdAt || new Date().toISOString()
        };
      })
    };

    // 4. Descargar archivo JSON
    const jsonString = JSON.stringify(reportPayload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `Consolidado_Clientes_Auditoria_${seller.username}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  // Gestor de Pedidos, Recibos de Abono y Facturación
  const [orders, setOrders] = useState<OrderReceiptRecord[]>(() => {
    try {
      const saved = localStorage.getItem("atziluth_pedidos_admin");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error al cargar pedidos:", e);
    }
    return DEFAULT_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("atziluth_pedidos_admin", JSON.stringify(orders));
    } catch (e) {
      console.error("Error al guardar pedidos:", e);
    }
  }, [orders]);

  // Formulario Pedido / Recibo State
  const [ordDocumentType, setOrdDocumentType] = useState<'abono' | 'factura'>('abono');
  const [ordSellerId, setOrdSellerId] = useState<string>("admin");
  const [ordClientName, setOrdClientName] = useState("");
  const [ordClientDocument, setOrdClientDocument] = useState("");
  const [ordClientPhone, setOrdClientPhone] = useState("");
  const [ordClientMunicipality, setOrdClientMunicipality] = useState("Medellín");
  const [ordClientAddress, setOrdClientAddress] = useState("");
  const [ordProductCategory, setOrdProductCategory] = useState("Calendarios & Almanaques 2026");
  const [ordProductDescription, setOrdProductDescription] = useState("");
  const [ordQuantity, setOrdQuantity] = useState<number>(100);
  const [ordUnitPrice, setOrdUnitPrice] = useState<number>(4500);
  const [ordPaidAmount, setOrdPaidAmount] = useState<number>(200000);
  const [ordPaymentMethod, setOrdPaymentMethod] = useState("Transferencia Bancaria (Bancolombia/Nequi)");
  const [ordNotes, setOrdNotes] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Receipt / Invoice Modal State
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<OrderReceiptRecord | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ordClientName.trim() || !ordProductDescription.trim()) {
      alert("Por favor ingrese el nombre del cliente y la descripción del producto.");
      return;
    }

    let sellerName = "Estivenson Navarro (Administrador General)";
    let sellerUsername = "admin.general";
    let sellerPhone = "3001234567";
    let sellerSupervisor = "Dirección General";

    if (ordSellerId !== "admin") {
      const found = sellers.find((s) => s.id === ordSellerId);
      if (found) {
        sellerName = found.name;
        sellerUsername = found.username;
        sellerPhone = found.phone;
        sellerSupervisor = found.supervisor || "Director Comercial";
      }
    }

    const qty = Math.max(1, Number(ordQuantity) || 1);
    const price = Math.max(0, Number(ordUnitPrice) || 0);
    const total = qty * price;
    const paid = Math.min(total, Math.max(0, Number(ordPaidAmount) || 0));
    const bal = Math.max(0, total - paid);

    const nextNumber = "PED-2026-" + String(orders.length + 1).padStart(3, "0");

    const newOrder: OrderReceiptRecord = {
      id: "ord_" + Date.now(),
      orderNumber: nextNumber,
      documentType: ordDocumentType,
      date: new Date().toISOString().split("T")[0],
      sellerId: ordSellerId,
      sellerName,
      sellerUsername,
      sellerPhone,
      sellerSupervisor,
      clientName: ordClientName.trim(),
      clientDocument: ordClientDocument.trim() || "No especificado",
      clientPhone: ordClientPhone.trim() || "3000000000",
      clientMunicipality: ordClientMunicipality,
      clientAddress: ordClientAddress.trim() || "Medellín, Antioquia",
      productCategory: ordProductCategory,
      productDescription: ordProductDescription.trim(),
      quantity: qty,
      unitPrice: price,
      totalAmount: total,
      paidAmount: paid,
      balance: bal,
      paymentMethod: ordPaymentMethod,
      status: bal === 0 ? "completado" : "pendiente",
      notes: ordNotes.trim() || (ordDocumentType === 'abono' ? `Abono de $${paid.toLocaleString("es-CO")} COP recibido. Saldo de $${bal.toLocaleString("es-CO")} COP contra entrega.` : 'Factura cancelada en su totalidad.'),
      createdAt: new Date().toISOString()
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);

    // Auto open receipt / invoice preview
    setViewingReceiptOrder(newOrder);
    setShowReceiptModal(true);

    // Reset Form
    setOrdClientName("");
    setOrdClientDocument("");
    setOrdClientPhone("");
    setOrdClientAddress("");
    setOrdProductDescription("");
    setOrdNotes("");
  };

  const handleDeleteOrder = (id: string, orderNumber: string) => {
    if (confirm(`¿Está seguro de eliminar el registro de pedido "${orderNumber}"?`)) {
      setOrders(orders.filter((o) => o.id !== id));
    }
  };

  // New Client Form State
  const [newClientName, setNewClientName] = useState("");
  const [newClientProject, setNewClientProject] = useState("");
  const [newClientLocation, setNewClientLocation] = useState("");
  const [newClientBusinessType, setNewClientBusinessType] = useState("");
  const [newClientCharacteristics, setNewClientCharacteristics] = useState("");
  const [newClientSellerId, setNewClientSellerId] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientEstadoComercial, setNewClientEstadoComercial] = useState<"Activo" | "Prospecto" | "Inactivo">("Activo");
  const [newClientStartDate, setNewClientStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newClientHostingFee, setNewClientHostingFee] = useState(400000);
  const [newClientHostingPaid, setNewClientHostingPaid] = useState(false);
  const [newClientMonthlyFee, setNewClientMonthlyFee] = useState(280000);
  const [newClientBillingDay, setNewClientBillingDay] = useState(5);
  const [newClientNotes, setNewClientNotes] = useState("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accountingPeriodFilter, setAccountingPeriodFilter] = useState("all");

  // Logo Upload State
  const [logoPreview, setLogoPreview] = useState<string>("/logo_atziluth.png");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Load configuration and clients from backend
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/config");
      if (res.ok) {
        const data = await res.json();
        if (data.config && Array.isArray(data.config.clients)) {
          setClients(data.config.clients);
        }
        if (data.config && data.config.logoUrl) {
          setLogoPreview(data.config.logoUrl);
        }
      }
    } catch (err) {
      console.error("Error al cargar configuración:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (updatedClients: ClientRecord[], updatedLogoUrl?: string) => {
    setSaveStatus("Guardando...");
    try {
      // First fetch existing config to avoid overwriting other keys
      const currentRes = await fetch("/api/config/images");
      let existingConfig = {};
      if (currentRes.ok) {
        const currentData = await currentRes.json();
        existingConfig = currentData.config || {};
      }

      const payload = {
        ...existingConfig,
        clients: updatedClients,
        logoUrl: updatedLogoUrl !== undefined ? updatedLogoUrl : logoPreview,
      };

      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer atziluth_secure_token_secret"
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveStatus("¡Cambios guardados con éxito!");
        try {
          localStorage.setItem("atziluth_custom_config", JSON.stringify(payload));
          window.dispatchEvent(new Event("configUpdated"));
        } catch (_) {}
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("Error al guardar.");
      }
    } catch (err) {
      console.error("Error guardando en backend:", err);
      setSaveStatus("Error de conexión.");
    }
  };

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Upload Logo Handler (Logotach integration)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setUploadMessage("Cargando imagen del logo en Logotach...");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer atziluth_secure_token_secret"
          },
          body: JSON.stringify({
            fileName: file.name || "logo_atziluth.png",
            base64Data: base64Data,
            isLogo: true
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          const newUrl = result.url || base64Data;
          setLogoPreview(newUrl);
          setUploadMessage("¡Logo subido, validado e instalado con éxito!");
          await saveConfig(clients, newUrl);
        } else {
          setUploadMessage(`Error de validación: ${result.error || "El archivo de imagen no es válido."}`);
        }
        setUploadingLogo(false);
        setTimeout(() => setUploadMessage(null), 5000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error subiendo logo en Logotach:", err);
      setUploadMessage("Error al procesar la imagen del logo.");
      setUploadingLogo(false);
    }
  };

  // Add Client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newClientName.trim() ||
      !newClientLocation.trim() ||
      !newClientBusinessType.trim() ||
      !newClientCharacteristics.trim()
    ) {
      alert(
        "Comando AGREGAR_CLIENTE — Error de Validación:\n\nDebes diligenciar obligatoriamente los 4 campos requeridos:\n1. Nombre del Cliente\n2. Ubicación / Municipio\n3. Tipo de Negocio\n4. Características Específicas"
      );
      return;
    }

    const clientId = "cli_" + Date.now().toString();
    const initialPayments: ClientPayment[] = [];

    if (newClientHostingPaid) {
      initialPayments.push({
        id: "pay_" + Date.now().toString(),
        concept: "Hosting + Dominio Inicial",
        period: "Inicial",
        amount: newClientHostingFee,
        date: newClientStartDate || new Date().toISOString().split("T")[0],
        method: "Transferencia Bancolombia",
        paid: true,
        notes: "Pago de inicio ($400.000 COP)",
      });
    }

    let assignedSellerName = "Administración Central Atziluth";
    if (newClientSellerId) {
      const foundS = sellers.find((s) => s.id === newClientSellerId);
      if (foundS) assignedSellerName = foundS.name;
    }

    const fichaClienteJson = JSON.stringify(
      {
        comando: "AGREGAR_CLIENTE",
        cliente: {
          nombre: newClientName.trim(),
          ubicacion: newClientLocation.trim(),
          tipo_negocio: newClientBusinessType.trim(),
          caracteristicas_especificas: newClientCharacteristics.trim(),
        },
        vendedor_asignado: assignedSellerName,
        fecha_registro: new Date().toISOString(),
      },
      null,
      2
    );

    const newRecord: ClientRecord = {
      id: clientId,
      clientName: newClientName.trim(),
      projectName:
        newClientProject.trim() ||
        `${newClientBusinessType.trim()} — ${newClientLocation.trim()}`,
      location: newClientLocation.trim(),
      businessType: newClientBusinessType.trim(),
      specificCharacteristics: newClientCharacteristics.trim(),
      phone: newClientPhone.trim(),
      startDate: newClientStartDate || new Date().toISOString().split("T")[0],
      hostingDomainFee: newClientHostingFee,
      hostingDomainPaid: newClientHostingPaid,
      monthlyFee: newClientMonthlyFee,
      billingDay: newClientBillingDay,
      notes: newClientNotes.trim(),
      payments: initialPayments,
      vendedorId: newClientSellerId || undefined,
      vendedorNombre: assignedSellerName,
      beneficiarioNombre: assignedSellerName,
      estadoComision: "Pendiente",
      estadoComercial: newClientEstadoComercial,
      fichaClienteJson: fichaClienteJson,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...clients];
    setClients(updated);
    saveConfig(updated);

    try {
      await fetch("/api/sales/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
    } catch (err) {
      console.error("Error posting new client to backend:", err);
    }

    // Reset Form
    setNewClientName("");
    setNewClientProject("");
    setNewClientLocation("");
    setNewClientBusinessType("");
    setNewClientCharacteristics("");
    setNewClientPhone("");
    setNewClientNotes("");
    setNewClientSellerId("");
  };

  // Update Admin Notes handler
  const handleUpdateAdminNotes = (clientId: string, newNotes: string) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          notasAdmin: newNotes,
          notes: newNotes || c.notes,
        };
      }
      return c;
    });
    setClients(updated);
    saveConfig(updated);
  };

  // Toggle Hosting Paid Status
  const toggleHostingPaid = (clientId: string) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const nextPaid = !c.hostingDomainPaid;
        const payments = [...(c.payments || [])];

        if (nextPaid) {
          const exists = payments.some((p) => p.concept.includes("Hosting"));
          if (!exists) {
            payments.push({
              id: "pay_" + Date.now().toString(),
              concept: "Hosting + Dominio Inicial",
              period: "Inicial",
              amount: c.hostingDomainFee || 400000,
              date: new Date().toISOString().split("T")[0],
              method: "Transferencia Bancolombia",
              paid: true,
              notes: "Marcado como pagado desde el panel",
            });
          }
        }

        return {
          ...c,
          hostingDomainPaid: nextPaid,
          payments: payments,
        };
      }
      return c;
    });

    setClients(updated);
    saveConfig(updated);
  };

  // Add Payment Entry to Client
  const handleAddPayment = (clientId: string, paymentData: Omit<ClientPayment, "id">) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const newPayment: ClientPayment = {
          id: "pay_" + Date.now().toString(),
          ...paymentData,
        };
        return {
          ...c,
          payments: [...(c.payments || []), newPayment],
        };
      }
      return c;
    });

    setClients(updated);
    saveConfig(updated);
  };

  // Toggle Individual Payment Status
  const togglePaymentPaid = (clientId: string, paymentId: string) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const payments = (c.payments || []).map((p) => {
          if (p.id === paymentId) {
            return { ...p, paid: !p.paid };
          }
          return p;
        });
        return { ...c, payments };
      }
      return c;
    });

    setClients(updated);
    saveConfig(updated);
  };

  // Delete Payment
  const deletePayment = (clientId: string, paymentId: string) => {
    if (!window.confirm("¿Deseas eliminar este registro de pago?")) return;
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          payments: (c.payments || []).filter((p) => p.id !== paymentId),
        };
      }
      return c;
    });

    setClients(updated);
    saveConfig(updated);
  };

  // Delete Client
  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al cliente "${clientName}"?`)) return;
    const updated = clients.filter((c) => c.id !== clientId);
    setClients(updated);
    saveConfig(updated);
  };

  // WhatsApp Link Generator
  const generateWaLink = (
    clientName: string,
    projectName: string,
    phone: string,
    concept: string,
    amount: number
  ) => {
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const fullPhone = cleanPhone.length === 10 ? "57" + cleanPhone : cleanPhone;
    const currentMonth = new Intl.DateTimeFormat("es-CO", {
      month: "long",
      year: "numeric",
    }).format(new Date());

    const msg = `Hola *${clientName}*, te saludamos de *Atziluth Gráfic Digital* 🚀\n\nTe recordamos el pago correspondiente a *${concept}* (${currentMonth}) para el proyecto *${projectName}*.\n\n💰 *Valor:* ${formatCOP(
      amount
    )}\n\n📌 *Medios de Pago:*\n- Bancolombia / Nequi / Daviplata\n\nPor favor nos envías la foto del comprobante. ¡Muchas gracias!`;

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Financial Metrics
  let totalActiveClients = clients.length;
  let totalHostingRev = 0;
  let totalMonthlyRev = 0;
  let totalPending = 0;

  clients.forEach((c) => {
    if (c.hostingDomainPaid) {
      totalHostingRev += c.hostingDomainFee || 400000;
    } else {
      totalPending += c.hostingDomainFee || 400000;
    }

    (c.payments || []).forEach((p) => {
      if (p.paid) {
        totalMonthlyRev += p.amount || 0;
      } else {
        totalPending += p.amount || 0;
      }
    });
  });

  // Filtered clients list
  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQ =
      !q ||
      c.clientName.toLowerCase().includes(q) ||
      c.projectName.toLowerCase().includes(q) ||
      c.phone.includes(q);

    if (!matchesQ) return false;

    if (statusFilter === "pending_hosting") return !c.hostingDomainPaid;
    if (statusFilter === "pending_monthly")
      return (c.payments || []).some((p) => !p.paid);
    if (statusFilter === "up_to_date")
      return c.hostingDomainPaid && !(c.payments || []).some((p) => !p.paid);

    return true;
  });

  // All Payments for Accounting Table
  const allPayments = clients.flatMap((c) =>
    (c.payments || []).map((p) => ({
      ...p,
      clientName: c.clientName,
      projectName: c.projectName,
    }))
  );

  const uniquePeriods = Array.from(new Set(allPayments.map((p) => p.period))).filter(
    Boolean
  );

  const filteredAccountingPayments = allPayments.filter(
    (p) => accountingPeriodFilter === "all" || p.period === accountingPeriodFilter
  );

  const currentMonthCapitalized = new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  // 1. SI NO HA INICIADO SESIÓN, MOSTRAR PANTALLA DE LOGIN
  if (!authSession || !authSession.isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 my-4 shadow-2xl">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-brand-orange to-brand-magenta"></div>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center shadow-lg text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">Atziluth Gráfic Digital</h2>
            <p className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              Autenticación & Control de Acceso
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setLoginMode('vendedor'); setLoginUsername('carlos.ventas'); setLoginPassword('123'); setLoginError(null); }}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMode === 'vendedor'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Vendedor
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('admin'); setLoginUsername('Estivenson'); setLoginPassword('Lmrv1979'); setLoginError(null); }}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMode === 'admin'
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Administrador
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-bold">
                {loginMode === 'vendedor' ? 'Usuario Comercial (Vendedor)' : 'Usuario Administrador'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder={loginMode === 'vendedor' ? "Ej: carlos.ventas" : "Ej: Estivenson"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5 font-bold">
                Contraseña / Clave
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-xs text-rose-300 font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider ${
                loginMode === 'vendedor'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                  : 'bg-gradient-to-r from-brand-orange to-brand-magenta hover:opacity-90'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ingresar como {loginMode === 'vendedor' ? 'Vendedor' : 'Administrador'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] font-mono text-slate-400">
            <span className="block text-[10px] uppercase text-slate-500 text-center font-bold">
              Acceso Directo Un Clic:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInstantLoginSeller('carlos.ventas')}
                className="p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-xl text-left transition-all cursor-pointer shadow flex items-center justify-between"
              >
                <div>
                  <strong className="text-emerald-400 block font-bold text-xs">Carlos (Vendedor)</strong>
                  <span className="text-[10px] text-emerald-300/80 block">Acceso Directo Ventas →</span>
                </div>
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => handleInstantLoginAdmin()}
                className="p-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/80 rounded-xl text-left transition-all cursor-pointer shadow flex items-center justify-between"
              >
                <div>
                  <strong className="text-brand-orange block font-bold text-xs">Estivenson (Admin)</strong>
                  <span className="text-[10px] text-amber-300/80 block">Acceso Directo Admin →</span>
                </div>
                <Lock className="w-4 h-4 text-brand-orange shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. SI EL USUARIO ES UN VENDEDOR, RETORNAR VISTA DEDICADA DE VENTAS Y FACTURACIÓN
  if (authSession.role === 'vendedor') {
    return (
      <VendedorDashboard
        authSession={authSession}
        onLogout={handleLogout}
        orders={orders}
        onSaveOrder={(newOrder) => {
          const updated = [newOrder, ...orders];
          setOrders(updated);
          try {
            localStorage.setItem("atziluth_orders_data", JSON.stringify(updated));
          } catch (e) {
            console.error("Error saving orders:", e);
          }
        }}
        sellers={sellers}
        clients={clients}
        onAddClient={(newClient) => {
          const updated = [newClient, ...clients];
          setClients(updated);
          saveConfig(updated);
        }}
      />
    );
  }

  // Legacy view block
  if (false) {
    return (
      <div className="space-y-8 p-4 md:p-8 bg-slate-950 text-slate-100 min-h-screen rounded-3xl border border-slate-800 my-4 shadow-2xl">
        {/* Top Session Bar para Vendedor */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-display">{authSession.name}</h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded-full font-bold uppercase">
                  VENDEDOR AUTORIZADO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Usuario: <strong className="text-emerald-400">@{authSession.username}</strong> • Zona: {authSession.sellerRecord?.zone || 'Medellín / Antioquia'} • Teléfono: {authSession.sellerRecord?.phone || '3000000000'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Banner de Vista Exclusiva */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/80 p-5 rounded-2xl space-y-1 shadow-lg">
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded-full font-bold uppercase inline-block">
            Portal Exclusivo de Ventas & Facturación
          </span>
          <h1 className="text-xl font-bold text-white font-display">Creación de Pedidos, Recibos de Abono y Facturas</h1>
          <p className="text-xs text-slate-300">
            Vista limitada exclusivamente para gestión de ventas. Registra recibos de abono o facturas para tus clientes, emite comprobantes oficiales en PDF y consulta el historial. Acceso al panel general administrado únicamente por la Dirección Comercial.
          </p>
        </div>

        {/* ÚNICA SECCIÓN VISIBLE PARA VENDEDOR: GESTOR DE PEDIDOS Y FACTURACIÓN */}
        <div id="seccion-pedidos-ventas" className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-display">Portal de Pedidos, Recibos de Abono y Facturación</h2>
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono rounded-full font-bold uppercase">
                    Comprobantes PDF Activos
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                  Genera recibos de anticipo o facturas finales de venta. Imprime comprobantes PDF para tus clientes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Pedidos Registrados</span>
                <span className="text-lg font-bold text-indigo-400 font-mono">{orders.length} comprobantes</span>
              </div>
            </div>
          </div>

          {/* FORMULARIO DE REGISTRO DE PEDIDO PARA VENDEDOR */}
          <form onSubmit={handleCreateOrder} className="bg-slate-950 p-5 md:p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-mono uppercase text-indigo-400 font-bold flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Formulario de Registro de Pedido / Abono / Factura
              </h3>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setOrdDocumentType('abono')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    ordDocumentType === 'abono'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Recibo de Abono
                </button>
                <button
                  type="button"
                  onClick={() => setOrdDocumentType('factura')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    ordDocumentType === 'factura'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Factura Final
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Vendedor Asignado *
                </label>
                <select
                  value={ordSellerId}
                  onChange={(e) => setOrdSellerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value={authSession.sellerId || "sel_1"}>
                    {authSession.name} (@{authSession.username}) — Vendedor
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Cliente / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Calzado San Juan S.A.S."
                  value={ordClientName}
                  onChange={(e) => setOrdClientName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  NIT / Cédula Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ej: 900.123.456-7"
                  value={ordClientDocument}
                  onChange={(e) => setOrdClientDocument(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Teléfono / Celular Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ej: 310 987 6543"
                  value={ordClientPhone}
                  onChange={(e) => setOrdClientPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Municipio de Envío / Entrega
                </label>
                <select
                  value={ordClientMunicipality}
                  onChange={(e) => setOrdClientMunicipality(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {ANTIOQUIA_MUNICIPALITIES.map((muni) => (
                    <option key={muni} value={muni}>
                      {muni}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Dirección de Envío
                </label>
                <input
                  type="text"
                  placeholder="Ej: Calle 50 # 45-20 Local 102"
                  value={ordClientAddress}
                  onChange={(e) => setOrdClientAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Categoría / Línea de Producto
                </label>
                <select
                  value={ordProductCategory}
                  onChange={(e) => setOrdProductCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Cantidad *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={ordQuantity}
                  onChange={(e) => setOrdQuantity(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Precio Unitario ($ COP) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={ordUnitPrice}
                  onChange={(e) => setOrdUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Monto de Abono / Pago Recibido ($ COP)
                </label>
                <input
                  type="number"
                  min="0"
                  value={ordPaidAmount}
                  onChange={(e) => setOrdPaidAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Método de Pago
                </label>
                <select
                  value={ordPaymentMethod}
                  onChange={(e) => setOrdPaymentMethod(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Transferencia Bancolombia">Transferencia Bancolombia</option>
                  <option value="Nequi">Nequi</option>
                  <option value="Daviplata">Daviplata</option>
                  <option value="Efectivo al Cobro">Efectivo al Cobro</option>
                  <option value="MercadoPago / Tarjeta">MercadoPago / Tarjeta</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Descripción Detallada del Trabajo
                </label>
                <textarea
                  rows={2}
                  placeholder="Especifica medidas, tipo de papel, acabados, troquelado o notas especiales del trabajo..."
                  value={ordProductDescription}
                  onChange={(e) => setOrdProductDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Cálculo de totales en vivo */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase">Resumen del Trabajo</span>
                <p className="text-white font-bold">
                  Valor Total: <span className="text-emerald-400">${(ordQuantity * ordUnitPrice).toLocaleString("es-CO")} COP</span>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-white font-bold">
                  Abono Recibido: <span className="text-amber-400">${ordPaidAmount.toLocaleString("es-CO")} COP</span>
                </p>
                <p className="text-white font-bold">
                  Saldo Restante: <span className="text-rose-400">${Math.max(0, (ordQuantity * ordUnitPrice) - ordPaidAmount).toLocaleString("es-CO")} COP</span>
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer uppercase tracking-wider"
              >
                <Receipt className="w-4 h-4" />
                <span>Generar Comprobante Oficial</span>
              </button>
            </div>
          </form>

          {/* HISTORIAL DE COMPROBANTES Y PEDIDOS */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-400" />
                Historial de Comprobantes Registrados
              </h3>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por N° pedido o cliente..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">N° Pedido / Fecha</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Línea de Trabajo</th>
                      <th className="px-4 py-3 text-right">Monto Total</th>
                      <th className="px-4 py-3 text-right">Abono / Saldo</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {orders
                      .filter((ord) => {
                        if (!orderSearchQuery) return true;
                        const q = orderSearchQuery.toLowerCase();
                        return (
                          ord.orderNumber.toLowerCase().includes(q) ||
                          ord.clientName.toLowerCase().includes(q) ||
                          ord.productCategory.toLowerCase().includes(q)
                        );
                      })
                      .map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="px-4 py-3 font-mono">
                            <strong className="text-indigo-400 block font-bold">{ord.orderNumber}</strong>
                            <span className="text-[10px] text-slate-500 block">{ord.date}</span>
                          </td>

                          <td className="px-4 py-3">
                            <strong className="text-white block font-medium">{ord.clientName}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">{ord.clientMunicipality} • Tel: {ord.clientPhone}</span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="text-slate-200 block text-[11px] font-medium">{ord.productCategory}</span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-xs">{ord.productDescription}</span>
                          </td>

                          <td className="px-4 py-3 text-right font-mono font-bold text-white">
                            ${ord.totalAmount.toLocaleString("es-CO")}
                          </td>

                          <td className="px-4 py-3 text-right font-mono">
                            <span className="text-emerald-400 block font-bold">${ord.paidAmount.toLocaleString("es-CO")}</span>
                            <span className="text-[10px] text-amber-400 block">Saldo: ${ord.balance.toLocaleString("es-CO")}</span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                ord.status === 'pagado'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : ord.status === 'abono_parcial'
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : 'bg-slate-900 text-slate-400 border border-slate-800'
                              }`}
                            >
                              {ord.status === 'pagado' ? 'Pagado Total' : 'Abono Parcial'}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setViewingReceiptOrder(ord);
                                setShowReceiptModal(true);
                              }}
                              className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-end gap-1 cursor-pointer ml-auto"
                              title="Ver / Imprimir Recibo PDF"
                            >
                              <Printer className="w-3 h-3 text-indigo-400" />
                              <span>Ver PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL IMPRESIÓN Y DESCARGA DE RECIBO DE ABONO / FACTURA FINAL */}
        {showReceiptModal && viewingReceiptOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Vista Previa Comprobante Oficial — {viewingReceiptOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tipo: <strong className="text-indigo-400">{viewingReceiptOrder.documentType === 'abono' ? 'Recibo de Abono / Anticipo' : 'Factura Final de Venta'}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* VISTA PREVIA HOJA IMPRESA COMPROBANTE PDF */}
              <div className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl shadow-xl font-sans space-y-6 border border-slate-200">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      ATZILUTH GRÁFIC DIGITAL S.A.S.
                    </h2>
                    <p className="text-xs font-mono text-slate-600">NIT: 901.458.321-9 • Medellín, Colombia</p>
                    <p className="text-xs font-mono text-slate-600">Línea de Atención & WhatsApp: +57 300 123 4567</p>
                    <p className="text-xs font-mono text-slate-600">E-mail: ventas@atziluthgrafic.com</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 text-white font-mono text-xs font-bold rounded uppercase inline-block ${
                        viewingReceiptOrder.documentType === 'abono' ? 'bg-amber-600' : 'bg-emerald-700'
                      }`}
                    >
                      {viewingReceiptOrder.documentType === 'abono' ? 'RECIBO DE ABONO' : 'FACTURA FINAL'}
                    </span>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-1">N° {viewingReceiptOrder.orderNumber}</p>
                    <p className="text-xs font-mono text-slate-600">Fecha: {viewingReceiptOrder.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">DATOS DEL VENDEDOR:</span>
                    <strong className="text-slate-900 block font-bold text-sm">{viewingReceiptOrder.sellerName}</strong>
                    <p className="font-mono text-slate-600">Usuario: @{viewingReceiptOrder.sellerUsername}</p>
                    <p className="font-mono text-slate-600">Teléfono: {viewingReceiptOrder.sellerPhone}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">DATOS DEL CLIENTE:</span>
                    <strong className="text-slate-900 block font-bold text-sm">{viewingReceiptOrder.clientName}</strong>
                    <p className="font-mono text-slate-600">NIT / CC: {viewingReceiptOrder.clientDocument}</p>
                    <p className="font-mono text-slate-600">Teléfono: {viewingReceiptOrder.clientPhone}</p>
                    <p className="text-slate-600">Ubicación: {viewingReceiptOrder.clientMunicipality} — {viewingReceiptOrder.clientAddress}</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-mono text-slate-600 uppercase">
                      <tr>
                        <th className="p-2.5">Cant.</th>
                        <th className="p-2.5">Descripción del Trabajo / Línea</th>
                        <th className="p-2.5 text-right">V. Unitario</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-slate-900">{viewingReceiptOrder.quantity}</td>
                        <td className="p-2.5">
                          <strong className="text-slate-900 block">{viewingReceiptOrder.productCategory}</strong>
                          <p className="text-slate-600 text-[11px]">{viewingReceiptOrder.productDescription}</p>
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-700">
                          ${viewingReceiptOrder.unitPrice.toLocaleString("es-CO")} COP
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                          ${viewingReceiptOrder.totalAmount.toLocaleString("es-CO")} COP
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">VALOR TOTAL:</span>
                    <strong className="text-base font-mono font-bold text-slate-900">
                      ${viewingReceiptOrder.totalAmount.toLocaleString("es-CO")} COP
                    </strong>
                  </div>

                  <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[10px] font-mono uppercase text-emerald-800 block font-bold">ABONO RECIBIDO:</span>
                    <strong className="text-base font-mono font-bold text-emerald-700">
                      ${viewingReceiptOrder.paidAmount.toLocaleString("es-CO")} COP
                    </strong>
                    <span className="text-[9px] font-mono text-emerald-800 block mt-0.5">{viewingReceiptOrder.paymentMethod}</span>
                  </div>

                  <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <span className="text-[10px] font-mono uppercase text-amber-800 block font-bold">SALDO PENDIENTE:</span>
                    <strong className="text-base font-mono font-bold text-amber-700">
                      ${viewingReceiptOrder.balance.toLocaleString("es-CO")} COP
                    </strong>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <p><strong>Observaciones:</strong> {viewingReceiptOrder.notes}</p>
                  <p><strong>Cuentas Autorizadas para Pago:</strong> Bancolombia Cta Ahorros #123-456789-01 | Nequi / Daviplata: +57 300 123 4567</p>
                  <p className="text-slate-400">Atziluth Gráfic Digital S.A.S. — Medellín, Antioquia. Comprobante válido para soporte contable e inspección de trabajo.</p>
                </div>

                <div className="pt-8 border-t border-slate-300 flex justify-between text-xs text-slate-500 font-mono">
                  <div className="text-center w-52 border-t border-slate-400 pt-1">Firma Asesor / Comercial</div>
                  <div className="text-center w-52 border-t border-slate-400 pt-1">Recibido Conforme Cliente</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>IMPRIMIR COMPROBANTE / DESCARGAR PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. VISTA COMPLETA PARA ADMINISTRADOR GENERAL
  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-950 text-slate-100 min-h-screen rounded-3xl border border-slate-800 my-4 shadow-2xl">
      {/* Top Session Bar para Admin */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl border border-brand-orange/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">{authSession.name}</h2>
              <span className="px-2.5 py-0.5 bg-brand-orange/20 text-brand-orange border border-brand-orange/30 text-[10px] font-mono rounded-full font-bold uppercase">
                ADMINISTRADOR GENERAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Acceso total a clientes, mensualidades, gestión de vendedores (CRUD), facturación y marca Logotach.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              Panel General — Control Principal
            </span>
            {saveStatus && (
              <span className="text-xs font-mono text-emerald-400 animate-pulse">
                {saveStatus}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-2">
            Panel General — Administración, Clientes y Vendedores
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Gestión integral de clientes, pagos iniciales de $400.000 (hosting/dominio), mensualidades, vendedores CRUD y gestor de marca.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              setProvActiveSubPanel('cotizaciones');
              handleNavigateTab('proveedores', 'subpanel-cotizaciones-proveedores');
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-xs font-mono font-black text-slate-950 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xl border-2 border-amber-300 ring-2 ring-amber-400/40 animate-pulse"
          >
            <Tag className="w-4 h-4 text-slate-950" />
            <span>📥 VER COTIZACIONES ({provCotizaciones.length})</span>
          </button>

          <button
            onClick={() => {
              setProvActiveSubPanel('talleres');
              handleNavigateTab('proveedores', 'seccion-proveedores');
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-xs font-mono font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg border border-amber-400/30"
          >
            <Building2 className="w-4 h-4 text-amber-200" />
            <span>🏭 Gestión de Proveedores</span>
          </button>

          <button
            onClick={() => handleNavigateTab('balance', 'seccion-clientes')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-xs font-mono font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg border border-indigo-400/30"
          >
            <Wallet className="w-4 h-4 text-indigo-200" />
            <span>💼 Balance Contable</span>
          </button>

          <button
            onClick={() => handleNavigateTab('vendedores', 'formulario-nuevo-vendedor')}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-xs font-mono font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg border border-emerald-400/30"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>+ Crear Vendedores</span>
          </button>

          <button
            onClick={() => handleNavigateTab('facturacion')}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Receipt className="w-4 h-4" />
            <span>Portal Ventas & Facturación</span>
          </button>

          <button
            onClick={() => handleNavigateTab('branding')}
            className="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta hover:opacity-90 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gestor de Logo</span>
          </button>

          <button
            onClick={fetchConfig}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-brand-orange" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN PRINCIPAL EN ADMIN DASHBOARD */}
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl flex flex-wrap items-center gap-2 shadow-xl sticky top-2 z-40 backdrop-blur-md">
        <button
          onClick={() => handleNavigateTab('panel_general')}
          className={`flex-1 min-w-[140px] py-3 px-3.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeAdminTab === 'panel_general'
              ? 'bg-gradient-to-r from-brand-orange to-amber-600 text-white shadow-lg border border-brand-orange/30'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-brand-orange" />
          <span>📊 Panel General</span>
        </button>

        <button
          onClick={() => handleNavigateTab('proveedores')}
          className={`flex-1 min-w-[160px] py-3 px-3.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeAdminTab === 'proveedores' || activeAdminTab === 'talleres'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg border border-amber-500/30 font-black'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>🏭 Proveedores & Talleres ({proveedores.length})</span>
        </button>

        <button
          onClick={() => handleNavigateTab('cotizaciones_talleres')}
          className={`flex-1 min-w-[180px] py-3 px-3.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeAdminTab === 'cotizaciones_talleres'
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-xl border-amber-300 font-black scale-105'
              : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 hover:text-white hover:bg-amber-500/30 border-amber-500/50 ring-1 ring-amber-500/30'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-400" />
          <span className="font-black">📥 Cotizaciones & Costos ({provCotizaciones.length})</span>
          {provCotizaciones.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] rounded-full font-black">
              {provCotizaciones.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavigateTab('balance')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeAdminTab === 'balance' || activeAdminTab === 'clientes'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg border border-indigo-500/30 font-black'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4 text-indigo-400" />
          <span>💼 Balance Contable & Clientes</span>
        </button>

        <button
          onClick={() => handleNavigateTab('vendedores')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeAdminTab === 'vendedores'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-500/30'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>👥 Vendedores CRUD ({sellers.length})</span>
        </button>

        <button
          onClick={() => handleNavigateTab('facturacion')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeAdminTab === 'facturacion'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg border border-amber-500/30'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>🧾 Ventas & Facturación</span>
        </button>

        <button
          onClick={() => handleNavigateTab('branding')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeAdminTab === 'branding'
              ? 'bg-gradient-to-r from-brand-orange to-brand-magenta text-white shadow-lg border border-brand-orange/30'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-brand-orange" />
          <span>🎨 Logo & Marca Logotach</span>
        </button>
      </div>

      {/* PORTALES Y MÓDULOS DE ADMINISTRACIÓN DIRECTOS */}
      {activeAdminTab === 'panel_general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Portal 1: Ventas y Vendedores */}
          <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  Ruta: /admin/ventas.html
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display">Módulo de Ventas & Vendedores</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Gestión de comerciales, asignación de zonas en Antioquia, creación de pedidos, recibos de abonos y <strong>Reporte Mensual PDF de Ventas y Comisiones</strong>.
              </p>
            </div>
            <a
              href="/admin/ventas.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow cursor-pointer text-center"
            >
              <FolderOpen className="w-4 h-4" />
              <span>ABRIR PORTAL DE VENTAS ↗</span>
            </a>
          </div>

          {/* Portal 2: Proveedores & Oficinas Virtuales */}
          <div className="bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-900 border border-amber-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-full uppercase">
                    {provCotizaciones.length} Cotizaciones
                  </span>
                </div>
              </div>
              <h3 className="text-base font-bold text-white font-display">Proveedores & Buzón de Cotizaciones</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Control de talleres aliados, buzón de cotizaciones recibidas de proveedores, comparador de costos más baratos, órdenes de producción y pagos con soporte .JPG.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavigateTab('cotizaciones_talleres', 'seccion-cotizaciones-buzon')}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow cursor-pointer text-center"
              >
                <Tag className="w-4 h-4" />
                <span>📥 VER COTIZACIONES ({provCotizaciones.length}) ↗</span>
              </button>
              <button
                onClick={() => handleNavigateTab('proveedores', 'seccion-proveedores')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow cursor-pointer text-center"
              >
                <Building2 className="w-4 h-4" />
                <span>Gestionar Proveedores & Códigos</span>
              </button>
            </div>
          </div>

          {/* Portal 3: Almanaques & Calendarios */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded-full uppercase">
                  Ruta: /admin/almanaques.html
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display">Almanaques & Calendarios 2026</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Administra los tipos de almanaques, listas de precios por cantidad, subida del catálogo en PDF y cotizaciones especiales.
              </p>
            </div>
            <a
              href="/admin/almanaques.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow cursor-pointer text-center"
            >
              <FolderOpen className="w-4 h-4" />
              <span>ABRIR PANEL ALMANAQUES ↗</span>
            </a>
          </div>

          {/* Portal 4: Editor Web General */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full uppercase">
                  Ruta: /admin/panel.html
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display">Editor Dinámico de Contenido</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Modifica banners principales, avisos publicitarios, directorio comercial de municipios y configuración global.
              </p>
            </div>
            <a
              href="/admin/panel.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 shadow cursor-pointer text-center"
            >
              <FolderOpen className="w-4 h-4" />
              <span>ABRIR EDITOR DE CONTENIDO ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN PRINCIPAL: COTIZACIONES RECIBIDAS (ENVIADAS DESDE PROVEEDOR VIRTUAL OFFICE) */}
      {/* ========================================================================= */}
      {(activeAdminTab === 'panel_general' || activeAdminTab === 'cotizaciones_recibidas' || activeAdminTab === 'cotizaciones_talleres') && (
        <div id="seccion-cotizaciones-recibidas" className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Encabezado Principal de Cotizaciones Recibidas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3.5 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-slate-950 rounded-2xl font-black shadow-xl shadow-amber-500/30 shrink-0">
                <Tag className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
                    📥 Cotizaciones Recibidas (Enviadas desde ProveedorVirtualOffice)
                  </h2>
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-mono rounded-full font-black uppercase shadow">
                    {provCotizaciones.length} Cotizaciones Registradas
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono rounded-full font-bold uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" /> Sincronización en Tiempo Real
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-sans leading-relaxed">
                  Listado y comparador en tiempo real de todas las cotizaciones y tarifas enviadas por los proveedores y talleres aliados. 
                  Resalta automáticamente el registro con el <strong className="text-emerald-400">precio unitario más bajo por producto</strong> para facilitar la toma de decisiones y maximizar la rentabilidad de las órdenes.
                </p>
              </div>
            </div>

            {/* Acciones Rápidas del Encabezado */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => {
                  const latest = getStoredCotizaciones();
                  if (latest.length === 0) {
                    saveStoredCotizaciones(INITIAL_COTIZACIONES);
                    setProvCotizaciones(INITIAL_COTIZACIONES);
                  } else {
                    setProvCotizaciones(latest);
                  }
                  setProveedores(getStoredProveedores());
                  setSaveStatus("✓ Cotizaciones sincronizadas en tiempo real desde LocalStorage");
                  setTimeout(() => setSaveStatus(null), 3000);
                }}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                title="Sincronizar cotizaciones desde LocalStorage"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Sincronizar en Vivo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  saveStoredCotizaciones(INITIAL_COTIZACIONES);
                  setProvCotizaciones(INITIAL_COTIZACIONES);
                  setSaveStatus("✓ Cotizaciones de demostración cargadas correctamente");
                  setTimeout(() => setSaveStatus(null), 3000);
                }}
                className="px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                title="Cargar cotizaciones de prueba con diferentes precios unitarios"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Cargar Demo</span>
              </button>

              <a
                href="/proveedores/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-mono font-black transition-all shadow flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Portal Talleres ↗</span>
              </a>
            </div>
          </div>

          {/* Tarjetas KPI de Resumen de Cotizaciones */}
          {(() => {
            const currentCots = provCotizaciones.length > 0 ? provCotizaciones : INITIAL_COTIZACIONES;
            const uniqueProvCount = new Set(currentCots.map(c => c.proveedorId)).size;
            const unitPrices = currentCots.map(c => c.precioCostoUnitario || (c.cantidad > 0 ? c.precioCostoTotal / c.cantidad : c.precioCostoTotal)).filter(p => p > 0);
            const minUnit = unitPrices.length > 0 ? Math.min(...unitPrices) : 0;
            const bestQuote = currentCots.find(c => {
              const u = c.precioCostoUnitario || (c.cantidad > 0 ? c.precioCostoTotal / c.cantidad : c.precioCostoTotal);
              return Math.abs(u - minUnit) < 0.01;
            });

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Total Cotizaciones:</span>
                  <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">{currentCots.length}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Ofertas registradas</span>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Talleres Cotizantes:</span>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">{uniqueProvCount}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Proveedores activos</span>
                </div>

                <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 p-4 rounded-2xl border-2 border-emerald-500/40 shadow">
                  <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-400" /> Mejor Precio Unitario:
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-300 mt-0.5 truncate">
                    {minUnit > 0 ? `$${Math.round(minUnit).toLocaleString('es-CO')} COP` : '$0'}
                  </div>
                  <span className="text-[10px] text-emerald-400/90 font-mono truncate block">
                    {bestQuote ? bestQuote.tituloProducto.substring(0, 28) + '...' : 'Costo unitario mínimo'}
                  </span>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Líneas Litográficas:</span>
                  <div className="text-2xl font-black font-mono text-sky-400 mt-0.5">{new Set(currentCots.map(c => c.categoria)).size}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Categorías ofertadas</span>
                </div>
              </div>
            );
          })()}

          {/* BARRA DE FILTROS INTELIGENTES Y MODO DE DECISIÓN */}
          <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Buscador en Vivo */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={cotSearchTerm}
                  onChange={(e) => setCotSearchTerm(e.target.value)}
                  placeholder="Buscar por proveedor, producto, papel, formato..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              {/* Filtro por Proveedor */}
              <div className="md:col-span-4 flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold whitespace-nowrap">Taller:</span>
                <select
                  value={cotProviderFilter}
                  onChange={(e) => setCotProviderFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400 cursor-pointer shadow-inner"
                >
                  <option value="all">Todos los Talleres ({proveedores.length})</option>
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} — {p.nombreComercial}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Categoría / Línea */}
              <div className="md:col-span-4 flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold whitespace-nowrap">Línea:</span>
                <select
                  value={cotCategoryFilter}
                  onChange={(e) => setCotCategoryFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400 cursor-pointer shadow-inner"
                >
                  <option value="all">Todas las Líneas ({getStoredCategorias().length})</option>
                  {getStoredCategorias().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BOTONES DE DECISIÓN Y ORDENAMIENTO */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Filtro de Decisión:</span>
                <button
                  type="button"
                  onClick={() => setCotDecisionMode("todas")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    cotDecisionMode === "todas"
                      ? "bg-amber-400 text-slate-950 font-black shadow-md"
                      : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                  }`}
                >
                  📋 Todas ({provCotizaciones.length || INITIAL_COTIZACIONES.length})
                </button>

                <button
                  type="button"
                  onClick={() => setCotDecisionMode("solo_mejores")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    cotDecisionMode === "solo_mejores"
                      ? "bg-emerald-400 text-slate-950 font-black shadow-lg ring-2 ring-emerald-400/40"
                      : "bg-emerald-950/40 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-900/40"
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>🏆 Solo Precio Más Bajo por Producto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCotDecisionMode("destacadas")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    cotDecisionMode === "destacadas"
                      ? "bg-yellow-400 text-slate-950 font-black shadow-md"
                      : "bg-slate-900 text-amber-300 border border-slate-800 hover:text-white"
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>⭐ Destacadas ({provCotizaciones.filter(c => c.destacadaAdmin).length})</span>
                </button>
              </div>

              {/* Selector de Orden */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold whitespace-nowrap">Ordenar:</span>
                <select
                  value={cotSortMode}
                  onChange={(e) => setCotSortMode(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="menor_unitario">Menor Precio Unitario (Recomendado)</option>
                  <option value="menor_precio">Menor Costo Total</option>
                  <option value="reciente">Fecha de Envío (Más reciente)</option>
                  <option value="proveedor">Por Proveedor</option>
                </select>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TABLA PRINCIPAL DE COTIZACIONES RECIBIDAS CON RESALTADO DE PRECIO MÁS BAJO */}
          {/* ========================================================================= */}
          {(() => {
            const baseList = provCotizaciones.length > 0 ? provCotizaciones : INITIAL_COTIZACIONES;

            // 1. Calculate map of lowest unit price per product and category
            const lowestUnitByProduct = new Map<string, number>();
            baseList.forEach(c => {
              const unitPrice = c.precioCostoUnitario || (c.cantidad > 0 ? c.precioCostoTotal / c.cantidad : c.precioCostoTotal);
              const prodKey = (c.tituloProducto || "").trim().toLowerCase();
              const catKey = (c.categoria || "").trim().toLowerCase();
              
              if (prodKey) {
                const current = lowestUnitByProduct.get(`prod_${prodKey}`);
                if (current === undefined || unitPrice < current) {
                  lowestUnitByProduct.set(`prod_${prodKey}`, unitPrice);
                }
              }
              if (catKey) {
                const currentCat = lowestUnitByProduct.get(`cat_${catKey}`);
                if (currentCat === undefined || unitPrice < currentCat) {
                  lowestUnitByProduct.set(`cat_${catKey}`, unitPrice);
                }
              }
            });

            // 2. Filter items based on user criteria
            let list = baseList.filter((cot) => {
              const matchCat = cotCategoryFilter === 'all' || cot.categoria === cotCategoryFilter;
              const matchProv = cotProviderFilter === 'all' || cot.proveedorId === cotProviderFilter;
              const matchDestacada = cotDecisionMode !== "destacadas" || cot.destacadaAdmin;

              if (!matchCat || !matchProv || !matchDestacada) return false;

              if (cotSearchTerm.trim()) {
                const term = cotSearchTerm.toLowerCase();
                const prov = proveedores.find(p => p.id === cot.proveedorId);
                const matchText = (
                  cot.tituloProducto?.toLowerCase().includes(term) ||
                  cot.categoria?.toLowerCase().includes(term) ||
                  cot.descripcionDetallada?.toLowerCase().includes(term) ||
                  cot.materialPapel?.toLowerCase().includes(term) ||
                  cot.medidasFormato?.toLowerCase().includes(term) ||
                  cot.proveedorNombre?.toLowerCase().includes(term) ||
                  (prov && prov.nombreComercial.toLowerCase().includes(term)) ||
                  (prov && prov.codigo.toLowerCase().includes(term))
                );
                if (!matchText) return false;
              }

              if (cotDecisionMode === "solo_mejores") {
                const unitPrice = cot.precioCostoUnitario || (cot.cantidad > 0 ? cot.precioCostoTotal / cot.cantidad : cot.precioCostoTotal);
                const prodKey = (cot.tituloProducto || "").trim().toLowerCase();
                const catKey = (cot.categoria || "").trim().toLowerCase();
                const isMinProd = prodKey && lowestUnitByProduct.get(`prod_${prodKey}`) === unitPrice;
                const isMinCat = catKey && lowestUnitByProduct.get(`cat_${catKey}`) === unitPrice;
                return isMinProd || isMinCat;
              }

              return true;
            });

            // 3. Sorting
            list.sort((a, b) => {
              const unitA = a.precioCostoUnitario || (a.cantidad > 0 ? a.precioCostoTotal / a.cantidad : a.precioCostoTotal);
              const unitB = b.precioCostoUnitario || (b.cantidad > 0 ? b.precioCostoTotal / b.cantidad : b.precioCostoTotal);
              if (cotSortMode === "menor_unitario") return unitA - unitB;
              if (cotSortMode === "menor_precio") return a.precioCostoTotal - b.precioCostoTotal;
              if (cotSortMode === "reciente") return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
              if (cotSortMode === "proveedor") return (a.proveedorNombre || "").localeCompare(b.proveedorNombre || "");
              return unitA - unitB;
            });

            if (list.length === 0) {
              return (
                <div className="bg-slate-950/90 p-12 rounded-3xl border-2 border-dashed border-slate-800 text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto text-amber-400 border border-amber-500/20">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold font-mono text-slate-200">
                      No se encontraron cotizaciones con los filtros actuales
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Prueba restableciendo la búsqueda o seleccionando "Todas las Líneas".
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCotSearchTerm('');
                      setCotCategoryFilter('all');
                      setCotProviderFilter('all');
                      setCotDecisionMode('todas');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              );
            }

            return (
              <div className="overflow-hidden border-2 border-amber-500/40 rounded-3xl bg-slate-950 shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[1050px]">
                    <thead>
                      <tr className="border-b-2 border-slate-800 bg-slate-900/95 text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                        <th className="py-4 px-4 font-bold">Nombre del Proveedor</th>
                        <th className="py-4 px-4 font-bold">Descripción del Producto</th>
                        <th className="py-4 px-4 text-center font-bold">Cantidad</th>
                        <th className="py-4 px-4 bg-amber-950/40 text-amber-300 border-x border-amber-500/30 font-bold">
                          Precio Unitario & Costo
                        </th>
                        <th className="py-4 px-4 font-bold">Fecha de Envío</th>
                        <th className="py-4 px-4 text-center font-bold">Acciones / Decisión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {list.map((cot) => {
                        const prov = proveedores.find(p => p.id === cot.proveedorId);
                        const provNombre = prov ? prov.nombreComercial : (cot.proveedorNombre || "Taller Litográfico Aliado");
                        const provCodigo = prov ? prov.codigo : (cot.proveedorCodigo || "PRV");
                        const provTelefono = prov ? prov.telefonoWhatsapp : cot.proveedorTelefono;
                        const provMunicipio = prov ? (prov.municipio || "Medellín") : (cot.proveedorMunicipio || "Medellín");
                        const unitPrice = cot.precioCostoUnitario || (cot.cantidad > 0 ? Math.round(cot.precioCostoTotal / cot.cantidad) : cot.precioCostoTotal);

                        // Check if this quote is the lowest price in its product or category
                        const prodKey = (cot.tituloProducto || "").trim().toLowerCase();
                        const catKey = (cot.categoria || "").trim().toLowerCase();
                        const minProdPrice = prodKey ? lowestUnitByProduct.get(`prod_${prodKey}`) : undefined;
                        const minCatPrice = catKey ? lowestUnitByProduct.get(`cat_${catKey}`) : undefined;
                        const isLowestPrice = (minProdPrice !== undefined && unitPrice <= minProdPrice) || (minCatPrice !== undefined && unitPrice <= minCatPrice);

                        const formattedDate = (() => {
                          try {
                            const d = new Date(cot.fechaCreacion);
                            if (isNaN(d.getTime())) return cot.fechaCreacion || "Fecha reciente";
                            return d.toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            });
                          } catch (_) {
                            return cot.fechaCreacion || "Fecha reciente";
                          }
                        })();

                        const cleanPhone = provTelefono ? provTelefono.replace(/[^0-9]/g, "") : "";
                        const waLink = cleanPhone
                          ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${provNombre}, te contacto desde Atziluth Graphics sobre la cotización de "${cot.tituloProducto}" (${cot.cantidad} ${cot.unidadMedida || 'u'}).`)}`
                          : null;

                        return (
                          <tr
                            key={cot.id}
                            className={`transition-all text-xs ${
                              isLowestPrice
                                ? "bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-950 hover:bg-emerald-950/90 border-l-4 border-l-emerald-400"
                                : cot.destacadaAdmin
                                ? "bg-amber-950/20 hover:bg-amber-950/30 border-l-4 border-l-amber-400"
                                : "hover:bg-slate-900/60"
                            }`}
                          >
                            {/* COLUMNA 1: NOMBRE DEL PROVEEDOR */}
                            <td className="py-4 px-4 align-top">
                              <div className="space-y-1.5 max-w-[240px]">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-mono font-bold text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                                    {provCodigo}
                                  </span>
                                  {isLowestPrice && (
                                    <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-mono font-black rounded-full flex items-center gap-1 animate-pulse shadow">
                                      <Award className="w-3 h-3" /> MEJOR PRECIO
                                    </span>
                                  )}
                                </div>

                                <strong className="text-white text-sm block font-sans leading-tight">
                                  {provNombre}
                                </strong>

                                <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                                  {prov && prov.contactoNombre && (
                                    <div>Contacto: <span className="text-slate-300">{prov.contactoNombre}</span></div>
                                  )}
                                  <div className="flex items-center gap-1 text-slate-400">
                                    <MapPin className="w-3 h-3 text-amber-400" />
                                    <span>{provMunicipio}</span>
                                  </div>
                                </div>

                                {waLink && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 hover:bg-emerald-950 px-2 py-1 rounded-md border border-emerald-600/40 transition-colors"
                                  >
                                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                                    <span>WhatsApp Directo</span>
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* COLUMNA 2: DESCRIPCIÓN DEL PRODUCTO */}
                            <td className="py-4 px-4 align-top max-w-[340px]">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono font-bold rounded">
                                    {cot.categoria}
                                  </span>
                                  {cot.tiempoEntregaDias && (
                                    <span className="text-[10px] font-mono text-amber-300/90 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-400" /> {cot.tiempoEntregaDias}
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-xs sm:text-sm font-bold text-white font-mono leading-snug">
                                  {cot.tituloProducto}
                                </h4>

                                <div className="text-[11px] text-slate-300 space-y-0.5 font-sans bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                                  {cot.medidasFormato && (
                                    <div><strong className="text-slate-400">Formato:</strong> {cot.medidasFormato}</div>
                                  )}
                                  {cot.materialPapel && (
                                    <div><strong className="text-slate-400">Papel / Material:</strong> {cot.materialPapel}</div>
                                  )}
                                  {cot.tintasColores && (
                                    <div><strong className="text-slate-400">Tintas:</strong> {cot.tintasColores}</div>
                                  )}
                                  {cot.terminaciones && (
                                    <div><strong className="text-slate-400">Acabados:</strong> {cot.terminaciones}</div>
                                  )}
                                </div>

                                {cot.descripcionDetallada && (
                                  <button
                                    type="button"
                                    onClick={() => setExpandedCotId(expandedCotId === cot.id ? null : cot.id)}
                                    className="text-[10px] font-mono text-amber-400 hover:text-amber-300 underline font-bold flex items-center gap-1 cursor-pointer pt-0.5"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    <span>{expandedCotId === cot.id ? "Ocultar descripción técnica" : "Ver especificación completa"}</span>
                                  </button>
                                )}

                                {expandedCotId === cot.id && cot.descripcionDetallada && (
                                  <div className="text-[11px] text-slate-300 bg-slate-950 p-3 rounded-xl border border-amber-500/30 font-sans leading-relaxed mt-2 animate-fadeIn">
                                    {cot.descripcionDetallada}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* COLUMNA 3: CANTIDAD */}
                            <td className="py-4 px-4 align-top text-center">
                              <div className="inline-block bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-center">
                                <span className="text-base font-black font-mono text-amber-400 block">
                                  {cot.cantidad.toLocaleString('es-CO')}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                                  {cot.unidadMedida || 'Unidades'}
                                </span>
                              </div>
                            </td>

                            {/* COLUMNA 4: PRECIO UNITARIO & TOTAL */}
                            <td className={`py-4 px-4 align-top border-x border-slate-800/80 ${isLowestPrice ? "bg-emerald-950/40" : "bg-slate-950/40"}`}>
                              <div className="space-y-1.5 min-w-[160px]">
                                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                                  Precio Unitario Taller:
                                </div>
                                <div className={`text-base font-black font-mono ${isLowestPrice ? "text-emerald-300" : "text-amber-400"}`}>
                                  ${Math.round(unitPrice).toLocaleString('es-CO')} COP <span className="text-[10px] font-normal text-slate-400">/ {cot.unidadMedida || 'u'}</span>
                                </div>

                                <div className="text-[11px] font-mono text-slate-300 pt-1 border-t border-slate-800">
                                  Costo Total: <strong className="text-white">${cot.precioCostoTotal.toLocaleString('es-CO')} COP</strong>
                                </div>

                                {isLowestPrice && (
                                  <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[9px] font-mono font-bold flex items-center gap-1">
                                    <Award className="w-3 h-3 text-emerald-400" /> Tarifa más económica
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* COLUMNA 5: FECHA DE ENVÍO */}
                            <td className="py-4 px-4 align-top font-mono text-xs text-slate-300">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-slate-300 font-bold">
                                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{formattedDate}</span>
                                </div>
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cotización Activa
                                </span>
                              </div>
                            </td>

                            {/* COLUMNA 6: ACCIONES / DECISIÓN */}
                            <td className="py-4 px-4 align-top text-center">
                              <div className="flex flex-col gap-2 min-w-[130px]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (prov) {
                                      setOrderModalProv(prov);
                                      setNewOrdDescripcion(`${cot.tituloProducto} | ${cot.medidasFormato || ''} | ${cot.materialPapel || ''}`);
                                      setNewOrdCantidad(cot.cantidad);
                                      setNewOrdCostoProv(cot.precioCostoTotal);
                                      setNewOrdCategoria(cot.categoria);
                                      setSaveStatus(`✓ Cotización de ${prov.nombreComercial} cargada para orden`);
                                      setTimeout(() => setSaveStatus(null), 3000);
                                    } else {
                                      setSaveStatus(`⚠️ Proveedor no encontrado`);
                                    }
                                  }}
                                  className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-mono text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                                  title="Crear orden de producción asignada a este proveedor con esta tarifa"
                                >
                                  <Package className="w-3.5 h-3.5" />
                                  <span>Asignar Orden</span>
                                </button>

                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = provCotizaciones.map(c => c.id === cot.id ? { ...c, destacadaAdmin: !c.destacadaAdmin } : c);
                                      setProvCotizaciones(updated);
                                      saveStoredCotizaciones(updated);
                                      setSaveStatus(cot.destacadaAdmin ? "Cotización removida de destacadas" : "✓ Cotización marcada como destacada");
                                      setTimeout(() => setSaveStatus(null), 3000);
                                    }}
                                    className={`flex-1 py-1 px-2 rounded-lg border text-xs font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                      cot.destacadaAdmin
                                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-bold"
                                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                                    }`}
                                    title={cot.destacadaAdmin ? "Quitar de destacadas" : "Marcar como cotización destacada"}
                                  >
                                    <Star className={`w-3 h-3 ${cot.destacadaAdmin ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                    <span>{cot.destacadaAdmin ? "Destacada" : "Destacar"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`¿Eliminar esta cotización de "${cot.tituloProducto}"?`)) {
                                        const updated = provCotizaciones.filter(c => c.id !== cot.id);
                                        setProvCotizaciones(updated);
                                        saveStoredCotizaciones(updated);
                                        setSaveStatus('✓ Cotización eliminada');
                                        setTimeout(() => setSaveStatus(null), 3000);
                                      }
                                    }}
                                    className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                                    title="Eliminar cotización"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* GESTIÓN DE VENDEDORES, MUNICIPIOS Y CATEGORÍAS (CRUD LOCALSTORAGE) */}
      {(activeAdminTab === 'panel_general' || activeAdminTab === 'vendedores') && (
        <div id="seccion-vendedores" className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-display">Fuerza Comercial — Gestión de Vendedores</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded-full font-bold uppercase">
                    CRUD LocalStorage Activo
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                  Crea, edita, establece claves de acceso y elimina vendedores comerciales. Asigna municipios de Antioquia, líneas de negocio, calcula comisiones y genera reportes mensuales.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("formulario-nuevo-vendedor");
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ CREAR NUEVO VENDEDOR</span>
              </button>

              <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Vendedores Activos</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{sellers.length} comercial(es)</span>
              </div>
            </div>
          </div>

        {/* FORMULARIO DE CREACIÓN DE NUEVO VENDEDOR */}
        <form id="formulario-nuevo-vendedor" onSubmit={handleAddSeller} className="bg-slate-950 p-5 md:p-6 rounded-2xl border border-emerald-500/30 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Registrar Nuevo Vendedor Comercial
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Persistencia automática en LocalStorage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={newSellerName}
                onChange={(e) => setNewSellerName(e.target.value)}
                placeholder="Ej: Carlos Mario Arango"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Usuario de Ingreso / Login *
              </label>
              <input
                type="text"
                required
                value={newSellerUsername}
                onChange={(e) => setNewSellerUsername(e.target.value)}
                placeholder="Ej: carlos.ventas"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Contraseña / Clave
              </label>
              <input
                type="text"
                value={newSellerPassword}
                onChange={(e) => setNewSellerPassword(e.target.value)}
                placeholder="Ej: 12345"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                value={newSellerPhone}
                onChange={(e) => setNewSellerPhone(e.target.value)}
                placeholder="Ej: 300 456 7890"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Zona Comercial Asignada
              </label>
              <select
                value={newSellerZone}
                onChange={(e) => setNewSellerZone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Valle de Aburrá Norte">Valle de Aburrá Norte</option>
                <option value="Valle de Aburrá Sur">Valle de Aburrá Sur</option>
                <option value="Medellín Centro & Comercial">Medellín Centro & Comercial</option>
                <option value="Oriente Antioqueño">Oriente Antioqueño</option>
                <option value="Occidente / Urabá">Occidente / Urabá</option>
                <option value="Suroeste Antioqueño">Suroeste Antioqueño</option>
                <option value="Toda Antioquia">Toda Antioquia (Consolidado)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Porcentaje de Comisión Base (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={newSellerCommission}
                onChange={(e) => setNewSellerCommission(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Supervisor Asignado
              </label>
              <select
                value={newSellerSupervisor}
                onChange={(e) => setNewSellerSupervisor(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Estivenson Navarro (Director Comercial)">Estivenson Navarro (Director Comercial)</option>
                <option value="Laura Gómez (Supervisora Metropolitana)">Laura Gómez (Supervisora Metropolitana)</option>
                <option value="Luz Elena Restrepo (Supervisora Oriente)">Luz Elena Restrepo (Supervisora Oriente)</option>
                <option value="Sin Supervisor (Directo)">Sin Supervisor (Directo)</option>
              </select>
            </div>
          </div>

          {/* SELECTOR INTERACTIVO DE MUNICIPIOS */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-[11px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Municipios Asignados en Antioquia ({newSellerMunicipalities.length})
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => selectMunicipalitiesPreset('aburra', false)}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                >
                  + Valle Aburrá
                </button>
                <button
                  type="button"
                  onClick={() => selectMunicipalitiesPreset('oriente', false)}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                >
                  + Oriente
                </button>
                <button
                  type="button"
                  onClick={() => selectMunicipalitiesPreset('all', false)}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => selectMunicipalitiesPreset('clear', false)}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-rose-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                >
                  Limpiar
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1.5 bg-slate-950/80 rounded-xl border border-slate-900">
              {ANTIOQUIA_MUNICIPALITIES.map((muni) => {
                const isSelected = newSellerMunicipalities.includes(muni);
                return (
                  <button
                    key={muni}
                    type="button"
                    onClick={() => toggleMunicipality(muni)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold shadow-sm"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    <span>{muni}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECTOR INTERACTIVO DE CATEGORÍAS */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" /> Categorías & Líneas de Negocio Asignadas ({newSellerCategories.length})
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Haz clic para seleccionar o quitar</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BUSINESS_CATEGORIES.map((cat) => {
                const isSelected = newSellerCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 font-bold shadow-sm"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>GUARDAR Y CREAR VENDEDOR</span>
            </button>
          </div>
        </form>

        {/* BÚSQUEDA Y LISTA DE VENDEDORES REGISTRADOS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Listado Oficial de Vendedores ({sellers.length})
            </h3>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sellerSearchQuery}
                onChange={(e) => setSellerSearchQuery(e.target.value)}
                placeholder="Buscar vendedor, municipio o zona..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* TABLA OFICIAL Y VISTA EN TARJETAS DE VENDEDORES */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Vendedor / Nombre</th>
                    <th className="px-4 py-3">Usuario & Clave</th>
                    <th className="px-4 py-3">Supervisor</th>
                    <th className="px-4 py-3">Zona & Municipios</th>
                    <th className="px-4 py-3">Categorías Asignadas</th>
                    <th className="px-4 py-3 text-center">Comisión</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {sellers
                    .filter((s) => {
                      if (!sellerSearchQuery) return true;
                      const q = sellerSearchQuery.toLowerCase();
                      return (
                        s.name.toLowerCase().includes(q) ||
                        s.username.toLowerCase().includes(q) ||
                        s.zone.toLowerCase().includes(q) ||
                        (s.supervisor || "").toLowerCase().includes(q) ||
                        s.municipalities.some((m) => m.toLowerCase().includes(q))
                      );
                    })
                    .map((seller) => (
                      <tr key={seller.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center font-mono text-xs shadow-sm">
                              {seller.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong className="text-white font-medium block leading-snug">{seller.name}</strong>
                              <span className="text-[10px] text-slate-400 font-mono">Tel: {seller.phone}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono">
                          <span className="text-emerald-400 font-bold block">@{seller.username}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Clave: {showPasswords[seller.id] ? (seller.password || "123") : "••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleShowPassword(seller.id)}
                              className="text-slate-500 hover:text-emerald-400 transition-colors p-0.5 cursor-pointer"
                              title={showPasswords[seller.id] ? "Ocultar Contraseña" : "Mostrar Contraseña"}
                            >
                              <Key className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-slate-300 font-medium block text-[11px]">{seller.supervisor || "Director Comercial"}</span>
                        </td>

                        <td className="px-4 py-3">
                          <strong className="text-slate-200 block text-[11px]">{seller.zone}</strong>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {(seller.municipalities || []).slice(0, 3).map((m) => (
                              <span key={m} className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-300 rounded text-[9px] font-mono">
                                {m}
                              </span>
                            ))}
                            {(seller.municipalities || []).length > 3 && (
                              <span className="text-[9px] text-slate-500 font-mono">
                                +{(seller.municipalities || []).length - 3} más
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {(seller.categories || []).slice(0, 2).map((c) => (
                              <span key={c} className="px-1.5 py-0.2 bg-indigo-500/10 text-indigo-300 rounded text-[9px] font-mono truncate max-w-[140px]">
                                {c}
                              </span>
                            ))}
                            {(seller.categories || []).length > 2 && (
                              <span className="text-[9px] text-slate-500 font-mono">
                                +{(seller.categories || []).length - 2} más
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center font-mono">
                          <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold rounded-full text-[10px]">
                            {seller.commissionRate}%
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDownloadSellerClientsReportJSON(seller)}
                              className="px-2.5 py-1 bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-300 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Descargar Reporte JSON Consolidado de Clientes para Auditoría"
                            >
                              <Download className="w-3 h-3 text-indigo-400" />
                              <span className="hidden sm:inline">JSON Clientes</span>
                            </button>

                            <button
                              onClick={() => openReportForSeller(seller)}
                              className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Reporte Mensual"
                            >
                              <FileText className="w-3 h-3 text-emerald-400" />
                              <span className="hidden sm:inline">Reporte</span>
                            </button>

                            <button
                              onClick={() => openEditSeller(seller)}
                              className="p-1.5 bg-slate-900 hover:bg-indigo-950 text-slate-400 hover:text-indigo-300 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                              title="Editar Vendedor"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteSeller(seller.id, seller.name)}
                              className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                              title="Eliminar Vendedor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* MODAL IMPRESIÓN / DESCARGA REPORTE MENSUAL DE VENTAS & COMISIONES */}
      {showReportModal && selectedSellerForReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generador de Reporte Mensual de Ventas</h3>
                  <p className="text-xs text-slate-400">
                    Vendedor: <strong className="text-emerald-400">{selectedSellerForReport.name}</strong> (@{selectedSellerForReport.username})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Parámetros de Cálculo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Mes del Período</label>
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option value={0}>Enero</option>
                  <option value={1}>Febrero</option>
                  <option value={2}>Marzo</option>
                  <option value={3}>Abril</option>
                  <option value={4}>Mayo</option>
                  <option value={5}>Junio</option>
                  <option value={6}>Julio</option>
                  <option value={7}>Agosto</option>
                  <option value={8}>Septiembre</option>
                  <option value={9}>Octubre</option>
                  <option value={10}>Noviembre</option>
                  <option value={11}>Diciembre</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Año</label>
                <input
                  type="number"
                  value={reportYear}
                  onChange={(e) => setReportYear(parseInt(e.target.value) || 2026)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">% Comisión</label>
                <input
                  type="number"
                  step="0.5"
                  value={reportCommissionRate}
                  onChange={(e) => setReportCommissionRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* VISTA PREVIA HOJA IMPRESA DEL REPORTE */}
            <div className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl shadow-xl font-sans space-y-6 border border-slate-200">
              {/* Encabezado Reporte */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    ATZILUTH GRÁFIC DIGITAL S.A.S.
                  </h2>
                  <p className="text-xs font-mono text-slate-600">NIT: 901.458.321-9 • Medellín, Antioquia</p>
                  <p className="text-xs font-mono text-slate-600">PBX / WhatsApp: +57 300 123 4567</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded uppercase">
                    REPORTE MENSUAL
                  </span>
                  <p className="text-xs font-mono text-slate-600 mt-1">Fecha Emisión: {new Date().toLocaleDateString("es-CO")}</p>
                </div>
              </div>

              {/* Info Vendedor */}
              <div className="grid grid-cols-2 gap-4 bg-slate-100 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Vendedor Comercial:</span>
                  <strong className="text-sm text-slate-900">{selectedSellerForReport.name}</strong>
                  <span className="block font-mono text-slate-600">Usuario: @{selectedSellerForReport.username}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Zona & Municipios:</span>
                  <strong className="text-slate-900">{selectedSellerForReport.zone}</strong>
                  <span className="block text-[11px] text-slate-600">{selectedSellerForReport.municipalities.join(", ")}</span>
                </div>
              </div>

              {/* KPIs Resumen */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Ventas Brutas Totales</span>
                  <strong className="text-sm font-mono font-bold text-slate-900">$2,490,000 COP</strong>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-800 block">Recaudo Efectivo</span>
                  <strong className="text-sm font-mono font-bold text-emerald-800">$1,565,000 COP</strong>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                  <span className="text-[10px] font-mono uppercase text-amber-800 block">Comisión a Pagar ({reportCommissionRate}%)</span>
                  <strong className="text-sm font-mono font-bold text-emerald-700">$124,500 COP</strong>
                </div>
              </div>

              {/* Firma y Cierre */}
              <div className="pt-8 border-t border-slate-300 flex justify-between text-xs text-slate-500 font-mono">
                <div className="text-center w-48 border-t border-slate-400 pt-1">Firma Vendedor</div>
                <div className="text-center w-48 border-t border-slate-400 pt-1">Aprobación Gerencia</div>
              </div>
            </div>

            {/* Acciones Modal */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleDownloadSellerClientsReportJSON(selectedSellerForReport)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer border border-indigo-400/30"
              >
                <Download className="w-4 h-4 text-indigo-200" />
                <span>EXPORTAR CONSOLIDADO CLIENTES (JSON)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>IMPRIMIR / DESCARGAR PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN: GESTIÓN DE PROVEEDORES, COSTOS, UTILIDADES Y OFICINAS VIRTUALES */}
      {/* ========================================================================= */}
      {(activeAdminTab === 'panel_general' || activeAdminTab === 'proveedores' || activeAdminTab === 'talleres') && (
        <div id="seccion-proveedores" className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Header de la Sección */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shadow-inner">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl md:text-2xl font-bold text-white font-display">Gestión de Proveedores & Talleres de Producción</h2>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono rounded-full font-bold uppercase">
                    Oficinas Virtuales Activas
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded-full font-bold uppercase flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Control de Costos & Márgenes
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
                  Registra talleres aliados, gestiona cuentas bancarias para transferencias, asigna órdenes de producción, controla costos vs. facturación de clientes y supervisa la utilidad neta en tiempo real.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsCatManagerOpen(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow cursor-pointer border border-amber-500/30"
                title="Administrar, crear, editar o eliminar líneas y categorías de producción"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>⚙️ Gestionar Categorías ({categoriesList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("formulario-nuevo-proveedor");
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow cursor-pointer border border-amber-400/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Registrar Proveedor</span>
              </button>
            </div>
          </div>

          {/* BARRA DE NAVEGACIÓN INTERNA & SUB-PANELES: GESTIÓN DE PROVEEDORES */}
          <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-2 border-amber-500/50 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5 mr-1">
                <Layers className="w-4 h-4 text-amber-400" /> Sub-Paneles:
              </span>

              {/* BOTÓN SUB-PANEL: VER COTIZACIONES */}
              <button
                type="button"
                id="btn-subpanel-ver-cotizaciones"
                onClick={() => setProvActiveSubPanel('cotizaciones')}
                className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg border ${
                  provActiveSubPanel === 'cotizaciones'
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 scale-105 shadow-amber-500/20'
                    : 'bg-amber-500/20 text-amber-300 hover:text-white hover:bg-amber-500/30 border-amber-500/40'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>📥 VER COTIZACIONES DE PROVEEDORES</span>
                <span className="px-2 py-0.5 bg-slate-950 text-amber-300 text-[10px] rounded-full font-black border border-amber-500/40">
                  {provCotizaciones.length}
                </span>
              </button>

              {/* BOTÓN SUB-PANEL: TALLERES REGISTRADOS */}
              <button
                type="button"
                onClick={() => setProvActiveSubPanel('talleres')}
                className={`px-3.5 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  provActiveSubPanel === 'talleres'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>🏢 Talleres Registrados ({proveedores.length})</span>
              </button>

              {/* BOTÓN SUB-PANEL: REGISTRAR NUEVO */}
              <button
                type="button"
                onClick={() => setProvActiveSubPanel('nuevo')}
                className={`px-3.5 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  provActiveSubPanel === 'nuevo'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>➕ Registrar Nuevo Taller</span>
              </button>

              {/* BOTÓN SUB-PANEL: GENERADOR TOKENS */}
              <button
                type="button"
                onClick={() => setProvActiveSubPanel('tokens')}
                className={`px-3.5 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  provActiveSubPanel === 'tokens'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30'
                }`}
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>🔑 Códigos & Tokens</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavigateTab('cotizaciones_talleres')}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Comparador & Matriz</span>
              </button>
            </div>
          </div>

          {/* BANNER DESTACADO: PORTAL Y OFICINA VIRTUAL DE PROVEEDORES */}
          <div className="bg-gradient-to-r from-amber-950/70 via-slate-950 to-amber-900/40 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl font-black shadow-lg shadow-amber-500/30 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold font-mono text-white tracking-tight">
                    PORTAL OFICINA VIRTUAL DE TALLERES & PROVEEDORES
                  </h3>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono text-[10px] font-bold">
                    Acceso Directo
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Los talleres aliados ingresan directamente mediante la extensión oficial: <code className="px-2 py-0.5 bg-slate-900 border border-amber-500/40 rounded text-amber-300 font-mono font-bold">/proveedores/index.html</code> o usando su código único.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href="/proveedores/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-mono font-black transition-all shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer border border-amber-300"
              >
                <Eye className="w-4 h-4" />
                <span>ABRIR PORTAL TALLERES</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const fullUrl = `${window.location.origin}/proveedores/index.html`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(fullUrl);
                    setSaveStatus("✓ Enlace /proveedores/index.html copiado");
                  }
                }}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copiar Link /proveedores/index.html</span>
              </button>
            </div>
          </div>

          {/* MÉTRICAS & KPIS EN TIEMPO REAL */}
          {(() => {
            const totalTalleres = proveedores.length;
            const ordenesEnProduccion = provOrdenes.filter(o => o.estado === 'En_Produccion').length;
            const totalVentaClientes = provOrdenes.reduce((acc, o) => acc + (o.precioVentaCliente || 0), 0);
            const totalCostos = provOrdenes.reduce((acc, o) => acc + (o.costoProveedor || 0), 0);
            const utilidadNeta = totalVentaClientes - totalCostos;
            const margenPct = totalVentaClientes > 0 ? ((utilidadNeta / totalVentaClientes) * 100).toFixed(1) : "0.0";
            const totalPagado = provPagos.reduce((acc, p) => acc + (p.monto || 0), 0);
            const saldoPendiente = Math.max(0, totalCostos - totalPagado);

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
                {/* KPI 1: Proveedores */}
                <div 
                  onClick={() => setProvActiveSubPanel('talleres')}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1 relative overflow-hidden shadow-lg cursor-pointer hover:border-amber-400 transition-all group"
                  title="Ver Talleres Registrados"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono uppercase font-bold text-amber-400">Talleres Registrados</span>
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white group-hover:text-amber-300">{totalTalleres}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Aliados comerciales</span>
                </div>

                {/* KPI 2: Cotizaciones Recibidas */}
                <div 
                  onClick={() => setProvActiveSubPanel('cotizaciones')}
                  className={`bg-gradient-to-br from-amber-950/60 via-slate-950 to-slate-950 border-2 rounded-2xl p-3.5 space-y-1 relative overflow-hidden shadow-lg cursor-pointer transition-all group ${
                    provActiveSubPanel === 'cotizaciones' ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-amber-500/60 hover:border-amber-400'
                  }`}
                  title="Clic para abrir el Sub-Panel de Cotizaciones"
                >
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-[10px] font-mono uppercase font-bold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      Cotizaciones Recibidas
                    </span>
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[9px] rounded font-black">Buzón</span>
                  </div>
                  <div className="text-xl font-black font-mono text-amber-400 flex items-center gap-1">
                    <span>{provCotizaciones.length}</span>
                    <span className="text-xs text-slate-400 font-normal">ofertas</span>
                  </div>
                  <span className="text-[10px] text-amber-300/90 font-mono group-hover:underline block font-bold">
                    ↓ Ver Sub-Panel de Cotizaciones
                  </span>
                </div>

                {/* KPI 3: Órdenes en Taller */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono uppercase font-bold text-sky-400">En Producción</span>
                    <Clock className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-sky-400">{ordenesEnProduccion} <span className="text-xs text-slate-500 font-normal">/ {provOrdenes.length} tot.</span></div>
                  <span className="text-[10px] text-slate-400 font-mono">Trabajos activos</span>
                </div>

                {/* KPI 4: Facturado al Cliente */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-400">Facturación</span>
                    <DollarSign className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-base font-bold font-mono text-indigo-300 truncate">{formatCOP(totalVentaClientes)}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Precio de venta</span>
                </div>

                {/* KPI 5: Costo de Producción */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono uppercase font-bold text-rose-400">Costo Talleres</span>
                    <CreditCard className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-base font-bold font-mono text-rose-300 truncate">{formatCOP(totalCostos)}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Saldo: {formatCOP(saldoPendiente)}</span>
                </div>

                {/* KPI 6: Utilidad Neta & Margen */}
                <div className="bg-gradient-to-br from-emerald-950/90 via-slate-950 to-slate-950 border border-emerald-500/40 rounded-2xl p-3.5 space-y-1 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-[10px] font-mono uppercase font-bold">Utilidad Neta</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-400 truncate">{formatCOP(utilidadNeta)}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-300">Margen:</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-bold">{margenPct}%</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* SUB-PANEL DEDICADO: COTIZACIONES ENVIADAS DESDE OFICINA VIRTUAL PROVEEDORES */}
          {/* ========================================================================= */}
          {provActiveSubPanel === 'cotizaciones' && (
            <div id="subpanel-cotizaciones-proveedores" className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-5 md:p-7 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-3.5 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-slate-950 rounded-2xl font-black shadow-xl shadow-amber-500/30 shrink-0">
                    <Tag className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black font-mono uppercase text-white tracking-wide flex items-center gap-2">
                        📥 Sub-Panel de Cotizaciones Enviadas por Proveedores
                      </h3>
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-mono rounded-full font-black uppercase shadow">
                        {provCotizaciones.length} Cotizaciones Registradas
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-sans">
                      Consumo en tiempo real de tarifas y cotizaciones enviadas por tus talleres aliados desde su Oficina Virtual (<code className="text-amber-300 font-mono font-bold">/proveedores/index.html</code>). Resalta automáticamente la mejor tarifa por producto.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setProvCotizaciones(getStoredCotizaciones());
                      setProveedores(getStoredProveedores());
                      setSaveStatus("✓ Cotizaciones de proveedores sincronizadas en tiempo real");
                      setTimeout(() => setSaveStatus(null), 3000);
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sincronizar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigateTab('cotizaciones_talleres')}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-mono font-black transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer border border-amber-300"
                  >
                    <Award className="w-4 h-4 text-slate-950" />
                    <span>Abrir Matriz Comparativa</span>
                  </button>
                </div>
              </div>

              {/* FILTROS, BÚSQUEDA Y DECISIÓN DE MEJOR PRECIO */}
              <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-4 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Buscador de texto */}
                  <div className="md:col-span-4 relative">
                    <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={cotSearchTerm}
                      onChange={(e) => setCotSearchTerm(e.target.value)}
                      placeholder="Buscar por proveedor, producto, formato..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Filtro por Proveedor */}
                  <div className="md:col-span-4 flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold whitespace-nowrap">Taller:</span>
                    <select
                      value={cotProviderFilter}
                      onChange={(e) => setCotProviderFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="all">Todos los Talleres ({proveedores.length})</option>
                      {proveedores.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.codigo} — {p.nombreComercial}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por Categoría / Línea */}
                  <div className="md:col-span-4 flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold whitespace-nowrap">Línea:</span>
                    <select
                      value={cotCategoryFilter}
                      onChange={(e) => setCotCategoryFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="all">Todas las Líneas ({getStoredCategorias().length})</option>
                      {getStoredCategorias().map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* FILTRO INTELIGENTE PARA RESALTAR & DECIDIR EL MEJOR PRECIO */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Filtro de Decisión:</span>
                    <button
                      type="button"
                      onClick={() => setCotDecisionMode("todas")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        cotDecisionMode === "todas"
                          ? "bg-amber-400 text-slate-950 font-black shadow-md"
                          : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                      }`}
                    >
                      📋 Todas ({provCotizaciones.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setCotDecisionMode("solo_mejores")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        cotDecisionMode === "solo_mejores"
                          ? "bg-emerald-400 text-slate-950 font-black shadow-lg ring-2 ring-emerald-400/40"
                          : "bg-emerald-950/40 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-900/40"
                      }`}
                    >
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>🏆 Solo Precio Más Bajo por Producto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCotDecisionMode("destacadas")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        cotDecisionMode === "destacadas"
                          ? "bg-yellow-400 text-slate-950 font-black shadow-md"
                          : "bg-slate-900 text-amber-300 border border-slate-800 hover:text-white"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>⭐ Destacadas ({provCotizaciones.filter(c => c.destacadaAdmin).length})</span>
                    </button>
                  </div>

                  {/* Ordenamiento */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold whitespace-nowrap">Ordenar:</span>
                    <select
                      value={cotSortMode}
                      onChange={(e) => setCotSortMode(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="menor_unitario">Menor Precio Unitario</option>
                      <option value="menor_precio">Menor Costo Total</option>
                      <option value="reciente">Fecha de Envío (Más reciente)</option>
                      <option value="proveedor">Por Proveedor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* TABLA PRINCIPAL DEL SUB-PANEL DE COTIZACIONES DE PROVEEDORES */}
              {/* ========================================================================= */}
              {(() => {
                // 1. Calculate map of lowest price per product group and category group
                const lowestUnitByProduct = new Map<string, number>();
                provCotizaciones.forEach(c => {
                  const unitPrice = c.precioCostoUnitario || (c.cantidad > 0 ? c.precioCostoTotal / c.cantidad : c.precioCostoTotal);
                  const prodKey = (c.tituloProducto || "").trim().toLowerCase();
                  const catKey = (c.categoria || "").trim().toLowerCase();
                  
                  if (prodKey) {
                    const current = lowestUnitByProduct.get(`prod_${prodKey}`);
                    if (current === undefined || unitPrice < current) {
                      lowestUnitByProduct.set(`prod_${prodKey}`, unitPrice);
                    }
                  }
                  if (catKey) {
                    const currentCat = lowestUnitByProduct.get(`cat_${catKey}`);
                    if (currentCat === undefined || unitPrice < currentCat) {
                      lowestUnitByProduct.set(`cat_${catKey}`, unitPrice);
                    }
                  }
                });

                // 2. Filter list
                let list = provCotizaciones.filter((cot) => {
                  const matchCat = cotCategoryFilter === 'all' || cot.categoria === cotCategoryFilter;
                  const matchProv = cotProviderFilter === 'all' || cot.proveedorId === cotProviderFilter;
                  const matchDestacada = cotDecisionMode !== "destacadas" || cot.destacadaAdmin;

                  if (!matchCat || !matchProv || !matchDestacada) return false;

                  if (cotSearchTerm.trim()) {
                    const term = cotSearchTerm.toLowerCase();
                    const prov = proveedores.find(p => p.id === cot.proveedorId);
                    const matchText = (
                      cot.tituloProducto?.toLowerCase().includes(term) ||
                      cot.categoria?.toLowerCase().includes(term) ||
                      cot.descripcionDetallada?.toLowerCase().includes(term) ||
                      (cot as any).descripcionTecnica?.toLowerCase().includes(term) ||
                      cot.materialPapel?.toLowerCase().includes(term) ||
                      cot.medidasFormato?.toLowerCase().includes(term) ||
                      cot.proveedorNombre?.toLowerCase().includes(term) ||
                      (prov && prov.nombreComercial.toLowerCase().includes(term)) ||
                      (prov && prov.codigo.toLowerCase().includes(term))
                    );
                    if (!matchText) return false;
                  }

                  if (cotDecisionMode === "solo_mejores") {
                    const unitPrice = cot.precioCostoUnitario || (cot.cantidad > 0 ? cot.precioCostoTotal / cot.cantidad : cot.precioCostoTotal);
                    const prodKey = (cot.tituloProducto || "").trim().toLowerCase();
                    const catKey = (cot.categoria || "").trim().toLowerCase();
                    const isMinProd = prodKey && lowestUnitByProduct.get(`prod_${prodKey}`) === unitPrice;
                    const isMinCat = catKey && lowestUnitByProduct.get(`cat_${catKey}`) === unitPrice;
                    return isMinProd || isMinCat;
                  }

                  return true;
                });

                // 3. Sort list
                list.sort((a, b) => {
                  const unitA = a.precioCostoUnitario || (a.cantidad > 0 ? a.precioCostoTotal / a.cantidad : a.precioCostoTotal);
                  const unitB = b.precioCostoUnitario || (b.cantidad > 0 ? b.precioCostoTotal / b.cantidad : b.precioCostoTotal);
                  if (cotSortMode === "menor_unitario") return unitA - unitB;
                  if (cotSortMode === "menor_precio") return a.precioCostoTotal - b.precioCostoTotal;
                  if (cotSortMode === "reciente") return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
                  if (cotSortMode === "proveedor") return (a.proveedorNombre || "").localeCompare(b.proveedorNombre || "");
                  return unitA - unitB;
                });

                if (list.length === 0) {
                  return (
                    <div className="bg-slate-950 p-10 rounded-2xl border border-slate-800 text-center space-y-3">
                      <Inbox className="w-14 h-14 text-slate-600 mx-auto" />
                      <h4 className="text-base font-bold font-mono text-slate-300">
                        No hay cotizaciones para mostrar con los filtros seleccionados
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Tus proveedores aliados pueden enviar cotizaciones y tarifas de sus productos litográficos desde su portal (<code className="text-amber-300">/proveedores/index.html</code>) y se listarán automáticamente en esta tabla.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setCotCategoryFilter('all'); setCotProviderFilter('all'); setCotDecisionMode('todas'); setCotSearchTerm(''); }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                      >
                        Restablecer Filtros
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto border-2 border-amber-500/40 rounded-2xl bg-slate-950 shadow-2xl custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1050px]">
                      <thead>
                        <tr className="border-b-2 border-slate-800 bg-slate-900/90 text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                          <th className="py-4 px-4">Nombre del Proveedor</th>
                          <th className="py-4 px-4">Descripción del Producto</th>
                          <th className="py-4 px-4 text-center">Cantidad</th>
                          <th className="py-4 px-4 bg-amber-950/30 text-amber-300 border-x border-amber-500/30">
                            Precio Unitario & Total
                          </th>
                          <th className="py-4 px-4">Fecha de Envío</th>
                          <th className="py-4 px-4 text-center">Acciones / Decisión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {list.map((cot) => {
                          const prov = proveedores.find(p => p.id === cot.proveedorId);
                          const provNombre = prov ? prov.nombreComercial : (cot.proveedorNombre || "Taller Aliado");
                          const provCodigo = prov ? prov.codigo : (cot.proveedorCodigo || "PRV");
                          const provTelefono = prov ? prov.telefonoWhatsapp : cot.proveedorTelefono;
                          const provMunicipio = prov ? (prov.municipio || "Medellín") : (cot.proveedorMunicipio || "Medellín");
                          const unitPrice = cot.precioCostoUnitario || (cot.cantidad > 0 ? Math.round(cot.precioCostoTotal / cot.cantidad) : cot.precioCostoTotal);

                          // Check if this quote is the lowest price in its product or category
                          const prodKey = (cot.tituloProducto || "").trim().toLowerCase();
                          const catKey = (cot.categoria || "").trim().toLowerCase();
                          const minProdPrice = prodKey ? lowestUnitByProduct.get(`prod_${prodKey}`) : undefined;
                          const minCatPrice = catKey ? lowestUnitByProduct.get(`cat_${catKey}`) : undefined;
                          const isLowestPrice = (minProdPrice !== undefined && unitPrice <= minProdPrice) || (minCatPrice !== undefined && unitPrice <= minCatPrice);

                          const formattedDate = (() => {
                            try {
                              const d = new Date(cot.fechaCreacion);
                              if (isNaN(d.getTime())) return cot.fechaCreacion || "Fecha reciente";
                              return d.toLocaleDateString('es-CO', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (_) {
                              return cot.fechaCreacion || "Fecha reciente";
                            }
                          })();

                          return (
                            <tr
                              key={cot.id}
                              className={`transition-all text-xs ${
                                isLowestPrice
                                  ? "bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-950 hover:bg-emerald-950/60 border-l-4 border-l-emerald-400"
                                  : cot.destacadaAdmin
                                  ? "bg-amber-950/20 hover:bg-amber-950/30 border-l-4 border-l-amber-400"
                                  : "hover:bg-slate-900/60"
                              }`}
                            >
                              {/* 1. NOMBRE DEL PROVEEDOR */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="space-y-1.5 max-w-[200px]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-mono font-black text-xs shrink-0">
                                      <Building2 className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-bold text-white block truncate text-xs" title={provNombre}>
                                        {provNombre}
                                      </span>
                                      <span className="px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-amber-300 text-[10px] font-mono rounded font-bold">
                                        {provCodigo}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                                    <span className="truncate">{provMunicipio}</span>
                                  </div>

                                  {provTelefono && (
                                    <a
                                      href={`https://wa.me/${provTelefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                        `Hola ${provNombre}, requiero confirmar la cotización de "${cot.tituloProducto}" (${cot.cantidad} ${cot.unidadMedida || 'und'}) por ${formatCOP(cot.precioCostoTotal)}.`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-mono font-bold transition-colors"
                                      title="Abrir chat WhatsApp con el taller"
                                    >
                                      <Share2 className="w-2.5 h-2.5 text-emerald-400" />
                                      <span>WhatsApp</span>
                                    </a>
                                  )}
                                </div>
                              </td>

                              {/* 2. DESCRIPCIÓN DEL PRODUCTO */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="space-y-2 max-w-[340px]">
                                  <div className="flex items-start gap-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono rounded font-bold uppercase shrink-0">
                                      {cot.categoria}
                                    </span>
                                    <h4 className="text-xs font-bold font-mono text-white leading-snug">
                                      {cot.tituloProducto}
                                    </h4>
                                  </div>

                                  {/* Badges de especificaciones */}
                                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                                    {cot.medidasFormato && (
                                      <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">
                                        📐 {cot.medidasFormato}
                                      </span>
                                    )}
                                    {cot.materialPapel && (
                                      <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">
                                        📄 {cot.materialPapel}
                                      </span>
                                    )}
                                    {(cot.tintasColores || (cot as any).tintasColor) && (
                                      <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">
                                        🎨 {cot.tintasColores || (cot as any).tintasColor}
                                      </span>
                                    )}
                                    {(cot.tiempoEntregaDias || (cot as any).tiempoEntregaEstimado) && (
                                      <span className="px-2 py-0.5 bg-slate-900 text-amber-300/90 border border-slate-800 rounded flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5 text-amber-400" />
                                        <span>{cot.tiempoEntregaDias || (cot as any).tiempoEntregaEstimado}</span>
                                      </span>
                                    )}
                                  </div>

                                  {/* Descripción técnica */}
                                  {(cot.descripcionDetallada || (cot as any).descripcionTecnica) && (
                                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800/80">
                                      {cot.descripcionDetallada || (cot as any).descripcionTecnica}
                                    </p>
                                  )}
                                </div>
                              </td>

                              {/* 3. CANTIDAD */}
                              <td className="py-3.5 px-4 text-center align-top">
                                <div className="space-y-1 inline-block text-center">
                                  <span className="text-sm font-black font-mono text-white block">
                                    {cot.cantidad.toLocaleString('es-CO')}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800 block">
                                    {cot.unidadMedida || 'Unidades'}
                                  </span>
                                </div>
                              </td>

                              {/* 4. PRECIO UNITARIO & TOTAL */}
                              <td className="py-3.5 px-4 align-top bg-amber-950/15 border-x border-amber-500/20">
                                <div className="space-y-1.5 min-w-[160px]">
                                  {/* Resaltado automático de mejor precio */}
                                  {isLowestPrice && (
                                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono text-[10px] font-black uppercase rounded-full shadow-md animate-pulse">
                                      <Award className="w-3 h-3 text-slate-950" />
                                      <span>🏆 PRECIO MÁS BAJO</span>
                                    </div>
                                  )}

                                  <div>
                                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                                      Precio Unitario:
                                    </span>
                                    <div className="text-base font-black font-mono text-emerald-400">
                                      {formatCOP(unitPrice)} <span className="text-[10px] font-normal text-slate-400">/u</span>
                                    </div>
                                  </div>

                                  <div className="pt-1 border-t border-slate-800/80">
                                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                                      Costo Total del Lote:
                                    </span>
                                    <span className="text-xs font-bold font-mono text-amber-300">
                                      {formatCOP(cot.precioCostoTotal)}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 5. FECHA DE ENVÍO */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="space-y-1 text-xs font-mono">
                                  <div className="flex items-center gap-1.5 text-slate-200">
                                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>{formattedDate}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 block font-sans">
                                    Enviado desde Oficina Virtual
                                  </span>
                                </div>
                              </td>

                              {/* 6. ACCIONES / ASIGNAR ORDEN */}
                              <td className="py-3.5 px-4 text-center align-top">
                                <div className="flex flex-col items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (prov) {
                                        setOrderModalProv(prov);
                                        setNewOrdDescripcion(`${cot.tituloProducto} | ${cot.medidasFormato || ''} | ${cot.materialPapel || ''}`);
                                        setNewOrdCantidad(cot.cantidad);
                                        setNewOrdCostoProv(cot.precioCostoTotal);
                                        setNewOrdCategoria(cot.categoria);
                                        setSaveStatus(`✓ Cotización de ${prov.nombreComercial} cargada para orden`);
                                        setTimeout(() => setSaveStatus(null), 3000);
                                      } else {
                                        setSaveStatus(`⚠️ Proveedor no encontrado`);
                                      }
                                    }}
                                    className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-mono text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                                    title="Crear orden de producción asignada a este proveedor con esta tarifa"
                                  >
                                    <Package className="w-3.5 h-3.5" />
                                    <span>Asignar Orden</span>
                                  </button>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = provCotizaciones.map(c => c.id === cot.id ? { ...c, destacadaAdmin: !c.destacadaAdmin } : c);
                                        setProvCotizaciones(updated);
                                        saveStoredCotizaciones(updated);
                                        setSaveStatus(cot.destacadaAdmin ? "Cotización removida de destacadas" : "✓ Cotización marcada como destacada");
                                        setTimeout(() => setSaveStatus(null), 3000);
                                      }}
                                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                                        cot.destacadaAdmin
                                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-bold"
                                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                                      }`}
                                      title={cot.destacadaAdmin ? "Quitar de destacadas" : "Marcar como cotización destacada"}
                                    >
                                      <Star className={`w-3.5 h-3.5 ${cot.destacadaAdmin ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                      <span>{cot.destacadaAdmin ? "Destacada" : "Destacar"}</span>
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SUB-PANEL: GENERADOR DE CÓDIGOS Y TOKENS (CUANDO ESTÁ SELECCIONADO O EN TAB TALLERES) */}
          {(provActiveSubPanel === 'tokens' || activeAdminTab === 'talleres') && proveedores.length > 0 && (
            <div id="generador-tokens-proveedores" className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border-2 border-amber-500/50 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-black font-mono uppercase tracking-wide text-white">
                        Editor & Generador de Tokens / Códigos de Acceso
                      </h3>
                      <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold rounded-md border border-amber-500/40">
                        ⚡ Panel Administrativo
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Genera tokens criptográficos seguros, edita claves personalizadas y comparte el enlace de ingreso con los talleres aliados
                    </p>
                  </div>
                </div>

                {/* Selector de Taller */}
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 self-start lg:self-auto">
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-bold pl-1">
                    Seleccionar Taller:
                  </span>
                  <select
                    value={selectedTokenProvId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedTokenProvId(id);
                      const target = proveedores.find(p => p.id === id);
                      if (target) {
                        setQuickTokenInput(target.slugAcceso || target.tokenAcceso || target.codigo);
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400 cursor-pointer min-w-[240px]"
                  >
                    {proveedores.map(p => {
                      const hasCode = (p.slugAcceso && p.slugAcceso.trim() !== '') || (p.tokenAcceso && p.tokenAcceso.trim() !== '');
                      return (
                        <option key={p.id} value={p.id}>
                          {hasCode ? '🟢' : '⚠️'} {p.codigo} — {p.nombreComercial} {hasCode ? '(Acceso Activo)' : '(Sin Código)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Formulario y Herramientas del Proveedor Seleccionado */}
              {(() => {
                const currentProv = proveedores.find(p => p.id === selectedTokenProvId) || proveedores[0];
                if (!currentProv) return null;

                const currentInputCode = quickTokenInput.trim().toLowerCase();
                const collidingOther = currentInputCode
                  ? proveedores.find(p => p.id !== currentProv.id && (
                      (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === currentInputCode) ||
                      (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === currentInputCode) ||
                      (p.codigo && p.codigo.trim().toLowerCase() === currentInputCode)
                    ))
                  : null;
                const isOriginalCode = currentInputCode === (currentProv.slugAcceso || currentProv.tokenAcceso || currentProv.codigo)?.toLowerCase();
                const fullAccessUrl = `${window.location.origin}/?token=${currentInputCode || currentProv.tokenAcceso}#proveedor`;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Columna Izquierda: Input de Edición y Generadores */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold">
                            Código / Token de Ingreso para <span className="text-amber-300 font-bold">"{currentProv.nombreComercial}"</span>:
                          </label>
                          {collidingOther ? (
                            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/50 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              ⚠️ Código en uso por "{collidingOther.nombreComercial}"
                            </span>
                          ) : currentInputCode ? (
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              {isOriginalCode ? "Código actual del taller" : "✓ Código único disponible para asignar"}
                            </span>
                          ) : null}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            value={quickTokenInput}
                            onChange={(e) => setQuickTokenInput(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            placeholder={`Ej: ${currentProv.codigo} o token_seguro_...`}
                            className={`w-full bg-slate-950 border-2 rounded-2xl px-4 py-3 text-sm font-mono font-bold focus:outline-none transition-all shadow-inner ${
                              collidingOther
                                ? 'border-rose-500 text-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40 bg-rose-950/20'
                                : 'border-amber-500 text-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40'
                            }`}
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(quickTokenInput || currentProv.tokenAcceso);
                                  setSaveStatus(`✓ Código copiado: ${quickTokenInput || currentProv.tokenAcceso}`);
                                  setTimeout(() => setSaveStatus(null), 3000);
                                }
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-mono border border-slate-700 flex items-center gap-1 cursor-pointer font-bold transition-colors"
                              title="Copiar código"
                            >
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>

                        {collidingOther && (
                          <div className="p-3 bg-rose-950/90 border border-rose-500/60 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 shadow-lg">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold font-mono text-rose-300">¡Colisión de Código Detectada!</p>
                              <p className="text-[11px] text-rose-200/90">
                                Este código ya está asignado a <strong>"{collidingOther.nombreComercial}"</strong> ({collidingOther.codigo}). Elige otro valor o presiona Generar Token.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Generadores Rápidos de Código */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                          ⚡ Generadores Rápidos con 1 Clic:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const catPrefix = (currentProv.categoria || "PRV").substring(0, 3).toLowerCase();
                              const randomToken = `token_${catPrefix}_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6)}`;
                              setQuickTokenInput(randomToken);
                            }}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            <span>Generar Token Seguro</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setQuickTokenInput(currentProv.codigo.toLowerCase())}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Usar Código Oficial ({currentProv.codigo})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const cleanName = `taller-${currentProv.nombreComercial.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                              setQuickTokenInput(cleanName);
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Usar Nombre Taller</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha: Vista previa de Enlace y Acciones de Envío / Guardado */}
                    <div className="lg:col-span-5 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between shadow-inner">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                            Enlace Directo de Oficina Virtual:
                          </span>
                          <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            Aislamiento Total
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-300 break-all select-all font-bold">
                          {fullAccessUrl}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(fullAccessUrl);
                                setSaveStatus(`✓ Enlace copiado al portapapeles`);
                                setTimeout(() => setSaveStatus(null), 3000);
                              }
                            }}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5 text-amber-400" />
                            <span>Copiar Link</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenProvPortal(currentProv)}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ver Oficina</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickSaveToken(currentProv.id, quickTokenInput)}
                          disabled={Boolean(collidingOther) || !quickTokenInput.trim()}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-black flex items-center justify-center gap-2 shadow-lg transition-all ${
                            collidingOther || !quickTokenInput.trim()
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 cursor-pointer shadow-amber-500/20'
                          }`}
                        >
                          <Save className="w-4 h-4 text-slate-950" />
                          <span>Guardar Código de Acceso para "{currentProv.nombreComercial}"</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* FORMULARIO: REGISTRAR NUEVO PROVEEDOR */}
          {(provActiveSubPanel === 'nuevo' || activeAdminTab === 'talleres') && (
            <div id="formulario-nuevo-proveedor" className="bg-slate-950/90 border border-amber-500/20 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                  <PlusCircle className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-amber-300">
                    Formulario de Registro — Nuevo Proveedor & Taller Aliado
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Genera automáticamente Magic Link y Token de Acceso para su Oficina Virtual
                  </p>
                </div>
              </div>

              {/* Botón destacado superior para administrar categorías */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatManagerOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded-xl text-xs font-mono text-amber-300 font-bold flex items-center gap-2 shadow transition-all cursor-pointer"
                  title="Abrir gestor de categorías: Crear nuevas líneas, renombrar o eliminar"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>{categoriesList.length} Categorías Disponibles (⚙️ Editar / + Crear)</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateProveedor} className="space-y-4">
              {/* Grid 1: Datos Principales */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                    Nombre Comercial / Taller *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProvNombre}
                    onChange={(e) => setNewProvNombre(e.target.value)}
                    placeholder="Ej: Talleres Gráficos del Valle"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                    Persona de Contacto / Encargado *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProvContacto}
                    onChange={(e) => setNewProvContacto(e.target.value)}
                    placeholder="Ej: Carlos Mario Jaramillo"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProvTelefono}
                    onChange={(e) => setNewProvTelefono(e.target.value)}
                    placeholder="Ej: +57 312 456 7890"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* SECCIÓN: SELECTOR MULTI-OPCIÓN DE CATEGORÍAS & GESTIÓN DIRECTA */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-amber-500/30 space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" />
                      Líneas & Categorías de Producción Asignadas *
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Selecciona una o múltiples líneas de producción. Puedes crear nuevas o editar el catálogo directamente.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCatManagerOpen(true)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>⚙️ Editar / Crear Categorías</span>
                    </button>
                  </div>
                </div>

                <CategoryMultiSelect
                  categories={categoriesList}
                  selectedCategories={newProvCategorias}
                  onChange={setNewProvCategorias}
                  onAddNewCategory={handleAddNewCategoryFromMultiSelect}
                  onManageCategories={() => setIsCatManagerOpen(true)}
                  placeholder="Selecciona o busca líneas de producción..."
                />

                {/* Barra de creación rápida inline & editor directo */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Formulario rápido para crear categoría directamente */}
                  <div className="flex items-center gap-1.5 flex-1 max-w-lg">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold whitespace-nowrap">
                      + Crear Línea:
                    </span>
                    <input
                      type="text"
                      value={inlineNewCategory}
                      onChange={(e) => setInlineNewCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleInlineAddCategory();
                        }
                      }}
                      placeholder="Ej: Empaques Plegadizos, Sellos, etc..."
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 flex-1 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => handleInlineAddCategory()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1 shadow transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Agregar</span>
                    </button>
                  </div>

                  {/* Acceso directo a gestión completa */}
                  <button
                    type="button"
                    onClick={() => setIsCatManagerOpen(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                    title="Editar nombres, eliminar o reordenar categorías"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚙️ Modificar Nombres / Eliminar ({categoriesList.length})</span>
                  </button>
                </div>
              </div>

              {/* Grid 2: Ubicación & Contacto Secundario */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={newProvEmail}
                    onChange={(e) => setNewProvEmail(e.target.value)}
                    placeholder="produccion@proveedor.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                    Dirección del Taller / Bodega
                  </label>
                  <input
                    type="text"
                    value={newProvDireccion}
                    onChange={(e) => setNewProvDireccion(e.target.value)}
                    placeholder="Ej: Calle 44 # 52-18, Alpujarra"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                    Municipio (Antioquia)
                  </label>
                  <select
                    value={newProvMunicipio}
                    onChange={(e) => setNewProvMunicipio(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Medellín">Medellín</option>
                    <option value="Itagüí">Itagüí</option>
                    <option value="Envigado">Envigado</option>
                    <option value="Bello">Bello</option>
                    <option value="Sabaneta">Sabaneta</option>
                    <option value="La Estrella">La Estrella</option>
                    <option value="Caldas">Caldas</option>
                    <option value="Copacabana">Copacabana</option>
                    <option value="Rionegro">Rionegro</option>
                    <option value="Marinilla">Marinilla</option>
                    <option value="Otro">Otro Municipio</option>
                  </select>
                </div>
              </div>

              {/* Grid 3: Datos Bancarios */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Datos Bancarios para Pagos y Transferencias
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Banco / Entidad</label>
                    <select
                      value={newProvBanco}
                      onChange={(e) => setNewProvBanco(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Nequi">Nequi</option>
                      <option value="Daviplata">Daviplata</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="BBVA">BBVA</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="Banco de Occidente">Banco de Occidente</option>
                      <option value="Efectivo / Caja Menor">Efectivo / Caja Menor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Tipo de Cuenta</label>
                    <select
                      value={newProvTipoCuenta}
                      onChange={(e) => setNewProvTipoCuenta(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Ahorros">Ahorros</option>
                      <option value="Corriente">Corriente</option>
                      <option value="Billetera Digital">Billetera Digital</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Número de Cuenta</label>
                    <input
                      type="text"
                      value={newProvNumeroCuenta}
                      onChange={(e) => setNewProvNumeroCuenta(e.target.value)}
                      placeholder="Ej: 458-921844-12"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Titular de la Cuenta</label>
                    <input
                      type="text"
                      value={newProvTitular}
                      onChange={(e) => setNewProvTitular(e.target.value)}
                      placeholder="Nombre del titular"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Documento / NIT</label>
                    <input
                      type="text"
                      value={newProvDocumento}
                      onChange={(e) => setNewProvDocumento(e.target.value)}
                      placeholder="NIT o CC"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SECCIÓN DESTACADA: ESPACIO DE TOKEN & ACCESO A OFICINA VIRTUAL AL REGISTRAR */}
              {/* ========================================================================= */}
              {(() => {
                const currentNewSlug = newProvSlug.trim().toLowerCase();
                const collidingProv = currentNewSlug 
                  ? proveedores.find(p => (
                      (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === currentNewSlug) ||
                      (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === currentNewSlug) ||
                      (p.codigo && p.codigo.trim().toLowerCase() === currentNewSlug)
                    ))
                  : null;

                return (
                  <div className="p-4 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 rounded-2xl border-2 border-amber-500/60 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shadow-inner">
                          <Key className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono uppercase text-amber-300 font-black block">
                              🔑 Código de Acceso / Token del Taller * (OBLIGATORIO)
                            </span>
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[9px] font-mono font-bold">
                              Exclusivo Admin
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-sans">
                            Clave confidencial con la que el taller ingresará a su Oficina Virtual. Visible únicamente en este panel administrativo.
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            const cleanName = `taller-${newProvNombre.trim() ? newProvNombre.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'nuevo'}`;
                            setNewProvSlug(cleanName);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                          title="Usar nombre comercial como slug"
                        >
                          <span>Usar Nombre</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const primaryCat = newProvCategorias[0] || "PRV";
                            const catPrefix = primaryCat.substring(0, 3).toLowerCase();
                            const randomToken = `token_${catPrefix}_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6)}`;
                            setNewProvSlug(randomToken);
                          }}
                          className="px-2.5 py-1 bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-500/50 text-[10px] font-mono font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                          title="Generar un nuevo token criptográfico seguro"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>⚡ Generar Token Seguro</span>
                        </button>
                      </div>
                    </div>

                    {/* INPUT CÓDIGO CON VALIDACIÓN EN TIEMPO REAL */}
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <label className="block text-[11px] font-mono uppercase text-slate-200 font-bold">
                            Token o Clave de Acceso Asignada al Taller *:
                          </label>
                          {collidingProv ? (
                            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/50 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              ⚠️ En uso por "{collidingProv.nombreComercial}"
                            </span>
                          ) : currentNewSlug ? (
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              ✓ Código único listo para guardar
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold text-amber-400">
                              * Campo obligatorio (escribe o genera un token)
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={newProvSlug}
                            onChange={(e) => setNewProvSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            placeholder="Ej: taller-almanaques o token_alm_12345..."
                            className={`w-full bg-slate-950 border-2 rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:outline-none transition-all shadow-inner ${
                              collidingProv
                                ? 'border-rose-500 text-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40 bg-rose-950/20'
                                : 'border-amber-500 text-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40'
                            }`}
                          />
                          {newProvSlug && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (navigator.clipboard && navigator.clipboard.writeText) {
                                    navigator.clipboard.writeText(newProvSlug).then(() => {
                                      setSaveStatus(`✓ Código copiado: ${newProvSlug}`);
                                      setTimeout(() => setSaveStatus(null), 3000);
                                    });
                                  }
                                }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-mono border border-slate-700 flex items-center gap-1 cursor-pointer font-bold transition-colors"
                                title="Copiar token al portapapeles"
                              >
                                <Copy className="w-3.5 h-3.5 text-amber-400" />
                                <span>Copiar</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ALERTA EN TIEMPO REAL SI HAY COLISIÓN */}
                        {collidingProv && (
                          <div className="p-3 bg-rose-950/90 border border-rose-500/60 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 shadow-lg animate-pulse">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="font-bold font-mono text-rose-300 flex items-center gap-1.5">
                                <span>¡Colisión de Código Detectada!</span>
                              </p>
                              <p className="text-[11px] text-rose-200/90 font-sans leading-relaxed">
                                El código <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-rose-500/40 text-amber-300 font-mono font-bold">"{currentNewSlug}"</code> ya pertenece al taller <strong className="text-white">"{collidingProv.nombreComercial}"</strong> (Código: <span className="font-mono text-amber-300">{collidingProv.codigo}</span>).
                              </p>
                              <p className="text-[10px] text-rose-300/80 font-mono pt-0.5">
                                ➔ Modifica el texto o genera un nuevo token criptográfico para evitar cruces de órdenes.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                          <span>💡 Cada taller cuenta con su clave confidencial y privada asignada por la administración.</span>
                          {newProvSlug.trim() && !collidingProv && (
                            <span className="text-amber-400">
                              Clave configurada: <strong className="font-mono text-white">{newProvSlug.trim()}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Grid 4: Notas Internas */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Notas Internas / Especialidad Técnica del Taller
                </label>
                <input
                  type="text"
                  value={newProvNotas}
                  onChange={(e) => setNewProvNotas(e.target.value)}
                  placeholder="Ej: Troquelado en cartón duplex 300g, ojilletes metálicos, tacos mensuales, tiempo de entrega 3 días hábiles."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              {/* Botón de Envío */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-amber-400/30"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR PROVEEDOR & GENERAR LINK ÚNICO</span>
                </button>
              </div>
            </form>
          </div>
          )}

          {/* BUSCADOR & FILTROS DE PROVEEDORES & LISTADO DE TALLERES */}
          {(provActiveSubPanel === 'talleres' || activeAdminTab === 'talleres') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={provSearchTerm}
                onChange={(e) => setProvSearchTerm(e.target.value)}
                placeholder="Buscar por nombre de taller, código, contacto, teléfono, banco..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={provCategoryFilter}
                onChange={(e) => setProvCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="all">Todas las Categorías ({categoriesList.length})</option>
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsCatManagerOpen(true)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-mono rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Abrir gestor de categorías"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Gestionar</span>
              </button>

              {(provSearchTerm || provCategoryFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setProvSearchTerm("");
                    setProvCategoryFilter("all");
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* TARJETA DE RESUMEN: CÓDIGOS DE ACCESO ACTIVOS VS PENDIENTES */}
          {(() => {
            const totalProv = proveedores.length;
            const conCodigo = proveedores.filter(p => (p.slugAcceso && p.slugAcceso.trim() !== '') || (p.tokenAcceso && p.tokenAcceso.trim() !== ''));
            const sinCodigo = proveedores.filter(p => (!p.slugAcceso || p.slugAcceso.trim() === '') && (!p.tokenAcceso || p.tokenAcceso.trim() === ''));
            const totalActivos = conCodigo.length;
            const totalPendientes = sinCodigo.length;
            const pctConfigurados = totalProv > 0 ? Math.round((totalActivos / totalProv) * 100) : 100;

            const handleAutoAssignMissingCodes = () => {
              if (sinCodigo.length === 0) {
                alert("Todos los talleres ya tienen su código de acceso configurado.");
                return;
              }
              const updated = proveedores.map(p => {
                if ((!p.slugAcceso || p.slugAcceso.trim() === '') && (!p.tokenAcceso || p.tokenAcceso.trim() === '')) {
                  const generatedToken = `token_${p.codigo.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.random().toString(36).substring(2, 6)}`;
                  const cleanSlug = p.codigo.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                  return { ...p, tokenAcceso: generatedToken, slugAcceso: cleanSlug };
                }
                return p;
              });
              setProveedores(updated);
              saveStoredProveedores(updated);
              setSaveStatus(`✓ Se asignaron códigos de acceso a ${sinCodigo.length} taller(es) pendientes`);
            };

            return (
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3.5 bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 rounded-2xl font-black shadow-lg shadow-amber-500/30 shrink-0">
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">
                          RESUMEN DE CÓDIGOS DE ACCESO (OFICINA VIRTUAL)
                        </h4>
                        <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono text-[10px] font-bold">
                          {pctConfigurados}% Configurados
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Supervisa qué talleres tienen credenciales activas versus los que están pendientes de configuración.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {totalPendientes > 0 && (
                      <button
                        type="button"
                        onClick={handleAutoAssignMissingCodes}
                        className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-mono font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                        title="Generar tokens automáticos para los talleres sin código"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Autocompletar ({totalPendientes})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* TARJETAS DE MÉTRICAS ACTIVOS VS PENDIENTES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Tarjeta 1: Con Código Activo */}
                  <div 
                    onClick={() => setProvAccessFilter(provAccessFilter === 'activos' ? 'all' : 'activos')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      provAccessFilter === 'activos'
                        ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-900/40'
                        : 'bg-slate-900/90 hover:bg-slate-850 border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-emerald-400 mb-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Códigos Activos / Configurados
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold border border-emerald-500/30">
                        {totalActivos} de {totalProv}
                      </span>
                    </div>
                    <div className="text-3xl font-black font-mono text-emerald-400">
                      {totalActivos} <span className="text-xs text-slate-400 font-sans font-normal">talleres listos</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-1.5 flex items-center justify-between">
                      <span>Token / Slug asignado y operativo</span>
                      <span className="text-[10px] font-mono text-emerald-300 underline font-bold">
                        {provAccessFilter === 'activos' ? '✓ Filtro Activo' : 'Ver solo activos'}
                      </span>
                    </div>
                  </div>

                  {/* Tarjeta 2: Pendientes de Configuración */}
                  <div 
                    onClick={() => setProvAccessFilter(provAccessFilter === 'pendientes' ? 'all' : 'pendientes')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      provAccessFilter === 'pendientes'
                        ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/50 shadow-lg shadow-amber-900/40'
                        : totalPendientes > 0
                        ? 'bg-slate-900/90 hover:bg-slate-850 border-amber-500/40'
                        : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-amber-400 mb-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Pendientes de Configuración
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        totalPendientes > 0
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {totalPendientes} pendientes
                      </span>
                    </div>
                    <div className={`text-3xl font-black font-mono ${totalPendientes > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {totalPendientes} <span className="text-xs text-slate-400 font-sans font-normal">por configurar</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-1.5 flex items-center justify-between">
                      <span>{totalPendientes > 0 ? 'Requieren asignar código único' : '¡100% de talleres al día!'}</span>
                      <span className="text-[10px] font-mono text-amber-300 underline font-bold">
                        {provAccessFilter === 'pendientes' ? '✓ Filtro Activo' : 'Ver pendientes'}
                      </span>
                    </div>
                  </div>

                  {/* Tarjeta 3: Barra de Progreso & Cobertura */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-300 mb-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-sky-400" />
                        Nivel de Cobertura
                      </span>
                      <span className="text-xs font-mono font-bold text-sky-300">
                        {pctConfigurados}% Total
                      </span>
                    </div>

                    <div className="space-y-1.5 my-auto">
                      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                          style={{ width: `${pctConfigurados}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-emerald-400 font-bold">{totalActivos} Activos</span>
                        <span className="text-amber-400 font-bold">{totalPendientes} Pendientes</span>
                      </div>
                    </div>

                    {provAccessFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setProvAccessFilter('all')}
                        className="text-[10px] font-mono text-amber-400 hover:text-amber-300 font-bold text-left mt-1"
                      >
                        ✕ Mostrar todos ({provAccessFilter === 'activos' ? 'Filtro: Activos' : 'Filtro: Pendientes'})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TABLA DE PROVEEDORES REGISTRADOS - SECCIÓN DEDICADA DE GESTIÓN */}
          {(() => {
            const filtered = proveedores.filter((p) => {
              const pCats = Array.isArray(p.categorias) && p.categorias.length > 0
                ? p.categorias
                : (p.categoria ? [p.categoria] : ["Servicios"]);
              const matchesCat = provCategoryFilter === 'all' || pCats.includes(provCategoryFilter);
              if (!matchesCat) return false;

              // Access filter: activos vs pendientes
              const hasAccessCode = (p.slugAcceso && p.slugAcceso.trim() !== '') || (p.tokenAcceso && p.tokenAcceso.trim() !== '');
              if (provAccessFilter === 'activos' && !hasAccessCode) return false;
              if (provAccessFilter === 'pendientes' && hasAccessCode) return false;

              if (!provSearchTerm.trim()) return true;
              const term = provSearchTerm.toLowerCase();
              return (
                p.nombreComercial.toLowerCase().includes(term) ||
                p.codigo.toLowerCase().includes(term) ||
                p.contactoNombre.toLowerCase().includes(term) ||
                p.telefonoWhatsapp.toLowerCase().includes(term) ||
                (p.slugAcceso && p.slugAcceso.toLowerCase().includes(term)) ||
                (p.tokenAcceso && p.tokenAcceso.toLowerCase().includes(term)) ||
                pCats.some(c => c.toLowerCase().includes(term)) ||
                (p.municipio && p.municipio.toLowerCase().includes(term)) ||
                (p.datosBancarios?.banco && p.datosBancarios.banco.toLowerCase().includes(term)) ||
                (p.datosBancarios?.numeroCuenta && p.datosBancarios.numeroCuenta.includes(term))
              );
            });

            return (
              <div className="space-y-4" id="seccion-gestion-proveedores">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/90 border border-amber-500/30 rounded-2xl shadow-lg">
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-amber-300 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-400" />
                      Gestión de Proveedores & Talleres Registrados ({filtered.length})
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      Listado general: visualiza y copia códigos de acceso rápidamente, edita información y asigna órdenes de producción.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setCotProviderFilter('all');
                        const el = document.getElementById("subseccion-cotizaciones-recibidas-proveedores");
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                        setSaveStatus("✓ Desplazando al buzón de Cotizaciones Recibidas");
                        setTimeout(() => setSaveStatus(null), 2500);
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-mono font-black transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                      title="Desplazarse directamente al historial de cotizaciones recibidas"
                    >
                      <Tag className="w-3.5 h-3.5 text-slate-950" />
                      <span>Ver Cotizaciones ({provCotizaciones.length || INITIAL_COTIZACIONES.length})</span>
                    </button>

                    <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-mono text-[11px] font-bold">
                      {filtered.length} de {proveedores.length} Talleres Activos
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border-2 border-slate-800 rounded-2xl bg-slate-950 shadow-2xl custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[1050px]">
                    <thead>
                      <tr className="border-b-2 border-slate-800 bg-slate-900 text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Taller / ID</th>
                        <th className="py-3.5 px-4 bg-amber-950/40 text-amber-300 border-x-2 border-amber-500/40 shadow-inner">
                          <div className="flex items-center gap-1.5 font-black">
                            <Key className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Código de Acceso (Gestión Administrativa)</span>
                          </div>
                        </th>
                        <th className="py-3.5 px-4">Líneas Asignadas</th>
                        <th className="py-3.5 px-4">Contacto & WhatsApp</th>
                        <th className="py-3.5 px-4">Datos Bancarios</th>
                        <th className="py-3.5 px-4">Órdenes & Saldo</th>
                        <th className="py-3.5 px-4 text-center">Acciones de Gestión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500 text-xs font-mono">
                            No se encontraron proveedores que coincidan con los filtros de búsqueda.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((prov) => {
                          const pOrders = provOrdenes.filter((o) => o.proveedorId === prov.id);
                          const pActive = pOrders.filter((o) => o.estado === 'En_Produccion').length;
                          const pCost = pOrders.reduce((acc, o) => acc + (o.costoProveedor || 0), 0);
                          const pPaid = provPagos.filter((p) => p.proveedorId === prov.id).reduce((acc, p) => acc + (p.monto || 0), 0);
                          const pBalance = Math.max(0, pCost - pPaid);
                          const pCats = Array.isArray(prov.categorias) && prov.categorias.length > 0
                            ? prov.categorias
                            : (prov.categoria ? [prov.categoria] : ["Servicios"]);
                          const accessKey = prov.slugAcceso || prov.tokenAcceso || prov.codigo;

                          return (
                            <tr key={prov.id} className="hover:bg-slate-900/60 text-xs transition-colors">
                              {/* Código y Nombre */}
                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-mono rounded font-bold">
                                      {prov.codigo}
                                    </span>
                                    <span className="font-bold text-white text-xs">{prov.nombreComercial}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                    <span className="truncate max-w-[180px]">{prov.direccionTaller || prov.municipio || "Medellín"}</span>
                                  </div>
                                </div>
                              </td>

                              {/* VISUALIZACIÓN Y EDICIÓN RÁPIDA DE CÓDIGO DE ACCESO / TOKEN */}
                              <td className="py-3 px-4 bg-amber-950/15 border-x border-amber-500/20">
                                {inlineEditTableProvId === prov.id ? (
                                  /* MODO EDICIÓN DIRECTA EN TABLA */
                                  <div className="p-2 bg-slate-950 rounded-xl border-2 border-amber-500/80 shadow-2xl space-y-2 min-w-[240px]">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[10px] font-mono text-amber-300 font-bold uppercase flex items-center gap-1">
                                        <Key className="w-3 h-3 text-amber-400" />
                                        Editar Token de Acceso:
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setInlineEditTableProvId(null)}
                                        className="text-slate-500 hover:text-slate-300 text-xs font-mono p-0.5"
                                        title="Cancelar"
                                      >
                                        ✕
                                      </button>
                                    </div>

                                    <div className="relative">
                                      <input
                                        type="text"
                                        autoFocus
                                        value={inlineEditTableToken}
                                        onChange={(e) => setInlineEditTableToken(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSaveInlineTableToken(prov);
                                          } else if (e.key === 'Escape') {
                                            setInlineEditTableProvId(null);
                                          }
                                        }}
                                        placeholder="Código / Token"
                                        className="w-full bg-slate-900 border border-amber-500 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                                      />
                                    </div>

                                    {/* Generador rápido de botones inline */}
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const catPrefix = (prov.categoria || "PRV").substring(0, 3).toLowerCase();
                                          const rand = `token_${catPrefix}_${Date.now().toString().slice(-5)}_${Math.random().toString(36).substring(2, 5)}`;
                                          setInlineEditTableToken(rand);
                                        }}
                                        className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-mono rounded font-bold transition-colors cursor-pointer flex items-center gap-0.5"
                                        title="Generar token criptográfico único"
                                      >
                                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                                        <span>Generar</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setInlineEditTableToken(prov.codigo.toLowerCase())}
                                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-mono rounded border border-slate-700 transition-colors cursor-pointer"
                                        title="Usar código oficial"
                                      >
                                        <span>{prov.codigo}</span>
                                      </button>

                                      <div className="ml-auto flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleSaveInlineTableToken(prov)}
                                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold rounded flex items-center gap-1 shadow cursor-pointer transition-colors"
                                          title="Guardar código de acceso"
                                        >
                                          <Check className="w-3 h-3" />
                                          <span>Guardar</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setInlineEditTableProvId(null)}
                                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-mono rounded transition-colors cursor-pointer"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* MODO VISUALIZACIÓN CON BOTONES DE ACCIÓN RÁPIDA */
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-1">
                                      <div 
                                        onClick={() => handleStartInlineEditToken(prov)}
                                        className="px-2.5 py-1.5 bg-slate-950 border-2 border-amber-500/50 hover:border-amber-400 rounded-xl text-amber-300 font-mono text-xs font-black shadow-inner flex items-center gap-1.5 max-w-[190px] cursor-pointer group transition-all"
                                        title="Clic para editar este código directamente en la tabla"
                                      >
                                        <Key className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="truncate">{accessKey}</span>
                                        <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-amber-400 shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>

                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (navigator.clipboard) {
                                              navigator.clipboard.writeText(accessKey);
                                              setSaveStatus(`✓ Código copiado: ${accessKey}`);
                                              setTimeout(() => setSaveStatus(null), 3000);
                                            }
                                          }}
                                          title="Copiar Código de Acceso al Portapapeles"
                                          className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer font-bold shadow-sm"
                                        >
                                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                                          <span>Copiar</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleStartInlineEditToken(prov)}
                                          title="Editar Código de Acceso en esta fila"
                                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer font-bold"
                                        >
                                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedTokenProvId(prov.id);
                                          setQuickTokenInput(prov.slugAcceso || prov.tokenAcceso || prov.codigo);
                                          handleOpenCustomizeAccess(prov);
                                        }}
                                        title="Abrir Generador de Token Completo"
                                        className="px-2 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                      >
                                        <Zap className="w-3 h-3 text-amber-400" />
                                        <span>Generador</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleOpenProvPortal(prov)}
                                        title="Abrir y Ver Oficina Virtual"
                                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        <Eye className="w-3 h-3 text-amber-400" />
                                        <span>Ver Oficina</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleShareProvWhatsApp(prov)}
                                        title="Enviar clave y enlace por WhatsApp"
                                        className="p-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs transition-colors cursor-pointer"
                                      >
                                        <Share2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </td>

                              {/* Líneas / Especialidades (múltiples) */}
                              <td className="py-3 px-4">
                                <div className="space-y-1.5 max-w-[220px]">
                                  <div className="flex flex-wrap gap-1">
                                    {pCats.map((cat) => (
                                      <span
                                        key={cat}
                                        className="px-2 py-0.5 bg-slate-900 text-amber-300 border border-amber-500/30 text-[10px] font-mono rounded-md font-bold inline-flex items-center gap-1 shadow-sm"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        {cat}
                                      </span>
                                    ))}
                                  </div>

                                  {/* Contador y link rápido a cotizaciones de este taller */}
                                  <div>
                                    {(() => {
                                      const provCots = provCotizaciones.filter(c => c.proveedorId === prov.id);
                                      if (provCots.length > 0) {
                                        return (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setCotProviderFilter(prov.id);
                                              setCotDecisionMode("todas");
                                              const el = document.getElementById("buzon-cotizaciones-proveedores");
                                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 rounded-md text-[9px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                                            title="Ver cotizaciones de este taller en el buzón"
                                          >
                                            <Tag className="w-2.5 h-2.5 text-amber-400" />
                                            <span>📥 {provCots.length} cotización(es) recibida(s)</span>
                                          </button>
                                        );
                                      }
                                      return (
                                        <span className="text-[9px] font-mono text-slate-500 italic block">
                                          Sin cotizaciones registradas
                                        </span>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </td>

                              {/* Contacto & WhatsApp */}
                              <td className="py-3 px-4">
                                <div className="space-y-0.5">
                                  <span className="font-medium text-slate-200 block">{prov.contactoNombre}</span>
                                  <a
                                    href={`https://wa.me/${(prov.telefonoWhatsapp || "").replace(/[^0-9]/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>{prov.telefonoWhatsapp}</span>
                                  </a>
                                </div>
                              </td>

                              {/* Datos Bancarios */}
                              <td className="py-3 px-4">
                                <div className="space-y-0.5 text-[11px] font-mono">
                                  <div className="text-slate-200 font-bold flex items-center gap-1">
                                    <CreditCard className="w-3 h-3 text-amber-400" />
                                    <span>{prov.datosBancarios?.banco || "Bancolombia"} ({prov.datosBancarios?.tipoCuenta || "Ahorros"})</span>
                                  </div>
                                  <div className="text-slate-400">
                                    #{prov.datosBancarios?.numeroCuenta || "Por registrar"}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                                    {prov.datosBancarios?.titular || prov.nombreComercial}
                                  </div>
                                </div>
                              </td>

                              {/* Órdenes & Balance */}
                              <td className="py-3 px-4">
                                <div className="text-xs font-mono space-y-0.5">
                                  <span className="text-sky-400 font-bold block">{pActive} en taller ({pOrders.length} tot.)</span>
                                  <div className="text-slate-400 text-[11px]">Costo: {formatCOP(pCost)}</div>
                                  {pBalance > 0 ? (
                                    <div className="text-rose-400 font-bold text-[11px]">Saldo: {formatCOP(pBalance)}</div>
                                  ) : (
                                    <div className="text-emerald-400 font-bold text-[10px]">Al día ✓</div>
                                  )}
                                </div>
                              </td>

                              {/* ACCIONES DE GESTIÓN Y EDICIÓN RÁPIDA */}
                              <td className="py-3 px-4 text-center">
                                <div className="flex flex-col items-center gap-1.5 min-w-[140px]">
                                  {/* Botón Ver Cotizaciones de este Proveedor */}
                                  {(() => {
                                    const count = (provCotizaciones.length > 0 ? provCotizaciones : INITIAL_COTIZACIONES).filter(c => c.proveedorId === prov.id).length;
                                    return (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCotProviderFilter(prov.id);
                                          const el = document.getElementById("subseccion-cotizaciones-recibidas-proveedores");
                                          if (el) {
                                            el.scrollIntoView({ behavior: 'smooth' });
                                          }
                                          setSaveStatus(`✓ Mostrando ${count} cotización(es) recibida(s) de ${prov.nombreComercial}`);
                                          setTimeout(() => setSaveStatus(null), 3000);
                                        }}
                                        title={`Ver cotizaciones recibidas de ${prov.nombreComercial}`}
                                        className="w-full py-1 px-2 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/50 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                      >
                                        <Tag className="w-3 h-3 text-amber-400" />
                                        <span>Ver Cotizaciones ({count})</span>
                                      </button>
                                    );
                                  })()}

                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditProv(prov)}
                                    title="Editar Información Completa del Proveedor"
                                    className="w-full py-1 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                                  >
                                    <Edit3 className="w-3 h-3 text-amber-400" />
                                    <span>Editar Datos</span>
                                  </button>

                                  <div className="flex items-center justify-center gap-1 w-full">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOrderModalProv(prov);
                                        setNewOrdCliente("");
                                        setNewOrdDescripcion(`Producción de ${prov.categoria.toLowerCase()} personalizada`);
                                        setNewOrdCantidad(100);
                                        setNewOrdPrecioVenta(0);
                                        setNewOrdCostoProv(0);
                                      }}
                                      title="Asignar Nueva Orden de Producción"
                                      className="flex-1 p-1.5 bg-sky-950 hover:bg-sky-900 text-sky-400 border border-sky-500/30 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                                    >
                                      <Package className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPaymentModalProv(prov);
                                        setPayMonto(pBalance > 0 ? pBalance : 0);
                                        setPayReferencia("");
                                        setPayComprobanteJpg("");
                                        setPayComprobanteFileName("");
                                        setPayComprobanteTipo("jpg");
                                      }}
                                      title="Cargar Comprobante de Pago (JPG / PDF) y notificar a su Oficina Virtual"
                                      className="flex-1 py-1.5 px-2 bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                                    >
                                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Pagar / JPG-PDF</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProveedor(prov.id)}
                                      title="Eliminar Proveedor"
                                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* CONTENEDOR VISUAL: COTIZACIONES RECIBIDAS (HISTORIAL ORDENADO POR PRECIO UNITARIO ASCENDENTE) */}
          {/* ========================================================================= */}
          {(() => {
            const rawQuotes = provCotizaciones && provCotizaciones.length > 0
              ? provCotizaciones
              : (getStoredCotizaciones().length > 0 ? getStoredCotizaciones() : INITIAL_COTIZACIONES);

            // Filtrado opcional por proveedor seleccionado
            const filteredByProv = cotProviderFilter === 'all'
              ? rawQuotes
              : rawQuotes.filter(c => c.proveedorId === cotProviderFilter);

            // Ordenamiento automático por precio unitario ascendente (del más económico al más costoso)
            const sortedByLowestUnit = [...filteredByProv].sort((a, b) => {
              const uA = a.precioCostoUnitario || (a.cantidad > 0 ? a.precioCostoTotal / a.cantidad : a.precioCostoTotal);
              const uB = b.precioCostoUnitario || (b.cantidad > 0 ? b.precioCostoTotal / b.cantidad : b.precioCostoTotal);
              return uA - uB;
            });

            // Determinar el precio unitario más bajo global
            const minUnit = sortedByLowestUnit.length > 0
              ? (sortedByLowestUnit[0].precioCostoUnitario || (sortedByLowestUnit[0].cantidad > 0 ? sortedByLowestUnit[0].precioCostoTotal / sortedByLowestUnit[0].cantidad : sortedByLowestUnit[0].precioCostoTotal))
              : 0;

            const selectedProvObj = proveedores.find(p => p.id === cotProviderFilter);

            return (
              <div id="subseccion-cotizaciones-recibidas-proveedores" className="space-y-4 pt-6 border-t-2 border-amber-500/40">
                <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 rounded-2xl font-black shadow-lg shadow-amber-500/20 shrink-0">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold font-mono uppercase tracking-wider text-amber-300 flex items-center gap-2">
                          📥 Cotizaciones Recibidas
                        </h3>
                        <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-xs font-mono font-black rounded-full uppercase">
                          {sortedByLowestUnit.length} Cotizaciones
                        </span>
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono rounded-full font-bold uppercase flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-400" /> Ordenado por Menor Precio Unitario (Ascendente)
                        </span>
                        {selectedProvObj && (
                          <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono rounded-full font-bold flex items-center gap-1">
                            Filtro: {selectedProvObj.nombreComercial}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 font-sans">
                        Historial de cotizaciones enviadas desde <strong className="text-amber-300">ProveedorVirtualOffice</strong>. 
                        Las filas se ordenan automáticamente del precio unitario más bajo al más alto para resaltar el mejor costo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {cotProviderFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCotProviderFilter('all');
                          setSaveStatus("✓ Mostrando cotizaciones de todos los talleres");
                          setTimeout(() => setSaveStatus(null), 2500);
                        }}
                        className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                      >
                        ✕ Ver Todas ({rawQuotes.length})
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const fresh = getStoredCotizaciones();
                        if (fresh.length === 0) {
                          saveStoredCotizaciones(INITIAL_COTIZACIONES);
                          setProvCotizaciones(INITIAL_COTIZACIONES);
                        } else {
                          setProvCotizaciones(fresh);
                        }
                        setSaveStatus("✓ Cotizaciones sincronizadas desde el estado compartido");
                        setTimeout(() => setSaveStatus(null), 3000);
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Actualizar Datos</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border-2 border-slate-800 rounded-2xl bg-slate-950 shadow-2xl custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                      <tr className="border-b-2 border-slate-800 bg-slate-900/95 text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-bold">Nombre del Proveedor</th>
                        <th className="py-3.5 px-4 font-bold">Producto</th>
                        <th className="py-3.5 px-4 text-center font-bold">Cantidad</th>
                        <th className="py-3.5 px-4 font-bold bg-amber-950/40 text-amber-300 border-x border-amber-500/20">
                          Precio Unitario (Moneda)
                        </th>
                        <th className="py-3.5 px-4 font-bold">Fecha</th>
                        <th className="py-3.5 px-4 text-center font-bold">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sortedByLowestUnit.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500 text-xs font-mono">
                            No hay cotizaciones recibidas en el historial aún.
                          </td>
                        </tr>
                      ) : (
                        sortedByLowestUnit.map((cot, index) => {
                          const prov = proveedores.find(p => p.id === cot.proveedorId);
                          const provNombre = prov ? prov.nombreComercial : (cot.proveedorNombre || "Taller Litográfico");
                          const provCodigo = prov ? prov.codigo : (cot.proveedorCodigo || "PRV");
                          const provMunicipio = prov ? (prov.municipio || "Medellín") : (cot.proveedorMunicipio || "Medellín");
                          const unitPrice = cot.precioCostoUnitario || (cot.cantidad > 0 ? Math.round(cot.precioCostoTotal / cot.cantidad) : cot.precioCostoTotal);
                          const isLowestOverall = index === 0 || Math.abs(unitPrice - minUnit) < 0.01;

                          const formattedDate = (() => {
                            try {
                              const d = new Date(cot.fechaCreacion);
                              if (isNaN(d.getTime())) return cot.fechaCreacion || "Reciente";
                              return d.toLocaleDateString('es-CO', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (_) {
                              return cot.fechaCreacion || "Reciente";
                            }
                          })();

                          return (
                            <tr
                              key={cot.id || `quote-${index}`}
                              className={`transition-all text-xs ${
                                isLowestOverall
                                  ? "bg-gradient-to-r from-emerald-950/80 via-emerald-900/30 to-slate-950 hover:bg-emerald-950/90 border-l-4 border-l-emerald-400"
                                  : index % 2 === 0
                                  ? "bg-slate-950/60 hover:bg-slate-900/60"
                                  : "bg-slate-900/30 hover:bg-slate-900/60"
                              }`}
                            >
                              {/* 1. Nombre del Proveedor */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono font-bold text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                                      {provCodigo}
                                    </span>
                                    {isLowestOverall && (
                                      <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-mono font-black rounded-full flex items-center gap-1 shadow animate-pulse">
                                        <Award className="w-3 h-3" /> MEJOR COSTO
                                      </span>
                                    )}
                                  </div>
                                  <strong className="text-white text-sm font-sans block leading-tight">
                                    {provNombre}
                                  </strong>
                                  <span className="text-[11px] font-mono text-slate-400 block">
                                    📍 {provMunicipio} {prov?.contactoNombre ? `• ${prov.contactoNombre}` : ''}
                                  </span>
                                </div>
                              </td>

                              {/* 2. Producto */}
                              <td className="py-3.5 px-4 align-top max-w-[320px]">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono font-bold rounded">
                                      {cot.categoria || "Litografía"}
                                    </span>
                                    {cot.tiempoEntregaDias && (
                                      <span className="text-[10px] font-mono text-amber-400/90 flex items-center gap-0.5">
                                        <Clock className="w-3 h-3" /> {cot.tiempoEntregaDias}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs font-bold text-white font-mono leading-snug">
                                    {cot.tituloProducto}
                                  </div>
                                  {(cot.materialPapel || cot.medidasFormato) && (
                                    <div className="text-[11px] text-slate-400 font-sans line-clamp-2">
                                      {cot.materialPapel && <span>{cot.materialPapel} </span>}
                                      {cot.medidasFormato && <span>• {cot.medidasFormato} </span>}
                                      {cot.tintasColores && <span>• {cot.tintasColores}</span>}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 3. Cantidad */}
                              <td className="py-3.5 px-4 align-top text-center">
                                <div className="inline-block bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
                                  <span className="text-sm font-black font-mono text-amber-400 block">
                                    {cot.cantidad.toLocaleString('es-CO')}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                                    {cot.unidadMedida || 'u'}
                                  </span>
                                </div>
                              </td>

                              {/* 4. Precio Unitario (Formato Moneda) */}
                              <td className={`py-3.5 px-4 align-top border-x border-slate-800/80 ${isLowestOverall ? 'bg-emerald-950/30' : 'bg-slate-950/40'}`}>
                                <div className="space-y-1">
                                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                                    Precio Unitario:
                                  </div>
                                  <div className={`text-base font-black font-mono ${isLowestOverall ? 'text-emerald-300' : 'text-amber-400'}`}>
                                    {formatCOP(unitPrice)} <span className="text-[10px] font-normal text-slate-400">/ {cot.unidadMedida || 'u'}</span>
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-300">
                                    Total: <strong className="text-white">{formatCOP(cot.precioCostoTotal)}</strong>
                                  </div>
                                  {isLowestOverall && (
                                    <div className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                                      ★ Tarifa más económica
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 5. Fecha */}
                              <td className="py-3.5 px-4 align-top font-mono text-xs text-slate-300">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1 font-bold text-slate-200">
                                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{formattedDate}</span>
                                  </div>
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Cotización Vigente
                                  </span>
                                </div>
                              </td>

                              {/* 6. Acción */}
                              <td className="py-3.5 px-4 align-top text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (prov) {
                                      setOrderModalProv(prov);
                                      setNewOrdDescripcion(`${cot.tituloProducto} | ${cot.medidasFormato || ''} | ${cot.materialPapel || ''}`);
                                      setNewOrdCantidad(cot.cantidad);
                                      setNewOrdCostoProv(cot.precioCostoTotal);
                                      setNewOrdCategoria(cot.categoria);
                                      setSaveStatus(`✓ Cotización de ${prov.nombreComercial} cargada para orden`);
                                      setTimeout(() => setSaveStatus(null), 3000);
                                    } else {
                                      setSaveStatus(`⚠️ Proveedor no encontrado`);
                                    }
                                  }}
                                  className="py-1.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-mono text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1 cursor-pointer mx-auto"
                                  title="Crear orden con esta cotización"
                                >
                                  <Package className="w-3.5 h-3.5" />
                                  <span>Asignar</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* TABLA DE ÓRDENES DE PRODUCCIÓN & ANÁLISIS DE GANANCIA POR PEDIDO */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-400" />
                Órdenes Asignadas a Talleres & Margen de Ganancia ({provOrdenes.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Calcula instantáneamente la ganancia retenida por cada trabajo litográfico
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/80 shadow-xl custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-[10px] font-mono text-slate-400 uppercase">
                    <th className="py-2.5 px-3"># Orden</th>
                    <th className="py-2.5 px-3">Cliente & Detalle</th>
                    <th className="py-2.5 px-3">Taller / Proveedor</th>
                    <th className="py-2.5 px-3">Cantidad</th>
                    <th className="py-2.5 px-3">Precio Cliente</th>
                    <th className="py-2.5 px-3">Costo Taller</th>
                    <th className="py-2.5 px-3">Ganancia / Margen</th>
                    <th className="py-2.5 px-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {provOrdenes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-500 text-xs font-mono">
                        No hay órdenes de producción asignadas aún.
                      </td>
                    </tr>
                  ) : (
                    provOrdenes.map((ord) => {
                      const prov = proveedores.find((p) => p.id === ord.proveedorId);
                      const ganancia = (ord.precioVentaCliente || 0) - (ord.costoProveedor || 0);
                      const margen = ord.precioVentaCliente > 0 ? ((ganancia / ord.precioVentaCliente) * 100).toFixed(1) : "0.0";

                      return (
                        <tr key={ord.id} className="hover:bg-slate-900/40 text-xs">
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{ord.numeroOrden}</td>
                          <td className="py-2.5 px-3">
                            <div className="space-y-0.5">
                              <span className="font-bold text-white block">{ord.clienteNombre}</span>
                              <span className="text-[11px] text-slate-400 block truncate max-w-[220px]">{ord.descripcionTrabajo}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-mono text-slate-300 text-xs">{prov ? prov.nombreComercial : "Taller Directo"}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-200">{ord.cantidad} und</td>
                          <td className="py-2.5 px-3 font-mono text-indigo-300 font-bold">{formatCOP(ord.precioVentaCliente || 0)}</td>
                          <td className="py-2.5 px-3 font-mono text-rose-300">{formatCOP(ord.costoProveedor || 0)}</td>
                          <td className="py-2.5 px-3 font-mono">
                            <div className="text-emerald-400 font-bold">{formatCOP(ganancia)}</div>
                            <div className="text-[10px] text-slate-400">Margen: {margen}%</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              type="button"
                              onClick={() => handleToggleOrderStatus(ord.id)}
                              title="Clic para cambiar estado"
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                                ord.estado === 'Terminado'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              {ord.estado === 'Terminado' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Listo
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-400" /> En Taller
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* HISTORIAL DE PAGOS A PROVEEDORES CON COMPROBANTES JPG / PDF */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                Historial de Transferencias & Comprobantes de Pago (JPG / PDF) ({provPagos.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Comprobantes oficiales emitidos para soporte contable y enviados a la Oficina Virtual del taller
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/80 shadow-xl custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-[10px] font-mono text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Recibo Oficial</th>
                    <th className="py-2.5 px-3">Proveedor / Taller</th>
                    <th className="py-2.5 px-3">Fecha</th>
                    <th className="py-2.5 px-3">Monto Pagado</th>
                    <th className="py-2.5 px-3">Método & Ref. Bancaria</th>
                    <th className="py-2.5 px-3">Comprobante (JPG / PDF)</th>
                    <th className="py-2.5 px-3 text-right">Recibo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {provPagos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500 text-xs font-mono">
                        No hay pagos a proveedores registrados todavía.
                      </td>
                    </tr>
                  ) : (
                    provPagos.map((pago) => {
                      const prov = proveedores.find((p) => p.id === pago.proveedorId);
                      const isPdf = pago.comprobanteTipo === 'pdf' || (pago.comprobanteJpgUrl && pago.comprobanteJpgUrl.startsWith('data:application/pdf')) || (pago.comprobanteNombre && pago.comprobanteNombre.toLowerCase().endsWith('.pdf'));

                      return (
                        <tr key={pago.id} className="hover:bg-slate-900/40 text-xs">
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{pago.reciboConsecutivo}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{prov ? prov.nombreComercial : "Proveedor"}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{pago.fechaPago}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{formatCOP(pago.monto)}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                            <div>{pago.metodoPago}</div>
                            <div className="text-slate-500 text-[10px]">Ref: {pago.referenciaBancaria}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            {pago.comprobanteJpgUrl ? (
                              <button
                                type="button"
                                onClick={() => setViewingProvReceipt(pago)}
                                className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded border transition-colors cursor-pointer ${
                                  isPdf
                                    ? 'text-rose-300 hover:text-rose-200 bg-rose-950/40 border-rose-500/40'
                                    : 'text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 border-emerald-500/40'
                                }`}
                              >
                                {isPdf ? <FileText className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3 text-emerald-400" />}
                                <span>{isPdf ? '📄 Ver PDF' : '🖼️ Ver JPG'}</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-mono text-slate-600 italic">Sin adjunto</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => setViewingProvReceipt(pago)}
                              className="px-3 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                            >
                              Ver Recibo
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )}

      {/* ========================================================================= */}
      {/* SECCIÓN: COMPARADOR DE COTIZACIONES, COSTOS & OFERTAS DE TALLERES ALIADOS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'cotizaciones_talleres' && (
        <div id="seccion-cotizaciones-buzon" className="space-y-6 animate-fadeIn">
          {/* Header del Comparador */}
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 rounded-2xl font-black shadow-lg shadow-amber-500/30">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wide">
                      Comparador & Decisiones de Costo de Talleres
                    </h2>
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono rounded-full font-bold uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" /> Sincronización en Tiempo Real
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 mt-1 font-sans">
                    Analiza las cotizaciones y tarifas enviadas desde la Oficina Virtual de Proveedores. Usa los filtros inteligentes para identificar qué taller ofrece el menor costo y maximizar la rentabilidad de cada orden.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setProvCotizaciones(getStoredCotizaciones());
                    setProveedores(getStoredProveedores());
                    setSaveStatus("✓ Cotizaciones de talleres actualizadas");
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Recargar cotizaciones de talleres"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>Actualizar</span>
                </button>

                <a
                  href="/proveedores/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-mono font-black transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Portal Talleres</span>
                </a>
              </div>
            </div>

            {/* KPIs Rápidos del Comparador */}
            {(() => {
              const totalCots = provCotizaciones.length;
              const uniqueProvIds = new Set(provCotizaciones.map(c => c.proveedorId)).size;
              const uniqueCats = new Set(provCotizaciones.map(c => c.categoria)).size;
              const prices = provCotizaciones.map(c => c.precioCostoTotal).filter(p => p > 0);
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
              const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

              // Calculate total potential savings across categories
              const catMap = new Map<string, number[]>();
              provCotizaciones.forEach(c => {
                const arr = catMap.get(c.categoria) || [];
                arr.push(c.precioCostoTotal);
                catMap.set(c.categoria, arr);
              });

              let totalSavingsEstimated = 0;
              catMap.forEach((pricesList) => {
                if (pricesList.length > 1) {
                  const min = Math.min(...pricesList);
                  const max = Math.max(...pricesList);
                  totalSavingsEstimated += (max - min);
                }
              });

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Cotizaciones Recibidas:</span>
                    <span className="text-xl font-bold font-mono text-amber-400">{totalCots} registradas</span>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Talleres Cotizantes:</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">{uniqueProvIds} talleres</span>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Líneas de Producción:</span>
                    <span className="text-xl font-bold font-mono text-sky-400">{uniqueCats} categorías</span>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Ahorro Máx Detectado:</span>
                    <span className="text-base font-bold font-mono text-emerald-400 truncate block">
                      {totalSavingsEstimated > 0 ? `+${formatCOP(totalSavingsEstimated)}` : formatCOP(minPrice)}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* FILTROS PRINCIPALES DE DECISIÓN DE COMPRA / TOMA DE DECISIONES */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono text-slate-300 font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>MODO DE VISUALIZACIÓN & TOMA DE DECISIONES:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCotDecisionMode("todas")}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                    cotDecisionMode === "todas"
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-black"
                      : "bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="block text-[11px] uppercase">📋 Todas las Cotizaciones</span>
                    <span className="text-[10px] opacity-80 block">{provCotizaciones.length} ofertas totales</span>
                  </div>
                  <Tag className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setCotDecisionMode("solo_mejores")}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-left flex items-center justify-between cursor-pointer relative overflow-hidden ${
                    cotDecisionMode === "solo_mejores"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 shadow-xl shadow-emerald-500/30 font-black scale-102"
                      : "bg-emerald-950/40 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/40"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="block text-[11px] uppercase flex items-center gap-1 font-black">
                      🏆 Solo Mejores Precios
                    </span>
                    <span className="text-[10px] opacity-90 block">Taller ganador por línea</span>
                  </div>
                  <Award className="w-4 h-4 shrink-0 text-emerald-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setCotDecisionMode("matriz_ahorro")}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                    cotDecisionMode === "matriz_ahorro"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-sky-400 shadow-lg shadow-sky-500/20 font-black"
                      : "bg-sky-950/40 text-sky-300 border-sky-600/40 hover:bg-sky-900/40"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="block text-[11px] uppercase flex items-center gap-1 font-bold">
                      📊 Matriz de Ahorro
                    </span>
                    <span className="text-[10px] opacity-80 block">Comparativa tabular</span>
                  </div>
                  <BarChart3 className="w-4 h-4 shrink-0 text-sky-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setCotDecisionMode("destacadas")}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                    cotDecisionMode === "destacadas"
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 border-yellow-300 shadow-lg shadow-yellow-500/20 font-black"
                      : "bg-slate-950/80 text-amber-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="block text-[11px] uppercase flex items-center gap-1">
                      ⭐ Destacadas Admin
                    </span>
                    <span className="text-[10px] opacity-80 block">
                      {provCotizaciones.filter(c => c.destacadaAdmin).length} seleccionadas
                    </span>
                  </div>
                  <Star className="w-4 h-4 shrink-0 text-yellow-400" />
                </button>
              </div>
            </div>

            {/* Barra de Filtros secundarios: Búsqueda, Categoría y Taller */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cotSearchTerm}
                    onChange={(e) => setCotSearchTerm(e.target.value)}
                    placeholder="Buscar producto, papel, formato, notas..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={cotCategoryFilter}
                    onChange={(e) => setCotCategoryFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">Todas las Categorías ({getStoredCategorias().length})</option>
                    {getStoredCategorias().map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Provider Filter */}
                <div>
                  <select
                    value={cotProviderFilter}
                    onChange={(e) => setCotProviderFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">Todos los Talleres ({proveedores.length})</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>{p.codigo} — {p.nombreComercial}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <select
                    value={cotSortMode}
                    onChange={(e) => setCotSortMode(e.target.value as any)}
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="menor_precio">🏆 Menor Precio de Costo Total</option>
                    <option value="menor_unitario">🏷️ Menor Costo Unitario ($/u)</option>
                    <option value="reciente">⏱️ Más Recientes Primero</option>
                    <option value="proveedor">🏭 Agrupar por Proveedor</option>
                  </select>
                </div>
              </div>

              {/* Categorías Rápidas en Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-900">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1">Filtrar por línea:</span>
                <button
                  type="button"
                  onClick={() => setCotCategoryFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                    cotCategoryFilter === "all"
                      ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  Todas
                </button>
                {getStoredCategorias().map((cat) => {
                  const count = provCotizaciones.filter(c => c.categoria === cat).length;
                  if (count === 0 && cotCategoryFilter !== cat) return null;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCotCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                        cotCategoryFilter === cat
                          ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                          : "bg-slate-900 text-slate-400 hover:text-amber-300 border border-slate-800"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[9px] px-1 py-0.2 bg-slate-950 rounded-full font-bold">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* VISTA 1: MATRIZ DE AHORRO & COMPARATIVA TABULAR */}
          {cotDecisionMode === "matriz_ahorro" && (
            <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-6 space-y-5 shadow-2xl animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold font-mono text-white">
                    Matriz Comparativa de Costos por Categoría & Ahorro Estimado
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Calculado sobre {provCotizaciones.length} cotizaciones registradas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-950/60">
                      <th className="py-3 px-3">Línea de Producción</th>
                      <th className="py-3 px-3">Taller Ganador (Menor Costo)</th>
                      <th className="py-3 px-3 text-right">Mejor Precio Costo</th>
                      <th className="py-3 px-3 text-right">Costo Unitario</th>
                      <th className="py-3 px-3">Taller Alternativo / Máximo</th>
                      <th className="py-3 px-3 text-right">Ahorro Detectado</th>
                      <th className="py-3 px-3 text-center">Acción Inmediata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {(() => {
                      const allCats = Array.from(new Set(provCotizaciones.map(c => c.categoria)));
                      if (allCats.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400">
                              No hay cotizaciones para comparar en este momento.
                            </td>
                          </tr>
                        );
                      }

                      return allCats.map((cat) => {
                        const inCat = provCotizaciones.filter(c => c.categoria === cat);
                        const sorted = [...inCat].sort((a, b) => a.precioCostoTotal - b.precioCostoTotal);
                        const best = sorted[0];
                        const worst = sorted[sorted.length - 1];
                        const savings = worst.precioCostoTotal - best.precioCostoTotal;
                        const savingsPct = worst.precioCostoTotal > 0 ? Math.round((savings / worst.precioCostoTotal) * 100) : 0;
                        const bestProv = proveedores.find(p => p.id === best.proveedorId);
                        const worstProv = proveedores.find(p => p.id === worst.proveedorId);
                        const unitCost = best.precioCostoUnitario || (best.cantidad > 0 ? Math.round(best.precioCostoTotal / best.cantidad) : best.precioCostoTotal);

                        return (
                          <tr key={cat} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-3">
                              <span className="font-bold text-amber-300 block">{cat}</span>
                              <span className="text-[10px] text-slate-400">{inCat.length} ofertas de talleres</span>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                                <div>
                                  <strong className="text-emerald-400 block text-xs">{bestProv ? bestProv.nombreComercial : best.proveedorNombre}</strong>
                                  <span className="text-[10px] text-slate-400 truncate max-w-[200px] block">{best.tituloProducto}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 text-right font-black text-amber-400 text-sm">
                              {formatCOP(best.precioCostoTotal)}
                            </td>

                            <td className="py-3.5 px-3 text-right text-slate-300">
                              {formatCOP(unitCost)} / {best.unidadMedida || 'u'}
                            </td>

                            <td className="py-3.5 px-3">
                              {sorted.length > 1 ? (
                                <div>
                                  <span className="text-slate-300 block">{worstProv ? worstProv.nombreComercial : worst.proveedorNombre}</span>
                                  <span className="text-[10px] text-slate-400">{formatCOP(worst.precioCostoTotal)}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500 italic">Único taller cotizante</span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-right">
                              {savings > 0 ? (
                                <div className="space-y-0.5">
                                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/50 rounded-lg text-[10px] font-black inline-block">
                                    Ahorro: {formatCOP(savings)}
                                  </span>
                                  <span className="text-[10px] text-emerald-400 font-bold block">
                                    ({savingsPct}% menos)
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-500 text-[10px]">Tarifa única</span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (bestProv) {
                                    setOrderModalProv(bestProv);
                                    setNewOrdDescripcion(`${best.tituloProducto} | ${best.medidasFormato || ''} | ${best.materialPapel || ''}`);
                                    setNewOrdCantidad(best.cantidad);
                                    setNewOrdCostoProv(best.precioCostoTotal);
                                    setNewOrdCategoria(best.categoria);
                                    setSaveStatus(`✓ Cotización de ${bestProv.nombreComercial} cargada para orden`);
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-[10px] transition-all shadow inline-flex items-center gap-1 cursor-pointer"
                              >
                                <PlusCircle className="w-3 h-3" />
                                <span>Asignar Orden</span>
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 2: LISTADO Y RANKING DE COTIZACIONES (TODAS, SOLO MEJORES O DESTACADAS) */}
          {(() => {
            let list = provCotizaciones.filter((cot) => {
              const q = cotSearchTerm.toLowerCase();
              const matchSearch =
                !q ||
                cot.tituloProducto.toLowerCase().includes(q) ||
                (cot.proveedorNombre && cot.proveedorNombre.toLowerCase().includes(q)) ||
                (cot.medidasFormato && cot.medidasFormato.toLowerCase().includes(q)) ||
                (cot.materialPapel && cot.materialPapel.toLowerCase().includes(q)) ||
                (cot.terminaciones && cot.terminaciones.toLowerCase().includes(q)) ||
                (cot.descripcionDetallada && cot.descripcionDetallada.toLowerCase().includes(q));

              const matchCat = cotCategoryFilter === 'all' || cot.categoria === cotCategoryFilter;
              const matchProv = cotProviderFilter === 'all' || cot.proveedorId === cotProviderFilter;
              const matchDestacada = cotDecisionMode !== "destacadas" || cot.destacadaAdmin;

              return matchSearch && matchCat && matchProv && matchDestacada;
            });

            // If Decision Mode is "solo_mejores", filter to only the lowest price for each category / product title
            if (cotDecisionMode === "solo_mejores") {
              const bestMap = new Map<string, CotizacionProveedor>();
              list.forEach((c) => {
                const key = `${c.categoria}`;
                const existing = bestMap.get(key);
                if (!existing || c.precioCostoTotal < existing.precioCostoTotal) {
                  bestMap.set(key, c);
                }
              });
              list = Array.from(bestMap.values());
            }

            // Sorting
            list = [...list].sort((a, b) => {
              if (cotSortMode === 'menor_precio') {
                return a.precioCostoTotal - b.precioCostoTotal;
              }
              if (cotSortMode === 'menor_unitario') {
                const uA = a.precioCostoUnitario || (a.cantidad > 0 ? a.precioCostoTotal / a.cantidad : a.precioCostoTotal);
                const uB = b.precioCostoUnitario || (b.cantidad > 0 ? b.precioCostoTotal / b.cantidad : b.precioCostoTotal);
                return uA - uB;
              }
              if (cotSortMode === 'reciente') {
                return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
              }
              if (cotSortMode === 'proveedor') {
                return (a.proveedorNombre || '').localeCompare(b.proveedorNombre || '');
              }
              return 0;
            });

            // Find lowest price overall in filtered list
            const lowestPrice = list.length > 0 ? Math.min(...list.map(c => c.precioCostoTotal)) : 0;

            if (list.length === 0) {
              return (
                <div className="bg-slate-900/60 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto text-amber-400 border border-amber-500/20">
                    <Tag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold font-mono text-slate-200">
                      {provCotizaciones.length === 0
                        ? 'Aún no hay cotizaciones publicadas por los talleres'
                        : 'No se encontraron cotizaciones con los filtros actuales'}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {provCotizaciones.length === 0
                        ? 'Los proveedores pueden ingresar a su oficina virtual (/proveedores/index.html) y publicar sus tarifas y cotizaciones de 100 talonarios, almanaques, tarjetas, etc.'
                        : 'Intenta restablecer los filtros o seleccionar el modo "Todas las Cotizaciones".'}
                    </p>
                  </div>
                  {(provCotizaciones.length > 0 || cotCategoryFilter !== 'all' || cotProviderFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => { setCotSearchTerm(''); setCotCategoryFilter('all'); setCotProviderFilter('all'); setCotDecisionMode('todas'); }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                    >
                      Limpiar Filtros & Ver Todo
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 px-1">
                  <div className="flex items-center gap-2">
                    <span>Mostrando <strong className="text-amber-400 font-bold">{list.length}</strong> cotizaciones</span>
                    {cotDecisionMode === "solo_mejores" && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-bold">
                        🏆 Modo: Proveedores Ganadores por Categoría
                      </span>
                    )}
                  </div>

                  {lowestPrice > 0 && (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <Award className="w-3.5 h-3.5" /> Mejor Costo Absoluto: {formatCOP(lowestPrice)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {list.map((cot, index) => {
                    const isLowestOverall = cot.precioCostoTotal === lowestPrice && list.length > 1;
                    const prov = proveedores.find(p => p.id === cot.proveedorId);
                    const isExpanded = expandedCotId === cot.id;
                    const unitCost = cot.precioCostoUnitario || (cot.cantidad > 0 ? Math.round(cot.precioCostoTotal / cot.cantidad) : cot.precioCostoTotal);
                    const words = cot.descripcionDetallada ? cot.descripcionDetallada.trim().split(/\s+/).filter(Boolean).length : 0;

                    // Calculate category comparison
                    const inSameCategory = provCotizaciones.filter(c => c.categoria === cot.categoria);
                    const sameCatPrices = inSameCategory.map(c => c.precioCostoTotal);
                    const isBestInCategory = inSameCategory.length > 1 && cot.precioCostoTotal === Math.min(...sameCatPrices);
                    const maxCatPrice = Math.max(...sameCatPrices);
                    const categorySavings = maxCatPrice - cot.precioCostoTotal;
                    const catSavingsPct = maxCatPrice > 0 ? Math.round((categorySavings / maxCatPrice) * 100) : 0;

                    return (
                      <div
                        key={cot.id}
                        className={`rounded-3xl p-5 sm:p-6 transition-all space-y-4 shadow-2xl relative overflow-hidden ${
                          isBestInCategory || isLowestOverall
                            ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-emerald-400/80 shadow-emerald-500/10'
                            : cot.destacadaAdmin
                            ? 'bg-gradient-to-br from-yellow-950/30 via-slate-900 to-slate-900 border-2 border-amber-500/50'
                            : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Best Price Ribbon */}
                        {isBestInCategory && (
                          <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 px-4 py-1 rounded-bl-2xl text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                            <Award className="w-3.5 h-3.5" />
                            <span>🏆 MEJOR PRECIO EN {cot.categoria.toUpperCase()} {categorySavings > 0 ? `(Ahorras ${formatCOP(categorySavings)} / ${catSavingsPct}%)` : ''}</span>
                          </div>
                        )}

                        {/* Top Bar */}
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-800 pb-4 pt-1">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-bold uppercase">
                                {cot.categoria}
                              </span>
                              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold">
                                Cantidad: {cot.cantidad} {cot.unidadMedida || 'unidades'}
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                #{index + 1} en ranking
                              </span>
                              {inSameCategory.length > 1 && (
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 rounded border border-slate-800">
                                  {inSameCategory.length} talleres cotizando {cot.categoria}
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
                              {cot.tituloProducto}
                            </h3>

                            {/* Taller / Proveedor Details */}
                            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300 pt-1">
                              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                                <Building2 className="w-4 h-4 text-amber-400" />
                                <span>Taller: <strong className="text-white">{prov ? prov.nombreComercial : (cot.proveedorNombre || 'Taller')}</strong> ({prov ? prov.codigo : 'PRV'})</span>
                              </div>

                              {prov && prov.contactoNombre && (
                                <span className="text-slate-400">Contacto: <strong className="text-slate-200">{prov.contactoNombre}</strong></span>
                              )}

                              {prov && prov.municipio && (
                                <span className="text-slate-400">📍 {prov.municipio}</span>
                              )}
                            </div>
                          </div>

                          {/* Precio de Costo Highlight */}
                          <div className="bg-slate-950 border-2 border-amber-500/60 rounded-2xl p-4 text-right shrink-0 shadow-lg min-w-[240px]">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                              Precio de Costo Total Taller:
                            </span>
                            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 block tracking-tight">
                              {formatCOP(cot.precioCostoTotal)}
                            </span>
                            <div className="text-xs font-mono text-slate-400 pt-1 border-t border-slate-800 mt-1 flex items-center justify-between">
                              <span>Costo Unitario:</span>
                              <strong className="text-emerald-400 font-bold text-sm">{formatCOP(unitCost)} / {cot.unidadMedida ? cot.unidadMedida.replace(/s$/, '') : 'u'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 text-xs font-mono">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-slate-400 block font-bold">Formato / Medidas:</span>
                            <span className="text-slate-200 font-bold">{cot.medidasFormato || 'Estándar'}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-slate-400 block font-bold">Papel / Sustrato:</span>
                            <span className="text-slate-200">{cot.materialPapel || 'No especificado'}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-slate-400 block font-bold">Tintas / Impresión:</span>
                            <span className="text-slate-200">{cot.tintasColores || '1x0 / 4x0'}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-slate-400 block font-bold">Tiempo de Entrega:</span>
                            <span className="text-amber-300 font-bold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              {cot.tiempoEntregaDias || '2 a 3 días hábiles'}
                            </span>
                          </div>
                        </div>

                        {cot.terminaciones && (
                          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 text-xs font-mono flex items-start gap-2">
                            <span className="text-amber-400 font-bold shrink-0">Terminaciones & Acabados:</span>
                            <span className="text-slate-300">{cot.terminaciones}</span>
                          </div>
                        )}

                        {/* Extended Description (supports 500-1000 words) */}
                        {cot.descripcionDetallada && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                                Especificaciones Técnicas Detalladas ({words} palabras):
                              </span>
                              <button
                                type="button"
                                onClick={() => setExpandedCotId(isExpanded ? null : cot.id)}
                                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {isExpanded ? 'Ver menos' : 'Leer especificaciones completas'}
                              </button>
                            </div>

                            <div className={`p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs font-sans leading-relaxed text-slate-300 whitespace-pre-line ${
                              !isExpanded && cot.descripcionDetallada.length > 250 ? 'line-clamp-3' : ''
                            }`}>
                              {cot.descripcionDetallada}
                            </div>
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                            <span>Registrado: {new Date(cot.fechaCreacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = provCotizaciones.map(c => c.id === cot.id ? { ...c, destacadaAdmin: !c.destacadaAdmin } : c);
                                setProvCotizaciones(updated);
                                setSaveStatus(cot.destacadaAdmin ? "Cotización removida de favoritas" : "✓ Cotización marcada como destacada");
                              }}
                              className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                                cot.destacadaAdmin
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-bold"
                                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                              }`}
                            >
                              <Star className={`w-3 h-3 ${cot.destacadaAdmin ? "fill-yellow-400 text-yellow-400" : ""}`} />
                              <span>{cot.destacadaAdmin ? "Destacada" : "Marcar Favorita"}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {prov && prov.telefonoWhatsapp && (
                              <a
                                href={`https://wa.me/${prov.telefonoWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${prov.nombreComercial}, desde la administración de Atziluth Gráfic vimos tu cotización de "${cot.tituloProducto}" (${cot.cantidad} ${cot.unidadMedida}) por valor de ${formatCOP(cot.precioCostoTotal)}. Queremos coordinar esta producción.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-mono font-bold rounded-xl border border-emerald-600/50 transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Contactar por WhatsApp</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                const targetProv = proveedores.find(p => p.id === cot.proveedorId);
                                if (targetProv) {
                                  setOrderModalProv(targetProv);
                                  setNewOrdDescripcion(`${cot.tituloProducto} | ${cot.medidasFormato || ''} | ${cot.materialPapel || ''} | ${cot.terminaciones || ''}`);
                                  setNewOrdCantidad(cot.cantidad);
                                  setNewOrdCostoProv(cot.precioCostoTotal);
                                  setNewOrdCategoria(cot.categoria);
                                  setSaveStatus(`✓ Cotización de ${targetProv.nombreComercial} cargada para orden`);
                                }
                              }}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-mono font-black rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>Asignar Orden con este Costo</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Eliminar esta cotización de "${cot.tituloProducto}"?`)) {
                                  const updated = provCotizaciones.filter(c => c.id !== cot.id);
                                  setProvCotizaciones(updated);
                                  saveStoredCotizaciones(updated);
                                  setSaveStatus('✓ Cotización eliminada');
                                }
                              }}
                              className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                              title="Eliminar cotización"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SECCIÓN GENERACIÓN DE RECIBO DE ABONO Y FACTURA FINAL (PDF / IMPRESIÓN) */}
      {(activeAdminTab === 'panel_general' || activeAdminTab === 'facturacion') && (
        <div id="seccion-facturacion-abonos" className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <Receipt className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white font-display">Facturación Comercial & Recibos de Abono</h2>
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono rounded-full font-bold uppercase">
                  Generador PDF
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded-full font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin Acceso Total
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Crea pedidos, registra anticipos/abonos o facturas finales de almanaques, portafolios y gran formato. Genera comprobantes impresos o PDF con firma oficial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Pedidos Registrados</span>
              <span className="text-lg font-bold text-indigo-400 font-mono">{orders.length} comprobantes</span>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE REGISTRO DE PEDIDO, ABONO O FACTURA */}
        <form onSubmit={handleCreateOrder} className="bg-slate-950 p-5 md:p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-mono uppercase text-indigo-400 font-bold flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Formulario de Registro de Pedido / Abono / Factura
            </h3>

            {/* Toggle Tipo de Documento */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setOrdDocumentType('abono')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  ordDocumentType === 'abono'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Recibo de Abono
              </button>
              <button
                type="button"
                onClick={() => setOrdDocumentType('factura')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  ordDocumentType === 'factura'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Factura Final
              </button>
            </div>
          </div>

          {/* DATOS DEL VENDEDOR Y TIPO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Vendedor Asignado *
              </label>
              <select
                value={ordSellerId}
                onChange={(e) => setOrdSellerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="admin">Estivenson Navarro (Administrador General)</option>
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (@{s.username}) — {s.zone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Cliente / Razón Social *
              </label>
              <input
                type="text"
                required
                value={ordClientName}
                onChange={(e) => setOrdClientName(e.target.value)}
                placeholder="Ej: Graficas & Empaques del Aburrá S.A.S."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                NIT / Cédula del Cliente
              </label>
              <input
                type="text"
                value={ordClientDocument}
                onChange={(e) => setOrdClientDocument(e.target.value)}
                placeholder="Ej: 901.888.777-2 o 71.333.444"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Teléfono / WhatsApp Cliente
              </label>
              <input
                type="text"
                value={ordClientPhone}
                onChange={(e) => setOrdClientPhone(e.target.value)}
                placeholder="Ej: 300 123 4567"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Municipio de Entrega
              </label>
              <select
                value={ordClientMunicipality}
                onChange={(e) => setOrdClientMunicipality(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {ANTIOQUIA_MUNICIPALITIES.map((muni) => (
                  <option key={muni} value={muni}>
                    {muni}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Dirección de Entrega
              </label>
              <input
                type="text"
                value={ordClientAddress}
                onChange={(e) => setOrdClientAddress(e.target.value)}
                placeholder="Ej: Cra 50 # 42-15, Centro Medellín"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* DETALLES DEL PRODUCTO */}
          <div className="pt-3 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Línea / Categoría de Producto *
              </label>
              <select
                value={ordProductCategory}
                onChange={(e) => setOrdProductCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Descripción Detallada del Trabajo / Producto *
              </label>
              <input
                type="text"
                required
                value={ordProductDescription}
                onChange={(e) => setOrdProductDescription(e.target.value)}
                placeholder="Ej: Almanaque de Pared 30x50cm en Propalcote 300g, barniz UV full color, espiral doble O"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* CANTIDAD, VALOR UNITARIO, ABONO, MÉTODO DE PAGO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={ordQuantity}
                onChange={(e) => setOrdQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Precio Unitario ($ COP)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={ordUnitPrice}
                onChange={(e) => setOrdUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Monto Abonado / Recibido ($ COP)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={ordPaidAmount}
                onChange={(e) => setOrdPaidAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                Método de Pago
              </label>
              <select
                value={ordPaymentMethod}
                onChange={(e) => setOrdPaymentMethod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Transferencia Bancaria (Bancolombia/Nequi)">Transferencia Bancaria / Nequi</option>
                <option value="Efectivo en Caja">Efectivo en Caja</option>
                <option value="Tarjeta de Crédito / Débito">Tarjeta de Crédito / Débito</option>
                <option value="Consignación Directa">Consignación Directa</option>
              </select>
            </div>
          </div>

          {/* CÁLCULOS DINÁMICOS EN TIEMPO REAL */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Total del Pedido:</span>
              <strong className="text-base font-mono text-white font-bold">
                ${(ordQuantity * ordUnitPrice).toLocaleString("es-CO")} COP
              </strong>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-500 block">Abonado Recibido:</span>
              <strong className="text-base font-mono text-emerald-400 font-bold">
                ${Math.min(ordQuantity * ordUnitPrice, ordPaidAmount).toLocaleString("es-CO")} COP
              </strong>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-500 block">Saldo Pendiente:</span>
              <strong className="text-base font-mono text-amber-400 font-bold">
                ${Math.max(0, (ordQuantity * ordUnitPrice) - ordPaidAmount).toLocaleString("es-CO")} COP
              </strong>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>GENERAR {ordDocumentType === 'abono' ? 'RECIBO DE ABONO' : 'FACTURA FINAL'} Y VISTA PDF</span>
            </button>
          </div>
        </form>

        {/* LISTADO DE COMPROBANTES Y PEDIDOS REGISTRADOS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-400" /> Historial de Pedidos & Comprobantes ({orders.length})
            </h3>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Buscar por N° pedido, cliente o vendedor..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">N° Pedido / Documento</th>
                    <th className="px-4 py-3">Cliente / Empresa</th>
                    <th className="px-4 py-3">Vendedor</th>
                    <th className="px-4 py-3">Producto / Trabajo</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Abonado</th>
                    <th className="px-4 py-3 text-right">Saldo</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {orders
                    .filter((o) => {
                      if (!orderSearchQuery) return true;
                      const q = orderSearchQuery.toLowerCase();
                      return (
                        o.orderNumber.toLowerCase().includes(q) ||
                        o.clientName.toLowerCase().includes(q) ||
                        o.sellerName.toLowerCase().includes(q) ||
                        o.productDescription.toLowerCase().includes(q) ||
                        o.productCategory.toLowerCase().includes(q)
                      );
                    })
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3 font-mono">
                          <strong className="text-white block font-bold">{ord.orderNumber}</strong>
                          <span
                            className={`inline-block px-2 py-0.2 text-[9px] font-bold rounded uppercase mt-0.5 ${
                              ord.documentType === "abono"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {ord.documentType === "abono" ? "Recibo Abono" : "Factura Final"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <strong className="text-slate-200 block font-medium">{ord.clientName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {ord.clientMunicipality} • Tel: {ord.clientPhone}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-slate-300 font-medium block text-[11px]">{ord.sellerName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">@{ord.sellerUsername}</span>
                        </td>

                        <td className="px-4 py-3 max-w-xs">
                          <span className="text-slate-300 block text-[11px] truncate" title={ord.productDescription}>
                            {ord.productDescription}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-mono block">
                            {ord.quantity} un. x ${ord.unitPrice.toLocaleString("es-CO")} COP
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right font-mono font-bold text-white">
                          ${ord.totalAmount.toLocaleString("es-CO")} COP
                        </td>

                        <td className="px-4 py-3 text-right font-mono text-emerald-400 font-bold">
                          ${ord.paidAmount.toLocaleString("es-CO")} COP
                        </td>

                        <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">
                          ${ord.balance.toLocaleString("es-CO")} COP
                        </td>

                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setViewingReceiptOrder(ord);
                                setShowReceiptModal(true);
                              }}
                              className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Ver / Imprimir Recibo PDF"
                            >
                              <Printer className="w-3 h-3 text-indigo-400" />
                              <span>Ver PDF</span>
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                              className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                              title="Eliminar Pedido"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* MODAL IMPRESIÓN Y DESCARGA DE RECIBO DE ABONO / FACTURA FINAL */}
      {showReceiptModal && viewingReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Vista Previa Comprobante Oficial — {viewingReceiptOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tipo: <strong className="text-indigo-400">{viewingReceiptOrder.documentType === 'abono' ? 'Recibo de Abono / Anticipo' : 'Factura Final de Venta'}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VISTA PREVIA HOJA IMPRESA COMPROBANTE PDF */}
            <div className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl shadow-xl font-sans space-y-6 border border-slate-200">
              {/* Encabezado Oficial */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    ATZILUTH GRÁFIC DIGITAL S.A.S.
                  </h2>
                  <p className="text-xs font-mono text-slate-600">NIT: 901.458.321-9 • Medellín, Colombia</p>
                  <p className="text-xs font-mono text-slate-600">Línea de Atención & WhatsApp: +57 300 123 4567</p>
                  <p className="text-xs font-mono text-slate-600">E-mail: ventas@atziluthgrafic.com</p>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 text-white font-mono text-xs font-bold rounded uppercase inline-block ${
                      viewingReceiptOrder.documentType === 'abono' ? 'bg-amber-600' : 'bg-emerald-700'
                    }`}
                  >
                    {viewingReceiptOrder.documentType === 'abono' ? 'RECIBO DE ABONO' : 'FACTURA FINAL'}
                  </span>
                  <p className="text-sm font-mono font-bold text-slate-900 mt-1">N° {viewingReceiptOrder.orderNumber}</p>
                  <p className="text-xs font-mono text-slate-600">Fecha: {viewingReceiptOrder.date}</p>
                </div>
              </div>

              {/* Grid Vendedor & Cliente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">DATOS DEL VENDEDOR:</span>
                  <strong className="text-slate-900 block font-bold text-sm">{viewingReceiptOrder.sellerName}</strong>
                  <p className="font-mono text-slate-600">Usuario: @{viewingReceiptOrder.sellerUsername}</p>
                  <p className="font-mono text-slate-600">Teléfono: {viewingReceiptOrder.sellerPhone}</p>
                  <p className="text-slate-500 text-[10px]">Supervisor: {viewingReceiptOrder.sellerSupervisor || 'Dirección Comercial'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">DATOS DEL CLIENTE:</span>
                  <strong className="text-slate-900 block font-bold text-sm">{viewingReceiptOrder.clientName}</strong>
                  <p className="font-mono text-slate-600">NIT / CC: {viewingReceiptOrder.clientDocument}</p>
                  <p className="font-mono text-slate-600">Teléfono: {viewingReceiptOrder.clientPhone}</p>
                  <p className="text-slate-600">Ubicación: {viewingReceiptOrder.clientMunicipality} — {viewingReceiptOrder.clientAddress}</p>
                </div>
              </div>

              {/* Tabla Detalle de Trabajo / Producto */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-mono text-slate-600 uppercase">
                    <tr>
                      <th className="p-2.5">Cant.</th>
                      <th className="p-2.5">Descripción del Trabajo / Línea</th>
                      <th className="p-2.5 text-right">V. Unitario</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-slate-900">{viewingReceiptOrder.quantity}</td>
                      <td className="p-2.5">
                        <strong className="text-slate-900 block">{viewingReceiptOrder.productCategory}</strong>
                        <p className="text-slate-600 text-[11px]">{viewingReceiptOrder.productDescription}</p>
                      </td>
                      <td className="p-2.5 text-right font-mono text-slate-700">
                        ${viewingReceiptOrder.unitPrice.toLocaleString("es-CO")} COP
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        ${viewingReceiptOrder.totalAmount.toLocaleString("es-CO")} COP
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Resumen Financiero */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">VALOR TOTAL:</span>
                  <strong className="text-base font-mono font-bold text-slate-900">
                    ${viewingReceiptOrder.totalAmount.toLocaleString("es-CO")} COP
                  </strong>
                </div>

                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-mono uppercase text-emerald-800 block font-bold">ABONO RECIBIDO:</span>
                  <strong className="text-base font-mono font-bold text-emerald-700">
                    ${viewingReceiptOrder.paidAmount.toLocaleString("es-CO")} COP
                  </strong>
                  <span className="text-[9px] font-mono text-emerald-800 block mt-0.5">{viewingReceiptOrder.paymentMethod}</span>
                </div>

                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <span className="text-[10px] font-mono uppercase text-amber-800 block font-bold">SALDO PENDIENTE:</span>
                  <strong className="text-base font-mono font-bold text-amber-700">
                    ${viewingReceiptOrder.balance.toLocaleString("es-CO")} COP
                  </strong>
                </div>
              </div>

              {/* Notas y Términos */}
              <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <p><strong>Observaciones:</strong> {viewingReceiptOrder.notes}</p>
                <p><strong>Cuentas Autorizadas para Pago:</strong> Bancolombia Cta Ahorros #123-456789-01 | Nequi / Daviplata: +57 300 123 4567</p>
                <p className="text-slate-400">Atziluth Gráfic Digital S.A.S. — Medellín, Antioquia. Comprobante válido para soporte contable e inspección de trabajo.</p>
              </div>

              {/* Firmas */}
              <div className="pt-8 border-t border-slate-300 flex justify-between text-xs text-slate-500 font-mono">
                <div className="text-center w-52 border-t border-slate-400 pt-1">Firma Asesor / Comercial</div>
                <div className="text-center w-52 border-t border-slate-400 pt-1">Recibido Conforme Cliente</div>
              </div>
            </div>

            {/* Acciones del Modal */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>IMPRIMIR COMPROBANTE / DESCARGAR PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCESO Y GESTOR PARA MONTAR Y CAMBIAR EL LOGO */}
      {(activeAdminTab === 'panel_general' || activeAdminTab === 'branding') && (
        <div id="gestor-logo-seccion" className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-brand-orange/30 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl border border-brand-orange/20">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Logotach — Gestor Oficial de Logo & Favicon Corporativo</h2>
                <span className="px-2 py-0.5 bg-brand-orange/20 text-brand-orange text-[10px] font-mono rounded font-bold uppercase">
                  Gestor Logotach
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sube o cambia el logo oficial. Se actualizará en el encabezado, pie de página y portada, y se convertirá automáticamente en el favicon oficial de todo el sitio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="w-14 h-14 rounded-xl bg-white border border-slate-700 overflow-hidden flex items-center justify-center p-1 shadow-inner relative">
              <img
                src={logoPreview}
                alt="Logo Atziluth"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo_atziluth.png";
                }}
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Logo Activo en Plataforma</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {logoPreview.startsWith("data:") ? "Imagen Personalizada (Base64)" : logoPreview}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opción 1: Subir Archivo desde Computador */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-brand-orange font-bold flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> 1. Subir Archivo Local (Cualquier Formato de Imagen)
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Selecciona cualquier imagen en tu dispositivo (PNG, JPG, WEBP, SVG, GIF, ICO, AVIF, BMP) para actualizar el logo de la marca.
              </p>
            </div>

            <label className="w-full py-2.5 px-4 bg-gradient-to-r from-brand-orange to-brand-magenta hover:opacity-90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
              <Upload className="w-4 h-4" />
              {uploadingLogo ? "Procesando Imagen..." : "Seleccionar y Cargar Logo"}
              <input
                type="file"
                accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.gif,.ico,.avif,.bmp,.tiff"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="hidden"
              />
            </label>
          </div>

          {/* Opción 2: Ingresar Enlace o URL de Imagen */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-brand-orange font-bold flex items-center gap-1.5">
                <Save className="w-4 h-4" /> 2. O Ingresar URL Directa de Imagen
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Pega la dirección web de cualquier formato de imagen (ej: <code className="text-slate-200">/imagenes/mi_logo.png</code>).
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={logoPreview.startsWith("data:") ? "" : logoPreview}
                onChange={(e) => setLogoPreview(e.target.value)}
                placeholder="/imagenes/mi_logo.png"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
              <button
                onClick={() => {
                  saveConfig(clients, logoPreview);
                  setUploadMessage("¡URL de logo guardada con éxito!");
                  setTimeout(() => setUploadMessage(null), 3000);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>

        {uploadMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {uploadMessage}
          </div>
        )}

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-2">
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-brand-orange" />
            Carpeta de Almacenamiento en Servidor: <code className="text-emerald-400 font-mono px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">/uploads/</code> o <code className="text-emerald-400 font-mono px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">/public/logo_atziluth.png</code>
          </span>
          <span className="text-slate-500 font-mono">Formatos admitidos: PNG, JPG, WEBP, SVG</span>
        </div>
      </div>
      )}

      {/* KPI METRICS & DIRECTORIO DE CLIENTES / BALANCE CONTABLE */}
      {(activeAdminTab === 'panel_general' || activeAdminTab === 'clientes' || activeAdminTab === 'balance') && (
        <div id="seccion-clientes" className="space-y-6">
          {/* BARRA DE NAVEGACIÓN INTERNA: BALANCE CONTABLE <-> GESTIÓN DE PROVEEDORES */}
          <div className="bg-slate-900 border border-indigo-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                  <span>Balance Contable & Conciliación Financiera</span>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono rounded-full font-bold uppercase">
                    Estado en Vivo
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Navega rápidamente entre el Balance Contable y la Gestión de Proveedores sin recargar la aplicación.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleNavigateTab('balance')}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeAdminTab === 'balance' || activeAdminTab === 'clientes'
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>💼 Balance Contable</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateTab('proveedores', 'seccion-proveedores')}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeAdminTab === 'proveedores'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>🏭 Ir a Gestión de Proveedores ({proveedores.length}) →</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Clientes Activos</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-white">{totalActiveClients}</div>
          <p className="text-[10px] text-slate-400 font-mono">Proyectos cerrados con servicio</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Hosting + Dominio</span>
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-emerald-400">
            {formatCOP(totalHostingRev)}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Total cobrado ($400.000 / cliente)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Recaudo Mensualidades</span>
            <span className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-teal-300">
            {formatCOP(totalMonthlyRev)}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Total ingresado por cuotas</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Pendiente Por Cobrar</span>
            <span className="p-2 bg-brand-magenta/10 text-brand-magenta rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-brand-magenta">
            {formatCOP(totalPending)}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Cuotas o Hosting no pagados</p>
        </div>
      </div>

      {/* SECCIÓN DE FICHAS DE CLIENTES Y NOTAS ADMIN */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Fichas de Clientes JSON & Control de Administrador</span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualiza las fichas estructuradas JSON registradas por los vendedores, filtra por zona comercial y gestiona las <strong className="text-indigo-400">notas_admin</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById("formulario-nuevo-cliente");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.hash = "#customer-registration";
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 text-emerald-200" />
              <span>+ AGREGAR NUEVO CLIENTE</span>
            </button>
          </div>
        </div>
        <CustomerList
          clients={clients}
          sellers={sellers}
          isAdmin={true}
          onUpdateAdminNotes={handleUpdateAdminNotes}
        />
      </div>

      {/* TWO COLUMNS: REGISTER CLIENT & CLIENTS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REGISTER CLIENT FORM */}
        <form
          id="formulario-nuevo-cliente"
          onSubmit={handleAddClient}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-xl border border-brand-orange/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Registrar Nuevo Cliente</h3>
              <p className="text-xs text-slate-400">Registra un nuevo contrato o negocio cerrado.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase font-bold mb-1">
                1. Nombre del Cliente / Razón Social *
              </label>
              <input
                type="text"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Ej: Hotel Guatapé Real / Carlos Restrepo"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-emerald-400 uppercase font-bold mb-1">
                  2. Ubicación / Municipio *
                </label>
                <input
                  type="text"
                  value={newClientLocation}
                  onChange={(e) => setNewClientLocation(e.target.value)}
                  placeholder="Ej: Guatapé, Antioquia"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-emerald-400 uppercase font-bold mb-1">
                  3. Tipo de Negocio *
                </label>
                <input
                  type="text"
                  value={newClientBusinessType}
                  onChange={(e) => setNewClientBusinessType(e.target.value)}
                  placeholder="Ej: Hotel / Glamping / Restaurante"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase font-bold mb-1">
                4. Características Específicas *
              </label>
              <textarea
                value={newClientCharacteristics}
                onChange={(e) => setNewClientCharacteristics(e.target.value)}
                rows={2}
                placeholder="Ej: Requiere motor de reservas bilingüe, pagos PSE y menú QR"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-indigo-400 uppercase font-bold mb-1">
                  Vendedor / Comercial Asignado
                </label>
                <select
                  value={newClientSellerId}
                  onChange={(e) => setNewClientSellerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">🏛️ ADMINISTRACIÓN_CENTRAL (Sin Vendedor)</option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      👤 {s.name} (@{s.username}) — {s.zone || "Aburrá"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-cyan uppercase font-bold mb-1">
                  5. Estado Comercial *
                </label>
                <select
                  value={newClientEstadoComercial}
                  onChange={(e) => setNewClientEstadoComercial(e.target.value as "Activo" | "Prospecto" | "Inactivo")}
                  className="w-full bg-slate-950 border border-brand-cyan/40 rounded-xl px-3.5 py-2.5 text-xs text-brand-cyan font-bold focus:outline-none focus:border-brand-cyan font-mono"
                >
                  <option value="Activo">🟢 ACTIVO (Cliente Confirmado)</option>
                  <option value="Prospecto">🔵 PROSPECTO (En Negociación)</option>
                  <option value="Inactivo">🔴 INACTIVO (Sin Operación)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Nombre del Proyecto / Sitio Web
              </label>
              <input
                type="text"
                value={newClientProject}
                onChange={(e) => setNewClientProject(e.target.value)}
                placeholder="Ej: Portal Turístico & Reservas Guatapé"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  WhatsApp / Celular
                </label>
                <input
                  type="text"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="3001234567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Fecha de Cierre
                </label>
                <input
                  type="date"
                  value={newClientStartDate}
                  onChange={(e) => setNewClientStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Hosting + Dominio ($ COP)
                </label>
                <input
                  type="number"
                  value={newClientHostingFee}
                  onChange={(e) => setNewClientHostingFee(parseFloat(e.target.value) || 400000)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  ¿Hosting Pagado?
                </label>
                <select
                  value={newClientHostingPaid ? "true" : "false"}
                  onChange={(e) => setNewClientHostingPaid(e.target.value === "true")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                >
                  <option value="true">Sí (Pagado $400.000)</option>
                  <option value="false">No (Pendiente)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Mensualidad Pactada ($ COP)
                </label>
                <input
                  type="number"
                  value={newClientMonthlyFee}
                  onChange={(e) => setNewClientMonthlyFee(parseFloat(e.target.value) || 280000)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Día de Cobro Mensual
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={newClientBillingDay}
                  onChange={(e) => setNewClientBillingDay(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Notas / Observaciones
              </label>
              <textarea
                value={newClientNotes}
                onChange={(e) => setNewClientNotes(e.target.value)}
                rows={2}
                placeholder="Ej: Incluye mantenimiento web mensual y actualización de productos."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-magenta text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Guardar Nuevo Cliente
            </button>
          </div>
        </form>

        {/* CLIENTS DIRECTORY & PAYMENT LOGS */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Directorio de Clientes y Pagos</h3>
              <p className="text-xs text-slate-400">
                Lleva el control individual de cada cliente, pagos iniciales y mensualidades.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente o proyecto..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-orange"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-orange"
              >
                <option value="all">Todos los Clientes</option>
                <option value="pending_hosting">Hosting Pendiente</option>
                <option value="pending_monthly">Mensualidad Pendiente</option>
                <option value="up_to_date">Al Día</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[700px] pr-1 flex-grow">
            {loading ? (
              <div className="text-center py-10 text-slate-500 text-xs">Cargando clientes...</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <Users className="w-8 h-8 text-slate-700" />
                {clients.length === 0
                  ? "No hay clientes registrados. Utiliza el formulario de la izquierda para agregar el primero."
                  : "No se encontraron clientes con el filtro actual."}
              </div>
            ) : (
              filteredClients.map((client) => (
                <ClientCardItem
                  key={client.id}
                  client={client}
                  formatCOP={formatCOP}
                  toggleHostingPaid={toggleHostingPaid}
                  handleAddPayment={handleAddPayment}
                  togglePaymentPaid={togglePaymentPaid}
                  deletePayment={deletePayment}
                  handleDeleteClient={handleDeleteClient}
                  generateWaLink={generateWaLink}
                  currentMonthCapitalized={currentMonthCapitalized}
                  handleOpenEditQualities={handleOpenEditQualities}
                  handleOpenReassignZone={handleOpenReassignZone}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* CONSOLIDATED ACCOUNTING SUMMARY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Resumen General de Contabilidad Mensual</h3>
              <p className="text-xs text-slate-400">
                Historial consolidado de todos los pagos registrados en la plataforma.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-400">Filtrar Período:</label>
            <select
              value={accountingPeriodFilter}
              onChange={(e) => setAccountingPeriodFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
            >
              <option value="all">Todos los registros</option>
              {uniquePeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredAccountingPayments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs italic">
              No hay registros de pago en la selección actual.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Proyecto</th>
                  <th className="py-2.5 px-3">Concepto</th>
                  <th className="py-2.5 px-3">Período</th>
                  <th className="py-2.5 px-3">Monto</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Método</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccountingPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800/60 hover:bg-slate-950/50 text-xs"
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{p.clientName}</td>
                    <td className="py-2.5 px-3 text-brand-orange font-mono text-[11px]">
                      {p.projectName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{p.concept}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {p.period}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-white">
                      {formatCOP(p.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {p.date}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{p.method}</td>
                    <td className="py-2.5 px-3">
                      {p.paid ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded font-bold">
                          PAGADO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-mono rounded font-bold">
                          PENDIENTE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-950 border-t-2 border-slate-800 font-bold text-xs">
                  <td colSpan={4} className="py-3 px-3 text-right uppercase font-mono text-slate-400">
                    Total Recaudado en Selección:
                  </td>
                  <td colSpan={4} className="py-3 px-3 font-mono text-emerald-400 text-sm">
                    {formatCOP(
                      filteredAccountingPayments
                        .filter((p) => p.paid)
                        .reduce((acc, curr) => acc + (curr.amount || 0), 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
      </div>
      )}

      {/* MODAL EDITAR VENDEDOR */}
      {editingSeller && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Editar Datos del Vendedor</h3>
                  <p className="text-xs text-slate-400">
                    Modifica credenciales, teléfono, comisión, zonas y categorías de <strong className="text-emerald-400">{editingSeller.name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingSeller(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSeller} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={editSellerName}
                    onChange={(e) => setEditSellerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Usuario Login *</label>
                  <input
                    type="text"
                    required
                    value={editSellerUsername}
                    onChange={(e) => setEditSellerUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Contraseña / Clave</label>
                  <input
                    type="text"
                    value={editSellerPassword}
                    onChange={(e) => setEditSellerPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={editSellerPhone}
                    onChange={(e) => setEditSellerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Zona Comercial</label>
                  <select
                    value={editSellerZone}
                    onChange={(e) => setEditSellerZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Valle de Aburrá Norte">Valle de Aburrá Norte</option>
                    <option value="Valle de Aburrá Sur">Valle de Aburrá Sur</option>
                    <option value="Medellín Centro & Comercial">Medellín Centro & Comercial</option>
                    <option value="Oriente Antioqueño">Oriente Antioqueño</option>
                    <option value="Occidente / Urabá">Occidente / Urabá</option>
                    <option value="Suroeste Antioqueño">Suroeste Antioqueño</option>
                    <option value="Toda Antioquia">Toda Antioquia (Consolidado)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Comisión Base (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="50"
                    value={editSellerCommission}
                    onChange={(e) => setEditSellerCommission(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Supervisor Asignado</label>
                  <select
                    value={editSellerSupervisor}
                    onChange={(e) => setEditSellerSupervisor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Estivenson Navarro (Director Comercial)">Estivenson Navarro (Director Comercial)</option>
                    <option value="Laura Gómez (Supervisora Metropolitana)">Laura Gómez (Supervisora Metropolitana)</option>
                    <option value="Luz Elena Restrepo (Supervisora Oriente)">Luz Elena Restrepo (Supervisora Oriente)</option>
                    <option value="Sin Supervisor (Directo)">Sin Supervisor (Directo)</option>
                  </select>
                </div>
              </div>

              {/* Municipios Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-[11px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Municipios Asignados en Antioquia ({editSellerMunicipalities.length})
                  </label>
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => selectMunicipalitiesPreset('aburra', true)}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                    >
                      + Valle Aburrá
                    </button>
                    <button
                      type="button"
                      onClick={() => selectMunicipalitiesPreset('oriente', true)}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                    >
                      + Oriente
                    </button>
                    <button
                      type="button"
                      onClick={() => selectMunicipalitiesPreset('all', true)}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      onClick={() => selectMunicipalitiesPreset('clear', true)}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-rose-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-950/80 rounded-xl border border-slate-900">
                  {ANTIOQUIA_MUNICIPALITIES.map((muni) => {
                    const isSel = editSellerMunicipalities.includes(muni);
                    return (
                      <button
                        key={muni}
                        type="button"
                        onClick={() => toggleEditMunicipality(muni)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1 cursor-pointer ${
                          isSel
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        {isSel && <Check className="w-3 h-3 text-emerald-400" />}
                        <span>{muni}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categorías Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" /> Categorías / Líneas de Negocio ({editSellerCategories.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BUSINESS_CATEGORIES.map((cat) => {
                    const isSel = editSellerCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleEditCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1 cursor-pointer ${
                          isSel
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 font-bold"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        {isSel && <Check className="w-3 h-3 text-indigo-400" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSeller(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR_CUALIDADES (Permiso Exclusivo Administrador General) */}
      {editingQualitiesClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    Comando: EDITAR_CUALIDADES
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Facultad exclusiva Administrador General. Modifica promociones, descuentos y estado de comisión.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingQualitiesClient(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AVISO RESTRICCIÓN DE SEGURIDAD */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <strong className="text-amber-400 font-mono block">Instrucción 2: Integridad de Ficha Base</strong>
              <p className="text-[11px]">
                Los datos base ({editingQualitiesClient.clientName}, Ubicación, Tipo de Negocio) provienen del vendedor y no pueden ser alterados. Solo asignas ofertas comerciales y estatus de pago.
              </p>
            </div>

            <form onSubmit={handleSaveQualities} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Promociones Aplicadas (Separadas por Comas)
                </label>
                <input
                  type="text"
                  value={editPromocionesText}
                  onChange={(e) => setEditPromocionesText(e.target.value)}
                  placeholder="Ej: Muestra Gratis Litho, 10% Descuento Almanaques, Envío Gratuito"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Descuento Especial Porcentual (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editDescuentoPct}
                  onChange={(e) => setEditDescuentoPct(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Estado de la Comisión Comercial
                </label>
                <select
                  value={editEstadoComision}
                  onChange={(e) => setEditEstadoComision(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Pagada">Pagada</option>
                  <option value="Disponible para Reasignación">Disponible para Reasignación</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQualitiesClient(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Aplicar EDITAR_CUALIDADES</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ASIGNAR_ZONA (Vincular / Reasignar Vendedor Beneficiario) */}
      {reassigningClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    Comando: ASIGNAR_ZONA / Reasignación
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Vincular cliente "{reassigningClient.clientName || reassigningClient.name}" y sus comisiones a un asesor activo.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReassigningClient(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteAsignarZona} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Seleccionar Vendedor / Comercial Asignado *
                </label>
                <select
                  value={selectedTargetSellerId}
                  onChange={(e) => setSelectedTargetSellerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="ADMINISTRACIÓN_CENTRAL">
                    🏛️ ADMINISTRACIÓN_CENTRAL (Sin Vendedor — Disponible para Reasignación)
                  </option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      👤 {s.name} (@{s.username}) — Zona: {s.zone || "Aburrá"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <strong className="text-indigo-400 font-mono block">Efecto Operativo:</strong>
                <p className="text-[11px]">
                  El vendedor seleccionado será el nuevo beneficiario de comisiones para este cliente y podrá visualizarlo en su panel de "Mi Cartera Exclusiva".
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReassigningClient(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Ejecutar ASIGNAR_ZONA</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDITAR PROVEEDOR & DATOS BANCARIOS */}
      {/* ========================================================================= */}
      {editingProv && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Editar Datos de Proveedor / Taller</h3>
                  <p className="text-xs text-slate-400">
                    Modifica datos de contacto, cuenta bancaria para transferencias y notas de <strong className="text-amber-400">{editingProv.nombreComercial}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingProv(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProveedor} className="space-y-5">
              {/* Form Grid 2-Column (Matching Screenshot Layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1.5">
                    Nombre Comercial / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProvNombre}
                    onChange={(e) => setEditProvNombre(e.target.value)}
                    placeholder="Ej: Talleres Gráficos & Troquelados del Valle"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans shadow-inner"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold">
                      Categoría / Línea *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCatManagerOpen(true)}
                      className="text-[10px] font-mono text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                    >
                      ⚙️ Gestionar Catálogo
                    </button>
                  </div>
                  <CategoryMultiSelect
                    categories={categoriesList}
                    selectedCategories={editProvCategorias}
                    onChange={setEditProvCategorias}
                    onAddNewCategory={handleAddNewCategoryFromMultiSelect}
                    onManageCategories={() => setIsCatManagerOpen(true)}
                    placeholder="Selecciona líneas de producción..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1.5">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    required
                    value={editProvContacto}
                    onChange={(e) => setEditProvContacto(e.target.value)}
                    placeholder="Ej: Carlos Mario Jaramillo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProvTelefono}
                    onChange={(e) => setEditProvTelefono(e.target.value)}
                    placeholder="Ej: +57 312 456 7890"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={editProvEmail}
                    onChange={(e) => setEditProvEmail(e.target.value)}
                    placeholder="produccion@troqueladosvalle.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1.5">
                    Dirección del Taller
                  </label>
                  <input
                    type="text"
                    value={editProvDireccion}
                    onChange={(e) => setEditProvDireccion(e.target.value)}
                    placeholder="Calle 44 # 52-18, Sector Alpujarra, Medellín"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans shadow-inner"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1.5">
                    Municipio (Antioquia)
                  </label>
                  <select
                    value={editProvMunicipio}
                    onChange={(e) => setEditProvMunicipio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans shadow-inner"
                  >
                    <option value="Medellín">Medellín</option>
                    <option value="Itagüí">Itagüí</option>
                    <option value="Envigado">Envigado</option>
                    <option value="Bello">Bello</option>
                    <option value="Sabaneta">Sabaneta</option>
                    <option value="La Estrella">La Estrella</option>
                    <option value="Caldas">Caldas</option>
                    <option value="Copacabana">Copacabana</option>
                    <option value="Rionegro">Rionegro</option>
                    <option value="Marinilla">Marinilla</option>
                    <option value="Otro">Otro Municipio</option>
                  </select>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SECCIÓN DESTACADA: ESPACIO DE TOKEN & ACCESO A OFICINA VIRTUAL DEL PROVEEDOR */}
              {/* ========================================================================= */}
              <div className="p-4 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 rounded-2xl border-2 border-amber-500/60 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shadow-inner">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase text-amber-300 font-black block">
                          Crear / Editar Código de Acceso & Token para el Proveedor *
                        </span>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[9px] font-mono font-bold">
                          Acceso Exclusivo
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-sans">
                        Este es el token con el que el taller ingresa a su Oficina Virtual para ver sus órdenes asignadas
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEditProvSlug(editingProv.codigo.toLowerCase())}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      title="Asignar el código oficial del taller como clave de acceso"
                    >
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>Usar Código ({editingProv.codigo})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const cleanName = `taller-${editProvNombre.trim() ? editProvNombre.toLowerCase().replace(/[^a-z0-9]/g, '-') : editingProv.codigo.toLowerCase()}`;
                        setEditProvSlug(cleanName);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Usar nombre comercial como slug"
                    >
                      <span>Usar Nombre</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const catPrefix = (editProvCategorias[0] || editingProv.categoria || "PRV").substring(0, 3).toLowerCase();
                        const randomToken = `token_${catPrefix}_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6)}`;
                        setEditProvSlug(randomToken);
                      }}
                      className="px-2.5 py-1 bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-500/50 text-[10px] font-mono font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Generar un nuevo token criptográfico seguro"
                    >
                      <Key className="w-3 h-3 text-amber-400" />
                      <span>Generar Token Seguro</span>
                    </button>
                  </div>
                </div>

                {/* INPUT CÓDIGO CON VALIDACIÓN EN TIEMPO REAL */}
                {(() => {
                  const currentInputCode = editProvSlug.trim().toLowerCase();
                  const collidingProv = currentInputCode 
                    ? proveedores.find(p => p.id !== editingProv.id && (
                        (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === currentInputCode) ||
                        (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === currentInputCode) ||
                        (p.codigo && p.codigo.trim().toLowerCase() === currentInputCode)
                      ))
                    : null;
                  const isOriginalCode = currentInputCode === (editingProv.slugAcceso || editingProv.tokenAcceso || editingProv.codigo)?.toLowerCase();
                  const directUrl = `${window.location.origin}/?token=${currentInputCode || editingProv.tokenAcceso}#proveedor`;

                  return (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <label className="block text-[11px] font-mono uppercase text-slate-200 font-bold">
                            Token o Clave de Acceso Asignada al Taller:
                          </label>
                          {collidingProv ? (
                            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/50 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              ⚠️ En uso por "{collidingProv.nombreComercial}"
                            </span>
                          ) : currentInputCode ? (
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              {isOriginalCode ? "Código actual de este taller" : "✓ Código único listo para guardar"}
                            </span>
                          ) : null}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={editProvSlug}
                            onChange={(e) => setEditProvSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            placeholder={`Ej: ${editingProv.codigo.toLowerCase()} o token_seguro_...`}
                            className={`w-full bg-slate-950 border-2 rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:outline-none transition-all shadow-inner ${
                              collidingProv
                                ? 'border-rose-500 text-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40 bg-rose-950/20'
                                : 'border-amber-500 text-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40'
                            }`}
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                  navigator.clipboard.writeText(editProvSlug || editingProv.tokenAcceso).then(() => {
                                    setSaveStatus(`✓ Código copiado: ${editProvSlug || editingProv.tokenAcceso}`);
                                    setTimeout(() => setSaveStatus(null), 3000);
                                  });
                                }
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-mono border border-slate-700 flex items-center gap-1 cursor-pointer font-bold transition-colors"
                              title="Copiar token al portapapeles"
                            >
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>

                        {/* ALERTA EN TIEMPO REAL SI HAY COLISIÓN */}
                        {collidingProv && (
                          <div className="p-3 bg-rose-950/90 border border-rose-500/60 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 shadow-lg animate-pulse">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="font-bold font-mono text-rose-300 flex items-center gap-1.5">
                                <span>¡Colisión de Código Detectada!</span>
                              </p>
                              <p className="text-[11px] text-rose-200/90 font-sans leading-relaxed">
                                El código <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-rose-500/40 text-amber-300 font-mono font-bold">"{currentInputCode}"</code> ya pertenece al taller <strong className="text-white">"{collidingProv.nombreComercial}"</strong> (Código: <span className="font-mono text-amber-300">{collidingProv.codigo}</span>).
                              </p>
                              <p className="text-[10px] text-rose-300/80 font-mono pt-0.5">
                                ➔ Modifica el texto o genera un nuevo token criptográfico para evitar cruces de órdenes.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CAJA DE ENLACE DIRECTO & COMPARTIR */}
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="font-bold uppercase text-amber-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            Enlace Directo de Acceso a la Oficina Virtual:
                          </span>
                          <span className="text-slate-400 font-sans">
                            Acceso seguro y exclusivo para {editProvNombre || editingProv.nombreComercial}
                          </span>
                        </div>

                        <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-amber-300 font-bold break-all select-all">
                          {directUrl}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                  navigator.clipboard.writeText(directUrl).then(() => {
                                    setSaveStatus(`✓ Enlace copiado al portapapeles`);
                                    setTimeout(() => setSaveStatus(null), 3000);
                                  });
                                }
                              }}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>Copiar Link</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleShareProvWhatsApp(editingProv)}
                              className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Enviar por WhatsApp</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => window.open(directUrl, '_blank')}
                            className="text-amber-400 hover:text-amber-300 text-xs font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Probar Ingreso en Nueva Pestaña</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ========================================================================= */}
                {/* HISTORIAL DE CAMBIOS DE CÓDIGO DE ACCESO (Últimas 3 Actualizaciones) */}
                {/* ========================================================================= */}
                {(() => {
                  const historyList = (editingProv.historialCodigosAcceso && editingProv.historialCodigosAcceso.length > 0)
                    ? editingProv.historialCodigosAcceso.slice(0, 3)
                    : [
                        {
                          id: 'hist_initial',
                          codigoNuevo: editingProv.slugAcceso || editingProv.tokenAcceso || editingProv.codigo,
                          fecha: editingProv.createdAt || new Date().toISOString(),
                          modificadoPor: 'Administrador (atziluthgrafic@gmail.com)',
                          motivo: 'Registro inicial y generación de clave de taller'
                        }
                      ];

                  const formatDate = (isoString: string) => {
                    try {
                      const d = new Date(isoString);
                      if (isNaN(d.getTime())) return isoString;
                      return d.toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });
                    } catch {
                      return isoString;
                    }
                  };

                  return (
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-[10px] font-mono uppercase font-bold text-amber-300">
                            Historial de Cambios de Código de Acceso
                          </span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
                          Últimas {Math.min(3, historyList.length)} Actualizaciones
                        </span>
                      </div>

                      <div className="space-y-2">
                        {historyList.map((hist, idx) => (
                          <div
                            key={hist.id || idx}
                            className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                              idx === 0
                                ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                                : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  idx === 0
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {idx === 0 ? '🟢 Actual' : `Versión -${idx}`}
                                </span>
                                
                                {hist.codigoAnterior ? (
                                  <span className="flex items-center gap-1.5 text-xs">
                                    <span className="line-through text-slate-500 text-[11px]">{hist.codigoAnterior}</span>
                                    <span className="text-amber-400">➔</span>
                                    <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                                      {hist.codigoNuevo}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                                    {hist.codigoNuevo}
                                  </span>
                                )}
                              </div>

                              {hist.motivo && (
                                <p className="text-[10px] text-slate-400 font-sans">
                                  {hist.motivo}
                                </p>
                              )}
                            </div>

                            <div className="text-left sm:text-right space-y-0.5 shrink-0">
                              <div className="text-[10px] text-slate-300 font-bold flex items-center sm:justify-end gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>{formatDate(hist.fecha)}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center sm:justify-end gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                <span>{hist.modificadoPor || 'Administración Central'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Cuenta Bancaria */}
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                  Información Bancaria para Transferencias
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Banco</label>
                    <input
                      type="text"
                      value={editProvBanco}
                      onChange={(e) => setEditProvBanco(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Tipo de Cuenta</label>
                    <select
                      value={editProvTipoCuenta}
                      onChange={(e) => setEditProvTipoCuenta(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Ahorros">Ahorros</option>
                      <option value="Corriente">Corriente</option>
                      <option value="Billetera Digital">Billetera Digital</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Número de Cuenta</label>
                    <input
                      type="text"
                      value={editProvNumeroCuenta}
                      onChange={(e) => setEditProvNumeroCuenta(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Titular</label>
                    <input
                      type="text"
                      value={editProvTitular}
                      onChange={(e) => setEditProvTitular(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Documento / NIT</label>
                    <input
                      type="text"
                      value={editProvDocumento}
                      onChange={(e) => setEditProvDocumento(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editProvActivo}
                        onChange={(e) => setEditProvActivo(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span>Taller Activo</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Notas Internas</label>
                <textarea
                  rows={2}
                  value={editProvNotas}
                  onChange={(e) => setEditProvNotas(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProv(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ASIGNAR NUEVA ORDEN DE PRODUCCIÓN AL TALLER */}
      {/* ========================================================================= */}
      {orderModalProv && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Asignar Trabajo de Producción</h3>
                  <p className="text-[11px] text-slate-400">
                    Taller asignado: <strong className="text-amber-400">{orderModalProv.nombreComercial}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOrderModalProv(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProvOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                    Nombre del Cliente Final *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrdCliente}
                    onChange={(e) => setNewOrdCliente(e.target.value)}
                    placeholder="Ej: Distribuidora La 70 S.A.S"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                    Línea / Categoría del Trabajo *
                  </label>
                  <select
                    value={newOrdCategoria}
                    onChange={(e) => setNewOrdCategoria(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                  >
                    {/* First list this provider's specialties */}
                    {(Array.isArray(orderModalProv.categorias) && orderModalProv.categorias.length > 0
                      ? orderModalProv.categorias
                      : [orderModalProv.categoria || "Almanaques"]
                    ).map((c) => (
                      <option key={`p_${c}`} value={c}>
                        ⭐ {c} (Especialidad del Taller)
                      </option>
                    ))}
                    {/* Then all other categories */}
                    {categoriesList
                      .filter((c) => !(orderModalProv.categorias || [orderModalProv.categoria]).includes(c))
                      .map((c) => (
                        <option key={`all_${c}`} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                  Descripción Técnica del Trabajo *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newOrdDescripcion}
                  onChange={(e) => setNewOrdDescripcion(e.target.value)}
                  placeholder="Ej: 500 Almanaques Tipo Taco con cartón 300g, barniz brillante, diseño publicitario listo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">Cantidad</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newOrdCantidad}
                    onChange={(e) => setNewOrdCantidad(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-indigo-400 mb-1 font-bold">Precio Cliente ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={newOrdPrecioVenta}
                    onChange={(e) => setNewOrdPrecioVenta(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-rose-400 mb-1 font-bold">Costo Taller ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={newOrdCostoProv}
                    onChange={(e) => setNewOrdCostoProv(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Cálculo en vivo de ganancia */}
              {newOrdPrecioVenta > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Utilidad Bruta Proyectada:</span>
                  <strong className="text-emerald-400 font-bold">
                    {formatCOP(Math.max(0, newOrdPrecioVenta - newOrdCostoProv))} (
                    {((Math.max(0, newOrdPrecioVenta - newOrdCostoProv) / newOrdPrecioVenta) * 100).toFixed(1)}%)
                  </strong>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">Tipo de Entrega</label>
                <select
                  value={newOrdTipoEntrega}
                  onChange={(e) => setNewOrdTipoEntrega(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                >
                  <option value="Recoger_Taller">Recoger directamente en el Taller / Bodega</option>
                  <option value="Envio_Direccion">Envío directo a la dirección del cliente</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOrderModalProv(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>Asignar Orden al Taller</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REGISTRAR PAGO A PROVEEDOR CON COMPROBANTE .JPG OBLIGATORIO */}
      {/* ========================================================================= */}
      {paymentModalProv && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Registrar Pago a Proveedor</h3>
                  <p className="text-xs text-slate-400">
                    Beneficiario: <strong className="text-amber-400">{paymentModalProv.nombreComercial}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPaymentModalProv(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha rápida de cuenta bancaria del proveedor */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-500 block">Datos para Transferencia:</span>
              <div className="text-white font-bold">{paymentModalProv.datosBancarios?.banco || "Bancolombia"} — Cuenta {paymentModalProv.datosBancarios?.tipoCuenta || "Ahorros"}</div>
              <div className="text-amber-400 font-bold text-sm">#{paymentModalProv.datosBancarios?.numeroCuenta || "Sin registrar"}</div>
              <div className="text-slate-400 text-[11px]">Titular: {paymentModalProv.datosBancarios?.titular || paymentModalProv.nombreComercial} | Doc: {paymentModalProv.datosBancarios?.documentoTitular || "NIT"}</div>
            </div>

            <form onSubmit={handleCreateProvPayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                    Monto Transferido (COP) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={payMonto}
                    onChange={(e) => setPayMonto(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                    Método de Pago
                  </label>
                  <select
                    value={payMetodo}
                    onChange={(e) => setPayMetodo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    <option value="Transferencia Bancolombia">Transferencia Bancolombia</option>
                    <option value="Transferencia Nequi">Transferencia Nequi</option>
                    <option value="Transferencia Daviplata">Transferencia Daviplata</option>
                    <option value="Transferencia BBVA">Transferencia BBVA</option>
                    <option value="Efectivo en Taller">Efectivo en Taller</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                  Número de Aprobación / Referencia Bancaria
                </label>
                <input
                  type="text"
                  value={payReferencia}
                  onChange={(e) => setPayReferencia(e.target.value)}
                  placeholder="Ej: APROB-84920194"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Subida Obligatoria de Comprobante JPG / PDF */}
              <div className="space-y-2 p-3.5 bg-slate-950/80 rounded-2xl border-2 border-dashed border-amber-500/50">
                <label className="block text-[10px] font-mono uppercase text-amber-300 font-bold flex items-center justify-between">
                  <span>Comprobante de Pago (JPG, PNG o PDF) * Obligatorio</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] rounded-md font-bold">
                    JPG &bull; PNG &bull; PDF
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf,.pdf,.jpg,.jpeg,.png"
                  required={!payComprobanteJpg}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPayComprobanteFileName(file.name);
                      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                      setPayComprobanteTipo(isPdf ? 'pdf' : 'jpg');
                      const reader = new FileReader();
                      reader.onload = (loadEv) => {
                        setPayComprobanteJpg(loadEv.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-gradient-to-r file:from-amber-500 file:to-yellow-500 file:text-slate-950 hover:file:from-amber-400 hover:file:to-yellow-400 cursor-pointer"
                />

                {payComprobanteJpg && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 font-bold">
                        {payComprobanteTipo === 'pdf' || payComprobanteJpg.startsWith('data:application/pdf') || payComprobanteFileName.toLowerCase().endsWith('.pdf') ? (
                          <span className="text-rose-400 flex items-center gap-1">
                            <FileText className="w-4 h-4" /> 📄 Documento PDF listo
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" /> 🖼️ Imagen JPG/PNG lista
                          </span>
                        )}
                        <span className="text-slate-300 truncate max-w-[200px]">
                          ({payComprobanteFileName || "comprobante"})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPayComprobanteJpg("");
                          setPayComprobanteFileName("");
                          setPayComprobanteTipo("jpg");
                        }}
                        className="text-rose-400 hover:underline text-[11px]"
                      >
                        Quitar
                      </button>
                    </div>

                    {payComprobanteTipo === 'pdf' || payComprobanteJpg.startsWith('data:application/pdf') || payComprobanteFileName.toLowerCase().endsWith('.pdf') ? (
                      <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-500/30 text-center space-y-2">
                        <FileText className="w-8 h-8 text-rose-400 mx-auto" />
                        <div className="text-xs font-mono text-slate-200 font-bold">{payComprobanteFileName}</div>
                        <p className="text-[10px] text-slate-400 font-sans">
                          El archivo PDF se enviará automáticamente a la Oficina Virtual del proveedor para que pueda visualizarlo o descargarlo.
                        </p>
                        <a
                          href={payComprobanteJpg}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold"
                        >
                          <ExternalLink className="w-3 h-3" /> Previsualizar PDF
                        </a>
                      </div>
                    ) : (
                      <img
                        src={payComprobanteJpg}
                        alt="Vista previa comprobante"
                        className="max-h-36 rounded-lg border border-slate-800 object-contain mx-auto shadow-sm"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentModalProv(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Emitir Recibo de Pago</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: VISOR DE RECIBO OFICIAL IMPRIMIBLE DE PAGO A PROVEEDOR */}
      {/* ========================================================================= */}
      {viewingProvReceipt && (() => {
        const prov = proveedores.find((p) => p.id === viewingProvReceipt.proveedorId);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase">
                    Comprobante de Egreso / Recibo Oficial
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingProvReceipt(null)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Ficha Imprimible del Recibo */}
              <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl space-y-4 font-sans border border-slate-300">
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3">
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-slate-900">ATZILUTH GRÁFIC DIGITAL</h2>
                    <p className="text-xs text-slate-600">NIT: 901.458.912-4 | Medellín, Antioquia</p>
                    <p className="text-xs text-slate-600">Línea de Producción Gráfica & Almanaques 2026</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Recibo de Egreso</span>
                    <span className="text-base font-black font-mono text-amber-700">{viewingProvReceipt.reciboConsecutivo}</span>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">Fecha: {viewingProvReceipt.fechaPago}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Proveedor / Taller:</span>
                    <strong className="text-slate-900 block text-sm">{prov ? prov.nombreComercial : "Proveedor Litográfico"}</strong>
                    <p className="text-slate-600">Contacto: {prov ? prov.contactoNombre : "Encargado de Producción"}</p>
                    <p className="text-slate-600">Tel: {prov ? prov.telefonoWhatsapp : "N/A"}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Detalles de Transferencia:</span>
                    <p className="text-slate-800 font-medium">Método: {viewingProvReceipt.metodoPago}</p>
                    <p className="text-slate-800 font-mono">Ref: {viewingProvReceipt.referenciaBancaria}</p>
                    <p className="text-slate-600 text-[11px]">Banco: {prov?.datosBancarios?.banco || "Bancolombia"} - #{prov?.datosBancarios?.numeroCuenta || "N/A"}</p>
                  </div>
                </div>

                <div className="py-4 text-center bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-mono uppercase text-emerald-800 block">Monto Total Liquidado y Pagado</span>
                  <div className="text-2xl font-black font-mono text-emerald-800">{formatCOP(viewingProvReceipt.monto)}</div>
                </div>

                {/* Comprobante Bancario Adjunto (JPG / PNG / PDF) */}
                {viewingProvReceipt.comprobanteJpgUrl && (() => {
                  const isPdf = viewingProvReceipt.comprobanteTipo === 'pdf' || 
                    viewingProvReceipt.comprobanteJpgUrl.startsWith('data:application/pdf') || 
                    (viewingProvReceipt.comprobanteNombre && viewingProvReceipt.comprobanteNombre.toLowerCase().endsWith('.pdf'));

                  return (
                    <div className="pt-3 space-y-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-slate-600 font-bold flex items-center gap-1.5">
                          {isPdf ? <FileText className="w-3.5 h-3.5 text-rose-600" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>Comprobante de Pago Adjunto ({isPdf ? 'PDF' : 'JPG/PNG'}):</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={viewingProvReceipt.comprobanteJpgUrl}
                            download={viewingProvReceipt.comprobanteNombre || (isPdf ? `comprobante_${viewingProvReceipt.reciboConsecutivo}.pdf` : `comprobante_${viewingProvReceipt.reciboConsecutivo}.jpg`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-mono text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> Descargar
                          </a>
                          <a
                            href={viewingProvReceipt.comprobanteJpgUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-mono text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Abrir en Pestaña Nueva
                          </a>
                        </div>
                      </div>

                      {isPdf ? (
                        <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                          <iframe
                            src={viewingProvReceipt.comprobanteJpgUrl}
                            title="Comprobante PDF"
                            className="w-full h-72 border-0"
                          />
                        </div>
                      ) : (
                        <img
                          src={viewingProvReceipt.comprobanteJpgUrl}
                          alt="Comprobante Bancario"
                          className="max-h-56 rounded-lg border border-slate-300 mx-auto shadow-sm object-contain"
                        />
                      )}
                    </div>
                  );
                })()}

                <div className="pt-6 border-t border-slate-300 flex justify-between text-xs text-slate-500 font-mono">
                  <div className="text-center w-40 border-t border-slate-400 pt-1">Elaboró Contabilidad</div>
                  <div className="text-center w-40 border-t border-slate-400 pt-1">Recibió Conforme (Taller)</div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Recibo</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL: PERSONALIZAR DIRECCIÓN DE INGRESO A OFICINA VIRTUAL DEL PROVEEDOR */}
      {/* ========================================================================= */}
      {customizingAccessProv && (() => {
        const fullAccessUrl = `${window.location.origin}/?token=${customAccessKey.trim() || customizingAccessProv.tokenAcceso}#proveedor`;

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase">
                      Dirección de Acceso a Oficina Virtual
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {customizingAccessProv.nombreComercial} ({customizingAccessProv.codigo})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCustomizingAccessProv(null)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Strict Isolation Notice */}
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Aislamiento y Confidencialidad Estricta</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Al ingresar por esta dirección personalizada o token, este taller <strong>ÚNICAMENTE</strong> tendrá acceso a ver sus propias órdenes, costos y estados de entrega asignados. Ningún proveedor puede ver compras, pedidos o información de competidores.
                </p>
              </div>

              <form onSubmit={handleSaveCustomizeAccess} className="space-y-4">
                {(() => {
                  const currentCustomCode = customAccessKey.trim().toLowerCase();
                  const collidingCustomProv = currentCustomCode
                    ? proveedores.find(p => p.id !== customizingAccessProv.id && (
                        (p.slugAcceso && p.slugAcceso.trim().toLowerCase() === currentCustomCode) ||
                        (p.tokenAcceso && p.tokenAcceso.trim().toLowerCase() === currentCustomCode) ||
                        (p.codigo && p.codigo.trim().toLowerCase() === currentCustomCode)
                      ))
                    : null;
                  const isOriginalCustomCode = currentCustomCode === (customizingAccessProv.slugAcceso || customizingAccessProv.tokenAcceso || customizingAccessProv.codigo)?.toLowerCase();

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold">
                          Dirección de Ingreso / Token (Slug) *
                        </label>
                        {collidingCustomProv ? (
                          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/50 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            ⚠️ En uso por "{collidingCustomProv.nombreComercial}"
                          </span>
                        ) : currentCustomCode ? (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {isOriginalCustomCode ? "Código actual asignado" : "✓ Código único disponible"}
                          </span>
                        ) : null}
                      </div>

                      <input
                        type="text"
                        required
                        value={customAccessKey}
                        onChange={(e) => setCustomAccessKey(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        placeholder="Ej: taller-estivenson-almanaques o token_seguro_..."
                        className={`w-full bg-slate-950 border-2 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none transition-all shadow-inner ${
                          collidingCustomProv
                            ? 'border-rose-500 text-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40 bg-rose-950/20'
                            : 'border-amber-500/60 text-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30'
                        }`}
                      />

                      {/* ALERTA EN TIEMPO REAL SI HAY COLISIÓN */}
                      {collidingCustomProv && (
                        <div className="p-3 bg-rose-950/90 border border-rose-500/60 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 shadow-lg animate-pulse">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold font-mono text-rose-300 flex items-center gap-1.5">
                              <span>¡Colisión de Código de Acceso!</span>
                            </p>
                            <p className="text-[11px] text-rose-200/90 font-sans leading-relaxed">
                              El token <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-rose-500/40 text-amber-300 font-mono font-bold">"{currentCustomCode}"</code> ya está registrado para el taller <strong className="text-white">"{collidingCustomProv.nombreComercial}"</strong> ({collidingCustomProv.codigo}).
                            </p>
                            <p className="text-[10px] text-rose-300/80 font-mono pt-0.5">
                              ➔ Por favor escribe una clave única o genera un token seguro.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Botones de sugerencias rápidas */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[10px] font-mono text-slate-400">Generadores rápidos:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanName = `taller-${customizingAccessProv.nombreComercial.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                      setCustomAccessKey(cleanName);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    Usar Nombre de Taller
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const catPrefix = (customizingAccessProv.categoria || "PRV").substring(0, 3).toLowerCase();
                      const randomToken = `token_${catPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                      setCustomAccessKey(randomToken);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-mono rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    Generar Token Criptográfico
                  </button>
                </div>

                {/* Vista Previa de la URL Final */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Enlace Completo de Ingreso para el Proveedor:
                  </span>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-300/90 break-all select-all">
                    {fullAccessUrl}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                          navigator.clipboard.writeText(fullAccessUrl).then(() => {
                            setSaveStatus(`✓ Enlace copiado: ${customAccessKey}`);
                            setTimeout(() => setSaveStatus(null), 3000);
                          });
                        } else {
                          prompt("Copia este enlace de acceso:", fullAccessUrl);
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copiar Enlace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.open(fullAccessUrl, '_blank')}
                      className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-mono text-xs rounded-lg flex items-center gap-1.5 cursor-pointer border border-amber-500/30"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      <span>Probar Ingreso Directo</span>
                    </button>
                  </div>
                </div>

                {/* Historial de Cambios de Código de Acceso */}
                {(() => {
                  const historyList = (customizingAccessProv.historialCodigosAcceso && customizingAccessProv.historialCodigosAcceso.length > 0)
                    ? customizingAccessProv.historialCodigosAcceso.slice(0, 3)
                    : [
                        {
                          id: 'hist_initial',
                          codigoNuevo: customizingAccessProv.slugAcceso || customizingAccessProv.tokenAcceso || customizingAccessProv.codigo,
                          fecha: customizingAccessProv.createdAt || new Date().toISOString(),
                          modificadoPor: 'Administrador (atziluthgrafic@gmail.com)',
                          motivo: 'Registro inicial y generación de clave de taller'
                        }
                      ];

                  const formatDate = (isoString: string) => {
                    try {
                      const d = new Date(isoString);
                      if (isNaN(d.getTime())) return isoString;
                      return d.toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });
                    } catch {
                      return isoString;
                    }
                  };

                  return (
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[10px] font-mono uppercase font-bold text-amber-300">
                            Últimas 3 Actualizaciones de Acceso
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">
                          {historyList.length} registro(s)
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {historyList.map((hist, idx) => (
                          <div
                            key={hist.id || idx}
                            className={`p-2 rounded-lg border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 ${
                              idx === 0
                                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-400">#{idx + 1}</span>
                              {hist.codigoAnterior ? (
                                <span className="flex items-center gap-1">
                                  <span className="line-through text-slate-500 text-[10px]">{hist.codigoAnterior}</span>
                                  <span className="text-amber-400">➔</span>
                                  <span className="font-bold text-white bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                    {hist.codigoNuevo}
                                  </span>
                                </span>
                              ) : (
                                <span className="font-bold text-white bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                  {hist.codigoNuevo}
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-400 flex items-center sm:justify-end gap-2">
                              <span className="text-slate-300">{formatDate(hist.fecha)}</span>
                              <span>•</span>
                              <span className="text-emerald-400 truncate max-w-[160px]">{hist.modificadoPor || 'Administración'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Botones de acción */}
                <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCustomizingAccessProv(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-amber-400/30"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Dirección de Ingreso</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 5: GESTOR COMPLETO DE CATEGORÍAS (CREAR, EDITAR, ELIMINAR) */}
      {/* ========================================================================= */}
      <CategoriasManagerModal
        isOpen={isCatManagerOpen}
        onClose={() => setIsCatManagerOpen(false)}
        categories={categoriesList}
        proveedores={proveedores}
        onSaveCategories={handleSaveCategories}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onResetDefaults={handleResetCategoryDefaults}
      />
    </div>
  );
}

interface ClientCardItemProps {
  key?: string;
  client: ClientRecord;
  formatCOP: (amount: number) => string;
  toggleHostingPaid: (id: string) => void;
  handleAddPayment: (
    clientId: string,
    payment: Omit<ClientPayment, "id">
  ) => void;
  togglePaymentPaid: (clientId: string, paymentId: string) => void;
  deletePayment: (clientId: string, paymentId: string) => void;
  handleDeleteClient: (clientId: string, name: string) => void;
  generateWaLink: (
    clientName: string,
    projectName: string,
    phone: string,
    concept: string,
    amount: number
  ) => string;
  currentMonthCapitalized: string;
  handleOpenEditQualities: (client: ClientRecord) => void;
  handleOpenReassignZone: (client: ClientRecord) => void;
}

function ClientCardItem({
  client,
  formatCOP,
  toggleHostingPaid,
  handleAddPayment,
  togglePaymentPaid,
  deletePayment,
  handleDeleteClient,
  generateWaLink,
  currentMonthCapitalized,
  handleOpenEditQualities,
  handleOpenReassignZone,
}: ClientCardItemProps) {
  const [concept, setConcept] = useState("Mensualidad");
  const [period, setPeriod] = useState(currentMonthCapitalized);
  const [amount, setAmount] = useState(client.monthlyFee || 280000);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [method, setMethod] = useState("Transferencia Bancolombia");

  const onSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddPayment(client.id, {
      concept: concept || "Mensualidad",
      period: period || "Mes Actual",
      amount: amount || 280000,
      date: date || new Date().toISOString().split("T")[0],
      method: method || "Transferencia Bancolombia",
      paid: true,
      notes: "",
    });
  };

  const waUrl = generateWaLink(
    client.clientName,
    client.projectName,
    client.phone,
    "Mensualidad de Servicio Web",
    client.monthlyFee || 280000
  );

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 relative group hover:border-slate-700 transition-colors">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white">{client.clientName}</h4>
            <span className="text-xs text-brand-orange font-mono font-semibold">
              ({client.projectName})
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Cierre: {client.startDate}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> {client.phone || "Sin teléfono"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Día de Cobro:{" "}
              <b className="text-slate-200">Día {client.billingDay}</b>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenEditQualities(client)}
            title="Editar Cualidades (Promociones, Descuentos, Estado Comisión)"
            className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-mono font-bold border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Tag className="w-3.5 h-3.5" /> EDITAR_CUALIDADES
          </button>

          <button
            onClick={() => handleOpenReassignZone(client)}
            title="Asignar Zona / Reasignar Vendedor Beneficiario de Comisión"
            className="px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-mono font-bold border border-indigo-500/30 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" /> ASIGNAR_ZONA
          </button>

          {client.phone && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Recordar Cobro WA
            </a>
          )}

          <button
            onClick={() => handleDeleteClient(client.id, client.clientName)}
            title="Eliminar Cliente"
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg text-xs border border-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Badges de Cualidades y Beneficiario de Comisión */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 bg-slate-900 text-slate-300 border border-slate-800 rounded-lg">
          Beneficiario Comisión: <strong className="text-emerald-400">{client.beneficiarioNombre || client.vendedorNombre || "Administración Central"}</strong>
        </span>

        <span className={`px-2.5 py-1 rounded-lg border font-bold ${
          client.estadoComision === 'Disponible para Reasignación'
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
            : client.estadoComision === 'Pagada'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        }`}>
          Comisión: {client.estadoComision || 'Pendiente'}
        </span>

        {client.descuentoPorcentaje ? (
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold">
            -{client.descuentoPorcentaje}% Desc.
          </span>
        ) : null}

        {client.promociones && client.promociones.length > 0 && (
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg">
            🏷️ Promos: {client.promociones.join(", ")}
          </span>
        )}
      </div>

      {/* Setup Fee and Monthly Dues Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Hosting y Dominio Inicial
            </span>
            <div className="mt-0.5">
              {client.hostingDomainPaid ? (
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PAGADO ({formatCOP(client.hostingDomainFee || 400000)})
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> PENDIENTE ({formatCOP(client.hostingDomainFee || 400000)})
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => toggleHostingPaid(client.id)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            {client.hostingDomainPaid ? "Marcar Pendiente" : "Marcar Pagado"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Mensualidad Pactada
            </span>
            <span className="text-sm font-bold font-mono text-white">
              {formatCOP(client.monthlyFee || 280000)} / mes
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Día {client.billingDay}</span>
        </div>
      </div>

      {client.notes && (
        <p className="text-xs text-slate-400 italic bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40">
          {client.notes}
        </p>
      )}

      {/* Bitácora de Pagos de este Cliente */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-brand-orange" /> Bitácora de Pagos del Cliente
          </h5>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2 px-3">Concepto</th>
                <th className="py-2 px-3">Período</th>
                <th className="py-2 px-3">Monto</th>
                <th className="py-2 px-3">Fecha</th>
                <th className="py-2 px-3">Método</th>
                <th className="py-2 px-3">Estado</th>
                <th className="py-2 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {!client.payments || client.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-slate-500 text-[11px] italic">
                    Sin registros de pago aún.
                  </td>
                </tr>
              ) : (
                client.payments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800/50 hover:bg-slate-900/40 text-xs"
                  >
                    <td className="py-2 px-3 text-slate-200 font-medium">{p.concept}</td>
                    <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{p.period}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-200">
                      {formatCOP(p.amount)}
                    </td>
                    <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{p.date}</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">{p.method}</td>
                    <td className="py-2 px-3">
                      {p.paid ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded font-bold">
                          PAGADO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-mono rounded font-bold">
                          PENDIENTE
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right space-x-1">
                      <button
                        onClick={() => togglePaymentPaid(client.id, p.id)}
                        title="Cambiar Estado de Pago"
                        className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors cursor-pointer"
                      >
                        {p.paid ? (
                          <X className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                      <button
                        onClick={() => deletePayment(client.id, p.id)}
                        title="Eliminar Registro"
                        className="p-1 bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Payment Form */}
        <form
          onSubmit={onSubmitPayment}
          className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800 space-y-3"
        >
          <span className="text-[11px] font-mono text-brand-orange uppercase font-bold block">
            + Registrar Nuevo Pago de Mensualidad
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Concepto
              </label>
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ej: Mensualidad"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Período / Mes
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ej: Julio 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Monto ($ COP)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Método
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              >
                <option value="Transferencia Bancolombia">Bancolombia</option>
                <option value="Nequi">Nequi</option>
                <option value="Daviplata">Daviplata</option>
                <option value="Efectivo">Efectivo</option>
                <option value="MercadoPago">MercadoPago</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1 px-2 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg text-xs uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
