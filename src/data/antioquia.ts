import { Subregion, Municipality, Business } from "../types";

export const SUBREGIONS: Subregion[] = [
  {
    id: "valle_de_aburra",
    name: "Valle de Aburrá",
    description: "El motor económico, industrial y tecnológico del departamento. Medellín y su área metropolitana concentran la mayor densidad empresarial y conectividad.",
    capital: "Medellín",
    color: "from-cyan-500 to-blue-600",
    municipalitiesCount: 10,
    highlightedSectors: ["Tecnología & SaaS", "E-commerce de Moda", "Clínicas & Estética", "Servicios Profesionales"]
  },
  {
    id: "oriente",
    name: "Oriente",
    description: "Región con altísimo crecimiento inmobiliario, turístico, tecnológico y de agricultura sostenible. Conexión internacional vía Aeropuerto JMC.",
    capital: "Rionegro",
    color: "from-emerald-500 to-teal-600",
    municipalitiesCount: 23,
    highlightedSectors: ["Turismo & Glampings", "Floricultura", "Restaurantes de Autor", "Inmobiliarias"]
  },
  {
    id: "suroeste",
    name: "Suroeste",
    description: "Cuna del café de alta calidad de Colombia, agroturismo y bellos paisajes montañosos. En pleno auge de tecnificación agrícola y hospedajes rurales.",
    capital: "Andes",
    color: "from-amber-600 to-orange-700",
    municipalitiesCount: 23,
    highlightedSectors: ["Cafés Especiales", "Hotelería Campestre", "Ecoturismo", "Marcas Agroindustriales"]
  },
  {
    id: "occidente",
    name: "Occidente",
    description: "Zona con gran valor colonial e histórico impulsada por el turismo masivo y proyectos de doble calzada. Clima cálido y gran atractivo de recreación.",
    capital: "Santa Fe de Antioquia",
    color: "from-yellow-500 to-amber-600",
    municipalitiesCount: 19,
    highlightedSectors: ["Hoteles & Hostales", "Condominios Vacacionales", "Fruterías & Gastronomía", "Inmobiliarias Campestres"]
  },
  {
    id: "uraba",
    name: "Urabá",
    description: "Eje agroindustrial bananero y el futuro puerto de Antioquia sobre el Caribe. Alta proyección logística, comercial y turística marina.",
    capital: "Apartadó",
    color: "from-blue-500 to-indigo-600",
    municipalitiesCount: 11,
    highlightedSectors: ["Logística & Transporte", "Exportación de Banano", "Hotelería Playera", "Comercio de Puerto"]
  },
  {
    id: "norte",
    name: "Norte",
    description: "Tierra lechera, despensa agrícola del departamento, y gran generadora de energía hidráulica. Negocios enfocados en ganadería tecnificada y queserías.",
    capital: "Santa Rosa de Osos",
    color: "from-emerald-600 to-green-700",
    municipalitiesCount: 17,
    highlightedSectors: ["Productoras de Lácteos", "Ganadería Sostenible", "Turismo Frío", "Maquinaria Agrícola"]
  },
  {
    id: "bajo_cauca",
    name: "Bajo Cauca",
    description: "Eje minero, ganadero y pesquero de llanura caribeña. Creciente necesidad de visibilización digital para comercio local y pymes en Caucasia.",
    capital: "Caucasia",
    color: "from-rose-500 to-red-600",
    municipalitiesCount: 6,
    highlightedSectors: ["Ganadería de Engorde", "Ferreterías Industriales", "Comercio Multimarca", "Hotelería Logística"]
  },
  {
    id: "nordeste",
    name: "Nordeste",
    description: "Región con riqueza de oro, cacao y caña de azúcar. Gran potencial ecoturístico en charcos coloniales y cavernas.",
    capital: "Yolombó",
    color: "from-purple-500 to-violet-600",
    municipalitiesCount: 10,
    highlightedSectors: ["Cacaoteros", "Panelerías Tecnificadas", "Turismo de Aventura", "Comercio Vecinal"]
  },
  {
    id: "magdalena_medio",
    name: "Magdalena Medio",
    description: "Eje logístico bimodal junto al Río Magdalena, ganadero e industrial petroquímico. Enlace con el centro de Colombia.",
    capital: "Puerto Berrío",
    color: "from-sky-600 to-slate-700",
    municipalitiesCount: 6,
    highlightedSectors: ["Ganadería Mayorista", "Hotelería de Ruta", "Servicios Logísticos", "Pesquerías & Alimentos"]
  }
];

