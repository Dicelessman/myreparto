import { auth } from './config/firebase.js';
import { router } from './router.js';
import { showLoading, hideLoading } from './utils/ui.js';

// Gestione dello stato dell'applicazione
const state = {
    user: null,
    userRole: null,
    isAuthenticated: false
};

// Inizializzazione dell'applicazione
async function initApp() {
    showLoading();
    
    // Listener per i cambiamenti di autenticazione
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            state.user = user;
            // TODO: Recuperare il ruolo dell'utente da Firestore
            state.isAuthenticated = true;
            router.navigate(window.location.pathname);
        } else {
            state.user = null;
            state.userRole = null;
            state.isAuthenticated = false;
            router.navigate('/login');
        }
        hideLoading();
    });
}

// Gestione degli errori globali
window.addEventListener('error', (event) => {
    console.error('Errore globale:', event.error);
    // TODO: Implementare una gestione degli errori più sofisticata
});

// Inizializzazione dell'app quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initApp); 