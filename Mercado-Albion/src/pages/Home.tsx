import { useState, useMemo } from 'react';
import { Card } from 'primereact/card';
import { useAlbionItems } from '../hooks/useAlbionItems';
import { useDebounce } from '../hooks/useDebounce';
import { Header } from './components/header/Header';
import { Filter } from './components/filter/Filter';
import { ItemCard } from './components/itemCards/ItemCard';

export function Home() {
    const { items, loading, getName } = useAlbionItems();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
    
    // Debounce la búsqueda para mejor rendimiento
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Filtrar items basado en búsqueda y categoría
    const filteredItems = useMemo(() => {
        let filtered = items;

        // Aplicar filtro de búsqueda con debounce
        if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
            const searchTerm = debouncedSearchQuery.toLowerCase().trim();
            filtered = filtered.filter(item => {
                return (
                    item.title.toLowerCase().includes(searchTerm) ||
                    item.id.toLowerCase().includes(searchTerm)
                );
            });
        }

        // Aplicar filtro por categoría
        if (categoryFilter) {
            filtered = filtered.filter(item => {
                const id = item.id.toLowerCase();
                const name = item.title;
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

        // Aplicar filtro por tier
        if (selectedTiers.length > 0) {
            filtered = filtered.filter(item => 
                item.tier && selectedTiers.includes(item.tier)
            );
        }

        // Ordenar y limitar resultados
        const sorted = filtered.sort((a, b) => {
            const nameA = a.title.toLowerCase();
            const nameB = b.title.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        return sorted.slice(0, 200);
    }, [items, debouncedSearchQuery, categoryFilter, selectedTiers]);

    // Obtener tiers disponibles
    const availableTiers = useMemo(() => {
        const tiers = [...new Set(items
            .map(item => item.tier)
            .filter(tier => tier !== undefined)
        )] as string[];
        
        return tiers;
    }, [items]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCategoryFilter(null);
    };

    const handleFilterByCategory = (category: string) => {
        setCategoryFilter(category);
        setSearchQuery('');
    };

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

            {/* Layout principal con filtro lateral */}
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
                        {filteredItems.slice(0, 50).map((item, itemIndex) => (
                            <div key={item.id} className="col-12 md:col-6 lg:col-4">
                                <ItemCard 
                                    item={item} 
                                    index={itemIndex} 
                                    getName={getName}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Card className="mt-4 shadow-3 border-round-lg" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="text-center p-4">
                    <div className="text-lg font-medium text-900">
                        📊 Mostrando {Math.min(filteredItems.length, 50)} items
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
                        Solo en español • Diseño completo con numeración • Máximo 50 items por página
                    </div>
                </div>
            </Card>
        </div>
        </>
    );
}