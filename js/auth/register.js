import { auth, db } from '../config/firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { showToast } from '../utils/ui.js';

class RegisterManager {
    constructor() {
        this.form = null;
        this.button = null;
        this.isProcessing = false;
    }

    init() {
        console.log('Inizializzazione RegisterManager...');
        
        this.form = document.getElementById('registerForm');
        this.button = document.getElementById('registerButton');
        
        if (!this.form || !this.button) {
            console.error('Elementi del form non trovati!');
            return;
        }

        // Rimuovi eventuali listener precedenti
        this.cleanup();
        
        // Aggiungi i nuovi listener
        this.button.addEventListener('click', this.handleRegister.bind(this));
        this.form.addEventListener('submit', (e) => e.preventDefault());
        
        console.log('RegisterManager inizializzato con successo');
    }

    cleanup() {
        if (this.button) {
            this.button.removeEventListener('click', this.handleRegister);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        if (this.isProcessing) {
            console.log('Registrazione già in corso...');
            return;
        }

        this.isProcessing = true;
        this.button.disabled = true;
        this.button.textContent = 'Registrazione in corso...';

        try {
            const displayName = document.getElementById('displayName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            console.log('Tentativo di registrazione per:', email);

            if (password !== confirmPassword) {
                throw new Error('Le password non coincidono');
            }

            // Creazione utente
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Utente creato:', user.uid);

            // Aggiornamento profilo
            await updateProfile(user, { displayName });
            console.log('Profilo aggiornato');

            // Creazione documento in Firestore
            await db.collection('users').doc(user.uid).set({
                email,
                displayName,
                role: 'staff',
                createdAt: new Date(),
                isApproved: true
            });
            console.log('Documento utente creato in Firestore');

            showToast('Registrazione completata con successo', 'success');
            window.location.href = '/myreparto/dashboard';

        } catch (error) {
            console.error('Errore durante la registrazione:', error);
            
            let errorMessage = 'Errore durante la registrazione';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email già in uso';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email non valida';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Registrazione non abilitata';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password troppo debole';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Errore di connessione';
                    break;
            }
            
            showToast(errorMessage, 'error');
        } finally {
            this.isProcessing = false;
            this.button.disabled = false;
            this.button.textContent = 'Registrati';
        }
    }
}

export const registerManager = new RegisterManager(); 