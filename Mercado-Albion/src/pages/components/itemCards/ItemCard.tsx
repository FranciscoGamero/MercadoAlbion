import { useMemo } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import './ItemCard.css';

interface Item {
    id: string;
title: string
    descriptionVariable?: string;
    itemDescription?: string;
    tier?: string;
}

interface ItemCardProps {
    item: Item;
    index: number;
    getName: (id: string) => string | undefined;
}

export function ItemCard({ item, index, getName }: ItemCardProps) {
    const displayName = useMemo(() => getName(item.id), [item.id, getName]);
    
    return (
        <Card 
            className="item-card h-full shadow-3 border-round-xl hover:shadow-6 transition-all transition-duration-300 cursor-pointer overflow-hidden"
            style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,248,240,0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(168,61,6,0.2)'
            }}
        >
            <div className="p-4">
                {/* Header con número y nombre */}
                <div className="flex align-items-center justify-content-between mb-3 pb-3 border-bottom-1" style={{ borderColor: 'rgba(168, 61, 6, 0.2)' }}>
                    <div className="flex align-items-center gap-2">
                        <div 
                            className="flex align-items-center justify-content-center border-circle text-white font-bold text-sm"
                            style={{ 
                                background: 'linear-gradient(45deg, #A83D06, #D2691E)', 
                                width: '2rem', 
                                height: '2rem',
                                minWidth: '2rem'
                            }}
                        >
                            {index + 1}
                        </div>
                        <div className="text-lg font-semibold text-900 line-height-3">
                            {displayName}
                        </div>
                    </div>
                </div>

                {/* ID Badge y Tier */}
                <div className="mb-3 flex flex-wrap gap-2">
                    <Tag 
                        value={item.id}
                        className="font-mono text-xs px-2 py-1"
                        style={{ 
                            background: 'rgba(168, 61, 6, 0.1)', 
                            color: '#A83D06',
                            border: '1px solid rgba(168, 61, 6, 0.3)'
                        }}
                    />
                    {item.tier && (
                        <Tag 
                            value={item.tier}
                            severity="info"
                            className="text-xs px-2 py-1 font-bold"
                        />
                    )}
                </div>

                {/* Descripción */}
                {item.itemDescription && (
                    <div className="mb-3 p-3 border-round-lg" style={{ background: 'rgba(168, 61, 6, 0.05)', border: '1px solid rgba(168, 61, 6, 0.1)' }}>
                        <div className="text-xs text-600 mb-1 uppercase font-bold">Descripción</div>
                        <div className="text-sm text-700 font-mono" style={{ fontSize: '0.75rem' }}>
                            {item.itemDescription}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}