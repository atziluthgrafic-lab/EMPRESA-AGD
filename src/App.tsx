import React, { useState, useEffect } from "react";
import InteractiveMap from "./components/InteractiveMap";
import MunicipalDirectory from "./components/MunicipalDirectory";
import AIWorkspace from "./components/AIWorkspace";
import PricingCalculator from "./components/PricingCalculator";
import ContactForm from "./components/ContactForm";
import LitografiaSection from "./components/LitografiaSection";
import { SubregionId } from "./types";
import {
  Sparkles,
  Bot,
  Activity,
  Award,
  Users,
  Building,
  ArrowRight,
  MessageSquare,
  Globe,
  Plus,
  Eye,
  CheckCircle2,
  Sliders,
  Play,
  Share2,
  TrendingUp,
  MapPin,
  Menu,
  Utensils,
  ArrowLeft,
  Lock,
  X,
  Printer,
  BookOpen,
  Receipt,
  Contact,
  Flag,
  Megaphone,
  Gift,
  Shirt,
  Tag,
  Palette
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import imageWebDesign from "./assets/images/web_design_mockup_1781555140934.jpg";
// @ts-ignore
import imageRestaurantApp from "./assets/images/restaurant_app_mockup_1781556838053.jpg";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Shared state connecting Mapa, Directorio, and AI Workspace
  const [activeMuni, setActiveMuni] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<SubregionId | null>(null);
  const [activeTab, setActiveTab] = useState<"servicios" | "litografia" | "mapa" | "directorio" | "ia" | "tarifas">("servicios");

  // Mobile menu expand/collapse state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Testimonials slide index state
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Image customizer configuration state
  const [imageConfig, setImageConfig] = useState<{
    webDesignMockup: string;
    restaurantAppMockup: string;
    municipalDirectoryBanner: string;
    customBusinesses?: Array<{
      id: string;
      name: string;
      category: string;
      imageUrl: string;
    }>;
    customAds?: Array<{
      id: string;
      tag: string;
      caption: string;
      imageUrl: string;
    }>;
    categories?: string[];
  }>({
    webDesignMockup: "",
    restaurantAppMockup: "",
    municipalDirectoryBanner: "",
    customBusinesses: [],
    customAds: [],
    categories: []
  });

  // Admin panel open/close state
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Home portfolio showcase slider state
  const [activeSlide, setActiveSlide] = useState(0);

  // Active state for specialized transaccional industry specifications
  const [activeIndustrySystem, setActiveIndustrySystem] = useState<"restaurants" | "spas" | "parking" | "laundromats" | "hotels">("restaurants");

  const sliderImages = [
    {
      id: "cafe-la-palma",
      src: imageConfig.webDesignMockup || imageWebDesign,
      tag: "MOCKUP REAL COMPLETO — CAFÉ LA PALMA",
      caption: "Café La Palma — Sitio corporativo y menú digital interactivo para captar turismo internacional.",
      detailedTitle: "Portal Turístico con Menú QR — Café La Palma",
      detailedDesc: "Desarrollo completo de portal corporativo bajo estándares de velocidad ultra rápidos para optimizar conexiones móviles en el Suroeste de Antioquia (Jardín / Jericó). Cuenta con menú dinámico bilingüe de traducción en tiempo real, catálogo interactivo de café con pasarela de consulta directa, mapa autogestionado de atracciones del municipio y call-to-actions estratégicos direccionados a WhatsApp Business para un aumento en ventas del 140%.",
      techSpecs: [
        "Menú QR Bilingüe Autogestionado",
        "Diseño SEO Optimizado Suroeste",
        "Reservas Directas en un Click",
        "Compresión de Imágenes para Veredas",
        "Integración WhatsApp Multi-agente"
      ]
    },
    {
      id: "pedidos-gourmet",
      src: imageConfig.restaurantAppMockup || imageRestaurantApp,
      tag: "MOCKUP REAL COMPLETO — APLICATIVO GOURMET",
      caption: "Aplicación de Pedidos Gourmet — Solución de alta velocidad con checkout inmediato y recaudo integrado via Nequi/PSE.",
      detailedTitle: "Aplicativo Web Integrado de Pedidos y Delivery",
      detailedDesc: "Software tipo web-app adaptivo que elimina las comisiones de intermediarios de domicilio. Cuenta con carga instantánea asíncrona, categorización inteligente para restaurantes, calculadora integrada de costos de despacho según la distancia del cliente en el municipio, botón directo para pagos PSE o Nequi y panel autónomo para rastrear pedidos pendientes, minimizando los tiempos de despacho y el soporte operativo.",
      techSpecs: [
        "Pasarela Nequi, Daviplata y PSE",
        "Cálculo Automático de Domicilios",
        "Panel Autónomo de Pedidos",
        "Estructura SPA de Alta Velocidad",
        "Impresión de Comandas Simplificada"
      ]
    },
    ...(imageConfig.customAds || []).map((ad) => ({
      id: ad.id,
      src: ad.imageUrl,
      tag: (ad.tag || "ANUNCIO PUBLICITARIO").toUpperCase(),
      caption: ad.caption || "Anuncio promocional activo diseñado por Atziluth para amplificar la visibilidad de tu marca.",
      detailedTitle: `Campaña Digital — ${(ad.tag || "Anuncio Premium").substring(0, 32)}`,
      detailedDesc: `Estrategia de posicionamiento de marca diseñada por Atziluth. Incluye una pieza publicitaria estructurada estéticamente mediante análisis cromático de retención local. Esta campaña SEO de Meta Ads y Google Maps redirige el tráfico objetivo hacia canales de alta conversión sin fugas de usuarios, garantizando un Retorno de Inversión (ROI) optimizado en cada zona del departamento.`,
      techSpecs: [
        "Optimización de Diseño para Conversión",
        "Pauta Hiperlocal Georruteada",
        "Monitoreo de Clicks 24/7",
        "Enlace Directo sin Intermediarios",
        "Adaptable a Canales de WhatsApp"
      ]
    })),
    ...(imageConfig.customBusinesses || []).map((biz) => ({
      id: biz.id,
      src: biz.imageUrl,
      tag: `${(biz.category || "General").toUpperCase()} — ${(biz.name || "Sin Nombre").toUpperCase()}`,
      caption: `Comercio afiliado catalogado en ${biz.category || "General"}: ${biz.name || "Negocio"}. Sitio web a la medida diseñado por Atziluth para amplificar el alcance de sus ventas.`,
      detailedTitle: `Portal Web & SEO Local — ${biz.name || "Comercio Afiliado"}`,
      detailedDesc: `Desarrollo web adaptativo llave en mano creado para posicionar la oferta de ${biz.name} en la categoría de ${biz.category} en el municipio de ${biz.municipality || "Antioquia"}. Cuenta con optimización para indexación rápida de Google Search y Google Maps, botón flotante de WhatsApp directo al teléfono del comercio (${biz.phone || "por configurar"}) y un enlace corporativo ultra confiable para respaldar la interacción comercial con clientes reales.`,
      techSpecs: [
        `Indexación Google Maps ${biz.municipality || ""}`,
        "Botón de Contacto Express",
        "Estructura Código Limpia",
        "Apto para Conexiones Lentas 3G",
        "Visualización en Múltiples Pantallas"
      ]
    }))
  ];

  const safeActiveSlide = activeSlide < sliderImages.length ? activeSlide : 0;

  // Fetch customizable image settings from server on boot with automatic localStorage fallback when container resets
  useEffect(() => {
    const fetchImageSettings = async () => {
      try {
        const response = await fetch("/api/config/images");
        const data = await response.json();
        if (response.ok && data.success && data.config) {
          const serverConfig = data.config;
          const hasServerData = 
            (serverConfig.customBusinesses && serverConfig.customBusinesses.length > 0) ||
            (serverConfig.customAds && serverConfig.customAds.length > 0) ||
            serverConfig.webDesignMockup ||
            serverConfig.restaurantAppMockup ||
            serverConfig.municipalDirectoryBanner;

          const localStored = localStorage.getItem("atziluth_custom_config");
          if (localStored) {
            try {
              const parsedLocal = JSON.parse(localStored);
              const hasLocalData = 
                (parsedLocal.customBusinesses && parsedLocal.customBusinesses.length > 0) ||
                (parsedLocal.customAds && parsedLocal.customAds.length > 0) ||
                parsedLocal.webDesignMockup ||
                parsedLocal.restaurantAppMockup ||
                parsedLocal.municipalDirectoryBanner;

              // If the server was recently restarted (contains defaults / no custom data) but local storage has data, restore it!
              if (!hasServerData && hasLocalData) {
                console.log("Restoring configurations from local browser storage due to container reset...");
                setImageConfig(parsedLocal);

                // Auto-sync back to server in background if the login token is somehow still active
                const token = localStorage.getItem("atziluth_admin_token");
                if (token) {
                  fetch("/api/admin/config", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(parsedLocal)
                  }).catch(console.error);
                }
                return;
              }
            } catch (err) {
              console.error("Failed to parse local stored configuration:", err);
            }
          }
          setImageConfig(serverConfig);
        }
      } catch (err) {
        console.error("Error fetching dynamic image configurations:", err);
        // Direct backup load on network failure
        const localStored = localStorage.getItem("atziluth_custom_config");
        if (localStored) {
          try {
            setImageConfig(JSON.parse(localStored));
          } catch (_) {}
        }
      }
    };
    fetchImageSettings();
  }, []);

  React.useEffect(() => {
    if (sliderImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  // Floating WhatsApp panel toggle state
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  // Testimonials Array
  const testimonials = [
    {
      name: "Julián Gómez",
      role: "Fundador de EcoGlamping Guatapé",
      quote: "Gracias al embudo de reservas diseñado por Atziluth, logramos un 140% de incremento en reservas los fines de semana. La automatización con IA resolvió el soporte a clientes al instante.",
      location: "Guatapé, Oriente",
      rating: 5,
    },
    {
      name: "Marlen Serna",
      role: "Gerente Comercial de Lácteos Santa Rosa",
      quote: "La campaña de Meta Ads geovallada en Medellín multiplicó las compras mayoristas de nuestros quesos madurados. Atziluth entendió las dinámicas del Norte a la perfección.",
      location: "Santa Rosa de Osos, Norte",
      rating: 5,
    },
    {
      name: "Andrés Restrepo",
      role: "Director de Exportaciones Urabá Bananas",
      quote: "Nuestro portal corporativo B2B adaptado para transporte y logística en puerto es veloz y profesional. Nos abrió puertas con socios internacionales en tiempo récord.",
      location: "Apartadó, Urabá",
      rating: 5,
    },
  ];

  // Services list
  const services = [
    {
      title: "Desarrollo y Aplicativos Web para Restaurantes",
      desc: "Desarrollamos portales gastronómicos interactivos y aplicativos de software especializados para restaurantes, cafés y turismo regional. Menús digitales autogestionables con pasarelas de pago locales (Nequi, PSE) y sistemas de pedidos eficientes de alta velocidad.",
      features: ["Menú QR Interactivo Móvil", "Pasarela de Pagos (Nequi/PSE)", "Panel de Control Autónomo", "Optimización Ultra Rápida"],
      icon: <Utensils className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Publicidad Digital Inteligente",
      desc: "Campañas enfocadas en retorno real de inversión en Google Ads, Google Maps geovallado e Instagram/Meta Ads. Capturamos la intención activa de compra.",
      features: ["Segmentación Hiperlocal por Comunas/Veredas", "Informes en Tiempo Real", "Ajustes de Puja Diarios"],
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Fusión AI Atziluth (Gemini Integrado)",
      desc: "Implementamos flujos generativos de Google Gemini en tu negocio. Generadores de descripciones de producto automatizados, chatbots inteligentes de ventas y más.",
      features: ["Modelos Gemini 3.5 Avanzados", "Copywriting de Conversión Autómata", "Auditorías de Interfaz Inteligentes"],
      icon: <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />,
    },
  ];

  // Specialized transactional system specifications by industry
  const industrySystems = [
    {
      id: "restaurants",
      title: "Restaurantes & Bares 🍔",
      subtitle: "Sistema de Pedidos, Ventas & Delivery",
      icon: <Utensils className="w-5 h-5 text-emerald-400" />,
      desc: "Web-apps asíncronas adaptadas a comercio gastronómico en Antioquia. Permiten comprar y programar domicilios sin pagar comisiones a plataformas externas, con calculadora integrada de flete por distancias.",
      features: [
        "Menú QR bilingüe autogestionable",
        "Calculación automática de domicilios",
        "Checkout asíncrono express",
        "Envío directo de comanda por WhatsApp",
        "Pasarela Nequi, Daviplata y PSE"
      ]
    },
    {
      id: "spas",
      title: "Estética & Spas 🌸",
      subtitle: "Motor de Agendamiento Online",
      icon: <Palette className="w-5 h-5 text-purple-400" />,
      desc: "Software de reservación con calendarios digitales interactivo en tiempo real para centros de estética, reiki, barberías o clínicas de terapia de la región.",
      features: [
        "Calendario interactivo en tiempo real",
        "Módulo de selección de profesionales",
        "Recordatorios de citas automáticas",
        "Módulo de depósito / reserva PSE/Nequi",
        "Reducción del 95% de inasistencias"
      ]
    },
    {
      id: "parking",
      title: "Parqueaderos 🚗",
      subtitle: "Control de Cupos & Pago Express",
      icon: <Building className="w-5 h-5 text-sky-400" />,
      desc: "Plataformas interconectadas para administración de parqueos públicos o municipales. Evitan filas cobrando tarifas según las horas exactas de estadía.",
      features: [
        "Indicador digital de celdas disponibles",
        "Pago exprés con lectura de ticket QR",
        "Gestión y cobro de abonos mensuales",
        "Auditoría administrativa de caja",
        "Ruta geográfica con Google Maps"
      ]
    },
    {
      id: "laundromats",
      title: "Lavanderías 🧼",
      subtitle: "Simulador de Peso & Despacho",
      icon: <Shirt className="w-5 h-5 text-cyan-400" />,
      desc: "Páginas transaccionales ideales para lavanderías locales que desean agendar recolecciones a domicilio, simular tarifas por peso u organizar despachos.",
      features: [
        "Cotizador inteligente de peso en libras",
        "Agendamiento automático de recogida",
        "Rastreo de proceso en vivo (lavado/secado)",
        "Notificaciones directas al teléfono",
        "Diseño ultra optimizado en datos 3G"
      ]
    },
    {
      id: "hotels",
      title: "Hoteles & Glamping 🏨",
      subtitle: "Motor de Reservaciones Turísticas",
      icon: <Globe className="w-5 h-5 text-yellow-400" />,
      desc: "Sistemas directos para hostales, cabañas, fincas recreativas y glampings de Antioquia. Eliminan intermediaciones y promueven la venta de paquetes turísticos regionales.",
      features: [
        "Calendario de ocupancia en vivo (PMS)",
        "Tarifas dinámicas por temporada baja/alta",
        "Venta cruzada de tours y experiencias",
        "Generador automático de vouchers PDF",
        "Carga instantánea de imágenes HD"
      ]
    }
  ];

  const handleTriggerAIWorkspace = (muni: string, subregion: SubregionId) => {
    setActiveMuni(muni);
    setActiveSub(subregion);
    setActiveTab("ia");
    // Scroll directly to AI Workspace smoothly
    setTimeout(() => {
      const target = document.getElementById("seccion-activa-contenedor");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleClearPreselections = () => {
    setActiveMuni(null);
    setActiveSub(null);
  };

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Unified helper to navigate to local service assistance form
  const handleAsistenciaLocal = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    if (activeTab !== "servicios") {
      setActiveTab("servicios");
      setTimeout(() => {
        const target = document.getElementById("contacto-seccion");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, 180);
    } else {
      const target = document.getElementById("contacto-seccion");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 font-sans selection:bg-brand-magenta selection:text-white overflow-x-hidden relative">
      {/* Eye-catching flag strips at the absolute top representing Colombia (Yellow-Blue-Red) and Antioquia (White-Green) */}
      <div className="sticky top-0 z-50 w-full h-[6px] grid grid-cols-6 pointer-events-none">
        <div className="bg-[#fcd116] h-full shadow-[0_2px_10px_rgba(252,209,22,0.4)]" />
        <div className="bg-[#003893] h-full shadow-[0_2px_10px_rgba(0,56,147,0.4)]" />
        <div className="bg-[#ce1126] h-full shadow-[0_2px_10px_rgba(206,17,38,0.4)]" />
        <div className="bg-white h-full shadow-[0_2px_10px_rgba(200,200,200,0.4)]" />
        <div className="bg-[#009e5a] h-full shadow-[0_2px_10px_rgba(0,158,90,0.4)]" />
        <div className="bg-[#007f45] h-full shadow-[0_2px_10px_rgba(0,127,69,0.4)]" />
      </div>

      {/* Absolute top grid effects using the exact vibrant brand color splashes (Magenta, Cyan, Orange) with light, soft touch */}
      <div className="absolute top-0 inset-x-0 h-[700px] bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.07),transparent_50%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.07),transparent_50%),radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.06),transparent_50%)] pointer-events-none z-0" />
      <div className="absolute top-0 inset-x-0 h-[800px] bg-[linear-gradient(to_right,rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_75%,transparent_100%)] pointer-events-none z-0" />

      {/* 1. NAVIGATION BAR */}
      <nav className="sticky top-[6px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setActiveTab("servicios");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-md flex items-center justify-center bg-slate-50 group-hover:border-brand-magenta/50 transition-colors">
              <img 
                src="/src/assets/images/logo_atziluth_1781713306778.jpg" 
                alt="Logo Atziluth" 
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight block text-slate-900 group-hover:text-brand-magenta transition-colors">ATZILUTH</span>
              <span className="text-[9px] text-brand-orange font-mono tracking-widest uppercase block leading-none font-bold">
                Gráfic Digital
              </span>
            </div>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-mono font-bold">
            <button
              onClick={() => {
                setActiveTab("servicios");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition-colors cursor-pointer py-1.5 px-0.5 border-b-2 ${
                activeTab === "servicios" 
                  ? "text-brand-magenta border-brand-magenta" 
                  : "text-slate-600 border-transparent hover:text-brand-magenta hover:border-brand-magenta/35"
              }`}
            >
              SERVICIOS
            </button>
            <button
              onClick={() => {
                setActiveTab("litografia");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition-colors cursor-pointer py-1.5 px-0.5 border-b-2 ${
                activeTab === "litografia" 
                  ? "text-brand-orange border-brand-orange" 
                  : "text-slate-600 border-transparent hover:text-brand-orange hover:border-brand-orange/35"
              }`}
            >
              PUBLICIDAD LITOGRÁFICA
            </button>
            <button
              onClick={() => {
                setActiveTab("mapa");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition-colors cursor-pointer py-1.5 px-0.5 border-b-2 ${
                activeTab === "mapa" 
                  ? "text-brand-cyan border-brand-cyan" 
                  : "text-slate-600 border-transparent hover:text-brand-cyan hover:border-brand-cyan/35"
              }`}
            >
              MAPA INTERACTIVO
            </button>
            <button
              onClick={() => {
                setActiveTab("directorio");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition-colors cursor-pointer py-1.5 px-0.5 border-b-2 ${
                activeTab === "directorio" 
                  ? "text-brand-yellow border-brand-yellow" 
                  : "text-slate-600 border-transparent hover:text-brand-yellow hover:border-brand-yellow/35"
              }`}
            >
              DIRECTORIO PYME
            </button>
            <button
              onClick={() => {
                setActiveTab("ia");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition-colors cursor-pointer flex items-center gap-1 py-1.5 px-0.5 border-b-2 ${
                activeTab === "ia" 
                  ? "text-brand-magenta border-brand-magenta" 
                  : "text-slate-600 border-transparent hover:text-brand-magenta hover:border-brand-magenta/35"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              IA WORKSPACE
            </button>
            <button
              onClick={() => {
                setActiveTab("tarifas");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition-colors cursor-pointer py-1.5 px-0.5 border-b-2 ${
                activeTab === "tarifas" 
                  ? "text-brand-orange border-brand-orange" 
                  : "text-slate-600 border-transparent hover:text-brand-orange hover:border-brand-orange/35"
              }`}
            >
              TARIFAS
            </button>
          </div>

          <div className="hidden md:block">
            <button
              onClick={handleAsistenciaLocal}
              className="px-4 py-2 bg-gradient-to-r from-brand-magenta via-brand-orange to-brand-cyan text-white text-xs font-bold font-mono rounded-xl transition-all cursor-pointer hover:opacity-90 shadow-sm"
            >
              ASISTENCIA LOCAL
            </button>
          </div>

          {/* Mobile Menu Expandable Trigger (Hamburger) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-neutral-300 hover:text-white focus:outline-none transition-colors border border-blue-900/30 rounded-xl bg-[#030e2f]/50 cursor-pointer"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Menu Panel on Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden border-t border-blue-900/45 bg-[#020921]/95 backdrop-blur-xl overflow-hidden shadow-2xl relative z-50"
            >
              <div className="px-4 py-5 space-y-3 font-mono text-sm max-h-[85vh] overflow-y-auto">
                {[
                  { id: "servicios", label: "🏢 SERVICIOS" },
                  { id: "litografia", label: "🖨️ PUBLICIDAD LITOGRÁFICA" },
                  { id: "mapa", label: "🗺️ MAPA INTERACTIVO" },
                  { id: "directorio", label: "📂 DIRECTORIO PYME" },
                  { id: "ia", label: "✨ IA WORKSPACE", glow: true },
                  { id: "tarifas", label: "📊 TARIFAS / PRECIOS" },
                ].map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setActiveTab(item.id as any);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#030d2d] border-yellow-400 text-yellow-400 font-bold shadow-md shadow-yellow-500/10"
                          : "bg-[#020a22]/80 border-blue-900/30 text-slate-300 hover:border-blue-900/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.glow && <span className="w-2 h-2 rounded-full bg-[#fcd116] animate-pulse" />}
                        {item.label}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-yellow-950 px-2 py-0.5 rounded-md border border-yellow-800 text-yellow-400">
                          Activo
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-4 border-t border-blue-900/40">
                  <button
                    onClick={handleAsistenciaLocal}
                    className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-emerald-500 hover:from-yellow-350 hover:to-emerald-450 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
                  >
                    🚀 SOLICITAR ASISTENCIA LOCAL
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.99, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-16"
          >
            {activeTab === "servicios" && (
              <>
                {/* 2. HERO SECTION */}
                <section className="text-center py-6 lg:py-12 space-y-6 max-w-4xl mx-auto">
                  {/* Tagline Badge - Colombia & Antioquia Regional Hybrid Badge */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-mono shadow-md">
                      <span className="flex gap-0.5">
                        <span className="w-2 h-3.5 bg-[#fcd116] rounded-xs" />
                        <span className="w-2 h-3.5 bg-[#003893] rounded-xs" />
                        <span className="w-2 h-3.5 bg-[#ce1126] rounded-xs" />
                      </span>
                      <span className="text-brand-orange font-bold uppercase tracking-wider">Sello Colombia</span>
                      <span className="text-slate-400">|</span>
                      <span className="flex gap-0.5">
                        <span className="w-2 h-3.5 bg-white border border-slate-200 rounded-xs" />
                        <span className="w-2 h-3.5 bg-[#009e5a] rounded-xs" />
                      </span>
                      <span className="text-emerald-500 font-bold uppercase tracking-wider">Antioquia Territorial</span>
                    </div>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-3xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-sans">
                    Creación Web & Publicidad para los <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta via-brand-orange via-brand-yellow via-brand-cyan to-brand-magenta bg-size-200 animate-pulse">125 Municipios</span> de Antioquia
                  </h1>

                  {/* Slogan from the logo */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono font-black tracking-widest text-brand-orange uppercase bg-slate-100/80 py-2.5 px-4 rounded-xl border border-slate-200 max-w-3xl mx-auto shadow-sm">
                    <span>Diseño Gráfico</span>
                    <span className="text-brand-magenta">•</span>
                    <span>Publicidad</span>
                    <span className="text-brand-cyan">•</span>
                    <span>Multimedia</span>
                    <span className="text-brand-yellow">•</span>
                    <span>Imagen</span>
                    <div className="w-full text-center mt-1 text-[11px] text-brand-cyan font-sans font-extrabold tracking-normal">
                      ¡Creamos Impacto Visual!
                    </div>
                  </div>

                  <p className="text-slate-650 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans">
                    En <strong>Atziluth Gráfic Digital</strong> impulsamos negocios regionales —desde glampings en Guatapé hasta lecheras en Santa Rosa de Osos— implementando portales web ultrarrápidos y campañas geofocalizadas optimizadas con Inteligencia Artificial.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                      onClick={() => {
                        setActiveTab("mapa");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-magenta via-brand-orange to-brand-cyan hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-magenta/15 cursor-pointer"
                    >
                      Explorar Territorio de Antioquia
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("ia");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Bot className="w-4 h-4 text-brand-magenta animate-bounce" />
                      Probar Atziluth IA Studio
                    </button>
                  </div>
                </section>

                {/* 3. CORE STATISTICS COUNTERS */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-brand-yellow/[0.03] blur-xl pointer-events-none" />
                  
                  <div className="text-center p-3">
                    <span className="text-3xl lg:text-4xl font-black text-brand-orange font-mono block">125</span>
                    <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono mt-1 block">Municipios Cubiertos</span>
                  </div>
                  
                  <div className="text-center p-3 border-l border-slate-100">
                    <span className="text-3xl lg:text-4xl font-black text-slate-800 font-mono block">1.430+</span>
                    <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono mt-1 block">Marcas Lanzadas</span>
                  </div>

                  <div className="text-center p-3 border-l border-slate-100">
                    <span className="text-3xl lg:text-4xl font-black text-emerald-500 font-mono block">9</span>
                    <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono mt-1 block">Subregiones Activas</span>
                  </div>

                  <div className="text-center p-3 border-l border-slate-100">
                    <span className="text-3xl lg:text-4xl font-black text-brand-cyan font-mono block">24/7</span>
                    <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono mt-1 block">Tráfico Monitoreado</span>
                  </div>
                </section>

                {/* 4. SERVICES INTERACTIVE GRID */}
                <section className="space-y-10" id="servicios">
                  <div className="text-center space-y-2 max-w-2xl mx-auto">
                    <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-widest block">PORTAFOLIO COMERCIAL</span>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight font-sans">Soluciones Modernas para Comercio Regional</h2>
                    <p className="text-slate-650 text-xs font-sans">Alineamos los canales digitales de tu negocio para canalizar el tráfico y aumentar tus transacciones de manera medible.</p>
                  </div>

                  {/* FEATURED DESIGN & DEVELOPMENT CARD */}
                  <div 
                    className="bg-white border border-slate-200 p-6 md:p-8 lg:p-10 rounded-3xl hover:border-brand-magenta/40 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-all group relative overflow-hidden animate-fade-in"
                    id="desarrollo-web-destacado"
                  >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/[0.02] blur-3xl rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
                    
                    <div className="space-y-8">
                      {/* Top: Sliding interactive showcase banner */}
                      <div className="relative w-full space-y-3 overflow-hidden">
                        <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-magenta via-brand-orange to-brand-cyan rounded-3xl blur-lg opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
                        
                        {/* Interactive Dropdown Selector of Comercios/Proyectos at the header */}
                        <div className="relative z-30 bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                          <span className="text-xs font-mono font-bold text-brand-orange uppercase flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Seleccionar Comercio o Demostrativo:
                          </span>
                          <select
                            value={safeActiveSlide}
                            onChange={(e) => setActiveSlide(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 font-sans font-bold cursor-pointer focus:outline-none focus:border-brand-magenta max-w-full sm:max-w-xs transition-with-shadow hover:shadow-sm"
                          >
                            {sliderImages.map((img, idx) => (
                              <option key={idx} value={idx}>
                                {img.tag.replace("MOCKUP REAL COMPLETO — ", "")}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-2 sm:p-4 overflow-hidden min-h-[300px] sm:min-h-[420px] md:min-h-[480px] flex flex-col justify-between shadow-inner">
                          
                          {/* Left / Right manual navigation arrows */}
                          <div className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-4 z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setActiveSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
                              }}
                              className="p-2 sm:p-3 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-md active:scale-95"
                              title="Anterior"
                            >
                              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>

                          <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setActiveSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
                              }}
                              className="p-2 sm:p-3 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-md active:scale-95"
                              title="Siguiente"
                            >
                              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>

                          {/* Image Box */}
                          <div className="relative w-full flex-grow overflow-hidden flex items-center justify-center py-4">
                            <AnimatePresence initial={false} mode="wait">
                              <motion.div
                                key={activeSlide}
                                initial={{ opacity: 0, x: 250 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -250 }}
                                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                                className="w-full flex justify-center items-center"
                              >
                                <img
                                  src={sliderImages[safeActiveSlide].src}
                                  alt={sliderImages[safeActiveSlide].caption}
                                  className="w-full max-h-[220px] sm:max-h-[360px] md:max-h-[420px] object-contain rounded-xl transition-all duration-300 mx-auto block"
                                  referrerPolicy="no-referrer"
                                />
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          {/* Indicator dots centered at the bottom of the frame */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm backdrop-blur-md">
                            {sliderImages.map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setActiveSlide(idx);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${idx === safeActiveSlide ? "bg-brand-orange w-5" : "bg-slate-300 hover:bg-slate-400"}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Caption outside and beneath the image slider, preserving full details */}
                        <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-left shadow-sm">
                          <span className="text-[10px] text-brand-orange font-mono block font-black uppercase tracking-wider">
                            {sliderImages[safeActiveSlide].tag}
                          </span>
                          <span className="text-sm text-slate-800 block mt-0.5 leading-tight font-bold font-sans">
                            {sliderImages[safeActiveSlide].caption}
                          </span>
                        </div>
                      </div>

                      {/* Bottom/Grid: Text Content description and features */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
                        {/* Left: Main info */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-[10px] font-mono font-bold text-brand-cyan">
                            <Globe className="w-3.5 h-3.5 text-brand-cyan" />
                            SERVICIO REGIONAL LÍDER
                          </div>
                          
                          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight hover:text-brand-magenta transition-colors">
                            {sliderImages[safeActiveSlide]?.detailedTitle || services[0].title}
                          </h3>
                          
                          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-sans">
                            {sliderImages[safeActiveSlide]?.detailedDesc || services[0].desc}
                          </p>
                        </div>

                        {/* Right: Technical Features & Actions */}
                        <div className="lg:col-span-5 space-y-6">
                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                            <h4 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Especificaciones de Entrega</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(sliderImages[safeActiveSlide]?.techSpecs || services[0].features).map((f, fIdx) => (
                                <div key={fIdx} className="text-xs text-slate-750 flex items-center gap-2 font-mono">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-sm" />
                                  <span className="truncate">{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => {
                                setActiveTab("tarifas");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="w-full sm:w-1/2 px-5 py-3.5 bg-gradient-to-r from-brand-orange to-brand-yellow hover:opacity-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-brand-orange/15 cursor-pointer text-center"
                            >
                              Calcular Cotización Web
                            </button>
                            <button
                              onClick={handleAsistenciaLocal}
                              className="w-full sm:w-1/2 px-5 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs transition-all font-bold text-center cursor-pointer shadow-sm"
                            >
                              Asesoría Técnica Personalizada
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ESPECIFICACIONES POR SECTOR COMERCIAL O NEGOCIO — INTEGRACIÓN REAL DE LA ENTREGA */}
                  <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-brand-orange uppercase tracking-widest block">FUNCIONES ESPECIALIZADAS POR NEGOCIO</span>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 font-sans">Sistemas de Reserva & Pagos por Industria</h3>
                      </div>
                      <p className="text-slate-600 text-xs max-w-md font-sans">
                        Cada plataforma web diseñada por Atziluth se configura autónomamente con complementos técnicos optimizados para el sector comercial respectivo.
                      </p>
                    </div>

                    {/* Compact Interactive Industry Toggle Selectors */}
                    <div className="flex flex-wrap gap-2">
                      {industrySystems.map((sys) => {
                        const isSelected = activeIndustrySystem === sys.id;
                        return (
                          <button
                            key={sys.id}
                            type="button"
                            onClick={() => setActiveIndustrySystem(sys.id as any)}
                            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer border ${
                              isSelected 
                                ? "bg-brand-orange/10 border-brand-orange/40 text-brand-orange font-bold shadow-md shadow-brand-orange/5" 
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/90"
                            }`}
                          >
                            {sys.icon}
                            <span>{sys.title}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Industry Information Display Panel */}
                    <div className="bg-slate-50/50 border border-slate-200/80 p-5 md:p-6 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.01] blur-3xl rounded-full pointer-events-none" />
                      
                      <AnimatePresence mode="wait">
                        {industrySystems.map((sys) => {
                          if (sys.id !== activeIndustrySystem) return null;
                          return (
                            <motion.div
                              key={sys.id}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              transition={{ duration: 0.25 }}
                              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
                            >
                              <div className="md:col-span-7 space-y-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2.5 bg-brand-cyan/10 rounded-xl border border-brand-cyan/20 text-brand-cyan">
                                    {sys.icon}
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-widest block">{sys.subtitle}</span>
                                    <h4 className="text-base font-extrabold text-slate-900 mt-0.5">{sys.title}</h4>
                                  </div>
                                </div>
                                <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-sans">
                                  {sys.desc}
                                </p>
                              </div>

                              <div className="md:col-span-5 space-y-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 block">Beneficios de Entrega</span>
                                <div className="space-y-2">
                                  {sys.features.map((feat, fidx) => (
                                    <div key={fidx} className="text-xs text-slate-700 flex items-center gap-2 font-mono">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      <span className="truncate">{feat}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* OTHER SUPPORTED CHANNELS SUB-GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.slice(1).map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:border-brand-magenta/40 hover:bg-slate-50/50 shadow-sm transition-all group"
                      >
                        <div>
                          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-brand-magenta/5 group-hover:border-brand-magenta/30 text-brand-magenta transition-colors">
                            {s.icon}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mt-4 group-hover:text-brand-magenta transition-colors">{s.title}</h3>
                          <p className="text-slate-600 text-xs mt-2 leading-relaxed font-sans">{s.desc}</p>
                        </div>

                        <ul className="space-y-2 mt-5 pt-4 border-t border-slate-100">
                          {s.features.map((f, fIdx) => (
                            <li key={fIdx} className="text-[11px] text-slate-650 flex items-center gap-1.5 font-mono w-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 8. TESTIMONIALS SLIDER */}
                <section className="bg-white border border-slate-200 shadow-md rounded-3xl p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-500/[0.01] to-transparent pointer-events-none" />
                  
                  <div className="md:col-span-4 space-y-3">
                    <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-widest block">TESTIMONIOS REALES</span>
                    <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">Voz de los Líderes del Territorio</h3>
                    <p className="text-slate-600 text-xs leading-relaxed font-sans">
                      Descubra por qué las pymes de turismo, agroindustria y comercio eligen Atziluth Digital para su transformación tecnológica.
                    </p>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={prevTestimonial}
                        className="w-10 h-10 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextTestimonial}
                        className="w-10 h-10 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-8 bg-slate-50 border border-slate-200/80 p-6 rounded-2xl relative shadow-inner">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={testimonialIndex}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-4"
                      >
                        <div className="text-brand-orange text-sm font-mono tracking-widest">
                          {"★".repeat(testimonials[testimonialIndex].rating)}
                        </div>

                        <p className="text-sm italic text-slate-750 leading-relaxed font-sans">
                          "{testimonials[testimonialIndex].quote}"
                        </p>

                        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 block font-sans">{testimonials[testimonialIndex].name}</span>
                            <span className="text-slate-500 text-[10px] block mt-0.5">{testimonials[testimonialIndex].role}</span>
                          </div>
                          <span className="text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1.5 shadow-xs">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            {testimonials[testimonialIndex].location}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>

                {/* 10. CONTACT FORM */}
                <section>
                  <ContactForm />
                </section>
              </>
            )}

            {activeTab === "litografia" && (
              <div className="space-y-8" id="litografia-seccion">
                <LitografiaSection />
              </div>
            )}

            {activeTab === "mapa" && (
              <div className="space-y-8" id="mapa-seccion">
                {/* Header block for Context Separation */}
                <div className="text-center space-y-2.5 max-w-3xl mx-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-[10px] font-mono text-brand-orange">
                    <MapPin className="w-3.5 h-3.5 animate-pulse text-brand-orange" />
                    Canal Territorial Activo
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Explorador Geográfico & Segmentación Estratégica
                  </h2>
                  <p className="text-slate-650 text-xs leading-relaxed max-w-2xl mx-auto font-sans">
                    Visualiza y analiza el potencial de comercio digital en las 9 subregiones de Antioquia. Haz clic en las subregiones y municipios para consultar métricas clave.
                  </p>
                </div>

                <InteractiveMap
                  selectedSubregion={activeSub}
                  onSelectSubregion={setActiveSub}
                  selectedMunicipality={activeMuni}
                  onSelectMunicipality={setActiveMuni}
                />
              </div>
            )}

            {activeTab === "directorio" && (
              <div className="space-y-8" id="directorio-seccion">
                {/* Header block for Context Separation */}
                <div className="text-center space-y-2.5 max-w-3xl mx-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-[10px] font-mono text-brand-orange">
                    <Building className="w-3.5 h-3.5 text-brand-orange" />
                    Canal Comercial Activo
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Directorio Comercial & Catálogo de Pymes
                  </h2>
                  <p className="text-slate-650 text-xs leading-relaxed max-w-2xl mx-auto font-sans">
                    Navega por las empresas locales del departamento. Interactúa con sus perfiles de conversión y expórtalas directamente al workspace de IA para simulaciones.
                  </p>
                </div>

                <MunicipalDirectory
                  selectedSubregion={activeSub}
                  selectedMunicipality={activeMuni}
                  onSelectMunicipality={setActiveMuni}
                  onTriggerAIWorkspace={handleTriggerAIWorkspace}
                  customBannerUrl={imageConfig.municipalDirectoryBanner}
                  customBusinesses={imageConfig.customBusinesses}
                />
              </div>
            )}

            {activeTab === "ia" && (
              <div className="space-y-8" id="ia-espacio">
                {/* Header block for Context Separation */}
                <div className="text-center space-y-2.5 max-w-3xl mx-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-[10px] font-mono text-brand-orange">
                    <Bot className="w-3.5 h-3.5 text-brand-orange animate-bounce" />
                    Atziluth IA Marketing Space (Powered by Gemini)
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Copiloto Inteligente de Ventas Locales
                  </h2>
                  <p className="text-slate-650 text-xs leading-relaxed max-w-2xl mx-auto font-sans">
                    Genera de forma instantánea copywriting comercial, descripciones de productos de catálogo, e ideas estratégicas adaptadas a la geografía y cultura antioqueña.
                  </p>
                </div>

                <AIWorkspace
                  preselectedMuni={activeMuni}
                  preselectedSub={activeSub}
                  onClearPreselections={handleClearPreselections}
                />
              </div>
            )}

            {activeTab === "tarifas" && (
              <div className="space-y-8" id="tarifas-seccion">
                {/* Header block for Context Separation */}
                <div className="text-center space-y-2.5 max-w-3xl mx-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-[10px] font-mono text-brand-orange">
                    <Sliders className="w-3.5 h-3.5 text-brand-orange" />
                    Canal Financiero Transparente
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Calculadora Inteligente de Planes & Tarifas
                  </h2>
                  <p className="text-slate-650 text-xs leading-relaxed max-w-2xl mx-auto font-sans">
                    Selecciona tu base e integra módulos a medida. Obtén presupuestos automatizados que puedes cotizar de inmediato por WhatsApp con nuestros ingenieros.
                  </p>
                </div>

                <PricingCalculator />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-20 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100">
              <img 
                src="/src/assets/images/logo_atziluth_1781713306778.jpg" 
                alt="Logo Atziluth" 
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-bold text-slate-800 tracking-tight block font-sans">Atziluth Gráfic Digital</span>
              <span className="text-[8px] text-brand-cyan font-mono block leading-none mt-0.5 uppercase tracking-wider">CREAMOS IMPACTO VISUAL</span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-2 font-mono text-[10px] text-slate-400">
            <p>© 2026 Atziluth Grafic Digital S.A.S. Todos los derechos reservados.</p>
            <p className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-1.5 sm:gap-3">
              <span>Monitoreando telecomunicaciones y conversiones desde Medellín en tiempo de red.</span>
              <button
                onClick={() => setAdminPanelOpen(true)}
                type="button"
                className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-700 hover:text-brand-orange border border-slate-200 rounded-lg px-2.5 py-1 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                title="Acceso exclusivo administración"
              >
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                Panel de Control
              </button>
            </p>
          </div>
        </div>

        <AdminPanel
          isOpen={adminPanelOpen}
          onClose={() => setAdminPanelOpen(false)}
          currentConfig={imageConfig}
          onConfigUpdated={(newConfig) => {
            setImageConfig(newConfig);
          }}
        />
      </footer>

      {/* 11. FLOATING WHATSAPP CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {whatsappOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 w-[280px] space-y-3.5 mb-3.5 relative"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Atziluth Soporte Local</span>
                  <span className="text-[10px] text-slate-500 block">En línea hoy</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                ¿Hola! ¿Tienes dudas sobre la cobertura de creación web en tu municipio? Elige a un consultor por chat.
              </p>

              <a
                href="https://wa.me/573001254321?text=Hola%20Atziluth%20Digital!%20Me%20interesa%20conocer%20los%20planes%20y%20precios%20para%20crear%20mi%20sitio%20web%20en%20Antioquia."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider text-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Iniciar Chat WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setWhatsappOpen(!whatsappOpen)}
          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 hover:scale-105 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer relative"
          id="btn-whatsapp"
        >
          {whatsappOpen ? (
            <span className="text-xl font-mono leading-none">&times;</span>
          ) : (
            <MessageSquare className="w-5 h-5" />
          )}

          {/* Small green notification bubble */}
          {!whatsappOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-yellow border border-white rounded-full animate-bounce text-[8px] font-black font-mono text-slate-900 flex items-center justify-center">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
