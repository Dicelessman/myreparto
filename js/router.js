// Definizione delle rotte
const routes = {
    '/': {
        isHome: true,
        auth: false
    },
    '/index.html': {
        isHome: true,
        auth: false
    },
    '/dashboard': {
        template: 'views/dashboard.html',
        auth: true
    },
    '/myreparto/': {
        isHome: true,
        auth: false
    },
    '/myreparto/index.html': {
        isHome: true,
        auth: false
    },
    '/myreparto/dashboard': {
        template: 'views/dashboard.html',
        auth: true
    },
    '/myreparto/login': {
        template: 'views/login.html',
        auth: false
    },
    '/myreparto/register': {
        template: 'views/register.html',
        auth: false
    },
    '/myreparto/esploratori': {
        template: 'views/esploratori.html',
        auth: true,
        roles: ['staff']
    },
    '/myreparto/esploratore/:id': {
        template: 'views/esploratore-detail.html',
        auth: true,
        roles: ['staff', 'esploratore']
    },
    '/myreparto/profilo': {
        template: 'views/profilo.html',
        auth: true,
        roles: ['staff', 'esploratore']
    }
};

// Router
export const router = {
    async navigate(path) {
        console.log('Navigazione richiesta a:', path);
        const route = this.matchRoute(path);
        if (!route) {
            console.error('Rotta non trovata:', path);
            return;
        }
        console.log('Rotta trovata:', route);

        // Verifica autenticazione e ruoli
        if (route.auth && !state.isAuthenticated) {
            console.log('Reindirizzamento al login - utente non autenticato');
            window.location.href = '/myreparto/login';
            return;
        }

        if (route.roles && !route.roles.includes(state.userRole)) {
            console.log('Reindirizzamento a unauthorized - ruolo non autorizzato');
            window.location.href = '/myreparto/unauthorized';
            return;
        }

        // Se è la pagina iniziale, non carichiamo nessun template
        if (route.isHome) {
            console.log('Pagina iniziale, nessun template da caricare');
            window.history.pushState({}, '', path);
            return;
        }

        // Carica il template per le altre pagine
        try {
            // Costruisci il percorso del template
            const templatePath = route.template;
            console.log('Tentativo di caricamento template:', templatePath);
            
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            console.log('Template caricato con successo');
            
            document.getElementById('app').innerHTML = html;
            
            // Aggiorna l'URL
            window.history.pushState({}, '', path);
            
            // Inizializza il controller della pagina
            if (route.controller) {
                route.controller();
            }
        } catch (error) {
            console.error('Errore nel caricamento della pagina:', error);
            document.getElementById('app').innerHTML = `
                <div class="p-4 text-red-500">
                    <h2 class="text-xl font-bold mb-2">Errore nel caricamento della pagina</h2>
                    <p>${error.message}</p>
                    <a href="/myreparto/" class="text-green-600 hover:text-green-700 mt-4 inline-block">
                        <i class="fas fa-home mr-2"></i>Torna alla home
                    </a>
                </div>
            `;
        }
    },

    matchRoute(path) {
        console.log('Ricerca rotta per il percorso:', path);
        // Gestione dei parametri nelle rotte
        const route = Object.entries(routes).find(([routePath]) => {
            const pattern = routePath.replace(/:[^/]+/g, '[^/]+');
            const matches = new RegExp(`^${pattern}$`).test(path);
            console.log(`Confronto percorso ${path} con pattern ${pattern}: ${matches}`);
            return matches;
        });

        if (!route) {
            console.log('Nessuna rotta trovata per:', path);
            return null;
        }

        console.log('Rotta trovata:', route[0]);
        // Per le rotte complesse, restituisci l'oggetto con i parametri
        return { 
            ...routes[route[0]], 
            params: this.extractParams(route[0], path) 
        };
    },

    extractParams(routePath, currentPath) {
        const params = {};
        const routeParts = routePath.split('/');
        const pathParts = currentPath.split('/');

        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                params[part.slice(1)] = pathParts[index];
            }
        });

        return params;
    }
};

// Gestione della navigazione del browser
window.addEventListener('popstate', () => {
    router.navigate(window.location.pathname);
}); 