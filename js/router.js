// Definizione del base path
const BASE_PATH = '/myreparto';

// Definizione delle rotte
const routes = {
    [BASE_PATH]: {
        isHome: true,
        auth: false,
        template: `${BASE_PATH}/index.html`
    },
    [`${BASE_PATH}/index.html`]: {
        isHome: true,
        auth: false,
        template: `${BASE_PATH}/index.html`
    },
    [`${BASE_PATH}/dashboard`]: {
        template: `${BASE_PATH}/views/dashboard.html`,
        auth: true
    },
    [`${BASE_PATH}/login`]: {
        template: `${BASE_PATH}/views/login.html`,
        auth: false
    },
    [`${BASE_PATH}/register`]: {
        template: `${BASE_PATH}/register.html`,
        auth: false
    },
    [`${BASE_PATH}/esploratori`]: {
        template: `${BASE_PATH}/views/esploratori.html`,
        auth: true,
        roles: ['staff']
    },
    [`${BASE_PATH}/esploratore/:id`]: {
        template: `${BASE_PATH}/views/esploratore-detail.html`,
        auth: true,
        roles: ['staff', 'esploratore']
    },
    [`${BASE_PATH}/profilo`]: {
        template: `${BASE_PATH}/views/profilo.html`,
        auth: true,
        roles: ['staff', 'esploratore']
    }
};

class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        this.baseUrl = 'https://dicelessman.github.io';
        this.basePath = '/myreparto';
        
        // Gestione della navigazione
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Gestione dei link
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="/"]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });

        // Inizializza la prima navigazione
        this.handleRoute();
    }

    // Funzione per normalizzare il percorso
    normalizePath(path) {
        // Rimuovi trailing slash e leading slash
        return path.replace(/^\/|\/$/g, '');
    }

    // Funzione per matchare il percorso con le rotte disponibili
    matchRoute(path) {
        console.log('Match Route Debug');
        console.log('Percorso da matchare:', path);
        console.log('Rotte disponibili:', this.routes);

        // Normalizza il percorso
        const normalizedPath = this.normalizePath(path);
        console.log('Percorso normalizzato:', normalizedPath);

        // Gestione speciale per la rotta principale
        if (normalizedPath === '' || normalizedPath === 'myreparto') {
            return this.routes[BASE_PATH];
        }

        // Cerca una corrispondenza esatta
        if (this.routes[`/${normalizedPath}`]) {
            return this.routes[`/${normalizedPath}`];
        }

        // Cerca corrispondenze con parametri
        for (const [routePath, routeConfig] of Object.entries(this.routes)) {
            const pattern = this.normalizePath(routePath);
            console.log('Confronto:', normalizedPath, 'con pattern', pattern);

            // Converti il pattern in regex
            const regexPattern = pattern
                .replace(/:[^/]+/g, '[^/]+')
                .replace(/\//g, '\\/');

            const regex = new RegExp(`^${regexPattern}$`);
            if (regex.test(normalizedPath)) {
                console.log('✅ Rotta trovata:', pattern);
                return routeConfig;
            }
        }

        // Rotta di fallback - reindirizza alla home
        console.log('⚠️ Nessuna rotta trovata, reindirizzamento alla home');
        return this.routes[BASE_PATH];
    }

    async handleRoute() {
        const path = window.location.pathname;
        console.log('Router Debug');
        console.log('=== INIZIO NAVIGAZIONE ===');
        console.log('Percorso richiesto:', path);
        console.log('URL corrente:', window.location.href);
        console.log('Base URL:', this.baseUrl);
        console.log('Pathname:', path);

        const route = this.matchRoute(path);
        
        if (!route) {
            console.log('❌ ROTTA NON TROVATA');
            console.log('Rotte disponibili:', this.routes);
            // Reindirizza alla home senza ricorsione
            window.history.replaceState({}, '', '/myreparto');
            return;
        }

        console.log('✅ ROTTA TROVATA:', route);

        // Verifica autenticazione se richiesta
        if (route.auth && !appState.isAuthenticated) {
            window.history.replaceState({}, '', '/myreparto/login');
            return;
        }

        try {
            console.log('=== TENTATIVO DI CARICAMENTO TEMPLATE ===');
            console.log('Template path:', route.template);
            const fullUrl = `${this.baseUrl}${route.template}`;
            console.log('URL completo:', fullUrl);

            const response = await fetch(fullUrl);
            console.log('Risposta fetch:', response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const template = await response.text();
            console.log('✅ Template caricato con successo');
            console.log('Dimensione template:', template.length, 'bytes');

            // Aggiorna il contenuto
            document.getElementById('app').innerHTML = template;

            // Aggiorna lo stato corrente
            this.currentRoute = route;

            // Emetti l'evento templateLoaded
            document.dispatchEvent(new Event('templateLoaded'));

            console.log('=== FINE NAVIGAZIONE ===');
        } catch (error) {
            console.error('Errore durante il caricamento del template:', error);
            // In caso di errore, reindirizza alla home senza ricorsione
            window.history.replaceState({}, '', '/myreparto');
        }
    }

    navigate(path) {
        // Usa replaceState invece di pushState per evitare il loop
        window.history.replaceState({}, '', path);
        this.handleRoute();
    }
}

// Esporta la classe Router
export default Router; 