// Gestione del loading state
export function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
    }
}

export function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
}

// Gestione dei toast notifications
export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-0 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    } text-white`;
    
    toast.textContent = message;
    document.body.appendChild(toast);

    // Rimuovi il toast dopo 3 secondi
    setTimeout(() => {
        toast.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Gestione dei modali
export function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            ${content}
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

export function hideModal(modal) {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 300);
}

// Gestione della validazione dei form
export function validateForm(formData, rules) {
    const errors = {};
    
    for (const [field, value] of formData.entries()) {
        if (rules[field]) {
            const fieldRules = rules[field];
            
            if (fieldRules.required && !value) {
                errors[field] = 'Campo obbligatorio';
            } else if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
                errors[field] = fieldRules.message || 'Formato non valido';
            } else if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = `Minimo ${fieldRules.minLength} caratteri`;
            } else if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
                errors[field] = `Massimo ${fieldRules.maxLength} caratteri`;
            }
        }
    }
    
    return errors;
}

// Gestione della formattazione delle date
export function formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    return format
        .replace('DD', String(d.getDate()).padStart(2, '0'))
        .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
        .replace('YYYY', d.getFullYear());
}

// Gestione della formattazione dei numeri
export function formatNumber(number, decimals = 2) {
    return new Intl.NumberFormat('it-IT', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
} 