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
      dailyLimit: 'Límite diario'
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
      pendingCount: (count: number) => `${count} deudas pendientes`
    },
    error: {
      title: 'Error',
      default: 'Algo salió mal. Intenta de nuevo.'
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
      dailyLimit: 'Daily limit'
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
      pendingCount: (count: number) => `${count} pending debts`
    },
    error: {
      title: 'Error',
      default: 'Something went wrong. Try again.'
    }
  }
};

export type Translations = typeof translations.es;
