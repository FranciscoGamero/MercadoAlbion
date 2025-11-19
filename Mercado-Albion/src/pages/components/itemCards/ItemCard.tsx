import { Card } from 'primereact/card';
import './ItemCard.css';
import { CONFIG } from '../../../config/constants';

interface Item {
    id: string;
    descriptionVariable?: string;
    descriptionES?: string;
    descriptionEN?: string;
    tier?: string;
    titleES?: string;
    titleEN?: string;
}

interface ItemCardProps {
    item: Item;
    index: number;
    language?: string;
    onClick?: () => void; // Añadir propiedad opcional onClick
}

export function ItemCard({ item, index }: ItemCardProps) {
    // Obtener el idioma actual desde localStorage o usar 'ES-ES' por defecto
    const lang = (localStorage.getItem(CONFIG.LANG_KEY) || 'ES-ES').toLowerCase();

    // Determinar si el idioma es español
    const isES = lang === 'es' || lang === 'es-es';

    // Seleccionar el título y la descripción según el idioma
    const displayName = isES ? item.titleES || item.titleEN || item.id : item.titleEN || item.titleES || item.id;
    const displayDescription = isES ? item.descriptionES || item.descriptionEN : item.descriptionEN || item.descriptionES;

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
                    <div className='align-items-end item-card-img'>
                        <img className='item-card-img' src={`https://render.albiononline.com/v1/item/${item.id}.png`} alt={`${displayName} item`} />
                    </div>
                </div>

                {/* Descripción */}
                {Boolean(displayDescription) && (
                    <div className="mb-3 p-3 border-round-lg" style={{ background: 'rgba(168, 61, 6, 0.05)', border: '1px solid rgba(168, 61, 6, 0.1)' }}>
                        <div className="text-xs text-600 mb-1 uppercase font-bold">Descripción</div>
                        <div className="text-sm text-700 font-mono" style={{ fontSize: '0.75rem' }}>
                            {displayDescription}
                        </div>
                    </div>
                )}

                {/* Tier */}
                {item.tier && (
                    <div className="text-center mt-2">
                        <span className="text-sm font-bold" style={{ color: '#A83D06' }}>
                            Tier {item.tier.replace('T', '')}
                        </span>
                    </div>
                )}
                {!item.tier && (
                    <div className="text-center mt-2">
                        <span className="text-sm font-bold" style={{ color: '#A83D06' }}>
                            No hay Tier disponible
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}