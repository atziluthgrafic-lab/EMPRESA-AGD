import React, { useState } from "react";
import { MessageSquare, PhoneCall, Send, CheckCircle, Mail, MapPin, Globe, Sparkles } from "lucide-react";
import { MUNICIPALITIES } from "../data/antioquia";
import { motion, AnimatePresence } from "motion/react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [muni, setMuni] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("web_e_ia");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !muni || !phone) {
      setErrorMsg("Por favor completa todos los campos requeridos (*).");
      return;
    }
    setErrorMsg(null);
    setSubmitted(true);
  };

  // WhatsApp click generator for Antioquia regional numbers
  const generateWhatsAppUrl = () => {
    const text = `Hola Atziluth Digital! Mi nombre es ${name || "Cliente"}, tengo un negocio en ${muni || "Antioquia"} y me interesa el servicio de: ${
      service === "web"
        ? "Creación de Sitio Web"
        : service === "publicidad"
        ? "Publicidad Digital / Ads"
        : "Sitio Web + Estrategia de IA"
    }. Me gustaría una asesoría gratuita.`;
    return `https://wa.me/573001254321?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="contacto-seccion">
      {/* Sidebar Informative Contact block */}
      <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden space-y-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 border border-cyan-800 rounded-full text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            Asesoría Local Garantizada
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            ¿Listo para Impulsar Tu Marca Regional?
          </h2>

          <p className="text-neutral-400 text-xs leading-relaxed">
            Nuestros consultores y arquitectos web recorren Antioquia de norte a sur para diseñar la infraestructura publicitaria de tu negocio. Agenda una llamada presencial u online totalmente gratuita.
          </p>
        </div>

        {/* Contact info list */}
        <div className="space-y-3 relative z-10 text-xs">
          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800/60 p-3 rounded-xl hover:border-cyan-500/30 transition-colors">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-neutral-500 block uppercase font-mono text-[9px]">Oficina Central</span>
              <span className="font-semibold text-white">Edificio Atziluth, Medellín, Antioquia</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800/60 p-3 rounded-xl hover:border-cyan-500/30 transition-colors">
            <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-neutral-500 block uppercase font-mono text-[9px]">Correo Electrónico</span>
              <span className="font-semibold text-white">contacto@atziluthdigital.com</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800/60 p-3 rounded-xl hover:border-cyan-500/30 transition-colors">
            <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-neutral-500 block uppercase font-mono text-[9px]">Cobertura Territorial</span>
              <span className="font-semibold text-white">125 Municipios del Territorio Antioqueño</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-900 relative z-10">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
            RESPUESTA EN MENOS DE 15 MINUTOS
          </span>
        </div>
      </div>

      {/* Main Interactive Contact form */}
      <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 lg:p-8 rounded-3xl flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-cyan-400" />
                Agenda tu Diagnóstico Comercial de Cortesía
              </h3>

              {errorMsg && <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-mono">Tu Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mateo Restrepo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-mono">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +57 325 125 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-mono">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. mateo@miempresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-mono">Municipio de Ubicación *</label>
                  <select
                    required
                    value={muni}
                    onChange={(e) => setMuni(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">-- Selecciona --</option>
                    {MUNICIPALITIES.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-mono">Servicio en el que estás Interesado</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="web_e_ia">E-commerce, Catálogo + Generación Creativa IA</option>
                  <option value="web">Diseño de Sitio Web Premium Corporativo</option>
                  <option value="publicidad">Campañas de Publicidad Digital (Google & Meta Ads)</option>
                  <option value="consultoría">Estrategia Integral para Municipios Antioqueños</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-mono">Mensaje o Detalles del Proyecto</label>
                <textarea
                  placeholder="Cuéntanos brevemente sobre tu negocio y expectativas de ventas..."
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-400/20"
              >
                <Send className="w-4 h-4" />
                ENVIAR SOLICITUD DE ASESORÍA
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-6"
            >
              <div className="w-12 h-12 bg-cyan-950 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-800">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">¡Solicitud Procesada, {name}!</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Hemos enviado tu requerimiento de diagnóstico a nuestro equipo de consultores locales en {muni}. Evaluaremos tu nicho comercial para presentarte una propuesta robusta.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 max-w-sm mx-auto space-y-3">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                  ¿Prefieres contacto directo e inmediato?
                </p>
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
                >
                  <MessageSquare className="w-4 h-4" />
                  Escribir de Inmediato por WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
