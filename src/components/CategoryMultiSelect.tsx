import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Plus, Search, Tag, Layers, CheckSquare, Square } from 'lucide-react';

interface CategoryMultiSelectProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (selected: string[]) => void;
  onAddNewCategory?: (newCategory: string) => void;
  onManageCategories?: () => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  categories,
  selectedCategories,
  onChange,
  onAddNewCategory,
  onManageCategories,
  placeholder = "Seleccionar líneas o especialidades...",
  label,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCatInput, setNewCatInput] = useState("");
  const [showCreateInline, setShowCreateInline] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCreateInline(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) {
        // Prevent 0 selection to ensure provider has at least one
        return;
      }
      onChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onChange([...selectedCategories, cat]);
    }
  };

  const handleSelectAll = () => {
    onChange([...categories]);
  };

  const handleDeselectAll = () => {
    if (categories.length > 0) {
      onChange([categories[0]]);
    }
  };

  const handleRemoveTag = (e: React.MouseEvent, cat: string) => {
    e.stopPropagation();
    if (selectedCategories.length > 1) {
      onChange(selectedCategories.filter((c) => c !== cat));
    }
  };

  const handleCreateNew = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = (newCatInput || searchTerm).trim();
    if (!trimmed) return;

    // Capitalize words
    const formatted = trimmed
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    if (onAddNewCategory) {
      onAddNewCategory(formatted);
    } else {
      if (!categories.includes(formatted)) {
        // Auto-select
        onChange([...selectedCategories, formatted]);
      }
    }

    // Auto-select newly created category if not in selected
    if (!selectedCategories.includes(formatted)) {
      onChange([...selectedCategories, formatted]);
    }

    setNewCatInput("");
    setSearchTerm("");
    setShowCreateInline(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            {label}
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            {selectedCategories.length} de {categories.length} seleccionada(s)
          </span>
        </div>
      )}

      {/* Main Trigger Box */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`min-h-[46px] w-full bg-slate-950 border ${
          isOpen ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-800 hover:border-slate-700'
        } rounded-xl px-3 py-2 cursor-pointer transition-all flex items-center justify-between gap-2 shadow-inner`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 max-h-32 overflow-y-auto custom-scrollbar">
          {selectedCategories.length === 0 ? (
            <span className="text-xs text-slate-500 font-sans">{placeholder}</span>
          ) : (
            selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-medium shadow-sm transition-all"
              >
                <Tag className="w-2.5 h-2.5 text-amber-400" />
                <span>{cat}</span>
                {selectedCategories.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveTag(e, cat)}
                    className="ml-0.5 text-amber-400/80 hover:text-white hover:bg-amber-500/30 rounded p-0.5 transition-colors cursor-pointer"
                    title={`Remover ${cat}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-amber-400 font-bold">
            {selectedCategories.length}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Search & Action Bar */}
          <div className="p-2.5 border-b border-slate-800 bg-slate-950/70 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar o filtrar categorías..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono px-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>Todas</span>
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-slate-400 hover:text-slate-200 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Square className="w-3 h-3" />
                  <span>Mínimo (1)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInline(!showCreateInline)}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Crear Nueva</span>
                </button>
                {onManageCategories && (
                  <>
                    <span className="text-slate-700">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onManageCategories();
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      title="Editar o eliminar categorías existentes"
                    >
                      <Layers className="w-3 h-3" />
                      <span>⚙️ Editar</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Create Inline */}
            {(showCreateInline || (searchTerm.trim().length > 0 && !categories.some(c => c.toLowerCase() === searchTerm.toLowerCase().trim()))) && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCatInput || searchTerm}
                  onChange={(e) => {
                    setNewCatInput(e.target.value);
                    if (searchTerm) setSearchTerm(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateNew();
                    }
                  }}
                  placeholder="Nombre de la nueva especialidad..."
                  className="flex-1 bg-slate-900 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-sans"
                />
                <button
                  type="button"
                  onClick={() => handleCreateNew()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1 shadow cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3 h-3" />
                  <span>Agregar</span>
                </button>
              </div>
            )}
          </div>

          {/* List of categories */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-6 px-4">
                <p className="text-xs text-slate-400 font-mono mb-2">No se encontró "{searchTerm}"</p>
                <button
                  type="button"
                  onClick={() => handleCreateNew()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-xl shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear categoría "{searchTerm}"</span>
                </button>
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <div
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-amber-500 border-amber-400 text-slate-950'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="font-sans text-xs">{cat}</span>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                        Asignada
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer stats */}
          <div className="p-2 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>
              Mostrando <strong className="text-slate-200">{filteredCategories.length}</strong> de <strong className="text-slate-200">{categories.length}</strong>
            </span>
            <div className="flex items-center gap-2">
              {onManageCategories && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onManageCategories();
                  }}
                  className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Layers className="w-3 h-3 text-amber-400" />
                  <span>Editar / Administrar</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold font-sans cursor-pointer transition-colors"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMultiSelect;
