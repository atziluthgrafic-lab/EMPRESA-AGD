import React, { useState } from "react";
import {
  Receipt,
  Search,
  Printer,
  X,
  PlusCircle,
  Users,
  LogOut,
  AlertCircle,
  CheckCircle,
  FileText,
  UserPlus,
  BarChart3
} from "lucide-react";
import { AuthSession, SellerRecord, OrderReceiptRecord, ANTIOQUIA_MUNICIPALITIES, BUSINESS_CATEGORIES } from "./AdminDashboard";
import { ClientRecord } from "../types";
import CustomerRegistrationForm from "./CustomerRegistrationForm";
import CustomerList from "./CustomerList";
import PerformanceSummary from "./PerformanceSummary";

interface VendedorDashboardProps {
  authSession: AuthSession;
  onLogout: () => void;
  orders: OrderReceiptRecord[];
  onSaveOrder: (newOrder: OrderReceiptRecord) => void;
  sellers: SellerRecord[];
  clients?: ClientRecord[];
  onAddClient?: (newClient: ClientRecord) => void;
}

export default function VendedorDashboard({
  authSession,
  onLogout,
  orders,
  onSaveOrder,
  sellers,
  clients = [],
  onAddClient
}: VendedorDashboardProps) {
  // Order Form State
  const [ordDocumentType, setOrdDocumentType] = useState<'abono' | 'factura'>('abono');
  const [ordSellerId, setOrdSellerId] = useState(authSession.sellerId || sellers[0]?.id || "sel_1");
  const [ordClientName, setOrdClientName] = useState("");
  const [ordClientDocument, setOrdClientDocument] = useState("");
  const [ordClientPhone, setOrdClientPhone] = useState("");
  const [ordClientMunicipality, setOrdClientMunicipality] = useState("Medellín");
  const [ordClientAddress, setOrdClientAddress] = useState("");
  const [ordProductCategory, setOrdProductCategory] = useState("Gran Formato & Pendones");
  const [ordProductDescription, setOrdProductDescription] = useState("");
  const [ordQuantity, setOrdQuantity] = useState(1);
  const [ordUnitPrice, setOrdUnitPrice] = useState(0);
  const [ordPaidAmount, setOrdPaidAmount] = useState(0);
  const [ordPaymentMethod, setOrdPaymentMethod] = useState("Transferencia Bancolombia");
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Search & Modal State
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showOrderClientModal, setShowOrderClientModal] = useState(false);
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<OrderReceiptRecord | null>(null);

  // Vendor Navigation & AGREGAR_CLIENTE State
  const [vendorTab, setVendorTab] = useState<'pedidos' | 'agregar_cliente' | 'mi_cartera' | 'rendimiento'>('pedidos');

  // AGREGAR_CLIENTE Form State (Campos Obligatorios según Instrucción 1)
  const [cliName, setCliName] = useState("");
  const [cliMunicipality, setCliMunicipality] = useState("Medellín");
  const [cliAddress, setCliAddress] = useState("");
  const [cliZone, setCliZone] = useState("Valle de Aburrá Norte");
  const [cliBusinessType, setCliBusinessType] = useState("Litografía & Imprenta");
  const [cliNitCc, setCliNitCc] = useState("");
  const [cliContactPerson, setCliContactPerson] = useState("");
  const [cliPhone, setCliPhone] = useState("");
  const [cliEmail, setCliEmail] = useState("");
  const [cliBudget, setCliBudget] = useState(1500000);
  const [cliPeriodicity, setCliPeriodicity] = useState("Mensual");
  const [cliNotes, setCliNotes] = useState("");

  const [clientSuccessMsg, setClientSuccessMsg] = useState<string | null>(null);
  const [createdClientJsonModal, setCreatedClientJsonModal] = useState<any | null>(null);

  // Filter clients for this seller ONLY (Restricción de Seguridad: ningún vendedor puede ver clientes de otros)
  const myClients = (clients || []).filter((c) => {
    const isMySellerId = c.vendedorId === authSession.sellerId || c.createdBySellerId === authSession.sellerId || c.beneficiarioComision === authSession.sellerId;
    const isMyUsername = c.vendedorNombre === authSession.name || c.createdBySellerName === authSession.name;
    return isMySellerId || isMyUsername;
  });

  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cliName.trim() || !cliAddress.trim() || !cliPhone.trim()) {
      alert("Por favor complete los campos obligatorios: Nombre, Ubicación (Dirección) y Teléfono.");
      return;
    }

    const sellerId = authSession.sellerId || "sel-1";
    const sellerName = authSession.name || "Vendedor";

    // Formato de Salida JSON según Instrucción Operativa 1
    const newClientPayload = {
      id: `cli-${Date.now()}`,
      clientName: cliName.trim(),
      name: cliName.trim(),
      ubicacion: {
        municipality: cliMunicipality,
        address: cliAddress.trim(),
        zone: cliZone
      },
      businessType: cliBusinessType,
      tipoDeNegocio: cliBusinessType,
      caracteristicasEspecificas: {
        nitCc: cliNitCc.trim() || "Sin NIT",
        personaContacto: cliContactPerson.trim() || cliName.trim(),
        telefono: cliPhone.trim(),
        email: cliEmail.trim() || "N/A",
        presupuestoEstimado: Number(cliBudget) || 0,
        periodicidad: cliPeriodicity,
        notasEspecificas: cliNotes.trim() || "Registro inicial de cliente por vendedor."
      },
      createdBySellerId: sellerId,
      createdBySellerName: sellerName,
      vendedorId: sellerId,
      vendedorNombre: sellerName,
      beneficiarioComision: sellerId,
      beneficiarioNombre: sellerName,
      estadoComision: "Pendiente" as const,
      promociones: [],
      descuentoPorcentaje: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch("/api/sales/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClientPayload)
      });
    } catch (err) {
      console.warn("No se pudo conectar al backend, guardando localmente:", err);
    }

    if (onAddClient) {
      onAddClient(newClientPayload);
    }

    setCreatedClientJsonModal(newClientPayload);
    setClientSuccessMsg(`¡Cliente "${cliName}" registrado con éxito! Ficha JSON almacenada.`);
    setTimeout(() => setClientSuccessMsg(null), 5000);

    // Reset Form
    setCliName("");
    setCliAddress("");
    setCliNitCc("");
    setCliContactPerson("");
    setCliPhone("");
    setCliEmail("");
    setCliNotes("");
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ordClientName.trim()) {
      alert("Por favor ingrese el nombre del cliente.");
      return;
    }

    const totalAmount = ordQuantity * ordUnitPrice;
    const balance = Math.max(0, totalAmount - ordPaidAmount);
    const orderNum = `PED-2026-${String(orders.length + 1).padStart(3, "0")}`;

    const activeSeller = sellers.find((s) => s.id === ordSellerId) || {
      id: authSession.sellerId || "sel_1",
      name: authSession.name,
      username: authSession.username,
      phone: authSession.sellerRecord?.phone || "3000000000",
      supervisor: "Estivenson Navarro (Director Comercial)",
    };

    const newOrder: OrderReceiptRecord = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      documentType: ordDocumentType,
      date: new Date().toISOString().split("T")[0],
      sellerId: activeSeller.id,
      sellerName: activeSeller.name,
      sellerUsername: activeSeller.username,
      sellerPhone: activeSeller.phone,
      sellerSupervisor: activeSeller.supervisor || "Estivenson Navarro (Director Comercial)",
      clientName: ordClientName.trim(),
      clientDocument: ordClientDocument.trim() || "Consumidor Final",
      clientPhone: ordClientPhone.trim() || "N/A",
      clientMunicipality: ordClientMunicipality,
      clientAddress: ordClientAddress.trim() || "Despacho Local",
      productCategory: ordProductCategory,
      productDescription: ordProductDescription.trim() || `${ordProductCategory} personalizado`,
      quantity: ordQuantity,
      unitPrice: ordUnitPrice,
      totalAmount,
      paidAmount: ordPaidAmount,
      balance,
      paymentMethod: ordPaymentMethod,
      status: balance === 0 ? 'completado' : 'pendiente',
      notes: ordDocumentType === 'abono' 
        ? `Recibo de abono inicial (${((ordPaidAmount/totalAmount)*100||0).toFixed(0)}%). Saldo contra entrega.` 
        : `Factura final de venta. Estado: ${balance === 0 ? 'PAGADO TOTAL' : 'SALDO PENDIENTE'}.`,
      createdAt: new Date().toISOString(),
    };

    onSaveOrder(newOrder);

    // Reset Form
    setOrdClientName("");
    setOrdClientDocument("");
    setOrdClientPhone("");
    setOrdClientAddress("");
    setOrdProductDescription("");
    setOrdQuantity(1);
    setOrdUnitPrice(0);
    setOrdPaidAmount(0);

    setOrderSuccessMsg(`¡Comprobante ${orderNum} creado exitosamente!`);
    setTimeout(() => setOrderSuccessMsg(null), 4000);

    // Auto view PDF
    setViewingReceiptOrder(newOrder);
    setShowReceiptModal(true);
  };

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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVendorTab('agregar_cliente')}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-mono font-extrabold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 border border-emerald-300/40"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ AGREGAR NUEVO CLIENTE</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Banner de Vista Exclusiva Vendedor */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/80 p-5 rounded-2xl space-y-1 shadow-lg">
        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded-full font-bold uppercase inline-block">
          Portal Exclusivo de Ventas & Facturación
        </span>
        <h1 className="text-xl font-bold text-white font-display">Módulo de Pedidos, Clientes & Comisiones</h1>
        <p className="text-xs text-slate-300">
          Interfaz dedicada a asesores comerciales. Ejecuta el comando <strong className="text-emerald-400 font-mono">AGREGAR_CLIENTE</strong>, emite comprobantes oficiales en PDF y gestiona tu cartera exclusiva de clientes.
        </p>
      </div>

      {/* SUB-NAVIGATION TABS DE VENDEDOR */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setVendorTab('pedidos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            vendorTab === 'pedidos'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>📦 Registrar Pedido / Venta</span>
        </button>

        <button
          type="button"
          onClick={() => setVendorTab('agregar_cliente')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            vendorTab === 'agregar_cliente'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>➕ Agregar Cliente Nuevo</span>
        </button>

        <button
          type="button"
          onClick={() => setVendorTab('mi_cartera')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            vendorTab === 'mi_cartera'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 Directorio de Clientes ({myClients.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setVendorTab('rendimiento')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            vendorTab === 'rendimiento'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 Resumen de Rendimiento</span>
        </button>
      </div>

      {/* SECCIÓN 1: PEDIDOS Y FACTURACIÓN */}
      {vendorTab === 'pedidos' && (
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setVendorTab('agregar_cliente')}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono text-xs font-extrabold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 border border-emerald-300/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ NUEVO CLIENTE</span>
            </button>

            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Pedidos Registrados</span>
              <span className="text-lg font-bold text-indigo-400 font-mono">{orders.length} comprobantes</span>
            </div>
          </div>
        </div>

        {orderSuccessMsg && (
          <div className="p-4 bg-emerald-950/90 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-mono flex items-center gap-3 shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{orderSuccessMsg}</span>
          </div>
        )}

        {/* FORMULARIO DE REGISTRO DE PEDIDO */}
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
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (@{s.username}) — {s.zone}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 bg-slate-900/80 p-3.5 rounded-xl border border-indigo-500/20 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <label className="text-xs font-mono uppercase text-indigo-300 font-bold flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-400" /> Selección de Cliente para la Venta
                </label>
                <button
                  type="button"
                  onClick={() => setShowOrderClientModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer w-fit"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Crear Nuevo Cliente (Ficha)</span>
                </button>
              </div>

              {clients.length > 0 ? (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">
                    Cargar datos de un cliente previamente registrado:
                  </span>
                  <select
                    onChange={(e) => {
                      const sel = clients.find((c) => c.id === e.target.value);
                      if (sel) {
                        setOrdClientName(sel.clientName);
                        setOrdClientPhone(sel.phone || "");
                        if (sel.location) {
                          const parts = sel.location.split(',');
                          if (parts.length > 0) setOrdClientMunicipality(parts[0].trim());
                        }
                      }
                    }}
                    className="w-full bg-slate-950 border border-indigo-900/50 rounded-xl px-3.5 py-2 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="">-- Seleccionar de la Cartera ({clients.length} disponibles) --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.clientName} ({c.projectName || c.location})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 font-mono italic">
                  No hay clientes registrados aún. Haz clic en "+ Crear Nuevo Cliente" para agregarlo rápidamente.
                </div>
              )}
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
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
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
                              ord.status === 'completado' || ord.balance === 0
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {ord.status === 'completado' || ord.balance === 0 ? 'Pagado Total' : 'Abono Parcial'}
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
      )}

      {/* SECCIÓN 2: FACULTAD DEL VENDEDOR — AGREGAR_CLIENTE */}
      {vendorTab === 'agregar_cliente' && (
        <CustomerRegistrationForm
          sellerId={authSession.sellerId || authSession.sellerRecord?.id}
          sellerName={authSession.name}
          sellers={sellers}
          isAdmin={false}
          onClientAdded={(newClient) => {
            if (onAddClient) onAddClient(newClient);
            setCreatedClientJsonModal(newClient);
          }}
        />
      )}

      {/* SECCIÓN 3: MI CARTERA EXCLUSIVA CON BUSCADOR Y FILTRADO */}
      {vendorTab === 'mi_cartera' && (
        <div id="seccion-mi-cartera" className="space-y-6">
          <CustomerList
            clients={myClients}
            sellers={sellers}
            isAdmin={false}
          />
        </div>
      )}

      {/* SECCIÓN 4: RESUMEN DE RENDIMIENTO (RECHARTS & FICHA CONSOLIDADA) */}
      {vendorTab === 'rendimiento' && (
        <PerformanceSummary
          authSession={authSession}
          sellers={sellers}
          orders={orders}
          clients={clients}
        />
      )}

      {/* MODAL CREAR NUEVO CLIENTE (INLINE DESDE REGISTRAR PEDIDO / VENTA) */}
      {showOrderClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  Crear Nuevo Cliente para Registrar Pedido
                </h3>
              </div>
              <button
                onClick={() => setShowOrderClientModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <CustomerRegistrationForm
              sellerId={authSession.sellerId || authSession.sellerRecord?.id}
              sellerName={authSession.name}
              sellers={sellers}
              isAdmin={false}
              onClientAdded={(newClient) => {
                if (onAddClient) onAddClient(newClient);
                setOrdClientName(newClient.clientName);
                if (newClient.phone) setOrdClientPhone(newClient.phone);
                if (newClient.location) {
                  const parts = newClient.location.split(',');
                  if (parts.length > 0) setOrdClientMunicipality(parts[0].trim());
                }
                setShowOrderClientModal(false);
                setOrderSuccessMsg(`¡Cliente "${newClient.clientName}" creado y seleccionado automáticamente para el pedido!`);
                setTimeout(() => setOrderSuccessMsg(null), 5000);
              }}
            />
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
