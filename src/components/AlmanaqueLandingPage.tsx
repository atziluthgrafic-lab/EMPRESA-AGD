import React, { useState, useMemo } from "react";
import { 
  Calendar, 
  ArrowLeft, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Maximize2, 
  Minimize2, 
  Download, 
  Layers, 
  Palette, 
  DollarSign, 
  Eye, 
  ChevronRight,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Search,
  ZoomIn,
  ZoomOut,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AlmanaqueConfig, AlmanaqueItem } from "../types";

interface AlmanaqueLandingPageProps {
  config?: AlmanaqueConfig;
  onBack: () => void;
  onOpenAdmin?: () => void;
}

const defaultConfig: AlmanaqueConfig = {
  extraColorCost: 20000,
  products: [
    {
      id: "almanaque-pared",
      title: "Almanaque de Pared con Varilla y Ojate",
      description: "Impresión en Propalcote 250g con cabezote publicitario a todo color, varilla metálica superior, ojal para colgar y taco mensual desprendible.",
      details: "Formato amplio 33x48 cm. Ideal para presencia en salas de estar, tiendas, oficinas y talleres todo el año.",
      imageUrl: "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=800&q=80",
      pdfUrl: "",
      prices: {
        qty100: 250000,
        qty300: 480000,
        qty500: 680000,
        qty1000: 1100000
      }
    },
    {
      id: "almanaque-escritorio",
      title: "Calendario de Escritorio Anillado Doble O",
      description: "Base rígida en cartón industrial carpa con 12 o 13 hojas a color en Propalcote 200g y anillado metálico de alta durabilidad.",
      details: "Formato 15x20 cm. Visibilidad diaria continua en los escritorios de tus mejores clientes corporativos.",
      imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
      pdfUrl: "",
      prices: {
        qty100: 380000,
        qty300: 750000,
        qty500: 1100000,
        qty1000: 1850000
      }
    },
    {
      id: "almanaque-bolsillo",
      title: "Almanaque de Bolsillo & Magnético para Nevera",
      description: "Formato tarjeta plastificada brillante con calendario al respaldo o versión con imán plano de alta fijación.",
      details: "Tamaño 9x5.5 cm o 10x7 cm. La herramienta publicitaria de mayor distribución y recordación masiva.",
      imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
      pdfUrl: "",
      prices: {
        qty100: 120000,
        qty300: 220000,
        qty500: 320000,
        qty1000: 520000
      }
    }
  ]
};

const samplePdfPages = [
  {
    pageNumber: 1,
    title: "Vista General — Almanaque de Pared con Cabezote Publicitario",
    subtitle: "Página 1: Encabezado corporativo, grilla de meses e ilustración principal",
    imageUrl: "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=1200&q=90",
    description: "Diseño con sangrados limpios, guía de perforación para ojal metálico y área de marca de 30x15 cm para tu logotipo y datos de contacto."
  },
  {
    pageNumber: 2,
    title: "Detalle de Hojas Mensuales & Días Festivos de Colombia",
    subtitle: "Página 2: Diagramación de taco mensual con números gigantes visibles",
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=90",
    description: "Taco mensual desprendible con festivos oficiales marcados, espacio para anotaciones diarias y papel bond de alta absorción."
  },
  {
    pageNumber: 3,
    title: "Muestrario de Calendario de Escritorio Anillado Doble O",
    subtitle: "Página 3: Maquetación tipo carpa 12 meses + Portada promocional",
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=90",
    description: "Base plegable rígida en cartón de 1.5mm revestido, anillado doble O negro o plateado y 12 caras personalizadas para promociones mensuales."
  },
  {
    pageNumber: 4,
    title: "Especificaciones Técnicas & Guía de Tintas (1 a 4 Colores)",
    subtitle: "Página 4: Muestra cromática y zonas de impresión litográfica",
    imageUrl: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=1200&q=90",
    description: "Guía técnica para la aplicación de tintas Pantone directas o policromía full color (CMYK) con fidelidad cromática garantizada."
  }
];

