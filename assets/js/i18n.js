const i18n = {
    async init() {
        const lang = localStorage.getItem('lang') || 'en';
        await this.setLanguage(lang);
    },

    async setLanguage(lang) {
        try {
            const response = await fetch(`./translations/${lang}.json`);
            const data = await response.json();
            
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (data[key]) el.textContent = data[key];
            });

            document.documentElement.lang = lang;
            const rtlLink = document.getElementById('rtl-style');
            if (lang === 'ar') {
                rtlLink.removeAttribute('disabled');
                rtlLink.href = 'assets/css/rtl.css';
            } else {
                rtlLink.setAttribute('disabled', 'true');
            }

            localStorage.setItem('lang', lang);
        } catch (error) {
            console.error('Translation error:', error);
        }
    }
};

window.setLanguage = (lang) => i18n.setLanguage(lang);
document.addEventListener('DOMContentLoaded', () => i18n.init());