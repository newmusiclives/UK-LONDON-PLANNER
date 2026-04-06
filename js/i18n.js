/* ============================================================
   I18N — Multi-language support for UK & London Planner
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
      'nav.myTrips': 'My Trips',
      'nav.planMyTrip': 'Plan My Trip',
      'nav.toggleMenu': 'Toggle navigation menu',

      // Footer — column titles
      'footer.plan': 'Plan',
      'footer.explore': 'Explore',
      'footer.support': 'Support',

      // Footer — Plan links
      'footer.createItinerary': 'Create Itinerary',
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
      'action.next': 'Next',

      // Home page
      'home.badge': 'Trusted by 2,000+ travellers',
      'home.title': 'Your Perfect <span>London</span> Trip, Planned by Experts',
      'home.subtitle': 'Tell us your interests, budget, and travel dates. We\'ll create a personalised day-by-day itinerary packed with insider tips and hidden gems.',
      'home.cta': 'Plan My Trip — From $50',
      'home.ctaSecondary': 'See How It Works',
      'home.statAttractions': 'Attractions',
      'home.statRestaurants': 'Restaurants',
      'home.statPubs': 'Pubs & Bars',
      'home.statCafes': 'Cafes',
      'home.statThemes': 'Day Themes',
      'home.howTitle': 'How It Works',
      'home.howSubtitle': 'Three simple steps to your dream London itinerary',
      'home.step1Title': 'Tell Us About You',
      'home.step1Desc': 'Select your trip length, budget range, and interests — from history and food to nightlife and art.',
      'home.step2Title': 'Get Your Itinerary',
      'home.step2Desc': 'Our engine creates a personalised day-by-day plan with morning, afternoon, and evening activities.',
      'home.step3Title': 'Explore London',
      'home.step3Desc': 'Unlock your full guide with booking links, insider tips, a downloadable PDF, and money-saving secrets.',
      'home.sampleTitle': 'Sample Day: Royal London & Westminster',
      'home.sampleSubtitle': 'Here\'s a taste of what your personalised itinerary looks like',
      'home.sampleMorning': 'Explore nearly 1,000 years of royal history, see the Crown Jewels, and meet the Beefeaters. Arrive early to beat the crowds.',
      'home.sampleLunch': 'Outstanding handmade pasta at unbeatable prices. The pappardelle with 8-hour beef shin ragu is extraordinary.',
      'home.sampleAfternoon': 'Gothic masterpiece and coronation church since 1066. Walk along the Thames to see Big Ben and Parliament up close.',
      'home.sampleDinner': 'London\'s oldest restaurant (est. 1798). Traditional British fare in opulent Edwardian surroundings. The steak and kidney pie is legendary.',
      'home.sampleEvening': 'London\'s oldest wine bar, hidden in a candlelit cave. Atmospheric, romantic, and unmissable. Arrive early for a spot.',
      'home.seeDemo': 'See Full 5-Day Demo',
      'home.createItinerary': 'Create My Personalised Itinerary',
      'home.ukTitle': 'Go Beyond London',
      'home.ukSubtitle': 'Add extra days to explore the best of the UK — historic cities, stunning coastline, and breathtaking countryside',
      'home.ukCities': 'Historic Cities',
      'home.ukCitiesDesc': 'Edinburgh, Bath, York, Oxford, Cambridge, Liverpool',
      'home.ukCoastal': 'Coastal Escapes',
      'home.ukCoastalDesc': 'Cornwall, Brighton, Jurassic Coast, Whitby',
      'home.ukCountryside': 'Countryside',
      'home.ukCountrysideDesc': 'Cotswolds, Lake District, Scottish Highlands',
      'home.ukCultural': 'Cultural',
      'home.ukCulturalDesc': 'Stratford-upon-Avon, Stonehenge, Windsor Castle',
      'home.ukCta': 'Plan London + UK Trip',
      'home.ukPrice': 'UK extension from $50 extra',
      'home.reviewsTitle': 'What Travellers Say',
      'home.finalTitle': 'Ready to Plan Your London Adventure?',
      'home.finalSubtitle': 'Join thousands of travellers who\'ve discovered their perfect London trip with our personalised itineraries.',
      'home.finalCta': 'Start Planning Now',

      // Book-services page
      'services.heroTitle': 'Book Everything for Your Trip',
      'services.heroSubtitle': 'Flights, hotels, car hire, transfers, insurance, and more — all the services you need, from trusted partners with the best prices',
      'services.essentialTitle': 'Essential Travel Services',
      'services.essentialSubtitle': 'Everything you need to complete your London & UK trip',
      'services.flightsTitle': 'Flights to London',
      'services.flightsDesc': 'Compare prices across 100+ airlines. Find the cheapest flights to Heathrow, Gatwick, Stansted, Luton, or London City.',
      'services.hotelsTitle': 'Hotels & Accommodation',
      'services.hotelsDesc': 'From budget hostels to 5-star luxury. Free cancellation on most rooms. Best price guarantee.',
      'services.transfersTitle': 'Airport Transfers',
      'services.transfersDesc': 'Pre-book your airport pickup. Private car, shared shuttle, or train tickets. Fixed prices, no surprises.',
      'services.carTitle': 'Car Hire',
      'services.carDesc': 'Essential for the Cotswolds, Lake District, and Scottish Highlands. Compare all major providers at every UK airport.',
      'services.trainTitle': 'UK Train Tickets',
      'services.trainDesc': 'Book advance tickets for the best prices. London to Edinburgh, Bath, Oxford, and all UK destinations.',
      'services.eurostarTitle': 'Eurostar to London',
      'services.eurostarDesc': 'High-speed train from Paris, Brussels, or Amsterdam direct to London St Pancras. 2hr 15min from Paris.',
      'services.essentialsTitle': 'Travel Essentials',
      'services.essentialsSubtitle': 'Don\'t leave home without these',
      'services.insuranceTitle': 'Travel Insurance',
      'services.insuranceDesc': 'Medical emergencies, trip cancellations, lost luggage, and theft. Policies from just $4/day.',
      'services.esimTitle': 'UK eSIM / Data',
      'services.esimDesc': 'Stay connected without roaming charges. Instant eSIM activation — works the moment you land. From $5 for 1GB.',
      'services.moneyTitle': 'Travel Money Card',
      'services.moneyDesc': 'Best exchange rates, free ATM withdrawals, and no foreign transaction fees. Essential for UK travel.',
      'services.experiencesTitle': 'Experiences & Guides',
      'services.experiencesSubtitle': 'Make your trip unforgettable with expert-led experiences',
      'services.attractionsTitle': 'Attraction Tickets',
      'services.attractionsDesc': 'Skip-the-line tickets for every major London attraction. Book in advance and save up to 20%.',
      'services.theatreTitle': 'West End Theatre',
      'services.theatreDesc': 'Book West End shows at the best prices. Last-minute deals and advance bookings available.',
      'services.passTitle': 'London Pass / Go City',
      'services.passDesc': 'All-inclusive or explorer passes covering 80+ attractions. Save up to 50% vs buying individually.',
      'services.expertTitle': 'Expert & Concierge Services',
      'services.expertSubtitle': 'Let trusted local experts handle the planning and bookings for you',
      'services.conciergeTitle': 'Trip Planning & Concierge',
      'services.conciergeDesc': 'Let a London local plan and book everything for you — restaurants, attractions, theatre tickets, tours, and hidden gems. Share your dates and interests, they handle the rest.',
      'services.talkTitle': 'Talk to a London Expert',
      'services.talkDesc': 'Book a private video call with a vetted London expert. Get personalised advice, insider tips, restaurant picks, and a customised plan for your trip.',
      'services.guideTitle': 'Private London Guide',
      'services.guideDesc': 'Hire an experienced local guide to accompany you for the day. They\'ll navigate, share stories, unlock hidden spots, and make your trip unforgettable.',
      'services.bottomTitle': 'Need help planning everything?',
      'services.bottomSubtitle': 'Start with a personalised itinerary and we\'ll help you book the rest.',
      'services.bottomCta': 'Plan My Trip',
      'btn.searchHotels': 'Search Hotels',
      'btn.viewAllOptions': 'View All Options',
      'btn.compareCarHire': 'Compare Car Hire',
      'btn.bookTrainTickets': 'Book Train Tickets',
      'btn.bookEurostar': 'Book Eurostar',
      'btn.getEsim': 'Get UK eSIM',
      'btn.viewPasses': 'View London Passes',
      'btn.planMyTrip': 'Plan My Trip'
    },

    es: {
      // Navigation
      'nav.demo': 'Demo',
      'nav.guide': 'Guia',
      'nav.neighbourhoods': 'Barrios',
      'nav.whatsOn': 'Agenda',
      'nav.bookServices': 'Reservar Servicios',
      'nav.myTrips': 'Mis Viajes',
      'nav.planMyTrip': 'Planificar Mi Viaje',
      'nav.toggleMenu': 'Alternar menu de navegacion',

      // Footer — column titles
      'footer.plan': 'Planificar',
      'footer.explore': 'Explorar',
      'footer.support': 'Soporte',

      // Footer — Plan links
      'footer.createItinerary': 'Crear Itinerario',
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
      'action.next': 'Siguiente',

      // Home page
      'home.badge': 'Más de 2.000 viajeros confían en nosotros',
      'home.title': 'Tu viaje perfecto a <span>London</span>, planificado por expertos',
      'home.subtitle': 'Cuéntanos tus intereses, presupuesto y fechas de viaje. Crearemos un itinerario personalizado día a día con consejos exclusivos y joyas ocultas.',
      'home.cta': 'Planificar mi viaje — Desde $50',
      'home.ctaSecondary': 'Cómo funciona',
      'home.statAttractions': 'Atracciones',
      'home.statRestaurants': 'Restaurantes',
      'home.statPubs': 'Pubs y bares',
      'home.statCafes': 'Cafeterías',
      'home.statThemes': 'Temas del día',
      'home.howTitle': 'Cómo funciona',
      'home.howSubtitle': 'Tres pasos sencillos para tu itinerario soñado en London',
      'home.step1Title': 'Cuéntanos sobre ti',
      'home.step1Desc': 'Selecciona la duración de tu viaje, rango de presupuesto e intereses — desde historia y gastronomía hasta vida nocturna y arte.',
      'home.step2Title': 'Recibe tu itinerario',
      'home.step2Desc': 'Nuestro sistema crea un plan personalizado día a día con actividades para la mañana, la tarde y la noche.',
      'home.step3Title': 'Explora London',
      'home.step3Desc': 'Accede a tu guía completa con enlaces de reserva, consejos exclusivos, un PDF descargable y secretos para ahorrar.',
      'home.sampleTitle': 'Día de ejemplo: London real y Westminster',
      'home.sampleSubtitle': 'Una muestra de cómo será tu itinerario personalizado',
      'home.sampleMorning': 'Explora casi 1.000 años de historia real, contempla las Joyas de la Corona y conoce a los Beefeaters. Llega temprano para evitar las multitudes.',
      'home.sampleLunch': 'Pasta artesanal excepcional a precios inmejorables. Los pappardelle con ragú de jarrete de ternera cocinado durante 8 horas son extraordinarios.',
      'home.sampleAfternoon': 'Obra maestra gótica e iglesia de coronaciones desde 1066. Pasea por el Támesis para ver Big Ben y el Parlamento de cerca.',
      'home.sampleDinner': 'El restaurante más antiguo de London (desde 1798). Cocina británica tradicional en un opulento entorno eduardiano. El pastel de carne y riñón es legendario.',
      'home.sampleEvening': 'El bar de vinos más antiguo de London, escondido en una cueva iluminada con velas. Atmosférico, romántico e imperdible. Llega temprano para conseguir sitio.',
      'home.seeDemo': 'Ver demo completa de 5 días',
      'home.createItinerary': 'Crear mi itinerario personalizado',
      'home.ukTitle': 'Más allá de London',
      'home.ukSubtitle': 'Añade días extra para explorar lo mejor del Reino Unido — ciudades históricas, costa impresionante y paisajes espectaculares',
      'home.ukCities': 'Ciudades históricas',
      'home.ukCitiesDesc': 'Edinburgh, Bath, York, Oxford, Cambridge, Liverpool',
      'home.ukCoastal': 'Escapadas costeras',
      'home.ukCoastalDesc': 'Cornwall, Brighton, Jurassic Coast, Whitby',
      'home.ukCountryside': 'Campo',
      'home.ukCountrysideDesc': 'Cotswolds, Lake District, Scottish Highlands',
      'home.ukCultural': 'Cultural',
      'home.ukCulturalDesc': 'Stratford-upon-Avon, Stonehenge, Windsor Castle',
      'home.ukCta': 'Planificar viaje London + Reino Unido',
      'home.ukPrice': 'Extensión al Reino Unido desde $50 extra',
      'home.reviewsTitle': 'Opiniones de viajeros',
      'home.finalTitle': '¿Listo para planificar tu aventura en London?',
      'home.finalSubtitle': 'Únete a miles de viajeros que han descubierto su viaje perfecto a London con nuestros itinerarios personalizados.',
      'home.finalCta': 'Empezar a planificar',

      // Book-services page
      'services.heroTitle': 'Reserva todo para tu viaje',
      'services.heroSubtitle': 'Vuelos, hoteles, alquiler de coches, traslados, seguros y más — todos los servicios que necesitas, de socios de confianza con los mejores precios',
      'services.essentialTitle': 'Servicios de viaje esenciales',
      'services.essentialSubtitle': 'Todo lo que necesitas para completar tu viaje a London y el Reino Unido',
      'services.flightsTitle': 'Vuelos a London',
      'services.flightsDesc': 'Compara precios en más de 100 aerolíneas. Encuentra los vuelos más baratos a Heathrow, Gatwick, Stansted, Luton o London City.',
      'services.hotelsTitle': 'Hoteles y alojamiento',
      'services.hotelsDesc': 'Desde hostales económicos hasta lujo 5 estrellas. Cancelación gratuita en la mayoría de habitaciones. Garantía de mejor precio.',
      'services.transfersTitle': 'Traslados al aeropuerto',
      'services.transfersDesc': 'Reserva tu recogida en el aeropuerto. Coche privado, traslado compartido o billetes de tren. Precios fijos, sin sorpresas.',
      'services.carTitle': 'Alquiler de coches',
      'services.carDesc': 'Imprescindible para Cotswolds, Lake District y Scottish Highlands. Compara todos los proveedores principales en cada aeropuerto del Reino Unido.',
      'services.trainTitle': 'Billetes de tren en el Reino Unido',
      'services.trainDesc': 'Reserva billetes anticipados para los mejores precios. London a Edinburgh, Bath, Oxford y todos los destinos del Reino Unido.',
      'services.eurostarTitle': 'Eurostar a London',
      'services.eurostarDesc': 'Tren de alta velocidad desde París, Bruselas o Ámsterdam directo a London St Pancras. 2h 15min desde París.',
      'services.essentialsTitle': 'Esenciales de viaje',
      'services.essentialsSubtitle': 'No salgas de casa sin estos',
      'services.insuranceTitle': 'Seguro de viaje',
      'services.insuranceDesc': 'Emergencias médicas, cancelaciones, equipaje perdido y robos. Pólizas desde solo $4/día.',
      'services.esimTitle': 'eSIM / datos en el Reino Unido',
      'services.esimDesc': 'Mantente conectado sin cargos de roaming. Activación instantánea de eSIM — funciona en cuanto aterrices. Desde $5 por 1GB.',
      'services.moneyTitle': 'Tarjeta de viaje',
      'services.moneyDesc': 'Los mejores tipos de cambio, retiros en cajeros gratis y sin comisiones por transacciones en el extranjero. Imprescindible para viajar al Reino Unido.',
      'services.experiencesTitle': 'Experiencias y guías',
      'services.experiencesSubtitle': 'Haz tu viaje inolvidable con experiencias dirigidas por expertos',
      'services.attractionsTitle': 'Entradas a atracciones',
      'services.attractionsDesc': 'Entradas sin colas para todas las grandes atracciones de London. Reserva con antelación y ahorra hasta un 20%.',
      'services.theatreTitle': 'Teatro del West End',
      'services.theatreDesc': 'Reserva espectáculos del West End a los mejores precios. Ofertas de último minuto y reservas anticipadas disponibles.',
      'services.passTitle': 'London Pass / Go City',
      'services.passDesc': 'Pases todo incluido o exploradores que cubren más de 80 atracciones. Ahorra hasta un 50% comparado con la compra individual.',
      'services.expertTitle': 'Servicios de expertos y conserjería',
      'services.expertSubtitle': 'Deja que expertos locales de confianza se encarguen de la planificación y las reservas por ti',
      'services.conciergeTitle': 'Planificación y conserjería',
      'services.conciergeDesc': 'Deja que un londinense planifique y reserve todo por ti — restaurantes, atracciones, entradas de teatro, tours y joyas ocultas. Comparte tus fechas e intereses, ellos se encargan del resto.',
      'services.talkTitle': 'Habla con un experto en London',
      'services.talkDesc': 'Reserva una videollamada privada con un experto en London verificado. Recibe consejos personalizados, recomendaciones de restaurantes y un plan a medida para tu viaje.',
      'services.guideTitle': 'Guía privado en London',
      'services.guideDesc': 'Contrata a un guía local experimentado para acompañarte durante el día. Navegará por la ciudad, compartirá historias, descubrirá rincones ocultos y hará tu viaje inolvidable.',
      'services.bottomTitle': '¿Necesitas ayuda para planificarlo todo?',
      'services.bottomSubtitle': 'Empieza con un itinerario personalizado y te ayudaremos a reservar el resto.',
      'services.bottomCta': 'Planificar mi viaje',
      'btn.searchHotels': 'Buscar hoteles',
      'btn.viewAllOptions': 'Ver todas las opciones',
      'btn.compareCarHire': 'Comparar alquiler de coches',
      'btn.bookTrainTickets': 'Reservar billetes de tren',
      'btn.bookEurostar': 'Reservar Eurostar',
      'btn.getEsim': 'Obtener eSIM del Reino Unido',
      'btn.viewPasses': 'Ver pases de London',
      'btn.planMyTrip': 'Planificar mi viaje'
    },

    fr: {
      // Navigation
      'nav.demo': 'Demo',
      'nav.guide': 'Guide',
      'nav.neighbourhoods': 'Quartiers',
      'nav.whatsOn': 'Agenda',
      'nav.bookServices': 'Reserver',
      'nav.myTrips': 'Mes Voyages',
      'nav.planMyTrip': 'Planifier Mon Voyage',
      'nav.toggleMenu': 'Basculer le menu de navigation',

      // Footer — column titles
      'footer.plan': 'Planifier',
      'footer.explore': 'Explorer',
      'footer.support': 'Assistance',

      // Footer — Plan links
      'footer.createItinerary': 'Creer un Itineraire',
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
      'action.next': 'Suivant',

      // Home page
      'home.badge': 'Plus de 2 000 voyageurs nous font confiance',
      'home.title': 'Votre voyage parfait à <span>London</span>, planifié par des experts',
      'home.subtitle': 'Dites-nous vos centres d\'intérêt, votre budget et vos dates de voyage. Nous créerons un itinéraire personnalisé jour par jour avec des conseils d\'initiés et des trésors cachés.',
      'home.cta': 'Planifier mon voyage — À partir de $50',
      'home.ctaSecondary': 'Comment ça marche',
      'home.statAttractions': 'Attractions',
      'home.statRestaurants': 'Restaurants',
      'home.statPubs': 'Pubs et bars',
      'home.statCafes': 'Cafés',
      'home.statThemes': 'Thèmes du jour',
      'home.howTitle': 'Comment ça marche',
      'home.howSubtitle': 'Trois étapes simples vers votre itinéraire de rêve à London',
      'home.step1Title': 'Parlez-nous de vous',
      'home.step1Desc': 'Sélectionnez la durée de votre voyage, votre fourchette de budget et vos centres d\'intérêt — de l\'histoire et la gastronomie à la vie nocturne et l\'art.',
      'home.step2Title': 'Recevez votre itinéraire',
      'home.step2Desc': 'Notre système crée un plan personnalisé jour par jour avec des activités le matin, l\'après-midi et le soir.',
      'home.step3Title': 'Explorez London',
      'home.step3Desc': 'Accédez à votre guide complet avec des liens de réservation, des conseils d\'initiés, un PDF téléchargeable et des astuces pour économiser.',
      'home.sampleTitle': 'Journée type : London royal et Westminster',
      'home.sampleSubtitle': 'Voici un aperçu de votre itinéraire personnalisé',
      'home.sampleMorning': 'Explorez près de 1 000 ans d\'histoire royale, admirez les Joyaux de la Couronne et rencontrez les Beefeaters. Arrivez tôt pour éviter la foule.',
      'home.sampleLunch': 'Pâtes artisanales exceptionnelles à des prix imbattables. Les pappardelle au ragù de jarret de bœuf mijoté 8 heures sont extraordinaires.',
      'home.sampleAfternoon': 'Chef-d\'œuvre gothique et église des couronnements depuis 1066. Promenez-vous le long de la Tamise pour voir Big Ben et le Parlement de près.',
      'home.sampleDinner': 'Le plus ancien restaurant de London (depuis 1798). Cuisine britannique traditionnelle dans un cadre édouardien somptueux. La tourte au bœuf et aux rognons est légendaire.',
      'home.sampleEvening': 'Le plus ancien bar à vins de London, caché dans une cave éclairée aux chandelles. Atmosphérique, romantique et incontournable. Arrivez tôt pour avoir une place.',
      'home.seeDemo': 'Voir la démo complète de 5 jours',
      'home.createItinerary': 'Créer mon itinéraire personnalisé',
      'home.ukTitle': 'Au-delà de London',
      'home.ukSubtitle': 'Ajoutez des jours supplémentaires pour explorer le meilleur du Royaume-Uni — villes historiques, côtes magnifiques et campagnes à couper le souffle',
      'home.ukCities': 'Villes historiques',
      'home.ukCitiesDesc': 'Edinburgh, Bath, York, Oxford, Cambridge, Liverpool',
      'home.ukCoastal': 'Escapades côtières',
      'home.ukCoastalDesc': 'Cornwall, Brighton, Jurassic Coast, Whitby',
      'home.ukCountryside': 'Campagne',
      'home.ukCountrysideDesc': 'Cotswolds, Lake District, Scottish Highlands',
      'home.ukCultural': 'Culturel',
      'home.ukCulturalDesc': 'Stratford-upon-Avon, Stonehenge, Windsor Castle',
      'home.ukCta': 'Planifier un voyage London + Royaume-Uni',
      'home.ukPrice': 'Extension Royaume-Uni à partir de $50 en supplément',
      'home.reviewsTitle': 'Ce que disent les voyageurs',
      'home.finalTitle': 'Prêt à planifier votre aventure à London ?',
      'home.finalSubtitle': 'Rejoignez des milliers de voyageurs qui ont découvert leur voyage parfait à London grâce à nos itinéraires personnalisés.',
      'home.finalCta': 'Commencer la planification',

      // Book-services page
      'services.heroTitle': 'Réservez tout pour votre voyage',
      'services.heroSubtitle': 'Vols, hôtels, location de voitures, transferts, assurances et plus — tous les services dont vous avez besoin, auprès de partenaires de confiance aux meilleurs prix',
      'services.essentialTitle': 'Services de voyage essentiels',
      'services.essentialSubtitle': 'Tout ce dont vous avez besoin pour compléter votre voyage à London et au Royaume-Uni',
      'services.flightsTitle': 'Vols vers London',
      'services.flightsDesc': 'Comparez les prix sur plus de 100 compagnies aériennes. Trouvez les vols les moins chers vers Heathrow, Gatwick, Stansted, Luton ou London City.',
      'services.hotelsTitle': 'Hôtels et hébergements',
      'services.hotelsDesc': 'Des auberges économiques au luxe 5 étoiles. Annulation gratuite sur la plupart des chambres. Garantie du meilleur prix.',
      'services.transfersTitle': 'Transferts aéroport',
      'services.transfersDesc': 'Pré-réservez votre prise en charge à l\'aéroport. Voiture privée, navette partagée ou billets de train. Prix fixes, sans surprises.',
      'services.carTitle': 'Location de voitures',
      'services.carDesc': 'Indispensable pour les Cotswolds, le Lake District et les Scottish Highlands. Comparez tous les grands loueurs dans chaque aéroport du Royaume-Uni.',
      'services.trainTitle': 'Billets de train au Royaume-Uni',
      'services.trainDesc': 'Réservez des billets à l\'avance pour les meilleurs prix. London à Edinburgh, Bath, Oxford et toutes les destinations du Royaume-Uni.',
      'services.eurostarTitle': 'Eurostar vers London',
      'services.eurostarDesc': 'Train à grande vitesse depuis Paris, Bruxelles ou Amsterdam direct vers London St Pancras. 2h15 depuis Paris.',
      'services.essentialsTitle': 'Indispensables de voyage',
      'services.essentialsSubtitle': 'Ne partez pas sans ces essentiels',
      'services.insuranceTitle': 'Assurance voyage',
      'services.insuranceDesc': 'Urgences médicales, annulations, bagages perdus et vol. Des polices à partir de seulement $4/jour.',
      'services.esimTitle': 'eSIM / données au Royaume-Uni',
      'services.esimDesc': 'Restez connecté sans frais d\'itinérance. Activation instantanée de l\'eSIM — fonctionne dès votre atterrissage. À partir de $5 pour 1 Go.',
      'services.moneyTitle': 'Carte de voyage',
      'services.moneyDesc': 'Les meilleurs taux de change, retraits gratuits aux distributeurs et aucuns frais de transaction à l\'étranger. Indispensable pour voyager au Royaume-Uni.',
      'services.experiencesTitle': 'Expériences et guides',
      'services.experiencesSubtitle': 'Rendez votre voyage inoubliable avec des expériences menées par des experts',
      'services.attractionsTitle': 'Billets d\'attractions',
      'services.attractionsDesc': 'Billets coupe-file pour toutes les grandes attractions de London. Réservez à l\'avance et économisez jusqu\'à 20 %.',
      'services.theatreTitle': 'Théâtre du West End',
      'services.theatreDesc': 'Réservez des spectacles du West End aux meilleurs prix. Offres de dernière minute et réservations anticipées disponibles.',
      'services.passTitle': 'London Pass / Go City',
      'services.passDesc': 'Pass tout inclus ou explorateur couvrant plus de 80 attractions. Économisez jusqu\'à 50 % par rapport à l\'achat individuel.',
      'services.expertTitle': 'Services experts et conciergerie',
      'services.expertSubtitle': 'Laissez des experts locaux de confiance s\'occuper de la planification et des réservations pour vous',
      'services.conciergeTitle': 'Planification et conciergerie',
      'services.conciergeDesc': 'Laissez un Londonien planifier et réserver tout pour vous — restaurants, attractions, billets de théâtre, visites et trésors cachés. Partagez vos dates et intérêts, ils s\'occupent du reste.',
      'services.talkTitle': 'Parlez à un expert de London',
      'services.talkDesc': 'Réservez un appel vidéo privé avec un expert vérifié de London. Recevez des conseils personnalisés, des recommandations de restaurants et un plan sur mesure pour votre voyage.',
      'services.guideTitle': 'Guide privé à London',
      'services.guideDesc': 'Engagez un guide local expérimenté pour vous accompagner toute la journée. Il vous guidera, partagera des anecdotes, dévoilera des endroits cachés et rendra votre voyage inoubliable.',
      'services.bottomTitle': 'Besoin d\'aide pour tout planifier ?',
      'services.bottomSubtitle': 'Commencez par un itinéraire personnalisé et nous vous aiderons à réserver le reste.',
      'services.bottomCta': 'Planifier mon voyage',
      'btn.searchHotels': 'Rechercher des hôtels',
      'btn.viewAllOptions': 'Voir toutes les options',
      'btn.compareCarHire': 'Comparer les locations de voitures',
      'btn.bookTrainTickets': 'Réserver des billets de train',
      'btn.bookEurostar': 'Réserver l\'Eurostar',
      'btn.getEsim': 'Obtenir une eSIM Royaume-Uni',
      'btn.viewPasses': 'Voir les pass London',
      'btn.planMyTrip': 'Planifier mon voyage'
    },

    de: {
      // Navigation
      'nav.demo': 'Demo',
      'nav.guide': 'Reisefuhrer',
      'nav.neighbourhoods': 'Stadtviertel',
      'nav.whatsOn': 'Veranstaltungen',
      'nav.bookServices': 'Services Buchen',
      'nav.myTrips': 'Meine Reisen',
      'nav.planMyTrip': 'Meine Reise Planen',
      'nav.toggleMenu': 'Navigationsmenu umschalten',

      // Footer — column titles
      'footer.plan': 'Planen',
      'footer.explore': 'Entdecken',
      'footer.support': 'Hilfe',

      // Footer — Plan links
      'footer.createItinerary': 'Reiseplan Erstellen',
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
      'action.next': 'Weiter',

      // Home page
      'home.badge': 'Über 2.000 Reisende vertrauen uns',
      'home.title': 'Ihre perfekte <span>London</span>-Reise, von Experten geplant',
      'home.subtitle': 'Teilen Sie uns Ihre Interessen, Ihr Budget und Ihre Reisedaten mit. Wir erstellen einen personalisierten Tag-für-Tag-Reiseplan mit Insidertipps und Geheimtipps.',
      'home.cta': 'Meine Reise planen — Ab $50',
      'home.ctaSecondary': 'So funktioniert es',
      'home.statAttractions': 'Attraktionen',
      'home.statRestaurants': 'Restaurants',
      'home.statPubs': 'Pubs & Bars',
      'home.statCafes': 'Cafés',
      'home.statThemes': 'Tagesthemen',
      'home.howTitle': 'So funktioniert es',
      'home.howSubtitle': 'Drei einfache Schritte zu Ihrem Traum-Reiseplan für London',
      'home.step1Title': 'Erzählen Sie uns von sich',
      'home.step1Desc': 'Wählen Sie Ihre Reisedauer, Budgetrahmen und Interessen — von Geschichte und Kulinarik bis Nachtleben und Kunst.',
      'home.step2Title': 'Erhalten Sie Ihren Reiseplan',
      'home.step2Desc': 'Unser System erstellt einen personalisierten Tag-für-Tag-Plan mit Aktivitäten für Vormittag, Nachmittag und Abend.',
      'home.step3Title': 'Entdecken Sie London',
      'home.step3Desc': 'Schalten Sie Ihren vollständigen Reiseführer frei mit Buchungslinks, Insidertipps, einem herunterladbaren PDF und Spartipps.',
      'home.sampleTitle': 'Beispieltag: Königliches London & Westminster',
      'home.sampleSubtitle': 'So sieht Ihr personalisierter Reiseplan aus',
      'home.sampleMorning': 'Erkunden Sie fast 1.000 Jahre königliche Geschichte, bestaunen Sie die Kronjuwelen und treffen Sie die Beefeaters. Kommen Sie früh, um den Menschenmassen zuvorzukommen.',
      'home.sampleLunch': 'Hervorragende handgemachte Pasta zu unschlagbaren Preisen. Die Pappardelle mit 8-Stunden-Rinderbein-Ragù sind außergewöhnlich.',
      'home.sampleAfternoon': 'Gotisches Meisterwerk und Krönungskirche seit 1066. Spazieren Sie entlang der Themse, um Big Ben und das Parlament aus nächster Nähe zu sehen.',
      'home.sampleDinner': 'Londons ältestes Restaurant (seit 1798). Traditionelle britische Küche in opulentem edwardianischem Ambiente. Die Steak-and-Kidney-Pie ist legendär.',
      'home.sampleEvening': 'Londons älteste Weinbar, versteckt in einer kerzenbeleuchteten Höhle. Atmosphärisch, romantisch und unverzichtbar. Kommen Sie früh, um einen Platz zu ergattern.',
      'home.seeDemo': 'Vollständige 5-Tage-Demo ansehen',
      'home.createItinerary': 'Meinen personalisierten Reiseplan erstellen',
      'home.ukTitle': 'Über London hinaus',
      'home.ukSubtitle': 'Fügen Sie zusätzliche Tage hinzu, um das Beste des Vereinigten Königreichs zu entdecken — historische Städte, atemberaubende Küsten und spektakuläre Landschaften',
      'home.ukCities': 'Historische Städte',
      'home.ukCitiesDesc': 'Edinburgh, Bath, York, Oxford, Cambridge, Liverpool',
      'home.ukCoastal': 'Küstenausflüge',
      'home.ukCoastalDesc': 'Cornwall, Brighton, Jurassic Coast, Whitby',
      'home.ukCountryside': 'Landschaft',
      'home.ukCountrysideDesc': 'Cotswolds, Lake District, Scottish Highlands',
      'home.ukCultural': 'Kultur',
      'home.ukCulturalDesc': 'Stratford-upon-Avon, Stonehenge, Windsor Castle',
      'home.ukCta': 'London + UK-Reise planen',
      'home.ukPrice': 'UK-Erweiterung ab $50 Aufpreis',
      'home.reviewsTitle': 'Was Reisende sagen',
      'home.finalTitle': 'Bereit, Ihr London-Abenteuer zu planen?',
      'home.finalSubtitle': 'Schließen Sie sich Tausenden von Reisenden an, die ihre perfekte London-Reise mit unseren personalisierten Reiseplänen entdeckt haben.',
      'home.finalCta': 'Jetzt mit der Planung beginnen',

      // Book-services page
      'services.heroTitle': 'Alles für Ihre Reise buchen',
      'services.heroSubtitle': 'Flüge, Hotels, Mietwagen, Transfers, Versicherungen und mehr — alle Services, die Sie brauchen, von vertrauenswürdigen Partnern zu den besten Preisen',
      'services.essentialTitle': 'Wichtige Reiseservices',
      'services.essentialSubtitle': 'Alles, was Sie für Ihre London- und UK-Reise brauchen',
      'services.flightsTitle': 'Flüge nach London',
      'services.flightsDesc': 'Preise bei über 100 Fluggesellschaften vergleichen. Finden Sie die günstigsten Flüge nach Heathrow, Gatwick, Stansted, Luton oder London City.',
      'services.hotelsTitle': 'Hotels & Unterkünfte',
      'services.hotelsDesc': 'Von günstigen Hostels bis zu 5-Sterne-Luxus. Kostenlose Stornierung bei den meisten Zimmern. Bestpreisgarantie.',
      'services.transfersTitle': 'Flughafentransfers',
      'services.transfersDesc': 'Buchen Sie Ihre Flughafenabholung vorab. Privatwagen, Sammelshuttle oder Zugtickets. Festpreise, keine Überraschungen.',
      'services.carTitle': 'Mietwagen',
      'services.carDesc': 'Unverzichtbar für die Cotswolds, den Lake District und die Scottish Highlands. Vergleichen Sie alle großen Anbieter an jedem britischen Flughafen.',
      'services.trainTitle': 'UK-Zugtickets',
      'services.trainDesc': 'Buchen Sie Vorverkaufstickets für die besten Preise. London nach Edinburgh, Bath, Oxford und alle britischen Reiseziele.',
      'services.eurostarTitle': 'Eurostar nach London',
      'services.eurostarDesc': 'Hochgeschwindigkeitszug von Paris, Brüssel oder Amsterdam direkt nach London St Pancras. 2 Std. 15 Min. ab Paris.',
      'services.essentialsTitle': 'Reise-Essentials',
      'services.essentialsSubtitle': 'Verreisen Sie nicht ohne diese',
      'services.insuranceTitle': 'Reiseversicherung',
      'services.insuranceDesc': 'Medizinische Notfälle, Reiserücktritt, verlorenes Gepäck und Diebstahl. Policen ab nur $4/Tag.',
      'services.esimTitle': 'UK-eSIM / Daten',
      'services.esimDesc': 'Bleiben Sie verbunden ohne Roaming-Gebühren. Sofortige eSIM-Aktivierung — funktioniert ab dem Moment der Landung. Ab $5 für 1 GB.',
      'services.moneyTitle': 'Reise-Geldkarte',
      'services.moneyDesc': 'Beste Wechselkurse, kostenlose Geldautomaten-Abhebungen und keine Auslandstransaktionsgebühren. Unverzichtbar für UK-Reisen.',
      'services.experiencesTitle': 'Erlebnisse & Führungen',
      'services.experiencesSubtitle': 'Machen Sie Ihre Reise unvergesslich mit von Experten geleiteten Erlebnissen',
      'services.attractionsTitle': 'Attraktionstickets',
      'services.attractionsDesc': 'Tickets ohne Anstehen für alle großen Londoner Attraktionen. Im Voraus buchen und bis zu 20 % sparen.',
      'services.theatreTitle': 'West End Theater',
      'services.theatreDesc': 'Buchen Sie West End Shows zu den besten Preisen. Last-Minute-Angebote und Vorausbuchungen verfügbar.',
      'services.passTitle': 'London Pass / Go City',
      'services.passDesc': 'All-inclusive- oder Explorer-Pässe für über 80 Attraktionen. Sparen Sie bis zu 50 % gegenüber dem Einzelkauf.',
      'services.expertTitle': 'Experten- & Concierge-Services',
      'services.expertSubtitle': 'Lassen Sie erfahrene lokale Experten die Planung und Buchungen für Sie übernehmen',
      'services.conciergeTitle': 'Reiseplanung & Concierge',
      'services.conciergeDesc': 'Lassen Sie einen Londoner alles für Sie planen und buchen — Restaurants, Attraktionen, Theatertickets, Touren und Geheimtipps. Teilen Sie Ihre Daten und Interessen mit, den Rest übernehmen sie.',
      'services.talkTitle': 'Sprechen Sie mit einem London-Experten',
      'services.talkDesc': 'Buchen Sie ein privates Videogespräch mit einem geprüften London-Experten. Erhalten Sie persönliche Beratung, Insidertipps, Restaurantempfehlungen und einen maßgeschneiderten Plan für Ihre Reise.',
      'services.guideTitle': 'Privater London-Guide',
      'services.guideDesc': 'Engagieren Sie einen erfahrenen lokalen Guide für den ganzen Tag. Er navigiert, erzählt Geschichten, zeigt versteckte Orte und macht Ihre Reise unvergesslich.',
      'services.bottomTitle': 'Brauchen Sie Hilfe bei der Planung?',
      'services.bottomSubtitle': 'Beginnen Sie mit einem personalisierten Reiseplan und wir helfen Ihnen, den Rest zu buchen.',
      'services.bottomCta': 'Meine Reise planen',
      'btn.searchHotels': 'Hotels suchen',
      'btn.viewAllOptions': 'Alle Optionen anzeigen',
      'btn.compareCarHire': 'Mietwagen vergleichen',
      'btn.bookTrainTickets': 'Zugtickets buchen',
      'btn.bookEurostar': 'Eurostar buchen',
      'btn.getEsim': 'UK-eSIM holen',
      'btn.viewPasses': 'London-Pässe ansehen',
      'btn.planMyTrip': 'Meine Reise planen'
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
    // Translate page content on init (after DOM ready)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.translatePage());
    } else {
      this.translatePage();
    }
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
    // Translate all tagged page elements
    this.translatePage();
  },

  /**
   * Translate all elements with data-i18n attributes on the current page.
   * - data-i18n="key" replaces innerHTML
   * - data-i18n-placeholder="key" replaces placeholder attribute
   * - data-i18n-title="key" replaces title attribute
   * - data-i18n-content="key" replaces textContent (no HTML)
   */
  translatePage() {
    // innerHTML translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val !== key) el.innerHTML = val;
    });
    // placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = this.t(key);
      if (val !== key) el.placeholder = val;
    });
    // title translations
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = this.t(key);
      if (val !== key) el.title = val;
    });
    // textContent translations (no HTML)
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
      const key = el.getAttribute('data-i18n-content');
      const val = this.t(key);
      if (val !== key) el.textContent = val;
    });
    // Update page title if key exists
    const titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) {
      const val = this.t(titleKey);
      if (val !== titleKey) document.title = val;
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
