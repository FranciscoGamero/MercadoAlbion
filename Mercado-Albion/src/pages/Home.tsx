import { useState, useMemo } from 'react';
import { useAlbionItems } from '../hooks/useAlbionItems';
import { Header } from './components/header/Header';

export function Home() {
    const { items, loading, getName, language, setLang } = useAlbionItems();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    // Función de búsqueda que busca en ambos idiomas
    const filteredItems = useMemo(() => {
        let filtered = items;

        // Eliminar duplicados basados en el ID
        const uniqueItems = filtered.filter((item, index, self) => 
            index === self.findIndex(i => i.id === item.id)
        );
        
        filtered = uniqueItems;

        // Aplicar filtro de búsqueda
        if (searchQuery) {
            filtered = filtered.filter(item => {
                const searchTerm = searchQuery.toLowerCase();
                return (
                    item.en.toLowerCase().includes(searchTerm) ||
                    item.es.toLowerCase().includes(searchTerm) ||
                    item.id.toLowerCase().includes(searchTerm)
                );
            });
        }

        // Aplicar filtro por categoría (básico por palabras clave en el nombre)
        if (categoryFilter) {
            filtered = filtered.filter(item => {
                const name = item.en.toLowerCase();
                const nameEs = item.es.toLowerCase();
                
                switch (categoryFilter) {
                    case 'weapons':
                        return name.includes('sword') || name.includes('bow') || name.includes('axe') || 
                               name.includes('hammer') || name.includes('staff') || name.includes('dagger') ||
                               nameEs.includes('espada') || nameEs.includes('arco') || nameEs.includes('hacha');
                    case 'armor':
                        return name.includes('helmet') || name.includes('armor') || name.includes('boots') ||
                               name.includes('cape') || name.includes('hood') ||
                               nameEs.includes('casco') || nameEs.includes('armadura') || nameEs.includes('botas');
                    case 'resources':
                        return name.includes('ore') || name.includes('wood') || name.includes('stone') ||
                               name.includes('fiber') || name.includes('hide') ||
                               nameEs.includes('mineral') || nameEs.includes('madera') || nameEs.includes('piedra');
                    case 'food':
                        return name.includes('bread') || name.includes('soup') || name.includes('pie') ||
                               name.includes('stew') || name.includes('salad') ||
                               nameEs.includes('pan') || nameEs.includes('sopa') || nameEs.includes('pastel');
                    default:
                        return true;
                }
            });
        }

        // Ordenar por nombre para que sea más fácil navegar
        return filtered.sort((a, b) => {
            const nameA = (language === 'es' ? a.es : a.en).toLowerCase();
            const nameB = (language === 'es' ? b.es : b.en).toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }, [items, searchQuery, categoryFilter, language]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCategoryFilter(null); // Limpiar filtro de categoría al buscar
    };

    const handleFilterByCategory = (category: string) => {
        setCategoryFilter(category);
        setSearchQuery(''); // Limpiar búsqueda al filtrar por categoría
    };

    if (loading) {
        return <div>Cargando items...</div>;
    }

    // Debug: verificar los datos que llegan
    const uniqueItemsCount = items.filter((item, index, self) => 
        index === self.findIndex(i => i.id === item.id)
    ).length;
    
    console.log('Items totales:', items.length);
    console.log('Items únicos:', uniqueItemsCount);
    console.log('Items filtrados:', filteredItems.length);
    console.log('Duplicados eliminados:', items.length - uniqueItemsCount);

    return (
        <>
            <Header onSearch={handleSearch} onFilterByCategory={handleFilterByCategory} />
            <div style={{ 
                padding: '20px',
                backgroundColor: '#f8f9fa',
                minHeight: '100vh'
            }}>
                <div style={{ 
                    marginBottom: '30px',
                    backgroundColor: '#ffffff',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    <h1 style={{
                        margin: '0 0 15px 0',
                        color: '#2c3e50',
                        fontSize: '28px',
                        fontWeight: '600'
                    }}>
                        {searchQuery ? `🔍 Resultados de búsqueda: "${searchQuery}"` : 
                         categoryFilter ? `📂 Filtrado por categoría` : 
                         '🗡️ Items de Albion Online'}
                    </h1>
                    
                    {(searchQuery || categoryFilter) && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setCategoryFilter(null);
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginTop: '15px',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(231, 76, 60, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#c0392b';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#e74c3c';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            ✖️ Limpiar filtros
                        </button>
                    )}

                    {/* Selector de idioma */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ 
                            display: 'inline-flex',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            padding: '4px',
                            border: '1px solid #e9ecef'
                        }}>
                            <button
                                onClick={() => setLang('es')}
                                style={{
                                    padding: '10px 18px',
                                    backgroundColor: language === 'es' ? '#3498db' : 'transparent',
                                    color: language === 'es' ? 'white' : '#495057',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease',
                                    marginRight: '4px'
                                }}
                            >
                                🇪🇸 Español
                            </button>
                            <button
                                onClick={() => setLang('en')}
                                style={{
                                    padding: '10px 18px',
                                    backgroundColor: language === 'en' ? '#3498db' : 'transparent',
                                    color: language === 'en' ? 'white' : '#495057',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                🇺🇸 English
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de items */}
                <div style={{ 
                    display: 'grid', 
                    gap: '15px',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
                }}>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                style={{
                                    padding: '20px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '12px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <div style={{ 
                                    fontWeight: 'bold', 
                                    marginBottom: '8px',
                                    fontSize: '16px',
                                    color: '#2c3e50'
                                }}>
                                    {index + 1}. {getName(item.id)}
                                </div>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#7f8c8d',
                                    marginBottom: '6px',
                                    fontFamily: 'monospace',
                                    backgroundColor: '#f8f9fa',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                }}>
                                    ID: {item.id}
                                </div>
                                <div style={{ 
                                    fontSize: '14px', 
                                    color: '#34495e',
                                    lineHeight: '1.4'
                                }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <strong style={{ color: '#e74c3c' }}>🇺🇸</strong> {item.en}
                                    </div>
                                    <div>
                                        <strong style={{ color: '#f39c12' }}>🇪🇸</strong> {item.es}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ 
                            padding: '60px 40px', 
                            textAlign: 'center', 
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ 
                                fontSize: '48px', 
                                marginBottom: '16px'
                            }}>
                                🔍
                            </div>
                            <div style={{
                                fontSize: '18px',
                                color: '#34495e',
                                fontWeight: '500',
                                marginBottom: '8px'
                            }}>
                                {searchQuery || categoryFilter ? 
                                    'No se encontraron items' : 
                                    'No hay items disponibles'
                                }
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#7f8c8d'
                            }}>
                                {searchQuery ? 
                                    `Intenta con otros términos de búsqueda` : 
                                    categoryFilter ?
                                    'Intenta con otra categoría' :
                                    'Los items se cargarán automáticamente'
                                }
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ 
                    marginTop: '30px', 
                    padding: '15px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    textAlign: 'center'
                }}>
                    <div style={{ 
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}>
                        📊 Mostrando {filteredItems.length} items
                        {(searchQuery || categoryFilter) ? (
                            <span style={{ color: '#3498db' }}>
                                {' '}(filtrados de {items.length} totales)
                            </span>
                        ) : (
                            <span style={{ color: '#7f8c8d' }}>
                                {' '}de {items.length} totales
                            </span>
                        )}
                    </div>
                    {(searchQuery || categoryFilter) && (
                        <div style={{ 
                            color: '#7f8c8d',
                            fontSize: '14px',
                            marginTop: '5px'
                        }}>
                            Sin duplicados, ordenados alfabéticamente
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}