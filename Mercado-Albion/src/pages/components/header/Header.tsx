import { useState } from 'react';
import type { ReactElement } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import './Header.css';

interface MenuItemType {
    label: string;
    icon: string | ReactElement;
    onClick: () => void;
}

interface HeaderProps {
    onSearch?: (query: string) => void;
    onFilterByCategory?: (category: string) => void;
}

export function Header({ onSearch, onFilterByCategory }: HeaderProps = {}) {
    const [searchQuery, setSearchQuery] = useState('');

    const menuItems: MenuItemType[] = [
        {
            label: 'Armas',
            icon: <img src="/sword-svgrepo-com.svg" alt="Sword" className="w-1rem h-1rem" />,
            onClick: () => {
                onFilterByCategory?.('weapons');
            }
        },
        {
            label: 'Armaduras',
            icon: 'bi bi-shield-fill',
            onClick: () => {
                onFilterByCategory?.('armor');
            }
        },
        {
            label: 'Recursos',
            icon: 'bi bi-gem',
            onClick: () => {
                onFilterByCategory?.('resources');
            }
        },
        {
            label: 'Comida',
            icon: 'bi bi-cup-hot-fill',
            onClick: () => {
                onFilterByCategory?.('food');
            }
        }
    ];

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch?.(searchQuery.trim());
        }
    };

    return (
        <div className="surface-card shadow-2 w-full alturaHeader">
            <div className="flex justify-content-between align-items-center w-full p-3 custom-header">
                {/* Logo */}
                <div className="flex align-items-center">
                    <img 
                        src="https://cdn2.steamgriddb.com/logo_thumb/a028123bdd01ea9ff8dc3c780e9c0cd8.png" 
                        alt="Albion Online Logo" 
                        className="h-3rem"
                    />
                </div>

                {/* Menu Items */}
                <div className="flex align-items-center gap-3 menu-container">
                    {menuItems.map((item, index) => (
                        <button 
                            key={index}
                            className="menu-item flex align-items-center gap-2 p-3 border-none bg-transparent cursor-pointer"
                            onClick={item.onClick}
                        >
                            <span className="menu-icon">
                                {typeof item.icon === 'string' ? (
                                    <i className={item.icon}></i>
                                ) : (
                                    item.icon
                                )}
                            </span>
                            <span className="menu-label">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex align-items-center gap-2">
                    <IconField iconPosition="left" className="w-full sm:w-20rem">
                        <InputText 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar items..."
                            className="w-full"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                    </IconField>
                    <Button
                        icon="pi pi-search"
                        onClick={handleSearch}
                        severity="secondary"
                        outlined
                        size="small"
                        className="hidden sm:inline-flex"
                        tooltip="Buscar"
                        tooltipOptions={{ position: 'bottom' }}
                    />
                </div>
            </div>
        </div>
    );
}
