import React, { useState } from 'react';
import { UserPlus, MapPin, Briefcase, FileText, StickyNote, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ClienteAtziluth } from '../types/cliente';
import { ClientRecord, SellerRecord } from '../types';
import { guardarCliente } from '../utils/customerService';

interface CustomerRegistrationFormProps {
  onClientAdded?: (newClient: ClientRecord) => void;
  sellerId?: string;
  sellerName?: string;
  sellers?: SellerRecord[];
  isAdmin?: boolean;
}

export default function CustomerRegistrationForm({
  onClientAdded,
  sellerId,
  sellerName,
  sellers = [],
  isAdmin = false,
}: CustomerRegistrationFormProps) {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tipoNegocio, setTipoNegocio] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [notasAdmin, setNotasAdmin] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState(sellerId || '');
  const [phone, setPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Mandatory Validation
    if (!nombre.trim() || !ubicacion.trim() || !tipoNegocio.trim() || !caracteristicas.trim()) {
      setErrorMsg(
        'Debes diligenciar los 4 campos obligatorios para la ficha del cliente:\n1. Nombre / Razón Social\n2. Ubicación / Municipio\n3. Tipo de Negocio\n4. Características Específicas'
      );
      return;
    }

    const clientId = `CLI-${Date.now().toString().slice(-6)}`;
    const charsList = caracteristicas
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    // Build standard ClienteAtziluth interface object
    const fichaData: ClienteAtziluth = {
      nombre: nombre.trim(),
      ubicacion: ubicacion.trim(),
      tipo_negocio: tipoNegocio.trim(),
      caracteristicas: charsList.length > 0 ? charsList : caracteristicas.trim(),
      notas_admin: notasAdmin.trim() || undefined,
      id: clientId,
      vendedorId: selectedSellerId || sellerId,
      vendedorNombre: sellerName,
      estadoComision: 'Pendiente',
      fechaRegistro: new Date().toISOString(),
    };

    // Persistir usando el servicio de utilidad customerService
    guardarCliente(fichaData);

    let assignedSellerName = sellerName || 'Administración Central Atziluth';
    if (selectedSellerId) {
      const foundS = sellers.find((s) => s.id === selectedSellerId);
      if (foundS) assignedSellerName = foundS.name;
    }

    const fichaJson = JSON.stringify(
      {
        comando: 'AGREGAR_CLIENTE',
        cliente: {
          nombre: fichaData.nombre,
          ubicacion: fichaData.ubicacion,
          tipo_negocio: fichaData.tipo_negocio,
          caracteristicas: fichaData.caracteristicas,
        },
        vendedor_asignado: assignedSellerName,
        notas_admin: fichaData.notas_admin || null,
        fecha_registro: fichaData.fechaRegistro,
      },
      null,
      2
    );

    const clientRecord: ClientRecord = {
      id: clientId,
      clientName: nombre.trim(),
      projectName: `${tipoNegocio.trim()} — ${ubicacion.trim()}`,
      location: ubicacion.trim(),
      businessType: tipoNegocio.trim(),
      specificCharacteristics: caracteristicas.trim(),
      phone: phone.trim() || '3000000000',
      startDate: new Date().toISOString().split('T')[0],
      hostingDomainFee: 350000,
      monthlyFee: 150000,
      billingDay: 5,
      notes: caracteristicas.trim(),
      vendedorId: selectedSellerId || sellerId,
      vendedorNombre: assignedSellerName,
      beneficiarioNombre: assignedSellerName,
      estadoComision: 'Pendiente',
      fichaClienteJson: fichaJson,
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/sales/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientRecord),
      });
    } catch (err) {
      console.warn('Error posting client record to backend API:', err);
    }

    if (onClientAdded) {
      onClientAdded(clientRecord);
    }

    setSuccessMsg(`¡Cliente "${nombre.trim()}" creado e integrado con éxito!`);
    
    // Reset form
    setNombre('');
    setUbicacion('');
    setTipoNegocio('');
    setCaracteristicas('');
    setNotasAdmin('');
    setPhone('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Generar Nuevo Cliente (ClienteAtziluth)
            </h3>
            <p className="text-xs text-slate-400">
              Ficha estandarizada para registro y asignación de comisiones.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold">
          ESTÁNDAR_JSON_ACTIVO
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="whitespace-pre-line">{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
            1. Nombre / Razón Social del Cliente *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Glamping El Peñol / María Restrepo"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
              2. Ubicación / Municipio *
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ej: Guatapé, Oriente Antioqueño"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
              3. Tipo de Negocio / Categoría *
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={tipoNegocio}
                onChange={(e) => setTipoNegocio(e.target.value)}
                placeholder="Ej: Hotelería / Restaurante / Comercio"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
            4. Características Específicas del Proyecto *
          </label>
          <div className="relative">
            <FileText className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <textarea
              value={caracteristicas}
              onChange={(e) => setCaracteristicas(e.target.value)}
              rows={3}
              placeholder="Ej: Requiere motor de reservas bilingüe, pasarela de pagos Wompi y código QR para carta digital."
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>
        </div>

        {isAdmin && sellers.length > 0 && (
          <div>
            <label className="block text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
              Vendedor Asignado
            </label>
            <select
              value={selectedSellerId}
              onChange={(e) => setSelectedSellerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="">🏛️ Administración Central (Sin Vendedor Específico)</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  👤 {s.name} (@{s.username}) — Zona: {s.zone || 'General'}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <StickyNote className="w-3 h-3 text-amber-400" /> Notas del Administrador (Opcional)
            </span>
            <span className="text-[10px] text-slate-500 lowercase font-normal">(solo admin)</span>
          </label>
          <textarea
            value={notasAdmin}
            onChange={(e) => setNotasAdmin(e.target.value)}
            rows={2}
            placeholder="Anotaciones administrativas, términos especiales o comisiones pactadas..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Generar y Registrar Ficha de Cliente</span>
        </button>
      </form>
    </div>
  );
}
