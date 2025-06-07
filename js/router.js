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
        console.group('Router Debug');
        console.log('=== INIZIO NAVIGAZIONE ===');
        console.log('Percorso richiesto:', path);
        console.log('URL corrente:', window.location.href);
        console.log('Base URL:', window.location.origin);
        console.log('Pathname:', window.location.pathname);
        
        const route = this.matchRoute(path);
        if (!route) {
            console.error('❌ ROTTA NON TROVATA');
            console.log('Rotte disponibili:', Object.keys(routes));
            console.groupEnd();
            return;
        }
        console.log('✅ ROTTA TROVATA:', route);

        // Verifica autenticazione e ruoli
        if (route.auth && !state.isAuthenticated) {
            console.log('⚠️ Reindirizzamento al login - utente non autenticato');
            console.groupEnd();
            window.location.href = '/myreparto/login';
            return;
        }

        if (route.roles && !route.roles.includes(state.userRole)) {
            console.log('⚠️ Reindirizzamento a unauthorized - ruolo non autorizzato');
            console.groupEnd();
            window.location.href = '/myreparto/unauthorized';
            return;
        }

        // Se è la pagina iniziale, non carichiamo nessun template
        if (route.isHome) {
            console.log('ℹ️ Pagina iniziale, nessun template da caricare');
            console.groupEnd();
            window.history.pushState({}, '', path);
            return;
        }

        // Carica il template per le altre pagine
        try {
            // Costruisci il percorso del template
            const templatePath = route.template;
            console.log('=== TENTATIVO DI CARICAMENTO TEMPLATE ===');
            console.log('Template path:', templatePath);
            console.log('URL completo:', new URL(templatePath, window.location.href).href);
            
            const response = await fetch(templatePath);
            console.log('Risposta fetch:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            console.log('✅ Template caricato con successo');
            console.log('Dimensione template:', html.length, 'bytes');
            
            document.getElementById('app').innerHTML = html;
            
            // Aggiorna l'URL
            window.history.pushState({}, '', path);
            console.log('URL aggiornato:', window.location.href);
            
            // Inizializza il controller della pagina
            if (route.controller) {
                console.log('Inizializzazione controller...');
                route.controller();
            }
        } catch (error) {
            console.error('❌ ERRORE NEL CARICAMENTO DELLA PAGINA');
            console.error('Dettagli errore:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            document.getElementById('app').innerHTML = `
                <div class="p-4 text-red-500">
                    <h2 class="text-xl font-bold mb-2">Errore nel caricamento della pagina</h2>
                    <p>${error.message}</p>
                    <pre class="mt-2 p-2 bg-gray-100 rounded text-sm">${error.stack}</pre>
                    <a href="/myreparto/" class="text-green-600 hover:text-green-700 mt-4 inline-block">
                        <i class="fas fa-home mr-2"></i>Torna alla home
                    </a>
                </div>
            `;
        }
        console.log('=== FINE NAVIGAZIONE ===');
        console.groupEnd();
    },

    matchRoute(path) {
        console.group('Match Route Debug');
        console.log('Percorso da matchare:', path);
        console.log('Rotte disponibili:', Object.keys(routes));
        
        // Gestione dei parametri nelle rotte
        const route = Object.entries(routes).find(([routePath]) => {
            const pattern = routePath.replace(/:[^/]+/g, '[^/]+');
            const matches = new RegExp(`^${pattern}$`).test(path);
            console.log(`Confronto: ${path} con pattern ${pattern} => ${matches}`);
            return matches;
        });

        if (!route) {
            console.log('❌ Nessuna rotta trovata');
            console.groupEnd();
            return null;
        }

        console.log('✅ Rotta trovata:', route[0]);
        console.groupEnd();
        
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