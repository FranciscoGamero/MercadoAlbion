import { useState, useMemo, useCallback } from 'react';
import { Card } from 'primereact/card';
import { useAlbionItems } from '../hooks/useAlbionItems';
import type { Item } from '../hooks/useAlbionItems';
import { useDebounce } from '../hooks/useDebounce';
import { Header } from './components/header/Header';
import { Filter } from './components/filter/Filter';
import { ItemCard } from './components/itemCards/ItemCard';
import { ItemDetails } from './components/itemDetails/ItemDetails';

export function Home() {
    const { items, loading } = useAlbionItems();
    const [language, setLanguage] = useState<string>(() => (localStorage.getItem('albion_language') || 'ES-ES'));
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    // Debounce la búsqueda para mejor rendimiento
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const applyFilters = useCallback((itemsToFilter: typeof items, includeTierFilter = false) => {
        let filtered = itemsToFilter;

        // Aplicar filtro de búsqueda con debounce
        if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
            const searchTerm = debouncedSearchQuery.toLowerCase().trim();
            filtered = filtered.filter(item => {
                return (
                    (language === 'ES-ES' ? item.titleES : item.titleEN)?.toLowerCase().includes(searchTerm) ||
                    item.id.toLowerCase().includes(searchTerm)
                );
            });
        }

        // Aplicar filtro por categoría
        if (categoryFilter) {
            filtered = filtered.filter(item => {
                const id = item.id.toLowerCase();
                const name = (language === 'ES-ES' ? item.titleES : item.titleEN) || '';
                const descVar = item.descriptionVariable?.toLowerCase() || '';
                
                switch (categoryFilter) {
                    case 'weapons':
                        const weaponPatterns = ['sword', 'bow', 'axe', 'hammer', 'dagger', 'spear', 'staff', 'crossbow', 'mace', 'torch', 'shield'];
                        const weaponSpanish = ['espada', 'arco', 'hacha', 'martillo', 'daga', 'lanza', 'bastón', 'ballesta', 'maza', 'antorcha','escudo'];
                        
                        return weaponPatterns.some(weapon => 
                            id.includes(weapon) || 
                            name.toLowerCase().includes(` ${weapon}`) || 
                            name.toLowerCase().endsWith(weapon) ||
                            name.toLowerCase().startsWith(weapon)
                        ) || weaponSpanish.some(weapon => name.toLowerCase().includes(weapon));
                        
                    case 'armor':
                        const armorPatterns = ['helmet', 'armor', 'boots', 'cape', 'robe', 'cowl','sandals', 'hood', 'jacket', 'shoes'];
                        const armorSpanish = ['casco', 'armadura', 'botas', 'capa', 'túnica', 'hábito', 'túnica', 'sandalias', 'capucha', 'chaqueta', 'zapatos'];
                        
                        return armorPatterns.some(armor => 
                            id.includes(armor) || 
                            name.toLowerCase().includes(` ${armor}`) || 
                            name.toLowerCase().endsWith(armor) ||
                            name.toLowerCase().startsWith(armor)
                        ) || armorSpanish.some(armor => name.toLowerCase().includes(armor));
                        
                    case 'resources':
                        return descVar.includes('@items_ore_desc') ||
                               descVar.includes('@items_wood_desc') ||
                               descVar.includes('@items_stone_desc') ||
                               descVar.includes('@items_fiber_desc') ||
                               descVar.includes('@items_hide_desc') ||
                               descVar.includes('@items_leather_desc') ||
                               descVar.includes('@items_cloth_desc') ||
                               descVar.includes('@items_metalbar_desc') ||
                               descVar.includes('@items_planks_desc') ||
                               descVar.includes('@items_stoneblock_desc') ||
                               descVar.includes('@items_essence_desc');
                        
                    case 'food':
                        return descVar.includes('@items_consumable_desc') ||
                               descVar.includes('@items_meal_desc') ||
                               descVar.includes('@items_fish_desc') ||
                               descVar.includes('MEAL_') ||
                               descVar.includes('FISH_');
                        
                    default:
                        return true;
                }
            });
        }

        // Aplicar filtro por tier solo si se especifica
        if (includeTierFilter && selectedTiers.length > 0) {
            filtered = filtered.filter(item => 
                item.tier && selectedTiers.includes(item.tier)
            );
        }

        return filtered;
    }, [debouncedSearchQuery, categoryFilter, selectedTiers, language]);

    // Items filtrados para mostrar (incluye filtro de tier)
    const filteredItems = useMemo(() => {
        const filtered = applyFilters(items, true);

        // Ordenar y limitar resultados para rendimiento
        const sorted = filtered.sort((a, b) => {
            const nameA = (language === 'ES-ES' ? a.titleES : a.titleEN)?.toLowerCase() || '';
            const nameB = (language === 'ES-ES' ? b.titleES : b.titleEN)?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
        });

        return sorted.slice(0, 200);
    }, [items, applyFilters]);

    // Obtener tiers disponibles de los items filtrados (sin filtro de tier)
    const availableTiers = useMemo(() => {
        const baseFiltered = applyFilters(items, false);
        
        const tiers = [...new Set(baseFiltered
            .map(item => item.tier)
            .filter(tier => tier !== undefined)
        )] as string[];
        
        return tiers;
    }, [items, applyFilters]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCategoryFilter(null);
    };

    const handleFilterByCategory = (category: string) => {
        setCategoryFilter(category);
        setSearchQuery('');
    };

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredItems.slice(startIndex, endIndex);
    }, [filteredItems, currentPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
    };

    if (selectedItem) {
        return <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />;
    }

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #A83D06 0%, #D2691E 100%)' }}>
                <Card className="text-center p-6 shadow-4 border-round-xl" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                    <div className="flex flex-column align-items-center gap-3">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem', color: '#A83D06' }}></i>
                        <h2 className="mt-0 mb-2" style={{ color: '#A83D06' }}>⚔️ Cargando items de Albion Online...</h2>
                        <p className="text-600 mb-0">Preparando el mercado para ti</p>
                    </div>
                </Card>
            </div>
        );
    }

    const getCategoryName = (category: string) => {
        const categoryMap: Record<string, string> = {
            'weapons': '🗡️ Armas 🗡️',
            'armor': '🛡️ Armaduras 🛡️',
            'resources': '⛏️ Recursos ⛏️',
            'food': '🍖 Comida 🍖'
        };
        return categoryMap[category] || 'Categoría desconocida';
    };

    return (
        <>
            <Header
                onSearch={handleSearch}
                onFilterByCategory={handleFilterByCategory}
                activeCategory={categoryFilter}
                onLanguageChange={(lang) => setLanguage(lang)}
            />
            <div className="p-4 min-h-screen" style={{ background: 'linear-gradient(135deg, #A83D06 0%, #D2691E 100%)' }}>
                <Card className="mb-4 p-4 shadow-4 border-round-xl" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                    <h1 className="text-3xl font-bold mt-0 mb-3" style={{ background: 'linear-gradient(45deg, #A83D06, #D2691E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {debouncedSearchQuery ? `🔍 Resultados de búsqueda: "${debouncedSearchQuery}"` :
                            categoryFilter ? `${getCategoryName(categoryFilter)}` :
                                `🗡️ Items de Albion Online`}
                    </h1>
                    <div className="text-lg">
                        📊 Total de items: {items.length}
                    </div>
                </Card>

                <div className="grid">
                        {/* Filtro lateral */}
                    <div className="col-12 lg:col-3 xl:col-2">
                        <Filter
                            availableTiers={availableTiers}
                            selectedTiers={selectedTiers}
                            onTierChange={setSelectedTiers}
                            totalItems={items.length}
                            filteredItems={filteredItems.length}
                        />
                    </div>

                    {/* Lista de items */}
                    <div className="col-12 lg:col-9 xl:col-10">
                        <div className="grid">
                            {paginatedItems.map((item, itemIndex) => (
                                <div key={item.id} className="col-12 md:col-6 lg:col-4">
                                    <ItemCard
                                        item={item}
                                        index={itemIndex}
                                        language={language}
                                        onClick={() => handleItemClick(item)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-content-center align-items-center gap-2 mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="p-button p-component"
                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        <span className="p-button-icon pi pi-chevron-left"></span>
                        <span className="p-button-label">Página anterior</span>
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="p-button p-component"
                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        <span className="p-button-label">Siguiente página</span>
                        <span className="p-button-icon pi pi-chevron-right"></span>
                    </button>
                </div>

                <Card className="mt-4 shadow-3 border-round-lg" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                    <div className="text-center p-4">
                        <div className="text-lg font-medium text-900">
                            📊 Mostrando {paginatedItems.length} items
                            {(debouncedSearchQuery || categoryFilter) ? (
                                <span className="text-primary">
                                    {' '}(filtrados de {items.length} totales)
                                </span>
                            ) : (
                                <span className="text-600">
                                    {' '}de {filteredItems.length} totales
                                </span>
                            )}
                        </div>
                        <div className="text-600 text-sm mt-2">
                            Solo en español • Diseño completo con numeración • Máximo 30 items por página
                        </div>
                    </div>
                </Card>


            </div>
        </>
    ); // Cierre correcto del componente Home
}