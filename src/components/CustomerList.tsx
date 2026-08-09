import React, { useState } from 'react';
import { Users, Filter, Search, MapPin, Briefcase, FileText, StickyNote, Code2, Check, Edit3, X, ShieldAlert } from 'lucide-react';
import { ClientRecord, SellerRecord } from '../types';
import { actualizarNotasAdminCliente } from '../utils/customerService';

interface CustomerListProps {
  clients: ClientRecord[];
  sellers?: SellerRecord[];
  isAdmin?: boolean;
  onUpdateAdminNotes?: (clientId: string, newNotes: string) => void;
}

export default function CustomerList({
  clients = [],
  sellers = [],
  isAdmin = false,
  onUpdateAdminNotes,
}: CustomerListProps) {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedSeller, setSelectedSeller] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Editing notes state
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  // Modal for raw JSON view
  const [viewingJsonClient, setViewingJsonClient] = useState<ClientRecord | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Extract unique zones / subregions
  const availableZones = Array.from(
    new Set(
      clients
        .map((c) => c.location || c.ubicacion?.zone || c.municipality || '')
        .filter((z) => z.trim().length > 0)
    )
  );

  // Filter logic
  const filteredClients = clients.filter((client) => {
    // Zone filter
    if (selectedZone !== 'all') {
      const clientZone = (client.location || client.ubicacion?.zone || client.municipality || '').toLowerCase();
      if (!clientZone.includes(selectedZone.toLowerCase())) {
        return false;
      }
    }

    // Seller filter
    if (selectedSeller !== 'all') {
      if (client.vendedorId !== selectedSeller && client.vendedorNombre !== selectedSeller) {
        return false;
      }
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = client.clientName?.toLowerCase().includes(q);
      const matchProject = client.projectName?.toLowerCase().includes(q);
      const matchLoc = (client.location || client.municipality || '').toLowerCase().includes(q);
      const matchBiz = (client.businessType || '').toLowerCase().includes(q);
      const matchChars = (client.specificCharacteristics || client.notes || '').toLowerCase().includes(q);
      if (!matchName && !matchProject && !matchLoc && !matchBiz && !matchChars) {
        return false;
      }
    }

    return true;
  });

  const handleSaveNotes = (clientId: string) => {
    actualizarNotasAdminCliente(clientId, tempNotes);
    if (onUpdateAdminNotes) {
      onUpdateAdminNotes(clientId, tempNotes);
    }
    setEditingClientId(null);
  };

  const handleCopyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Directorio de Fichas de Clientes (Atziluth)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualización estandarizada de fichas JSON con filtrado geográfico por zona y gestión de notas administrativas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl font-bold">
            Total: {filteredClients.length} cliente(s)
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, tipo, ciudad..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Filter Zone */}
        <div className="relative">
          <Filter className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="all">📍 Todas las Zonas / Municipios</option>
            {availableZones.map((z, idx) => (
              <option key={idx} value={z}>
                📍 {z}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Vendor */}
        <div>
          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="all">👤 Todos los Vendedores</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                👤 {s.name} (@{s.username})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
          <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-mono">No se encontraron clientes registrados con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => {
            const parsedJson = client.fichaClienteJson ? JSON.parse(client.fichaClienteJson) : null;
            const isEditingThis = editingClientId === client.id;

            return (
              <div
                key={client.id}
                className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                        {client.clientName}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {client.projectName || 'Sin nombre de proyecto específico'}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
                      ID: {client.id}
                    </span>
                  </div>

                  {/* Fields Breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> Ubicación
                      </span>
                      <span className="text-slate-200 font-medium">
                        {client.location || client.municipality || 'No especificada'}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-blue-400" /> Tipo Negocio
                      </span>
                      <span className="text-slate-200 font-medium">
                        {client.businessType || 'General'}
                      </span>
                    </div>
                  </div>

                  {/* Características */}
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/50 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block flex items-center gap-1">
                      <FileText className="w-3 h-3 text-amber-400" /> Características Específicas
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{client.specificCharacteristics || client.notes || 'Sin características especificadas'}"
                    </p>
                  </div>

                  {/* Vendor Tag */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/30 px-2.5 py-1.5 rounded-lg border border-slate-800/30">
                    <span>Vendedor: <strong className="text-indigo-300">{client.vendedorNombre || 'Atziluth Central'}</strong></span>
                    <span className="text-emerald-400 font-bold">{client.estadoComision || 'Pendiente'}</span>
                  </div>

                  {/* Notas Admin Section */}
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1">
                        <StickyNote className="w-3 h-3" /> Notas del Administrador (notas_admin)
                      </span>

                      {isAdmin && !isEditingThis && (
                        <button
                          onClick={() => {
                            setEditingClientId(client.id);
                            setTempNotes(client.notasAdmin || client.notes || '');
                          }}
                          className="text-[10px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer underline"
                        >
                          <Edit3 className="w-3 h-3" /> Editar
                        </button>
                      )}
                    </div>

                    {isEditingThis ? (
                      <div className="space-y-2 mt-1">
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-900 border border-amber-500/40 rounded p-2 text-xs text-slate-200 focus:outline-none"
                        ></textarea>
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingClientId(null)}
                            className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3 h-3" /> Cancelar
                          </button>
                          <button
                            onClick={() => handleSaveNotes(client.id)}
                            className="px-2.5 py-1 bg-amber-600 text-white rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-200/90 italic">
                        {client.notasAdmin || parsedJson?.notas_admin || 'Sin notas administrativas registradas.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer JSON Inspector button */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">Integridad de datos: OK</span>
                  <button
                    onClick={() => setViewingJsonClient(client)}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 cursor-pointer"
                  >
                    <Code2 className="w-3 h-3" /> Ver Ficha JSON
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RAW JSON MODAL */}
      {viewingJsonClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Ficha JSON Estandarizada — {viewingJsonClient.clientName}
                </h3>
              </div>
              <button
                onClick={() => setViewingJsonClient(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Estructura JSON generada bajo la interfaz <strong className="text-indigo-300">ClienteAtziluth</strong> para asegurar el cumplimiento de comisiones.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-80 text-xs font-mono text-emerald-400">
              <pre>
                {viewingJsonClient.fichaClienteJson
                  ? viewingJsonClient.fichaClienteJson
                  : JSON.stringify(
                      {
                        comando: 'AGREGAR_CLIENTE',
                        cliente: {
                          nombre: viewingJsonClient.clientName,
                          ubicacion: viewingJsonClient.location,
                          tipo_negocio: viewingJsonClient.businessType,
                          caracteristicas: viewingJsonClient.specificCharacteristics,
                        },
                        vendedor_asignado: viewingJsonClient.vendedorNombre || 'Atziluth Central',
                        notas_admin: viewingJsonClient.notasAdmin || null,
                        fecha_registro: viewingJsonClient.createdAt,
                      },
                      null,
                      2
                    )}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-500 font-mono">
                Atziluth CRM System v2.5
              </span>
              <button
                onClick={() =>
                  handleCopyJson(
                    viewingJsonClient.fichaClienteJson ||
                      JSON.stringify(viewingJsonClient, null, 2)
                  )
                }
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" /> ¡Copiado al Portapapeles!
                  </>
                ) : (
                  <>
                    <Code2 className="w-3.5 h-3.5" /> Copiar JSON
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
