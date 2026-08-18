import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle,
  Download,
  Eye,
  Send,
  Save,
  ChevronRight,
  Phone,
  Mail,
  Receipt,
  ExternalLink,
  ShieldCheck,
  Image as ImageIcon,
  X,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  Check,
  RefreshCw
} from 'lucide-react';
import {
  ProveedorRecord,
  OrdenProduccion,
  PagoProveedor,
  OrdenProduccionEstado,
  OrdenProduccionTipoEntrega,
  ProveedorCategoria
} from '../types/proveedor';
import {
  getStoredProveedores,
  saveStoredProveedores,
  getStoredOrdenes,
  saveStoredOrdenes,
  getStoredPagos
} from '../data/proveedoresData';

interface ProveedorVirtualOfficeProps {
  initialTokenOrId?: string;
  onNavigateHome?: () => void;
}

export const ProveedorVirtualOffice: React.FC<ProveedorVirtualOfficeProps> = ({
  initialTokenOrId,
  onNavigateHome
}) => {
  // 1. Resolve Provider from URL params, hash, or prop
  const [activeToken, setActiveToken] = useState<string>('');
  const [proveedores, setProveedores] = useState<ProveedorRecord[]>([]);
  const [currentProveedor, setCurrentProveedor] = useState<ProveedorRecord | null>(null);
  
  // 2. Orders and Payments state
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [pagos, setPagos] = useState<PagoProveedor[]>([]);
  
  // 3. UI Tabs & Modals
  const [activeTab, setActiveTab] = useState<'pedidos' | 'banco' | 'pagos' | 'resumen'>('pedidos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [viewingComprobanteUrl, setViewingComprobanteUrl] = useState<string | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<PagoProveedor | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<{ msg: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // 4. Form states for Finishing an Order
  const [finishLogistica, setFinishLogistica] = useState<OrdenProduccionTipoEntrega>('Recoger_Taller');
  const [finishDireccionEnvio, setFinishDireccionEnvio] = useState('');
  const [finishGuia, setFinishGuia] = useState('');
  const [finishObservaciones, setFinishObservaciones] = useState('');
  const [finishFinalCost, setFinishFinalCost] = useState<number>(0);

  // 5. Editable Bank Details state
  const [bankForm, setBankForm] = useState({
    banco: '',
    tipoCuenta: 'Ahorros' as 'Ahorros' | 'Corriente' | 'Billetera Digital',
    numeroCuenta: '',
    titular: '',
    documentoTitular: '',
    telefonoTransferencia: '',
    emailNotificaciones: ''
  });
  const [bankSavedSuccess, setBankSavedSuccess] = useState(false);

  // 6. Quotation direct edit in card
  const [editingCostId, setEditingCostId] = useState<string | null>(null);
  const [tempCostValue, setTempCostValue] = useState<string>('');

  // State for manual token entry if link is missing or expired
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [manualTokenError, setManualTokenError] = useState(false);

  // Initial Data Load & URL parsing
  useEffect(() => {
    // Load from local storage
    const loadedProveedores = getStoredProveedores();
    const loadedOrdenes = getStoredOrdenes();
    const loadedPagos = getStoredPagos();

    setProveedores(loadedProveedores);
    setOrdenes(loadedOrdenes);
    setPagos(loadedPagos);

    // Extract token from URL search query (?token=... or ?proveedor=...) or hash (#proveedor?token=... or #proveedor/token) or props
    let token = initialTokenOrId || '';
    if (!token && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token') || urlParams.get('proveedor') || urlParams.get('prv') || urlParams.get('id') || '';
      
      if (!token && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        token = hashParams.get('token') || hashParams.get('proveedor') || hashParams.get('prv') || hashParams.get('id') || '';
      } else if (!token && window.location.hash.includes('/')) {
        const parts = window.location.hash.split('/');
        if (parts.length > 1 && parts[1]) {
          token = parts[1];
        }
      }
    }

    // Default fallback to first provider ONLY if no token was passed in URL and we have providers
    if (!token && loadedProveedores.length > 0) {
      token = loadedProveedores[0].tokenAcceso;
    }

    setActiveToken(token);

    // Find matching provider strictly
    const found = loadedProveedores.find(
      (p) => p.tokenAcceso === token || p.id === token || p.codigo.toLowerCase() === token.toLowerCase()
    );

    if (found) {
      setCurrentProveedor(found);
      setBankForm({
        banco: found.datosBancarios?.banco || 'Bancolombia',
        tipoCuenta: found.datosBancarios?.tipoCuenta || 'Ahorros',
        numeroCuenta: found.datosBancarios?.numeroCuenta || '',
        titular: found.datosBancarios?.titular || found.contactoNombre,
        documentoTitular: found.datosBancarios?.documentoTitular || '',
        telefonoTransferencia: found.datosBancarios?.telefonoTransferencia || found.telefonoWhatsapp,
        emailNotificaciones: found.datosBancarios?.emailNotificaciones || found.email || ''
      });
    } else {
      setCurrentProveedor(null);
    }
  }, [initialTokenOrId]);

  // Handle manual token submission
  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualTokenInput.trim();
    if (!clean) return;

    const loadedProveedores = getStoredProveedores();
    const found = loadedProveedores.find(
      (p) => p.tokenAcceso === clean || p.id === clean || p.codigo.toLowerCase() === clean.toLowerCase()
    );

    if (found) {
      setCurrentProveedor(found);
      setActiveToken(found.tokenAcceso);
      setManualTokenError(false);
      setBankForm({
        banco: found.datosBancarios?.banco || 'Bancolombia',
        tipoCuenta: found.datosBancarios?.tipoCuenta || 'Ahorros',
        numeroCuenta: found.datosBancarios?.numeroCuenta || '',
        titular: found.datosBancarios?.titular || found.contactoNombre,
        documentoTitular: found.datosBancarios?.documentoTitular || '',
        telefonoTransferencia: found.datosBancarios?.telefonoTransferencia || found.telefonoWhatsapp,
        emailNotificaciones: found.datosBancarios?.emailNotificaciones || found.email || ''
      });
      // Update URL query string
      if (window.history.pushState) {
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?token=${found.tokenAcceso}#proveedor`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
    } else {
      setManualTokenError(true);
    }
  };

  // Sync current provider orders
  const providerOrders = currentProveedor
    ? ordenes.filter((o) => o.proveedorId === currentProveedor.id)
    : [];

  const providerPayments = currentProveedor
    ? pagos.filter((p) => p.proveedorId === currentProveedor.id)
    : [];

  // Filtered orders
  const filteredOrders = providerOrders.filter((o) => {
    if (filterEstado === 'todos') return true;
    return o.estado === filterEstado;
  });

  // Calculate financial summary for this provider
  const totalCotizado = providerOrders.reduce((sum, o) => sum + (o.costoProveedor || 0), 0);
  const totalPagado = providerPayments.reduce((sum, p) => sum + p.monto, 0);
  const saldoPendiente = Math.max(0, totalCotizado - totalPagado);
  const ordenesTerminadas = providerOrders.filter((o) => o.estado === 'Terminado' || o.estado === 'Entregado').length;
  const ordenesEnProceso = providerOrders.filter((o) => o.estado === 'En_Produccion' || o.estado === 'Pendiente_Cotizar').length;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Save Bank Details
  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProveedor) return;

    const updatedProvider: ProveedorRecord = {
      ...currentProveedor,
      datosBancarios: {
        banco: bankForm.banco,
        tipoCuenta: bankForm.tipoCuenta,
        numeroCuenta: bankForm.numeroCuenta,
        titular: bankForm.titular,
        documentoTitular: bankForm.documentoTitular,
        telefonoTransferencia: bankForm.telefonoTransferencia,
        emailNotificaciones: bankForm.emailNotificaciones
      },
      updatedAt: new Date().toISOString()
    };

    const updatedList = proveedores.map((p) => (p.id === currentProveedor.id ? updatedProvider : p));
    setProveedores(updatedList);
    setCurrentProveedor(updatedProvider);
    saveStoredProveedores(updatedList);

    setBankSavedSuccess(true);
    setNotificationBanner({
      msg: '¡Datos bancarios actualizados correctamente! El Administrador ya puede realizar pagos a esta cuenta.',
      type: 'success'
    });

    setTimeout(() => {
      setBankSavedSuccess(false);
    }, 4000);
  };

  // Save single order quotation price
  const handleSaveQuotation = (ordenId: string) => {
    const cost = parseFloat(tempCostValue.replace(/[^0-9]/g, '')) || 0;
    if (cost <= 0) return;

    const updatedOrders = ordenes.map((o) => {
      if (o.id === ordenId) {
        return {
          ...o,
          costoProveedor: cost,
          estado: o.estado === 'Pendiente_Cotizar' ? ('En_Produccion' as OrdenProduccionEstado) : o.estado
        };
      }
      return o;
    });

    setOrdenes(updatedOrders);
    saveStoredOrdenes(updatedOrders);
    setEditingCostId(null);
    setTempCostValue('');

    setNotificationBanner({
      msg: `Valor cotizado de ${formatCOP(cost)} registrado exitosamente para la orden.`,
      type: 'success'
    });
  };

  // Open Finishing Modal
  const openFinishModal = (ord: OrdenProduccion) => {
    setSelectedOrden(ord);
    setFinishFinalCost(ord.costoProveedor || 0);
    setFinishLogistica(ord.tipoEntrega || 'Recoger_Taller');
    setFinishDireccionEnvio(ord.direccionEnvio || 'Sede Principal Atziluth — Medellín');
    setFinishGuia(ord.guiaTransporte || '');
    setFinishObservaciones(ord.observacionesLogistica || '');
    setIsFinishModalOpen(true);
  };

  // Submit Finish Status to Order
  const handleConfirmFinish = () => {
    if (!selectedOrden || !currentProveedor) return;

    const updatedOrders = ordenes.map((o) => {
      if (o.id === selectedOrden.id) {
        return {
          ...o,
          estado: 'Terminado' as OrdenProduccionEstado,
          costoProveedor: finishFinalCost > 0 ? finishFinalCost : o.costoProveedor,
          tipoEntrega: finishLogistica,
          direccionEnvio: finishLogistica === 'Envio_Direccion' ? finishDireccionEnvio : 'Recoger en taller del proveedor',
          guiaTransporte: finishGuia,
          observacionesLogistica: finishObservaciones,
          fechaFinalizado: new Date().toISOString(),
          notificadoAdmin: true,
          mensajeNotificacion: `Trabajo marcado como TERMINADO por el proveedor ${currentProveedor.nombreComercial}. Logística: ${finishLogistica === 'Recoger_Taller' ? 'Listo para Recoger en Taller' : `Enviado a: ${finishDireccionEnvio}`}.`
        };
      }
      return o;
    });

    setOrdenes(updatedOrders);
    saveStoredOrdenes(updatedOrders);
    setIsFinishModalOpen(false);

    // Show persistent notification
    setNotificationBanner({
      msg: `🎉 ¡Excelente! La orden #${selectedOrden.numeroOrden} ha sido marcada como TERMINADA. El Administrador ha recibido la notificación de entrega en tiempo real.`,
      type: 'success'
    });

    // Auto notify via WhatsApp link generator
    const adminPhone = "573001234567"; // Número comercial de Estivenson Navarro / Atziluth
    const whatsappText = encodeURIComponent(
      `🔔 *NOTIFICACIÓN DE TRABAJO TERMINADO — ATZILUTH GRÁFIC*\n` +
      `-------------------------------------------\n` +
      `🏢 *Proveedor:* ${currentProveedor.nombreComercial}\n` +
      `📦 *Orden:* #${selectedOrden.numeroOrden}\n` +
      `🏷️ *Trabajo:* ${selectedOrden.descripcionTrabajo}\n` +
      `🔢 *Cantidad:* ${selectedOrden.cantidad} unidades\n` +
      `💰 *Costo Final:* ${formatCOP(finishFinalCost || selectedOrden.costoProveedor)}\n` +
      `🚚 *Logística:* ${finishLogistica === 'Recoger_Taller' ? '📍 LISTO PARA RECOGER EN TALLER' : `🚛 ENVIADO (${finishGuia ? `Guía: ${finishGuia}` : finishDireccionEnvio})`}\n` +
      `📝 *Notas:* ${finishObservaciones || 'Sin observaciones adicionales'}\n` +
      `-------------------------------------------\n` +
      `_Enviado automáticamente desde la Oficina Virtual del Proveedor._`
    );

    // Optional direct trigger prompt
    setTimeout(() => {
      if (confirm('¿Deseas enviar también la confirmación instantánea a WhatsApp del Administrador (Estivenson Navarro)?')) {
        window.open(`https://wa.me/${adminPhone}?text=${whatsappText}`, '_blank');
      }
    }, 400);
  };

  // If no provider selected or found
  if (!currentProveedor) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-mono text-white">Oficina Virtual de Proveedor</h2>
            <p className="text-xs text-slate-400">
              Acceso privado y exclusivo para talleres aliados de Atziluth Gráfic Digital.
            </p>
          </div>

          <form onSubmit={handleManualTokenSubmit} className="space-y-3">
            <div className="text-left space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                Ingresa tu Token de Acceso o Código de Taller:
              </label>
              <input
                type="text"
                value={manualTokenInput}
                onChange={(e) => {
                  setManualTokenInput(e.target.value);
                  setManualTokenError(false);
                }}
                placeholder="Ej: PRV-ALM-101 o Token personal"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 text-amber-400 text-xs font-mono font-bold rounded-xl px-3.5 py-2.5 focus:outline-none placeholder:text-slate-600"
              />
            </div>

            {manualTokenError && (
              <p className="text-[11px] font-mono text-rose-400 text-left flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Código o Token no encontrado. Verifica con el Administrador.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Ingresar a mi Oficina Virtual
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <a
              href="https://wa.me/573001234567?text=Hola%20Estivenson,%20solicito%20mi%20enlace%20o%20token%20de%20acceso%20a%20mi%20Oficina%20Virtual%20de%20Proveedor%20en%20Atziluth%20Gr%C3%A1fic."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-mono transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solicitar mi Enlace por WhatsApp</span>
            </a>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-full py-2 text-slate-500 hover:text-slate-400 text-xs font-mono transition-colors cursor-pointer"
              >
                Volver al Inicio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans pb-16">
      {/* Top Bar / Branding */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950 font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white font-mono">
                  ATZILUTH <span className="text-amber-400">TALLER &bull; OFICINA VIRTUAL</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Acceso Privado
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Portal Seguro de Producción, Cotizaciones y Pagos
              </p>
            </div>
          </div>

          {/* Provider Specific Identity & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-white">{currentProveedor.nombreComercial}</span>
              <span className="text-[10px] font-mono text-slate-400">
                Código: <strong className="text-amber-400">{currentProveedor.codigo}</strong>
              </span>
            </div>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Salir</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {notificationBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 rounded-2xl flex items-center justify-between text-xs font-mono shadow-lg animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{notificationBanner.msg}</span>
            </div>
            <button
              onClick={() => setNotificationBanner(null)}
              className="text-emerald-400 hover:text-emerald-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Supplier Profile & KPI Cards */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {(Array.isArray(currentProveedor.categorias) && currentProveedor.categorias.length > 0
                  ? currentProveedor.categorias
                  : [currentProveedor.categoria || "Producción Gráfica"]
                ).map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {cat}
                  </span>
                ))}
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
                  {currentProveedor.codigo}
                </span>
                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-700/60 rounded-lg text-xs font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Conexión Directa a Producción
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                {currentProveedor.nombreComercial}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {currentProveedor.telefonoWhatsapp}
                </span>
                {currentProveedor.contactoNombre && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    Responsable: {currentProveedor.contactoNombre}
                  </span>
                )}
                {currentProveedor.direccionTaller && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {currentProveedor.direccionTaller} ({currentProveedor.municipio || 'Medellín'})
                  </span>
                )}
              </div>
            </div>

            {/* Quick Financial Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Pedidos Asignados</span>
                <span className="text-lg font-bold font-mono text-white">{providerOrders.length}</span>
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Terminados</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{ordenesTerminadas}</span>
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Pagado</span>
                <span className="text-sm font-bold font-mono text-sky-400">{formatCOP(totalPagado)}</span>
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-amber-900/40 bg-amber-950/20">
                <span className="text-[10px] font-mono text-amber-400 uppercase block">Saldo Pendiente</span>
                <span className="text-sm font-bold font-mono text-amber-300">{formatCOP(saldoPendiente)}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pedidos'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>ÓRDENES DE TRABAJO ({providerOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('banco')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'banco'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>DATOS BANCARIOS PARA PAGOS</span>
              {currentProveedor.datosBancarios?.numeroCuenta && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pagos')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pagos'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>PAGOS & COMPROBANTES ({providerPayments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resumen')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'resumen'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>ESTADO DE CUENTA & SALDO</span>
            </button>
          </div>
        </section>

        {/* TAB 1: PEDIDOS / ÓRDENES DE PRODUCCIÓN */}
        {activeTab === 'pedidos' && (
          <section className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-bold uppercase mr-1">Filtrar:</span>
                {[
                  { id: 'todos', label: 'Todos los Trabajos' },
                  { id: 'En_Produccion', label: '⚡ En Producción' },
                  { id: 'Pendiente_Cotizar', label: '⏳ Por Cotizar' },
                  { id: 'Terminado', label: '✅ Terminados' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterEstado(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      filterEstado === f.id
                        ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm'
                        : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-slate-400">
                Mostrando <strong className="text-white">{filteredOrders.length}</strong> órdenes
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <Package className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold font-mono text-slate-300">No hay órdenes en este estado</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Cuando la administración de Atziluth Gráfic te asigne nuevos trabajos de producción o impresión, aparecerán detallados aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((ord) => {
                  const isTerminado = ord.estado === 'Terminado' || ord.estado === 'Entregado';
                  const isEditingCost = editingCostId === ord.id;

                  return (
                    <div
                      key={ord.id}
                      className={`bg-slate-900/90 border rounded-3xl p-5 sm:p-6 transition-all space-y-5 shadow-lg ${
                        isTerminado
                          ? 'border-emerald-900/60 bg-emerald-950/10'
                          : ord.estado === 'Pendiente_Cotizar'
                          ? 'border-amber-900/60 bg-amber-950/10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2.5 py-0.5 rounded-lg">
                              #{ord.numeroOrden}
                            </span>
                            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-700">
                              Línea: {ord.categoria}
                            </span>
                            {ord.clienteNombre && (
                              <span className="text-xs font-mono text-slate-400">
                                &bull; Destino: <strong className="text-slate-200">{ord.clienteNombre}</strong>
                              </span>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold font-mono text-white pt-1">
                            {ord.descripcionTrabajo}
                          </h3>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isTerminado ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              TERMINADO &bull; {ord.tipoEntrega === 'Recoger_Taller' ? 'Para Recoger' : 'Enviado'}
                            </span>
                          ) : ord.estado === 'Pendiente_Cotizar' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold animate-pulse">
                              <Clock className="w-4 h-4 text-amber-400" />
                              PENDIENTE POR COTIZAR COSTO
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold">
                              <Layers className="w-4 h-4 text-sky-400" />
                              EN PRODUCCIÓN TALLER
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Technical Specs & Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-xs font-mono">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">
                            Cantidad & Medidas
                          </span>
                          <p className="text-slate-200 font-bold">
                            📦 {ord.cantidad.toLocaleString('es-CO')} Unidades
                          </p>
                          <p className="text-slate-400">
                            📐 {ord.especificaciones?.medidas || 'Medida estándar'}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">
                            Materiales & Acabados
                          </span>
                          <p className="text-slate-300">
                            📄 {ord.especificaciones?.material || 'Según especificación de orden'}
                          </p>
                          <p className="text-slate-400">
                            ✨ {ord.especificaciones?.acabados || 'Sin acabados especiales'}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">
                            Fechas Clave
                          </span>
                          <p className="text-slate-400">
                            📅 Asignado: {new Date(ord.fechaAsignacion).toLocaleDateString('es-CO')}
                          </p>
                          {ord.fechaLimiteEntrega && (
                            <p className="text-amber-400 font-bold">
                              ⏰ Límite: {new Date(ord.fechaLimiteEntrega).toLocaleDateString('es-CO')}
                            </p>
                          )}
                          {ord.fechaFinalizado && (
                            <p className="text-emerald-400 font-bold">
                              ✅ Finalizado: {new Date(ord.fechaFinalizado).toLocaleString('es-CO')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Attached Designs / Files */}
                      {ord.archivosAdjuntos && ord.archivosAdjuntos.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            Archivos de Diseño y Artes para Impresión:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {ord.archivosAdjuntos.map((file, idx) => (
                              <a
                                key={idx}
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono flex items-center gap-2 transition-colors group"
                              >
                                <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold">{file.nombre}</span>
                                {file.tamano && <span className="text-[10px] text-slate-400">({file.tamano})</span>}
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Footer: Financial Input & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800">
                        {/* Cost Quotation Editor */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400 font-bold">Costo del Servicio / Taller:</span>
                          {isEditingCost ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={tempCostValue}
                                onChange={(e) => setTempCostValue(e.target.value)}
                                placeholder="Ej: 450000"
                                className="w-32 bg-slate-950 border border-amber-500 rounded-xl px-2.5 py-1 text-xs font-mono text-amber-400 font-bold focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveQuotation(ord.id)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                                title="Guardar valor"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingCostId(null)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold font-mono text-emerald-400">
                                {ord.costoProveedor > 0 ? formatCOP(ord.costoProveedor) : 'Sin valor cotizado'}
                              </span>
                              {!isTerminado && (
                                <button
                                  onClick={() => {
                                    setEditingCostId(ord.id);
                                    setTempCostValue(ord.costoProveedor ? String(ord.costoProveedor) : '');
                                  }}
                                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                                >
                                  {ord.costoProveedor > 0 ? 'Editar Costo' : '+ Ingresar Costo'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action: Mark Finished or View Details */}
                        <div className="flex items-center gap-2">
                          {!isTerminado ? (
                            <button
                              onClick={() => openFinishModal(ord)}
                              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>NOTIFICAR TRABAJO TERMINADO</span>
                            </button>
                          ) : (
                            <div className="text-right text-[11px] font-mono text-emerald-400 space-y-0.5">
                              <span className="block font-bold">
                                📍 {ord.tipoEntrega === 'Recoger_Taller' ? 'Listo en Taller para Recoger' : `Enviado a: ${ord.direccionEnvio}`}
                              </span>
                              {ord.guiaTransporte && (
                                <span className="block text-slate-400">Guía / Transportadora: {ord.guiaTransporte}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: DATOS BANCARIOS */}
        {activeTab === 'banco' && (
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2.5 text-amber-400">
                <CreditCard className="w-6 h-6" />
                <h2 className="text-lg font-bold font-mono text-white">
                  Datos Bancarios para Transferencias & Liquidación
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Mantén actualizada la cuenta donde Atziluth Gráfic Digital te transferirá los pagos correspondientes a las órdenes de producción finalizadas.
              </p>
            </div>

            {bankSavedSuccess && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-600 text-emerald-200 rounded-2xl text-xs font-mono flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>¡Información bancaria guardada y sincronizada con el panel administrativo!</span>
              </div>
            )}

            <form onSubmit={handleSaveBankDetails} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Entidad Bancaria */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Entidad Bancaria / Billetera
                  </label>
                  <select
                    value={bankForm.banco}
                    onChange={(e) => setBankForm({ ...bankForm, banco: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="Bancolombia">Bancolombia</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Daviplata">Daviplata</option>
                    <option value="Davivienda">Davivienda</option>
                    <option value="Banco de Bogotá">Banco de Bogotá</option>
                    <option value="BBVA Colombia">BBVA Colombia</option>
                    <option value="Banco Agrario">Banco Agrario</option>
                    <option value="Banco Caja Social">Banco Caja Social</option>
                    <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                    <option value="Otro">Otro Banco / Cooperativa</option>
                  </select>
                </div>

                {/* Tipo de Cuenta */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Tipo de Cuenta
                  </label>
                  <select
                    value={bankForm.tipoCuenta}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        tipoCuenta: e.target.value as 'Ahorros' | 'Corriente' | 'Billetera Digital'
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="Ahorros">Cuenta de Ahorros</option>
                    <option value="Corriente">Cuenta Corriente</option>
                    <option value="Billetera Digital">Billetera Digital (Celular)</option>
                  </select>
                </div>
              </div>

              {/* Número de Cuenta */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Número de Cuenta o Celular Nequi/Daviplata
                </label>
                <input
                  type="text"
                  value={bankForm.numeroCuenta}
                  onChange={(e) => setBankForm({ ...bankForm, numeroCuenta: e.target.value })}
                  placeholder="Ej: 458-921844-12 o 300 123 4567"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre del Titular */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Nombre o Razón Social del Titular
                  </label>
                  <input
                    type="text"
                    value={bankForm.titular}
                    onChange={(e) => setBankForm({ ...bankForm, titular: e.target.value })}
                    placeholder="Ej: Talleres Gráficos del Valle S.A.S."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Cédula o NIT */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Cédula (CC) o NIT del Titular
                  </label>
                  <input
                    type="text"
                    value={bankForm.documentoTitular}
                    onChange={(e) => setBankForm({ ...bankForm, documentoTitular: e.target.value })}
                    placeholder="Ej: 901.458.772-1 o CC 71.345.980"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Teléfono para Confirmación */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Teléfono / WhatsApp para Enviar Comprobante
                  </label>
                  <input
                    type="text"
                    value={bankForm.telefonoTransferencia}
                    onChange={(e) => setBankForm({ ...bankForm, telefonoTransferencia: e.target.value })}
                    placeholder="Ej: +57 312 456 7890"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Email de Notificaciones */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Correo Electrónico Contable (Opcional)
                  </label>
                  <input
                    type="email"
                    value={bankForm.emailNotificaciones}
                    onChange={(e) => setBankForm({ ...bankForm, emailNotificaciones: e.target.value })}
                    placeholder="Ej: pagos@talleresgraficos.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR Y ACTUALIZAR DATOS BANCARIOS</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB 3: PAGOS & COMPROBANTES RECIBIDOS */}
        {activeTab === 'pagos' && (
          <section className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-amber-400" />
                    Historial de Pagos & Comprobantes JPG
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    Registro de todas las transferencias realizadas por la administración con su comprobante oficial y consecutivo.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">Total Transferido:</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {formatCOP(totalPagado)}
                  </span>
                </div>
              </div>

              {providerPayments.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <Receipt className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs font-mono text-slate-400">
                    Aún no se han registrado comprobantes de transferencia para este proveedor.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {providerPayments.map((pago) => (
                    <div
                      key={pago.id}
                      className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 space-y-4 transition-all shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-lg">
                            {pago.reciboConsecutivo}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 block mt-1">
                            Fecha: {pago.fechaPago}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold font-mono text-emerald-400">
                            +{formatCOP(pago.monto)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 block">
                            {pago.metodoPago}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-mono text-slate-300 space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        {pago.referenciaBancaria && (
                          <p>
                            <strong className="text-slate-400">Ref Bancaria:</strong> {pago.referenciaBancaria}
                          </p>
                        )}
                        <p>
                          <strong className="text-slate-400">Registrado por:</strong> {pago.registradoPor}
                        </p>
                        {pago.observaciones && (
                          <p className="text-slate-400">
                            <strong className="text-slate-300">Nota:</strong> {pago.observaciones}
                          </p>
                        )}
                      </div>

                      {/* Voucher Preview & View Button */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <span className="text-[11px] font-mono text-slate-400">Comprobante JPG</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingComprobanteUrl(pago.comprobanteJpgUrl)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ver Comprobante</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 4: RESUMEN DE CUENTA & BALANCE */}
        {activeTab === 'resumen' && (
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2.5 text-amber-400">
                <DollarSign className="w-6 h-6" />
                <h2 className="text-lg font-bold font-mono text-white">
                  Balance Contable & Estado de Liquidación
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Consolidado de costos cotizados por tu taller, pagos recibidos y saldo disponible por cobrar.
              </p>
            </div>

            {/* Metric Big Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">1. Total Cotizado (Servicios)</span>
                <p className="text-xl font-bold font-mono text-white">{formatCOP(totalCotizado)}</p>
                <span className="text-[10px] font-mono text-slate-500 block">Suma de todas las órdenes asignadas</span>
              </div>

              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">2. Total Pagado / Transferido</span>
                <p className="text-xl font-bold font-mono text-sky-400">{formatCOP(totalPagado)}</p>
                <span className="text-[10px] font-mono text-slate-500 block">Con comprobantes JPG verificados</span>
              </div>

              <div className="p-5 bg-amber-950/30 rounded-2xl border border-amber-500/40 space-y-1">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold">3. Saldo Pendiente por Cobrar</span>
                <p className="text-xl font-bold font-mono text-amber-300">{formatCOP(saldoPendiente)}</p>
                <span className="text-[10px] font-mono text-amber-400/70 block">
                  {saldoPendiente === 0 ? '¡Cuenta al día!' : 'Pendiente de liquidación por administración'}
                </span>
              </div>
            </div>

            {/* Quick breakdown table */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase">
                Detalle de Trabajos y Cumplimiento
              </h3>
              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Orden</th>
                      <th className="p-3">Descripción</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Costo Taller</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {providerOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/40">
                        <td className="p-3 text-amber-400 font-bold">{ord.numeroOrden}</td>
                        <td className="p-3 text-slate-200">{ord.descripcionTrabajo}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.estado === 'Terminado'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {ord.estado}
                          </span>
                        </td>
                        <td className="p-3 text-right text-emerald-400 font-bold">
                          {formatCOP(ord.costoProveedor || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL 1: MARCAR TRABAJO COMO TERMINADO (LOGÍSTICA Y NOTIFICACIÓN) */}
      {isFinishModalOpen && selectedOrden && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base font-bold font-mono text-white">
                  Notificar Trabajo Terminado
                </h3>
              </div>
              <button
                onClick={() => setIsFinishModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs font-mono">
              <p className="text-amber-400 font-bold">#{selectedOrden.numeroOrden}</p>
              <p className="text-white font-bold">{selectedOrden.descripcionTrabajo}</p>
              <p className="text-slate-400">Cantidad: {selectedOrden.cantidad} unidades</p>
            </div>

            <div className="space-y-4">
              {/* Costo final comprobado */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Costo Final del Servicio ($ COP)
                </label>
                <input
                  type="number"
                  value={finishFinalCost || ''}
                  onChange={(e) => setFinishFinalCost(parseFloat(e.target.value) || 0)}
                  placeholder="Ej: 680000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Logística de Entrega */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Modalidad de Entrega / Logística
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFinishLogistica('Recoger_Taller')}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all text-left flex flex-col gap-1 ${
                      finishLogistica === 'Recoger_Taller'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-white">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      Para Recoger
                    </span>
                    <span className="text-[10px] text-slate-400">En el taller del proveedor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFinishLogistica('Envio_Direccion')}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all text-left flex flex-col gap-1 ${
                      finishLogistica === 'Envio_Direccion'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-white">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      Enviado a Dirección
                    </span>
                    <span className="text-[10px] text-slate-400">Despacho con guía / mensajería</span>
                  </button>
                </div>
              </div>

              {finishLogistica === 'Envio_Direccion' && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                      Dirección de Envío / Destino
                    </label>
                    <input
                      type="text"
                      value={finishDireccionEnvio}
                      onChange={(e) => setFinishDireccionEnvio(e.target.value)}
                      placeholder="Ej: Carrera 50 # 40-10, Medellín"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                      Transportadora / Número de Guía
                    </label>
                    <input
                      type="text"
                      value={finishGuia}
                      onChange={(e) => setFinishGuia(e.target.value)}
                      placeholder="Ej: Envía / Coordinadora Guía #992144"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Observaciones */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Observaciones de Entrega o Empaque (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={finishObservaciones}
                  onChange={(e) => setFinishObservaciones(e.target.value)}
                  placeholder="Ej: Empacado en cajas de 100 unidades, listas en recepción."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFinishModalOpen(false)}
                className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmFinish}
                className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRMAR & NOTIFICAR AL ADMIN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VISOR DE COMPROBANTE JPG DE TRANSFERENCIA */}
      {viewingComprobanteUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <ImageIcon className="w-5 h-5" />
                <h3 className="text-base font-bold font-mono text-white">
                  Comprobante Oficial de Transferencia (.JPG)
                </h3>
              </div>
              <button
                onClick={() => setViewingComprobanteUrl(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center max-h-[65vh]">
              <img
                src={viewingComprobanteUrl}
                alt="Comprobante Bancario JPG"
                className="w-full h-full object-contain max-h-[60vh]"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] font-mono text-slate-400">
                Formato validado: <strong>JPG Estricto</strong> &bull; Respaldo digital Atziluth
              </span>
              <a
                href={viewingComprobanteUrl}
                download="comprobante_transferencia_atziluth.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Descargar JPG</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProveedorVirtualOffice;
