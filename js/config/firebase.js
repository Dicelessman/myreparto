import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD2q76D357xcvi1F2ifMt1qAnqJyQv1tpA",
    authDomain: "myreparto-6fa59.firebaseapp.com",
    projectId: "myreparto-6fa59",
    storageBucket: "myreparto-6fa59.firebasestorage.app",
    messagingSenderId: "366632707549",
    appId: "1:366632707549:web:1e103de89a17cc62178234"
};

// Inizializzazione Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configurazione Firestore
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Abilita la persistenza offline
enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('La persistenza offline non è disponibile con più tab aperti');
        } else if (err.code === 'unimplemented') {
            console.warn('Il browser non supporta la persistenza offline');
        }
    }); 