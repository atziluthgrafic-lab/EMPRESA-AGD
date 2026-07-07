import React, { useState, useRef, useEffect } from "react";
import { SubregionId } from "../types";
import { MUNICIPALITIES } from "../data/antioquia";
import {
  Bot,
  Sparkles,
  Upload,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Compass,
  LayoutTemplate,
  Target,
  FileImage,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIWorkspaceProps {
  preselectedMuni: string | null;
  preselectedSub: SubregionId | null;
  onClearPreselections: () => void;
}

export default function AIWorkspace({
  preselectedMuni,
  preselectedSub,
  onClearPreselections,
}: AIWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"copy" | "banner" | "audit">("copy");

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 1. Copy Generator States
  const [copyName, setCopyName] = useState("");
  const [copyNiche, setCopyNiche] = useState("");
  const [copyMuni, setCopyMuni] = useState("");
  const [copyGoals, setCopyGoals] = useState("");
  const [copyResult, setCopyResult] = useState<string | null>(null);

  // 2. Banner Generator States
  const [bannerPrompt, setBannerPrompt] = useState("");
  const [bannerRatio, setBannerRatio] = useState("1:1");
  const [bannerResult, setBannerResult] = useState<{ url: string; desc: string } | null>(null);

  // 3. Website Audit / Screenshot Upload States
  const [auditImage, setAuditImage] = useState<string | null>(null);
  const [auditMime, setAuditMime] = useState<string>("image/png");
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Sync preselected municipality from outer state if any
  useEffect(() => {
    if (preselectedMuni) {
      setCopyMuni(preselectedMuni);
      setActiveTab("copy");
    }
  }, [preselectedMuni]);

  // Loading messages array for reassuring user during long-running tasks
  const loadingPhrases = [
    "Inicializando conexión segura con Google Gemini...",
    "Grounding: Buscando datos demográficos e históricos de los municipios...",
    "Redactando propuestas publicitarias personalizadas con regionalismos de Antioquia...",
    "Modelando el estudio creativo generativo...",
    "Diseñando la jerarquía de conversión de tu sitio...",
    "Cargando el diagnóstico del auditor visual..."
  ];

  useEffect(() => {
    let intervalId: any;
    if (loading) {
      let index = 0;
      setLoadingMsg(loadingPhrases[0]);
      intervalId = setInterval(() => {
        index = (index + 1) % loadingPhrases.length;
        setLoadingMsg(loadingPhrases[index]);
      }, 4000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loading]);

  // Submit Strategic Digital Advertising copy handler
  const handleGenerateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyName || !copyNiche || !copyMuni) {
      setError("Por favor completa los campos obligatorios (*).");
      return;
    }

    setLoading(true);
    setError(null);
    setCopyResult(null);

    const matchSub = MUNICIPALITIES.find((m) => m.name === copyMuni)?.subregion || "valle_de_aburra";

    try {
      const response = await fetch("/api/ai/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: copyName,
          niche: copyNiche,
          municipality: copyMuni,
          subregion: matchSub,
          goals: copyGoals,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCopyResult(data.text);
      } else {
        throw new Error(data.error || "Ocurrió un error inesperado al procesar con IA.");
      }
    } catch (err: any) {
      setError(err.message || "Error al intentar enlazar con el servidor de Atziluth.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Creative Ad banner generator
  const handleGenerateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerPrompt) {
      setError("Describe qué deseas ver en tu imagen publicitaria.");
      return;
    }

    setLoading(true);
    setError(null);
    setBannerResult(null);

    try {
      const response = await fetch("/api/ai/generate-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: bannerPrompt,
          aspectRatio: bannerRatio,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setBannerResult({ url: data.imageUrl, desc: data.description });
      } else {
        throw new Error(data.error || "No se pudo generar la imagen con el servidor.");
      }
    } catch (err: any) {
      setError(err.message || "Error de comunicación con el motor creativo.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Website Screenshot visual auditor
  const handleAuditWebsiteImage = async () => {
    if (!auditImage) {
      setError("Carga primero un flyer, mock o captura de pantalla de tu web.");
      return;
    }

    setLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const response = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: auditImage,
          mimeType: auditMime,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAuditResult(data.text);
      } else {
        throw new Error(data.error || "Auditoría fallida.");
      }
    } catch (err: any) {
      setError(err.message || "Error al enviar la imagen para análisis.");
    } finally {
      setLoading(false);
    }
  };

  // Image Helper: Base64 converter
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes (PNG, JPEG, WEBP).");
      return;
    }
    setAuditMime(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAuditImage(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // A light helper to parse basic markdown tags (headings, subheadings, bullet points, bold) to React elements.
  const parseMarkdownReport = (md: string) => {
    return md.split("\n").map((line, idx) => {
      const cleanLine = line.trim();
      if (cleanLine.startsWith("###")) {
        return (
          <h5 key={idx} className="text-sm font-bold text-yellow-300 mt-4 mb-2 font-mono flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {cleanLine.replace("###", "").trim()}
          </h5>
        );
      }
      if (cleanLine.startsWith("##") || cleanLine.startsWith("1.") || cleanLine.startsWith("2.") || cleanLine.startsWith("3.") || cleanLine.startsWith("4.")) {
        return (
          <h4 key={idx} className="text-base font-bold text-white mt-6 mb-3 border-b border-blue-900/25 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {cleanLine.replace(/^(\d+\.|##)/, "").trim()}
          </h4>
        );
      }
      if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
        return (
          <li key={idx} className="text-neutral-300 text-xs ml-4 list-disc space-y-1 my-1 leading-relaxed">
            {cleanLine.replace(/^[-*]/, "").trim()}
          </li>
        );
      }
      if (cleanLine) {
        // match bold text **text**
        const boldRegex = /\*\*(.*?)\*\*/g;
        let elements: any[] = [];
        let lastIndex = 0;
        let match;
        let subIdx = 0;

        while ((match = boldRegex.exec(cleanLine)) !== null) {
          if (match.index > lastIndex) {
            elements.push(cleanLine.substring(lastIndex, match.index));
          }
          elements.push(
            <strong key={subIdx++} className="font-semibold text-white">
              {match[1]}
            </strong>
          );
          lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < cleanLine.length) {
          elements.push(cleanLine.substring(lastIndex));
        }

        return (
          <p key={idx} className="text-neutral-350 text-xs leading-relaxed my-2">
            {elements.length > 0 ? elements : cleanLine}
          </p>
        );
      }
      return <div key={idx} className="h-2" />;
    });
  };

  return (
    <div className="bg-[#030e2f]/50 border border-blue-900/40 rounded-3xl p-6 lg:p-8" id="ia-espacio">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-blue-900/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-yellow-400 animate-pulse" />
            <span className="text-xs font-bold font-mono tracking-widest text-yellow-400 uppercase">
              Centro Creativo Inteligente
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Atziluth IA Marketing Suite</h2>
          <p className="text-neutral-300 text-sm">
            Toma decisiones inteligentes para tu marca local. Genera anuncios, diseña creativos de estudio y audita tu conversión.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#020a22]/90 border border-blue-900/40 p-1 rounded-xl self-stretch md:self-auto">
          <button
            onClick={() => {
              setActiveTab("copy");
              setError(null);
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "copy" ? "bg-yellow-400 text-neutral-950 shadow font-extrabold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Estrategia Ad & SEO
          </button>
          <button
            onClick={() => {
              setActiveTab("banner");
              setError(null);
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "banner" ? "bg-yellow-400 text-neutral-950 shadow font-extrabold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Diseñador Creativo
          </button>
          <button
            onClick={() => {
              setActiveTab("audit");
              setError(null);
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "audit" ? "bg-yellow-400 text-neutral-950 shadow font-extrabold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Auditor Visual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Form controls side */}
        <div className="lg:col-span-4 space-y-6">
          {/* Preselected indicator notification */}
          {preselectedMuni && preselectedMuni === copyMuni && activeTab === "copy" && (
            <div className="bg-yellow-950/25 border border-yellow-905-ish p-3 rounded-xl text-xs text-yellow-250 flex items-center justify-between">
              <span>
                Filtro activo: <strong>{copyMuni}</strong>.
              </span>
              <button onClick={onClearPreselections} className="text-[10px] hover:underline font-mono cursor-pointer">
                Quitar
              </button>
            </div>
          )}

          {/* Form depending on Active Tab */}
          {activeTab === "copy" && (
            <form onSubmit={handleGenerateCopy} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">Nombre Comercial *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                    <Compass className="w-4 h-4 cursor-pointer" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hacienda Las Flores"
                    value={copyName}
                    onChange={(e) => setCopyName(e.target.value)}
                    className="w-full bg-[#020a22]/80 border border-blue-900/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">Sector Comercial / Nicho *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                    <LayoutTemplate className="w-4 h-4 cursor-pointer" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Café Especial, Hotel Ecológico, Calzado"
                    value={copyNiche}
                    onChange={(e) => setCopyNiche(e.target.value)}
                    className="w-full bg-[#020a22]/80 border border-blue-900/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">Municipio de Antioquia *</label>
                <select
                  required
                  value={copyMuni}
                  onChange={(e) => setCopyMuni(e.target.value)}
                  className="w-full bg-[#020a22]/80 border border-blue-900/50 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                >
                  <option value="">-- Elige un municipio --</option>
                  {MUNICIPALITIES.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">Objetivos u Observaciones</label>
                <div className="relative">
                  <span className="absolute top-3 left-0 pl-3 flex pointer-events-none text-neutral-600">
                    <Target className="w-4 h-4 cursor-pointer" />
                  </span>
                  <textarea
                    placeholder="Ej. Traer turistas de Medellín el fin de semana, lanzar tienda online..."
                    rows={3}
                    value={copyGoals}
                    onChange={(e) => setCopyGoals(e.target.value)}
                    className="w-full bg-[#020a22]/80 border border-blue-900/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-350 disabled:bg-[#020a22]/80 disabled:text-neutral-600 text-neutral-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-yellow-500/10 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin animate-spin" /> : <Bot className="w-4 h-4" />}
                Diseñar Campaña Hyper-Local ({copyMuni || "Elegir"})
              </button>
            </form>
          )}

          {activeTab === "banner" && (
            <form onSubmit={handleGenerateBanner} className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                  1. Elige la Relación de Aspecto
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setBannerRatio(ratio)}
                      className={`py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                        bannerRatio === ratio
                          ? "bg-yellow-950/65 border-yellow-405-ish text-yellow-300"
                          : "bg-[#020a22] border-blue-900/30 text-neutral-400 hover:border-blue-900/60 hover:text-white"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-mono block mb-1">2. Describe tu Anuncio Ideal *</label>
                <textarea
                  required
                  placeholder="Ej. Un paisaje de cafetales montañosos en Jericó cubiertos de niebla mística por la mañana con flores tropicales en primer plano, estilo fotorealismo publicitario premium"
                  rows={4}
                  value={bannerPrompt}
                  onChange={(e) => setBannerPrompt(e.target.value)}
                  className="w-full bg-[#020a22]/80 border border-blue-900/50 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="bg-[#020a22]/80 border border-blue-900/20 p-3 rounded-xl text-[10px] text-neutral-400 leading-relaxed">
                Utilizamos el modelo robusto de alto impacto <strong>gemini-3.1-flash-image</strong> para moldear fondos, banners y creativos publicitarios a escala.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-emerald-500 hover:from-yellow-350 hover:to-emerald-450 disabled:from-neutral-800 disabled:to-neutral-900 disabled:text-neutral-650 text-neutral-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-yellow-500/10 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                Generar Fondo Publicitario ({bannerRatio})
              </button>
            </form>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-neutral-550 uppercase tracking-wider block text-neutral-400">
                Carga tu Diseño o Landing Page
              </span>

              {/* Drag and drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer min-h-[180px] flex flex-col items-center justify-center transition-all ${
                  dragActive
                    ? "border-yellow-400 bg-yellow-950/20"
                    : auditImage
                    ? "border-emerald-500 bg-[#020a22]/30"
                    : "border-blue-900/30 hover:border-blue-900/60 bg-[#020a22]/45"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {auditImage ? (
                  <div className="space-y-2">
                    <FileImage className="w-8 h-8 text-emerald-400 mx-auto" />
                    <span className="text-xs font-semibold text-white block">Imagen cargada con éxito</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAuditImage(null);
                      }}
                      className="text-[10px] text-red-400 hover:underline inline cursor-pointer"
                    >
                      Remover imagen
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <Upload className="w-8 h-8 text-neutral-500 mx-auto" />
                    <div>
                      <p className="text-xs text-white font-semibold">Arrastra y suelta tu imagen aquí</p>
                      <p className="text-[10px] text-neutral-400 mt-1">O haz clic para seleccionar archivo manualmente</p>
                    </div>
                  </div>
                )}
              </div>

              {auditImage && (
                <div className="space-y-3">
                  <div className="bg-[#020a22] border border-blue-900/30 rounded-xl overflow-hidden p-2">
                    <img
                      src={auditImage}
                      alt="Website screenshot preview"
                      className="w-full max-h-[120px] object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <button
                    onClick={handleAuditWebsiteImage}
                    disabled={loading}
                    className="w-full py-3 bg-yellow-400 hover:bg-yellow-350 disabled:bg-[#020a22] disabled:text-neutral-600 text-neutral-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-yellow-400/10 font-mono cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Bot className="w-4 h-4" />
                        EJECUTAR AUDITORÍA (gemini-3.1-pro-preview)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Output view / response side */}
        <div className="lg:col-span-8 bg-[#020a22]/85 border border-blue-900/30 rounded-2xl min-h-[400px] flex flex-col justify-between relative overflow-hidden">
          {/* Decorative subtle gradient */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-500/[0.015] blur-[150px] pointer-events-none" />

          {/* Panel Top bar status indicator */}
          <div className="border-b border-blue-900/30 p-4 bg-[#020a22]/95 backdrop-blur z-10 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-ping" : "bg-yellow-400"}`} />
              {activeTab === "copy"
                ? "PRE-VISUALIZANDO ESTRATEGIA PUBLICITARIA"
                : activeTab === "banner"
                ? "MOCK GENERADOR DISEÑOS DE BANNER"
                : "AUDITORÍA CONVERSIÓN INTEGRADOR WEB"}
            </span>

            {copyResult || bannerResult || auditResult ? (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                PROCESADO CON ÉXITO
              </span>
            ) : null}
          </div>

          {/* Results Block */}
          <div className="p-6 lg:p-8 flex-1 overflow-y-auto max-h-[500px]">
            {loading ? (
              /* Loading screen */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-900/20 border-t-yellow-400 animate-spin" />
                  <Bot className="w-5 h-5 text-yellow-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-white">Gemini está creando...</p>
                  <p className="text-xs text-neutral-400 max-w-sm italic">
                    "{loadingMsg}"
                  </p>
                </div>
              </div>
            ) : error ? (
              /* Error screen */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12 text-red-405-ish text-red-400">
                <AlertCircle className="w-10 h-10 text-red-500 animate-bounce" />
                <div>
                  <h4 className="text-sm font-bold text-white">Falla en la Generación del Servicio</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                    {error}
                  </p>
                </div>
              </div>
            ) : activeTab === "copy" && copyResult ? (
              /* Copy Generation Results */
              <div className="space-y-4">
                <div className="bg-yellow-950/20 border border-yellow-905-ish p-4 rounded-xl flex items-start gap-3">
                  <Bot className="w-5 h-5 text-yellow-450 shrink-0 mt-0.5 animate-bounce text-yellow-400" />
                  <div>
                    <h5 className="text-xs font-extrabold text-yellow-300 font-mono">ESTRATEGIA RECOMENDADA</h5>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                      Esta sugerencia inteligente ha sido calibrada integrando contextualización demográfica en Antioquia y geolocalización de comercio.
                    </p>
                  </div>
                </div>

                <div className="prose prose-invert prose-xs max-w-none text-left">
                  {parseMarkdownReport(copyResult)}
                </div>
              </div>
            ) : activeTab === "banner" && bannerResult ? (
              /* Banner Generation Results */
              <div className="space-y-6 flex flex-col items-center">
                <div className="relative border border-blue-900/30 rounded-xl overflow-hidden shadow-2xl bg-[#020a22] max-w-full">
                  <img
                    src={bannerResult.url}
                    alt="AI Generated Marketing Background"
                    className="max-h-[340px] md:max-h-[380px] object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                  {bannerResult.desc && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3 border-t border-blue-900/30 text-[10px] text-neutral-400 leading-relaxed">
                      <strong>Detalles:</strong> {bannerResult.desc}
                    </div>
                  )}
                </div>

                <div className="w-full bg-[#020a22]/50 border border-blue-900/30 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <span className="text-neutral-400">
                    ¿Te gusta el resultado? Atziluth puede diseñar e incorporar este fondo en tu Landing Page comercial.
                  </span>
                  <button
                    onClick={() => {
                      const contactSection = document.getElementById("contacto-seccion");
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="px-4 py-2 bg-yellow-400 text-neutral-950 font-bold rounded-lg text-[10px] uppercase font-mono tracking-wider shrink-0 transition-colors hover:bg-yellow-350 cursor-pointer"
                  >
                    Usar banners en mi Web
                  </button>
                </div>
              </div>
            ) : activeTab === "audit" && auditResult ? (
              /* Vision Audit results */
              <div className="space-y-4">
                <div className="bg-emerald-950/20 border border-emerald-905-ish p-4 rounded-xl flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-300 font-mono">DIAGNÓSTICO COMPLETADO POR EL AUDITOR</h5>
                    <p className="text-[11px] text-neutral-300 leading-relaxed mt-0.5">
                      Auditoría heurística con Gemini 3.1 Pro para mejorar la conversión, reducir la tasa de rebote e impulsar el ROI.
                    </p>
                  </div>
                </div>

                <div className="prose prose-invert prose-xs max-w-none text-left">
                  {parseMarkdownReport(auditResult)}
                </div>
              </div>
            ) : (
              /* Empty Placeholder State */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16 text-neutral-650">
                <Sparkles className="w-10 h-10 text-neutral-700 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Consola de Salida Vacía
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-xs leading-relaxed mt-1">
                    Configura los parámetros, carga los requerimientos a la izquierda y pulsa ejecutar para recibir el reporte inteligente de Atziluth.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Panel Bottom status bar */}
          <div className="border-t border-blue-900/30 px-6 py-4 bg-[#020a22]/95 backdrop-blur z-10 text-[10px] text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono">
            <span>Powering local transformation in Antioquia</span>
            <span>Generativa • Conexión Segura Google Cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
}
