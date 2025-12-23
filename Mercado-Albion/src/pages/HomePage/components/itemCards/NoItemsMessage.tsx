import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

interface NoItemsMessageProps {
    searchQuery: string;
    categoryFilter: string | null;
    onClearFilters: () => void;
}

export function NoItemsMessage({ searchQuery, categoryFilter, onClearFilters }: NoItemsMessageProps) {
    const { t } = useTranslation();
    
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
                        t('no_items_found') : 
                        t('no_items_available')
                    }
                </div>
                <div className="text-600 mb-4 line-height-3">
                    {searchQuery ? 
                        t('try_other_terms') : 
                        categoryFilter ?
                        t('try_other_category') :
                        t('items_loading')
                    }
                </div>
                {(searchQuery || categoryFilter) && (
                    <Button
                        label={t('clear_filters')}
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