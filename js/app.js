import { auth } from './config/firebase.js';
import Router from './router.js';
import { showLoading, hideLoading } from './utils/ui.js';
import { db } from './config/firebase.js';
import { showToast } from './utils/ui.js';

// Gestione dello stato dell'applicazione
const state = {
    user: null,
    userRole: null,
    isAuthenticated: false
};

// Definizione delle rotte
const routes = [
    {
        path: '/myreparto',
        template: '/myreparto/index.html',
        auth: false
    },
    {
        path: '/myreparto/index.html',
        template: '/myreparto/index.html',
        auth: false
    },
    {
        path: '/myreparto/dashboard',
        template: '/myreparto/dashboard.html',
        auth: true
    },
    {
        path: '/myreparto/login',
        template: '/myreparto/login.html',
        auth: false
    },
    {
        path: '/myreparto/register',
        template: '/myreparto/register.html',
        auth: false
    },
    {
        path: '/myreparto/esploratori',
        template: '/myreparto/esploratori.html',
        auth: true
    },
    {
        path: '/myreparto/esploratore/:id',
        template: '/myreparto/esploratore.html',
        auth: true
    },
    {
        path: '/myreparto/profilo',
        template: '/myreparto/profilo.html',
        auth: true
    }
];

// Inizializzazione dell'applicazione
async function initApp() {
    console.log('Inizializzazione applicazione...');
    showLoading();
    
    // Inizializza il router
    const router = new Router(routes);
    
    // Listener per i cambiamenti di autenticazione
    auth.onAuthStateChanged(async (user) => {
        console.log('Stato autenticazione cambiato:', user ? 'utente autenticato' : 'utente non autenticato');
        
        if (user) {
            state.user = user;
            console.log('Recupero dati utente da Firestore...');
            // Recupera il ruolo dell'utente da Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                state.userRole = userData.role;
                state.isAuthenticated = true;
                console.log('Ruolo utente:', userData.role);
                
                // Se l'utente non è approvato, reindirizza al login
                if (!userData.isApproved) {
                    console.log('Utente non approvato, logout...');
                    await auth.signOut();
                    showToast('Il tuo account è in attesa di approvazione', 'warning');
                    router.navigate('/myreparto/login');
                    return;
                }
            }
        } else {
            state.user = null;
            state.userRole = null;
            state.isAuthenticated = false;
        }
        
        // Naviga alla pagina corrente
        const currentPath = window.location.pathname;
        console.log('Navigazione alla pagina corrente:', currentPath);
        await router.handleRoute();
        hideLoading();
    });
}

// Gestione degli errori globali
window.addEventListener('error', (event) => {
    console.error('Errore globale:', event.error);
    showToast('Si è verificato un errore', 'error');
});

// Inizializzazione dell'app quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM caricato, inizializzazione app...');
    initApp();
}); 