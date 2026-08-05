import React, { useState, useEffect } from "react";
import {
  Calendar,
  Sparkles,
  FileText,
  Download,
  Search,
  ShoppingCart,
  CheckCircle2,
  Truck,
  Tag,
  Grid,
  Eye,
  MessageSquare,
  X,
  ExternalLink,
  Lock,
  ChevronRight
} from "lucide-react";
import { getAlmanaquesData, AlmanaquesData, ProductReference, Category } from "../data/almanaquesData";

interface AlmanaquesSectionProps {
  onOpenAsistencia?: () => void;
}

export default function AlmanaquesSection({ onOpenAsistencia }: AlmanaquesSectionProps) {
  const [data, setData] = useState<AlmanaquesData>(getAlmanaquesData());
  const [selectedCatId, setSelectedCatId] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductReference | null>(null);
  
  // Modal order state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderQty, setOrderQty] = useState<number>(100);
  const [orderBranding, setOrderBranding] = useState<string>("1_color");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientMuni, setClientMuni] = useState("");
  const [clientNotes, setClientNotes] = useState("");

  useEffect(() => {
    const handleUpdate = () => {
      setData(getAlmanaquesData());
    };
    window.addEventListener("almanaques-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("almanaques-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Filter products
  const filteredProducts = data.products.filter((p) => {
    const matchesCategory = selectedCatId === "all" || p.categoryId === Number(selectedCatId);
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.ref.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.finish.toLowerCase().includes(q) ||
      p.paper.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const openOrderForProduct = (product: ProductReference) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  // Discount calculation
  const getDiscountRate = (qty: number) => {
    if (qty >= 2500) return 0.25;
    if (qty >= 1000) return 0.20;
    if (qty >= 500) return 0.15;
    if (qty >= 250) return 0.10;
    if (qty >= 100) return 0.05;
    return 0;
  };

  const getBrandingMultiplier = (opt: string) => {
    if (opt === "full_color") return 1.10;
    if (opt === "foil") return 1.20;
    return 1.0;
  };

  const calculatedUnitPrice = selectedProduct
    ? (selectedProduct.price * (1 - getDiscountRate(orderQty))) * getBrandingMultiplier(orderBranding)
    : 0;

  const calculatedTotal = Math.round(calculatedUnitPrice * orderQty);

  const handleSendOrder = () => {
    if (!selectedProduct) return;

    const brandTextMap: Record<string, string> = {
      "1_color": "Encabezado a 1 Tinta (Incluido)",
      "full_color": "Policromía Full Color (+10%)",
      "foil": "Estampado Metalizado Foil (+20%)",
      "none": "Sin Logotipo"
    };

    const message = `Hola Atziluth! Deseo solicitar un pedido de *Almanaques 2026*:\n\n` +
      `📌 *REFERENCIA:* ${selectedProduct.ref} - ${selectedProduct.name}\n` +
      `📦 *CANTIDAD:* ${orderQty} unidades\n` +
      `🎨 *ACABADO:* ${selectedProduct.finish}\n` +
      `📄 *PAPEL:* ${selectedProduct.paper}\n` +
      `🏷️ *PERSONALIZACIÓN:* ${brandTextMap[orderBranding] || orderBranding}\n` +
      `💵 *TOTAL ESTIMADO:* ${formatCOP(calculatedTotal)} COP\n\n` +
      `👤 *CLIENTE:* ${clientName || "Cliente"}\n` +
      `📱 *WHATSAPP:* ${clientPhone || "Sin especificar"}\n` +
      `📍 *MUNICIPIO:* ${clientMuni || "Medellín / Antioquia"}\n` +
      `📝 *NOTAS:* ${clientNotes || "Ninguna"}\n\n` +
      `Por favor guíenme con la confirmación de diseño y forma de pago. Gracias!`;

    // Guardar orden local para administración
    try {
      const raw = localStorage.getItem("atziluth_almanaques_orders") || "[]";
      const orders = JSON.parse(raw);
      orders.unshift({
        id: "ord_" + Date.now(),
        ref: selectedProduct.ref,
        productName: selectedProduct.name,
        qty: orderQty,
        total: calculatedTotal,
        clientName: clientName || "Cliente",
        clientPhone: clientPhone || "Sin especificar",
        clientMuni: clientMuni || "Medellín / Antioquia",
        notes: clientNotes || "Ninguna",
        date: new Date().toLocaleDateString("es-CO")
      });
      localStorage.setItem("atziluth_almanaques_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Error al guardar orden local:", e);
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/573147573905?text=${encoded}`, "_blank");
    setIsOrderModalOpen(false);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-orange/20 border border-brand-orange/40 rounded-full text-brand-orange text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4" />
            <span>COLECCIÓN OFICIAL DE ALMANAQUES 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            Catálogo Comercial de <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange via-yellow-400 to-brand-magenta">Almanaques & Calendarios</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Consigue la máxima exposición de tu empresa los 365 días del año. Explora nuestra gama por categoría con detalles de acabado, tipo de papel, varilla, argollado e impresiones personalizadas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
            <a
              href="/almanaques.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir Subpágina almanaques.html</span>
            </a>
            <a
              href="/admin/almanaques.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4 text-brand-cyan" />
              <span>Panel de Control Almanaques</span>
            </a>
          </div>
        </div>
      </div>

      {/* PDF Catalog Viewer Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-orange/10 rounded-xl text-brand-orange">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">Visor de Catálogo PDF Completo</h2>
              <p className="text-xs text-slate-500">Navega el folleto digital oficial de Almanaques 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={data.pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-brand-orange text-white text-xs font-mono font-bold rounded-xl flex items-center gap-2 hover:opacity-90 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </a>
          </div>
        </div>

        <div className="w-full h-[480px] bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
          <iframe
            src={`${data.pdfUrl}#toolbar=1&navpanes=1`}
            className="w-full h-full border-0"
            title="Visor PDF Almanaques"
          />
        </div>
      </div>

      {/* Categories & Product List */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 class="text-xl font-display font-bold text-slate-900">Catálogo de Productos por Categoría</h2>
            <p className="text-xs text-slate-500">Filtra por identificador de categoría o busca tu referencia</p>
          </div>

          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar referencia (ej. ALM-101)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Category Pills with Unique ID Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setSelectedCatId("all")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2 cursor-pointer ${
              selectedCatId === "all"
                ? "bg-brand-orange text-white border-brand-orange shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>TODOS LOS ALMANAQUES</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCatId === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
              {data.products.length}
            </span>
          </button>

          {data.categories
            .sort((a, b) => (a.order || a.id) - (b.order || b.id))
            .map((cat) => {
              const count = data.products.filter((p) => p.categoryId === cat.id).length;
              const isSelected = selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-brand-orange text-white border-brand-orange shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${isSelected ? "bg-black/20 text-white" : "bg-slate-100 text-brand-orange font-bold"}`}>
                    CAT. #{cat.id}
                  </span>
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const category = data.categories.find((c) => c.id === p.categoryId) || { name: "Almanaque", id: p.categoryId };
            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2.5 py-1 bg-slate-900/90 text-white font-mono text-[10px] font-extrabold rounded-lg shadow-sm border border-slate-700">
                      REF: {p.ref}
                    </span>
                    <span className="px-2 py-0.5 bg-brand-orange/90 text-white font-mono text-[9px] font-bold rounded">
                      Cat. #{category.id}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      {category.name}
                    </span>
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-orange transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-brand-orange mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block leading-none">Acabado:</span>
                        <span className="text-slate-800 font-medium text-[11px]">{p.finish}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-brand-cyan mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block leading-none">Papel:</span>
                        <span className="text-slate-800 font-medium text-[11px]">{p.paper}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block leading-none">Precio desde:</span>
                      <span className="font-mono font-extrabold text-base text-slate-900">{formatCOP(p.price)}</span>
                    </div>

                    <button
                      onClick={() => openOrderForProduct(p)}
                      className="px-3.5 py-2.5 bg-gradient-to-r from-brand-orange to-brand-magenta hover:opacity-95 text-white text-xs font-mono font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>PEDIR</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-orange/20 rounded-xl text-brand-orange">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">Solicitar Almanaque REF: {selectedProduct.ref}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Formulario oficial de cotización de pedido</p>
                </div>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-slate-800 font-sans custom-scrollbar flex-grow">
              {/* Preview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-16 h-16 object-cover rounded-lg border border-slate-300" />
                <div className="text-xs space-y-1">
                  <span className="font-mono font-bold text-brand-orange block">REF: {selectedProduct.ref} — {selectedProduct.name}</span>
                  <span className="text-slate-600 block">{selectedProduct.paper} | {selectedProduct.finish}</span>
                  <span className="text-slate-900 font-bold block">Precio base: {formatCOP(selectedProduct.price)} COP / u</span>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">Cantidad (Unidades)</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {[50, 100, 250, 500, 1000, 2500].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setOrderQty(q)}
                      className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                        orderQty === q
                          ? "bg-brand-orange text-white border-brand-orange shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-brand-orange"
                      }`}
                    >
                      {q.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">Cantidad personalizada:</span>
                  <input
                    type="number"
                    value={orderQty}
                    min={10}
                    step={10}
                    onChange={(e) => setOrderQty(Number(e.target.value) || 10)}
                    className="w-32 bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Personalización */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Impresión / Marca</label>
                <select
                  value={orderBranding}
                  onChange={(e) => setOrderBranding(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                >
                  <option value="1_color">Encabezado impreso a 1 tinta (Incluido)</option>
                  <option value="full_color">Encabezado Full Color Policromía (+10%)</option>
                  <option value="foil">Estampado Metalizado Pan de Oro / Foil (+20%)</option>
                  <option value="none">Sin Logotipo / Estándar</option>
                </select>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Nombre / Empresa</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: Papelería San José"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">WhatsApp / Teléfono</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ej: 314 757 3905"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Municipio de Entrega</label>
                <input
                  type="text"
                  value={clientMuni}
                  onChange={(e) => setClientMuni(e.target.value)}
                  placeholder="Ej: Medellín, Envigado, Rionegro..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Notas de Diseño</label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  rows={2}
                  placeholder="Instrucciones adicionales..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              {/* Total Summary */}
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 font-mono">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Precio unitario estimado:</span>
                  <span>{formatCOP(calculatedUnitPrice)} COP</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Descuento por volumen:</span>
                  <span className="text-emerald-400">{Math.round(getDiscountRate(orderQty) * 100)}% Dcto</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-800 pt-2 text-yellow-400">
                  <span>TOTAL ESTIMADO:</span>
                  <span>{formatCOP(calculatedTotal)} COP</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-200">
              <button
                onClick={handleSendOrder}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ENVIAR SOLICITUD A WHATSAPP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
