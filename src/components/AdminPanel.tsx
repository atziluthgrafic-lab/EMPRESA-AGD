import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  LogOut, 
  Check, 
  Link as LinkIcon, 
  Sparkles,
  AlertTriangle,
  Plus,
  Trash2,
  Briefcase,
  Megaphone
} from "lucide-react";
import { motion } from "motion/react";
import { MUNICIPALITIES } from "../data/antioquia";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: {
    webDesignMockup: string;
    restaurantAppMockup: string;
    municipalDirectoryBanner: string;
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
    customAds?: Array<{
      id: string;
      tag: string;
      caption: string;
      imageUrl: string;
    }>;
    categories?: string[];
  };
  onConfigUpdated: (newConfig: {
    webDesignMockup: string;
    restaurantAppMockup: string;
    municipalDirectoryBanner: string;
    customBusinesses: Array<{
      id: string;
      name: string;
      category: string;
      imageUrl: string;
      municipality?: string;
      subregion?: string;
      phone?: string;
      website?: string;
    }>;
    customAds: Array<{
      id: string;
      tag: string;
      caption: string;
      imageUrl: string;
    }>;
    categories: string[];
  }) => void;
}

export default function AdminPanel({ isOpen, onClose, currentConfig, onConfigUpdated }: AdminPanelProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("Estiven");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Local config form states
  const [webDesignMockup, setWebDesignMockup] = useState("");
  const [restaurantAppMockup, setRestaurantAppMockup] = useState("");
  const [municipalDirectoryBanner, setMunicipalDirectoryBanner] = useState("");
  
  // Custom categories list state
  const [categories, setCategories] = useState<string[]>([
    "Ferreterías",
    "Parqueaderos",
    "Tiendas",
    "Supermercados",
    "Farmacias",
    "Peluquerías",
    "Almacenes"
  ]);

  // Input state for adding a new category
  const [newCategoryName, setNewCategoryName] = useState("");

  // Custom businesses state list
  const [customBusinesses, setCustomBusinesses] = useState<Array<{
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    municipality?: string;
    subregion?: string;
    phone?: string;
    website?: string;
  }>>([]);

  // Custom advertisements list state
  const [customAds, setCustomAds] = useState<Array<{
    id: string;
    tag: string;
    caption: string;
    imageUrl: string;
  }>>([]);

  // Add new business states
  const [newBizName, setNewBizName] = useState("");
  const [newBizCategory, setNewBizCategory] = useState("Ferreterías");
  const [newBizImage, setNewBizImage] = useState("");
  const [newBizMuni, setNewBizMuni] = useState("Jardín");
  const [newBizPhone, setNewBizPhone] = useState("");
  const [newBizWebsite, setNewBizWebsite] = useState("");

  // Add new advertisement states
  const [newAdTag, setNewAdTag] = useState("");
  const [newAdCaption, setNewAdCaption] = useState("");
  const [newAdImage, setNewAdImage] = useState("");

  // Tabs selector supporting general banners, custom ads, and localized comercios
  const [activeTab, setActiveTab] = useState<"banners" | "anuncios" | "comercios">("banners");

  // UI States
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check if we are already authenticated via localStorage token
    const token = localStorage.getItem("atziluth_admin_token");
    if (token === "atziluth_secure_token_secret") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      localStorage.removeItem("atziluth_admin_token");
    }
  }, []);

  useEffect(() => {
    // Update local states when parent config loads, or when the panel is opened
    if (isOpen) {
      setWebDesignMockup(currentConfig.webDesignMockup || "");
      setRestaurantAppMockup(currentConfig.restaurantAppMockup || "");
      setMunicipalDirectoryBanner(currentConfig.municipalDirectoryBanner || "");
      setCustomBusinesses(currentConfig.customBusinesses || []);
      setCustomAds(currentConfig.customAds || []);
      if (currentConfig.categories && currentConfig.categories.length > 0) {
        setCategories(currentConfig.categories);
        // Auto-set the first category as selected default if the current selection is invalid or missing
        if (!currentConfig.categories.includes(newBizCategory)) {
          setNewBizCategory(currentConfig.categories[0]);
        }
      }
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("atziluth_admin_token", data.token);
        setIsAdmin(true);
        setPassword("");
      } else {
        setLoginError(data.error || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setLoginError("Error de red al intentar iniciar sesión.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("atziluth_admin_token");
    setIsAdmin(false);
    onClose();
  };

  const handleUploadFile = async (field: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    setUploadProgress((prev) => ({ ...prev, [field]: true }));
    
    try {
      // Read file as base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        const token = localStorage.getItem("atziluth_admin_token");
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            fileName: file.name,
            base64Data: base64Data
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          if (field === "webDesignMockup") {
            setWebDesignMockup(data.url);
          } else if (field === "restaurantAppMockup") {
            setRestaurantAppMockup(data.url);
          } else if (field === "municipalDirectoryBanner") {
            setMunicipalDirectoryBanner(data.url);
          } else if (field === "newBizImage") {
            setNewBizImage(data.url);
          } else if (field === "newAdImage") {
            setNewAdImage(data.url);
          } else if (field.startsWith("biz_img_")) {
            const bizId = field.replace("biz_img_", "");
            setCustomBusinesses(prev => prev.map(biz => biz.id === bizId ? { ...biz, imageUrl: data.url } : biz));
          } else if (field.startsWith("ad_img_")) {
            const adId = field.replace("ad_img_", "");
            setCustomAds(prev => prev.map(ad => ad.id === adId ? { ...ad, imageUrl: data.url } : ad));
          }
        } else {
          alert(`Error al subir imagen: ${data.error || "Error desconocido"}`);
        }
        setUploadProgress((prev) => ({ ...prev, [field]: false }));
      };
    } catch (err) {
      alert("Error en el envío del archivo.");
      setUploadProgress((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDrag = (e: React.DragEvent, field: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [field]: active }));
  };

  const handleDrop = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [field]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(field, e.dataTransfer.files[0]);
    }
  };

  const handleAddBusiness = () => {
    if (!newBizName.trim()) {
      alert("Por favor ingrese el nombre del comercio / empresa.");
      return;
    }
    const targetSub = MUNICIPALITIES.find((m) => m.name === newBizMuni)?.subregion || "valle_de_aburra";
    const newBizItem = {
      id: Date.now().toString(),
      name: newBizName.trim(),
      category: newBizCategory,
      imageUrl: newBizImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
      municipality: newBizMuni,
      subregion: targetSub,
      phone: newBizPhone.trim() || "+57 300 000 0000",
      website: newBizWebsite.trim() || `https://${newBizName.trim().toLowerCase().replace(/\s+/g, "")}.atziluth.com`
    };
    setCustomBusinesses((prev) => [...prev, newBizItem]);
    setNewBizName("");
    setNewBizImage("");
    setNewBizPhone("");
    setNewBizWebsite("");
    alert(`¡"${newBizItem.name}" añadido exitosamente a la lista local de ${newBizItem.municipality}! Para registrarlo globalmente en la base de datos, pulse el botón inferior "GUARDAR Y APLICAR CAMBIOS GLOBALMENTE".`);
  };

  const handleDeleteBusiness = (id: string) => {
    setCustomBusinesses((prev) => prev.filter(biz => biz.id !== id));
  };

  const handleUpdateBusinessName = (id: string, newName: string) => {
    setCustomBusinesses((prev) => prev.map(biz => biz.id === id ? { ...biz, name: newName } : biz));
  };

  const handleUpdateBusinessCategory = (id: string, newCat: string) => {
    setCustomBusinesses((prev) => prev.map(biz => biz.id === id ? { ...biz, category: newCat } : biz));
  };

  const handleUpdateBusinessUrl = (id: string, newUrl: string) => {
    setCustomBusinesses((prev) => prev.map(biz => biz.id === id ? { ...biz, imageUrl: newUrl } : biz));
  };

  const handleUpdateBusinessMuni = (id: string, newMuni: string) => {
    const targetSub = MUNICIPALITIES.find((m) => m.name === newMuni)?.subregion || "valle_de_aburra";
    setCustomBusinesses((prev) => prev.map(biz => biz.id === id ? { ...biz, municipality: newMuni, subregion: targetSub } : biz));
  };

  const handleUpdateBusinessPhone = (id: string, newPhone: string) => {
    setCustomBusinesses((prev) => prev.map(biz => biz.id === id ? { ...biz, phone: newPhone } : biz));
  };

  const handleUpdateBusinessWebsite = (id: string, newWebsite: string) => {
    setCustomBusinesses((prev) => prev.map(biz => biz.id === id ? { ...biz, website: newWebsite } : biz));
  };

  // Helper CRUD methods for custom Ads
  const handleAddAd = () => {
    if (!newAdImage) {
      alert("Por favor sube o proporciona la URL de la imagen del anuncio.");
      return;
    }
    const newAdItem = {
      id: Date.now().toString(),
      tag: newAdTag.trim() || "Anuncio Publicitario",
      caption: newAdCaption.trim() || "Anuncio promocional diseñado por Atziluth.",
      imageUrl: newAdImage
    };
    setCustomAds((prev) => [...prev, newAdItem]);
    setNewAdTag("");
    setNewAdCaption("");
    setNewAdImage("");
  };

  const handleDeleteAd = (id: string) => {
    setCustomAds((prev) => prev.filter(ad => ad.id !== id));
  };

  const handleUpdateAdTag = (id: string, newTag: string) => {
    setCustomAds((prev) => prev.map(ad => ad.id === id ? { ...ad, tag: newTag } : ad));
  };

  const handleUpdateAdCaption = (id: string, newCaption: string) => {
    setCustomAds((prev) => prev.map(ad => ad.id === id ? { ...ad, caption: newCaption } : ad));
  };

  const handleUpdateAdUrl = (id: string, newUrl: string) => {
    setCustomAds((prev) => prev.map(ad => ad.id === id ? { ...ad, imageUrl: newUrl } : ad));
  };

  const handleAddCategory = () => {
    const formatted = newCategoryName.trim();
    if (!formatted) {
      alert("Por favor escribe el nombre de la categoría.");
      return;
    }
    // Check for duplicates
    if (categories.some(cat => cat.toLowerCase() === formatted.toLowerCase())) {
      alert("Esta categoría ya existe.");
      return;
    }
    const updated = [...categories, formatted];
    setCategories(updated);
    setNewCategoryName("");
    // Automatically select it
    setNewBizCategory(formatted);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${catToDelete}"? Esto no borrará los comercios asociados, pero ya no se agruparán bajo esta categoría.`)) {
      const updated = categories.filter(c => c !== catToDelete);
      setCategories(updated);
      if (newBizCategory === catToDelete && updated.length > 0) {
        setNewBizCategory(updated[0]);
      }
    }
  };

  const handleSaveConfig = async () => {
    setSaveStatus("saving");
    setSaveErrorMessage("");

    let finalBusinesses = [...customBusinesses];
    // Guard against forgotten clicks: if they filled the "Registrar Nuevo Comercio" form but forgot to click "Añadir", add it!
    if (newBizName.trim()) {
      const targetSub = MUNICIPALITIES.find((m) => m.name === newBizMuni)?.subregion || "valle_de_aburra";
      const autoBiz = {
        id: Date.now().toString(),
        name: newBizName.trim(),
        category: newBizCategory,
        imageUrl: newBizImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
        municipality: newBizMuni,
        subregion: targetSub,
        phone: newBizPhone.trim() || "+57 300 000 0000",
        website: newBizWebsite.trim() || `https://${newBizName.trim().toLowerCase().replace(/\s+/g, "")}.atziluth.com`
      };
      finalBusinesses.push(autoBiz);
      setCustomBusinesses(finalBusinesses);
      setNewBizName("");
      setNewBizImage("");
      setNewBizPhone("");
      setNewBizWebsite("");
    }

    let finalAds = [...customAds];
    // Guard against forgotten clicks for custom advertisements too
    if (newAdTag.trim() || newAdCaption.trim() || newAdImage.trim()) {
      const autoAd = {
        id: Date.now().toString(),
        tag: newAdTag.trim() || "ANUNCIO",
        caption: newAdCaption.trim() || "Anuncio promocional activo diseñado por Atziluth para amplificar la visibilidad de tu marca.",
        imageUrl: newAdImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
      };
      finalAds.push(autoAd);
      setCustomAds(finalAds);
      setNewAdTag("");
      setNewAdCaption("");
      setNewAdImage("");
    }

    try {
      const token = localStorage.getItem("atziluth_admin_token");
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          webDesignMockup,
          restaurantAppMockup,
          municipalDirectoryBanner,
          customBusinesses: finalBusinesses,
          customAds: finalAds,
          categories
        })
      });

      if (response.status === 401) {
        setSaveStatus("error");
        setSaveErrorMessage("Sesión de administrador vencida o no autorizada. Por favor inicia sesión de nuevo.");
        localStorage.removeItem("atziluth_admin_token");
        setIsAdmin(false);
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setSaveStatus("success");
        const payload = {
          webDesignMockup,
          restaurantAppMockup,
          municipalDirectoryBanner,
          customBusinesses: finalBusinesses,
          customAds: finalAds,
          categories
        };
        // Persist locally in customer's browser as a hard redundant backup against container restarts/recycling
        localStorage.setItem("atziluth_custom_config", JSON.stringify(payload));
        
        onConfigUpdated(payload);
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setSaveErrorMessage(data.error || "No se pudo guardar la configuración.");
      }
    } catch (err) {
      setSaveStatus("error");
      setSaveErrorMessage("Error de red al guardar la configuración.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-theme-bg/95 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#020a22]/95 border border-blue-900/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        id="panel-control-interior"
      >
        {/* Absolute Background Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Header Close */}
        <div className="flex items-center justify-between border-b border-blue-900/30 pb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-950/80 rounded-xl border border-blue-900/40">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider font-sans">
                Panel de Control de Contenidos
              </h2>
              <span className="text-[10px] text-neutral-400 font-mono block">
                ATZILUTH ADMIN INTERFACE // BIENVENIDO ESTIVEN
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg bg-[#030e2f] border border-blue-900/30 text-neutral-400 hover:text-white hover:border-blue-900/70 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN BODY CONTENTS */}
        {!isAdmin ? (
          /* LOGIN MODULE */
          <div className="py-12 max-w-md mx-auto space-y-6 relative z-10">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3.5 bg-yellow-950/50 border border-yellow-800/30 rounded-2xl text-yellow-400 mb-2">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Acceso Autenticado</h3>
              <p className="text-xs text-neutral-400">
                Esta sección está protegida para conservar la integridad del sitio. Por favor introduce la clave de administrador para configurar las imágenes web.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                  Usuario de Acceso
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. Estiven"
                  className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                  Clave de Acceso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••••••••"
                  className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3.5 bg-red-950/40 border border-red-900/30 rounded-xl text-red-400 text-xs flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-yellow-500 to-emerald-500 hover:from-yellow-400 hover:to-emerald-400/90 text-neutral-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando Credenciales...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ingresar al Control de Imágenes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHORIZED PANEL WITH TABS */
          <div className="space-y-6 relative z-10">
            {/* Top Info with Logout */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-blue-950/20 border border-blue-900/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sesión Activa: Administrador Estiven ({customBusinesses.length} comercios registrados)</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-mono tracking-wider bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 rounded-lg py-1 px-2.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                CERRAR SESIÓN
              </button>
            </div>

            {/* TAB SELECTION */}
            <div className="flex flex-wrap gap-2 border-b border-blue-900/30 pb-1">
              <button
                type="button"
                onClick={() => setActiveTab("banners")}
                className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === "banners" 
                    ? "text-yellow-400" 
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Banners Generales Del Sitio
                {activeTab === "banners" && (
                  <motion.div layoutId="adm_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("anuncios")}
                className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === "anuncios" 
                    ? "text-yellow-400" 
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Anuncios Especiales ({customAds.length})
                {activeTab === "anuncios" && (
                  <motion.div layoutId="adm_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("comercios")}
                className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === "comercios" 
                    ? "text-yellow-400" 
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Registrar Comercios locales {customBusinesses.length > 0 && `(${customBusinesses.length})`}
                {activeTab === "comercios" && (
                  <motion.div layoutId="adm_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
                )}
              </button>
            </div>

            {/* TAB 1: GENERAL BANNERS */}
            {activeTab === "banners" && (
              <div className="space-y-6">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Configura las imágenes principales del portal. Puedes <strong>pegar una URL externa</strong> o <strong>arrastrar/subir</strong> tu archivo directamente.
                </p>

                <div className="space-y-6">
                  {/* IMAGE 1: WEB DESIGN */}
                  <div className="p-4 bg-[#020516] border border-blue-900/30 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> 1. Mockup Web Café La Palma (Slider)
                      </h4>
                      {webDesignMockup && (
                        <button
                          type="button"
                          onClick={() => setWebDesignMockup("")}
                          className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300 cursor-pointer"
                        >
                          (Restablecer predeterminado)
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-400 block">URL de la Imagen</label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                            <input
                              type="text"
                              value={webDesignMockup}
                              onChange={(e) => setWebDesignMockup(e.target.value)}
                              placeholder="Pegar URL de la imagen aquí..."
                              className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        {/* Drag and Drop */}
                        <div
                          onDragEnter={(e) => handleDrag(e, "webDesignMockup", true)}
                          onDragOver={(e) => handleDrag(e, "webDesignMockup", true)}
                          onDragLeave={(e) => handleDrag(e, "webDesignMockup", false)}
                          onDrop={(e) => handleDrop(e, "webDesignMockup")}
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                            dragActive["webDesignMockup"]
                              ? "border-yellow-400 bg-yellow-500/5"
                              : "border-blue-900/30 bg-[#02030a]/40 hover:border-blue-950"
                          }`}
                        >
                          {uploadProgress["webDesignMockup"] ? (
                            <div className="flex flex-col items-center gap-1">
                              <RefreshCw className="w-5 h-5 animate-spin text-yellow-400" />
                              <span className="text-[10px] text-neutral-400 font-mono">Subiendo al Servidor...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 selection:pointer-events-none">
                              <Upload className="w-5 h-5 text-neutral-500" />
                              <p className="text-[10px] text-neutral-400">Arrastra archivo o haz clic para subir</p>
                              <input
                                type="file"
                                accept="image/*"
                                id="file-webDesignMockup"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleUploadFile("webDesignMockup", e.target.files[0]);
                                  }
                                }}
                              />
                              <label 
                                htmlFor="file-webDesignMockup" 
                                className="text-[9px] text-yellow-500 font-bold hover:underline cursor-pointer block mt-0.5"
                              >
                                EXPLORAR ARCHIVO
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Preview Box */}
                      <div className="bg-[#020a22]/50 border border-blue-900/10 rounded-xl overflow-hidden flex items-center justify-center p-2 relative min-h-[120px]">
                        {webDesignMockup ? (
                          <img
                            src={webDesignMockup}
                            alt="Preview Mockup Café La Palma"
                            className="max-h-[140px] w-auto object-contain rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center text-neutral-600 space-y-1">
                            <ImageIcon className="w-8 h-8 mx-auto text-neutral-700" />
                            <span className="text-[9px] font-mono uppercase block">Sello Original Activo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* IMAGE 2: APP GOURMET */}
                  <div className="p-4 bg-[#020516] border border-blue-900/30 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> 2. Mockup Web Aplicativo Gourmet (Slider)
                      </h4>
                      {restaurantAppMockup && (
                        <button
                          type="button"
                          onClick={() => setRestaurantAppMockup("")}
                          className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300 cursor-pointer"
                        >
                          (Restablecer predeterminado)
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-400 block">URL de la Imagen</label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                            <input
                              type="text"
                              value={restaurantAppMockup}
                              onChange={(e) => setRestaurantAppMockup(e.target.value)}
                              placeholder="Pegar URL de la imagen aquí..."
                              className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        {/* Drag and Drop */}
                        <div
                          onDragEnter={(e) => handleDrag(e, "restaurantAppMockup", true)}
                          onDragOver={(e) => handleDrag(e, "restaurantAppMockup", true)}
                          onDragLeave={(e) => handleDrag(e, "restaurantAppMockup", false)}
                          onDrop={(e) => handleDrop(e, "restaurantAppMockup")}
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                            dragActive["restaurantAppMockup"]
                              ? "border-yellow-400 bg-yellow-500/5"
                              : "border-blue-900/30 bg-[#02030a]/40 hover:border-blue-950"
                          }`}
                        >
                          {uploadProgress["restaurantAppMockup"] ? (
                            <div className="flex flex-col items-center gap-1">
                              <RefreshCw className="w-5 h-5 animate-spin text-yellow-400" />
                              <span className="text-[10px] text-neutral-400 font-mono">Subiendo al Servidor...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 selection:pointer-events-none">
                              <Upload className="w-5 h-5 text-neutral-500" />
                              <p className="text-[10px] text-neutral-400">Arrastra archivo o haz clic para subir</p>
                              <input
                                type="file"
                                accept="image/*"
                                id="file-restaurantAppMockup"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleUploadFile("restaurantAppMockup", e.target.files[0]);
                                  }
                                }}
                              />
                              <label 
                                htmlFor="file-restaurantAppMockup" 
                                className="text-[9px] text-yellow-500 font-bold hover:underline cursor-pointer block mt-0.5"
                              >
                                EXPLORAR ARCHIVO
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Preview Box */}
                      <div className="bg-[#020a22]/50 border border-blue-900/10 rounded-xl overflow-hidden flex items-center justify-center p-2 relative min-h-[120px]">
                        {restaurantAppMockup ? (
                          <img
                            src={restaurantAppMockup}
                            alt="Preview Mockup Gourmet"
                            className="max-h-[140px] w-auto object-contain rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center text-neutral-600 space-y-1">
                            <ImageIcon className="w-8 h-8 mx-auto text-neutral-700" />
                            <span className="text-[9px] font-mono uppercase block">Sello Original Activo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* IMAGE 3: DIRECTORY BANNER */}
                  <div className="p-4 bg-[#020516] border border-blue-900/30 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> 3. Banner Panorama Municipio (Jardín)
                      </h4>
                      {municipalDirectoryBanner && (
                        <button
                          type="button"
                          onClick={() => setMunicipalDirectoryBanner("")}
                          className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300 cursor-pointer"
                        >
                          (Restablecer predeterminado)
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-400 block">URL de la Imagen</label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                            <input
                              type="text"
                              value={municipalDirectoryBanner}
                              onChange={(e) => setMunicipalDirectoryBanner(e.target.value)}
                              placeholder="Pegar URL de la imagen aquí..."
                              className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        {/* Drag and Drop */}
                        <div
                          onDragEnter={(e) => handleDrag(e, "municipalDirectoryBanner", true)}
                          onDragOver={(e) => handleDrag(e, "municipalDirectoryBanner", true)}
                          onDragLeave={(e) => handleDrag(e, "municipalDirectoryBanner", false)}
                          onDrop={(e) => handleDrop(e, "municipalDirectoryBanner")}
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                            dragActive["municipalDirectoryBanner"]
                              ? "border-yellow-400 bg-yellow-500/5"
                              : "border-blue-900/30 bg-[#02030a]/40 hover:border-blue-950"
                          }`}
                        >
                          {uploadProgress["municipalDirectoryBanner"] ? (
                            <div className="flex flex-col items-center gap-1">
                              <RefreshCw className="w-5 h-5 animate-spin text-yellow-400" />
                              <span className="text-[10px] text-neutral-400 font-mono">Subiendo al Servidor...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 selection:pointer-events-none">
                              <Upload className="w-5 h-5 text-neutral-500" />
                              <p className="text-[10px] text-neutral-400">Arrastra archivo o haz clic para subir</p>
                              <input
                                type="file"
                                accept="image/*"
                                id="file-municipalDirectoryBanner"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleUploadFile("municipalDirectoryBanner", e.target.files[0]);
                                  }
                                }}
                              />
                              <label 
                                htmlFor="file-municipalDirectoryBanner" 
                                className="text-[9px] text-yellow-500 font-bold hover:underline cursor-pointer block mt-0.5"
                              >
                                EXPLORAR ARCHIVO
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Preview Box */}
                      <div className="bg-[#020a22]/50 border border-blue-900/10 rounded-xl overflow-hidden flex items-center justify-center p-2 relative min-h-[120px]">
                        {municipalDirectoryBanner ? (
                          <img
                            src={municipalDirectoryBanner}
                            alt="Preview Banner Plaza de Jardín"
                            className="max-h-[140px] w-auto object-contain rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center text-neutral-600 space-y-1">
                            <ImageIcon className="w-8 h-8 mx-auto text-neutral-700" />
                            <span className="text-[9px] font-mono uppercase block">Sello Original Activo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ANUNCIOS Y BANNERS ROTATIVOS ESPECIALES */}
            {activeTab === "anuncios" && (
              <div className="space-y-6">
                <div className="p-4 bg-yellow-950/20 border border-yellow-900/30 rounded-2xl">
                  <p className="text-xs text-neutral-300 leading-relaxed flex items-start gap-2">
                    <Megaphone className="w-4 h-4 shrink-0 text-yellow-400 mt-0.5" />
                    <span>
                      <strong>¡Nueva Función Administradora!</strong> Agrega aquí de la forma más fácil anuncios directos, promociones de temporada, ofertas de empleo o avisos municipales. Las imágenes que agregues o subas aquí se incorporarán de inmediato en el carrusel de banners superiores con el diseño estandarizado de alta gama de Atziluth.
                    </span>
                  </p>
                </div>

                {/* FORM: REGISTER NEW ADVERTISING BANNER */}
                <div className="bg-[#030e2f]/50 border border-blue-900/40 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Plus className="w-4 h-4" />
                    <h4 className="text-xs font-bold font-mono tracking-wider uppercase">Registrar Nuevo Anuncio / Banner</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Título o Badge */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Título Corto / Tag (Ej: OFERTA ESPECIAL)</label>
                      <input
                        type="text"
                        value={newAdTag}
                        onChange={(e) => setNewAdTag(e.target.value)}
                        placeholder="Ej. SÚPER PROMO DE HOY"
                        className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans"
                      />
                    </div>

                    {/* Descripción o Banner caption */}
                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Descripción Completa del Anuncio</label>
                      <input
                        type="text"
                        value={newAdCaption}
                        onChange={(e) => setNewAdCaption(e.target.value)}
                        placeholder="Ej. Ven y disfruta de deliciosos platillos con un 30% de descuento en el menú del día."
                        className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans"
                      />
                    </div>

                    {/* Image URL / Local Uploader */}
                    <div className="space-y-1 col-span-1 md:col-span-3">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Imagen del Anuncio Publicitario (Sube un archivo o pega una URL)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <LinkIcon className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-600" />
                          <input
                            type="text"
                            value={newAdImage}
                            onChange={(e) => setNewAdImage(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full bg-[#020516] border border-blue-900/50 rounded-xl pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                          />
                        </div>
                        
                        {/* Drag other files directly */}
                        <div className="shrink-0">
                          <input
                            type="file"
                            accept="image/*"
                            id="file-newAdImage"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleUploadFile("newAdImage", e.target.files[0]);
                              }
                            }}
                          />
                          <label
                            htmlFor="file-newAdImage"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-950 border border-blue-900/50 rounded-xl text-[10px] font-mono font-bold text-yellow-400 hover:text-white cursor-pointer hover:border-blue-700 transition-colors"
                          >
                            {uploadProgress["newAdImage"] ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            SUBIR IMAGEN / ARCHIVO
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {newAdImage && (
                    <div className="flex items-center gap-3 bg-[#020516]/40 p-2.5 rounded-xl border border-blue-950/40">
                      <img src={newAdImage} alt="Previo anuncio" className="w-16 h-12 object-cover rounded-lg border border-blue-900/20" />
                      <div className="text-left flex-grow">
                        <span className="text-[9px] text-emerald-400 font-mono block uppercase">✓ Imagen cargada para banner</span>
                        <span className="text-[10px] text-neutral-300 block font-sans font-bold truncate max-w-md">Tag: {newAdTag || "ANUNCIO PUBLICITARIO"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewAdImage("")}
                        className="text-red-400 hover:text-red-300 transition-colors text-xs font-mono"
                      >
                        Remover
                      </button>
                    </div>
                  )}

                  {/* Add Button */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                    <p className="text-[10px] text-yellow-400 font-mono text-left max-w-sm leading-normal animate-pulse flex items-center gap-1">
                      <span>⚠️ Recuerda pulsar el botón grande inferior <strong>"GUARDAR Y APLICAR CAMBIOS GLOBALMENTE"</strong> al terminar para no perder tus cambios.</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleAddAd}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Añadir Anuncio al Carrusel de Banners
                    </button>
                  </div>
                </div>

                {/* CURRENT ADVERTISEMENTS LIST */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest border-b border-blue-900/20 pb-2">
                    Anuncios Añadidos Actualmente ({customAds.length})
                  </h4>

                  {customAds.length === 0 ? (
                    <div className="text-center py-10 bg-[#020516]/20 border border-blue-900/20 rounded-2xl space-y-2">
                      <Megaphone className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-xs text-neutral-400 font-mono">No hay anuncios o banners especiales registrados.</p>
                      <p className="text-[10px] text-neutral-500 max-w-sm mx-auto">
                        Agrega un anuncio arriba para publicitar ofertas e imágenes especiales que se rotarán automáticamente en el carrusel principal.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {customAds.map((ad) => (
                        <div 
                          key={ad.id} 
                          className="p-4 bg-[#020516] border border-blue-900/25 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between"
                        >
                          {/* Left: Input values info */}
                          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] text-neutral-500 font-mono uppercase block">Título Corto / Tag del Anuncio</label>
                              <input
                                type="text"
                                value={ad.tag}
                                onChange={(e) => handleUpdateAdTag(ad.id, e.target.value)}
                                className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl px-2.5 py-1.5 text-xs text-white uppercase font-sans font-bold focus:border-yellow-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] text-neutral-500 font-mono uppercase block font-bold text-yellow-500">Imagen del Anuncio (URL o Sube archivo)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={ad.imageUrl}
                                  onChange={(e) => handleUpdateAdUrl(ad.id, e.target.value)}
                                  className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:border-yellow-400"
                                />
                                
                                {/* Live Upload replacement button */}
                                <div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`file-ad-img-${ad.id}`}
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleUploadFile(`ad_img_${ad.id}`, e.target.files[0]);
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`file-ad-img-${ad.id}`}
                                    className="px-2 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-900/40 rounded-lg text-[9px] font-mono text-yellow-400 cursor-pointer block text-center"
                                  >
                                    {uploadProgress[`ad_img_${ad.id}`] ? (
                                      <RefreshCw className="w-3 h-3 animate-spin mx-auto" />
                                    ) : (
                                      "SUBIR"
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1 col-span-1 md:col-span-2">
                              <label className="text-[9px] text-neutral-500 font-mono uppercase block">Descripción del Anuncio</label>
                              <input
                                type="text"
                                value={ad.caption}
                                onChange={(e) => handleUpdateAdCaption(ad.id, e.target.value)}
                                className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl px-2.5 py-1.5 text-xs text-white font-sans focus:border-yellow-400"
                              />
                            </div>
                          </div>

                          {/* Right: Small Image Preview & Delete Action */}
                          <div className="w-full md:w-auto flex items-center md:justify-end gap-3 shrink-0">
                            <div className="w-20 h-14 bg-neutral-950 rounded-lg overflow-hidden flex items-center justify-center border border-blue-900/20 shadow-inner">
                              {ad.imageUrl ? (
                                <img 
                                  src={ad.imageUrl} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-neutral-600" />
                              )}
                            </div>

                            {/* Delete icon */}
                            <button
                              type="button"
                              onClick={() => handleDeleteAd(ad.id)}
                              className="p-2 bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer shadow"
                              title="Eliminar este anuncio"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: REGISTER CUSTOM BUSINESSES BY CATEGORY */}
            {activeTab === "comercios" && (
              <div className="space-y-6">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Registra nuevas empresas, locales o servicios bajo las categorías designadas. Las imágenes y nombres de los comercios agregados se incorporarán de forma automática al <strong>slider principal del banner</strong>, permitiendo mostrar a los clientes reales en la home.
                </p>

                {/* CATEGORIES MANAGER (DYNAMIC GESTION) */}
                <div className="bg-[#030e2f]/50 border border-blue-900/40 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-xs font-bold font-mono tracking-wider text-white uppercase">Gestión de Categorías</h4>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Crea nuevas categorías personalizadas para agrupar tus comercios locales en el carrusel de banners superior. También puedes eliminar categorías que ya no utilices.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ej. Restaurantes, Hoteles, Cafés..."
                      className="flex-grow bg-[#020516] border border-blue-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow active:scale-95 whitespace-nowrap"
                    >
                      Añadir Categoría
                    </button>
                  </div>

                  {/* List of current dynamic categories as tags */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] text-neutral-500 font-mono uppercase block">Categorías Activas (Haz clic en la 'x' para eliminar)</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <div 
                          key={cat} 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#020516] border border-blue-900/30 rounded-lg text-xs font-medium text-neutral-300"
                        >
                          <span>{cat}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer text-[10px] font-bold px-0.5"
                            title={`Eliminar categoría ${cat}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FORM: REGISTER NEW BUSINESS */}
                <div className="bg-[#030e2f]/50 border border-blue-900/40 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-xs font-bold font-mono tracking-wider text-white uppercase">Registrar Nuevo Comercio</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Nombre de la Empresa o Servicio</label>
                      <input
                        type="text"
                        value={newBizName}
                        onChange={(e) => setNewBizName(e.target.value)}
                        placeholder="Ej. Ferretería El Progreso"
                        className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans"
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Categoría Designada</label>
                      <select
                        value={newBizCategory}
                        onChange={(e) => setNewBizCategory(e.target.value)}
                        className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-neutral-950 text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Municipality Cobertura Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Municipio de Antioquia</label>
                      <select
                        value={newBizMuni}
                        onChange={(e) => setNewBizMuni(e.target.value)}
                        className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans cursor-pointer"
                      >
                        {MUNICIPALITIES.map((m) => (
                          <option key={m.name} value={m.name} className="bg-neutral-950 text-white">
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Teléfono / WhatsApp de Contacto</label>
                      <input
                        type="text"
                        value={newBizPhone}
                        onChange={(e) => setNewBizPhone(e.target.value)}
                        placeholder="Ej. +57 310 456 7890"
                        className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans"
                      />
                    </div>

                    {/* Website Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Sitio Web o Red Social</label>
                      <input
                        type="text"
                        value={newBizWebsite}
                        onChange={(e) => setNewBizWebsite(e.target.value)}
                        placeholder="Ej. www.ferreteriaelprogreso.com"
                        className="w-full bg-[#020516] border border-blue-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans"
                      />
                    </div>

                    {/* Image URL / Local Uploader */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-mono block uppercase">Imagen del Negocio (URL o Archivo)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <LinkIcon className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-600" />
                          <input
                            type="text"
                            value={newBizImage}
                            onChange={(e) => setNewBizImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-[#020516] border border-blue-900/50 rounded-xl pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                          />
                        </div>
                        
                        {/* Instant File Selection */}
                        <div className="shrink-0">
                          <input
                            type="file"
                            accept="image/*"
                            id="file-newBizImage"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleUploadFile("newBizImage", e.target.files[0]);
                              }
                            }}
                          />
                          <label
                            htmlFor="file-newBizImage"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-950 border border-blue-900/50 rounded-xl text-[10px] font-mono font-bold text-yellow-400 hover:text-white cursor-pointer hover:border-blue-700 transition-colors"
                          >
                            {uploadProgress["newBizImage"] ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            SUBIR
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview for New Business if set */}
                  {newBizImage && (
                    <div className="flex items-center gap-3 bg-[#020516]/40 p-2.5 rounded-xl border border-blue-950/40">
                      <img src={newBizImage} alt="Previo" className="w-12 h-12 object-cover rounded-lg border border-blue-900/20" />
                      <div className="text-left">
                        <span className="text-[9px] text-emerald-400 font-mono block uppercase">✓ Imagen cargada con éxito</span>
                        <span className="text-[10px] text-neutral-400 block font-mono truncate max-w-xs">{newBizImage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewBizImage("")}
                        className="ml-auto text-red-400 hover:text-red-300 transition-colors text-xs font-mono"
                      >
                        Remover
                      </button>
                    </div>
                  )}

                  {/* Add Button */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                    <p className="text-[10px] text-yellow-400 font-mono text-left max-w-sm leading-normal animate-pulse flex items-center gap-1">
                      <span>⚠️ Recuerda pulsar el botón grande inferior <strong>"GUARDAR Y APLICAR CAMBIOS GLOBALMENTE"</strong> al terminar para no perder tus cambios.</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleAddBusiness}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Añadir Comercio a la lista
                    </button>
                  </div>
                </div>

                {/* VISUAL LAYOUT OF ADDED BUSINESSES GROUPED BY THE DESIGNATED CATEGORIES */}
                <div className="space-y-6">
                  <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest border-b border-blue-900/20 pb-2">
                    Esquema de Comercios Locales Registrados
                  </h4>

                  {customBusinesses.length === 0 ? (
                    <div className="text-center py-10 bg-[#020516]/20 border border-blue-900/20 rounded-2xl space-y-2">
                      <Briefcase className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-xs text-neutral-400 font-mono">No hay comercios personalizados registrados aún.</p>
                      <p className="text-[10px] text-neutral-500 max-w-sm mx-auto">Agrega comercios arriba (Ferreterías, Parqueaderos, Supermercados, etc.) para que se expongan dinámicamente con su imagen en el banner principal.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 block">
                      {categories.map((cat) => {
                        const items = customBusinesses.filter(b => b.category === cat);
                        if (items.length === 0) return null;

                        return (
                          <div key={cat} className="space-y-3">
                            {/* Category Badge Header */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-950/20 border border-yellow-900/30 rounded-lg">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                              <span className="text-xs font-black font-sans uppercase tracking-wider text-yellow-400">{cat}</span>
                              <span className="text-[10px] text-neutral-400 font-mono">({items.length})</span>
                            </div>

                            {/* Cards list for each business registered in this category */}
                            <div className="grid grid-cols-1 gap-4">
                              {items.map((biz) => (
                                <div 
                                  key={biz.id} 
                                  className="p-4 bg-[#020516] border border-blue-900/25 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between"
                                >
                                  {/* Enterprise Name and Category Control */}
                                  <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Column 1: Name and Category */}
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-neutral-500 font-mono uppercase block">Nombre de la Empresa</label>
                                      <input
                                        type="text"
                                        value={biz.name}
                                        onChange={(e) => handleUpdateBusinessName(biz.id, e.target.value)}
                                        className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl px-2.5 py-1 text-xs text-white uppercase font-sans font-bold focus:border-yellow-400 font-bold"
                                      />
                                      
                                      <label className="text-[9px] text-neutral-500 font-mono uppercase block pt-1">Categoría</label>
                                      <select
                                        value={biz.category}
                                        onChange={(e) => handleUpdateBusinessCategory(biz.id, e.target.value)}
                                        className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none font-sans cursor-pointer"
                                      >
                                        {categories.map(c => (
                                          <option key={c} value={c}>{c}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* Column 2: Location and Contact Details */}
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-neutral-500 font-mono uppercase block">Municipio Cobertura</label>
                                      <select
                                        value={biz.municipality || "Jardín"}
                                        onChange={(e) => handleUpdateBusinessMuni(biz.id, e.target.value)}
                                        className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none font-sans cursor-pointer"
                                      >
                                        {MUNICIPALITIES.map(m => (
                                          <option key={m.name} value={m.name}>{m.name}</option>
                                        ))}
                                      </select>

                                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                                        <div>
                                          <label className="text-[9px] text-neutral-500 font-mono uppercase block">WhatsApp</label>
                                          <input
                                            type="text"
                                            value={biz.phone || ""}
                                            onChange={(e) => handleUpdateBusinessPhone(biz.id, e.target.value)}
                                            placeholder="+57..."
                                            className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl px-2 py-1 text-[10px] text-white font-mono focus:border-yellow-400"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[9px] text-neutral-500 font-mono uppercase block">Sitio Web</label>
                                          <input
                                            type="text"
                                            value={biz.website || ""}
                                            onChange={(e) => handleUpdateBusinessWebsite(biz.id, e.target.value)}
                                            placeholder="URL..."
                                            className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl px-2 py-1 text-[10px] text-white font-mono focus:border-yellow-400"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Image Picker slot "espacio para agregar la imagen" */}
                                  <div className="w-full md:w-1/3 space-y-1.5">
                                    <label className="text-[9px] text-neutral-500 font-mono uppercase block">Enlace de la imagen o Subida Directa</label>
                                    <div className="flex gap-1.5">
                                      <div className="relative flex-grow">
                                        <input
                                          type="text"
                                          value={biz.imageUrl}
                                          onChange={(e) => handleUpdateBusinessUrl(biz.id, e.target.value)}
                                          className="w-full bg-[#02030a] border border-blue-900/40 rounded-xl pl-3 pr-2 py-1 text-[11px] text-white font-mono"
                                        />
                                      </div>
                                      
                                      {/* Slot upload button for this designated single row business */}
                                      <div className="shrink-0">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          id={`file_biz_${biz.id}`}
                                          className="hidden"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              handleUploadFile(`biz_img_${biz.id}`, e.target.files[0]);
                                            }
                                          }}
                                        />
                                        <label
                                          htmlFor={`file_biz_${biz.id}`}
                                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-950 border border-blue-900/40 rounded-xl text-[10px] font-mono font-bold text-neutral-400 hover:text-white cursor-pointer"
                                        >
                                          {uploadProgress[`biz_img_${biz.id}`] ? (
                                            <RefreshCw className="w-3 animate-spin text-yellow-400" />
                                          ) : (
                                            <Upload className="w-3 h-3" />
                                          )}
                                          SUBIR
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Hover Thumbnail and Delete */}
                                  <div className="flex items-center gap-4">
                                    {/* Thumbnail box */}
                                    <div className="w-16 h-16 rounded-xl border border-blue-900/30 overflow-hidden bg-[#020a22] flex items-center justify-center p-1 shrink-0">
                                      {biz.imageUrl ? (
                                        <img 
                                          src={biz.imageUrl} 
                                          alt={biz.name} 
                                          className="w-full h-full object-cover rounded-lg"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <ImageIcon className="w-4 h-4 text-neutral-600" />
                                      )}
                                    </div>

                                    {/* Delete icon */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteBusiness(biz.id)}
                                      className="p-2 bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer shadow"
                                      title="Eliminar este comercio"
                                    >
                                      <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error notifications */}
            {saveStatus === "error" && (
              <div className="p-3.5 bg-red-950/40 border border-red-900/30 rounded-xl text-red-400 text-xs flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{saveErrorMessage}</span>
              </div>
            )}

            {/* Success notifications */}
            {saveStatus === "success" && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-950/50 rounded-xl text-emerald-400 text-xs flex items-center gap-2 font-mono">
                <Check className="w-4 h-4 shrink-0 bg-emerald-500/20 rounded-full p-0.5" />
                <span>¡Configuración guardada y publicada dinámicamente con éxito!</span>
              </div>
            )}

            {/* Footer Form Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-900/30">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={saveStatus === "saving"}
                className="flex-grow bg-gradient-to-r from-yellow-500 to-emerald-500 hover:from-yellow-400 hover:to-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
              >
                {saveStatus === "saving" ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Guardando Configuración...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>GUARDAR Y APLICAR CAMBIOS GLOBALMENTE</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl border border-blue-900/30 transition-all cursor-pointer"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
