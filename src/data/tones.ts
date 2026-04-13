import type { Tone } from '../types';

export const tones: Tone[] = [
  {
    id: 'corporativo',
    name: 'Corporativo',
    icon: 'Business',
    description: 'Email de Recursos Humanos',
    tagline: 'Su deuda es nuestra prioridad fiscal.',
    prompts: {
      light: 'Amable recordatorio de RH sobre la deuda pendiente. Tono profesional pero amigable.',
      balanced: 'Email de RH con tono de amenaza suave de "procedimientos disciplinarios". Sarcástico corporativo.',
      spicy: 'Email despidiéndote de la "empresa amistad" por incumplimiento. Muy ácido corporativo.'
    }
  },
  {
    id: 'mafioso',
    name: 'Mafioso',
    icon: 'LocalMall',
    description: 'El Padrino te habla',
    tagline: 'Tengo ofertas que no podrá rechazar.',
    prompts: {
      light: 'Oferta que no puedes rechazar, pero amablemente. Referencias suaves al padrino.',
      balanced: 'El padrino quiere su dinero. Tono de respeto pero firme. Referencias a la familia.',
      spicy: 'Don Vito no duerme hasta cobrar. Amenazas veladas de consecuencias graves. Tono intimidante.'
    }
  },
  {
    id: 'dramatico',
    name: 'Dramático',
    icon: 'TheaterComedy',
    description: 'Telenovela mexicana',
    tagline: '¿Cómo pudiste hacerme esto?',
    prompts: {
      light: 'Tono de telenovela pero suave, casi cómico.',
      balanced: 'Telenovela con lágrimas, drama, giros inesperados. Alto contenido emocional.',
      spicy: 'Telenovela máxima: "¡Me abandonaste con la deuda!" Drama excesivo, casi histriónico.'
    }
  },
  {
    id: 'poeta',
    name: 'Poeta',
    icon: 'MenuBook',
    description: 'Versos románticos',
    tagline: 'La deuda es un verso sin rima.',
    prompts: {
      light: 'Verso romántico suave sobre la deuda. Poético pero accesible.',
      balanced: 'Verso sobre el dolor de la deuda no pagada. Metáforas poéticas del dinero.',
      spicy: 'Verso oscuro, casi amenazante poéticamente. El dinero como tema trágico.'
    }
  },
  {
    id: 'nerdy',
    name: 'Nerdy',
    icon: 'Computer',
    description: 'Error 404: Pago not found',
    tagline: 'Error 404: Dignity not found.',
    prompts: {
      light: 'Tono técnico suave, recordatorio tipo "notification pending".',
      balanced: 'Referencias a errores técnicos: "Error 404: Pago not found". Lenguaje de programación.',
      spicy: '"Segmentation fault: Tu dignidad". Crítica técnica agresiva del comportamiento.'
    }
  },
  {
    id: 'yogi',
    name: 'Yogi Zen',
    icon: 'SelfImprovement',
    description: 'Namaste... pero paga',
    tagline: 'Namaste... pero paga.',
    prompts: {
      light: '"La paz fluye". Mensaje zen suave, sin presión.',
      balanced: '"Namaste... pero paga". Zen con un propósito. Karma y deudas.',
      spicy: '"Tu karma está en números rojos". Zen amenazante, balance cósmico deudor.'
    }
  },
  {
    id: 'abuela',
    name: 'Abuela',
    icon: 'Elderly',
    description: 'Todo el barrio sabe',
    tagline: 'Me decepcionas, hijo. Paga ya.',
    prompts: {
      light: '"Mijo, no olvides". Tono maternal suave.',
      balanced: '"Todo el barrio ya sabe". Chisme extendido, presión social.',
      spicy: '"Tu mamá me llamó preocupada". Involucrar a la familia, máxima presión emocional.'
    }
  },
  {
    id: 'abogado',
    name: 'Abogado',
    icon: 'Gavel',
    description: 'Términos legales',
    tagline: 'Términos legales que debe conocer.',
    prompts: {
      light: 'Notificación formal pero cordial. Tono legal suave.',
      balanced: 'Demanda verbal con términos legales. Citaciones y plazos.',
      spicy: 'Orden de arresto de la amistad. Lenguaje legal extremo, consecuencias graves.'
    }
  },
  {
    id: 'chef',
    name: 'Chef',
    icon: 'Restaurant',
    description: '¡RAW!',
    tagline: '¡RAW! ¡Tu excusa está cruda!',
    prompts: {
      light: '"Está frío el pago". Crítica culinaria suave.',
      balanced: '"¡RAW! ¡Tu excusa está cruda!". Tipo Gordon Ramsay, gritos moderados.',
      spicy: '"Idiot sandwich de deudores". Insultos culinarios extremos, máximo volumen.'
    }
  },
  {
    id: 'influencer',
    name: 'Influencer',
    icon: 'Favorite',
    description: 'Hey bestie 💕',
    tagline: 'Hey bestie 💕 no me dejes en flop.',
    prompts: {
      light: '"Hey bestie 💕". Tono influencer amigable.',
      balanced: '"Bestie, no me dejes en flop". Lenguaje de redes, viralidad.',
      spicy: '"Cancelado por deudor 💀". Drama de cancelación, exposición pública.'
    }
  },
  {
    id: 'motivacional',
    name: 'Motivacional',
    icon: 'FitnessCenter',
    description: 'Disciplina = pagar',
    tagline: 'Disciplina = pagar. Mindset.',
    prompts: {
      light: '"Creo en ti". Discurso motivacional suave.',
      balanced: '"Disciplina = pagar". Coach de vida agresivo, mindset de pago.',
      spicy: '"No eres un campeón hasta pagar". Motivación extrema, casi militar.'
    }
  },
  {
    id: 'alien',
    name: 'Alien',
    icon: 'Rocket',
    description: 'Los humanos y sus deudas',
    tagline: 'Moneda terrestre requerida de inmediato.',
    prompts: {
      light: '"Curioso este \'dinero\'". Observador alienígena ingenuo.',
      balanced: '"Los humanos y sus deudas". Crítica alienígena de costumbres humanas.',
      spicy: '"Mi nave no arranca sin ese pago". Amenaza alienígena, consecuencias interestelares.'
    }
  },
  // ==================== TONOS PREMIUM (PRO) ====================
  {
    id: 'profesor',
    name: 'El Profesor',
    icon: 'School',
    description: 'Clase magistral de finanzas',
    tagline: 'Vamos a hacer un ejercicio sobre liquidez...',
    isPremium: true,
    prompts: {
      light: 'Tono pedagógico amable, como dar clase particular sobre finanzas personales. Explica la importancia del flujo de caja.',
      balanced: 'Tono de profesor universitario estricto. "Esto va a caer en el examen de la vida". Usa términos financieros.',
      spicy: 'Tono de profesor desilusionado con alumno repetidor. "Llevas 3 años en este curso de pago". Amenaza con reprobar.'
    }
  },
  {
    id: 'coach',
    name: 'Coach Motivacional',
    icon: 'Sports',
    description: 'Tony Robbins de cobranza',
    tagline: '¡Visualiza ese dinero entrando a tu vida!',
    isPremium: true,
    prompts: {
      light: 'Coach motivacional positivo. "¡Tú puedes pagarme! ¡Cree en ti como yo creo en ese dinero!"',
      balanced: 'Coach agresivo estilo gym. "¡Sin excusas! ¡Disciplina! ¡El que no paga es porque no quiere!"',
      spicy: 'Coach extremo casi abusivo. "¡Eres un perdedor hasta que pagues! ¡Arrodíllate ante mi cartera!"'
    }
  },
  {
    id: 'abogado_chicano',
    name: 'Abogado Chicano',
    icon: 'Balance',
    description: 'Saul Goodman style',
    tagline: 'Según el artículo 247 del código bro...',
    isPremium: true,
    prompts: {
      light: 'Abogado callejero pero amigable. Usa jerga legal mezclada con slang. "Mira hermano, legalmente me debes..."',
      balanced: 'Abogado Chicano con estilo Saul Goodman. Referencias a Better Call Saul. Tono de con artist legal.',
      spicy: 'Abogado Chicano intimidante. "Tengo contactos en el juzgado". Amenazas veladas de consecuencias legales.'
    }
  },
  {
    id: 'asmr',
    name: 'ASMR',
    icon: 'Headphones',
    description: 'Susurros relajantes pero firmes',
    tagline: '*susurro* Necesito que pagues... *susurro*',
    isPremium: true,
    prompts: {
      light: 'ASMR suave y relajante. Susurros sobre el dinero. Sonidos relajantes mezclados con recordatorio de pago.',
      balanced: 'ASMR más insistente. Susurros que se intensifican. "*susurro* Por favor... *susurro más fuerte* PAGA"',
      spicy: 'ASMR amenazante. Susurros oscuros. "*susurro* Escuchas eso... *susurro* Es tu conciencia culpable..."'
    }
  },
  {
    id: 'chaman',
    name: 'Guía Espiritual',
    icon: 'Spa',
    description: 'Energías, karma y chakras',
    tagline: 'El universo me está diciendo que necesito ese dinero...',
    isPremium: true,
    prompts: {
      light: 'Guía espiritual zen. Referencias a energías positivas y flujo del dinero. "El universo quiere que estemos en balance."',
      balanced: 'Chamán más directo. "Tus chakras están bloqueados por la deuda". Ritual de limpieza energética mediante pago.',
      spicy: 'Guía espiritual oscuro. "Tu karma está en números rojos". Amenazas espirituales de maldiciones por no pagar.'
    }
  },
  {
    id: 'fitness',
    name: 'Gym Bro',
    icon: 'Exercise',
    description: 'No pain, no gain',
    tagline: '¡No dejes que tu cartera haga skipping ese pago!',
    isPremium: true,
    prompts: {
      light: 'Gym bro motivador. "¡Light weight baby! ¡Esa deuda la pagamos con un set más!" Referencias a ejercicio.',
      balanced: 'Gym bro intenso. "¡Beast mode! ¡Paga como si fuera tu último día de leg day!" Disciplina extrema.',
      spicy: 'Gym bro tóxico. "¡Soy tu sensei de finanzas y estás fallando! ¡Un campeón paga a tiempo!"'
    }
  },
  {
    id: 'chef_pesado',
    name: 'Chef Pesado',
    icon: 'Skillet',
    description: 'Gordon Ramsay extremo',
    tagline: '¡ESE PAGO ESTÁ CRUDO! ¡CRUDO!',
    isPremium: true,
    prompts: {
      light: 'Chef crítico pero constructivo. "Está frío el pago, pero se puede calentar". Tono culinario.',
      balanced: 'Chef estilo Ramsay gritando. "¡RAW! ¡Tu excusa está cruda! ¡Idiot sandwich de deudas!" Insultos creativos.',
      spicy: 'Chef descontrolado. "¡APAGA TODO! ¡CIERRA LA COCINA! ¡Estás quemado como tu crédito!" Caos total.'
    }
  },
  {
    id: 'politico',
    name: 'Político',
    icon: 'AccountBalance',
    description: 'Muchas palabras, nada claro',
    tagline: 'En estos momentos históricos que vivimos...',
    isPremium: true,
    prompts: {
      light: 'Político con discurso vacío pero amable. Muchas palabras huecas sobre "el futuro" y "la economía".',
      balanced: 'Político en campaña prometiendo que pagarás. "Compromiso de pago en los próximos 4 años". Evade.',
      spicy: 'Político corrupto amenazante. "Tengo contactos en alto lugar". Tono de quien tiene poder.'
    }
  },
  {
    id: 'rapero',
    name: 'Rapero',
    icon: 'Mic',
    description: 'Con rimas y flow',
    tagline: 'Yo no quiero drama, solo mi paga, sin falta...',
    isPremium: true,
    prompts: {
      light: 'Rap suave y melódico. Rimar sobre el dinero de forma amigable. Flow tranquilo.',
      balanced: 'Rap de battle style. Freestyle disses sobre el deudor. "Tus barras son tan malas como tu crédito".',
      spicy: 'Rap hardcore/gangsta. "Represento la calle y en la calle no se debe". Amenazas rimadas agresivas.'
    }
  },
  {
    id: 'abuela_sabia',
    name: 'Abuela Sabia',
    icon: 'ElderlyWoman',
    description: 'Consejos de vida y cobranza',
    tagline: 'Mijo, en mi época se pagaba el mismo día...',
    isPremium: true,
    prompts: {
      light: 'Abuela sabia con consejos. "Mijo, la vida te dará, pero primero da tú". Sabiduría generacional.',
      balanced: 'Abuela que compara épocas. "En mis tiempos no existían las deudas". Presión de "antes era mejor".',
      spicy: 'Abuela desilusionada. "Me decepcionas como nieto y como persona". Culpabilidad familiar extrema.'
    }
  },
  {
    id: 'ia',
    name: 'IA Robot',
    icon: 'SmartToy',
    description: 'ChatGPT style, muy técnico',
    tagline: 'Procesando solicitud de transferencia...',
    isPremium: true,
    prompts: {
      light: 'IA amigable asistente. "He calculado tu deuda con 99.9% de certeza". Tecnológico pero accesible.',
      balanced: 'IA más robótica. Códigos de error, procesos, protocolos. "Error 402: Pago requerido".',
      spicy: 'IA despiadada. "He simulado 10,000 escenarios y en todos pierdes si no pagas". Terminator vibes.'
    }
  },
  {
    id: 'narcotelenovela',
    name: 'Narco Novela',
    icon: 'LocalMovies',
    description: 'Telenovela mexicana de narcos',
    tagline: '¿Sabes con quién te metiste? Paga.',
    isPremium: true,
    prompts: {
      light: 'Narco novela melodramática. "Me rompiste el corazón... y la cartera". Drama excesivo.',
      balanced: 'Narco novela intimidante. "Tengo gente en todos lados". Amenazas tipo cartel.',
      spicy: 'Narco novela máxima. "Plata o plomo... y tú elegiste plomo". Extremo casi realista.'
    }
  }
];

export const humorLevelLabels: Record<string, { label: string; emoji: string; description: string }> = {
  light: { label: 'Light', emoji: '😇', description: 'Inofensivo y amigable' },
  balanced: { label: 'Balanceado', emoji: '😏', description: 'Sarcástico divertido' },
  spicy: { label: 'Picante', emoji: '😈', description: 'Ácido para amigos cercanos' }
};
