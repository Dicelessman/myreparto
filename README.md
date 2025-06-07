# MyReparto - Gestione Reparto Scout

Applicazione web moderna per la gestione di un reparto scout, sviluppata con tecnologie moderne e un'interfaccia user-friendly.

## Caratteristiche Principali

- 🔐 Sistema di autenticazione con Firebase
- 👥 Gestione ruoli utente (Staff ed Esploratori)
- 📱 Design responsive ottimizzato per tutti i dispositivi
- 📊 Dashboard completa per lo staff
- 📝 Gestione schede esploratori
- 📁 Upload e gestione documenti
- 🔄 Sincronizzazione offline
- 📱 Supporto PWA

## Tecnologie Utilizzate

- Frontend: HTML5, JavaScript (ES6+), Tailwind CSS
- Backend: Firebase (Authentication e Firestore)
- Hosting: GitHub Pages

## Requisiti

- Node.js 14.x o superiore
- NPM 6.x o superiore
- Un account Firebase

## Installazione

1. Clona il repository:
```bash
git clone https://github.com/tuousername/myreparto.git
cd myreparto
```

2. Installa le dipendenze:
```bash
npm install
```

3. Configura Firebase:
   - Crea un nuovo progetto su [Firebase Console](https://console.firebase.google.com)
   - Abilita Authentication e Firestore
   - Copia le credenziali nel file `js/config/firebase.js`

4. Avvia l'applicazione in modalità sviluppo:
```bash
npm run dev
```

## Deployment

1. Configura GitHub Pages:
   - Vai nelle impostazioni del repository
   - Abilita GitHub Pages
   - Seleziona il branch `main` come sorgente

2. Builda l'applicazione:
```bash
npm run build
```

3. Pusha le modifiche:
```bash
git add .
git commit -m "Build per produzione"
git push
```

## Struttura del Progetto

```
myreparto/
├── js/
│   ├── config/
│   │   └── firebase.js
│   ├── utils/
│   │   └── ui.js
│   ├── app.js
│   └── router.js
├── views/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── ...
├── icons/
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── index.html
├── manifest.json
└── README.md
```

## Contribuire

1. Forka il repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le tue modifiche (`git commit -m 'Aggiungi qualche AmazingFeature'`)
4. Pusha al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Questo progetto è distribuito con licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## Supporto

Per supporto, email support@myreparto.it o apri una issue nel repository. 