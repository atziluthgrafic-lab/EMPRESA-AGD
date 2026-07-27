import React, { useState, useEffect } from "react";
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
  FolderOpen
} from "lucide-react";
import { ClientRecord, ClientPayment } from "../types";

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

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
  const [logoPreview, setLogoPreview] = useState<string>("/logo_atziluth.jpg");
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
      const currentRes = await fetch("/api/admin/config");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveStatus("¡Cambios guardados con éxito!");
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

  // Upload Logo Handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setUploadMessage("Cargando imagen del logo...");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: "logo_atziluth.jpg",
            base64Data: base64Data,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const newUrl = result.url || base64Data;
          setLogoPreview(newUrl);
          setUploadMessage("¡Logo subido con éxito a la carpeta de servidor!");
          saveConfig(clients, newUrl);
        } else {
          // Fallback to local base64 display if endpoint rejected
          setLogoPreview(base64Data);
          setUploadMessage("Logo guardado como vista previa.");
          saveConfig(clients, base64Data);
        }
        setUploadingLogo(false);
        setTimeout(() => setUploadMessage(null), 4000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error subiendo logo:", err);
      setUploadMessage("Error al procesar la imagen.");
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

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-950 text-slate-100 min-h-screen rounded-3xl border border-slate-800 my-4 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              Módulo Contable
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
            Gestión integral de clientes, pagos iniciales de $400.000 (hosting/dominio), mensualidades y logo oficial.
          </p>
        </div>

        <button
          onClick={fetchConfig}
          className="self-start md:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-brand-orange" />
          Actualizar Datos
        </button>
      </div>

      {/* RUTA DE CARPETA Y BOTÓN DE CARGA DE IMAGEN DEL LOGO */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl border border-brand-orange/20">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Directorio de Imágenes & Carga de Logo</h2>
              <p className="text-xs text-slate-400">
                Ubicación del servidor para archivos multimedia e imagen oficial de la marca.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center relative">
              <img
                src={logoPreview}
                alt="Logo Atziluth"
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo_atziluth.jpg";
                }}
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Logo Oficial Actual</span>
              <span className="text-xs font-bold text-white font-mono">logo_atziluth.jpg</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Directorio de Archivos info */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-mono uppercase text-brand-orange font-bold flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" /> Carpeta de Almacenamiento en Servidor:
            </span>
            <div className="p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-emerald-400 break-all select-all border border-slate-800">
              /uploads/
            </div>
            <p className="text-[11px] text-slate-400">
              Las imágenes cargadas desde este panel se almacenan en el directorio de servidor <code className="text-slate-200">/uploads/</code> y son servidas estáticamente en producción y local.
            </p>
          </div>

          {/* Upload Button */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-brand-orange font-bold flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Subir Nueva Imagen de Logo:
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Selecciona la imagen en tu equipo para actualizar la marca <code className="text-slate-200">logo_atziluth.jpg</code>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex-1 px-4 py-2.5 bg-gradient-to-r from-brand-orange to-brand-magenta hover:opacity-90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <Upload className="w-4 h-4" />
                {uploadingLogo ? "Subiendo..." : "Cargar Imagen de Logo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
              </label>
            </div>

            {uploadMessage && (
              <p className="text-xs font-mono text-emerald-400">{uploadMessage}</p>
            )}
          </div>
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
              <p class="text-xs text-slate-400">
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
    </div>
  );
}
