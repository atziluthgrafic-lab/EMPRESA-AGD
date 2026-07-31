import React, { useState, useEffect } from "react";
import {
  Users,
  Server,
  Wallet,
  AlertCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  Trash2,
  Calendar,
  Phone,
  FileSpreadsheet,
  Upload,
  Image as ImageIcon,
  Save,
  DollarSign,
  Receipt,
  X,
  Building2,
  RefreshCw,
  FolderOpen,
  Printer,
  FileText,
  Eye,
  Globe,
  MapPin,
  Building,
  Sliders,
  Edit3,
  Plus,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import {
  ClientRecord,
  ClientPayment,
  AlmanaqueConfig,
  AlmanaqueItem,
  ServiceItem,
  MapLocation,
  Business,
  TariffPlan,
  SubregionId
} from "../types";

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Top Module Navigation State (Including all 5 requested CMS sections)
  const [activeAdminTab, setActiveAdminTab] = useState<
    "servicios" | "litografia" | "mapa" | "directorio" | "tarifas" | "clientes" | "logo" | "todo"
  >("servicios");

  // ==================== CMS STATES ====================

  // 1. SERVICIOS CMS State
  const [customServices, setCustomServices] = useState<ServiceItem[]>([
    {
      id: "srv-web",
      title: "Desarrollo Web & Apps Pyme",
      desc: "Portales transaccionales de alto rendimiento para pymes, comercios y hoteles.",
      features: [
        "Diseño Responsive de Alta Calidad",
        "Optimizado para Motores de Búsqueda",
        "Integración con WhatsApp y Pasarelas de Pago",
        "Soporte Técnico Especializado"
      ],
      badge: "Líder Regional"
    },
    {
      id: "srv-ai",
      title: "Automatizaciones e IA Comercial",
      desc: "Agentes inteligentes para atención de clientes y generación automática de piezas publicitarias.",
      features: [
        "Respuestas Automáticas 24/7",
        "Captura Inteligente de Prospectos",
        "Integración con WhatsApp Business"
      ],
      badge: "Innovación"
    },
    {
      id: "srv-seo",
      title: "Pauta & Posicionamiento SEO Local",
      desc: "Estrategias de geofocalización en las 9 subregiones de Antioquia.",
      features: [
        "Google Maps & Perfil de Negocio",
        "Segmentación Estratégica por Subregión",
        "Reportes de Tráfico en Tiempo Real"
      ],
      badge: "Crecimiento"
    },
    {
      id: "srv-brand",
      title: "Identidad Visual & Branding",
      desc: "Creación de logotipos, manuales de marca y piezas publicitarias impresas y digitales.",
      features: [
        "Vectorización Profesional de Logos",
        "Archivos de Alta Resolución en PDF/SVG",
        "Paleta de Color & Tipografía Corporativa"
      ],
      badge: "Diseño"
    }
  ]);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvTitle, setSrvTitle] = useState("");
  const [srvDesc, setSrvDesc] = useState("");
  const [srvFeatures, setSrvFeatures] = useState("");
  const [srvBadge, setSrvBadge] = useState("");

  // 2. MAPA INTERACTIVO CMS State
  const [customMapLocations, setCustomMapLocations] = useState<MapLocation[]>([
    {
      id: "loc-guatape",
      name: "Guatapé",
      subregion: "oriente",
      capitalDistanceKm: 79,
      primaryEconomy: "Turismo, Náutica, Zócalos, Hostelería",
      adTip: "Promociona hoteles y glampings con catálogos en línea e integración de reservas inmediatas por WhatsApp.",
      badge: "Destino Top"
    },
    {
      id: "loc-jardin",
      name: "Jardín",
      subregion: "suroeste",
      capitalDistanceKm: 130,
      primaryEconomy: "Caficultura de Origen, Ecoturismo",
      adTip: "Destaca marcas de café especial con códigos QR en empaques para pedidos nacionales e internacionales.",
      badge: "Pueblo Patrimonio"
    }
  ]);
  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [mapName, setMapName] = useState("");
  const [mapSubregion, setMapSubregion] = useState<SubregionId>("oriente");
  const [mapDistance, setMapDistance] = useState<number>(50);
  const [mapEconomy, setMapEconomy] = useState("");
  const [mapAdTip, setMapAdTip] = useState("");
  const [mapBadge, setMapBadge] = useState("");

  // 3. DIRECTORIO PYME CMS State
  const [customBusinesses, setCustomBusinesses] = useState<Business[]>([
    {
      id: "biz-1",
      name: "Glamping Piedra del Peñol",
      category: "Turismo & Hospedaje",
      municipality: "Guatapé",
      subregion: "oriente",
      phone: "573001234567",
      website: "https://glampingguatape.com",
      description: "Cabañas de lujo con vista a la represa, jacuzzi privado y motor de reservas directo.",
      usesAI: true
    }
  ]);
  const [editingBizId, setEditingBizId] = useState<string | null>(null);
  const [bizName, setBizName] = useState("");
  const [bizCategory, setBizCategory] = useState("");
  const [bizMunicipality, setBizMunicipality] = useState("");
  const [bizSubregion, setBizSubregion] = useState<SubregionId>("oriente");
  const [bizPhone, setBizPhone] = useState("");
  const [bizWebsite, setBizWebsite] = useState("");
  const [bizDescription, setBizDescription] = useState("");
  const [bizUsesAI, setBizUsesAI] = useState(false);

  // 4. TARIFAS CMS State
  const [customTariffs, setCustomTariffs] = useState<TariffPlan[]>([
    {
      id: "emprendedor",
      name: "Plan Emprendedor",
      description: "Ideal para pymes, artesanos y marcas locales en municipios pequeños que inician su aventura digital.",
      monthlyCostCOP: 280000,
      annualCostCOP: 250000,
      totalAnnualCostCOP: 3000000,
      badge: "ESENCIAL",
      features: [
        "1 Landing Page Optimizada",
        "Botón de WhatsApp Flotante",
        "Estrategia Básica de SEO Local",
        "Dominio .com o .co (1 año)",
        "Alojamiento Web Seguro",
        "3 Banners Publicitarios de IA al mes"
      ]
    },
    {
      id: "crecimiento",
      name: "Crecimiento Digital",
      description: "La opción preferida de hoteles en Guatapé, cafés en Jardín y marcas en expansión regional.",
      monthlyCostCOP: 400000,
      annualCostCOP: 350000,
      totalAnnualCostCOP: 4200000,
      badge: "RECOMENDADO",
      features: [
        "Sitio Web Completo (hasta 5 páginas)",
        "Catálogo Digital o Sistema de Reservas",
        "Configuración Google Maps & SEO local",
        "Integración básica de Pasarela de Pagos",
        "Certificado SSL de Seguridad",
        "10 Banners Publicitarios de IA al mes",
        "Soporte prioritario Atziluth AI"
      ]
    },
    {
      id: "corporativo",
      name: "Corporativo Antioquia",
      description: "Para agroindustrias en Urabá, lecheras en el Norte y pymes de alta facturación en Medellín.",
      monthlyCostCOP: 750000,
      annualCostCOP: 650000,
      totalAnnualCostCOP: 7800000,
      badge: "EMPRESARIAL",
      features: [
        "Portal Web Avanzado & Multi-subregión",
        "E-Commerce Completo o PMS Hotelero",
        "Integración de Software de Gestión / ERP",
        "Campaña Completa de pauta Google/Meta",
        "Mantenimiento Técnico Mensual 24/7",
        "Diseño Gráfico Ilimitado con IA",
        "Asesor Dedicado en Medellín/Rionegro"
      ]
    }
  ]);
  const [editingTariffId, setEditingTariffId] = useState<string | null>(null);
  const [tarName, setTarName] = useState("");
  const [tarDesc, setTarDesc] = useState("");
  const [tarMonthly, setTarMonthly] = useState<number>(280000);
  const [tarAnnual, setTarAnnual] = useState<number>(250000);
  const [tarBadge, setTarBadge] = useState("");
  const [tarFeatures, setTarFeatures] = useState("");


  // Almanaque Config State
  const [almanaqueConfig, setAlmanaqueConfig] = useState<AlmanaqueConfig>({
    extraColorCost: 20000,
    products: [
      {
        id: "almanaque-pared",
        title: "Almanaque de Pared con Varilla y Ojate",
        description: "Impresión en Propalcote 250g con varilla metálica superior, ojal para colgar y taco mensual desprendible.",
        details: "Tamaño 33x48 cm, personalizado a todo color o tintas spot, varilla metálica de fijación resistente.",
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
        title: "Calendario de Escritorio Anillado",
        description: "Base rígida en cartón industrial con 12 o 13 hojas a color en Propalcote 200g y anillado Doble O metálico.",
        details: "Formato carpa de 15x20 cm, ideal para escritorios de clientes corporativos con presencia constante todo el año.",
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
        title: "Almanaque de Bolsillo y Magnético",
        description: "Almanaque práctico plastificado tipo tarjeta o magnético plastificado brillante para neveras y mostradores.",
        details: "Impresión tiro y retiro, esquinas redondeadas o imán plano en el respaldo de alta adherencia.",
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
  });

  // New Client Form State
  const [newClientName, setNewClientName] = useState("");
  const [newClientProject, setNewClientProject] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientStartDate, setNewClientStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newClientHostingFee, setNewClientHostingFee] = useState(400000);
  const [newClientHostingPaid, setNewClientHostingPaid] = useState(false);
  const [newClientMonthlyFee, setNewClientMonthlyFee] = useState(280000);
  const [newClientBillingDay, setNewClientBillingDay] = useState(5);
  const [newClientNotes, setNewClientNotes] = useState("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accountingPeriodFilter, setAccountingPeriodFilter] = useState("all");

  // Logo Upload State
  const [logoPreview, setLogoPreview] = useState<string>("/logo_atziluth.png");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Almanaque Control Sub-Tab State
  const [almanaqueSubTab, setAlmanaqueSubTab] = useState<"modelos" | "paginas_pdf" | "tarifas">("modelos");

  // Load configuration and clients from backend
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/config");
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          if (Array.isArray(data.config.clients)) setClients(data.config.clients);
          if (data.config.logoUrl) setLogoPreview(data.config.logoUrl);
          if (data.config.almanaqueConfig) setAlmanaqueConfig(data.config.almanaqueConfig);
          if (Array.isArray(data.config.customServices)) setCustomServices(data.config.customServices);
          if (Array.isArray(data.config.customMapLocations)) setCustomMapLocations(data.config.customMapLocations);
          if (Array.isArray(data.config.customBusinesses)) setCustomBusinesses(data.config.customBusinesses);
          if (Array.isArray(data.config.customTariffs) && data.config.customTariffs.length > 0) setCustomTariffs(data.config.customTariffs);
        }
      }
    } catch (err) {
      console.error("Error al cargar configuración:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (
    updatedClients = clients,
    updatedLogoUrl = logoPreview,
    updatedAlmanaqueConfig = almanaqueConfig,
    updatedServices = customServices,
    updatedMapLocations = customMapLocations,
    updatedBusinesses = customBusinesses,
    updatedTariffs = customTariffs
  ) => {
    setSaveStatus("Guardando...");
    try {
      // First fetch existing config to avoid overwriting other keys
      const currentRes = await fetch("/api/config/images");
      let existingConfig = {};
      if (currentRes.ok) {
        const currentData = await currentRes.json();
        existingConfig = currentData.config || {};
      }

      const payload = {
        ...existingConfig,
        clients: updatedClients,
        logoUrl: updatedLogoUrl,
        almanaqueConfig: updatedAlmanaqueConfig,
        customServices: updatedServices,
        customMapLocations: updatedMapLocations,
        customBusinesses: updatedBusinesses,
        customTariffs: updatedTariffs,
      };

      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer atziluth_secure_token_secret"
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveStatus("¡Cambios guardados con éxito!");
        try {
          localStorage.setItem("atziluth_custom_config", JSON.stringify(payload));
          window.dispatchEvent(new Event("configUpdated"));
        } catch (_) {}
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("Error al guardar.");
      }
    } catch (err) {
      console.error("Error guardando en backend:", err);
      setSaveStatus("Error de conexión.");
    }
  };


  // ==================== 1. SERVICIOS CRUD HANDLERS ====================
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitle.trim()) return;

    const featuresList = srvFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    let updatedList: ServiceItem[];
    if (editingServiceId) {
      updatedList = customServices.map((s) =>
        s.id === editingServiceId
          ? {
              ...s,
              title: srvTitle,
              desc: srvDesc,
              features: featuresList.length > 0 ? featuresList : s.features,
              badge: srvBadge,
            }
          : s
      );
    } else {
      const newService: ServiceItem = {
        id: "srv-" + Date.now(),
        title: srvTitle,
        desc: srvDesc,
        features: featuresList,
        badge: srvBadge || "Servicio Activo",
      };
      updatedList = [...customServices, newService];
    }

    setCustomServices(updatedList);
    saveConfig(clients, logoPreview, almanaqueConfig, updatedList);
    setEditingServiceId(null);
    setSrvTitle("");
    setSrvDesc("");
    setSrvFeatures("");
    setSrvBadge("");
  };

  const handleEditService = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setSrvTitle(srv.title);
    setSrvDesc(srv.desc || "");
    setSrvFeatures((srv.features || []).join("\n"));
    setSrvBadge(srv.badge || "");
  };

  const handleDeleteService = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este servicio de la sección SERVICIOS?")) return;
    const updatedList = customServices.filter((s) => s.id !== id);
    setCustomServices(updatedList);
    saveConfig(clients, logoPreview, almanaqueConfig, updatedList);
  };

  // ==================== 2. MAPA INTERACTIVO CRUD HANDLERS ====================
  const handleSaveMapLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapName.trim()) return;

    let updatedList: MapLocation[];
    if (editingMapId) {
      updatedList = customMapLocations.map((m) =>
        m.id === editingMapId
          ? {
              ...m,
              name: mapName,
              subregion: mapSubregion,
              capitalDistanceKm: mapDistance,
              primaryEconomy: mapEconomy,
              adTip: mapAdTip,
              badge: mapBadge,
            }
          : m
      );
    } else {
      const newLoc: MapLocation = {
        id: "map-" + Date.now(),
        name: mapName,
        subregion: mapSubregion,
        capitalDistanceKm: mapDistance,
        primaryEconomy: mapEconomy,
        adTip: mapAdTip,
        badge: mapBadge || "Punto Estratégico",
      };
      updatedList = [...customMapLocations, newLoc];
    }

    setCustomMapLocations(updatedList);
    saveConfig(clients, logoPreview, almanaqueConfig, customServices, updatedList);
    setEditingMapId(null);
    setMapName("");
    setMapEconomy("");
    setMapAdTip("");
    setMapBadge("");
  };

  const handleEditMapLocation = (loc: MapLocation) => {
    setEditingMapId(loc.id);
    setMapName(loc.name);
    setMapSubregion(loc.subregion);
    setMapDistance(loc.capitalDistanceKm || 50);
    setMapEconomy(loc.primaryEconomy || "");
    setMapAdTip(loc.adTip || "");
    setMapBadge(loc.badge || "");
  };

  const handleDeleteMapLocation = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este punto de interés del Mapa Interactivo?")) return;
    const updatedList = customMapLocations.filter((m) => m.id !== id);
    setCustomMapLocations(updatedList);
    saveConfig(clients, logoPreview, almanaqueConfig, customServices, updatedList);
  };

  // ==================== 3. DIRECTORIO PYME CRUD HANDLERS ====================
  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim()) return;

    let updatedList: Business[];
    if (editingBizId) {
      updatedList = customBusinesses.map((b) =>
        b.id === editingBizId
          ? {
              ...b,
              name: bizName,
              category: bizCategory,
              municipality: bizMunicipality,
              subregion: bizSubregion,
              phone: bizPhone,
              website: bizWebsite,
              description: bizDescription,
              usesAI: bizUsesAI,
            }
          : b
      );
    } else {
      const newBiz: Business = {
        id: "biz-" + Date.now(),
        name: bizName,
        category: bizCategory || "Comercio Local",
        municipality: bizMunicipality || "Medellín",
        subregion: bizSubregion || "valle_de_aburra",
        phone: bizPhone,
        website: bizWebsite,
        description: bizDescription,
        usesAI: bizUsesAI,
      };
      updatedList = [...customBusinesses, newBiz];
    }

    setCustomBusinesses(updatedList);
    saveConfig(clients, logoPreview, almanaqueConfig, customServices, customMapLocations, updatedList);
    setEditingBizId(null);
    setBizName("");
    setBizCategory("");
    setBizMunicipality("");
    setBizPhone("");
    setBizWebsite("");
    setBizDescription("");
    setBizUsesAI(false);
  };

  const handleEditBusiness = (b: Business) => {
    setEditingBizId(b.id);
    setBizName(b.name);
    setBizCategory(b.category || "");
    setBizMunicipality(b.municipality || "");
    setBizSubregion(b.subregion || "oriente");
    setBizPhone(b.phone || "");
    setBizWebsite(b.website || "");
    setBizDescription(b.description || "");
    setBizUsesAI(Boolean(b.usesAI));
  };

  const handleDeleteBusiness = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta empresa del Directorio Pyme?")) return;
    const updatedList = customBusinesses.filter((b) => b.id !== id);
    setCustomBusinesses(updatedList);
    saveConfig(clients, logoPreview, almanaqueConfig, customServices, customMapLocations, updatedList);
  };

  // ==================== 4. TARIFAS CRUD HANDLERS ====================
  const handleSaveTariff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tarName.trim()) return;

    const featuresList = tarFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    let updatedList: TariffPlan[];
    if (editingTariffId) {
      updatedList = customTariffs.map((t) =>
        t.id === editingTariffId
          ? {
              ...t,
              name: tarName,
              description: tarDesc,
              monthlyCostCOP: tarMonthly,
              annualCostCOP: tarAnnual,
              totalAnnualCostCOP: tarAnnual * 12,
              badge: tarBadge,
              features: featuresList,
            }
          : t
      );
    } else {
      const newTariff: TariffPlan = {
        id: "plan-" + Date.now(),
        name: tarName,
        description: tarDesc,
        monthlyCostCOP: tarMonthly,
        annualCostCOP: tarAnnual,
        totalAnnualCostCOP: tarAnnual * 12,
        badge: tarBadge || "Personalizado",
        features: featuresList,
      };
      updatedList = [...customTariffs, newTariff];
    }

    setCustomTariffs(updatedList);
    saveConfig(clients, logoPreview, almanaqueConfig, customServices, customMapLocations, customBusinesses, updatedList);
    setEditingTariffId(null);
    setTarName("");
    setTarDesc("");
    setTarMonthly(280000);
    setTarAnnual(250000);
    setTarBadge("");
    setTarFeatures("");
  };

  const handleEditTariff = (t: TariffPlan) => {
    setEditingTariffId(t.id);
    setTarName(t.name);
    setTarDesc(t.description || "");
    setTarMonthly(t.monthlyCostCOP || 280000);
    setTarAnnual(t.annualCostCOP || 250000);
    setTarBadge(t.badge || "");
    setTarFeatures((t.features || []).join("\n"));
  };

  const handleDeleteTariff = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este plan o tarifa?")) return;
    const updatedList = customTariffs.filter((t) => t.id !== id);
    setCustomTariffs(updatedList);
    saveConfig(clients, logoPreview, almanaqueConfig, customServices, customMapLocations, customBusinesses, updatedList);
  };

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Upload Logo Handler (Logotach integration)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setUploadMessage("Cargando imagen del logo en Logotach...");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer atziluth_secure_token_secret"
          },
          body: JSON.stringify({
            fileName: file.name || "logo_atziluth.png",
            base64Data: base64Data,
            isLogo: true
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          const newUrl = result.url || base64Data;
          setLogoPreview(newUrl);
          setUploadMessage("¡Logo subido, validado e instalado con éxito!");
          await saveConfig(clients, newUrl);
        } else {
          setUploadMessage(`Error de validación: ${result.error || "El archivo de imagen no es válido."}`);
        }
        setUploadingLogo(false);
        setTimeout(() => setUploadMessage(null), 5000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error subiendo logo en Logotach:", err);
      setUploadMessage("Error al procesar la imagen del logo.");
      setUploadingLogo(false);
    }
  };

  // Upload Almanaque Product Image Handler
  const handleAlmanaqueImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer atziluth_secure_token_secret"
          },
          body: JSON.stringify({
            fileName: file.name || `almanaque_${index}.png`,
            base64Data: base64Data,
            type: "almanaque"
          }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          const newUrl = result.url || base64Data;
          const updatedProducts = [...almanaqueConfig.products];
          updatedProducts[index] = { ...updatedProducts[index], imageUrl: newUrl };
          const updatedConfig = { ...almanaqueConfig, products: updatedProducts };
          setAlmanaqueConfig(updatedConfig);
          await saveConfig(clients, logoPreview, updatedConfig);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error subiendo imagen de almanaque:", err);
    }
  };

  // Upload Almanaque Product PDF Handler
  const handleAlmanaquePdfUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("El documento PDF supera el tamaño máximo permitido de 25 MB.");
      return;
    }

    try {
      setUploadingLogo(true);
      setUploadMessage("Cargando documento PDF al servidor...");
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer atziluth_secure_token_secret"
          },
          body: JSON.stringify({
            fileName: file.name || `almanaque_doc_${index}.pdf`,
            base64Data: base64Data,
            type: "almanaque_pdf"
          }),
        });

        const result = await response.json();
        setUploadingLogo(false);
        if (response.ok && result.success) {
          const newUrl = result.url || base64Data;
          const updatedProducts = [...almanaqueConfig.products];
          updatedProducts[index] = { ...updatedProducts[index], pdfUrl: newUrl };
          const updatedConfig = { ...almanaqueConfig, products: updatedProducts };
          setAlmanaqueConfig(updatedConfig);
          await saveConfig(clients, logoPreview, updatedConfig);
          setUploadMessage(`Documento PDF subido correctamente: ${file.name}`);
          setTimeout(() => setUploadMessage(null), 4000);
        } else {
          alert(result.error || "Error al guardar el archivo PDF en el servidor.");
          setUploadMessage(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingLogo(false);
      setUploadMessage(null);
      console.error("Error subiendo PDF de almanaque:", err);
      alert("Ocurrió un error inesperado al procesar el archivo PDF.");
    }
  };

  // Upload Global Catalog PDF Handler
  const handleGeneralPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("El catálogo PDF supera el tamaño máximo permitido de 25 MB.");
      return;
    }

    try {
      setUploadingLogo(true);
      setUploadMessage("Cargando PDF del catálogo general...");
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer atziluth_secure_token_secret"
          },
          body: JSON.stringify({
            fileName: file.name || "catalogo_general_almanaques.pdf",
            base64Data: base64Data,
            type: "almanaque_general_pdf"
          }),
        });

        const result = await response.json();
        setUploadingLogo(false);
        if (response.ok && result.success) {
          const newUrl = result.url || base64Data;
          const updatedConfig = { ...almanaqueConfig, generalPdfUrl: newUrl };
          setAlmanaqueConfig(updatedConfig);
          await saveConfig(clients, logoPreview, updatedConfig);
          setUploadMessage(`Catálogo PDF general actualizado correctamente.`);
          setTimeout(() => setUploadMessage(null), 4000);
        } else {
          alert(result.error || "Error al subir el PDF del catálogo general.");
          setUploadMessage(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingLogo(false);
      setUploadMessage(null);
      console.error("Error subiendo PDF general:", err);
      alert("Ocurrió un error inesperado al procesar el catálogo PDF.");
    }
  };

  // Upload PDF Page Image Handler
  const handlePdfPageImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer atziluth_secure_token_secret"
          },
          body: JSON.stringify({
            fileName: file.name || `pdf_page_${index}.png`,
            base64Data: base64Data,
            type: "pdf_page_image"
          }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          const newUrl = result.url || base64Data;
          const pages = almanaqueConfig.pdfPages ? [...almanaqueConfig.pdfPages] : [];
          pages[index] = { ...pages[index], imageUrl: newUrl };
          const updatedConfig = { ...almanaqueConfig, pdfPages: pages };
          setAlmanaqueConfig(updatedConfig);
          await saveConfig(clients, logoPreview, updatedConfig);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error subiendo imagen de página PDF:", err);
    }
  };

  // Add Client
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientProject.trim()) {
      alert("Por favor ingresa el nombre del cliente y del proyecto.");
      return;
    }

    const clientId = "cli_" + Date.now().toString();
    const initialPayments: ClientPayment[] = [];

    if (newClientHostingPaid) {
      initialPayments.push({
        id: "pay_" + Date.now().toString(),
        concept: "Hosting + Dominio Inicial",
        period: "Inicial",
        amount: newClientHostingFee,
        date: newClientStartDate || new Date().toISOString().split("T")[0],
        method: "Transferencia Bancolombia",
        paid: true,
        notes: "Pago de inicio ($400.000 COP)",
      });
    }

    const newRecord: ClientRecord = {
      id: clientId,
      clientName: newClientName.trim(),
      projectName: newClientProject.trim(),
      phone: newClientPhone.trim(),
      startDate: newClientStartDate || new Date().toISOString().split("T")[0],
      hostingDomainFee: newClientHostingFee,
      hostingDomainPaid: newClientHostingPaid,
      monthlyFee: newClientMonthlyFee,
      billingDay: newClientBillingDay,
      notes: newClientNotes.trim(),
      payments: initialPayments,
    };

    const updated = [newRecord, ...clients];
    setClients(updated);
    saveConfig(updated);

    // Reset Form
    setNewClientName("");
    setNewClientProject("");
    setNewClientPhone("");
    setNewClientNotes("");
  };

  // Toggle Hosting Paid Status
  const toggleHostingPaid = (clientId: string) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const nextPaid = !c.hostingDomainPaid;
        const payments = [...(c.payments || [])];

        if (nextPaid) {
          const exists = payments.some((p) => p.concept.includes("Hosting"));
          if (!exists) {
            payments.push({
              id: "pay_" + Date.now().toString(),
              concept: "Hosting + Dominio Inicial",
              period: "Inicial",
              amount: c.hostingDomainFee || 400000,
              date: new Date().toISOString().split("T")[0],
              method: "Transferencia Bancolombia",
              paid: true,
              notes: "Marcado como pagado desde el panel",
            });
          }
        }

        return {
          ...c,
          hostingDomainPaid: nextPaid,
          payments: payments,
        };
      }
      return c;
    });

    setClients(updated);
    saveConfig(updated);
  };

  // Add Payment Entry to Client
  const handleAddPayment = (clientId: string, paymentData: Omit<ClientPayment, "id">) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const newPayment: ClientPayment = {
          id: "pay_" + Date.now().toString(),
          ...paymentData,
        };
        return {
          ...c,
          payments: [...(c.payments || []), newPayment],
        };
      }
      return c;
    });

    setClients(updated);
    saveConfig(updated);
  };

  // Toggle Individual Payment Status
  const togglePaymentPaid = (clientId: string, paymentId: string) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const payments = (c.payments || []).map((p) => {
          if (p.id === paymentId) {
            return { ...p, paid: !p.paid };
          }
          return p;
        });
        return { ...c, payments };
      }
      return c;
    });

    setClients(updated);
    saveConfig(updated);
  };

  // Delete Payment
  const deletePayment = (clientId: string, paymentId: string) => {
    if (!window.confirm("¿Deseas eliminar este registro de pago?")) return;
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          payments: (c.payments || []).filter((p) => p.id !== paymentId),
        };
      }
      return c;
    });

    setClients(updated);
    saveConfig(updated);
  };

  // Delete Client
  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al cliente "${clientName}"?`)) return;
    const updated = clients.filter((c) => c.id !== clientId);
    setClients(updated);
    saveConfig(updated);
  };

  // WhatsApp Link Generator
  const generateWaLink = (
    clientName: string,
    projectName: string,
    phone: string,
    concept: string,
    amount: number
  ) => {
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const fullPhone = cleanPhone.length === 10 ? "57" + cleanPhone : cleanPhone;
    const currentMonth = new Intl.DateTimeFormat("es-CO", {
      month: "long",
      year: "numeric",
    }).format(new Date());

    const msg = `Hola *${clientName}*, te saludamos de *Atziluth Gráfic Digital* 🚀\n\nTe recordamos el pago correspondiente a *${concept}* (${currentMonth}) para el proyecto *${projectName}*.\n\n💰 *Valor:* ${formatCOP(
      amount
    )}\n\n📌 *Medios de Pago:*\n- Bancolombia / Nequi / Daviplata\n\nPor favor nos envías la foto del comprobante. ¡Muchas gracias!`;

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Financial Metrics
  let totalActiveClients = clients.length;
  let totalHostingRev = 0;
  let totalMonthlyRev = 0;
  let totalPending = 0;

  clients.forEach((c) => {
    if (c.hostingDomainPaid) {
      totalHostingRev += c.hostingDomainFee || 400000;
    } else {
      totalPending += c.hostingDomainFee || 400000;
    }

    (c.payments || []).forEach((p) => {
      if (p.paid) {
        totalMonthlyRev += p.amount || 0;
      } else {
        totalPending += p.amount || 0;
      }
    });
  });

  // Filtered clients list
  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQ =
      !q ||
      c.clientName.toLowerCase().includes(q) ||
      c.projectName.toLowerCase().includes(q) ||
      c.phone.includes(q);

    if (!matchesQ) return false;

    if (statusFilter === "pending_hosting") return !c.hostingDomainPaid;
    if (statusFilter === "pending_monthly")
      return (c.payments || []).some((p) => !p.paid);
    if (statusFilter === "up_to_date")
      return c.hostingDomainPaid && !(c.payments || []).some((p) => !p.paid);

    return true;
  });

  // All Payments for Accounting Table
  const allPayments = clients.flatMap((c) =>
    (c.payments || []).map((p) => ({
      ...p,
      clientName: c.clientName,
      projectName: c.projectName,
    }))
  );

  const uniquePeriods = Array.from(new Set(allPayments.map((p) => p.period))).filter(
    Boolean
  );

  const filteredAccountingPayments = allPayments.filter(
    (p) => accountingPeriodFilter === "all" || p.period === accountingPeriodFilter
  );

  const currentMonthCapitalized = new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-950 text-slate-100 min-h-screen rounded-3xl border border-slate-800 my-4 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              Módulo Contable & Marca
            </span>
            {saveStatus && (
              <span className="text-xs font-mono text-emerald-400 animate-pulse">
                {saveStatus}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-2">
            Panel de Administración, Clientes y Contabilidad
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Gestión integral de clientes, pagos iniciales de $400.000 (hosting/dominio), mensualidades y gestor de logo.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveAdminTab("almanaque")}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:opacity-90 text-xs font-bold text-neutral-950 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Calendar className="w-4 h-4" />
            Editar Almanaques 2027
          </button>

          <button
            onClick={fetchConfig}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-brand-orange" />
            Actualizar Datos
          </button>
        </div>
      </div>

      {/* BARRA DE NAVEGACIÓN DEDICADA PARA MÓDULOS DEL PANEL DE ADMINISTRACIÓN */}
      <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveAdminTab("servicios")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === "servicios"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black shadow-lg shadow-blue-500/20 scale-102 border border-blue-400"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4 text-blue-300" />
          🏢 SERVICIOS ({customServices.length})
        </button>

        <button
          onClick={() => setActiveAdminTab("litografia")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === "litografia"
              ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-neutral-950 font-black shadow-lg shadow-yellow-500/20 scale-102 border border-yellow-300"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Printer className="w-4 h-4 text-amber-950" />
          🖨️ PUBLICIDAD LITOGRÁFICA ({almanaqueConfig.products?.length || 0})
        </button>

        <button
          onClick={() => setActiveAdminTab("mapa")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === "mapa"
              ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black shadow-lg shadow-rose-500/20 scale-102 border border-rose-400"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <MapPin className="w-4 h-4 text-rose-200" />
          🗺️ MAPA INTERACTIVO ({customMapLocations.length})
        </button>

        <button
          onClick={() => setActiveAdminTab("directorio")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === "directorio"
              ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white font-black shadow-lg shadow-purple-500/20 scale-102 border border-purple-400"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Building className="w-4 h-4 text-purple-200" />
          📂 DIRECTORIO PYME ({customBusinesses.length})
        </button>

        <button
          onClick={() => setActiveAdminTab("tarifas")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === "tarifas"
              ? "bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-black shadow-lg shadow-cyan-500/20 scale-102 border border-cyan-400"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-200" />
          📊 TARIFAS ({customTariffs.length})
        </button>

        <button
          onClick={() => setActiveAdminTab("clientes")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === "clientes"
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-lg scale-102 border border-emerald-400"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          👥 CLIENTES ({clients.length})
        </button>

        <button
          onClick={() => setActiveAdminTab("logo")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === "logo"
              ? "bg-gradient-to-r from-brand-orange to-brand-magenta text-white font-black shadow-lg scale-102 border border-brand-orange"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          🖼️ LOGO
        </button>

        <button
          onClick={() => setActiveAdminTab("todo")}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-auto ${
            activeAdminTab === "todo"
              ? "bg-slate-700 text-white font-black shadow-lg border border-slate-500"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          👁️ VISTA COMPLETA UNIFICADA
        </button>
      </div>

      {/* ACCESO Y GESTOR PARA MONTAR Y CAMBIAR EL LOGO */}
      {(activeAdminTab === "logo" || activeAdminTab === "todo") && (
      <div id="gestor-logo-seccion" className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-brand-orange/30 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl border border-brand-orange/20">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Logotach — Gestor Oficial de Logo & Marca</h2>
                <span className="px-2 py-0.5 bg-brand-orange/20 text-brand-orange text-[10px] font-mono rounded font-bold uppercase">
                  Gestor Logotach
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sube o cambia el logo oficial de Atziluth Gráfic Digital para actualizarlo en el encabezado, pie de página y portada.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="w-14 h-14 rounded-xl bg-white border border-slate-700 overflow-hidden flex items-center justify-center p-1 shadow-inner relative">
              <img
                src={logoPreview || "/logo_atziluth.jpg"}
                alt="Logo Atziluth"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo_atziluth.jpg";
                }}
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Imagen Directa Activa</span>
              <span className="text-xs font-bold text-emerald-400 font-mono truncate max-w-[280px] block">
                {logoPreview || "/logo_atziluth.jpg"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opción 1: Cargar Archivo de Imagen Directa */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-brand-orange font-bold flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> Cargar Archivo de Imagen Directa
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Selecciona o arrastra cualquier archivo de imagen directa (PNG, JPG, WEBP, SVG, GIF, ICO, AVIF, BMP).
              </p>
            </div>

            <label className="w-full py-3 px-4 bg-gradient-to-r from-brand-orange to-brand-magenta hover:opacity-90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
              <Upload className="w-4 h-4" />
              {uploadingLogo ? "Guardando Logo Directo..." : "Seleccionar Archivo de Logo"}
              <input
                type="file"
                accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.gif,.ico,.avif,.bmp,.tiff"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="hidden"
              />
            </label>
          </div>

          {/* Opción 2: Ruta Directa de Servidor */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-brand-orange font-bold flex items-center gap-1.5">
                <Save className="w-4 h-4" /> Ruta / Dirección Directa de Imagen
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Muestra la ubicación de la imagen directa guardada en el servidor (ej: <code className="text-slate-200">/imagenes/mi_logo.png</code>).
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={logoPreview}
                onChange={(e) => setLogoPreview(e.target.value)}
                placeholder="/imagenes/mi_logo.png"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
              <button
                onClick={() => {
                  saveConfig(clients, logoPreview);
                  setUploadMessage("¡Ruta directa guardada con éxito!");
                  setTimeout(() => setUploadMessage(null), 3000);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>

        {uploadMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {uploadMessage}
          </div>
        )}

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-2">
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-brand-orange" />
            Carpeta de Almacenamiento en Servidor: <code className="text-emerald-400 font-mono px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">/uploads/</code> o <code className="text-emerald-400 font-mono px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">/public/logo_atziluth.png</code>
          </span>
          <span className="text-slate-500 font-mono">Formatos admitidos: PNG, JPG, WEBP, SVG</span>
        </div>
      </div>
      )}

      {/* ==================== 1. SECCIÓN SERVICIOS (CMS) ==================== */}
      {(activeAdminTab === "servicios" || activeAdminTab === "todo") && (
      <div id="gestor-servicios-seccion" className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl p-6 space-y-6 shadow-xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Editor & CMS — Sección SERVICIOS</h2>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-mono rounded font-bold uppercase">
                  {customServices.length} Servicios Activos
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Agrega nuevos servicios, modifica las características publicadas o elimina los que ya no están vigentes.
              </p>
            </div>
          </div>

          <button
            onClick={() => saveConfig(clients, logoPreview, almanaqueConfig, customServices)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Save className="w-4 h-4" />
            Guardar Servicios
          </button>
        </div>

        {/* Formulario Agregar / Editar Servicio */}
        <form onSubmit={handleSaveService} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-mono text-blue-400 font-bold uppercase flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {editingServiceId ? "✏️ Editar Servicio Existente" : "➕ Agregar Nuevo Servicio"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Título del Servicio</label>
              <input
                type="text"
                required
                value={srvTitle}
                onChange={(e) => setSrvTitle(e.target.value)}
                placeholder="Ej: Desarrollo Web & Apps Pyme"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Insignia / Badge Destacado</label>
              <input
                type="text"
                value={srvBadge}
                onChange={(e) => setSrvBadge(e.target.value)}
                placeholder="Ej: Líder Regional / Recomendado"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Descripción Breve</label>
              <input
                type="text"
                value={srvDesc}
                onChange={(e) => setSrvDesc(e.target.value)}
                placeholder="Ej: Portales transaccionales de alto rendimiento para pymes, comercios y hoteles."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Características Incluidas (Una por línea)
              </label>
              <textarea
                rows={3}
                value={srvFeatures}
                onChange={(e) => setSrvFeatures(e.target.value)}
                placeholder="Diseño Responsive de Alta Calidad&#10;Optimizado para Motores de Búsqueda&#10;Integración con WhatsApp"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" />
              {editingServiceId ? "Guardar Cambios del Servicio" : "Publicar Nuevo Servicio"}
            </button>
            {editingServiceId && (
              <button
                type="button"
                onClick={() => {
                  setEditingServiceId(null);
                  setSrvTitle("");
                  setSrvDesc("");
                  setSrvFeatures("");
                  setSrvBadge("");
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de Servicios Existentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customServices.map((srv) => (
            <div key={srv.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-mono font-bold">
                    {srv.badge || "Servicio"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditService(srv)}
                      className="p-1.5 bg-slate-900 hover:bg-blue-900/40 text-blue-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Editar Servicio"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-1.5 bg-slate-900 hover:bg-rose-900/40 text-rose-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Eliminar Servicio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">{srv.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{srv.desc}</p>
                <ul className="mt-3 space-y-1">
                  {(srv.features || []).map((f, i) => (
                    <li key={i} className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ==================== 2. SECCIÓN MAPA INTERACTIVO (CMS) ==================== */}
      {(activeAdminTab === "mapa" || activeAdminTab === "todo") && (
      <div id="gestor-mapa-seccion" className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-rose-500/30 rounded-2xl p-6 space-y-6 shadow-xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Editor & CMS — MAPA INTERACTIVO DE ANTIOQUIA</h2>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-mono rounded font-bold uppercase">
                  {customMapLocations.length} Puntos en Mapa
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Agrega o actualiza los datos geográficos de los municipios y subregiones promocionados en el mapa.
              </p>
            </div>
          </div>

          <button
            onClick={() => saveConfig(clients, logoPreview, almanaqueConfig, customServices, customMapLocations)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Save className="w-4 h-4" />
            Guardar Mapa
          </button>
        </div>

        {/* Formulario Agregar / Editar Punto de Mapa */}
        <form onSubmit={handleSaveMapLocation} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-mono text-rose-400 font-bold uppercase flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {editingMapId ? "✏️ Editar Punto del Mapa" : "➕ Agregar Nuevo Punto / Municipio"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Nombre del Municipio / Punto</label>
              <input
                type="text"
                required
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                placeholder="Ej: Guatapé / Rionegro / Caucasia"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Subregión de Antioquia</label>
              <select
                value={mapSubregion}
                onChange={(e) => setMapSubregion(e.target.value as SubregionId)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="valle_de_aburra">Valle de Aburrá</option>
                <option value="oriente">Oriente</option>
                <option value="suroeste">Suroeste</option>
                <option value="occidente">Occidente</option>
                <option value="uraba">Urabá</option>
                <option value="norte">Norte</option>
                <option value="bajo_cauca">Bajo Cauca</option>
                <option value="nordeste">Nordeste</option>
                <option value="magdalena_medio">Magdalena Medio</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Distancia a Medellín (Km)</label>
              <input
                type="number"
                value={mapDistance}
                onChange={(e) => setMapDistance(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Economía Principal / Vocación</label>
              <input
                type="text"
                value={mapEconomy}
                onChange={(e) => setMapEconomy(e.target.value)}
                placeholder="Ej: Turismo, Caficultura de Origen, Hostelería"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Insignia / Badge</label>
              <input
                type="text"
                value={mapBadge}
                onChange={(e) => setMapBadge(e.target.value)}
                placeholder="Ej: Destino Top / Pueblo Patrimonio"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Recomendación o Tip de Pauta Digital</label>
              <input
                type="text"
                value={mapAdTip}
                onChange={(e) => setMapAdTip(e.target.value)}
                placeholder="Ej: Promociona hoteles con catálogos en línea y reservas inmediatas por WhatsApp."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30"
            >
              <Save className="w-4 h-4" />
              {editingMapId ? "Guardar Cambios del Punto" : "Publicar Nuevo Punto en Mapa"}
            </button>
            {editingMapId && (
              <button
                type="button"
                onClick={() => {
                  setEditingMapId(null);
                  setMapName("");
                  setMapEconomy("");
                  setMapAdTip("");
                  setMapBadge("");
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de Puntos Existentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customMapLocations.map((loc) => (
            <div key={loc.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-mono font-bold uppercase">
                    {loc.subregion.replace(/_/g, " ")}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditMapLocation(loc)}
                      className="p-1.5 bg-slate-900 hover:bg-rose-900/40 text-rose-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Editar Punto"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMapLocation(loc.id)}
                      className="p-1.5 bg-slate-900 hover:bg-rose-900/40 text-rose-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Eliminar Punto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  {loc.name}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 font-mono">
                  <strong className="text-slate-400">Economía:</strong> {loc.primaryEconomy}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  "{loc.adTip}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ==================== 3. SECCIÓN DIRECTORIO PYME (CMS) ==================== */}
      {(activeAdminTab === "directorio" || activeAdminTab === "todo") && (
      <div id="gestor-directorio-seccion" className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-6 space-y-6 shadow-xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Editor & CMS — DIRECTORIO PYME</h2>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-mono rounded font-bold uppercase">
                  {customBusinesses.length} Empresas Registradas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Agrega, edita o elimina las empresas registradas en el Directorio Comercial.
              </p>
            </div>
          </div>

          <button
            onClick={() => saveConfig(clients, logoPreview, almanaqueConfig, customServices, customMapLocations, customBusinesses)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Save className="w-4 h-4" />
            Guardar Directorio
          </button>
        </div>

        {/* Formulario Agregar / Editar Empresa */}
        <form onSubmit={handleSaveBusiness} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-mono text-purple-400 font-bold uppercase flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {editingBizId ? "✏️ Editar Empresa Pyme" : "➕ Agregar Nueva Empresa Pyme"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Nombre de la Empresa</label>
              <input
                type="text"
                required
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="Ej: Glamping Piedra del Peñol"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Categoría / Nicho</label>
              <input
                type="text"
                value={bizCategory}
                onChange={(e) => setBizCategory(e.target.value)}
                placeholder="Ej: Turismo & Hospedaje / Gastronomía"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Municipio</label>
              <input
                type="text"
                value={bizMunicipality}
                onChange={(e) => setBizMunicipality(e.target.value)}
                placeholder="Ej: Guatapé / Jardín / Rionegro"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Teléfono WhatsApp</label>
              <input
                type="text"
                value={bizPhone}
                onChange={(e) => setBizPhone(e.target.value)}
                placeholder="Ej: 573001234567"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Sitio Web / Red Social</label>
              <input
                type="text"
                value={bizWebsite}
                onChange={(e) => setBizWebsite(e.target.value)}
                placeholder="Ej: https://glampingguatape.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200 font-mono">
                <input
                  type="checkbox"
                  checked={bizUsesAI}
                  onChange={(e) => setBizUsesAI(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
                Usa Inteligencia Artificial Comercial
              </label>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Descripción Breve de la Empresa</label>
              <input
                type="text"
                value={bizDescription}
                onChange={(e) => setBizDescription(e.target.value)}
                placeholder="Ej: Cabañas de lujo con vista a la represa, jacuzzi privado y reservas en línea."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/30"
            >
              <Save className="w-4 h-4" />
              {editingBizId ? "Guardar Cambios de la Empresa" : "Publicar Empresa en Directorio"}
            </button>
            {editingBizId && (
              <button
                type="button"
                onClick={() => {
                  setEditingBizId(null);
                  setBizName("");
                  setBizCategory("");
                  setBizMunicipality("");
                  setBizPhone("");
                  setBizWebsite("");
                  setBizDescription("");
                  setBizUsesAI(false);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de Empresas Existentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customBusinesses.map((b) => (
            <div key={b.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded text-[10px] font-mono font-bold">
                    {b.category || "General"} — {b.municipality}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditBusiness(b)}
                      className="p-1.5 bg-slate-900 hover:bg-purple-900/40 text-purple-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Editar Empresa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBusiness(b.id)}
                      className="p-1.5 bg-slate-900 hover:bg-rose-900/40 text-rose-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Eliminar Empresa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mt-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  {b.name}
                  {b.usesAI && (
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] font-mono rounded font-bold">
                      ⚡ IA
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{b.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-mono text-slate-300">
                  {b.phone && <span>📞 {b.phone}</span>}
                  {b.website && <span className="text-purple-400 truncate max-w-[200px]">🌐 {b.website}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ==================== 4. SECCIÓN TARIFAS (CMS) ==================== */}
      {(activeAdminTab === "tarifas" || activeAdminTab === "todo") && (
      <div id="gestor-tarifas-seccion" className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 space-y-6 shadow-xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Editor & CMS — PLANES & TARIFAS</h2>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-mono rounded font-bold uppercase">
                  {customTariffs.length} Planes Publicados
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Agrega, edita o elimina los planes y precios mostrados en la Calculadora de Tarifas.
              </p>
            </div>
          </div>

          <button
            onClick={() => saveConfig(clients, logoPreview, almanaqueConfig, customServices, customMapLocations, customBusinesses, customTariffs)}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Save className="w-4 h-4" />
            Guardar Tarifas
          </button>
        </div>

        {/* Formulario Agregar / Editar Tarifa */}
        <form onSubmit={handleSaveTariff} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {editingTariffId ? "✏️ Editar Plan de Tarifa" : "➕ Agregar Nuevo Plan de Tarifa"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Nombre del Plan</label>
              <input
                type="text"
                required
                value={tarName}
                onChange={(e) => setTarName(e.target.value)}
                placeholder="Ej: Plan Emprendedor / Crecimiento"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Costo Mensual ($ COP)</label>
              <input
                type="number"
                value={tarMonthly}
                onChange={(e) => setTarMonthly(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Costo Anual Mensualizado ($ COP)</label>
              <input
                type="number"
                value={tarAnnual}
                onChange={(e) => setTarAnnual(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Insignia / Badge</label>
              <input
                type="text"
                value={tarBadge}
                onChange={(e) => setTarBadge(e.target.value)}
                placeholder="Ej: Recomendado / Popular"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Descripción Breve</label>
              <input
                type="text"
                value={tarDesc}
                onChange={(e) => setTarDesc(e.target.value)}
                placeholder="Ej: Ideal para pymes y marcas locales que inician su aventura digital."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Características Incluidas (Una por línea)
              </label>
              <textarea
                rows={3}
                value={tarFeatures}
                onChange={(e) => setTarFeatures(e.target.value)}
                placeholder="1 Landing Page Optimizada&#10;Botón de WhatsApp Flotante&#10;Dominio .com (1 año)"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-600/30"
            >
              <Save className="w-4 h-4" />
              {editingTariffId ? "Guardar Cambios del Plan" : "Publicar Nuevo Plan de Tarifa"}
            </button>
            {editingTariffId && (
              <button
                type="button"
                onClick={() => {
                  setEditingTariffId(null);
                  setTarName("");
                  setTarDesc("");
                  setTarMonthly(280000);
                  setTarAnnual(250000);
                  setTarBadge("");
                  setTarFeatures("");
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de Tarifas Existentes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {customTariffs.map((t) => (
            <div key={t.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded text-[10px] font-mono font-bold uppercase">
                    {t.badge || "Plan"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditTariff(t)}
                      className="p-1.5 bg-slate-900 hover:bg-cyan-900/40 text-cyan-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Editar Plan"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTariff(t.id)}
                      className="p-1.5 bg-slate-900 hover:bg-rose-900/40 text-rose-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      title="Eliminar Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-base font-bold text-white mt-2">{t.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                <div className="mt-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <p className="text-xs font-mono text-cyan-400 font-bold">
                    Mensual: {formatCOP(t.monthlyCostCOP)} /mes
                  </p>
                  <p className="text-xs font-mono text-emerald-400">
                    Anual: {formatCOP(t.annualCostCOP)} /mes
                  </p>
                </div>
                <ul className="mt-3 space-y-1">
                  {(t.features || []).map((f, i) => (
                    <li key={i} className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* GESTIÓN ADMINISTRATIVA Y CONTROL DE CONTENIDO DE ALMANAQUES / LITOGRAFÍA */}
      {(activeAdminTab === "almanaque" || activeAdminTab === "litografia" || activeAdminTab === "todo") && (
      <div id="gestor-almanaques-seccion" className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-yellow-500/30 rounded-2xl p-6 space-y-6 shadow-xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-2xl border border-yellow-400/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Editor & Control de Contenido — Sección Almanaques</h2>
                <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-[10px] font-mono rounded font-bold uppercase">
                  CMS Completo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Administra modelos, sube imágenes directas, adjunta documentos PDF, modifica la matriz de precios y configura el muestrario PDF del sitio web.
              </p>
            </div>
          </div>

          <button
            onClick={() => saveConfig(clients, logoPreview, almanaqueConfig)}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-neutral-950 font-bold text-xs rounded-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Save className="w-4 h-4" />
            Guardar Todos los Cambios
          </button>
        </div>

        {/* Sub-Tabs for Almanaque CMS */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 max-w-xl">
          <button
            onClick={() => setAlmanaqueSubTab("modelos")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              almanaqueSubTab === "modelos"
                ? "bg-yellow-400 text-neutral-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            Modelos & Precios ({almanaqueConfig.products?.length || 0})
          </button>
          <button
            onClick={() => setAlmanaqueSubTab("paginas_pdf")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              almanaqueSubTab === "paginas_pdf"
                ? "bg-yellow-400 text-neutral-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Catálogo PDF & Muestrario ({almanaqueConfig.pdfPages?.length || 0})
          </button>
          <button
            onClick={() => setAlmanaqueSubTab("tarifas")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              almanaqueSubTab === "tarifas"
                ? "bg-yellow-400 text-neutral-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Reglas de Tarifas
          </button>
        </div>

        {/* SUBTAB 1: MODELOS Y LISTA DE PRECIOS */}
        {almanaqueSubTab === "modelos" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Modelos de Almanaques Habilitados en el Sitio:
              </h3>
              <button
                onClick={() => {
                  const newProd: AlmanaqueItem = {
                    id: `almanaque_${Date.now()}`,
                    title: "Nuevo Modelo de Almanaque 2027",
                    description: "Descripción detallada del modelo de almanaque publicitario.",
                    details: "Formato 33x48 cm. Incluye cabezote a color y taco mensual.",
                    imageUrl: "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=800&q=80",
                    pdfUrl: "",
                    prices: {
                      qty100: 250000,
                      qty300: 480000,
                      qty500: 680000,
                      qty1000: 1100000
                    }
                  };
                  const updated = {
                    ...almanaqueConfig,
                    products: [...(almanaqueConfig.products || []), newProd]
                  };
                  setAlmanaqueConfig(updated);
                  saveConfig(clients, logoPreview, updated);
                }}
                className="px-3.5 py-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Añadir Nuevo Almanaque
              </button>
            </div>

            <div className="space-y-6">
              {almanaqueConfig.products.map((prod, idx) => (
                <div 
                  key={prod.id || idx}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 relative shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/20">
                      Modelo #{idx + 1}: {prod.title}
                    </span>
                    {almanaqueConfig.products.length > 1 && (
                      <button
                        onClick={() => {
                          const updatedProds = almanaqueConfig.products.filter((_, i) => i !== idx);
                          const updated = { ...almanaqueConfig, products: updatedProds };
                          setAlmanaqueConfig(updated);
                          saveConfig(clients, logoPreview, updated);
                        }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar Modelo
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Image & File Upload */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-mono text-slate-300 font-bold block mb-1">
                          Imagen Principal:
                        </label>
                        <div className="w-full h-36 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative flex items-center justify-center">
                          <img 
                            src={prod.imageUrl} 
                            alt={prod.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="space-y-2 mt-2">
                          <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 border border-slate-700 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-yellow-400" />
                            Subir Archivo de Imagen
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleAlmanaqueImageUpload(idx, e)}
                            />
                          </label>

                          <input
                            type="text"
                            placeholder="URL de la imagen..."
                            value={prod.imageUrl}
                            onChange={(e) => {
                              const updated = [...almanaqueConfig.products];
                              updated[idx] = { ...updated[idx], imageUrl: e.target.value };
                              setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>

                      {/* PDF File / Link for this product */}
                      <div className="pt-2 border-t border-slate-900 space-y-2">
                        <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-red-400" /> Documento PDF Adjunto del Modelo:
                        </label>

                        <div className="flex gap-2">
                          <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-bold rounded-xl cursor-pointer flex items-center gap-1.5 border border-slate-700 transition-colors shrink-0">
                            <Upload className="w-3.5 h-3.5 text-red-400" />
                            Subir PDF
                            <input 
                              type="file" 
                              accept="application/pdf,.pdf" 
                              className="hidden" 
                              onChange={(e) => handleAlmanaquePdfUpload(idx, e)}
                            />
                          </label>

                          {prod.pdfUrl && (
                            <a
                              href={prod.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-mono rounded-xl flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> Abrir
                            </a>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="URL directa del PDF (ej: /uploads/almanaque.pdf)..."
                          value={prod.pdfUrl || ""}
                          onChange={(e) => {
                            const updated = [...almanaqueConfig.products];
                            updated[idx] = { ...updated[idx], pdfUrl: e.target.value };
                            setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Column 2 & 3: Titles, Text Details, Prices */}
                    <div className="space-y-4 lg:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono text-slate-400 block pb-1">Nombre del Modelo:</label>
                          <input
                            type="text"
                            value={prod.title}
                            onChange={(e) => {
                              const updated = [...almanaqueConfig.products];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-slate-400 block pb-1">Ficha Técnica / Formato:</label>
                          <input
                            type="text"
                            value={prod.details || ""}
                            onChange={(e) => {
                              const updated = [...almanaqueConfig.products];
                              updated[idx] = { ...updated[idx], details: e.target.value };
                              setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-400 block pb-1">Descripción del Almanaque:</label>
                        <textarea
                          rows={2}
                          value={prod.description}
                          onChange={(e) => {
                            const updated = [...almanaqueConfig.products];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      {/* Quantity Prices Inputs */}
                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-mono font-bold text-yellow-400 uppercase block">
                          💰 Valores de Venta por Cantidad (en Pesos COP):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-slate-400 block">x 100 Unidades:</label>
                            <input
                              type="number"
                              value={prod.prices.qty100}
                              onChange={(e) => {
                                const updated = [...almanaqueConfig.products];
                                updated[idx] = {
                                  ...updated[idx],
                                  prices: { ...updated[idx].prices, qty100: Number(e.target.value) || 0 }
                                };
                                setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-slate-400 block">x 300 Unidades:</label>
                            <input
                              type="number"
                              value={prod.prices.qty300}
                              onChange={(e) => {
                                const updated = [...almanaqueConfig.products];
                                updated[idx] = {
                                  ...updated[idx],
                                  prices: { ...updated[idx].prices, qty300: Number(e.target.value) || 0 }
                                };
                                setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-slate-400 block">x 500 Unidades:</label>
                            <input
                              type="number"
                              value={prod.prices.qty500}
                              onChange={(e) => {
                                const updated = [...almanaqueConfig.products];
                                updated[idx] = {
                                  ...updated[idx],
                                  prices: { ...updated[idx].prices, qty500: Number(e.target.value) || 0 }
                                };
                                setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-slate-400 block">x 1.000 Unidades:</label>
                            <input
                              type="number"
                              value={prod.prices.qty1000}
                              onChange={(e) => {
                                const updated = [...almanaqueConfig.products];
                                updated[idx] = {
                                  ...updated[idx],
                                  prices: { ...updated[idx].prices, qty1000: Number(e.target.value) || 0 }
                                };
                                setAlmanaqueConfig({ ...almanaqueConfig, products: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 2: CATÁLOGO PDF COMPLETO Y PÁGINAS DEL MUESTRARIO */}
        {almanaqueSubTab === "paginas_pdf" && (
          <div className="space-y-6">
            {/* Global Document Upload */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-400" />
                  <h3 className="text-sm font-mono font-bold text-white uppercase">
                    Catálogo Completo en PDF (Documento Descargable)
                  </h3>
                </div>
                {almanaqueConfig.generalPdfUrl && (
                  <a
                    href={almanaqueConfig.generalPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Probar Documento PDF
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 border border-slate-700 transition-colors">
                  <Upload className="w-4 h-4 text-red-400" />
                  Subir PDF del Catálogo General
                  <input 
                    type="file" 
                    accept="application/pdf,.pdf" 
                    className="hidden" 
                    onChange={handleGeneralPdfUpload}
                  />
                </label>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="O pega URL directa del PDF completo aquí..."
                    value={almanaqueConfig.generalPdfUrl || ""}
                    onChange={(e) => setAlmanaqueConfig({ ...almanaqueConfig, generalPdfUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* List of Pages in PDF Broad Viewer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Páginas del Muestrario PDF (Visualizador Website):
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sube las imágenes o archivos de cada página que se muestra en el visor deslizante de la página web.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const pages = almanaqueConfig.pdfPages ? [...almanaqueConfig.pdfPages] : [];
                    const newPage = {
                      id: `page_${Date.now()}`,
                      pageNumber: pages.length + 1,
                      title: `Nueva Página ${pages.length + 1} del Muestrario`,
                      subtitle: `Formato de Almanaques 2027`,
                      imageUrl: "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=1200&q=90",
                      description: "Especificaciones de maquetación e impresión."
                    };
                    const updated = { ...almanaqueConfig, pdfPages: [...pages, newPage] };
                    setAlmanaqueConfig(updated);
                    saveConfig(clients, logoPreview, updated);
                  }}
                  className="px-3 py-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Añadir Nueva Página a la Muestra PDF
                </button>
              </div>

              {(!almanaqueConfig.pdfPages || almanaqueConfig.pdfPages.length === 0) ? (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    Actualmente se está mostrando el muestrario estandarizado por defecto.
                  </p>
                  <button
                    onClick={() => {
                      const defaultPages = [
                        {
                          id: "page_1",
                          pageNumber: 1,
                          title: "Vista General — Almanaque de Pared con Cabezote Publicitario",
                          subtitle: "Página 1: Encabezado corporativo, grilla de meses e ilustración principal",
                          imageUrl: "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=1200&q=90",
                          description: "Diseño con sangrados limpios, guía de perforación para ojal metálico y área de marca."
                        },
                        {
                          id: "page_2",
                          pageNumber: 2,
                          title: "Detalle de Hojas Mensuales & Días Festivos de Colombia",
                          subtitle: "Página 2: Diagramación de taco mensual con números gigantes visibles",
                          imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=90",
                          description: "Taco mensual desprendible con festivos oficiales marcados."
                        }
                      ];
                      const updated = { ...almanaqueConfig, pdfPages: defaultPages };
                      setAlmanaqueConfig(updated);
                      saveConfig(clients, logoPreview, updated);
                    }}
                    className="px-4 py-2 bg-yellow-400 text-neutral-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Personalizar Muestrario PDF Ahora
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {almanaqueConfig.pdfPages.map((page, pIdx) => (
                    <div key={page.id || pIdx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-mono font-bold text-yellow-400">
                          Página #{pIdx + 1} de {almanaqueConfig.pdfPages!.length}
                        </span>
                        <button
                          onClick={() => {
                            const pages = almanaqueConfig.pdfPages!.filter((_, i) => i !== pIdx);
                            const updated = { ...almanaqueConfig, pdfPages: pages };
                            setAlmanaqueConfig(updated);
                            saveConfig(clients, logoPreview, updated);
                          }}
                          className="text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar Página
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Page Preview Image */}
                        <div>
                          <label className="text-[11px] font-mono text-slate-400 block pb-1">Previsualización de Página:</label>
                          <div className="w-full h-32 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative">
                            <img src={page.imageUrl} alt={page.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="mt-2 space-y-1">
                            <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700">
                              <Upload className="w-3 h-3 text-yellow-400" /> Subir Muestra
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePdfPageImageUpload(pIdx, e)} />
                            </label>
                            <input
                              type="text"
                              value={page.imageUrl}
                              placeholder="URL imagen página..."
                              onChange={(e) => {
                                const pages = [...almanaqueConfig.pdfPages!];
                                pages[pIdx] = { ...pages[pIdx], imageUrl: e.target.value };
                                setAlmanaqueConfig({ ...almanaqueConfig, pdfPages: pages });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>

                        {/* Text Fields */}
                        <div className="md:col-span-2 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] font-mono text-slate-400 block">Título de la Página:</label>
                              <input
                                type="text"
                                value={page.title}
                                onChange={(e) => {
                                  const pages = [...almanaqueConfig.pdfPages!];
                                  pages[pIdx] = { ...pages[pIdx], title: e.target.value };
                                  setAlmanaqueConfig({ ...almanaqueConfig, pdfPages: pages });
                                }}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-bold focus:outline-none focus:border-yellow-400"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-mono text-slate-400 block">Subtítulo / Encabezado:</label>
                              <input
                                type="text"
                                value={page.subtitle || ""}
                                onChange={(e) => {
                                  const pages = [...almanaqueConfig.pdfPages!];
                                  pages[pIdx] = { ...pages[pIdx], subtitle: e.target.value };
                                  setAlmanaqueConfig({ ...almanaqueConfig, pdfPages: pages });
                                }}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-mono text-slate-400 block">Descripción Técnica:</label>
                            <textarea
                              rows={2}
                              value={page.description || ""}
                              onChange={(e) => {
                                const pages = [...almanaqueConfig.pdfPages!];
                                pages[pIdx] = { ...pages[pIdx], description: e.target.value };
                                setAlmanaqueConfig({ ...almanaqueConfig, pdfPages: pages });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: REGLAS DE TARIFAS Y TINTAS ADICIONALES */}
        {almanaqueSubTab === "tarifas" && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 max-w-2xl">
              <label className="text-xs font-mono text-yellow-400 font-bold uppercase flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Costo Adicional por Tinta / Color Especial (al paquete):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={almanaqueConfig.extraColorCost}
                  onChange={(e) => setAlmanaqueConfig({ ...almanaqueConfig, extraColorCost: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-yellow-400"
                />
                <span className="text-xs text-slate-400 font-mono">COP</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Esta regla se calcula dinámicamente en el cotizador interactivo. Cada color o tinta adicional que escoja el cliente sumará este monto exacto al precio total del pedido.
              </p>
            </div>
          </div>
        )}
      </div>
      )}

      {/* KPI METRICS & CLIENTS & ACCOUNTING SECTION */}
      {(activeAdminTab === "clientes" || activeAdminTab === "todo") && (
      <div className="space-y-8">
      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Clientes Activos</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-white">{totalActiveClients}</div>
          <p className="text-[10px] text-slate-400 font-mono">Proyectos cerrados con servicio</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Hosting + Dominio</span>
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-emerald-400">
            {formatCOP(totalHostingRev)}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Total cobrado ($400.000 / cliente)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Recaudo Mensualidades</span>
            <span className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-teal-300">
            {formatCOP(totalMonthlyRev)}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Total ingresado por cuotas</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Pendiente Por Cobrar</span>
            <span className="p-2 bg-brand-magenta/10 text-brand-magenta rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-brand-magenta">
            {formatCOP(totalPending)}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Cuotas o Hosting no pagados</p>
        </div>
      </div>

      {/* TWO COLUMNS: REGISTER CLIENT & CLIENTS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REGISTER CLIENT FORM */}
        <form
          onSubmit={handleAddClient}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-xl border border-brand-orange/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Registrar Nuevo Cliente</h3>
              <p className="text-xs text-slate-400">Registra un nuevo contrato o negocio cerrado.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Nombre del Cliente / Razón Social *
              </label>
              <input
                type="text"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Ej: Hotel Guatapé Real / Carlos Restrepo"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Nombre del Proyecto / Sitio Web *
              </label>
              <input
                type="text"
                value={newClientProject}
                onChange={(e) => setNewClientProject(e.target.value)}
                placeholder="Ej: Portal Turístico & Reservas Guatapé"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  WhatsApp / Celular
                </label>
                <input
                  type="text"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="3001234567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Fecha de Cierre
                </label>
                <input
                  type="date"
                  value={newClientStartDate}
                  onChange={(e) => setNewClientStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Hosting + Dominio ($ COP)
                </label>
                <input
                  type="number"
                  value={newClientHostingFee}
                  onChange={(e) => setNewClientHostingFee(parseFloat(e.target.value) || 400000)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  ¿Hosting Pagado?
                </label>
                <select
                  value={newClientHostingPaid ? "true" : "false"}
                  onChange={(e) => setNewClientHostingPaid(e.target.value === "true")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                >
                  <option value="true">Sí (Pagado $400.000)</option>
                  <option value="false">No (Pendiente)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Mensualidad Pactada ($ COP)
                </label>
                <input
                  type="number"
                  value={newClientMonthlyFee}
                  onChange={(e) => setNewClientMonthlyFee(parseFloat(e.target.value) || 280000)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Día de Cobro Mensual
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={newClientBillingDay}
                  onChange={(e) => setNewClientBillingDay(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Notas / Observaciones
              </label>
              <textarea
                value={newClientNotes}
                onChange={(e) => setNewClientNotes(e.target.value)}
                rows={2}
                placeholder="Ej: Incluye mantenimiento web mensual y actualización de productos."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-magenta text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Guardar Nuevo Cliente
            </button>
          </div>
        </form>

        {/* CLIENTS DIRECTORY & PAYMENT LOGS */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Directorio de Clientes y Pagos</h3>
              <p className="text-xs text-slate-400">
                Lleva el control individual de cada cliente, pagos iniciales y mensualidades.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente o proyecto..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-orange"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-orange"
              >
                <option value="all">Todos los Clientes</option>
                <option value="pending_hosting">Hosting Pendiente</option>
                <option value="pending_monthly">Mensualidad Pendiente</option>
                <option value="up_to_date">Al Día</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[700px] pr-1 flex-grow">
            {loading ? (
              <div className="text-center py-10 text-slate-500 text-xs">Cargando clientes...</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <Users className="w-8 h-8 text-slate-700" />
                {clients.length === 0
                  ? "No hay clientes registrados. Utiliza el formulario de la izquierda para agregar el primero."
                  : "No se encontraron clientes con el filtro actual."}
              </div>
            ) : (
              filteredClients.map((client) => (
                <ClientCardItem
                  key={client.id}
                  client={client}
                  formatCOP={formatCOP}
                  toggleHostingPaid={toggleHostingPaid}
                  handleAddPayment={handleAddPayment}
                  togglePaymentPaid={togglePaymentPaid}
                  deletePayment={deletePayment}
                  handleDeleteClient={handleDeleteClient}
                  generateWaLink={generateWaLink}
                  currentMonthCapitalized={currentMonthCapitalized}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* CONSOLIDATED ACCOUNTING SUMMARY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Resumen General de Contabilidad Mensual</h3>
              <p className="text-xs text-slate-400">
                Historial consolidado de todos los pagos registrados en la plataforma.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-400">Filtrar Período:</label>
            <select
              value={accountingPeriodFilter}
              onChange={(e) => setAccountingPeriodFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
            >
              <option value="all">Todos los registros</option>
              {uniquePeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredAccountingPayments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs italic">
              No hay registros de pago en la selección actual.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Proyecto</th>
                  <th className="py-2.5 px-3">Concepto</th>
                  <th className="py-2.5 px-3">Período</th>
                  <th className="py-2.5 px-3">Monto</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Método</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccountingPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800/60 hover:bg-slate-950/50 text-xs"
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{p.clientName}</td>
                    <td className="py-2.5 px-3 text-brand-orange font-mono text-[11px]">
                      {p.projectName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{p.concept}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {p.period}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-white">
                      {formatCOP(p.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {p.date}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{p.method}</td>
                    <td className="py-2.5 px-3">
                      {p.paid ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded font-bold">
                          PAGADO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-mono rounded font-bold">
                          PENDIENTE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-950 border-t-2 border-slate-800 font-bold text-xs">
                  <td colSpan={4} className="py-3 px-3 text-right uppercase font-mono text-slate-400">
                    Total Recaudado en Selección:
                  </td>
                  <td colSpan={4} className="py-3 px-3 font-mono text-emerald-400 text-sm">
                    {formatCOP(
                      filteredAccountingPayments
                        .filter((p) => p.paid)
                        .reduce((acc, curr) => acc + (curr.amount || 0), 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  )}
</div>
  );
}

interface ClientCardItemProps {
  key?: string;
  client: ClientRecord;
  formatCOP: (amount: number) => string;
  toggleHostingPaid: (id: string) => void;
  handleAddPayment: (
    clientId: string,
    payment: Omit<ClientPayment, "id">
  ) => void;
  togglePaymentPaid: (clientId: string, paymentId: string) => void;
  deletePayment: (clientId: string, paymentId: string) => void;
  handleDeleteClient: (clientId: string, name: string) => void;
  generateWaLink: (
    clientName: string,
    projectName: string,
    phone: string,
    concept: string,
    amount: number
  ) => string;
  currentMonthCapitalized: string;
}

function ClientCardItem({
  client,
  formatCOP,
  toggleHostingPaid,
  handleAddPayment,
  togglePaymentPaid,
  deletePayment,
  handleDeleteClient,
  generateWaLink,
  currentMonthCapitalized,
}: ClientCardItemProps) {
  const [concept, setConcept] = useState("Mensualidad");
  const [period, setPeriod] = useState(currentMonthCapitalized);
  const [amount, setAmount] = useState(client.monthlyFee || 280000);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [method, setMethod] = useState("Transferencia Bancolombia");

  const onSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddPayment(client.id, {
      concept: concept || "Mensualidad",
      period: period || "Mes Actual",
      amount: amount || 280000,
      date: date || new Date().toISOString().split("T")[0],
      method: method || "Transferencia Bancolombia",
      paid: true,
      notes: "",
    });
  };

  const waUrl = generateWaLink(
    client.clientName,
    client.projectName,
    client.phone,
    "Mensualidad de Servicio Web",
    client.monthlyFee || 280000
  );

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 relative group hover:border-slate-700 transition-colors">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white">{client.clientName}</h4>
            <span className="text-xs text-brand-orange font-mono font-semibold">
              ({client.projectName})
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Cierre: {client.startDate}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> {client.phone || "Sin teléfono"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Día de Cobro:{" "}
              <b className="text-slate-200">Día {client.billingDay}</b>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {client.phone && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Recordar Cobro WA
            </a>
          )}

          <button
            onClick={() => handleDeleteClient(client.id, client.clientName)}
            title="Eliminar Cliente"
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg text-xs border border-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Setup Fee and Monthly Dues Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Hosting y Dominio Inicial
            </span>
            <div className="mt-0.5">
              {client.hostingDomainPaid ? (
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PAGADO ({formatCOP(client.hostingDomainFee || 400000)})
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> PENDIENTE ({formatCOP(client.hostingDomainFee || 400000)})
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => toggleHostingPaid(client.id)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            {client.hostingDomainPaid ? "Marcar Pendiente" : "Marcar Pagado"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Mensualidad Pactada
            </span>
            <span className="text-sm font-bold font-mono text-white">
              {formatCOP(client.monthlyFee || 280000)} / mes
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Día {client.billingDay}</span>
        </div>
      </div>

      {client.notes && (
        <p className="text-xs text-slate-400 italic bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40">
          {client.notes}
        </p>
      )}

      {/* Bitácora de Pagos de este Cliente */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-brand-orange" /> Bitácora de Pagos del Cliente
          </h5>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2 px-3">Concepto</th>
                <th className="py-2 px-3">Período</th>
                <th className="py-2 px-3">Monto</th>
                <th className="py-2 px-3">Fecha</th>
                <th className="py-2 px-3">Método</th>
                <th className="py-2 px-3">Estado</th>
                <th className="py-2 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {!client.payments || client.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-slate-500 text-[11px] italic">
                    Sin registros de pago aún.
                  </td>
                </tr>
              ) : (
                client.payments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800/50 hover:bg-slate-900/40 text-xs"
                  >
                    <td className="py-2 px-3 text-slate-200 font-medium">{p.concept}</td>
                    <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{p.period}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-200">
                      {formatCOP(p.amount)}
                    </td>
                    <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{p.date}</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">{p.method}</td>
                    <td className="py-2 px-3">
                      {p.paid ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded font-bold">
                          PAGADO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-mono rounded font-bold">
                          PENDIENTE
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right space-x-1">
                      <button
                        onClick={() => togglePaymentPaid(client.id, p.id)}
                        title="Cambiar Estado de Pago"
                        className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors cursor-pointer"
                      >
                        {p.paid ? (
                          <X className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                      <button
                        onClick={() => deletePayment(client.id, p.id)}
                        title="Eliminar Registro"
                        className="p-1 bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Payment Form */}
        <form
          onSubmit={onSubmitPayment}
          className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800 space-y-3"
        >
          <span className="text-[11px] font-mono text-brand-orange uppercase font-bold block">
            + Registrar Nuevo Pago de Mensualidad
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Concepto
              </label>
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ej: Mensualidad"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Período / Mes
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ej: Julio 2027"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Monto ($ COP)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">
                Método
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-orange"
              >
                <option value="Transferencia Bancolombia">Bancolombia</option>
                <option value="Nequi">Nequi</option>
                <option value="Daviplata">Daviplata</option>
                <option value="Efectivo">Efectivo</option>
                <option value="MercadoPago">MercadoPago</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1 px-2 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg text-xs uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
