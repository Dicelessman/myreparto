// Configurazione Firebase
const firebaseConfig = {
    // TODO: Inserire qui le credenziali Firebase
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inizializzazione Firebase
firebase.initializeApp(firebaseConfig);

// Esportazione delle istanze
export const auth = firebase.auth();
export const db = firebase.firestore();

// Configurazione Firestore
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Abilita la persistenza offline
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('La persistenza offline non è disponibile con più tab aperti');
        } else if (err.code === 'unimplemented') {
            console.warn('Il browser non supporta la persistenza offline');
        }
    }); 