import React, { useState } from "react";
import { SUBREGIONS, MUNICIPALITIES } from "../data/antioquia";
import { SubregionId, Subregion } from "../types";
import { MapPin, Info, ArrowUpRight, Search, Activity, CornerDownRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InteractiveMapProps {
  selectedSubregion: SubregionId | null;
  onSelectSubregion: (subregion: SubregionId | null) => void;
  selectedMunicipality: string | null;
  onSelectMunicipality: (municipality: string | null) => void;
}

export default function InteractiveMap({
  selectedSubregion,
  onSelectSubregion,
  selectedMunicipality,
  onSelectMunicipality,
}: InteractiveMapProps) {
  const [hoveredSubregion, setHoveredSubregion] = useState<SubregionId | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const activeSub = SUBREGIONS.find((s) => s.id === (selectedSubregion || hoveredSubregion));

  // Filter municipalities belonging to the selected subregion
  const filteredMunicipalities = selectedSubregion
    ? MUNICIPALITIES.filter((m) => m.subregion === selectedSubregion)
    : [];

  // Search through all 125 municipalities
  const searchedMunicipalities = searchTerm.trim()
    ? MUNICIPALITIES.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          SUBREGIONS.find((s) => s.id === m.subregion)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ).slice(0, 8)
    : [];

  // Geographic SVG Path estimates for a stunning styled cyber-style map of Antioquia
  // Aligned perfectly to relative locations:
  // - Urabá: North-West
  // - Occidente: Mid-West
  // - Suroeste: South-West
  // - Valle de Aburrá: Center
  // - Oriente: South-East
  // - Norte: Mid-North
  // - Bajo Cauca: Far-North-East
  // - Nordeste: East/North-East
  // - Magdalena Medio: Far-East
  const subregionPaths: { id: SubregionId; d: string; labelX: number; labelY: number }[] = [
    {
      id: "uraba",
      d: "M 40,80 L 100,50 L 130,100 L 110,170 L 60,200 L 30,140 Z",
      labelX: 75,
      labelY: 120,
    },
    {
      id: "occidente",
      d: "M 60,200 L 110,170 L 140,210 L 120,280 L 50,260 Z",
      labelX: 95,
      labelY: 235,
    },
    {
      id: "suroeste",
      d: "M 50,260 L 120,280 L 145,340 L 100,410 L 60,350 Z",
      labelX: 95,
      labelY: 335,
    },
    {
      id: "norte",
      d: "M 130,100 L 190,70 L 220,135 L 180,185 L 140,160 Z",
      labelX: 175,
      labelY: 125,
    },
    {
      id: "valle_de_aburra",
      d: "M 140,160 L 180,185 L 190,230 L 150,250 L 140,210 Z",
      labelX: 160,
      labelY: 205,
    },
    {
      id: "oriente",
      d: "M 150,250 L 190,230 L 250,260 L 240,350 L 175,340 Z",
      labelX: 200,
      labelY: 295,
    },
    {
      id: "bajo_cauca",
      d: "M 190,70 L 280,30 L 320,80 L 260,110 L 220,95 Z",
      labelX: 255,
      labelY: 70,
    },
    {
      id: "nordeste",
      d: "M 220,135 L 260,110 L 310,160 L 270,235 L 180,185 Z",
      labelX: 250,
      labelY: 175,
    },
    {
      id: "magdalena_medio",
      d: "M 270,235 L 310,160 L 370,200 L 340,310 L 250,260 Z",
      labelX: 310,
      labelY: 240,
    },
  ];

  const handleSubregionClick = (id: SubregionId) => {
    if (selectedSubregion === id) {
      onSelectSubregion(null); // Deselect
      onSelectMunicipality(null);
    } else {
      onSelectSubregion(id);
      onSelectMunicipality(null);
    }
  };

  const handleSearchSelect = (m: any) => {
    onSelectSubregion(m.subregion);
    onSelectMunicipality(m.name);
    setSearchTerm("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="mapa-seccion">
      {/* Sidebar: Subregion selection List and info box */}
      <div className="lg:col-span-4 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
            Mapa Interactivo de Antioquia
          </h3>
          <p className="text-neutral-300 text-sm mt-1">
            Explora las 9 subregiones y los 125 municipios. Selecciona un área para ver estrategias digitales personalizadas.
          </p>
        </div>

        {/* Municipality Global Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar entre los 125 municipios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#030e2f]/80 border border-blue-900/60 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-white"
            >
              Limpiar
            </button>
          )}

          {/* Autocomplete Dropdown Search Results */}
          <AnimatePresence>
            {searchTerm.trim() && searchedMunicipalities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-10 mt-1 w-full bg-[#030e2f] border border-blue-900/60 rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-blue-950"
              >
                {searchedMunicipalities.map((m) => {
                  const subMeta = SUBREGIONS.find((s) => s.id === m.subregion);
                  return (
                    <button
                      key={m.name}
                      onClick={() => handleSearchSelect(m)}
                      className="w-full text-left px-4 py-2 hover:bg-[#051446] flex items-center justify-between text-sm transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-white">{m.name}</span>
                        <span className="text-xs text-neutral-400 block">Subregión: {subMeta?.name}</span>
                      </div>
                      <span className="text-xs text-yellow-400 bg-yellow-950/40 px-2.5 py-0.5 rounded-full border border-yellow-800/50 font-mono font-medium">
                        Seleccionar
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 9 Subregions Interactive Cards */}
        <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-1">
          {SUBREGIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSubregionClick(s.id)}
              onMouseEnter={() => setHoveredSubregion(s.id)}
              onMouseLeave={() => setHoveredSubregion(null)}
              className={`p-3 rounded-lg text-left border transition-all relative overflow-hidden group cursor-pointer ${
                selectedSubregion === s.id
                  ? "bg-[#030e2f] border-yellow-400 text-white shadow-lg shadow-yellow-950/20"
                  : "bg-[#020921] border-blue-950 text-neutral-400 hover:border-blue-900 hover:text-white"
              }`}
            >
              {/* Highlight bar */}
              <div
                className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${s.color} transition-opacity duration-300 ${
                  selectedSubregion === s.id ? "opacity-100" : "opacity-30 group-hover:opacity-100"
                }`}
              />
              <span className="font-semibold text-xs block text-white">{s.name}</span>
              <span className="text-[10px] text-neutral-500 block truncate mt-0.5">
                Cap: {s.capital} • {s.municipalitiesCount} mun.
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG Department Vector Map */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#020a22]/40 border border-blue-900/40 p-6 rounded-2xl relative min-h-[400px]">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,37,100,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,37,100,0.15)_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl pointer-events-none" />

        {/* Floating Compass/Stats indicator */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#030e2f]/90 border border-blue-900/60 px-3 py-1.5 rounded-full text-[10px] text-neutral-400 backdrop-blur">
          <Activity className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>DEPARTAMENTO DE ANTIOQUIA</span>
        </div>

        {/* The Vector map */}
        <svg
          viewBox="0 0 400 450"
          className="w-full max-w-[360px] h-auto drop-shadow-[0_0_15px_rgba(252,209,22,0.04)] relative z-10 cursor-pointer"
        >
          {subregionPaths.map((sp) => {
            const meta = SUBREGIONS.find((s) => s.id === sp.id)!;
            const isSelected = selectedSubregion === sp.id;
            const isHovered = hoveredSubregion === sp.id;

            return (
              <g
                key={sp.id}
                onClick={() => handleSubregionClick(sp.id)}
                onMouseEnter={() => setHoveredSubregion(sp.id)}
                onMouseLeave={() => setHoveredSubregion(null)}
                className="group/path transition-all duration-300"
              >
                {/* Visual Path of the Subregion */}
                <path
                  d={sp.d}
                  className={`transition-all duration-300 stroke-[1.5] ${
                    isSelected
                      ? "fill-[#009e5a]/15 stroke-yellow-400 drop-shadow-[0_0_8px_rgba(252,209,22,0.3)]"
                      : isHovered
                      ? "fill-[#030e2f] stroke-emerald-500 scale-[1.01]"
                      : "fill-[#020921]/90 stroke-blue-900/40 group-hover/path:stroke-blue-800"
                  }`}
                />

                {/* Subregion text label on map */}
                <text
                  x={sp.labelX}
                  y={sp.labelY}
                  textAnchor="middle"
                  className={`text-[8px] font-mono tracking-wider font-bold select-none pointer-events-none transition-colors duration-300 ${
                    isSelected ? "fill-yellow-400" : isHovered ? "fill-white" : "fill-neutral-500"
                  }`}
                >
                  {meta.name.split(" ").pop()}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="text-[10px] text-neutral-500 text-center mt-4 z-10">
          Usa los controles o pulsa directamente sobre el vector para interactuar
        </div>
      </div>

      {/* Info & Details Display for Active Subregion */}
      <div className="lg:col-span-3 space-y-4">
        <AnimatePresence mode="wait">
          {activeSub ? (
            <motion.div
              key={activeSub.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-[#030e2f]/50 border border-blue-900/40 p-5 rounded-2xl space-y-4 shadow-xl"
            >
              {/* Colored tag */}
              <div className={`text-xs font-mono font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${activeSub.color}`}>
                Subregión {activeSub.name}
              </div>

              <div>
                <span className="text-xs text-neutral-400 block">Cabecera de Zona</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  {activeSub.capital}
                </span>
              </div>

              <p className="text-neutral-300 text-xs leading-relaxed">
                {activeSub.description}
              </p>

              <div className="pt-2 border-t border-blue-900/30">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                  Mercados Clave Ad-Aptados
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSub.highlightedSectors.map((sector) => (
                    <span
                      key={sector}
                      className="text-[10px] font-mono text-yellow-400 bg-yellow-950/20 border border-yellow-800/40 px-2 py-0.5 rounded"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-blue-900/30 bg-[#02071a]/45 -mx-5 -mb-5 p-4 rounded-b-2xl">
                <button
                  onClick={() => handleSubregionClick(activeSub.id)}
                  className="w-full text-center py-2 px-3 bg-[#030e2f]/70 hover:bg-yellow-400/10 border border-blue-900/60 hover:border-yellow-400 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all group cursor-pointer"
                >
                  {selectedSubregion === activeSub.id ? "Limpiar filtro" : "Ver municipios de esta subregión"}
                  <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-[#020a22]/30 border border-blue-900/40 border-dashed rounded-2xl p-8 text-center text-neutral-500 flex flex-col items-center justify-center min-h-[300px]">
              <Info className="w-8 h-8 text-neutral-700 mb-2.5" />
              <p className="text-xs max-w-xs leading-relaxed">
                Haz clic sobre cualquier subregión en el mapa vector o en el listado para desplegar las estadísticas demográficas, capital regional y actividades económicas clave.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
