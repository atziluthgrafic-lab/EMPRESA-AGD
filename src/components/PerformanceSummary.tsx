import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Award,
  Calendar,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Receipt,
  Users,
  ShieldCheck,
  Building2,
  X,
  FileText,
  Percent,
  BarChart3
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { AuthSession, SellerRecord, OrderReceiptRecord } from "./AdminDashboard";
import { ClientRecord } from "../types";

interface PerformanceSummaryProps {
  authSession: AuthSession;
  sellers: SellerRecord[];
  orders: OrderReceiptRecord[];
  clients?: ClientRecord[];
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const MONTH_SHORT = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

export default function PerformanceSummary({
  authSession,
  sellers,
  orders,
  clients = []
}: PerformanceSummaryProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Find active seller details
  const activeSeller = sellers.find(
    (s) => s.id === authSession.sellerId || s.username === authSession.username
  ) || authSession.sellerRecord || {
    id: authSession.sellerId || "sel_1",
    name: authSession.name,
    username: authSession.username,
    zone: "Valle de Aburrá Norte",
    phone: "3000000000",
    commissionRate: 5.0,
    supervisor: "Estivenson Navarro (Director Comercial)"
  };

  const commRate = activeSeller.commissionRate || 5.0;

  // Filter orders for this seller
  const myOrders = (orders || []).filter(
    (o) =>
      o.sellerId === authSession.sellerId ||
      o.sellerUsername === authSession.username ||
      o.sellerName === authSession.name
  );

  // Filter clients for this seller
  const myClients = (clients || []).filter((c) => {
    return (
      c.vendedorId === authSession.sellerId ||
      c.createdBySellerId === authSession.sellerId ||
      c.vendedorNombre === authSession.name
    );
  });

  // Calculate stats for current year
  const ordersThisYear = myOrders.filter((o) => {
    if (!o.date) return true;
    return new Date(o.date).getFullYear() === selectedYear;
  });

  const totalVentas = ordersThisYear.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalAbonado = ordersThisYear.reduce((acc, o) => acc + (o.paidAmount || 0), 0);
  const totalPendiente = ordersThisYear.reduce((acc, o) => acc + (o.balance || 0), 0);
  const totalComisionGenerada = totalVentas * (commRate / 100);
  const totalComisionCobrada = totalAbonado * (commRate / 100);
  const totalPedidos = ordersThisYear.length;
  const ticketPromedio = totalPedidos > 0 ? Math.round(totalVentas / totalPedidos) : 0;

  // Build 12-month aggregated data for Recharts
  const monthlyChartData = MONTH_SHORT.map((monthLabel, index) => {
    const monthNum = index; // 0-indexed
    const monthOrders = ordersThisYear.filter((o) => {
      if (!o.date) return false;
      const d = new Date(o.date);
      return d.getMonth() === monthNum;
    });

    const monthVentas = monthOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const monthAbonos = monthOrders.reduce((acc, o) => acc + (o.paidAmount || 0), 0);
    const monthComision = Math.round(monthVentas * (commRate / 100));
    const monthComisionEfectiva = Math.round(monthAbonos * (commRate / 100));

    return {
      mes: monthLabel,
      mesCompleto: MONTH_NAMES[index],
      ventas: monthVentas,
      abonos: monthAbonos,
      comisionTotal: monthComision,
      comisionEfectiva: monthComisionEfectiva,
      pedidos: monthOrders.length
    };
  });

  // CSV Export Function
  const handleExportCSV = () => {
    const headers = ["Mes", "Pedidos", "Ventas Totales ($)", "Abonos Cobrados ($)", "Saldo Pendiente ($)", "Comision Generada ($)"];
    const rows = monthlyChartData.map((d) => [
      d.mesCompleto,
      d.pedidos,
      d.ventas,
      d.abonos,
      d.ventas - d.abonos,
      d.comisionTotal
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Rendimiento_${activeSeller.username}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* HEADER RENDIMIENTO */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded-full font-bold uppercase">
              Módulo de Métricas
            </span>
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono rounded-full font-bold">
              Tasa de Comisión: {commRate}%
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Resumen de Rendimiento Comercial</span>
          </h2>
          <p className="text-xs text-slate-300">
            Análisis consolidado de ventas, recaudo de abonos y liquidación de comisiones mensuales para <strong className="text-emerald-400">{activeSeller.name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Año */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-white text-xs font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value={2026} className="bg-slate-900">Año 2026</option>
              <option value={2025} className="bg-slate-900">Año 2025</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Ficha Consolidada (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ventas Totales */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Ventas Totales</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatCOP(totalVentas)}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{totalPedidos} pedidos</span> en {selectedYear}
          </p>
        </div>

        {/* Card 2: Comisiones Generadas */}
        <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl space-y-2 relative overflow-hidden group hover:border-emerald-400 transition-all bg-gradient-to-br from-emerald-950/20 to-slate-900">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-mono font-bold">
            <span>Comisiones Generadas</span>
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formatCOP(totalComisionGenerada)}
          </div>
          <p className="text-[11px] text-emerald-300/80">
            Calculado con tasa contractual de <strong className="text-white">{commRate}%</strong>
          </p>
        </div>

        {/* Card 3: Comisiones por Recaudo Efectivo */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Comisión sobre Abonos</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-300 font-mono">
            {formatCOP(totalComisionCobrada)}
          </div>
          <p className="text-[11px] text-slate-400">
            Basado en <strong className="text-white">{formatCOP(totalAbonado)}</strong> recaudados
          </p>
        </div>

        {/* Card 4: Ticket Promedio */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2 relative overflow-hidden group hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Ticket Promedio / Cartera</span>
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatCOP(ticketPromedio)}
          </div>
          <p className="text-[11px] text-slate-400">
            <strong className="text-teal-400">{myClients.length} clientes</strong> en cartera exclusiva
          </p>
        </div>
      </div>

      {/* GRÁFICOS RECHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Ventas Totales vs Abonos Recaudados */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Ventas Totales vs Recaudo de Abonos ($)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Comparativo mensual de monto bruto facturado vs efectivo cobrado.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px"
                  }}
                  formatter={(value: any) => [formatCOP(Number(value)), ""]}
                  labelFormatter={(label) => `Mes: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="ventas" name="Ventas Facturadas" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="abonos" name="Abonos Recaudados" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Comisiones Ganadas por Mes */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Evolución Mensual de Comisiones ($)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Comisión bruta total vs Comisión sobre dinero efectivamente recaudado.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComision" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorEfectiva" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px"
                  }}
                  formatter={(value: any) => [formatCOP(Number(value)), ""]}
                  labelFormatter={(label) => `Mes: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="comisionTotal"
                  name={`Comisión Bruta (${commRate}%)`}
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorComision)"
                />
                <Area
                  type="monotone"
                  dataKey="comisionEfectiva"
                  name="Comisión s/ Abonos"
                  stroke="#818cf8"
                  fillOpacity={1}
                  fill="url(#colorEfectiva)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLA DE DETALLE MENSUAL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Desglose Cuantitativo de Liquidación Mensual ({selectedYear})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Tasa aplicable: <strong className="text-emerald-400">{commRate}%</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase bg-slate-950/50">
                <th className="py-3 px-4">Mes</th>
                <th className="py-3 px-4 text-center">N° Pedidos</th>
                <th className="py-3 px-4 text-right">Ventas Totales</th>
                <th className="py-3 px-4 text-right">Abonos Cobrados</th>
                <th className="py-3 px-4 text-right">Saldo Pendiente</th>
                <th className="py-3 px-4 text-right text-emerald-400">Comisión Generada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {monthlyChartData.map((row) => (
                <tr key={row.mes} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {row.mesCompleto}
                  </td>
                  <td className="py-3 px-4 text-center font-bold">{row.pedidos}</td>
                  <td className="py-3 px-4 text-right font-bold text-white">{formatCOP(row.ventas)}</td>
                  <td className="py-3 px-4 text-right text-indigo-300">{formatCOP(row.abonos)}</td>
                  <td className="py-3 px-4 text-right text-amber-300">{formatCOP(row.ventas - row.abonos)}</td>
                  <td className="py-3 px-4 text-right font-black text-emerald-400 bg-emerald-950/20">
                    {formatCOP(row.comisionTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-emerald-500/40 bg-slate-950 font-bold text-sm text-white">
                <td className="py-3.5 px-4 font-display">TOTAL ACUMULADO</td>
                <td className="py-3.5 px-4 text-center">{totalPedidos}</td>
                <td className="py-3.5 px-4 text-right text-emerald-400">{formatCOP(totalVentas)}</td>
                <td className="py-3.5 px-4 text-right text-indigo-300">{formatCOP(totalAbonado)}</td>
                <td className="py-3.5 px-4 text-right text-amber-300">{formatCOP(totalPendiente)}</td>
                <td className="py-3.5 px-4 text-right text-emerald-300 font-black bg-emerald-950/40">
                  {formatCOP(totalComisionGenerada)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MODAL DE FICHA CONSOLIDADA (PDF / REPORTE OFICIAL) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Ficha Consolidada de Rendimiento Comercial
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Documento Oficial de Liquidación de Comisiones & Ventas {selectedYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Container */}
            <div id="ficha-consolidada-printable" className="space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              {/* Header Empresa */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xl font-black text-white font-display flex items-center gap-2">
                    <span className="text-emerald-400">PUBLIIMPRESOS</span> METROPOLITANOS
                  </div>
                  <p className="text-[11px] text-slate-400">
                    NIT: 900.852.147-3 • Medellín, Antioquia • PBX: (604) 444-8900
                  </p>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full font-bold">
                    REPORTE OFICIAL #{selectedYear}-{activeSeller.username.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Fecha de Emisión: {new Date().toLocaleDateString("es-CO")}
                  </p>
                </div>
              </div>

              {/* Informacion Vendedor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">ASESOR COMERCIAL / VENDEDOR:</span>
                  <strong className="text-white text-sm">{activeSeller.name}</strong>
                  <p className="text-slate-300">Usuario: @{activeSeller.username}</p>
                  <p className="text-slate-300">Teléfono: {activeSeller.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ZONA Y SUPERVISIÓN:</span>
                  <strong className="text-emerald-400">{activeSeller.zone || "Medellín / Antioquia"}</strong>
                  <p className="text-slate-300">Director: Estivenson Navarro</p>
                  <p className="text-slate-300">Tasa Comisión: <strong className="text-emerald-300">{commRate}%</strong></p>
                </div>
              </div>

              {/* Matriz Resumen Financiero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Ventas Totales</span>
                  <strong className="text-sm font-mono text-white">{formatCOP(totalVentas)}</strong>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Recaudo Abonos</span>
                  <strong className="text-sm font-mono text-indigo-300">{formatCOP(totalAbonado)}</strong>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Saldo Cartera</span>
                  <strong className="text-sm font-mono text-amber-300">{formatCOP(totalPendiente)}</strong>
                </div>
                <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-300 uppercase font-mono block font-bold">Comisión Total</span>
                  <strong className="text-base font-mono text-emerald-400 font-black">{formatCOP(totalComisionGenerada)}</strong>
                </div>
              </div>

              {/* Tabla Resumen Ficha */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Consolidado Mensual de Operaciones ({selectedYear})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] font-mono border border-slate-800">
                    <thead className="bg-slate-900 text-slate-400">
                      <tr>
                        <th className="p-2 border-b border-slate-800">Mes</th>
                        <th className="p-2 border-b border-slate-800 text-center">Pedidos</th>
                        <th className="p-2 border-b border-slate-800 text-right">Ventas ($)</th>
                        <th className="p-2 border-b border-slate-800 text-right">Comisión ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {monthlyChartData.map((m) => (
                        <tr key={m.mes}>
                          <td className="p-2 font-bold text-white">{m.mesCompleto}</td>
                          <td className="p-2 text-center">{m.pedidos}</td>
                          <td className="p-2 text-right">{formatCOP(m.ventas)}</td>
                          <td className="p-2 text-right font-bold text-emerald-400">{formatCOP(m.comisionTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Firmas de Certificación */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-center text-xs font-mono text-slate-400">
                <div className="space-y-12">
                  <div className="border-b border-slate-700 pb-1"></div>
                  <p className="font-bold text-white">{activeSeller.name}</p>
                  <p className="text-[10px]">Firma Asesor Comercial</p>
                </div>
                <div className="space-y-12">
                  <div className="border-b border-slate-700 pb-1">
                    <span className="text-[10px] text-emerald-400 italic">Estivenson Navarro (Aprobado)</span>
                  </div>
                  <p className="font-bold text-white">Director Comercial & Auditoría</p>
                  <p className="text-[10px]">Aprobación Liquidación Contable</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
