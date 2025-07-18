document.addEventListener('DOMContentLoaded', () => {
    const TRAVELPAYOUTS_MARKER_ID = "60381";
    
    // ÚPRAVA: Rozšířená definice výchozích měst a IATA kódů pro každý jazyk
    const DEFAULT_ORIGIN_NAME = {
        cs: "Prahy",
        en: "Prague",
        de: "Berlína",
        pl: "Varšavy",
        uk: "Kyjeva",
        it: "Říma",
        fr: "Paříže",
        es: "Madridu",
        zh: "Pekingu"
    };
    const DEFAULT_ORIGIN_IATA_BY_LANG = {
        cs: "PRG",
        en: "PRG",
        de: "BER",
        pl: "WAW",
        uk: "KBP", // Alternativa: IEV, podle toho, co preferujete pro Kyjev
        it: "FCO",
        fr: "CDG",
        es: "MAD",
        zh: "PEK"
    };

    const cityToIata = {
        'prague': 'PRG', 'praha': 'PRG', // Přidáno "praha" pro česky mluvící uživatele
        'warsaw': 'WAW', 'warszawa': 'WAW',
        'berlin': 'BER',
        'london': 'LHR',
        'paris': 'CDG',
        'new york': 'JFK',
        'los angeles': 'LAX',
        'tokyo': 'HND', // Alternativa: NRT
        'sydney': 'SYD',
        'rome': 'FCO', 'roma': 'FCO',
        'madrid': 'MAD',
        'kyiv': 'KBP', 'kiev': 'KBP', // Přidáno pro Ukrajinu
        'peking': 'PEK', 'beijing': 'PEK' // Přidáno pro Čínu
    };
    
    const translations = {
        cs: { pageTitle: "Airvero - Letenky levně a chytře", heading: "Letenky <span class='brand-accent'>levně</span> a chytře.", subheading: "Váš AI parťák, který za vás prohledá internet a najde ty nejlepší nabídky letenek.", deals_heading: "Nejlepší nabídky z" },
        en: { pageTitle: "Airvero - Flights cheap and smart", heading: "Flights <span class='brand-accent'>cheap</span> and smart.", subheading: "Your AI travel buddy that scours the internet to find you the best flight deals.", deals_heading: "Best deals from" },
        de: { pageTitle: "Airvero - Flüge günstig und clever", heading: "Flüge <span class='brand-accent'>günstig</span> und clever.", subheading: "Ihr KI-Reisebegleiter, der das Internet für Sie durchsucht, um die besten Flugangebote zu finden.", deals_heading: "Beste Angebote aus" },
        pl: { pageTitle: "Airvero - Tanie i sprytne loty", heading: "Loty <span class='brand-accent'>tanie</span> i sprytne.", subheading: "Twój towarzysz podróży AI, który przeszukuje internet, aby znaleźć najlepsze oferty lotów.", deals_heading: "Najlepsze oferty z" },
        uk: { pageTitle: "Airvero - Дешеві та розумні авіаквитки", heading: "Авіаквитки <span class='brand-accent'>дешево</span> та розумно.", subheading: "Ваш AI-помічник у подорожах, який сканує інтернет, щоб знайти найкращі пропозиції на авіаквитки.", deals_heading: "Найкращі пропозиції з" },
        it: { pageTitle: "Airvero - Voli economici e intelligenti", heading: "Voli <span class='brand-accent'>economici</span> e intelligenti.", subheading: "Il tuo compagno di viaggio AI che scandaglia internet per trovare le migliori offerte di voli.", deals_heading: "Migliori offerte da" },
        fr: { pageTitle: "Airvero - Vols pas chers et intelligents", heading: "Vols <span class='brand-accent'>pas chers</span> et intelligents.", subheading: "Votre compagnon de voyage IA qui parcourt Internet pour vous trouver les meilleures offres de vols.", deals_heading: "Meilleures offres de" },
        es: { pageTitle: "Airvero - Vuelos baratos e inteligentes", heading: "Vuelos <span class='brand-accent'>baratos</span> e inteligentes.", subheading: "Tu compañero de viaje con IA que rastrea internet para encontrarte las mejores ofertas de vuelos.", deals_heading: "Mejores ofertas desde" },
        zh: { pageTitle: "Airvero - 便宜又智能的航班", heading: "航班<span class='brand-accent'>便宜</span>又智能。", subheading: "您的AI旅行伙伴，为您搜索互联网，找到最佳航班优惠。", deals_heading: "来自...的最佳优惠" }
    };
    let currentLang = 'cs';

    const flags = {
        en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><path fill="#00247d" d="M0 0h5v3H0z"/><path fill="#fff" d="m0 0 5 3m0-3L0 3"/><path stroke="#cf142b" stroke-width=".6" d="m0 0 5 3m0-3L0 3"/><path fill="#fff" d="M2.5 0v3M0 1.5h5" stroke="#fff" stroke-width=".2"/><path fill="#fff" d="M2.5 0v3M0 1.5h5" stroke="#cf142b" stroke-width=".2"/></svg>',
        cs: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><path fill="#fff" d="M0 0h5v3H0z"/><path fill="#d7141a" d="M0 1.5h5v1.5H0z"/><path fill="#11457e" d="m0 0 2 1.5L0 3z"/></svg>',
        de: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><path d="M0 0h5v3H0z"/><path fill="#d00" d="M0 1h5v1H0z"/><path fill="#ffce00" d="M0 2h5v1H0z"/></svg>',
        pl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><path fill="#fff" d="M0 0h5v3H0z"/><path fill="#dc143c" d="M0 1.5h5v1.5H0z"/></svg>',
        uk: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><path fill="#0057b7" d="M0 0h5v3H0z"/><path fill="#ffd700" d="M0 1.5h5v1v1.5H0z"/></svg>',
        it: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><path fill="#009246" d="M0 0h1v2H0z"/><path fill="#fff" d="M1 0h1v2H1z"/><path fill="#ce2b37" d="M2 0h1v2H2z"/></svg>',
        fr: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><path fill="#0055a4" d="M0 0h1v2H0z"/><path fill="#fff" d="M1 0h1v2H1z"/><path fill="#ef4135" d="M2 0h1v2H2z"/></svg>',
        es: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><path fill="#c60b1e" d="M0 0h5v3H0z"/><path fill="#ffc400" d="M0 .75h5v1.5H0z"/></svg>',
        zh: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><path fill="#ee1c25" d="M0 0h5v3H0z"/><path fill="#ffde00" d="m.9 1.1-.2-.7.7.2-.6-.4.5.5L1 .5l-.2.7-.6-.4.5.5-.6-.4.7.2z"/></svg>'
    };

    function createLangSwitcher() {
        const switcherContainer = document.getElementById('lang-switcher');
        if (!switcherContainer) return;
        Object.keys(flags).forEach(lang => {
            const button = document.createElement('button');
            button.setAttribute('data-lang', lang);
            button.innerHTML = flags[lang];
            // Přidáme aria-label pro přístupnost
            button.setAttribute('aria-label', `Switch to ${translations[lang].pageTitle.split(' - ')[0]} language`);
            switcherContainer.appendChild(button);
        });
    }

    function applyTranslations(lang) {
        currentLang = lang;
        const t = translations[lang] || translations['en'];
        document.documentElement.lang = lang;
        document.title = t.pageTitle;
        document.querySelector('[data-key="heading"]').innerHTML = t.heading;
        document.querySelector('[data-key="subheading"]').innerHTML = t.subheading;
        document.querySelector('[data-key="deals_heading"]').textContent = t.deals_heading;
        document.querySelectorAll('#lang-switcher button').forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-lang') === lang) button.classList.add('active');
        });
    }
    
    // FUNKCE CREATEWIDGET: Vytváří SKRIPT tag
    function createWidget(containerId, widgetScriptSrc) { 
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Kontejner s ID '${containerId}' nebyl nalezen.`);
            return;
        }

        container.innerHTML = ''; // Vyčistíme kontejner

        const script = document.createElement('script');
        script.src = widgetScriptSrc;
        script.charset = 'utf-8';
        script.async = true;

        container.appendChild(script);
    }

    async function initializePage() {
        // ÚPRAVA: Inicializace s výchozím městem pro daný jazyk
        let originIata = DEFAULT_ORIGIN_IATA_BY_LANG[currentLang] || DEFAULT_ORIGIN_IATA_BY_LANG['en'];
        let originName = DEFAULT_ORIGIN_NAME[currentLang] || DEFAULT_ORIGIN_NAME['en'];
        
        document.getElementById('location-name').textContent = originName; // Nastavíme výchozí název pro aktuální jazyk
        
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('Geolocation fetch failed');
            const data = await response.json();
            const userCity = data.city.toLowerCase();
            
            if (cityToIata[userCity]) {
                originIata = cityToIata[userCity]; // Pokud detekováno, přepíšeme IATA
                document.getElementById('location-name').textContent = data.city; // Přepíšeme název města na detekované
            }
        } catch (error) {
            console.error("Could not detect location, using default for current language:", error);
            // Pokud geolokace selže, zůstane nastaveno DEFAULT_ORIGIN_NAME[currentLang]
        }

        // --- URL PRO VYHLEDÁVACÍ FORMULÁŘ ---
        // Váš kód z generátoru. Host je zde search.jetradar.com
        const searchWidgetSrc = `https://tpemb.com/content?currency=czk&trs=433005&shmarker=${TRAVELPAYOUTS_MARKER_ID}.homepage-search-form&combine_promos=101_7873&show_hotels=true&powered_by=true&locale=${currentLang}&searchUrl=search.jetradar.com&primary_override=%23F5821f&color_button=%23F5821f&color_icons=%231E2A4a&dark=%231E2A4a&light=%23FFFFFf&secondary=%23F0F7Ff&special=%23D3DCE6&color_focused=%23F5821f&border_radius=0&no_labels=&plain=true&promo_id=7879&campaign_id=100&origin=${originIata}`;
        
        // --- URL PRO OBLÍBENÉ TRASY ---
        // Váš kód z generátoru. Host je zde aviasales.com
        // ÚPRAVA: Odstraněno pevné destination=PRG
        const popularRoutesSrc = `https://tpemb.com/content?currency=czk&trs=433005&shmarker=${TRAVELPAYOUTS_MARKER_ID}.popular-routes-widget&target_host=www.aviasales.com%2Fsearch&locale=${currentLang}&limit=10&powered_by=true&primary=%23F5821f&promo_id=4044&campaign_id=100&origin=${originIata}&host=aviasales.com`;


        createWidget('search-widget-container', searchWidgetSrc);
        createWidget('popular-routes-container', popularRoutesSrc);
    }

    // --- HLAVNÍ PROVEDENÍ ---
    // ÚPRAVA: Přidán aria-label pro tlačítko mobilního menu
    document.getElementById('mobile-menu-button').setAttribute('aria-label', 'Toggle mobile menu');

    createLangSwitcher();
    let detectedLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if(!translations[detectedLang]) detectedLang = 'en';
    applyTranslations(detectedLang);
    initializePage(); // První inicializace při načtení stránky

    document.getElementById('lang-switcher').addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if(button) {
            const selectedLang = button.getAttribute('data-lang');
            if(selectedLang && selectedLang !== currentLang) {
                applyTranslations(selectedLang);
                // Zobrazíme načítací kolečka, než se widgety znovu načtou
                document.getElementById('search-widget-container').innerHTML = '<div class="loader"></div>';
                document.getElementById('popular-routes-container').innerHTML = '<div class="loader"></div>';
                initializePage(); // RE-inicializace pro nový jazyk
            }
        }
    });
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        openIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });
});