export const MUNICIPALITIES: Municipality[] = [
  // 1. Valle de Aburrá
  { name: "Medellín", subregion: "valle_de_aburra", capitalDistanceKm: 0, primaryEconomy: "Servicios, Tecnología, Turismo, Textil", adTip: "Apunta a nichos y diferenciación. Segmenta anuncios por comunas (El Poblado, Laureles, etc.) y usa Google Search Ads para capturar intención de compra activa." },
  { name: "Bello", subregion: "valle_de_aburra", capitalDistanceKm: 10, primaryEconomy: "Comercio, Construcción, Manufactura", adTip: "Enfócate en publicidad masiva de Facebook/Instagram con ofertas de entrega o locales en la Comuna 1 y 4 para maximizar las conversiones de retail." },
  { name: "Itagüí", subregion: "valle_de_aburra", capitalDistanceKm: 11, primaryEconomy: "Industria, Comercio Mayorista, Confección", adTip: "Perfecto para campañas B2B en Google Search y LinkedIn. Destaca bodegas, precios mayoristas y despacho en el sector de la moda y autopartes." },
  { name: "Envigado", subregion: "valle_de_aburra", capitalDistanceKm: 12, primaryEconomy: "Gastronomía, Comercio, Residencial", adTip: "Destaca la exclusividad y la calidad. Usa anuncios visuales en Instagram Reels y TikTok enfocando la experiencia boutique o gastronómica." },
  { name: "Sabaneta", subregion: "valle_de_aburra", capitalDistanceKm: 14, primaryEconomy: "Vivienda, Comercial, Turismo Gastronómico", adTip: "Publicidad hiperlocal de radio geovallada en Meta. Envía el tráfico directo a WhatsApp con cupones especiales para consumo en el parque principal." },
  { name: "Copacabana", subregion: "valle_de_aburra", capitalDistanceKm: 18, primaryEconomy: "Manufactura ligera, Fincas de recreo", adTip: "Promociona alquiler de fincas vacacionales a través de Google Ads de búsqueda y anuncios geolocalizados dirigidos a residentes de Medellín." },
  { name: "Girardota", subregion: "valle_de_aburra", capitalDistanceKm: 26, primaryEconomy: "Industria química y metalmecánica, Religioso", adTip: "Campañas enfocadas en el Señor de los Milagros durante fechas religiosas, atrayendo visitas de todo el Valle de Aburrá." },
  { name: "Barbosa", subregion: "valle_de_aburra", capitalDistanceKm: 39, primaryEconomy: "Papelera, Confecciones, Turismo de fincas", adTip: "Usa carruseles de imágenes de planes de pasadía familiares los fines de semana. Segmentación: Medellín y Bello." },
  { name: "La Estrella", subregion: "valle_de_aburra", capitalDistanceKm: 16, primaryEconomy: "Industria cerámica, Comercial, Residencial", adTip: "Promociona proyectos residenciales verdes e innovación ecológica. La cercanía al metro es tu gancho publicitario principal." },
  { name: "Caldas", subregion: "valle_de_aburra", capitalDistanceKm: 22, primaryEconomy: "Alfarería, Madera, Logística de transporte", adTip: "Promueve muebles artesanales y de madera fina. El video detallado del proceso manual genera enorme confianza en redes sociales." },

  // 2. Oriente
  { name: "Rionegro", subregion: "oriente", capitalDistanceKm: 45, primaryEconomy: "Comercio, Inmobiliario, Agroindustrial, Aeroportuario", adTip: "Lidera con sitios web de carga instantánea optimizados para dispositivos móviles. La competencia empresarial aquí es alta; las Campañas de Google Maps son vitales." },
  { name: "Guatapé", subregion: "oriente", capitalDistanceKm: 79, primaryEconomy: "Turismo internacional, Ecoturismo, Náutico", adTip: "Campañas multilingües (Inglés/Español) en Instagram y TripAdvisor. Muestra fotos espectaculares de la Piedra del Peñol y embalse con reserva directa vía web." },
  { name: "La Ceja", subregion: "oriente", capitalDistanceKm: 41, primaryEconomy: "Flores, Comercial, Residencial boutique", adTip: "Orienta anuncios a parejas jóvenes de clase media-alta buscando vivir fuera de Medellín. Campañas enfocadas en tranquilidad, seguridad y aire limpio." },
  { name: "Marinilla", subregion: "oriente", capitalDistanceKm: 47, primaryEconomy: "Agrícola, Comercial, Guitarras, Gastronomía", adTip: "Propaga tu sazón. Promociona el corredor gastronómico marinillo con videos cortos y dinámicos creados para audiencias de fin de semana." },
  { name: "El Retiro", subregion: "oriente", capitalDistanceKm: 33, primaryEconomy: "Ebanistería fina, Turismo de montaña, Residencial de lujo", adTip: "Marketing de alta gama. Filtra por intereses de lujo y alto poder adquisitivo en Medellín. Su sitio web debe verse sobrio, minimalista e impecable." },
  { name: "El Santuario", subregion: "oriente", capitalDistanceKm: 57, primaryEconomy: "Confecciones, Distribución comercial, Hortalizas", adTip: "Usa email marketing estructurado para compradores mayoristas de confecciones. Ideal un catálogo e-commerce automatizado B2B." },
  { name: "El Peñol", subregion: "oriente", capitalDistanceKm: 69, primaryEconomy: "Turismo náutico, Agricultura (Tomate)", adTip: "Usa videos aéreos tomados con drone del embalse para captar clientes en hotelería de glampings. Posiciona en SEO como 'Glamping El Peñol'." },
  { name: "Guarne", subregion: "oriente", capitalDistanceKm: 25, primaryEconomy: "Metalmecánica, Hortalizas, Floricultura", adTip: "Excelente ubicación logística. Crea landings industriales destinadas a empresas medianas del Valle de Aburrá que buscan descentralizarse." },
  { name: "La Unión", subregion: "oriente", capitalDistanceKm: 56, primaryEconomy: "Champiñones, Papa, Lechería", adTip: "Estrategias de canal directo en marcas de alimentos orgánicos. La trazabilidad digital conecta muy bien con el consumidor urbano consciente." },
  { name: "Sonsón", subregion: "oriente", capitalDistanceKm: 110, primaryEconomy: "Aguacate Haas, Higos, Café, Turismo colonial", adTip: "Optimiza para búsquedas como 'Aguacate Hass de exportación Colombia'. Sitios web profesionales abren puertas a exportadores." },
  { name: "San Vicente Ferrer", subregion: "oriente", capitalDistanceKm: 49, primaryEconomy: "Hortalizas, Frijol, Turismo ecológico", adTip: "Anuncios locales para el turismo rural y de senderismo, atrayendo caminantes con guías geográficas en el sitio web." },
  { name: "Concepción", subregion: "oriente", capitalDistanceKm: 75, primaryEconomy: "Ganadería, Turismo patrimonial libre de carros", adTip: "Marketing de desconexión absoluta. Promociona retiros de yoga y paz digital, enfocados en nómadas digitales cansados del ruido." },
  { name: "Alejandría", subregion: "oriente", capitalDistanceKm: 90, primaryEconomy: "Turismo de charcos y cascadas, Panela", adTip: "Videos virales de 'charcos escondidos en Antioquia' en TikTok para movilizar turistas los fines de semana." },
  { name: "Cocorná", subregion: "oriente", capitalDistanceKm: 74, primaryEconomy: "Ecoturismo (Parapente, rafting), Panela", adTip: "Usa micro-conversiones de reserva vía calendario en la landing page. Describir las medidas de aventura y seguridad aumenta un 40% las ventas." },
  { name: "Abejorral", subregion: "oriente", capitalDistanceKm: 85, primaryEconomy: "Café, Aguacate, Turismo histórico", adTip: "Apuesta al turismo de patrimonio arquitectónico colonial con campañas de fotografía y relatos del origen arriero." },
  { name: "Granada", subregion: "oriente", capitalDistanceKm: 76, primaryEconomy: "Hortalizas, Comercio de abarrotes, Memoria", adTip: "Aprovecha la red de comerciantes granadinos en todo el país para lanzar portales de distribución de abastos B2B." },
  { name: "San Rafael", subregion: "oriente", capitalDistanceKm: 104, primaryEconomy: "Generación de energía, cacao, ecoturismo", adTip: "Enfócate en reservas para turismo de avistamiento de aves y ríos cristalinos. El SEO local para 'ríos San Rafael' es muy valioso." },
  { name: "San Carlos", subregion: "oriente", capitalDistanceKm: 108, primaryEconomy: "Turismo de cascadas, Energía, Café", adTip: "Posiciona el municipio como la 'capital del agua'. Las landing pages deben contar con galerías interactivas rápidas." },
  { name: "San Luis", subregion: "oriente", capitalDistanceKm: 121, primaryEconomy: "Maderas, café, ecoturismo de quebradas", adTip: "Promoción de paradores turísticos sobre la autopista Medellín-Bogotá con cupones digitales canjeables en ruta." },
  { name: "Altamira (San Francisco)", subregion: "oriente", capitalDistanceKm: 96, primaryEconomy: "Cacao, ecoturismo, conservación", adTip: "Vende la experiencia de bosque húmedo tropical. Enfoca anuncios en conservación ambiental y ecoturistas." },
  { name: "Nariño", subregion: "oriente", capitalDistanceKm: 147, primaryEconomy: "Café, Cacao, Termales", adTip: "Publicidad digital de los Termales de Espíritu Santo. Atrae visitas médicas y de termalismo terapéutico." },
  { name: "San Vicente", subregion: "oriente", capitalDistanceKm: 50, primaryEconomy: "Hortalizas, Frijol, Comercio", adTip: "Sitios optimizados para el mercadeo agrícola directo, eliminando intermediarios para los productores del campo." },
  { name: "El Peñol-Guatapé", subregion: "oriente", capitalDistanceKm: 70, primaryEconomy: "Complejo Turístico unificado", adTip: "Usa retargeting intensivo. El visitante que ve la piedra debe recibir ofertas de restaurantes y lanchas de inmediato en su celular." },

  // 3. Suroeste
  { name: "Jericó", subregion: "suroeste", capitalDistanceKm: 104, primaryEconomy: "Carrieles, Cafés Boutique, Culto de la Madre Laura", adTip: "Turismo cultural y de fe. Crea recorridos interactivos 3D de los museos y tiendas en la web y pauta en Facebook a personas mayores de 40 años interesadas en turismo religioso." },
  { name: "Jardín", subregion: "suroeste", capitalDistanceKm: 134, primaryEconomy: "Café excelso, Turismo patrimonial, Piscicultura", adTip: "Vende la postal perfecta. Las redes visuales (Instagram/Pinterest) combinadas con un motor de reservas ágil en la landing de hoteles multiplican las estadías largas." },
  { name: "Andes", subregion: "suroeste", capitalDistanceKm: 110, primaryEconomy: "Mayor productor de café, Comercio centralizado", adTip: "Dado que es el centro comercial de la subregión, los anuncios en Google Maps y directorios locales de ferreterías, talleres e insumos agrícolas tienen alta efectividad." },
  { name: "Ciudad Bolívar", subregion: "suroeste", capitalDistanceKm: 91, primaryEconomy: "Café, Ganadería de paso, Cítricos", adTip: "Anuncios que destaquen las cabalgatas y fincas cafeteras tradicionales. Atrae caballistas y familias acomodadas de Medellín." },
  { name: "Concordia", subregion: "suroeste", capitalDistanceKm: 95, primaryEconomy: "Café (Cuna de la caficultura cafetera), Carbón", adTip: "Posiciona tu marca de café de origen en la web nacional. Ofrece un modelo de suscripción mensual con envíos a ciudades principales." },
  { name: "Amagá", subregion: "suroeste", capitalDistanceKm: 36, primaryEconomy: "Carbón, Porcicultura, Café", adTip: "Posicionamiento industrial local. Campañas destinadas a constructoras rurales y venta de carbón mineral con cotizadores web dinámicos." },
  { name: "Fredonia", subregion: "suroeste", capitalDistanceKm: 58, primaryEconomy: "Café, Carbón, Cítricos", adTip: "Ruta del café y paisajes de Jonás. Promueve el turismo de experiencia de fin de semana para el público cosmopolita de Envigado y El Poblado." },
  { name: "Santa Bárbara", subregion: "suroeste", capitalDistanceKm: 51, primaryEconomy: "Mango (Capital nacional del mango), Cítricos, Café", adTip: "Crea portales de preventa de cosechas de mango y frutales para mayoristas en Medellín. Anuncios optimizados en Google Search." },
  { name: "Venecia", subregion: "suroeste", capitalDistanceKm: 60, primaryEconomy: "Cerro Tusa (Pirámide natural), Ganadería, Turismo", adTip: "El senderismo a Cerro Tusa es tendencia. Sitio web con registro de pólizas de seguridad médica e itinerarios llamativos." },
  { name: "Támesis", subregion: "suroeste", capitalDistanceKm: 115, primaryEconomy: "Petroglifos, Ecoturismo (Espeléotursimo), Cacao", adTip: "Promociona aventura de cuevas y herencia indígena petroglifa. Las reseñas de Google My Business bien gestionadas son fundamentales aquí." },
  { name: "Tarso", subregion: "suroeste", capitalDistanceKm: 95, primaryEconomy: "Ganadería, Cafés Especiales, Cítricos", adTip: "Promociona fincas boutique ecológicas. Usa Google Display para mostrar la serenidad del paisaje campestre de Tarso." },
  { name: "Pueblorrico", subregion: "suroeste", capitalDistanceKm: 112, primaryEconomy: "Café, Caña panelera, Reserva natural", adTip: "Foco en ecologistas y biólogos. Sitios web con enfoque interactivo de catálogo de aves de la Reserva Moctezuma." },
  { name: "Salgar", subregion: "suroeste", capitalDistanceKm: 97, primaryEconomy: "Café, Plátano, Ganadería", adTip: "Publicidad basada en historias familiares de arrieros. El storytelling emocional en video aumenta un 65% el valor percibido del café local." },
  { name: "Betania", subregion: "suroeste", capitalDistanceKm: 120, primaryEconomy: "Café, Ecoturismo (Farallones de Citará)", adTip: "Excelente para turismo de montañismo rudo. Integra mapas satelitales interactivos de senderos de los Farallones en la web." },
  { name: "Andes - Tapartó", subregion: "suroeste", capitalDistanceKm: 115, primaryEconomy: "Café, Cascadas ecoturísticas", adTip: "Promoción de los chorros de Tapartó. Segmenta por geolocalización en terminales de transporte con anuncios rápidos de fin de semana." },
  { name: "Betulia", subregion: "suroeste", capitalDistanceKm: 125, primaryEconomy: "Cacao, Café, Ganadería", adTip: "Marcas enfocadas en chocolate de origen. Un e-commerce con checkout simplificado vía PSE y Nequi resulta clave en el país." },
  { name: "Caramanta", subregion: "suroeste", capitalDistanceKm: 118, primaryEconomy: "Café, Turismo de niebla, Arquitectura", adTip: "Usa la niebla y el frío como gancho nostálgico. 'El pueblo donde las nubes caminan'. Atrae fotógrafos con concursos en redes." },
  { name: "Hispania", subregion: "suroeste", capitalDistanceKm: 98, primaryEconomy: "Cerveza artesanal, Turismo de Samanes", adTip: "Promociona paradas de descanso bajo el majestuoso túnel de Samanes con cupones digitales geolocalizados para conductores." },
  { name: "Montebello", subregion: "suroeste", capitalDistanceKm: 53, primaryEconomy: "Aguacate, Flores (Anturios), Café", adTip: "Publicidad de exportadores de anturios. Catálogos en línea robustos para floristerías de las grandes ciudades." },
  { name: "Sonsón (Suroeste frontera)", subregion: "suroeste", capitalDistanceKm: 105, primaryEconomy: "Papa, Ganadería", adTip: "Promueve cadenas de abastecimiento directo. La tecnología en logística rural ayuda a pactar mejores tratos comerciales." },
  { name: "Urrao", subregion: "suroeste", capitalDistanceKm: 140, primaryEconomy: "Páramo del Sol, Queso Urraeño, Granadilla", adTip: "Turismo extremo al punto más alto de Antioquia (Páramo del Sol). Guía de montañeros certificada vía web con reservas estrictas." },
  { name: "Valparaíso", subregion: "suroeste", capitalDistanceKm: 100, primaryEconomy: "Limón Tahití, Ganadería, Turismo de haciendas", adTip: "Usa campañas de lead generation para arrendar haciendas de lujo de descanso. Captura teléfonos de corporaciones de Medellín." },
  { name: "Titiribí", subregion: "suroeste", capitalDistanceKm: 50, primaryEconomy: "Cultura equina (Tierra de mulas), Carbón", adTip: "Venta e historia equina. Pauta para amantes del Paso Fino y eventos de vaquería nacional." },

  // 4. Occidente
  { name: "Santa Fe de Antioquia", subregion: "occidente", capitalDistanceKm: 56, primaryEconomy: "Turismo colonial, Hotelería, Frutas exóticas (Tamarindo)", adTip: "Gran competencia hotelera. Ofrece recorridos virtuales del hotel en alta definición y campañas de retargeting en Google Ads a personas que buscaron 'fin de semana sol'." },
  { name: "Sopetrán", subregion: "occidente", capitalDistanceKm: 42, primaryEconomy: "Condominios campestres, Turismo, Frutales", adTip: "Anuncios de compra/alquiler de parcelas vacacionales. La integración de la cotización virtual acelera la captación de correos calificados." },
  { name: "San Jerónimo", subregion: "occidente", capitalDistanceKm: 35, primaryEconomy: "Parques acuáticos, Hotelería, Agricultura", adTip: "Promociona planes familiares para escapar del frío de Medellín. Los anuncios de video cortos sobre piscinas y toboganes triunfan los jueves por la tarde." },
  { name: "Dabeiba", subregion: "occidente", capitalDistanceKm: 172, primaryEconomy: "Café, Madera, Comercio frontera con Urabá", adTip: "Usa directorios de tiendas e insumos agrícolas de paso. Campañas de WhatsApp Business para pedidos de vereda a pueblo." },
  { name: "Frontino", subregion: "occidente", capitalDistanceKm: 142, primaryEconomy: "Café, Caña panelera, Oro", adTip: "Sitio corporativo enfocado en cooperativas cafeteras locales para generar alianzas institucionales nacionales." },
  { name: "Cañasgordas", subregion: "occidente", capitalDistanceKm: 111, primaryEconomy: "Café, Plátano, Frutales", adTip: "Promueve paraderos de descanso de los transportadores en ruta a Urabá. Descuentos digitales mediante check-in en redes." },
  { name: "Ebéjico", subregion: "occidente", capitalDistanceKm: 42, primaryEconomy: "Hortalizas, Café, Panela", adTip: "Promueve mercados orgánicos rurales geolocalizados. La frescura directa a la puerta te diferencia de gigantes de abastos." },
  { name: "Giraldo", subregion: "occidente", capitalDistanceKm: 122, primaryEconomy: "Café de altura, Clima frío", adTip: "Venta de café de altura premium. El empaque histórico y la denominación de origen explicados en el sitio web atraen siballistas." },
  { name: "Heliconia", subregion: "occidente", capitalDistanceKm: 43, primaryEconomy: "Flores de exportación, Ganadería", adTip: "Campañas orientadas a floristerías mayoristas de Medellín. Portales ágiles para gestionar pedidos periódicos de flores." },
  { name: "Liborina", subregion: "occidente", capitalDistanceKm: 81, primaryEconomy: "Frijol Liborino (Famoso frijol premium), Cítricos", adTip: "Posiciona el Frijol Liborino como un ingrediente gourmet exclusivo. Crea una e-commerce dedicada enfocando su escasez y sabor." },
  { name: "Olaya", subregion: "occidente", capitalDistanceKm: 76, primaryEconomy: "Vino (Viñedos locales de clima seco), Turismo", adTip: "Promociona catas de vino clandestinas y visitas por el puente colgante de Occidente con campañas visuales en Instagram (público de Medellín)." },
  { name: "Peque", subregion: "occidente", capitalDistanceKm: 198, primaryEconomy: "Café, Frijol, Ecoturismo (Parque Paramillo)", adTip: "Ecoturismo de conservación en el Nudo del Paramillo. Atrae montañeros con guías expertos locales en una web informativa segura." },
  { name: "Sabanalarga", subregion: "occidente", capitalDistanceKm: 118, primaryEconomy: "Ganadería vacuno, Maíz", adTip: "Promueve ferias ganaderas en línea. Las páginas de eventos locales con transmisiones en directo crean una audiencia fiel." },
  { name: "Uramita", subregion: "occidente", capitalDistanceKm: 139, primaryEconomy: "Plátano, Frutas cítricas", adTip: "Optimiza rutas de abasto con listados interactivos para camiones distribuidores de carga regional." },
  { name: "Caicedo", subregion: "occidente", capitalDistanceKm: 124, primaryEconomy: "Café, Ganadería, Maíz", adTip: "Promociona historias de paz. El café asociativo de Caicedo tiene gran aceptación en mercados justos internacionales." },
  { name: "Anzá", subregion: "occidente", capitalDistanceKm: 83, primaryEconomy: "Ganadería, Caña panelera, Maíz", adTip: "Posiciona fincas de descanso menos masivas que Sopetrán. Gran alternativa para estadías prolongadas tranquilas." },
  { name: "Armenia Mantequilla", subregion: "occidente", capitalDistanceKm: 52, primaryEconomy: "Café, Mango, Arquitectura colonial", adTip: "Promociona el pueblo bajo el nombre nostálgico 'Armenia Mantequilla'. Enfoque artesanal en escapadas cortas." },
  { name: "Buriticá", subregion: "occidente", capitalDistanceKm: 113, primaryEconomy: "Minería tecnificada de oro, Ganadería", adTip: "Sitios web corporativos para proveedores locales industriales que buscan enlazarse con la gran minera del sector." },
  { name: "Abriaquí", subregion: "occidente", capitalDistanceKm: 128, primaryEconomy: "Aguacate, Ganadería lechera", adTip: "Anuncios geovallados de cabañas campestres familiares de clima templado con baja aglomeración." },

  // 5. Urabá
  { name: "Apartadó", subregion: "uraba", capitalDistanceKm: 310, primaryEconomy: "Eje comercial bananero, Centros comerciales, Logística", adTip: "Capital comercial de Urabá. Campañas agresivas de Google Search Ads para centros de diagnóstico, comercio, y servicios profesionales." },
  { name: "Turbo", subregion: "uraba", capitalDistanceKm: 340, primaryEconomy: "Puerto, Marisco, Plátano, Manglar", adTip: "Pauta la riqueza portuaria y cultural. Diseña portales de transporte y logística para enlazar empresas con el puerto de Turbo." },
  { name: "Necoclí", subregion: "uraba", capitalDistanceKm: 380, primaryEconomy: "Turismo de playa caribeña, Cocos, Pesca", adTip: "Ideal para captar turistas nacionales. Atrae veraneantes con anuncios de 'Playas tranquilas de Antioquia sin vendedores intrusivos'." },
  { name: "Carepa", subregion: "uraba", capitalDistanceKm: 315, primaryEconomy: "Banano de exportación, Aeropuerto internacional comercial", adTip: "Foco en empresas logísticas e industriales asociadas al comercio exterior de fruta. Landings corporativas de alta velocidad." },
  { name: "Chigorodó", subregion: "uraba", capitalDistanceKm: 295, primaryEconomy: "Ganadería, Agricultura extensiva (Yuca, plátano)", adTip: "Estrategias de distribución agrícola B2B. Los listados de precios al por mayor automatizados en una landing disparan cotizaciones." },
  { name: "Arboletes", subregion: "uraba", capitalDistanceKm: 420, primaryEconomy: "Volcán de lodo, Mar, Ganadería", adTip: "Promociona los baños termales de lodo terapéutico frente al mar de Arboletes. Un generador de reservas online simplificado." },
  { name: "Mutatá", subregion: "uraba", capitalDistanceKm: 270, primaryEconomy: "Puerta de Urabá, Ecoturismo de ríos cristalinos", adTip: "Vende el pasadía de ríos color turquesa. Posiona con anuncios dinámicos de fin de semana para familias de Suroeste y Medellín." },
  { name: "San Pedro de Urabá", subregion: "uraba", capitalDistanceKm: 385, primaryEconomy: "Ganadería intensiva, Maíz, Caucho", adTip: "Promoción de plantaciones sostenibles de caucho y madera. Sitios con catálogos forestales técnicos de alta seriedad." },
  { name: "San Juan de Urabá", subregion: "uraba", capitalDistanceKm: 405, primaryEconomy: "Cocos, Ganadería, Playa virgen", adTip: "Ideal para ecoturismo de paz marina y avistamiento de tortugas. El diseño del sitio web debe evocar relajación máxima." },
  { name: "Mutatá - Caucheras", subregion: "uraba", capitalDistanceKm: 280, primaryEconomy: "Caucho, Cacao, Ríos", adTip: "Estrategias directas para productores de cacao biológico, diseñadas para captar mercados de comercio ético europeo." },
  { name: "Vigía del Fuerte", subregion: "uraba", capitalDistanceKm: 450, primaryEconomy: "Pesca, Maderas nativas, Rio Atrato", adTip: "Sitios con enfoque social e institucional que faciliten la interacción y visibilización de procesos éticos de silvicultura." },

  // 6. Norte
  { name: "Santa Rosa de Osos", subregion: "norte", capitalDistanceKm: 74, primaryEconomy: "Leche, Carne de cerdo, Papas, Turismo religioso", adTip: "La denominación de quesos es vital. Campañas de video que capten los animales en pastoreo y procesos limpios de ordeño tecnificado." },
  { name: "Yarumal", subregion: "norte", capitalDistanceKm: 120, primaryEconomy: "Comercio subregional, Café, Ganadería, Cultivos", adTip: "Eje comercial del Norte. Publicidad en Google Maps local para atraer compradores de municipios vecinos (Toledo, Campamento, etc.)." },
  { name: "Donmatías", subregion: "norte", capitalDistanceKm: 49, primaryEconomy: "Confección de Jeans (Maquila), Porcicultura, Leche", adTip: "Anuncios B2B para maquila de mezclilla a nivel país. Landings con galerías de acabados, lavanderías e inventarios listos en PDF." },
  { name: "Entrerríos", subregion: "norte", capitalDistanceKm: 60, primaryEconomy: "Leche, Truchas (La suiza antioqueña), Paisajes", adTip: "Marketing de alta estética. 'La Suiza de Antioquia'. Anuncios de glampings flotantes sobre la represa de Río Grande con reserva directa." },
  { name: "San Pedro de los Milagros", subregion: "norte", capitalDistanceKm: 38, primaryEconomy: "Lechería de alta gama, Basílica del Señor de los Milagros", adTip: "Turismo religioso masivo los domingos. Promociona el parque del Señor de los Milagros y queseras locales a familias de Medellín." },
  { name: "Gómez Plata", subregion: "norte", capitalDistanceKm: 90, primaryEconomy: "Turismo ecológico, Energía, Ganadería", adTip: "Fomenta la visita al Salto de Guadalupe (el teleférico más empinado). El embudo de reservas debe detallar horarios de operación." },
  { name: "Carolina del Príncipe", subregion: "norte", capitalDistanceKm: 102, primaryEconomy: "Jardines de balcones coloniales, Represa Troneras", adTip: "El pueblo de los balcones floridos. Promociona el festival de balcones con concursos fotográficos interactivos en redes sociales." },
  { name: "Ituango", subregion: "norte", capitalDistanceKm: 195, primaryEconomy: "Café, Maíz, Ganadería, Energía", adTip: "Cooperativismo. Sitios institucionales que faciliten trámites de caficultores asociados y promuevan marcas de reconciliación." },
  { name: "Briceño", subregion: "norte", capitalDistanceKm: 170, primaryEconomy: "Café, Cacao, Ganadería", adTip: "Venta directa de café asociativo de campesinos. Diseña tiendas Shopify sencillas pero de alta carga emocional." },
  { name: "Campamento", subregion: "norte", capitalDistanceKm: 144, primaryEconomy: "Panela (Cuna de la panela), Café", adTip: "Promociona la panela orgánica pulverizada online. Ofrece empaques corporativos sostenibles para un consumo saludable." },
  { name: "Angostura", subregion: "norte", capitalDistanceKm: 140, primaryEconomy: "Café, Panela, Culto al Padre Marianito", adTip: "Turismo religioso de peregrinación del Padre Marianito. Landings con guías de hospedajes y venta de reliquias certificadas." },
  { name: "Belmira", subregion: "norte", capitalDistanceKm: 62, primaryEconomy: "Páramo de Belmira, Truchas, Leche", adTip: "Turismo ecológico de caminantes al sendero del Páramo de Belmira de clima gélido. Pauta en Medellín para públicos deportistas." },
  { name: "Guadalupe", subregion: "norte", capitalDistanceKm: 112, primaryEconomy: "Ecoturismo, Ganadería", adTip: "Usa la cercanía a la quebrada y saltos para posicionar glampings rústicos que busquen la desconexión total." },
  { name: "San José de la Montaña", subregion: "norte", capitalDistanceKm: 125, primaryEconomy: "Quesos madurados, Ganadería fría, Trucha", adTip: "Destaca quesos suizos y holandeses criados en las montañas frías con campañas de envíos Premium nacionales." },
  { name: "San Andrés de Cuerquia", subregion: "norte", capitalDistanceKm: 115, primaryEconomy: "Café, Caña panelera, Ganadería", adTip: "Posiciona marcas agropecuarias en directorios locales. Landing pages que capturen solicitudes de repuestos y asistencia técnica." },
  { name: "Toledo", subregion: "norte", capitalDistanceKm: 153, primaryEconomy: "Café, Carbón, Ganadería", adTip: "Promueve talleres electromecánicos e industriales para proveedores de la Central Hidroeléctrica." },
  { name: "Valdivia", subregion: "norte", capitalDistanceKm: 155, primaryEconomy: "Cacao, Café, Ganadería Mayor", adTip: "Foco en paraderos de comida de carretera. Publicidad local por geovallas e incentivos en ruta hacia la costa atlántica." },

  // 7. Bajo Cauca
  { name: "Caucasia", subregion: "bajo_cauca", capitalDistanceKm: 270, primaryEconomy: "Comercio de llanura, Ganadería extensiva, Arroz", adTip: "La capital bajo-cauqueña necesita CRM y sitios corporativos robustos. Los anuncios en Google Search capturan alta necesidad en ferretería y veterinarias." },
  { name: "El Bagre", subregion: "bajo_cauca", capitalDistanceKm: 290, primaryEconomy: "Minería aluvial de oro, Plátano, Cacao", adTip: "Sitios con enfoque de proveeduría industrial. Optimiza para licitaciones locales mediante un portal institucional higiénico." },
  { name: "Nechí", subregion: "bajo_cauca", capitalDistanceKm: 340, primaryEconomy: "Pesca, Agricultura (Arroz), Ganadería", adTip: "Usa portales sencillos para coordinar fletes pesqueros y agropecuarios directamente con las cadenas de frío de Medellín." },
  { name: "Tarazá", subregion: "bajo_cauca", capitalDistanceKm: 220, primaryEconomy: "Cacao de restitución, Ganadería, Pesca", adTip: "Historias potentes de cacao ético. Campañas destinadas a chocolaterías artesanales que compran materia prima con responsabilidad social." },
  { name: "Cáceres", subregion: "bajo_cauca", capitalDistanceKm: 230, primaryEconomy: "Ganadería, Oro, Pesca de río", adTip: "Campañas de Facebook Ads destinadas a la comunidad de ganaderos con cotizadores y especificaciones técnicas de medicamentos ganaderos." },
  { name: "Zaragoza", subregion: "bajo_cauca", capitalDistanceKm: 285, primaryEconomy: "Minería, Ganadería, Maderas", adTip: "Apuesta a marcas de madera fina certificada para el sector diseño de interiores en la capital del departamento." },

  // 8. Nordeste
  { name: "Yolombó", subregion: "nordeste", capitalDistanceKm: 108, primaryEconomy: "Panela (Cuna de la marquesa), Caña panelera, Ganadería", adTip: "Promoción de panela premium artesanal y marquesas yolomboquinas en todo Medellín con campañas visuales de TikTok de dulces típicos." },
  { name: "Amalfi", subregion: "nordeste", capitalDistanceKm: 144, primaryEconomy: "Café, Cacao, Caucho, Jaguares", adTip: "Vende la biodiversidad. El turismo de conservación del jaguar y ecoturismo de reservas selváticas en Amalfi atrae ecoturistas internacionales." },
  { name: "Cisneros", subregion: "nordeste", capitalDistanceKm: 85, primaryEconomy: "Ferrocarril de Antioquia (Histórico), Charcos, Turismo", adTip: "El plan familiar del ferrocarril. Promociona visitas rápidas de fin de semana en Medellín y Envigado mediante paquetes turísticos todo incluido." },
  { name: "Segovia", subregion: "nordeste", capitalDistanceKm: 200, primaryEconomy: "Minería profunda de oro, Comercial", adTip: "Eje minero histórico colombino. Promociona ferreterías industriales y servicios de ingeniería minera con portales altamente técnicos." },
  { name: "Remedios", subregion: "nordeste", capitalDistanceKm: 190, primaryEconomy: "Oro, Ganadería, Cacao", adTip: "Campañas regionales B2B de maquinaria pesada. Catálogos en línea de gran fluidez con cotizaciones en tiempo real." },
  { name: "San Roque", subregion: "nordeste", capitalDistanceKm: 118, primaryEconomy: "Caña, Oro, Generación de energía", adTip: "Crea portales para el clúster de paneleros locales para unificar la oferta logística y vender panela directa en bloque." },
  { name: "Santo Domingo", subregion: "nordeste", capitalDistanceKm: 65, primaryEconomy: "Cuna del escritor Tomás Carrasquilla, Turismo rural", adTip: "La literatura arriera. Posiciona tu hostal literario en Google Maps y crea una landing con relatos cortos de Carrasquilla para enganchar visitantes." },
  { name: "Segovia - Yalí", subregion: "nordeste", capitalDistanceKm: 180, primaryEconomy: "Caña panelera, Oro", adTip: "Promueve paraderos de arriería y posadas rurales. Anuncios rústicos locales focalizados en ciclistas de montaña de fin de semana." },
  { name: "Vegachí", subregion: "nordeste", capitalDistanceKm: 145, primaryEconomy: "Dulces de caña, Cacao, Cavernas de Vegachí", adTip: "Atractivo de espeleología e historia. Las cavernas de Vegachí son excelentes ganchos de conversión de aventura de fin de semana." },
  { name: "Anorí", subregion: "nordeste", capitalDistanceKm: 151, primaryEconomy: "Café, Cacao, Conservación", adTip: "Cooperativismo para productos de origen. El café especial de Anorí con marca de paz requiere landings impecables de gran diseño corporativo." },

  // 9. Magdalena Medio
  { name: "Puerto Berrío", subregion: "magdalena_medio", capitalDistanceKm: 175, primaryEconomy: "Ganadería bimodal, Puerto fluvial, Logística, Pesca", adTip: "Conexión nacional del departamento. Anuncios digitales dirigidos a comerciantes mayoristas ganaderos y transportadores fluviales." },
  { name: "Puerto Triunfo", subregion: "magdalena_medio", capitalDistanceKm: 170, primaryEconomy: "Hacienda Nápoles, Ecoturismo de aventura (Río Claro)", adTip: "Tráfico masivo de fin de semana. Promociona entradas y hospedajes asociados a la Hacienda Nápoles y Reserva Río Claro con calendarios de ocupación integrados." },
  { name: "Puerto Nare", subregion: "magdalena_medio", capitalDistanceKm: 205, primaryEconomy: "Cemento (Simesa), Cacao, Ganadería bimodal", adTip: "Portales de la industria pesada y cementera que faciliten el enlace con distribuidores de materiales nacionales." },
  { name: "Caracolí", subregion: "magdalena_medio", capitalDistanceKm: 156, primaryEconomy: "Cavernas del Nus, Cacao, Ganadería", adTip: "Sácale provecho a las Cavernas del Nus. Posiciona en SEO con búsquedas de 'Aventura bajo tierra Antioquia' y capta aventureros." },
  { name: "Maceo", subregion: "magdalena_medio", capitalDistanceKm: 140, primaryEconomy: "Cacao, Ganadería, Bosques de reserva", adTip: "Campañas enfocadas en cacao orgánico con trazabilidad forestal. Excelente mercado en tiendas fitness e hiper-alimentos." },
  { name: "Yondó", subregion: "magdalena_medio", capitalDistanceKm: 215, primaryEconomy: "Hidrocarburos, Ganadería, Pesca", adTip: "Promociona servicios petroleros locales e industriales. Diseña portales B2B limpios para cotizar suministros mecánicos y ambientales." }
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Café Retiro Hacienda",
    niche: "Cafés Especiales",
    municipality: "El Retiro",
    subregion: "oriente",
    phone: "+573123456789",
    website: "https://caferetiro.atziluth.com",
    usesAI: true,
    servicesCompleted: ["Diseño Web Premium", "Campaña Google Ads Local", "Instagram Growth Engine"]
  },
  {
    id: "2",
    name: "EcoGlamping Guatapé",
    niche: "Hotelería Campestre",
    municipality: "Guatapé",
    subregion: "oriente",
    phone: "+573009876543",
    website: "https://ecoguatape.atziluth.com",
    usesAI: true,
    servicesCompleted: ["Embudo de Reservas Web", "Campaña Meta Ads Tráfico", "Copywriting Persuasivo"]
  },
  {
    id: "3",
    name: "Calzado Itagüí Industrial",
    niche: "E-commerce de Moda & Seguridad",
    municipality: "Itagüí",
    subregion: "valle_de_aburra",
    phone: "+573155556677",
    website: "https://calzadoitagui.atziluth.com",
    usesAI: false,
    servicesCompleted: ["Catálogo Online B2B", "Google Search Ads"]
  },
  {
    id: "4",
    name: "Hoteles Colonial Santa Fe",
    niche: "Hoteles & Hostales",
    municipality: "Santa Fe de Antioquia",
    subregion: "occidente",
    phone: "+573214445588",
    website: "https://colonialsantafe.atziluth.com",
    usesAI: true,
    servicesCompleted: ["Optimización Web Mobile", "Campaña Geovallada Sol"]
  },
  {
    id: "5",
    name: "Quesos Santa Rosa Selecto",
    niche: "Productoras de Lácteos",
    municipality: "Santa Rosa de Osos",
    subregion: "norte",
    phone: "+573108889900",
    website: "https://quesosantarosa.atziluth.com",
    usesAI: true,
    servicesCompleted: ["Diseño de Branding E-commerce", "TikTok Ad Launchpad"]
  },
  {
    id: "6",
    name: "Banano Carepa Oro",
    niche: "Logística & Transporte",
    municipality: "Carepa",
    subregion: "uraba",
    phone: "+573027771122",
    website: "https://bananocarepa.atziluth.com",
    usesAI: false,
    servicesCompleted: ["Portal Corporativo de Carga"]
  }
];
