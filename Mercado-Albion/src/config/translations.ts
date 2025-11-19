// Sistema completo de traducciones para la aplicación
export type Language = 'en' | 'es';

export interface Translations {
    // Home page
    searchResults: string;
    clearFilters: string;
    albionItems: string;
    showingItems: string;
    filteredItems: string;
    totalItems: string;
    sortedAlphabetically: string;
    loading: string;
    loadingItems: string;
    changingLanguage: string;
    
    // Categories with emojis
    weaponsTitle: string;
    armorTitle: string;
    resourcesTitle: string;
    foodTitle: string;
    unknownCategory: string;
    
    // Header
    weapons: string;
    armor: string;
    resources: string;
    food: string;
    searchPlaceholder: string;
    searchButton: string;
    selectLanguage: string;
    
    // Filter
    filters: string;
    results: string;
    of: string;
    selectAll: string;
    clearAll: string;
    tiers: string;
    
    // Item Card
    description: string;
    
    // No Items Message
    noItemsFound: string;
    noItemsAvailable: string;
    tryOtherTerms: string;
    tryOtherCategory: string;
    itemsLoading: string;
    
    // Language Change Modal
    languageChanging: string;
    languageChangingDesc: string;
    pleaseWait: string;
}

export const translations: Record<Language, Translations> = {
    en: {
        // Home page
        searchResults: 'Search results',
        clearFilters: 'Clear filters',
        albionItems: 'Albion Online Items',
        showingItems: 'Showing {count} items',
        filteredItems: '(filtered from {total} total)',
        totalItems: 'of {total} total',
        sortedAlphabetically: 'Sorted alphabetically • Maximum 200 results',
        loading: 'Loading items...',
        loadingItems: 'Loading items',
        changingLanguage: 'Changing language...',
        
        // Categories with emojis
        weaponsTitle: '🗡️ Weapons 🗡️',
        armorTitle: '🛡️ Armor 🛡️',
        resourcesTitle: '⛏️ Resources ⛏️',
        foodTitle: '🍖 Food 🍖',
        unknownCategory: 'Unknown category',
        
        // Header
        weapons: 'Weapons',
        armor: 'Armor',
        resources: 'Resources',
        food: 'Food',
        searchPlaceholder: 'Search items...',
        searchButton: 'Search',
        selectLanguage: 'Select language',
        
        // Filter
        filters: 'Filters',
        results: 'Results',
        of: 'of',
        selectAll: 'Select All',
        clearAll: 'Clear All',
        tiers: 'Tiers',
        
        // Item Card
        description: 'Description',
        
        // No Items Message
        noItemsFound: 'No items found',
        noItemsAvailable: 'No items available',
        tryOtherTerms: 'Try other search terms or use the menu categories',
        tryOtherCategory: 'Try another category or perform a specific search',
        itemsLoading: 'Items are loading... Please wait a moment',
        
        // Language Change Modal
        languageChanging: 'Changing Language',
        languageChangingDesc: 'Switching to English and updating content...',
        pleaseWait: 'Please wait'
    },
    es: {
        // Home page
        searchResults: 'Resultados de búsqueda',
        clearFilters: 'Limpiar filtros',
        albionItems: 'Items de Albion Online',
        showingItems: 'Mostrando {count} items',
        filteredItems: '(filtrados de {total} totales)',
        totalItems: 'de {total} totales',
        sortedAlphabetically: 'Ordenados alfabéticamente • Máximo 200 resultados',
        loading: 'Cargando items...',
        loadingItems: 'Cargando items',
        changingLanguage: 'Cambiando idioma...',
        
        // Categories with emojis
        weaponsTitle: '🗡️ Armas 🗡️',
        armorTitle: '🛡️ Armaduras 🛡️',
        resourcesTitle: '⛏️ Recursos ⛏️',
        foodTitle: '🍖 Comida 🍖',
        unknownCategory: 'Categoría desconocida',
        
        // Header
        weapons: 'Armas',
        armor: 'Armaduras',
        resources: 'Recursos',
        food: 'Comida',
        searchPlaceholder: 'Buscar items...',
        searchButton: 'Buscar',
        selectLanguage: 'Seleccionar idioma',
        
        // Filter
        filters: 'Filtros',
        results: 'Resultados',
        of: 'de',
        selectAll: 'Seleccionar Todo',
        clearAll: 'Limpiar Todo',
        tiers: 'Niveles',
        
        // Item Card
        description: 'Descripción',
        
        // No Items Message
        noItemsFound: 'No se encontraron items',
        noItemsAvailable: 'No hay items disponibles',
        tryOtherTerms: 'Intenta con otros términos de búsqueda o utiliza las categorías del menú',
        tryOtherCategory: 'Intenta con otra categoría o realiza una búsqueda específica',
        itemsLoading: 'Los items se están cargando... Por favor espera un momento',
        
        // Language Change Modal
        languageChanging: 'Cambiando Idioma',
        languageChangingDesc: 'Cambiando a Español y actualizando contenido...',
        pleaseWait: 'Por favor espera'
    }
};

// Función utilitaria para obtener traducciones con reemplazos
export function getTranslation(
    language: Language, 
    key: keyof Translations, 
    replacements?: Record<string, string | number>
): string {
    let text = translations[language][key] || translations.en[key] || key;
    
    if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
            text = text.replace(new RegExp(`{${placeholder}}`, 'g'), String(value));
        });
    }
    
    return text;
}