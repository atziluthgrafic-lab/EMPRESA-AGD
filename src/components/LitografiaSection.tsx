import React, { useState, useMemo } from "react";
import { 
  Printer, 
  BookOpen, 
  Receipt, 
  Contact, 
  Flag, 
  Megaphone, 
  Gift, 
  Shirt, 
  Tag, 
  Palette, 
  Search, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  ThumbsUp,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LithoItem {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: React.ComponentType<any>;
  category: string;
  badge?: string;
  tagline: string;
  estimatedTime: string;
}

export default function LitografiaSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const categories = ["Todos", "Corporativo & Editorial", "Gran Formato & Avisos", "Dotación & Souvenirs", "Diseño & Marca"];

  const lithoItems: LithoItem[] = [
    {
      id: "brochures",
      title: "Brochures y Catálogos",
      description: "Diseño e impresión de folletos dípticos, trípticos y catálogos premium de alta calidad. Presenta la oferta de tu marca con una elegancia impecable.",
      details: "Impresión offset tradicional de gran definición o digital rápida de alta resolución, acabados mate/brillantes, papel propalcote importado de 150g a 300g.",
      icon: BookOpen,
      category: "Corporativo & Editorial",
      badge: "Más Vendido",
      tagline: "Folletería Profesional",
      estimatedTime: "2-4 días hábiles"
    },
    {
      id: "talonarios",
      title: "Talonarios y Factureros",
      description: "Talonarios de cuentas de cobro, recibos de caja, facturaciones oficiales, comandas gastronómicas y remisiones autocopiables con numeración consecutiva.",
      details: "Papel químico autocopiativo premium original y copias a color, numeración consecutiva garantizada, lomos reforzados y micro-perforado de alta precisión.",
      icon: Receipt,
      category: "Corporativo & Editorial",
      badge: "Obligatorio Pyme",
      tagline: "Papel Autocopiante Químico",
      estimatedTime: "3-5 días hábiles"
    },
    {
      id: "tarjetas",
      title: "Tarjetas de Presentación Personal",
      description: "Tarjetas de presentación personal que consolidan la primera impresión. Diseñadas para dejar huella memorables en tus clientes en Antioquia.",
      details: "Papel propalcote premium de 350g, plastificado premium mate o brillante, cortes de esquinas redondeadas opcionales, acabados con brillo UV parcial ultra premium.",
      icon: Contact,
      category: "Corporativo & Editorial",
      badge: "Presentación Premium",
      tagline: "Con Brillo UV Parcial de Alto Brillo",
      estimatedTime: "1-3 días hábiles"
    },
    {
      id: "pendones",
      title: "Pendones y Banners",
      description: "Pendones publicitarios y displays plegables de gran formato ideales para ferias, eventos corporativos regionales, decoración o fachadas físicas.",
      details: "Lona banner brillante o mate densa de 13oz, ojales metálicos inoxidables en esquinas para colgado fácil, trípodes/estructuras araña de aluminio.",
      icon: Flag,
      category: "Gran Formato & Avisos",
      badge: "Gran Alcance",
      tagline: "Soportes Fuertes y Duraderos",
      estimatedTime: "1-2 días hábiles"
    },
    {
      id: "avisos",
      title: "Avisos Publicitarios",
      description: "Avisos comerciales, vallas de alto impacto, cajas de luz LED translúcidas y letreros en acrílico, MDF, o lámina galvanizada para frentes de locales.",
      details: "Estructuras soldadas a medida, tecnología luminosa LED de bajo consumo, vinilos laminados con protección solar UV anti-decoloramiento.",
      icon: Megaphone,
      category: "Gran Formato & Avisos",
      badge: "Vitrinas Fuertes",
      tagline: "Avisos Luminosos e Interiores",
      estimatedTime: "5-9 días hábiles"
    },
    {
      id: "souvenirs",
      title: "Souvenirs y Regalos de Marca",
      description: "Mugs personalizados, bolígrafos retráctiles, llaveros inyectados, agendas de cuero sintético y termos promocionales marcados con tu logo.",
      details: "Tampografía de alta resistencia, grabado láser computarizado de alta presión, empaques individuales y opciones ecológicas sustentables.",
      icon: Gift,
      category: "Dotación & Souvenirs",
      badge: "Fidelización",
      tagline: "Recordación de Marca Diaria",
      estimatedTime: "4-7 días hábiles"
    },
    {
      id: "dotacion",
      title: "Dotación para Empresas",
      description: "Camisetas polo corporativas, gorras bordadas ultra estructuradas, chalecos acolchados de invierno, uniformes y delantales para personal.",
      details: "Bordado de alta densidad de hilos a todo color, estampados de larga vida útil (DTF, vinilo textil o serigrafía industrial), telas cómodas antifluido.",
      icon: Shirt,
      category: "Dotación & Souvenirs",
      badge: "Imagen Corporativa",
      tagline: "Presencia de Equipo Unificada",
      estimatedTime: "5-10 días hábiles"
    },
    {
      id: "adhesivos",
      title: "Adhesivos y Etiquetas",
      description: "Stickers corporativos y etiquetas troqueladas en vinilo resistente al agua para empaques de despachos, botellas, y sellos de seguridad.",
      details: "Vinilo premium de fondo blanco Matte/Glow o transparente, corte de contorno exacto mediante plotter digital, adhesivo acrílico de alta fijación.",
      icon: Tag,
      category: "Gran Formato & Avisos",
      badge: "Branding de Empaque",
      tagline: "Etiquetas Autoadhesivas a Medida",
      estimatedTime: "1-3 días hábiles"
    },
    {
      id: "diseno",
      title: "Creación de Diseños Digitales y Marcas",
      description: "Diseño gráfico profesional para entornos digitales y físicos, creación de logotipos memorables y manuales de identidad visual integral.",
      details: "Entregables vectoriales masterizado (.AI, .SVG, .PDF, .PNG), optimizados técnica y cromáticamente para impresión offset y visualización digital en pantallas.",
      icon: Palette,
      category: "Diseño & Marca",
      badge: "Atziluth Sello Creación",
      tagline: "Identidad Visual Exclusiva",
      estimatedTime: "3-7 días hábiles"
    }
  ];

  const filteredItems = useMemo(() => {
    return lithoItems.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === "Todos" || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleQuoteOnWhatsApp = (itemTitle: string) => {
    const text = `Hola Atziluth Digital! Me interesa cotizar el servicio de publicidad litográfica para: *${itemTitle}*. Quisiera recibir asesoría y opciones de precios de impresión.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/573001254321?text=${encodedText}`, "_blank");
  };

  return (
    <div className="space-y-12">
      {/* Dynamic Header Block with Floating Printers / Litho Visual context */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-950/50 border border-yellow-800/40 rounded-full text-[10px] font-mono text-yellow-400">
          <Printer className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
          Servicio Nacional de Impresión & Litografía Industrial
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none font-sans">
          Publicidad <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-emerald-400">Litográfica Premium</span>
        </h2>
        <p className="text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Materializa la presencia física de tu negocio en cualquier municipio de Antioquia. Combinamos el arte del diseño digital vectorial moderno con técnicas de impresión industrial offset y de gran formato de alta precisión para maximizar tu impacto comercial.
        </p>
      </div>

      {/* Trust guarantees badge list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-2">
        <div className="bg-[#030e2f]/50 border border-blue-900/20 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Calidad Industrial</h4>
            <p className="text-[10px] text-neutral-400">Tintas premium y papeles importados.</p>
          </div>
        </div>
        <div className="bg-[#030e2f]/50 border border-blue-900/20 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Tiempos Optimizados</h4>
            <p className="text-[10px] text-neutral-400">Impresión rápida y despachos coordinados.</p>
          </div>
        </div>
        <div className="bg-[#030e2f]/50 border border-blue-900/20 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Asistencia de Diseño</h4>
            <p className="text-[10px] text-neutral-400">Revisión de sangrados y vectores gratis.</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-[#020a22]/70 border border-blue-950/50 rounded-2xl p-4 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category sliders */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-yellow-400 text-neutral-950 border border-yellow-300"
                  : "bg-[#030d2d]/60 border border-blue-900/30 text-neutral-300 hover:border-blue-900/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto litográfico..."
            className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>
      </div>

      {/* Services Bento Grid */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => {
                const IconComponent = item.icon;
                const isExpanded = activeItem === item.id;
                return (
                  <motion.div
                    layout
                    key={item.id}
                    onClick={() => setActiveItem(isExpanded ? null : item.id)}
                    className={`bg-[#020a22]/75 border rounded-2xl p-5 hover:border-blue-900/70 transition-all flex flex-col justify-between cursor-pointer group hover:bg-[#030e32]/65 relative overflow-hidden ${
                      isExpanded ? "border-yellow-400 shadow-lg shadow-yellow-500/5 col-span-1 sm:col-span-2 lg:col-span-1" : "border-blue-900/30"
                    }`}
                  >
                    {/* Decorative Background Glows */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-full pointer-events-none group-hover:scale-125 transition-transform" />

                    <div className="space-y-4">
                      {/* Top Row with Icon, Category & optional Badge */}
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#020a22] to-[#12224d] flex items-center justify-center text-yellow-400 border border-blue-900/30 group-hover:border-yellow-400/30 group-hover:scale-105 transition-all">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-bold tracking-wide uppercase px-2.5 py-1 bg-yellow-450/10 text-yellow-400 border border-yellow-800/30 rounded-lg">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline info */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                          {item.tagline}
                        </span>
                        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-yellow-400 transition-colors">
                          {item.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        {item.description}
                      </p>

                      {/* Expandable Extended Details Container */}
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-blue-900/20 space-y-3 font-sans text-xs text-neutral-400"
                        >
                          <div>
                            <strong className="text-white block pb-1">⚙️ Ficha Técnica / Materiales:</strong>
                            <p>{item.details}</p>
                          </div>
                          <div className="flex items-center justify-between bg-[#020516] p-2.5 rounded-xl border border-blue-900/25">
                            <span className="text-[11px] font-mono text-neutral-500">⏳ Tiempo Estimado:</span>
                            <span className="text-white font-mono font-bold text-[11px] bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">{item.estimatedTime}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Footer Row with Cotizar action & arrow trigger info */}
                    <div className="mt-6 pt-4 border-t border-blue-900/20 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-mono text-[10px] group-hover:text-neutral-300 transition-colors">
                        {isExpanded ? "Haz clic para cerrar" : "Ver especificaciones"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuoteOnWhatsApp(item.title);
                        }}
                        className="px-3.5 py-1.5 bg-[#030e2f] hover:bg-yellow-400 group-hover:bg-yellow-400 text-yellow-400 hover:text-neutral-950 group-hover:text-neutral-950 rounded-xl font-bold font-sans text-xs transition-all flex items-center gap-1.5 border border-yellow-400/30 hover:border-yellow-400 cursor-pointer shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Cotizar
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-[#020a22]/30 border border-blue-900/20 rounded-2xl p-8 max-w-xl mx-auto space-y-4"
            >
              <Printer className="w-12 h-12 text-neutral-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No se encontraron productos</h4>
                <p className="text-xs text-neutral-400">Prueba ajustando los términos de búsqueda o selecciona otra categoría.</p>
              </div>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-mono text-white"
              >
                Restablecer Filtros
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Promotion card footer for Atziluth branding */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#030d32]/80 via-[#0a1845]/90 to-[#030d32]/80 border border-yellow-500/10 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[9px] font-mono uppercase bg-yellow-400/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-full font-bold">
            Asesoría Personalizada Sin Costo
          </span>
          <h3 className="text-lg md:text-xl font-black text-white">¿Tienes un proyecto de impresión a gran escala o medidas especiales?</h3>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Nuestros asesores técnicos en litografía te acompañan en la elección idónea de gramajes, papeles químicos y terminados especiales. Atendemos pedidos de todo tipo a nivel departamental.
          </p>
        </div>
        <button
          onClick={() => handleQuoteOnWhatsApp("Presupuesto Personalizado Litografía")}
          className="px-6 py-3.5 bg-gradient-to-r from-yellow-400 to-emerald-500 text-neutral-950 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-yellow-500/10 cursor-pointer shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp Asesor Litográfico
        </button>
      </div>
    </div>
  );
}
