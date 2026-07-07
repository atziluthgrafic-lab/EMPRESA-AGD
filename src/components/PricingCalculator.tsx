import React, { useState } from "react";
import { Check, Info, ArrowRight, Sparkles, HelpCircle, Sliders, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PricingCalculator() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("crecimiento");

  // Custom Calculator Add-ons
  const [addonEcommerce, setAddonEcommerce] = useState(false);
  const [addonAIVideo, setAddonAIVideo] = useState(false);
  const [addonSocials, setAddonSocials] = useState(false);

  const discountMultiplier = isAnnual ? 0.8 : 1.0;

  const plans = [
    {
      id: "emprendedor",
      name: "Plan Emprendedor",
      description: "Ideal para pymes, artesanos y marcas locales en municipios pequeños que inician su aventura digital.",
      monthlyCostCOP: 150000,
      annualCostCOP: 250000, // 3.000.000 / 12 = 250.000 COP / mes
      totalAnnualCostCOP: 3000000,
      badge: "Esencial",
      color: "from-amber-50/50 to-white",
      textColor: "text-brand-orange",
      features: [
        "1 Landing Page Optimizada",
        "Botón de WhatsApp Flotante",
        "Estrategia Básica de SEO Local",
        "Dominio .com o .co (1 año)",
        "Alojamiento Web Seguro",
        "3 Banners Publicitarios de IA al mes",
      ],
    },
    {
      id: "crecimiento",
      name: "Crecimiento Digital",
      description: "La opción preferida de hoteles en Guatapé, cafés en Jardín y marcas en expansión regional.",
      monthlyCostCOP: 320000,
      annualCostCOP: 350000, // 4.200.000 / 12 = 350.000 COP / mes
      totalAnnualCostCOP: 4200000,
      badge: "Recomendado",
      color: "from-orange-50/40 via-white to-white",
      textColor: "text-brand-orange",
      features: [
        "Sitio Web Completo (hasta 5 páginas)",
        "Catálogo Digital o Sistema de Reservas",
        "Configuración Google Maps & SEO local",
        "Integración básica de Pasarela de Pagos",
        "Certificado SSL de Seguridad",
        "10 Banners Publicitarios de IA al mes",
        "Soporte prioritario Atziluth AI",
      ],
    },
    {
      id: "corporativo",
      name: "Corporativo Antioquia",
      description: "Para agroindustrias en Urabá, lecheras en el Norte y pymes de alta facturación en Medellín.",
      monthlyCostCOP: 750000,
      annualCostCOP: 641667, // 7.700.000 / 12 = 641.667 COP / mes
      totalAnnualCostCOP: 7700000,
      badge: "Líder",
      color: "from-cyan-50/30 to-white",
      textColor: "text-brand-cyan",
      features: [
        "Desarrollo a Medida (Multi-idioma)",
        "E-commerce de alto volumen integrado",
        "Gestión de Campañas Google & Meta Ads",
        "Estudio Fotográfico / Vídeo corporativo",
        "Auditorías continuas de Conversión con IA",
        "Banners Publicitarios Generativos Ilimitados",
        "Administrador de Cuenta Dedicado",
      ],
    },
  ];

  // Selected Plan cost calculation
  const basePlanPrice = plans.find((p) => p.id === selectedPlan)!;
  const planRate = isAnnual ? basePlanPrice.annualCostCOP : basePlanPrice.monthlyCostCOP;

  // Addons cost calculation
  const ecommercePrice = addonEcommerce ? (isAnnual ? 40000 : 50000) : 0;
  const aiVideoPrice = addonAIVideo ? (isAnnual ? 80000 : 100000) : 0;
  const socialsPrice = addonSocials ? (isAnnual ? 32000 : 40000) : 0;

  const totalMonthlyCOP = planRate + ecommercePrice + aiVideoPrice + socialsPrice;

  // Exact annual cost tracking to prevent roundoff errors
  const totalAnnualCOP = isAnnual
    ? (basePlanPrice.totalAnnualCostCOP || 0) +
      (addonEcommerce ? 40000 * 12 : 0) +
      (addonAIVideo ? 80000 * 12 : 0) +
      (addonSocials ? 32000 * 12 : 0)
    : totalMonthlyCOP * 12;

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white border border-slate-200 p-6 lg:p-10 rounded-3xl space-y-10 shadow-sm" id="tarifas-seccion">
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 border border-brand-orange/25 rounded-full text-xs font-mono text-brand-orange font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Precios Transparentes sin Sorpresas
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
          Nuestros Planes de Propulsión Digital
        </h2>
        <p className="text-slate-650 text-sm font-sans">
          Impulsa tu negocio con tecnología de punta y estrategias de marketing local diseñadas específicamente para los municipios de Antioquia.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-bold ${!isAnnual ? "text-slate-900 font-extrabold" : "text-slate-400"}`}>Mensual</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 flex items-center bg-slate-200 border border-slate-300 rounded-full p-1 cursor-pointer transition-colors"
          >
            <div
              className={`bg-brand-orange w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isAnnual ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isAnnual ? "text-slate-900 font-extrabold" : "text-slate-400"}`}>
            Anual
            <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-mono px-2 py-0.5 rounded-full border border-brand-orange/25">
              Ahorra hasta 66%
            </span>
          </span>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isSelected = selectedPlan === p.id;
          const rate = isAnnual ? p.annualCostCOP : p.monthlyCostCOP;

          return (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? `border-brand-orange bg-gradient-to-b ${p.color} ring-2 ring-brand-orange/20 shadow-lg shadow-brand-orange/5`
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-sm"
              }`}
            >
              {/* Plan Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-450">
                    {p.badge}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-mono bg-brand-orange text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      Seleccionado
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-orange transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-slate-650 text-xs mt-1.5 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className="py-2">
                  <span className="text-2xl lg:text-3xl font-black text-slate-900">
                    {formatCOP(rate)}
                  </span>
                  <span className="text-slate-500 text-xs font-mono"> / mes</span>
                </div>
              </div>

              {/* Plan Features */}
              <ul className="space-y-2.5 my-6 pt-4 border-t border-slate-100">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-sans">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(p.id);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                  isSelected
                    ? "bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-black hover:opacity-95"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                Elegir {p.name}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Package Creator / Customizer */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
        {/* Left Side: Additional Addons Sliders */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              <span>Personaliza tu Plan Atziluth Digital</span>
            </h4>
            <p className="text-slate-600 text-xs mt-1 font-sans">
              Agrega módulos interactivos premium para acelerar tus ventas y captación de manera inmediata.
            </p>
          </div>

          <div className="space-y-3">
            {/* Addon 1 */}
            <div
              onClick={() => setAddonEcommerce(!addonEcommerce)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                addonEcommerce
                  ? "bg-brand-orange/10 border-brand-orange/30 text-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={addonEcommerce}
                  onChange={() => {}} // handled by click
                  className="rounded text-brand-orange mt-1 focus:ring-brand-orange bg-white border-slate-350 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold block text-slate-900 font-sans">Módulo Carro E-commerce Completo</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pasarela de pago PSE, Nequi y tarjetas locales de Colombia.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-orange font-mono">
                +{formatCOP(isAnnual ? 40000 : 50000)}/m
              </span>
            </div>

            {/* Addon 2 */}
            <div
              onClick={() => setAddonAIVideo(!addonAIVideo)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                addonAIVideo
                  ? "bg-brand-orange/10 border-brand-orange/30 text-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={addonAIVideo}
                  onChange={() => {}} // handled by click
                  className="rounded text-brand-orange mt-1 focus:ring-brand-orange bg-white border-slate-350 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold block text-slate-900 font-sans">Producción de Video Ad de IA (imagen/voz)</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">1 video promocional ultra realista de 30s al mes optimizado.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-orange font-mono">
                +{formatCOP(isAnnual ? 80000 : 100000)}/m
              </span>
            </div>

            {/* Addon 3 */}
            <div
              onClick={() => setAddonSocials(!addonSocials)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                addonSocials
                  ? "bg-brand-orange/10 border-brand-orange/30 text-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={addonSocials}
                  onChange={() => {}} // handled by click
                  className="rounded text-brand-orange mt-1 focus:ring-brand-orange bg-white border-slate-350 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold block text-slate-900 font-sans">Sincronización de Blog Inteligente</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Creación automática de artículos SEO sobre el municipio y sector.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-orange font-mono">
                +{formatCOP(isAnnual ? 32000 : 40000)}/m
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quote Summary Panel */}
        <div className="md:col-span-5 bg-white border border-slate-200 p-6 rounded-xl flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <span className="text-[9px] font-mono bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2 py-0.5 rounded-full font-bold">
              COTIZACIÓN INSTANTÁNEA
            </span>
            <h5 className="text-sm font-bold text-slate-900 mt-2 font-sans">Detalle de Cotización</h5>
            <div className="space-y-1.5 mt-3 text-xs text-slate-650 font-sans">
              <div className="flex justify-between">
                <span>{basePlanPrice.name} ({isAnnual ? "Anual" : "Mensual"}):</span>
                <span className="text-slate-900 font-bold font-mono">{formatCOP(planRate)}/m</span>
              </div>
              {addonEcommerce && (
                <div className="flex justify-between text-[11px]">
                  <span>+ Carrito de Compras:</span>
                  <span className="text-slate-900 font-medium font-mono">+{formatCOP(ecommercePrice)}/m</span>
                </div>
              )}
              {addonAIVideo && (
                <div className="flex justify-between text-[11px]">
                  <span>+ Video Ad de IA:</span>
                  <span className="text-slate-900 font-medium font-mono">+{formatCOP(aiVideoPrice)}/m</span>
                </div>
              )}
              {addonSocials && (
                <div className="flex justify-between text-[11px]">
                  <span>+ Blog Inteligente:</span>
                  <span className="text-slate-900 font-medium font-mono">+{formatCOP(socialsPrice)}/m</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-800">Inversión Mensual:</span>
              <div className="text-right">
                <span className="text-xl font-black text-brand-orange font-mono">
                  {formatCOP(totalMonthlyCOP)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">COP, IVA incluido</span>
              </div>
            </div>

            {isAnnual && (
              <p className="text-[10px] text-emerald-600 font-medium text-right mt-1 font-mono">
                Pago anual: {formatCOP(totalAnnualCOP)} COP (Ahorro incluido)
              </p>
            )}

            <button
              onClick={() => {
                const contactSection = document.getElementById("contacto-seccion");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-brand-orange to-brand-magenta hover:opacity-95 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-orange/15 cursor-pointer"
            >
              Agendar Asesoría Gratuita
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
