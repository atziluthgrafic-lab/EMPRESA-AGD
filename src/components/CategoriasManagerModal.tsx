import React, { useState } from 'react';
import { 
  X, Plus, Edit2, Trash2, Check, AlertTriangle, Layers, 
  RotateCcw, Search, Sparkles, Building2
} from 'lucide-react';
import { DEFAULT_PROVEEDORES_CATEGORIAS } from '../types/proveedor';
import { ProveedorRecord } from '../types/proveedor';

interface CategoriasManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  proveedores: ProveedorRecord[];
  onSaveCategories: (newList: string[]) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryToDelete: string) => void;
  onResetDefaults: () => void;
}

export const CategoriasManagerModal: React.FC<CategoriasManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  proveedores,
  onSaveCategories,
  onRenameCategory,
  onDeleteCategory,
  onResetDefaults,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [editingCatName, setEditingCatName] = useState<string | null>(null);
  const [editInputVal, setEditInputVal] = useState("");
  const [deletingCatName, setDeletingCatName] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Helper to count providers by category
  const getProviderCountForCat = (cat: string) => {
    return proveedores.filter(p => {
      const cats = Array.isArray(p.categorias) && p.categorias.length > 0
        ? p.categorias
        : (p.categoria ? [p.categoria] : []);
      return cats.includes(cat);
    }).length;
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      alert("Ingrese el nombre de la nueva categoría o línea de producción.");
      return;
    }

    // Capitalize words
    const formatted = trimmed
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    if (categories.some(c => c.toLowerCase() === formatted.toLowerCase())) {
      alert(`La categoría "${formatted}" ya existe en el sistema.`);
      return;
    }

    const updated = [...categories, formatted];
    onSaveCategories(updated);
    setNewCatName("");
    showFeedback(`✓ Categoría "${formatted}" creada exitosamente.`);
  };

  const handleStartEdit = (cat: string) => {
    setEditingCatName(cat);
    setEditInputVal(cat);
  };

  const handleSaveEdit = (oldName: string) => {
    const trimmed = editInputVal.trim();
    if (!trimmed) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }

    const formatted = trimmed
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    if (formatted.toLowerCase() !== oldName.toLowerCase() && categories.some(c => c.toLowerCase() === formatted.toLowerCase())) {
      alert(`Ya existe otra categoría con el nombre "${formatted}".`);
      return;
    }

    if (formatted !== oldName) {
      onRenameCategory(oldName, formatted);
      showFeedback(`✓ Categoría renombrada a "${formatted}".`);
    }
    setEditingCatName(null);
    setEditInputVal("");
  };

  const handleConfirmDelete = (cat: string) => {
    onDeleteCategory(cat);
    setDeletingCatName(null);
    showFeedback(`✓ Categoría "${cat}" eliminada.`);
  };

  const filteredCategories = categories.filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Gestión de Líneas & Categorías de Producción
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Crea, edita o elimina tipos de especialidades gráficas para los talleres
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-5 py-2 text-xs font-mono text-emerald-300 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* Create New Category Form */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-3">
            <label className="block text-xs font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-400" />
              Crear Nueva Categoría o Línea Gráfica
            </label>
            <form onSubmit={handleCreateCategory} className="flex items-center gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ej: Cajas Plegadizas, Carnets PVC, Señalética, DTF Textil..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer whitespace-nowrap border border-amber-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Categoría</span>
              </button>
            </form>
          </div>

          {/* Search & Stats Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar categorías..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs font-mono text-slate-400">
                Total: <strong className="text-white">{categories.length}</strong> tipos
              </span>
              <button
                type="button"
                onClick={onResetDefaults}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Restaurar lista de categorías predeterminadas del sistema"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Predeterminadas</span>
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">No se encontraron categorías que coincidan.</p>
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isEditing = editingCatName === cat;
                const isDeleting = deletingCatName === cat;
                const provCount = getProviderCountForCat(cat);

                if (isDeleting) {
                  return (
                    <div
                      key={cat}
                      className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150"
                    >
                      <div className="flex items-center gap-2 text-xs text-rose-200">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          ¿Eliminar <strong>"{cat}"</strong>?{' '}
                          {provCount > 0 ? (
                            <span className="text-rose-300 underline font-mono">
                              ({provCount} taller(es) la tienen asignada)
                            </span>
                          ) : (
                            '(Sin talleres asignados)'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(cat)}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Sí, Eliminar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCatName(null)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={cat}
                    className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-3 transition-all"
                  >
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editInputVal}
                          onChange={(e) => setEditInputVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(cat);
                            if (e.key === 'Escape') setEditingCatName(null);
                          }}
                          className="flex-1 bg-slate-900 border border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-sans"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat)}
                          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer"
                          title="Guardar cambio"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCatName(null)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl cursor-pointer"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="text-xs font-medium text-slate-200 font-sans">
                            {cat}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              provCount > 0
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                          >
                            <Building2 className="w-3 h-3" />
                            {provCount} {provCount === 1 ? 'taller' : 'talleres'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Editar nombre de categoría"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCatName(cat)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar categoría"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-mono">
            Las categorías modificadas se sincronizan en tiempo real con el selector de asignación.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriasManagerModal;
