// Definizione delle rotte
const routes = {
    '/': 'index.html',
    '/index.html': 'index.html',
    '/dashboard.html': 'dashboard.html',
    '/myreparto/': 'dashboard.html',
    '/myreparto/index.html': 'index.html',
    '/myreparto/dashboard.html': 'dashboard.html',
    '/login': {
        template: '/views/login.html',
        auth: false
    },
    '/register': {
        template: '/views/register.html',
        auth: false
    },
    '/esploratori': {
        template: '/views/esploratori.html',
        auth: true,
        roles: ['staff']
    },
    '/esploratore/:id': {
        template: '/views/esploratore-detail.html',
        auth: true,
        roles: ['staff', 'esploratore']
    },
    '/profilo': {
        template: '/views/profilo.html',
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

        // Verifica autenticazione e ruoli
        if (route.auth && !state.isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        if (route.roles && !route.roles.includes(state.userRole)) {
            window.location.href = '/unauthorized';
            return;
        }

        // Carica il template
        try {
            const response = await fetch(route.template);
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

        return route ? { ...routes[route[0]], params: this.extractParams(route[0], path) } : null;
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