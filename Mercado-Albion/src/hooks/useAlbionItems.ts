import { useState, useEffect } from 'react';
import { CONFIG } from '../config/constants';

interface Item {
    id: string;
    en: string;
    es: string;
}

export function useAlbionItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [language, setLanguage] = useState<'en' | 'es'>(() => {
        const saved = localStorage.getItem(CONFIG.LANG_KEY);
        return (saved as 'en' | 'es') || (navigator.language.startsWith('es') ? 'es' : 'en');
    });

    const setLang = (lang: 'en' | 'es') => {
        setLanguage(lang);
        localStorage.setItem(CONFIG.LANG_KEY, lang);
    };

    useEffect(() => {
        // Limpiar caché temporal para debug
        localStorage.removeItem(CONFIG.CACHE_KEY);
        
        const cached = localStorage.getItem(CONFIG.CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CONFIG.CACHE_TIME) {
                setItems(data);
                setLoading(false);
                return;
            }
        }

        fetch(CONFIG.ITEMS_API)
            .then(r => r.json())
            .then((raw: any[]) => {
                console.log('Raw data primer item:', raw[0]);
                console.log('UniqueName del primer item:', raw[0]?.UniqueName);
                const clean = raw
                    .filter(i => i.LocalizedNames && i.UniqueName && !i.UniqueName.startsWith('@'))
                    .map(i => {
                        const mapped = {
                            id: i.UniqueName,
                            en: i.LocalizedNames['EN-US'] || i.UniqueName,
                            es: i.LocalizedNames['ES-ES'] || i.LocalizedNames['EN-US'] || i.UniqueName
                        };
                        console.log('Item mapeado:', mapped);
                        return mapped;
                    });
                
                console.log('Clean data primeros 3:', clean.slice(0, 3));
                localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify({ data: clean, timestamp: Date.now() }));
                setItems(clean);
            })
            .finally(() => setLoading(false));
    }, []);

    const getName = (id: string) => {
        if (!id) return id;
        const item = items.find(i => i.id === id);
        return item ? (language === 'es' ? item.es : item.en) : id;
    };

    return { items, loading, getName, language, setLang };
}