import React, { useState, useMemo } from "react";
import { SubregionId, Municipality, Business } from "../types";
import { MUNICIPALITIES, MOCK_BUSINESSES, SUBREGIONS } from "../data/antioquia";
import { FolderGit, CheckCircle, ExternalLink, Bot, HelpCircle, Briefcase, Plus, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import imageDirectoryBanner from "../assets/images/municipal_directory_banner_1781555453118.jpg";

interface MunicipalDirectoryProps {
  selectedSubregion: SubregionId | null;
  selectedMunicipality: string | null;
  onSelectMunicipality: (municipality: string | null) => void;
  customBannerUrl?: string | null;
  customBusinesses?: Array<{
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    municipality?: string;
    subregion?: string;
    phone?: string;
    website?: string;
  }>;
}

export default function MunicipalDirectory({
  selectedSubregion,
  selectedMunicipality,
  onSelectMunicipality,
  customBannerUrl,
  customBusinesses,
}: MunicipalDirectoryProps) {
  const [registrations, setRegistrations] = useState<Business[]>(MOCK_BUSINESSES);
  
  // Registration Form state
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState("");
  const [regNiche, setRegNiche] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regWebsite, setRegWebsite] = useState("");
  const [regMuni, setRegMuni] = useState("");

  const subMeta = SUBREGIONS.find((s) => s.id === selectedSubregion);

  // Municipalities inside active subregion or all
  const filteredMunicipalities = useMemo(() => {
    if (!selectedSubregion) {
      // Just some defaults if none selected to not overcrowd (say we show a subset or tell them to select)
      return MUNICIPALITIES.slice(0, 15);
    }
    return MUNICIPALITIES.filter((m) => m.subregion === selectedSubregion);
  }, [selectedSubregion]);

  const activeMuniData = useMemo(() => {
    if (!selectedMunicipality) return null;
    return MUNICIPALITIES.find((m) => m.name === selectedMunicipality);
  }, [selectedMunicipality]);

  // Companies registered in this specific municipality
  const localBusinesses = useMemo(() => {
    if (!selectedMunicipality) return [];

    // Convert custom businesses into standard Business interface format
    const convertedCustoms: Business[] = (customBusinesses || [])
      .filter((cb) => cb.municipality && cb.municipality.toLowerCase() === selectedMunicipality.toLowerCase())
      .map((cb) => ({
        id: cb.id,
        name: cb.name,
        niche: cb.category, // map category to niche
        municipality: cb.municipality || selectedMunicipality,
        subregion: (cb.subregion as SubregionId) || "valle_de_aburra",
        phone: cb.phone || "+57 300 000 0000",
        website: cb.website || `https://${cb.name.toLowerCase().replace(/\s+/g, "")}.atziluth.com`,
        usesAI: true,
        logoUrl: cb.imageUrl, // save custom uploaded URL if they want to load thumbnail later
        servicesCompleted: ["Auditoría IA Básica", "Registro en Directorio Antioquia", "Tráfico con Banners Activos"]
      }));

    const filteredStatic = registrations.filter((b) => b.municipality.toLowerCase() === selectedMunicipality.toLowerCase());
    
    // Converted customs first so they appear prominently at the top of the directory listing!
    return [...convertedCustoms, ...filteredStatic];
  }, [selectedMunicipality, registrations, customBusinesses]);

  const handleRegisterBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regNiche || !regMuni) return;

    const targetSub = MUNICIPALITIES.find((m) => m.name === regMuni)?.subregion || "valle_de_aburra";

    const newBiz: Business = {
      id: Math.random().toString(),
      name: regName,
      niche: regNiche,
      municipality: regMuni,
      subregion: targetSub as SubregionId,
      phone: regPhone || "+57 300 000 0000",
      website: regWebsite || `https://${regName.toLowerCase().replace(/\s+/g, "")}.atziluth.com`,
      usesAI: true,
      servicesCompleted: ["Auditoría IA Básica", "Registro en Directorio Antioquia"]
    };

    setRegistrations(prev => [newBiz, ...prev]);
    setIsRegistering(false);
    onSelectMunicipality(regMuni);
    
    // reset form
    setRegName("");
    setRegNiche("");
    setRegPhone("");
    setRegWebsite("");
  };  return (
    <div className="bg-[#030e2f]/50 border border-blue-900/40 rounded-3xl p-6 lg:p-8 space-y-8" id="directorio-seccion">
      {/* Directory Title bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-yellow-500" />
            Directorio Comercial y Estratégico de Municipios
          </h2>
          <p className="text-neutral-300 text-sm mt-1">
            {subMeta 
              ? `Explorando la subregión del ${subMeta.name} (${filteredMunicipalities.length} municipios listados)` 
              : "Selecciona una subregión en el mapa superior para desglosar sus municipios y empresas locales."}
          </p>
        </div>

        <button
          onClick={() => {
            setIsRegistering(true);
            if (activeMuniData) setRegMuni(activeMuniData.name);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-yellow-400 via-emerald-500 to-emerald-600 rounded-xl text-xs font-bold text-neutral-950 shadow-lg shadow-yellow-500/10 hover:from-yellow-300 hover:to-emerald-400 transition-all self-start md:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4 shadow-sm" />
          Registrar Mi Negocio Gratis
        </button>
      </div>

      {/* Featured Banner Image presenting local business digitisation */}
      <div className="relative rounded-3xl overflow-hidden border border-blue-900/50 bg-[#020a22]/85 group p-6 md:p-8 space-y-6">
        {/* Top: Header Meta & Text */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-950 text-yellow-400 border border-yellow-800/30 w-max">
            ⚡ TRANSACCIONALIDAD REGIONAL
          </div>
          <h3 className="text-xl md:text-2.5xl font-black text-white leading-tight group-hover:text-yellow-400 transition-colors">
            Sello Comercial: Integración de Recaudos Digitales en Municipios
          </h3>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
            En Antioquia la digitalización fluye en cada rincón. Desde la plaza principal de Jericó o Jardín hasta los comercios de montaña, habilitamos portales web interactivos con códigos de recaudo digital (Nequi, Daviplata), compras seguras y financiamiento directo (Addi) para multiplicar tus ventas en minutos.
          </p>
        </div>

        {/* Middle: Massive, complete uncropped panorama of Jardín, Antioquia town square */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#02071d] border border-blue-900/40 p-1.5 space-y-2">
          <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-35 transition-opacity duration-500" />
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={customBannerUrl || imageDirectoryBanner}
              alt="Plaza comercial tradicional - Antioquia Digital"
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.005] mx-auto block"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Caption outside and beneath to prevent any overlay from cropping the image */}
          <div className="bg-[#020921]/95 border border-[#0d1c44] rounded-xl py-2 px-3 text-[10px] text-yellow-400 font-mono text-left w-full">
            Comercio Local con Recaudos Digitales — Jardín, Antioquia
          </div>
        </div>

        {/* Bottom: Fast features pills */}
        <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-mono text-neutral-300 border-t border-blue-900/30 pt-4">
          <span className="bg-[#030e2f]/90 border border-blue-900/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-lg shadow-emerald-400/40" /> Pagos QR Nequi
          </span>
          <span className="bg-[#030e2f]/90 border border-blue-900/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-lg shadow-emerald-400/40" /> Financiamiento Local Addi
          </span>
          <span className="bg-[#030e2f]/90 border border-blue-900/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-lg shadow-emerald-400/40" /> Google Maps SEO Regional
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Municipalities Pills List */}
        <div className="bg-[#020a22]/80 border border-blue-900/30 p-4 rounded-2xl h-[420px] overflow-y-auto space-y-2">
          <span className="text-[10px] font-mono font-bold text-neutral-450 tracking-wider block uppercase mb-3 text-neutral-400">
            {subMeta ? `Municipios de ${subMeta.name}` : "Municipios Destacados de Antioquia"}
          </span>

          <div className="space-y-1">
            {filteredMunicipalities.map((m) => (
              <button
                key={m.name}
                onClick={() => onSelectMunicipality(m.name)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group cursor-pointer ${
                  selectedMunicipality === m.name
                    ? "bg-yellow-950/35 border border-yellow-800/50 text-yellow-400 font-semibold"
                    : "hover:bg-[#03113c] text-neutral-400 hover:text-white border border-transparent"
                }`}
              >
                <span>{m.name}</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-yellow-400 transition-colors flex items-center gap-0.5">
                  Ver táctica
                  <FolderGit className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Tab View for Detailed Municipality & Registered Businesses */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeMuniData ? (
              <motion.div
                key={activeMuniData.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 h-full flex flex-col justify-between"
              >
                {/* Municipality Details Block */}
                <div className="bg-gradient-to-r from-[#030e2f] to-[#020a22] border border-blue-900/40 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none font-bold text-8xl text-yellow-400 select-none">
                    {activeMuniData.name.slice(0, 3).toUpperCase()}
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-2xl font-bold text-white tracking-tight">{activeMuniData.name}</h4>
                      <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-mono">
                        Sector Económico Principal: <span className="text-yellow-400">{activeMuniData.primaryEconomy}</span>
                      </p>
                    </div>

                    {activeMuniData.capitalDistanceKm !== undefined && (
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 block uppercase">Distancia a Medellín</span>
                        <span className="text-sm font-semibold text-white">{activeMuniData.capitalDistanceKm} km</span>
                      </div>
                    )}
                  </div>

                  {/* AI Strategical Ad-tip */}
                  <div className="mt-5 bg-yellow-950/15 border border-yellow-900/40 p-4 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5 font-mono">
                      <Bot className="w-4 h-4 text-yellow-400 animate-pulse" />
                      RECOMENDACIÓN ATZILUTH IA GOOGLE:
                    </span>
                    <p className="text-xs text-neutral-200 leading-relaxed italic">
                      "{activeMuniData.adTip}"
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/573207115878?text=Hola%20Atziluth%20Digital!%20Me%20interesa%20crear%20una%20estrategia%20comercial%20para%20mi%20negocio%20en%20el%20municipio%20de%20${encodeURIComponent(activeMuniData.name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-neutral-950 rounded-xl text-xs font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/10 text-center"
                    >
                      <Send className="w-4 h-4" />
                      Cotizar Estrategia Local
                    </a>
                  </div>
                </div>

                {/* Businesses Registered List */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Marcas en {activeMuniData.name} impulsadas por Atziluth Digital ({localBusinesses.length})
                  </span>

                  {localBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {localBusinesses.map((biz) => (
                        <div
                          key={biz.id}
                          className="bg-[#020a22]/80 border border-blue-900/30 p-4 rounded-xl flex flex-col justify-between hover:border-blue-900/60 transition-colors"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {biz.logoUrl && (
                                  <img 
                                    src={biz.logoUrl} 
                                    alt={biz.name} 
                                    className="w-10 h-10 object-cover rounded-lg border border-blue-900/30 shrink-0" 
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="text-left">
                                  <span className="font-bold text-white text-sm block leading-none">{biz.name}</span>
                                  <span className="text-xs text-neutral-400 block mt-1 leading-tight">{biz.niche}</span>
                                </div>
                              </div>
                              {biz.usesAI && (
                                <span className="text-[9px] font-mono text-yellow-400 bg-yellow-950/40 px-2 py-0.5 rounded-full border border-yellow-800/30 flex items-center gap-1 shrink-0">
                                  <Bot className="w-2.5 h-2.5" />
                                  Opt. IA
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-blue-900/20 flex items-center justify-between text-xs text-neutral-400">
                            <span>{biz.phone}</span>
                            <a
                              href={biz.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                            >
                              Propio Web
                              <ExternalLink className="w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#020a22]/30 border border-blue-900/40 border-dashed rounded-2xl p-6 text-center text-neutral-500">
                      <HelpCircle className="w-6 h-6 text-neutral-700 mx-auto mb-1.5" />
                      <p className="text-xs text-neutral-400">
                        Aún no hay empresas registradas en {activeMuniData.name}. ¡Sé el primero de tu municipio para liderar la transformación digital!
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#020a22]/20 border border-blue-900/40 border-dashed rounded-3xl p-12 text-center text-neutral-500 h-full flex flex-col items-center justify-center min-h-[300px]">
                <Bot className="w-12 h-12 text-neutral-700 mb-3 animate-pulse" />
                <h4 className="text-white font-bold text-lg">Explorador de Inteligencia Local</h4>
                <p className="text-xs max-w-sm leading-relaxed mt-1.5 text-neutral-400">
                  Selecciona cualquier municipio del listado de la izquierda para desglosar su demografía, recomendaciones específicas para la zona y empresas participantes.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Register Business Dialog/Modal mock */}
      <AnimatePresence>
        {isRegistering && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#030e2f] border border-blue-900/60 w-full max-w-md p-6 rounded-2xl shadow-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-bold text-white">Registrar Mi Negocio</h5>
                <button
                  onClick={() => setIsRegistering(false)}
                  className="text-neutral-400 hover:text-white text-sm cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              <form onSubmit={handleRegisterBusiness} className="space-y-3.5">
                <div>
                  <label className="text-xs text-neutral-300 block mb-1 font-mono">Nombre de tu Negocio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Café Altura Jericó"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#020a22] border border-blue-900/50 rounded-lg py-2 px-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-300 block mb-1 font-mono">Nicho o Sector *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Turismo, Cafetería, Artesanías"
                    value={regNiche}
                    onChange={(e) => setRegNiche(e.target.value)}
                    className="w-full bg-[#020a22] border border-blue-900/50 rounded-lg py-2 px-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-300 block mb-1 font-mono">Municipio de Ubicación *</label>
                  <select
                    required
                    value={regMuni}
                    onChange={(e) => setRegMuni(e.target.value)}
                    className="w-full bg-[#020a22] border border-blue-900/50 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="">-- Selecciona --</option>
                    {MUNICIPALITIES.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-300 block mb-1 font-mono">Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="Ej. +57310..."
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-[#020a22] border border-blue-900/50 rounded-lg py-2 px-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-300 block mb-1 font-mono">Sitio Web (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. miweb.com"
                      value={regWebsite}
                      onChange={(e) => setRegWebsite(e.target.value)}
                      className="w-full bg-[#020a22] border border-blue-900/50 rounded-lg py-2 px-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-emerald-500 hover:from-yellow-350 hover:to-emerald-450 text-neutral-950 font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Guardar Registro en Directorio
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
