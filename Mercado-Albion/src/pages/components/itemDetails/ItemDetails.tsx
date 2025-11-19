import { Card } from 'primereact/card';

interface ItemDetailsProps {
    item: {
        id: string;
        titleES?: string;
        titleEN?: string;
        descriptionES?: string;
        descriptionEN?: string;
        tier?: string;
    };
    onClose: () => void;
}

export function ItemDetails({ item, onClose }: ItemDetailsProps) {
    const language = (localStorage.getItem('albion_language') || 'ES-ES').toLowerCase();
    const isES = language === 'es' || language === 'es-es';

    return (
        <div className="item-details-overlay">
            <Card className="item-details-card">
                <button className="close-button" onClick={onClose}>X</button>
                <h1>{isES ? item.titleES : item.titleEN}</h1>
                <p>{isES ? item.descriptionES : item.descriptionEN}</p>
                {item.tier && <p><strong>Tier:</strong> {item.tier}</p>}
                <p><strong>ID:</strong> {item.id}</p>
            </Card>
        </div>
    );
}