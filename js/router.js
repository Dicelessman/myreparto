// Definizione delle rotte
const routes = {
    '/': 'index.html',
    '/index.html': 'index.html',
    '/dashboard': {
        template: 'views/dashboard.html',
        auth: true
    },
    '/myreparto/': 'index.html',
    '/myreparto/index.html': 'index.html',
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
        const route = this.matchRoute(path);
        if (!route) {
            console.error('Rotta non trovata:', path);
            return;
        }

        // Se la rotta è una stringa semplice, carica direttamente il file
        if (typeof route === 'string') {
            try {
                const templatePath = `/myreparto/${route}`;
                const response = await fetch(templatePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = await response.text();
                document.getElementById('app').innerHTML = html;
                window.history.pushState({}, '', path);
                return;
            } catch (error) {
                console.error('Errore nel caricamento della pagina:', error);
                document.getElementById('app').innerHTML = '<div class="p-4 text-red-500">Errore nel caricamento della pagina</div>';
                return;
            }
        }

        // Verifica autenticazione e ruoli per le rotte complesse
        if (route.auth && !state.isAuthenticated) {
            window.location.href = '/myreparto/login';
            return;
        }

        if (route.roles && !route.roles.includes(state.userRole)) {
            window.location.href = '/myreparto/unauthorized';
            return;
        }

        // Carica il template per le rotte complesse
        try {
            const templatePath = `/myreparto/${route.template}`;
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            document.getElementById('app').innerHTML = html;
            
            // Aggiorna l'URL
            window.history.pushState({}, '', path);
            
            // Inizializza il controller della pagina
            if (route.controller) {
                route.controller();
            }
        } catch (error) {
            console.error('Errore nel caricamento della pagina:', error);
            document.getElementById('app').innerHTML = '<div class="p-4 text-red-500">Errore nel caricamento della pagina</div>';
        }
    },

    matchRoute(path) {
        // Gestione dei parametri nelle rotte
        const route = Object.entries(routes).find(([routePath]) => {
            const pattern = routePath.replace(/:[^/]+/g, '[^/]+');
            return new RegExp(`^${pattern}$`).test(path);
        });

        if (!route) return null;

        // Se la rotta è una stringa semplice, restituisci direttamente il valore
        if (typeof routes[route[0]] === 'string') {
            return routes[route[0]];
        }

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