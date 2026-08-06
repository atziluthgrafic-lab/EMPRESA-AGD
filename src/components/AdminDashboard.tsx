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
  UserPlus
} from "lucide-react";
import { ClientRecord, ClientPayment } from "../types";

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
  "Medellín", "Bello", "Envigado", "Itagüí", "Sabaneta", "Rionegro", 
  "Copacabana", "Girardota", "Caldas", "La Estrella", "Marinilla", 
  "Guarne", "La Ceja", "El Retiro", "Carmen de Viboral", "Barbosa", "Santa Fe de Antioquia"
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
    sellerSupervisor: "Estiven Arango (Director Comercial)",
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

export default function AdminDashboard() {
  const [activeAdminTab, setActiveAdminTab] = useState<'vendedores' | 'clientes' | 'facturacion' | 'branding'>('vendedores');
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

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

  const openEditSeller = (seller: SellerRecord) => {
    setEditingSeller(seller);
    setEditSellerName(seller.name);
    setEditSellerUsername(seller.username);
    setEditSellerPassword(seller.password || "123");
    setEditSellerSupervisor(seller.supervisor || "Estiven Arango (Director Comercial)");
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
    const isAdminUser = ["estiven", "admin", "estiven arango", "estivenarango", "direccion.general"].includes(cleanUsername);
    const isAdminPass = ["lmrv1979", "lmrv.1979", "2026", "123456", "admin123"].includes(cleanPassword.toLowerCase());

    if (isAdminUser && isAdminPass) {
      const session: AuthSession = {
        isLoggedIn: true,
        role: "admin",
        username: "Estiven",
        name: "Estiven Arango (Administrador General)",
      };
      setAuthSession(session);
      localStorage.setItem("atziluth_admin_session", JSON.stringify(session));
      setLoginUsername("");
      setLoginPassword("");
      return;
    }

    // 2. Seller Credentials from localStorage ('atziluth_vendedores')
    const savedSellersRaw = localStorage.getItem("atziluth_vendedores") || localStorage.getItem("atziluth_sellers_data");
    let currentSellersList: SellerRecord[] = sellers;
    if (savedSellersRaw) {
      try {
        const parsed = JSON.parse(savedSellersRaw);
        if (Array.isArray(parsed) && parsed.length > 0) currentSellersList = parsed;
      } catch (_) {}
    }

    const matchedSeller = currentSellersList.find((s) => {
      const sUser = (s.username || "").trim().toLowerCase();
      const sPass = s.password || "123";
      return sUser === cleanUsername && sPass === cleanPassword;
    });

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

    setLoginError("Credenciales inválidas. Verifique su usuario y contraseña.");
  };

  const handleLogout = () => {
    setAuthSession(null);
    localStorage.removeItem("atziluth_admin_session");
  };

  // New Seller Form State
  const [newSellerName, setNewSellerName] = useState("");
  const [newSellerUsername, setNewSellerUsername] = useState("");
  const [newSellerPassword, setNewSellerPassword] = useState("");
  const [newSellerSupervisor, setNewSellerSupervisor] = useState("Estiven Arango (Director Comercial)");
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

  const handleDeleteSeller = (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar al vendedor "${name}" de la base de datos?`)) {
      const updated = sellers.filter((s) => s.id !== id);
      setSellers(updated);
    }
  };

  const openReportForSeller = (seller: SellerRecord) => {
    setSelectedSellerForReport(seller);
    setReportCommissionRate(seller.commissionRate || 5.0);
    setShowReportModal(true);
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

    let sellerName = "Estiven Arango (Administrador General)";
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
  const [newClientPhone, setNewClientPhone] = useState("");
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
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientProject.trim()) {
      alert("Por favor ingresa el nombre del cliente y del proyecto.");
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

    const newRecord: ClientRecord = {
      id: clientId,
      clientName: newClientName.trim(),
      projectName: newClientProject.trim(),
      phone: newClientPhone.trim(),
      startDate: newClientStartDate || new Date().toISOString().split("T")[0],
      hostingDomainFee: newClientHostingFee,
      hostingDomainPaid: newClientHostingPaid,
      monthlyFee: newClientMonthlyFee,
      billingDay: newClientBillingDay,
      notes: newClientNotes.trim(),
      payments: initialPayments,
    };

    const updated = [newRecord, ...clients];
    setClients(updated);
    saveConfig(updated);

    // Reset Form
    setNewClientName("");
    setNewClientProject("");
    setNewClientPhone("");
    setNewClientNotes("");
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
              onClick={() => { setLoginMode('admin'); setLoginUsername('Estiven'); setLoginPassword('Lmrv1979'); setLoginError(null); }}
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
                  placeholder={loginMode === 'vendedor' ? "Ej: carlos.ventas" : "Ej: Estiven"}
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
              Acceso Rápido / Credenciales LocalStorage:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setLoginMode('vendedor'); setLoginUsername('carlos.ventas'); setLoginPassword('123'); setLoginError(null); }}
                className="p-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-left transition-all cursor-pointer"
              >
                <strong className="text-emerald-400 block font-bold text-xs">Carlos (Vendedor)</strong>
                <span className="text-[10px] text-slate-500 block">User: carlos.ventas | Clave: 123</span>
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('admin'); setLoginUsername('Estiven'); setLoginPassword('Lmrv1979'); setLoginError(null); }}
                className="p-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-left transition-all cursor-pointer"
              >
                <strong className="text-brand-orange block font-bold text-xs">Estiven (Admin)</strong>
                <span className="text-[10px] text-slate-500 block">User: Estiven | Clave: Lmrv1979</span>
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
              Módulo Contable & Marca
            </span>
            {saveStatus && (
              <span className="text-xs font-mono text-emerald-400 animate-pulse">
                {saveStatus}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-2">
            Panel de Administración, Clientes y Contabilidad
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Gestión integral de clientes, pagos iniciales de $400.000 (hosting/dominio), mensualidades, vendedores y gestor de marca.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              setActiveAdminTab('vendedores');
              setTimeout(() => {
                const el = document.getElementById("formulario-nuevo-vendedor") || document.getElementById("seccion-vendedores");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-xs font-mono font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg border border-emerald-400/30"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>+ Agregar Vendedor</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('facturacion')}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Wallet className="w-4 h-4" />
            <span>Portal Ventas & Facturación</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('branding')}
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

      {/* PESTAÑAS DE NAVEGACIÓN PRINCIPAL EN PANEL GENERAL */}
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl flex flex-wrap items-center gap-2 shadow-xl sticky top-2 z-40 backdrop-blur-md">
        <button
          onClick={() => setActiveAdminTab('vendedores')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeAdminTab === 'vendedores'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-500/30'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>👥 Gestión de Vendedores ({sellers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('clientes')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeAdminTab === 'clientes'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg border border-indigo-500/30'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>💼 Clientes & Contabilidad</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('facturacion')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeAdminTab === 'facturacion'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg border border-amber-500/30'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>🧾 Ventas & Facturación</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('branding')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <span>ABRIR PORTAL DE VENTAS & VENDEDORES ↗</span>
          </a>
        </div>

        {/* Portal 2: Almanaques & Calendarios */}
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
            <span>ABRIR PANEL DE ALMANAQUES ↗</span>
          </a>
        </div>

        {/* Portal 3: Editor Web General */}
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

      {/* GESTIÓN DE VENDEDORES, MUNICIPIOS Y CATEGORÍAS (CRUD LOCALSTORAGE) */}
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
                Crea, lista y elimina vendedores comerciales. Asigna municipios de Antioquia y líneas de negocio, calcula comisiones y genera reportes mensuales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Vendedores Activos</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{sellers.length} comercial(es)</span>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE CREACIÓN DE NUEVO VENDEDOR */}
        <form onSubmit={handleAddSeller} className="bg-slate-950 p-5 md:p-6 rounded-2xl border border-slate-800 space-y-5">
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
                <option value="Estiven Arango (Director Comercial)">Estiven Arango (Director Comercial)</option>
                <option value="Laura Gómez (Supervisora Metropolitana)">Laura Gómez (Supervisora Metropolitana)</option>
                <option value="Luz Elena Restrepo (Supervisora Oriente)">Luz Elena Restrepo (Supervisora Oriente)</option>
                <option value="Sin Supervisor (Directo)">Sin Supervisor (Directo)</option>
              </select>
            </div>
          </div>

          {/* SELECTOR INTERACTIVO DE MUNICIPIOS */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Municipios Asignados en Antioquia ({newSellerMunicipalities.length})
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Haz clic para seleccionar o quitar</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ANTIOQUIA_MUNICIPALITIES.map((muni) => {
                const isSelected = newSellerMunicipalities.includes(muni);
                return (
                  <button
                    key={muni}
                    type="button"
                    onClick={() => toggleMunicipality(muni)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border flex items-center gap-1 cursor-pointer ${
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
                          <span className="text-[10px] text-slate-500 block">Clave: {seller.password || '•••••'}</span>
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
            <div className="flex justify-end gap-3 pt-2">
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

      {/* SECCIÓN GENERACIÓN DE RECIBO DE ABONO Y FACTURA FINAL (PDF / IMPRESIÓN) */}
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
                <option value="admin">Estiven Arango (Administrador General)</option>
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

      {/* KPI METRICS OVERVIEW */}
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

      {/* TWO COLUMNS: REGISTER CLIENT & CLIENTS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REGISTER CLIENT FORM */}
        <form
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
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Nombre del Cliente / Razón Social *
              </label>
              <input
                type="text"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Ej: Hotel Guatapé Real / Carlos Restrepo"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Nombre del Proyecto / Sitio Web *
              </label>
              <input
                type="text"
                value={newClientProject}
                onChange={(e) => setNewClientProject(e.target.value)}
                placeholder="Ej: Portal Turístico & Reservas Guatapé"
                required
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
                    <option value="Estiven Arango (Director Comercial)">Estiven Arango (Director Comercial)</option>
                    <option value="Laura Gómez (Supervisora Metropolitana)">Laura Gómez (Supervisora Metropolitana)</option>
                    <option value="Luz Elena Restrepo (Supervisora Oriente)">Luz Elena Restrepo (Supervisora Oriente)</option>
                    <option value="Sin Supervisor (Directo)">Sin Supervisor (Directo)</option>
                  </select>
                </div>
              </div>

              {/* Municipios Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Municipios Asignados ({editSellerMunicipalities.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
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
    </div>
  );
}
