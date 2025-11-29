import { useState } from 'react';
import type { ReactElement } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import './Header.css';
import { ES as FlagES, US as FlagUS } from 'country-flag-icons/react/3x2';
import { CONFIG } from '../../../config/constants';

interface MenuItemType {
    label: string;
    icon: string | ReactElement;
    onClick: () => void;
}

interface HeaderProps {
    onSearch?: (query: string) => void;
    onFilterByCategory?: (category: string) => void;
    activeCategory?: string | null;
    onLanguageChange?: (lang: string) => void;
}

export function Header({ onSearch, onFilterByCategory, activeCategory, onLanguageChange }: HeaderProps = {}) {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sincronizar con i18next language
    const [language, setLanguage] = useState<string>(() => {
        const i18nLang = i18n.language || 'es';
        return i18nLang === 'es' ? 'ES-ES' : 'EN-US';
    });

    const languageOptions: Array<{ label: string; value: string; code: 'ES' | 'US' }> = [
        { label: 'Español', value: 'ES-ES', code: 'ES' },
        { label: 'English', value: 'EN-US', code: 'US' }
    ];

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        // Cambiar idioma en i18next (usar 'es' o 'en')
        const i18nLang = value === 'ES-ES' ? 'es' : 'en';
        i18n.changeLanguage(i18nLang);
        // Mantener compatibilidad con el sistema anterior
        localStorage.setItem(CONFIG.LANG_KEY, value);
        onLanguageChange?.(value);
    };

    const renderFlag = (code?: string) => {
        if (code === 'ES') return <FlagES title="España" className="w-1rem h-1rem" />;
        if (code === 'US') return <FlagUS title="United States" className="w-1rem h-1rem" />;
        return null;
    };

    const itemTemplate = (option: { label: string; code: 'ES' | 'US' }) => (
        <div className="flex align-items-center gap-2">
            {renderFlag(option.code)}
            <span>{option.label}</span>
        </div>
    );

    const valueTemplate = (option?: { label: string; code: 'ES' | 'US' }) => {
        if (!option) return null;
        return (
            <div className="flex align-items-center gap-2">
                {renderFlag(option.code)}
                <span>{option.label}</span>
            </div>
        );
    };

    const menuItems: MenuItemType[] = [
        {
            label: t('weapons'),
            icon: <img src="/sword-svgrepo-com.svg" alt="Sword" className="w-1rem h-1rem" />,
            onClick: () => {
                onFilterByCategory?.('weapons');
            }
        },
        {
            label: t('armor'),
            icon: 'bi bi-shield-fill',
            onClick: () => {
                onFilterByCategory?.('armor');
            }
        },
        {
            label: t('resources'),
            icon: 'bi bi-gem',
            onClick: () => {
                onFilterByCategory?.('resources');
            }
        },
        {
            label: t('food'),
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

                <div className="flex align-items-center gap-3 menu-container">
                    {menuItems.map((item, index) => {
                        const categoryKey = ['weapons', 'armor', 'resources', 'food'][index];
                        const isActive = activeCategory === categoryKey;

                        return (
                            <button
                                key={index}
                                className={`menu-item flex align-items-center gap-2 p-3 border-none cursor-pointer ${isActive ? 'active-category' : 'bg-transparent'
                                    }`}
                                onClick={item.onClick}
                                style={isActive ? {
                                    background: 'linear-gradient(135deg, #A83D06 0%, #D2691E 100%)',
                                    color: 'white',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(168, 61, 6, 0.4)'
                                } : {}}
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
                        );
                    })}
                </div>

                {/* Language + Search */}
                <div className="flex align-items-center gap-2">
                    <Dropdown
                        value={language}
                        options={languageOptions}
                        optionLabel="label"
                        itemTemplate={itemTemplate}
                        valueTemplate={valueTemplate}
                        onChange={(e) => handleLanguageChange(e.value)}
                        placeholder={t('language')}
                        className="w-12rem hidden sm:inline-flex"
                    />
                    <IconField iconPosition="left" className="w-full sm:w-20rem">
                        <InputText
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('search_placeholder')}
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
                        tooltip={t('search')}
                        tooltipOptions={{ position: 'bottom' }}
                    />
                </div>
            </div>
        </div>
    );
}
