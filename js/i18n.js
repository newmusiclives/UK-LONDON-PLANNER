/* ============================================================
   I18N — Multi-language support for London & UK Planner
   Supports: English (default), Spanish, French, German
   ============================================================ */

const I18N = {
  currentLang: localStorage.getItem('siteLang') || 'en',
  supportedLangs: ['en', 'es', 'fr', 'de'],

  translations: {
    en: {
      // Navigation
      'nav.demo': 'Demo',
      'nav.guide': 'Guide',
      'nav.neighbourhoods': 'Neighbourhoods',
      'nav.whatsOn': "What's On",
      'nav.bookServices': 'Book Services',
      'nav.consultation': 'Consultation',
      'nav.myTrips': 'My Trips',
      'nav.planMyTrip': 'Plan My Trip',
      'nav.toggleMenu': 'Toggle navigation menu',

      // Footer — column titles
      'footer.plan': 'Plan',
      'footer.explore': 'Explore',
      'footer.support': 'Support',

      // Footer — Plan links
      'footer.createItinerary': 'Create Itinerary',
      'footer.expertConsultation': 'Expert Consultation',
      'footer.airportTransfers': 'Airport Transfers',
      'footer.pricing': 'Pricing',
      'footer.howItWorks': 'How It Works',

      // Footer — Explore links
      'footer.sampleItinerary': 'Sample Itinerary',
      'footer.travelGuide': 'Travel Guide',
      'footer.neighbourhoodGuides': 'Neighbourhood Guides',
      'footer.whatsOnLondon': "What's On in London",
      'footer.dayTrips': 'Day Trips from London',
      'footer.travelTips': 'Travel Tips',
      'footer.gettingAround': 'Getting Around',
      'footer.bestTimeToVisit': 'Best Time to Visit',

      // Footer — Support links
      'footer.contactUs': 'Contact Us',
      'footer.faq': 'FAQ',
      'footer.privacyPolicy': 'Privacy Policy',
      'footer.termsOfService': 'Terms of Service',

      // Footer — description & email capture
      'footer.desc': 'Expertly curated London itineraries tailored to your interests, budget, and travel style. Your perfect London adventure starts here.',
      'footer.shareYourMoments': 'Share Your London Moments',
      'footer.tagUs': 'Tag <strong style="color:var(--color-accent);">#MyLondonPlanner</strong> on Instagram for a chance to be featured',
      'footer.galleryComingSoon': 'Photo gallery coming soon — share your photos and we\'ll feature the best ones!',

      // Email capture
      'email.headline': 'Get 3 Free London Insider Tips',
      'email.subheadline': 'Join 5,000+ travellers who get our best London secrets',
      'email.placeholder': 'Enter your email',
      'email.cta': 'Get Free Tips',
      'email.disclaimer': 'No spam. Unsubscribe anytime.',

      // Currency & language
      'currency.selectLabel': 'Select currency',
      'lang.selectLabel': 'Select language',

      // Pricing
      'pricing.title': 'Simple, Transparent Pricing',
      'pricing.subtitle': 'Preview 2 days free, then unlock your complete itinerary',
      'pricing.shortStay': 'Short Stay',
      'pricing.weekExplorer': 'Week Explorer',
      'pricing.extendedAdventure': 'Extended Adventure',
      'pricing.getStarted': 'Get Started',
      'pricing.days': 'days',
      'pricing.personalised': 'Personalised to your interests',
      'pricing.restaurantPicks': 'Restaurant & pub picks',
      'pricing.insiderTips': 'Insider tips & secrets',
      'pricing.downloadablePdf': 'Downloadable PDF guide',
      'pricing.dayTrips': 'Day-trip recommendations',
      'pricing.hiddenGems': 'Hidden gems & local favourites',

      // Chat assistant
      'chat.title': 'London Assistant',
      'chat.placeholder': 'Ask about London...',
      'chat.send': 'Send',
      'chat.bestRestaurants': 'Best restaurants',
      'chat.freeThings': 'Free things to do',
      'chat.nightlife': 'Nightlife spots',
      'chat.familyActivities': 'Family activities',
      'chat.hiddenGems': 'Hidden gems',

      // Wizard
      'wizard.planYourTrip': 'Plan Your Trip',
      'wizard.howManyDays': 'How many days in London?',
      'wizard.occasion': "What's the occasion?",
      'wizard.whoTravelling': "Who's travelling?",
      'wizard.budget': "What's your budget?",
      'wizard.interests': 'What interests you?',
      'wizard.review': 'Review your trip',

      // Actions
      'action.bookNow': 'Book Now',
      'action.readMore': 'Read More',
      'action.view': 'View',
      'action.download': 'Download',
      'action.share': 'Share',
      'action.delete': 'Delete',
      'action.save': 'Save',
      'action.continue': 'Continue',
      'action.back': 'Back',
      'action.next': 'Next'
    },

    es: {
      // Navigation
      'nav.demo': 'Demo',
      'nav.guide': 'Guia',
      'nav.neighbourhoods': 'Barrios',
      'nav.whatsOn': 'Agenda',
      'nav.bookServices': 'Reservar Servicios',
      'nav.consultation': 'Consulta',
      'nav.myTrips': 'Mis Viajes',
      'nav.planMyTrip': 'Planificar Mi Viaje',
      'nav.toggleMenu': 'Alternar menu de navegacion',

      // Footer — column titles
      'footer.plan': 'Planificar',
      'footer.explore': 'Explorar',
      'footer.support': 'Soporte',

      // Footer — Plan links
      'footer.createItinerary': 'Crear Itinerario',
      'footer.expertConsultation': 'Consulta con Experto',
      'footer.airportTransfers': 'Traslados al Aeropuerto',
      'footer.pricing': 'Precios',
      'footer.howItWorks': 'Como Funciona',

      // Footer — Explore links
      'footer.sampleItinerary': 'Itinerario de Ejemplo',
      'footer.travelGuide': 'Guia de Viaje',
      'footer.neighbourhoodGuides': 'Guias de Barrios',
      'footer.whatsOnLondon': 'Agenda en Londres',
      'footer.dayTrips': 'Excursiones desde Londres',
      'footer.travelTips': 'Consejos de Viaje',
      'footer.gettingAround': 'Como Moverse',
      'footer.bestTimeToVisit': 'Mejor Epoca para Visitar',

      // Footer — Support links
      'footer.contactUs': 'Contactenos',
      'footer.faq': 'Preguntas Frecuentes',
      'footer.privacyPolicy': 'Politica de Privacidad',
      'footer.termsOfService': 'Terminos de Servicio',

      // Footer — description & email capture
      'footer.desc': 'Itinerarios de Londres seleccionados por expertos, adaptados a tus intereses, presupuesto y estilo de viaje. Tu aventura perfecta en Londres comienza aqui.',
      'footer.shareYourMoments': 'Comparte Tus Momentos en Londres',
      'footer.tagUs': 'Etiqueta <strong style="color:var(--color-accent);">#MyLondonPlanner</strong> en Instagram para tener la oportunidad de ser destacado',
      'footer.galleryComingSoon': 'Galeria de fotos proximamente. Comparte tus fotos y destacaremos las mejores.',

      // Email capture
      'email.headline': 'Recibe 3 Consejos Gratuitos sobre Londres',
      'email.subheadline': 'Unete a mas de 5,000 viajeros que reciben nuestros mejores secretos de Londres',
      'email.placeholder': 'Ingresa tu correo electronico',
      'email.cta': 'Obtener Consejos Gratis',
      'email.disclaimer': 'Sin spam. Cancela cuando quieras.',

      // Currency & language
      'currency.selectLabel': 'Seleccionar moneda',
      'lang.selectLabel': 'Seleccionar idioma',

      // Pricing
      'pricing.title': 'Precios Simples y Transparentes',
      'pricing.subtitle': 'Vista previa de 2 dias gratis, luego desbloquea tu itinerario completo',
      'pricing.shortStay': 'Estancia Corta',
      'pricing.weekExplorer': 'Explorador Semanal',
      'pricing.extendedAdventure': 'Aventura Extendida',
      'pricing.getStarted': 'Comenzar',
      'pricing.days': 'dias',
      'pricing.personalised': 'Personalizado a tus intereses',
      'pricing.restaurantPicks': 'Seleccion de restaurantes y pubs',
      'pricing.insiderTips': 'Consejos y secretos locales',
      'pricing.downloadablePdf': 'Guia PDF descargable',
      'pricing.dayTrips': 'Recomendaciones de excursiones',
      'pricing.hiddenGems': 'Joyas escondidas y favoritos locales',

      // Chat assistant
      'chat.title': 'Asistente de Londres',
      'chat.placeholder': 'Pregunta sobre Londres...',
      'chat.send': 'Enviar',
      'chat.bestRestaurants': 'Mejores restaurantes',
      'chat.freeThings': 'Cosas gratis para hacer',
      'chat.nightlife': 'Vida nocturna',
      'chat.familyActivities': 'Actividades familiares',
      'chat.hiddenGems': 'Joyas escondidas',

      // Wizard
      'wizard.planYourTrip': 'Planifica Tu Viaje',
      'wizard.howManyDays': 'Cuantos dias en Londres?',
      'wizard.occasion': 'Cual es la ocasion?',
      'wizard.whoTravelling': 'Quien viaja?',
      'wizard.budget': 'Cual es tu presupuesto?',
      'wizard.interests': 'Que te interesa?',
      'wizard.review': 'Revisa tu viaje',

      // Actions
      'action.bookNow': 'Reservar Ahora',
      'action.readMore': 'Leer Mas',
      'action.view': 'Ver',
      'action.download': 'Descargar',
      'action.share': 'Compartir',
      'action.delete': 'Eliminar',
      'action.save': 'Guardar',
      'action.continue': 'Continuar',
      'action.back': 'Atras',
      'action.next': 'Siguiente'
    },

    fr: {
      // Navigation
      'nav.demo': 'Demo',
      'nav.guide': 'Guide',
      'nav.neighbourhoods': 'Quartiers',
      'nav.whatsOn': 'Agenda',
      'nav.bookServices': 'Reserver',
      'nav.consultation': 'Consultation',
      'nav.myTrips': 'Mes Voyages',
      'nav.planMyTrip': 'Planifier Mon Voyage',
      'nav.toggleMenu': 'Basculer le menu de navigation',

      // Footer — column titles
      'footer.plan': 'Planifier',
      'footer.explore': 'Explorer',
      'footer.support': 'Assistance',

      // Footer — Plan links
      'footer.createItinerary': 'Creer un Itineraire',
      'footer.expertConsultation': 'Consultation Expert',
      'footer.airportTransfers': "Transferts Aeroport",
      'footer.pricing': 'Tarifs',
      'footer.howItWorks': 'Comment Ca Marche',

      // Footer — Explore links
      'footer.sampleItinerary': 'Itineraire Exemple',
      'footer.travelGuide': 'Guide de Voyage',
      'footer.neighbourhoodGuides': 'Guides des Quartiers',
      'footer.whatsOnLondon': 'Agenda a Londres',
      'footer.dayTrips': 'Excursions depuis Londres',
      'footer.travelTips': 'Conseils de Voyage',
      'footer.gettingAround': 'Se Deplacer',
      'footer.bestTimeToVisit': 'Meilleure Periode pour Visiter',

      // Footer — Support links
      'footer.contactUs': 'Contactez-nous',
      'footer.faq': 'FAQ',
      'footer.privacyPolicy': 'Politique de Confidentialite',
      'footer.termsOfService': 'Conditions de Service',

      // Footer — description & email capture
      'footer.desc': "Itineraires londoniens selectionnes par des experts, adaptes a vos centres d'interet, budget et style de voyage. Votre aventure londonienne parfaite commence ici.",
      'footer.shareYourMoments': 'Partagez Vos Moments Londoniens',
      'footer.tagUs': 'Taguez <strong style="color:var(--color-accent);">#MyLondonPlanner</strong> sur Instagram pour avoir une chance d\'etre mis en avant',
      'footer.galleryComingSoon': 'Galerie photo bientot disponible. Partagez vos photos et nous mettrons en avant les meilleures !',

      // Email capture
      'email.headline': '3 Conseils Gratuits sur Londres',
      'email.subheadline': 'Rejoignez plus de 5 000 voyageurs qui recoivent nos meilleurs secrets londoniens',
      'email.placeholder': 'Entrez votre email',
      'email.cta': 'Obtenir les Conseils',
      'email.disclaimer': 'Pas de spam. Desabonnement a tout moment.',

      // Currency & language
      'currency.selectLabel': 'Choisir la devise',
      'lang.selectLabel': 'Choisir la langue',

      // Pricing
      'pricing.title': 'Tarifs Simples et Transparents',
      'pricing.subtitle': 'Apercu de 2 jours gratuit, puis debloquez votre itineraire complet',
      'pricing.shortStay': 'Court Sejour',
      'pricing.weekExplorer': 'Explorateur Semaine',
      'pricing.extendedAdventure': 'Aventure Prolongee',
      'pricing.getStarted': 'Commencer',
      'pricing.days': 'jours',
      'pricing.personalised': 'Personnalise selon vos interets',
      'pricing.restaurantPicks': 'Selection de restaurants et pubs',
      'pricing.insiderTips': 'Conseils et secrets locaux',
      'pricing.downloadablePdf': 'Guide PDF telechargeable',
      'pricing.dayTrips': 'Recommandations d\'excursions',
      'pricing.hiddenGems': 'Perles cachees et adresses locales',

      // Chat assistant
      'chat.title': 'Assistant Londres',
      'chat.placeholder': 'Posez une question sur Londres...',
      'chat.send': 'Envoyer',
      'chat.bestRestaurants': 'Meilleurs restaurants',
      'chat.freeThings': 'Activites gratuites',
      'chat.nightlife': 'Vie nocturne',
      'chat.familyActivities': 'Activites en famille',
      'chat.hiddenGems': 'Perles cachees',

      // Wizard
      'wizard.planYourTrip': 'Planifiez Votre Voyage',
      'wizard.howManyDays': 'Combien de jours a Londres ?',
      'wizard.occasion': "Quelle est l'occasion ?",
      'wizard.whoTravelling': 'Qui voyage ?',
      'wizard.budget': 'Quel est votre budget ?',
      'wizard.interests': 'Qu\'est-ce qui vous interesse ?',
      'wizard.review': 'Verifiez votre voyage',

      // Actions
      'action.bookNow': 'Reserver',
      'action.readMore': 'En Savoir Plus',
      'action.view': 'Voir',
      'action.download': 'Telecharger',
      'action.share': 'Partager',
      'action.delete': 'Supprimer',
      'action.save': 'Enregistrer',
      'action.continue': 'Continuer',
      'action.back': 'Retour',
      'action.next': 'Suivant'
    },

    de: {
      // Navigation
      'nav.demo': 'Demo',
      'nav.guide': 'Reisefuhrer',
      'nav.neighbourhoods': 'Stadtviertel',
      'nav.whatsOn': 'Veranstaltungen',
      'nav.bookServices': 'Services Buchen',
      'nav.consultation': 'Beratung',
      'nav.myTrips': 'Meine Reisen',
      'nav.planMyTrip': 'Meine Reise Planen',
      'nav.toggleMenu': 'Navigationsmenu umschalten',

      // Footer — column titles
      'footer.plan': 'Planen',
      'footer.explore': 'Entdecken',
      'footer.support': 'Hilfe',

      // Footer — Plan links
      'footer.createItinerary': 'Reiseplan Erstellen',
      'footer.expertConsultation': 'Expertenberatung',
      'footer.airportTransfers': 'Flughafentransfers',
      'footer.pricing': 'Preise',
      'footer.howItWorks': 'So Funktioniert Es',

      // Footer — Explore links
      'footer.sampleItinerary': 'Beispiel-Reiseplan',
      'footer.travelGuide': 'Reisefuhrer',
      'footer.neighbourhoodGuides': 'Stadtviertel-Fuhrer',
      'footer.whatsOnLondon': 'Veranstaltungen in London',
      'footer.dayTrips': 'Tagesausfluge ab London',
      'footer.travelTips': 'Reisetipps',
      'footer.gettingAround': 'Fortbewegung',
      'footer.bestTimeToVisit': 'Beste Reisezeit',

      // Footer — Support links
      'footer.contactUs': 'Kontakt',
      'footer.faq': 'FAQ',
      'footer.privacyPolicy': 'Datenschutzrichtlinie',
      'footer.termsOfService': 'Nutzungsbedingungen',

      // Footer — description & email capture
      'footer.desc': 'Von Experten kuratierte London-Reiserouten, abgestimmt auf Ihre Interessen, Ihr Budget und Ihren Reisestil. Ihr perfektes London-Abenteuer beginnt hier.',
      'footer.shareYourMoments': 'Teilen Sie Ihre London-Momente',
      'footer.tagUs': 'Taggen Sie <strong style="color:var(--color-accent);">#MyLondonPlanner</strong> auf Instagram fur die Chance, vorgestellt zu werden',
      'footer.galleryComingSoon': 'Fotogalerie kommt bald. Teilen Sie Ihre Fotos und wir zeigen die besten!',

      // Email capture
      'email.headline': '3 Kostenlose London-Insider-Tipps',
      'email.subheadline': 'Schliessen Sie sich uber 5.000 Reisenden an, die unsere besten London-Geheimnisse erhalten',
      'email.placeholder': 'E-Mail-Adresse eingeben',
      'email.cta': 'Kostenlose Tipps Erhalten',
      'email.disclaimer': 'Kein Spam. Jederzeit abbestellbar.',

      // Currency & language
      'currency.selectLabel': 'Wahrung wahlen',
      'lang.selectLabel': 'Sprache wahlen',

      // Pricing
      'pricing.title': 'Einfache, Transparente Preise',
      'pricing.subtitle': '2 Tage kostenlos testen, dann Ihren vollstandigen Reiseplan freischalten',
      'pricing.shortStay': 'Kurzaufenthalt',
      'pricing.weekExplorer': 'Wochen-Entdecker',
      'pricing.extendedAdventure': 'Erweitertes Abenteuer',
      'pricing.getStarted': 'Loslegen',
      'pricing.days': 'Tage',
      'pricing.personalised': 'Auf Ihre Interessen abgestimmt',
      'pricing.restaurantPicks': 'Restaurant- & Pub-Empfehlungen',
      'pricing.insiderTips': 'Insider-Tipps & Geheimnisse',
      'pricing.downloadablePdf': 'Herunterladbarer PDF-Reisefuhrer',
      'pricing.dayTrips': 'Tagesausflugs-Empfehlungen',
      'pricing.hiddenGems': 'Geheimtipps & lokale Favoriten',

      // Chat assistant
      'chat.title': 'London-Assistent',
      'chat.placeholder': 'Fragen Sie uber London...',
      'chat.send': 'Senden',
      'chat.bestRestaurants': 'Beste Restaurants',
      'chat.freeThings': 'Kostenlose Aktivitaten',
      'chat.nightlife': 'Nachtleben',
      'chat.familyActivities': 'Familienaktivitaten',
      'chat.hiddenGems': 'Geheimtipps',

      // Wizard
      'wizard.planYourTrip': 'Planen Sie Ihre Reise',
      'wizard.howManyDays': 'Wie viele Tage in London?',
      'wizard.occasion': 'Was ist der Anlass?',
      'wizard.whoTravelling': 'Wer reist?',
      'wizard.budget': 'Was ist Ihr Budget?',
      'wizard.interests': 'Was interessiert Sie?',
      'wizard.review': 'Reise uberprufen',

      // Actions
      'action.bookNow': 'Jetzt Buchen',
      'action.readMore': 'Mehr Lesen',
      'action.view': 'Ansehen',
      'action.download': 'Herunterladen',
      'action.share': 'Teilen',
      'action.delete': 'Loschen',
      'action.save': 'Speichern',
      'action.continue': 'Weiter',
      'action.back': 'Zuruck',
      'action.next': 'Weiter'
    }
  },

  /**
   * Initialise the i18n system.
   * Detects browser language or uses saved preference, updates the HTML lang attribute.
   */
  init() {
    // If no saved preference, try to detect from browser
    if (!localStorage.getItem('siteLang')) {
      const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
      if (this.supportedLangs.includes(browserLang)) {
        this.currentLang = browserLang;
      }
    }
    document.documentElement.lang = this.currentLang;
  },

  /**
   * Get a translated string. Falls back to English if the key is missing.
   * @param {string} key — dot-notated translation key, e.g. 'nav.demo'
   * @returns {string}
   */
  t(key) {
    const langStrings = this.translations[this.currentLang];
    if (langStrings && langStrings[key] !== undefined) {
      return langStrings[key];
    }
    // Fallback to English
    const enStrings = this.translations.en;
    if (enStrings && enStrings[key] !== undefined) {
      return enStrings[key];
    }
    // If key not found at all, return the key itself
    return key;
  },

  /**
   * Switch language, save to localStorage, and reload the page to update UI.
   * @param {string} lang — language code ('en', 'es', 'fr', 'de')
   */
  setLang(lang) {
    if (!this.supportedLangs.includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem('siteLang', lang);
    document.documentElement.lang = lang;
    // Re-render header and footer with new language
    if (typeof UI !== 'undefined') {
      UI.renderHeader();
      UI.renderFooter();
      UI.initMobileNav();
    }
  },

  /**
   * Returns HTML for a language selector dropdown.
   * @returns {string}
   */
  renderLanguageSelector() {
    const langs = [
      { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', name: 'English' },
      { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', name: 'Espanol' },
      { code: 'fr', flag: '\u{1F1EB}\u{1F1F7}', name: 'Francais' },
      { code: 'de', flag: '\u{1F1E9}\u{1F1EA}', name: 'Deutsch' }
    ];
    const options = langs.map(l =>
      `<option value="${l.code}" ${l.code === this.currentLang ? 'selected' : ''}>${l.flag} ${l.name}</option>`
    ).join('');
    return `<select id="lang-select" aria-label="${this.t('lang.selectLabel')}" style="background:rgba(255,255,255,0.1);border:1px solid rgba(201,168,76,0.3);color:var(--color-accent);padding:0.4rem 0.5rem;border-radius:var(--radius-md);font-size:0.8rem;cursor:pointer;">${options}</select>`;
  }
};