export default function AlmanaqueLandingPage({ config = defaultConfig, onBack, onOpenAdmin }: AlmanaqueLandingPageProps) {
  const activeConfig = config.products && config.products.length > 0 ? config : defaultConfig;
  const extraColorCost = activeConfig.extraColorCost || 20000;

  // Selected state for interactive quote builder
  const [selectedProductId, setSelectedProductId] = useState<string>(activeConfig.products[0]?.id || "almanaque-pared");
  const [selectedQtyKey, setSelectedQtyKey] = useState<"qty100" | "qty300" | "qty500" | "qty1000">("qty100");
  const [colorsCount, setColorsCount] = useState<number>(1); // 1 = base, 2 = +1 tinta (+20k), 3 = +2 tintas (+40k), 4 = +3 tintas (+60k)

  // PDF Broad Viewer State
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState<boolean>(false);
  const [activePdfTab, setActivePdfTab] = useState<number>(1);

  const displayPdfPages = useMemo(() => {
    if (activeConfig.pdfPages && activeConfig.pdfPages.length > 0) {
      return activeConfig.pdfPages;
    }
    return samplePdfPages;
  }, [activeConfig]);
  const selectedProduct = useMemo(() => {
    return activeConfig.products.find(p => p.id === selectedProductId) || activeConfig.products[0];
  }, [selectedProductId, activeConfig]);

  // Base price calculation for selected quantity
  const basePrice = useMemo(() => {
    if (!selectedProduct || !selectedProduct.prices) return 0;
    return selectedProduct.prices[selectedQtyKey] || 0;
  }, [selectedProduct, selectedQtyKey]);

  // Calculate extra colors cost: 1 color = $0 extra, >1 color = (colorsCount - 1) * extraColorCost
  const colorsSurcharge = useMemo(() => {
    const extraInks = Math.max(0, colorsCount - 1);
    return extraInks * extraColorCost;
  }, [colorsCount, extraColorCost]);

  // Total calculated price
  const totalPrice = basePrice + colorsSurcharge;

  // Quantity numeric label
  const qtyNumber = useMemo(() => {
    switch (selectedQtyKey) {
      case "qty100": return 100;
      case "qty300": return 300;
      case "qty500": return 500;
      case "qty1000": return 1000;
      default: return 100;
    }
  }, [selectedQtyKey]);

  // Format currency in COP
  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // WhatsApp Cotización handler
  const handleQuoteWhatsApp = () => {
    const text = `Hola Atziluth Digital! Quisiera cotizar el siguiente pedido de Almanaques:
📌 *Producto:* ${selectedProduct.title}
📦 *Cantidad:* ${qtyNumber} unidades
🎨 *Tintas/Colores:* ${colorsCount} ${colorsCount === 1 ? "tinta (base)" : "tintas"} (+${formatCOP(colorsSurcharge)} por colores adicionales)
💰 *Precio Total Estimado:* ${formatCOP(totalPrice)} COP (Aproximadamente ${formatCOP(Math.round(totalPrice / qtyNumber))} por unidad)

Por favor asesórenme con los detalles de diseño e impresión.`;

    const url = `https://wa.me/573207115878?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-12 pb-16 font-sans text-neutral-100">
      {/* Top Header Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-blue-900/30 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#020a22] hover:bg-blue-950/80 border border-blue-900/40 text-yellow-400 font-mono text-xs font-bold rounded-xl transition-all cursor-pointer hover:border-yellow-400/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Publicidad Litográfica
        </button>

        <div className="flex items-center gap-2">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:opacity-90 text-neutral-950 font-black text-xs font-mono rounded-xl shadow-lg border border-yellow-300 cursor-pointer transition-transform hover:scale-102"
              title="Abrir Panel de Administración para Editar Almanaques 2027"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>PANEL ADMIN</span>
            </button>
          )}

          <span className="hidden sm:inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-mono font-bold">
            Impresión Industrial 2027/2028
          </span>
          <button
            onClick={handleQuoteWhatsApp}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-yellow-400 to-emerald-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md cursor-pointer hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Asesor en Línea
          </button>
        </div>
      </div>

      {/* Admin CMS Access Callout Bar */}
      {onOpenAdmin && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-yellow-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Panel de Control & Edición de Almanaques 2027</h3>
              <p className="text-xs text-neutral-300">Modifica precios, sube imágenes en alta resolución, cambia descripciones y adjunta PDFs.</p>
            </div>
          </div>
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 text-neutral-950 font-black text-xs font-mono rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md flex items-center gap-2 border border-yellow-300 whitespace-nowrap"
          >
            <Lock className="w-4 h-4" />
            EDITAR ALMANAQUES (PANEL ADMIN)
          </button>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-yellow-400/10 border border-yellow-500/30 rounded-full text-xs font-mono font-bold text-yellow-400">
          <Calendar className="w-4 h-4 text-yellow-400 animate-pulse" />
          Especial de Almanaques & Calendarios Publicitarios
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
          Tu Marca en el Hogar y Oficina de tus Clientes <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-emerald-400">Los 365 Días del Año</span>
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Diseño e impresión litográfica industrial de almanaques de pared, calendarios de escritorio y almanaques magnéticos. Selecciona la cantidad, ajusta el número de tintas y consulta valores oficiales al instante.
        </p>

        {/* Value Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-3">
          <div className="bg-[#020a22]/80 border border-blue-900/30 p-2.5 rounded-xl text-center">
            <span className="text-yellow-400 font-mono font-bold text-xs block">100 a 1000+</span>
            <span className="text-[10px] text-neutral-400">Cantidades Flexibles</span>
          </div>
          <div className="bg-[#020a22]/80 border border-blue-900/30 p-2.5 rounded-xl text-center">
            <span className="text-emerald-400 font-mono font-bold text-xs block">+$20.000 / Tinta</span>
            <span className="text-[10px] text-neutral-400">Por Tinta Adicional</span>
          </div>
          <div className="bg-[#020a22]/80 border border-blue-900/30 p-2.5 rounded-xl text-center">
            <span className="text-cyan-400 font-mono font-bold text-xs block">Festivos Colombia</span>
            <span className="text-[10px] text-neutral-400">Taco Oficial Incluido</span>
          </div>
          <div className="bg-[#020a22]/80 border border-blue-900/30 p-2.5 rounded-xl text-center">
            <span className="text-amber-400 font-mono font-bold text-xs block">Despacho Nacional</span>
            <span className="text-[10px] text-neutral-400">Envíos a Antioquia</span>
          </div>
        </div>
      </div>

      {/* Interactive Quotation Calculator */}
      <div className="max-w-5xl mx-auto bg-[#02091d] border border-blue-900/40 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-900/30 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-yellow-400 font-bold tracking-widest block">
              Calculadora Instantánea
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Cotizador Inteligente de Almanaques por Cantidad y Tintas
            </h2>
          </div>
          <span className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-mono rounded-lg">
            Valores Transparentes
          </span>
        </div>

        {/* Step 1: Select Almanac Model */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-yellow-400 text-neutral-950 font-bold flex items-center justify-center text-[11px]">1</span>
            Selecciona el Tipo de Almanaque:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeConfig.products.map((prod) => {
              const isSelected = prod.id === selectedProductId;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#04123b] border-yellow-400 shadow-lg shadow-yellow-500/10"
                      : "bg-[#020516] border-blue-900/30 hover:border-blue-900/70 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${isSelected ? "bg-yellow-400 text-neutral-950" : "bg-neutral-800 text-neutral-300"}`}>
                        {isSelected ? "Seleccionado" : "Opción"}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{prod.title}</h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">{prod.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-900/20 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-500">Desde:</span>
                    <span className="text-emerald-400 font-bold">{formatCOP(prod.prices.qty100)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Quantity Tier (100, 300, 500, 1000) */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-yellow-400 text-neutral-950 font-bold flex items-center justify-center text-[11px]">2</span>
            Selecciona la Cantidad Deseada:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "qty100", label: "100 Unidades", popular: false },
              { key: "qty300", label: "300 Unidades", popular: true },
              { key: "qty500", label: "500 Unidades", popular: false },
              { key: "qty1000", label: "1.000 Unidades", popular: false }
            ].map((q) => {
              const isSelected = selectedQtyKey === q.key;
              const price = selectedProduct?.prices[q.key as keyof typeof selectedProduct.prices] || 0;
              return (
                <button
                  key={q.key}
                  onClick={() => setSelectedQtyKey(q.key as any)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-gradient-to-b from-[#0a1f5c] to-[#04123b] border-yellow-400 text-white font-bold ring-2 ring-yellow-400/30"
                      : "bg-[#020516] border-blue-900/30 text-neutral-300 hover:border-blue-900/60"
                  }`}
                >
                  {q.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono uppercase font-bold px-2 py-0.2 bg-emerald-500 text-neutral-950 rounded-full">
                      Más Elegido
                    </span>
                  )}
                  <span className="block text-sm font-black font-mono">{q.label}</span>
                  <span className="block text-[11px] font-mono text-emerald-400 font-bold mt-1">
                    {formatCOP(price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Select Colors / Tintas count (+20.000 COP per extra color) */}
        <div className="space-y-3 bg-[#010512] p-4 rounded-2xl border border-blue-900/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-neutral-950 font-bold flex items-center justify-center text-[11px]">3</span>
              Selecciona el Número de Tintas / Colores de Impresión:
            </label>
            <span className="text-[11px] font-mono text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-lg border border-yellow-400/20">
              ⚡ Cada color adicional suma {formatCOP(extraColorCost)} al paquete
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {[
              { count: 1, label: "1 Tinta (Monocromo)", extra: 0 },
              { count: 2, label: "2 Tintas (Dúo Tono)", extra: extraColorCost },
              { count: 3, label: "3 Tintas (Trícroma)", extra: extraColorCost * 2 },
              { count: 4, label: "4 Tintas / Full Color", extra: extraColorCost * 3 }
            ].map((c) => {
              const isSelected = colorsCount === c.count;
              return (
                <button
                  key={c.count}
                  onClick={() => setColorsCount(c.count)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-yellow-400 text-neutral-950 border-yellow-300 font-bold shadow-md"
                      : "bg-[#02081d] border-blue-900/30 text-neutral-300 hover:border-blue-900/60"
                  }`}
                >
                  <span className="block text-xs font-bold font-mono">{c.label}</span>
                  <span className={`block text-[10px] mt-0.5 ${isSelected ? "text-neutral-900 font-bold" : "text-neutral-400"}`}>
                    {c.extra === 0 ? "Incluido en base" : `+${formatCOP(c.extra)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Breakdown & Total Summary Box */}
        <div className="bg-gradient-to-r from-[#030d32] via-[#081745] to-[#030d32] border border-yellow-500/30 p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-widest block">
              Resumen de Cotización Calculada
            </span>
            <div className="text-2xl md:text-3xl font-black text-white">
              {formatCOP(totalPrice)}{" "}
              <span className="text-xs font-mono text-neutral-400 font-normal">COP Total</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300 pt-1 font-mono">
              <span>📦 {qtyNumber} Unidades</span>
              <span>•</span>
              <span>🎨 {colorsCount} {colorsCount === 1 ? "Tinta" : "Tintas"}</span>
              <span>•</span>
              <span className="text-yellow-400 font-bold">~{formatCOP(Math.round(totalPrice / qtyNumber))} / und</span>
            </div>
          </div>

          <button
            onClick={handleQuoteWhatsApp}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-yellow-400 via-amber-300 to-emerald-400 text-neutral-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-yellow-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <MessageSquare className="w-5 h-5 fill-neutral-950" />
            Ordenar / Cotizar en WhatsApp
          </button>
        </div>
      </div>

      {/* Catalog Grid for All Almanaque Models */}
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Tabla de Precios por Cantidad para Cada Modelo
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl mx-auto">
            Compara las tarifas directas de impresión para 100, 300, 500 y 1000 unidades. Recuerda que cada tinta adicional aumenta $20.000 COP al paquete global.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeConfig.products.map((item) => (
            <div 
              key={item.id}
              className="bg-[#020a22]/80 border border-blue-900/40 rounded-2xl p-5 hover:border-yellow-400/40 transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="w-full h-48 rounded-xl overflow-hidden relative border border-blue-900/30 bg-slate-950">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-neutral-950/80 text-yellow-400 px-2 py-0.5 rounded border border-yellow-400/30">
                    Garantía Impresión Offset
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  {item.details && (
                    <p className="text-[11px] text-neutral-400 mt-1.5 font-mono">
                      📋 {item.details}
                    </p>
                  )}
                </div>

                {/* Pricing Table for this specific product */}
                <div className="bg-[#010514] rounded-xl p-3 border border-blue-900/30 space-y-2">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                    Precios Base (1 Tinta / Color):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#030d2f] p-2 rounded-lg border border-blue-900/20 flex justify-between">
                      <span className="text-neutral-400">x 100:</span>
                      <span className="text-yellow-400 font-bold">{formatCOP(item.prices.qty100)}</span>
                    </div>
                    <div className="bg-[#030d2f] p-2 rounded-lg border border-blue-900/20 flex justify-between">
                      <span className="text-neutral-400">x 300:</span>
                      <span className="text-yellow-400 font-bold">{formatCOP(item.prices.qty300)}</span>
                    </div>
                    <div className="bg-[#030d2f] p-2 rounded-lg border border-blue-900/20 flex justify-between">
                      <span className="text-neutral-400">x 500:</span>
                      <span className="text-yellow-400 font-bold">{formatCOP(item.prices.qty500)}</span>
                    </div>
                    <div className="bg-[#030d2f] p-2 rounded-lg border border-blue-900/20 flex justify-between">
                      <span className="text-neutral-400">x 1.000:</span>
                      <span className="text-emerald-400 font-bold">{formatCOP(item.prices.qty1000)}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-neutral-500 block text-center italic pt-0.5">
                    + $20.000 COP por cada tinta adicional en el tiraje
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProductId(item.id);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="w-full py-2.5 bg-[#030d2f] hover:bg-yellow-400 text-yellow-400 hover:text-neutral-950 font-bold text-xs rounded-xl transition-all border border-yellow-400/30 hover:border-yellow-400 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                Calcular en Cotizador
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizador de PDF Completo / Catálogo Amplio con Scroll Continuous */}
      <div className="max-w-6xl mx-auto space-y-6 pt-6">
        <div className="bg-[#020a22]/90 border border-yellow-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-blue-900/30 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-[10px] font-mono font-bold border border-yellow-400/20">
                <FileText className="w-3.5 h-3.5" />
                Muestrario & Visualizador PDF Completo en Formato Amplio
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                Explora el Catálogo en PDF Completo (Vista Desplazable)
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Desplázate verticalmente para inspeccionar las páginas del catálogo, maquetados de taco mensual, varillas y acabados gráficos en formato amplio.
              </p>
            </div>

            {/* Viewer Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-[#010512] border border-blue-900/40 rounded-xl p-1 font-mono text-xs text-neutral-300">
                <button 
                  onClick={() => setPdfZoom(prev => Math.max(70, prev - 15))}
                  className="p-1.5 hover:bg-blue-900/40 rounded-lg text-yellow-400 cursor-pointer"
                  title="Reducir zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-[11px]">{pdfZoom}%</span>
                <button 
                  onClick={() => setPdfZoom(prev => Math.min(150, prev + 15))}
                  className="p-1.5 hover:bg-blue-900/40 rounded-lg text-yellow-400 cursor-pointer"
                  title="Aumentar zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setIsPdfFullscreen(!isPdfFullscreen)}
                className="px-3 py-2 bg-[#030d2f] hover:bg-blue-900/50 border border-blue-900/40 text-yellow-400 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPdfFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isPdfFullscreen ? "Cerrar Pantalla Completa" : "Pantalla Completa"}
              </button>
            </div>
          </div>

          {/* Broad PDF Document Scrollable Container */}
          <div 
            className={`bg-slate-950 border border-blue-900/50 rounded-2xl overflow-y-auto p-4 md:p-8 space-y-8 transition-all relative ${
              isPdfFullscreen 
                ? "fixed inset-4 z-50 max-w-none max-h-none h-[calc(100vh-2rem)] bg-slate-950/95 backdrop-blur-md shadow-2xl" 
                : "max-h-[700px] min-h-[450px]"
            }`}
          >
            {/* Top Document Header Bar */}
            <div className="sticky top-0 z-20 bg-[#020a22]/90 backdrop-blur-md border border-blue-900/40 p-3 rounded-xl flex items-center justify-between text-xs font-mono text-neutral-300 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="font-bold text-white ml-2">DOCUMENTO_CATALOGO_ALMANAQUES_2027.PDF</span>
              </div>
              <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20 font-bold">
                FORMATO AMPLIO • DESPLÁCESE HACIA ABAJO
              </span>
            </div>

            {/* Render Pages continuously so visitors can scroll through the entire PDF layout */}
            <div 
              className="space-y-12 transition-all mx-auto duration-200"
              style={{ width: `${pdfZoom}%`, maxWidth: "100%" }}
            >
              {displayPdfPages.map((page) => (
                <div 
                  key={page.id || page.pageNumber}
                  className="bg-[#030d2f]/90 border border-blue-900/60 rounded-2xl p-6 md:p-8 shadow-2xl space-y-4 hover:border-yellow-400/40 transition-all relative"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-blue-900/30 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                        Página {page.pageNumber} de {displayPdfPages.length} {page.subtitle ? `— ${page.subtitle}` : ""}
                      </span>
                      <h3 className="text-base font-bold text-white">{page.title}</h3>
                    </div>
                    <span className="text-[10px] font-mono bg-neutral-900 text-neutral-400 px-2.5 py-1 rounded border border-neutral-800">
                      Resolución 300 DPI
                    </span>
                  </div>

                  {/* High Resolution Page Banner Preview */}
                  <div className="w-full h-80 sm:h-[450px] rounded-xl overflow-hidden border border-blue-900/40 bg-slate-900 relative shadow-inner">
                    <img 
                      src={page.imageUrl} 
                      alt={page.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    
                    {/* Floating Watermark & Badge */}
                    <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-yellow-400/30 text-yellow-400 text-xs font-mono font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Atziluth Digital Muestrario
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 font-sans leading-relaxed bg-[#010514] p-3 rounded-xl border border-blue-900/30">
                    💡 <strong>Descripción Técnica:</strong> {page.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom PDF Footer */}
            <div className="text-center pt-6 pb-2 space-y-2">
              <span className="text-xs text-neutral-400 font-mono block">
                Fin del Documento de Muestrario de Almanaques
              </span>
              <button
                onClick={handleQuoteWhatsApp}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-emerald-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer hover:opacity-90 inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Cotizar este Diseño por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#030d32]/90 via-[#0a1845] to-[#030d32]/90 border border-yellow-500/20 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-white">¿Requieres un tiraje superior a 1.000 unidades o diseño especial?</h3>
          <p className="text-xs text-neutral-400">
            Brindamos descuentos por volumen especial para alcaldías, asociaciones, cooperativas y distribuidores en toda Antioquia.
          </p>
        </div>
        <button
          onClick={handleQuoteWhatsApp}
          className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Solicitar Cotización Especial
        </button>
      </div>
    </div>
  );
}
