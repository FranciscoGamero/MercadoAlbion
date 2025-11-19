import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

interface NoItemsMessageProps {
    searchQuery: string;
    categoryFilter: string | null;
    onClearFilters: () => void;
}

export function NoItemsMessage({ searchQuery, categoryFilter, onClearFilters }: NoItemsMessageProps) {
    return (
        <Card 
            className="border-round-xl shadow-4"
            style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
            }}
        >
            <div className="text-center p-6">
                <div 
                    className="inline-flex align-items-center justify-content-center border-circle mb-4"
                    style={{ 
                        background: 'linear-gradient(45deg, #A83D06, #D2691E)', 
                        width: '5rem', 
                        height: '5rem',
                        fontSize: '2rem'
                    }}
                >
                    🔍
                </div>
                <div className="text-xl font-semibold mb-2" style={{ color: '#A83D06' }}>
                    {searchQuery || categoryFilter ? 
                        'No se encontraron items' : 
                        'No hay items disponibles'
                    }
                </div>
                <div className="text-600 mb-4 line-height-3">
                    {searchQuery ? 
                        'Intenta con otros términos de búsqueda o utiliza las categorías del menú' : 
                        categoryFilter ?
                        'Intenta con otra categoría o realiza una búsqueda específica' :
                        'Los items se están cargando... Por favor espera un momento'
                    }
                </div>
                {(searchQuery || categoryFilter) && (
                    <Button
                        label="Limpiar filtros"
                        icon="pi pi-times"
                        className="mt-3"
                        style={{
                            background: 'linear-gradient(45deg, #A83D06, #D2691E)',
                            border: 'none',
                            color: 'white'
                        }}
                        onClick={onClearFilters}
                    />
                )}
            </div>
        </Card>
    );
}