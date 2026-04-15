export type Language = 'es' | 'en';

export const translations = {
  es: {
    common: {
      appName: 'El Cobrador',
      continue: 'Continuar',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      delete: 'Eliminar',
      search: 'Buscar',
      loading: 'Cargando...',
      back: 'Volver',
      unlimited: 'Plan Pro Activo',
      freeMessages: 'mensajes gratis',
      dailyLimit: 'Límite diario',
      message: 'mensaje',
      messages: 'mensajes',
      total: 'Total'
    },
    nav: {
      debts: 'Deudas',
      history: 'Historial',
      clients: 'Clientes',
      settings: 'Ajustes'
    },
    form: {
      title: '¡Nueva Deuda!',
      subtitle: 'Registra los detalles y deja que el capibara cobre',
      tagline: '¡Te ayudo a cobrar!',
      concept: '¿Por qué concepto?',
      conceptPlaceholder: 'Ej: Pizza del viernes, Cine...',
      who: '¿Quién te debe?',
      whoPlaceholder: 'Nombre',
      amount: '¿Cuánto?',
      amountPlaceholder: '0.00',
      suggestions: {
        pizza: '🍕 Pizza',
        beers: '🍻 Birras',
        uber: '🚕 Uber',
        food: '🍔 Comida',
        cinema: '🎬 Cine',
        shopping: '🛒 Compras'
      },
      advancedOptions: 'Más detalles (fecha, recordatorios)',
      hideAdvanced: 'Ocultar detalles',
      generateMessage: 'Generar Mensaje de Cobro',
      fillData: 'Completa los datos',
      dueDate: 'Fecha límite de pago',
      additionalNotes: 'Notas adicionales',
      notesPlaceholder: 'Detalles extra sobre la deuda...'
    },
    history: {
      title: 'Historial de mensajes',
      totalCollected: 'Total Cobrado',
      messages: 'Mensajes',
      average: 'Promedio',
      emptyTitle: 'No hay mensajes guardados',
      emptySubtitle: 'Genera tu primer mensaje de cobro y aparecerá aquí',
      emptyFiltered: 'No se encontraron resultados',
      tryOtherFilters: 'Intenta con otros filtros de búsqueda',
      searchPlaceholder: 'Buscar por deudor o tono...',
      deleteAll: 'Borrar todo',
      confirmDeleteAll: '¿Borrar todo el historial?',
      filters: {
        all: 'Todos',
        light: 'Suave',
        balanced: 'Sarcástico',
        spicy: 'Ácido'
      },
      weeklyActivity: 'Actividad de la semana',
      edit: 'Editar',
      editSuccess: 'Mensaje actualizado',
      editError: 'Error al guardar',
      editPlaceholder: 'Escribe tu mensaje personalizado...'
    },
    clients: {
      title: 'Tus Deudores',
      totalPortfolio: 'Cartera Total',
      pending: 'Pendiente',
      debtors: 'Deudores',
      emptyTitle: 'Tu cartera está vacía',
      emptySubtitle: 'Guarda deudores frecuentes para cobrar más rápido. Se generan automáticamente desde tu historial.',
      emptyTip: 'Tip: Escribe un nombre arriba y presiona + para agregarlo',
      searchPlaceholder: 'Buscar clientes...',
      addNew: 'Nombre del nuevo deudor...',
      charge: 'Cobrar',
      totalCollections: 'Cobros Totales',
      averagePerCollection: 'Promedio por Cobro',
      confirmDelete: (name: string) => `¿Eliminar a ${name} de la lista?`
    },
    settings: {
      title: 'Ajustes',
      account: 'Cuenta',
      preferences: 'Preferencias',
      about: 'Acerca de',
      loginWithGoogle: 'Iniciar sesión con Google',
      logout: 'Cerrar sesión',
      welcome: 'Bienvenido',
      guest: 'Invitado',
      syncMessage: 'Tus deudas se sincronizarán automáticamente',
      verifiedAccount: 'Cuenta Verificada',
      loginTitle: 'Inicia sesión para guardar tu historial',
      premiumTitle: 'El Cobrador Pro',
      premiumSubtitle: 'Mensajes ilimitados, historial en la nube y más características premium.',
      premiumBadge: 'Premium Experience',
      upgradeNow: 'Mejorar Ahora',
      notifications: 'Notificaciones Push',
      notificationsDesc: 'Alertas de pagos y vencimientos',
      darkMode: 'Modo Oscuro',
      darkModeDesc: 'Ahorro de batería y confort visual',
      animations: 'Animaciones',
      animationsDesc: 'Efectos visuales de la interfaz',
      sounds: 'Sonidos',
      soundsDesc: 'Efectos al generar mensajes',
      version: 'Versión de la App',
      website: 'Sitio Web',
      language: 'Idioma',
      languageDesc: 'Selecciona tu idioma preferido',
      spanish: 'Español',
      english: 'English'
    },
    pricing: {
      title: 'Impulsa tu Gestión de Cobros',
      subtitle: 'Desde el cobrador casual hasta el profesional. Elige el plan que mejor se adapte a tu ritmo.',
      hero: {
        badge: 'SUBE DE NIVEL',
        title: 'Desbloquea tus Superpoderes',
        subtitle: 'Deja de perseguir a la gente. Conviértete en el cobrador que todos respetan (y pagan a tiempo).'
      },
      plans: {
        basic: {
          name: 'Básico',
          price: 'Gratis',
          period: '/ siempre',
          description: 'Para deudas pequeñas entre amigos íntimos.',
          features: ['Hasta 3 deudores', 'Recordatorios manuales'],
          ctaCurrent: 'Plan actual',
          cta: 'Elegir Básico'
        },
        vip: {
          name: 'Amigos VIP',
          price: '$79',
          period: '/mes',
          description: 'Automatiza la vergüenza de cobrar.',
          popular: 'Más popular',
          features: ['Deudores ilimitados', 'Recordatorios vía WhatsApp', 'Historial de 1 año', 'Soporte prioritario'],
          ctaCurrent: 'Tu plan actual',
          cta: '¡Mejorar ahora!'
        },
        pro: {
          name: 'Cobrador Pro',
          price: '$129',
          period: '/mes',
          description: 'Para el que maneja el dinero del grupo.',
          features: ['Todo lo de Amigos VIP', 'Bot de llamadas IA', 'Reportes legales PDF', 'Multi-divisas Pro'],
          ctaCurrent: 'Tu plan actual',
          cta: 'Ir Pro'
        }
      },
      trust: {
        title: 'Únete a los +10,000 cobradores felices',
        security: 'Seguridad Bancaria',
        privacy: 'Privacidad Total',
        success: '99% Éxito en Cobro'
      },
      faq: {
        title: 'Preguntas que te haces',
        q1: {
          question: '¿Puedo cancelar cuando quiera?',
          answer: 'Obvio. No somos como tus amigos, nosotros sí cumplimos nuestra palabra. Cancela en un clic.'
        },
        q2: {
          question: '¿Mis amigos sabrán que uso Pro?',
          answer: 'Solo si quieres. Los mensajes pueden ser anónimos o personalizados con tu estilo.'
        }
      }
    },
    paywall: {
      badge: 'EL COBRADOR PRO',
      title: 'Llegaste al límite',
      subtitle: 'Has generado el máximo de mensajes gratuitos por hoy. Para seguir cobrando sin límites, actualiza a Pro.',
      features: {
        unlimited: {
          title: 'Mensajes ilimitados',
          desc: 'Sin restricciones diarias ni mensuales.'
        },
        history: {
          title: 'Historial en la nube',
          desc: 'Tus mensajes guardados y sincronizados.'
        },
        qr: {
          title: 'QR personalizado',
          desc: 'Códigos QR ilimitados para compartir.'
        }
      },
      price: '$3.99',
      period: '/mes',
      cta: 'Actualizar a Pro',
      keepFree: 'Mantener versión gratuita'
    },
    humor: {
      title: '¿Qué tan picante?',
      subtitle: 'Selecciona el nivel de intensidad para tu mensaje de cobro.',
      levels: {
        light: {
          name: 'Suave',
          desc: 'Recordatorio amable'
        },
        balanced: {
          name: 'Sarcástico',
          desc: 'Con un toque de ironía'
        },
        spicy: {
          name: 'Ácido',
          desc: 'Directo al grano'
        }
      }
    },
    tone: {
      title: 'Elige tu ejecutor',
      subtitle: 'Selecciona la personalidad que mejor se adapte a tu estilo de cobranza hoy.'
    },
    preview: {
      title: 'Mensaje de Cobro',
      copy: 'Copiar',
      share: 'Compartir',
      flip: 'Flip',
      restart: 'Nuevo',
      copied: '¡Copiado!',
      shareTitle: 'Mensaje de El Cobrador',
      regenerate: 'Regenerar'
    },
    reminders: {
      title: 'Deudas por Cobrar',
      day3Title: 'Primer seguimiento',
      day7Title: 'Recordatorio',
      day14Title: 'Último aviso',
      yesPaid: 'Sí, pagó',
      notYet: 'Todavía no',
      markForgiven: 'Perdonar deuda',
      pendingCount: (count: number) => `${count} deudas pendientes`,
      daysAgo: (days: number) => `Hace ${days} días`,
      daysAgoShort: (days: number) => `${days} days ago`,
      paidQuestion: (name: string, amount: number, currency: string) => `¿${name} ya te pagó los ${currency === 'MXN' ? '$' : 'USD '}${amount}?`,
      paidQuestionEn: (name: string, amount: number, currency: string) => `Has ${name} paid you ${currency === 'MXN' ? '$' : 'USD '}${amount}?`
    },
    error: {
      title: 'Error',
      default: 'Algo salió mal. Intenta de nuevo.',
      quotaExceeded: 'Límite de uso alcanzado. Intenta más tarde.',
      apiKey: 'Problema con la API key. Usando mensaje alternativo.',
      network: 'Sin conexión a internet. Usando mensaje local.',
      generateFailed: 'Error al generar mensaje. Intenta de nuevo.',
      timeout: 'La IA tardó mucho en responder. Intenta de nuevo.'
    },
    tones: {
      free: 'Tonos Gratuitos',
      premium: 'Los Ejecutores Premium',
      premiumDesc: 'Maximiza tus posibilidades de cobro con personalidades ultra-persuasivas y de alto impacto.',
      exclusivePro: 'Exclusivo PRO',
      unlock: 'Desbloquear',
      active: 'Activo',
      corporativo: {
        name: 'Corporativo',
        description: 'Email de Recursos Humanos',
        tagline: 'Su deuda es nuestra prioridad fiscal.'
      },
      mafioso: {
        name: 'Mafioso',
        description: 'El Padrino te habla',
        tagline: 'Tengo ofertas que no podrá rechazar.'
      },
      dramatico: {
        name: 'Dramático',
        description: 'Telenovela mexicana',
        tagline: '¿Cómo pudiste hacerme esto?'
      },
      poeta: {
        name: 'Poeta',
        description: 'Versos románticos',
        tagline: 'La deuda es un verso sin rima.'
      },
      nerdy: {
        name: 'Nerdy',
        description: 'Error 404: Pago not found',
        tagline: 'Error 404: Dignity not found.'
      },
      yogi: {
        name: 'Yogi Zen',
        description: 'Namaste... pero paga',
        tagline: 'Namaste... pero paga.'
      },
      abuela: {
        name: 'Abuela',
        description: 'Todo el barrio sabe',
        tagline: 'Me decepcionas, hijo. Paga ya.'
      },
      abogado: {
        name: 'Abogado',
        description: 'Términos legales',
        tagline: 'Términos legales que debe conocer.'
      },
      chef: {
        name: 'Chef',
        description: '¡RAW!',
        tagline: '¡RAW! ¡Tu excusa está cruda!'
      },
      influencer: {
        name: 'Influencer',
        description: 'Hey bestie 💕',
        tagline: 'Hey bestie 💕 no me dejes en flop.'
      },
      motivacional: {
        name: 'Motivacional',
        description: 'Disciplina = pagar',
        tagline: 'Disciplina = pagar. Mindset.'
      },
      alien: {
        name: 'Alien',
        description: 'Los humanos y sus deudas',
        tagline: 'Moneda terrestre requerida de inmediato.'
      },
      profesor: {
        name: 'El Profesor',
        description: 'Clase magistral de finanzas',
        tagline: 'Vamos a hacer un ejercicio sobre liquidez...'
      },
      coach: {
        name: 'Coach Motivacional',
        description: 'Tony Robbins de cobranza',
        tagline: '¡Visualiza ese dinero entrando a tu vida!'
      },
      abogado_chicano: {
        name: 'Abogado Chicano',
        description: 'Saul Goodman style',
        tagline: 'Según el artículo 247 del código bro...'
      },
      asmr: {
        name: 'ASMR',
        description: 'Susurros relajantes pero firmes',
        tagline: '*susurro* Necesito que pagues... *susurro*'
      },
      chaman: {
        name: 'Guía Espiritual',
        description: 'Energías, karma y chakras',
        tagline: 'El universo me está diciendo que necesito ese dinero...'
      },
      fitness: {
        name: 'Gym Bro',
        description: 'No pain, no gain',
        tagline: '¡No dejes que tu cartera haga skipping ese pago!'
      },
      chef_pesado: {
        name: 'Chef Pesado',
        description: 'Gordon Ramsay extremo',
        tagline: '¡ESE PAGO ESTÁ CRUDO! ¡CRUDO!'
      },
      politico: {
        name: 'Político',
        description: 'Muchas palabras, nada claro',
        tagline: 'En estos momentos históricos que vivimos...'
      },
      rapero: {
        name: 'Rapero',
        description: 'Con rimas y flow',
        tagline: 'Yo no quiero drama, solo mi paga, sin falta...'
      },
      abuela_sabia: {
        name: 'Abuela Sabia',
        description: 'Consejos de vida y cobranza',
        tagline: 'Mijo, en mi época se pagaba el mismo día...'
      },
      ia: {
        name: 'IA Robot',
        description: 'ChatGPT style, muy técnico',
        tagline: 'Procesando solicitud de transferencia...'
      },
      narcotelenovela: {
        name: 'Narco Novela',
        description: 'Telenovela mexicana de narcos',
        tagline: '¿Sabes con quién te metiste? Paga.'
      }
    },
    gemini: {
      prompts: {
        light: 'Amable, sin presión, casi un recordatorio amigable. Chiste suave, nadie se ofende. Tono: inocente y divertido.',
        balanced: 'Sarcástico pero divertido. Enganche viral: que el receptor quiera saber qué app se usó. Tono: gracioso, gif-worthy.',
        spicy: 'Ácido, roast suave. Para amigos que aguantan broma pesada. Tono: casi amenazante pero entre broma.'
      },
      systemPrompt: 'Genera un mensaje de WhatsApp para cobrar una deuda.'
    },
    billing: {
      monthly: 'Mensual',
      annual: 'Anual',
      save: 'Ahorra',
      perYear: '/año',
      perMonth: '/mes',
      or: 'o',
      year: 'año'
    },
    ui: {
      previewBadge: 'Vista Previa',
      urgent: 'URGENTE',
      qrTitle: 'Código QR de Pago',
      download: 'DESCARGAR',
      footer: 'Generado con ElCobrador.app',
      newCollection: 'Crear nuevo cobro',
      back: 'Volver',
      generating: 'Generando mensaje...',
      qrGenerating: 'Generando...',
      whatsapp: 'WhatsApp',
      chooseExecutor: 'Elige tu',
      executor: 'ejecutor',
      collectionStyle: 'Selecciona la personalidad que mejor se adapte a tu estilo de cobranza hoy.',
      freeTones: 'Tonos Gratuitos',
      premiumExecutors: 'Los Ejecutores Premium',
      proBadge: 'PRO'
    }
  },
  en: {
    common: {
      appName: 'El Cobrador',
      continue: 'Continue',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      search: 'Search',
      loading: 'Loading...',
      back: 'Back',
      unlimited: 'Pro Plan Active',
      freeMessages: 'free messages',
      dailyLimit: 'Daily limit',
      message: 'message',
      messages: 'messages',
      total: 'Total'
    },
    nav: {
      debts: 'Debts',
      history: 'History',
      clients: 'Clients',
      settings: 'Settings'
    },
    form: {
      title: 'New Debt!',
      subtitle: 'Enter the details and let the capybara collect',
      tagline: 'I\'ll help you collect!',
      concept: 'What is it for?',
      conceptPlaceholder: 'Ex: Friday pizza, Cinema...',
      who: 'Who owes you?',
      whoPlaceholder: 'Name',
      amount: 'How much?',
      amountPlaceholder: '0.00',
      suggestions: {
        pizza: '🍕 Pizza',
        beers: '🍻 Beers',
        uber: '🚕 Uber',
        food: '🍔 Food',
        cinema: '🎬 Cinema',
        shopping: '🛒 Shopping'
      },
      advancedOptions: 'More details (date, reminders)',
      hideAdvanced: 'Hide details',
      generateMessage: 'Generate Collection Message',
      fillData: 'Complete the details',
      dueDate: 'Payment due date',
      additionalNotes: 'Additional notes',
      notesPlaceholder: 'Extra details about the debt...'
    },
    history: {
      title: 'Message History',
      totalCollected: 'Total Collected',
      messages: 'Messages',
      average: 'Average',
      emptyTitle: 'No saved messages',
      emptySubtitle: 'Generate your first collection message and it will appear here',
      emptyFiltered: 'No results found',
      tryOtherFilters: 'Try different search filters',
      searchPlaceholder: 'Search by debtor or tone...',
      deleteAll: 'Clear all',
      confirmDeleteAll: 'Clear all history?',
      filters: {
        all: 'All',
        light: 'Gentle',
        balanced: 'Sarcastic',
        spicy: 'Spicy'
      },
      weeklyActivity: 'Weekly activity',
      edit: 'Edit',
      editSuccess: 'Message updated',
      editError: 'Error saving',
      editPlaceholder: 'Write your custom message...'
    },
    clients: {
      title: 'Your Debtors',
      totalPortfolio: 'Total Portfolio',
      pending: 'Pending',
      debtors: 'Debtors',
      emptyTitle: 'Your portfolio is empty',
      emptySubtitle: 'Save frequent debtors to collect faster. They are generated automatically from your history.',
      emptyTip: 'Tip: Type a name above and press + to add',
      searchPlaceholder: 'Search clients...',
      addNew: 'New debtor name...',
      charge: 'Collect',
      totalCollections: 'Total Collections',
      averagePerCollection: 'Average per Collection',
      confirmDelete: (name: string) => `Remove ${name} from the list?`
    },
    settings: {
      title: 'Settings',
      account: 'Account',
      preferences: 'Preferences',
      about: 'About',
      loginWithGoogle: 'Sign in with Google',
      logout: 'Sign out',
      welcome: 'Welcome',
      guest: 'Guest',
      syncMessage: 'Your debts will sync automatically',
      verifiedAccount: 'Verified Account',
      loginTitle: 'Sign in to save your history',
      premiumTitle: 'El Cobrador Pro',
      premiumSubtitle: 'Unlimited messages, cloud history and more premium features.',
      premiumBadge: 'Premium Experience',
      upgradeNow: 'Upgrade Now',
      notifications: 'Push Notifications',
      notificationsDesc: 'Payment and due date alerts',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Battery saving and visual comfort',
      animations: 'Animations',
      animationsDesc: 'Interface visual effects',
      sounds: 'Sounds',
      soundsDesc: 'Message generation effects',
      version: 'App Version',
      website: 'Website',
      language: 'Language',
      languageDesc: 'Select your preferred language',
      spanish: 'Español',
      english: 'English'
    },
    pricing: {
      title: 'Boost Your Collection Management',
      subtitle: 'From casual collector to professional. Choose the plan that best fits your pace.',
      hero: {
        badge: 'LEVEL UP',
        title: 'Unlock Your Superpowers',
        subtitle: 'Stop chasing people. Become the collector everyone respects (and pays on time).'
      },
      plans: {
        basic: {
          name: 'Basic',
          price: 'Free',
          period: '/ forever',
          description: 'For small debts between close friends.',
          features: ['Up to 3 debtors', 'Manual reminders'],
          ctaCurrent: 'Current plan',
          cta: 'Choose Basic'
        },
        vip: {
          name: 'Friends VIP',
          price: 'MXN $49',
          period: '/month',
          description: 'Automate the awkwardness of collecting.',
          popular: 'Most popular',
          features: ['Unlimited debtors', 'WhatsApp reminders', '1 year history', 'Priority support'],
          ctaCurrent: 'Your current plan',
          cta: 'Upgrade now!'
        },
        pro: {
          name: 'Pro Collector',
          price: 'MXN $99',
          period: '/month',
          description: 'For the one managing group money.',
          features: ['Everything in Friends VIP', 'AI calling bot', 'Legal PDF reports', 'Pro multi-currency'],
          ctaCurrent: 'Your current plan',
          cta: 'Go Pro'
        }
      },
      trust: {
        title: 'Join 10,000+ happy collectors',
        security: 'Bank-grade Security',
        privacy: 'Total Privacy',
        success: '99% Collection Success'
      },
      faq: {
        title: 'Questions you might have',
        q1: {
          question: 'Can I cancel anytime?',
          answer: 'Obviously. Unlike your friends, we keep our word. Cancel in one click.'
        },
        q2: {
          question: 'Will my friends know I use Pro?',
          answer: 'Only if you want. Messages can be anonymous or customized with your style.'
        }
      }
    },
    paywall: {
      badge: 'EL COBRADOR PRO',
      title: 'You\'ve reached the limit',
      subtitle: 'You have generated the maximum free messages for today. To keep collecting without limits, upgrade to Pro.',
      features: {
        unlimited: {
          title: 'Unlimited messages',
          desc: 'No daily or monthly restrictions.'
        },
        history: {
          title: 'Cloud history',
          desc: 'Your messages saved and synced.'
        },
        qr: {
          title: 'Custom QR',
          desc: 'Unlimited QR codes to share.'
        }
      },
      price: '$3.99',
      period: '/month',
      cta: 'Upgrade to Pro',
      keepFree: 'Keep free version'
    },
    humor: {
      title: 'How spicy?',
      subtitle: 'Select the intensity level for your collection message.',
      levels: {
        light: {
          name: 'Gentle',
          desc: 'Friendly reminder'
        },
        balanced: {
          name: 'Sarcastic',
          desc: 'With a touch of irony'
        },
        spicy: {
          name: 'Spicy',
          desc: 'Straight to the point'
        }
      }
    },
    tone: {
      title: 'Choose your executor',
      subtitle: 'Select the personality that best fits your collection style today.'
    },
    preview: {
      title: 'Collection Message',
      copy: 'Copy',
      share: 'Share',
      flip: 'Flip',
      restart: 'New',
      copied: 'Copied!',
      shareTitle: 'Message from El Cobrador',
      regenerate: 'Regenerate'
    },
    reminders: {
      title: 'Debts to Collect',
      day3Title: 'First follow-up',
      day7Title: 'Reminder',
      day14Title: 'Final notice',
      yesPaid: 'Yes, paid',
      notYet: 'Not yet',
      markForgiven: 'Forgive debt',
      pendingCount: (count: number) => `${count} pending debts`,
      daysAgo: (days: number) => `${days} days ago`,
      daysAgoShort: (days: number) => `${days} days ago`,
      paidQuestion: (name: string, amount: number, currency: string) => `Has ${name} paid you ${currency === 'MXN' ? '$' : 'USD '}${amount}?`,
      paidQuestionEn: (name: string, amount: number, currency: string) => `Has ${name} paid you ${currency === 'MXN' ? '$' : 'USD '}${amount}?`
    },
    error: {
      title: 'Error',
      default: 'Something went wrong. Try again.',
      quotaExceeded: 'Usage limit reached. Try again later.',
      apiKey: 'API key issue. Using alternative message.',
      network: 'No internet connection. Using local message.',
      generateFailed: 'Failed to generate message. Try again.',
      timeout: 'AI took too long to respond. Try again.'
    },
    tones: {
      free: 'Free Tones',
      premium: 'Premium Executors',
      premiumDesc: 'Maximize your collection chances with ultra-persuasive, high-impact personalities.',
      exclusivePro: 'PRO Exclusive',
      unlock: 'Unlock',
      active: 'Active',
      corporativo: {
        name: 'Corporate',
        description: 'HR Email Style',
        tagline: 'Your debt is our fiscal priority.'
      },
      mafioso: {
        name: 'Mob Boss',
        description: 'The Godfather speaks',
        tagline: 'I have offers you cannot refuse.'
      },
      dramatico: {
        name: 'Dramatic',
        description: 'Mexican Telenovela',
        tagline: 'How could you do this to me?'
      },
      poeta: {
        name: 'Poet',
        description: 'Romantic verses',
        tagline: 'Debt is a verse without rhyme.'
      },
      nerdy: {
        name: 'Nerdy',
        description: 'Error 404: Payment not found',
        tagline: 'Error 404: Dignity not found.'
      },
      yogi: {
        name: 'Yogi Zen',
        description: 'Namaste... but pay',
        tagline: 'Namaste... but pay up.'
      },
      abuela: {
        name: 'Grandma',
        description: 'The whole neighborhood knows',
        tagline: 'You disappoint me, son. Pay now.'
      },
      abogado: {
        name: 'Lawyer',
        description: 'Legal terms',
        tagline: 'Legal terms you should know.'
      },
      chef: {
        name: 'Chef',
        description: 'RAW!',
        tagline: 'RAW! Your excuse is undercooked!'
      },
      influencer: {
        name: 'Influencer',
        description: 'Hey bestie 💕',
        tagline: 'Hey bestie 💕 do not leave me on flop.'
      },
      motivacional: {
        name: 'Motivational',
        description: 'Discipline = paying',
        tagline: 'Discipline = paying. Mindset.'
      },
      alien: {
        name: 'Alien',
        description: 'Humans and their debts',
        tagline: 'Earth currency required immediately.'
      },
      profesor: {
        name: 'The Professor',
        description: 'Masterclass in finance',
        tagline: 'Let us do an exercise on liquidity...'
      },
      coach: {
        name: 'Motivational Coach',
        description: 'Tony Robbins of collections',
        tagline: 'Visualize that money flowing into your life!'
      },
      abogado_chicano: {
        name: 'Chicano Lawyer',
        description: 'Saul Goodman style',
        tagline: 'According to article 247 of the bro code...'
      },
      asmr: {
        name: 'ASMR',
        description: 'Relaxing but firm whispers',
        tagline: '*whisper* I need you to pay... *whisper*'
      },
      chaman: {
        name: 'Spiritual Guide',
        description: 'Energies, karma and chakras',
        tagline: 'The universe is telling me I need that money...'
      },
      fitness: {
        name: 'Gym Bro',
        description: 'No pain, no gain',
        tagline: 'Do not let your wallet skip that payment!'
      },
      chef_pesado: {
        name: 'Harsh Chef',
        description: 'Extreme Gordon Ramsay',
        tagline: 'THAT PAYMENT IS RAW! RAW!'
      },
      politico: {
        name: 'Politician',
        description: 'Many words, nothing clear',
        tagline: 'In these historic times we live in...'
      },
      rapero: {
        name: 'Rapper',
        description: 'With rhymes and flow',
        tagline: 'I do not want drama, just my pay, no fail...'
      },
      abuela_sabia: {
        name: 'Wise Grandma',
        description: 'Life and collection advice',
        tagline: 'Son, in my day we paid the same day...'
      },
      ia: {
        name: 'AI Robot',
        description: 'ChatGPT style, very technical',
        tagline: 'Processing transfer request...'
      },
      narcotelenovela: {
        name: 'Narco Soap Opera',
        description: 'Mexican narco telenovela',
        tagline: 'Do you know who you are messing with? Pay.'
      }
    },
    gemini: {
      prompts: {
        light: 'Friendly, no pressure, almost a friendly reminder. Soft joke, no one gets offended. Tone: innocent and fun.',
        balanced: 'Sarcastic but funny. Viral hook: make the receiver want to know what app was used. Tone: funny, gif-worthy.',
        spicy: 'Acidic, soft roast. For friends who can take heavy jokes. Tone: almost threatening but as a joke.'
      },
      systemPrompt: 'Generate a WhatsApp message to collect a debt.'
    },
    billing: {
      monthly: 'Monthly',
      annual: 'Annual',
      save: 'Save',
      perYear: '/year',
      perMonth: '/month',
      or: 'or',
      year: 'year'
    },
    ui: {
      previewBadge: 'Preview',
      urgent: 'URGENT',
      qrTitle: 'Payment QR Code',
      download: 'DOWNLOAD',
      footer: 'Generated with ElCobrador.app',
      newCollection: 'Create new collection',
      back: 'Back',
      generating: 'Generating message...',
      qrGenerating: 'Generating...',
      whatsapp: 'WhatsApp',
      chooseExecutor: 'Choose your',
      executor: 'executor',
      collectionStyle: 'Select the personality that best fits your collection style today.',
      freeTones: 'Free Tones',
      premiumExecutors: 'Premium Executors',
      proBadge: 'PRO'
    }
  }
};

export type Translations = typeof translations.es;
