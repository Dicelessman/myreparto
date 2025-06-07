import { auth } from './config/firebase.js';
import { router } from './router.js';
import { showLoading, hideLoading } from './utils/ui.js';
import { db } from './config/firebase.js';
import { showToast } from './utils/ui.js';

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
            // Recupera il ruolo dell'utente da Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                state.userRole = userData.role;
                state.isAuthenticated = true;
                
                // Se l'utente non è approvato, reindirizza al login
                if (!userData.isApproved) {
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
        router.navigate(window.location.pathname);
        hideLoading();
    });
}

// Gestione degli errori globali
window.addEventListener('error', (event) => {
    console.error('Errore globale:', event.error);
    showToast('Si è verificato un errore', 'error');
});

// Inizializzazione dell'app quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initApp); 