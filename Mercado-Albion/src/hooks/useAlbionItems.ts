import { useState, useEffect } from 'react';
import localItems from '../assets/locales/item.json';

// Definir el tipo explícito para los datos locales
interface LocalItem {
    UniqueName: string;
    LocalizationDescriptionVariable: string;
    LocalizedNames: {
        [key: string]: string;
    };
    LocalizedDescriptions: {
        [key: string]: string;
    };
}

const typedLocalItems: LocalItem[] = localItems as LocalItem[];

export interface Item {
    id: string;
    descriptionVariable?: string; // Permitir que sea opcional
    itemDescription?: string;
    tier?: string;
    // Campos por idioma
    titleES?: string;
    titleEN?: string;
    descriptionES?: string;
    descriptionEN?: string;
}

export function useAlbionItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                console.log('Iniciando carga de datos...');
                const mappedItems = typedLocalItems
                    .map(i => {
                        if (!i.UniqueName || !i.LocalizedNames || !i.LocalizedDescriptions) {
                            console.warn('Elemento inválido detectado:', i);
                            return null;
                        }
                        
                        // Extraer el tier del UniqueName si está presente
                        const tierMatch = i.UniqueName.match(/T\d+/); // Busca patrones como "T4", "T5", etc.
                        const tier = tierMatch ? tierMatch[0] : undefined;

                        return {
                            id: i.UniqueName,
                            descriptionVariable: i.LocalizationDescriptionVariable || '',
                            titleES: i.LocalizedNames['ES-ES'] || '',
                            titleEN: i.LocalizedNames['EN-US'] || '',
                            descriptionES: i.LocalizedDescriptions['ES-ES'] || '',
                            descriptionEN: i.LocalizedDescriptions['EN-US'] || '',
                            tier: tier // Asignar el tier extraído
                        } as Item; // Forzar el tipo a Item
                    })
                    .filter((item): item is Item => item !== null); // Asegurar que el tipo sea Item

                console.log('Datos mapeados correctamente:', mappedItems);
                setItems(mappedItems);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);
    return { items, loading };
}