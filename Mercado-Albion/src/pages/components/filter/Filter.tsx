import { Card } from 'primereact/card';
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';
import { Divider } from 'primereact/divider';
import './Filter.css';
interface FilterProps {
    availableTiers: string[];
    selectedTiers: string[];
    onTierChange: (tiers: string[]) => void;
    totalItems: number;
    filteredItems: number;
}

export function Filter({
    availableTiers,
    selectedTiers,
    onTierChange,
    totalItems,
    filteredItems
}: FilterProps) {
    // Convertir tiers a opciones para MultiSelect ordenados del 1 al 8
    const tierOptions = availableTiers
        .sort((a, b) => {
            const numA = parseInt(a.replace('T', ''));
            const numB = parseInt(b.replace('T', ''));
            return numA - numB;
        })
        .map(tier => ({
            name: tier,
            value: tier
        }));

    const selectAll = selectedTiers.length === availableTiers.length && availableTiers.length > 0;

    return (
        <div className='minWidth'>
            <Card
                className="h-full shadow-3 border-round-lg"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,248,240,0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(168,61,6,0.2)'
                }}
            >
                <div className="p-4">
                    {/* Título */}
                    <div className="flex align-items-center gap-2 mb-4">
                        <i className="pi pi-filter text-xl" style={{ color: '#A83D06' }}></i>
                        <h3 className="m-0 text-lg font-bold" style={{ color: '#A83D06' }}>Filtros</h3>
                    </div>

                    {/* Estadísticas */}
                    <div className="mb-4 p-3 border-round-lg" style={{ background: 'rgba(168,61,6,0.1)' }}>
                        <div className="text-sm text-600 mb-1">Resultados</div>
                        <div className="text-lg font-bold" style={{ color: '#A83D06' }}>
                            {filteredItems} de {totalItems}
                        </div>
                    </div>

                    <Divider />

                    {/* Filtro por Tier */}
                    <div className="mb-4">
                        <FloatLabel>
                            <MultiSelect
                                id="ms-tiers"
                                value={selectedTiers}
                                onChange={(e) => {
                                    onTierChange(e.value);
                                }}
                                onSelectAll={(e) => {
                                    onTierChange(e.checked ? [] : availableTiers);
                                }}
                                options={tierOptions}
                                optionLabel="name"
                                optionValue="value"
                                display="chip"
                                selectAll={selectAll}
                                maxSelectedLabels={3}
                                className="w-full"
                                placeholder="Filtrar por Tier"
                                showSelectAll={true}
                            />
                            <label htmlFor="ms-tiers">Tier</label>
                        </FloatLabel>
                    </div>

                    {availableTiers.length === 0 && (
                        <div className="text-center text-600 p-4">
                            <i className="pi pi-info-circle text-2xl mb-2"></i>
                            <div>Selecciona una categoría para ver los filtros disponibles</div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}