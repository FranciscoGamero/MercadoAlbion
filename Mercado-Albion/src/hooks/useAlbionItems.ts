import { useState, useEffect } from 'react';
import { CONFIG } from '../config/constants';

interface Item {
    id: string;
    title: string;
    descriptionVariable?: string;
    itemDescription?: string;
    tier?: string;
}

export function useAlbionItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = localStorage.getItem(CONFIG.CACHE_KEY);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CONFIG.CACHE_TIME) {
                    setItems(data);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.log('Error parsing cache:', error);
            }
        }

        setLoading(true);

        // Intentar múltiples URLs hasta encontrar una que funcione
        const tryUrls = [
            "https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.json",
            "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/main/formatted/items.json",
            "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json"
        ];

        const fetchFromUrls = async (urls: string[]): Promise<any[]> => {
            for (const url of urls) {
                try {
                    console.log(`Intentando cargar desde: ${url}`);
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        if (Array.isArray(data) && data.length > 0) {
                            return data;
                        }
                    }
                } catch (error) {
                    console.log(`❌ Error con URL ${url}:`, error);
                }
            }
            try {
                console.log('📁 Intentando cargar archivo local como fallback...');
                const response = await fetch('/items.json');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        console.log('✅ Datos cargados desde archivo local');
                        return data;
                    }
                }
            } catch (error) {
                console.log('❌ Error cargando archivo local:', error);
            }

            throw new Error('No se pudieron cargar los datos desde ninguna fuente');
        };

        fetchFromUrls(tryUrls)
            .then((raw: any[]) => {
                const clean = raw
                    .filter(i => i.LocalizedNames && i.UniqueName && !i.UniqueName.startsWith('@'))
                    .map(i => {
                        // Extraer tier del UniqueName (ej: T4_ORE -> T4)
                        const tierMatch = i.UniqueName.match(/^T(\d+)_/);
                        const tier = tierMatch ? `T${tierMatch[1]}` : undefined;

                        const mapped = {
                            id: i.UniqueName,
                            title: i.LocalizedNames['ES-ES'] || i.LocalizedNames['EN-US'] || i.UniqueName,
                            descriptionVariable: i.LocalizationDescriptionVariable,
                            itemDescription: i.LocalizedDescriptions ?
                                (i.LocalizedDescriptions['EN-US'] || i.LocalizedDescriptions['ES-ES']) : undefined,
                            tier: tier
                        };
                        return mapped;
                    });

                // Guardar en caché
                localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify({ data: clean, timestamp: Date.now() }));
                setItems(clean);
            })
            .catch((error) => {
                console.error('Error cargando items:', error);
                // Cargar datos de respaldo si hay error
                setItems([]);
            })
            .finally(() => setLoading(false));
    }, []); // Solo cargar una vez

    const getName = (id: string) => {
        if (!id) return id;
        const item = items.find(i => i.id === id);
        return item?.title;
    };

    return { items, loading, getName };
}