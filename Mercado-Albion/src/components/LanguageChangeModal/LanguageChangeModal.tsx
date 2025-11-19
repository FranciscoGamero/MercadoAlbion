import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ES, US } from 'country-flag-icons/react/3x2';
import { getTranslation, type Language } from '../../config/translations';
import './LanguageChangeModal.css';

interface LanguageChangeModalProps {
    visible: boolean;
    currentLanguage: Language;
    targetLanguage: Language;
}

export function LanguageChangeModal({ visible, currentLanguage, targetLanguage }: LanguageChangeModalProps) {
    const t = (key: string) => getTranslation(currentLanguage, key as any);
    
    const getFlagIcon = (lang: Language) => {
        return lang === 'es' ? 
            <ES className="flag-icon" /> : 
            <US className="flag-icon" />;
    };

    const getLanguageName = (lang: Language) => {
        return lang === 'es' ? 'Español' : 'English';
    };

    return (
        <Dialog
            visible={visible}
            modal
            closable={false}
            draggable={false}
            resizable={false}
            onHide={() => {}} // Required prop, but modal can't be closed
            className="language-change-modal"
            contentStyle={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,248,240,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(168,61,6,0.3)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                minWidth: '400px',
                boxShadow: '0 25px 50px rgba(168, 61, 6, 0.3)'
            }}
            style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)'
            }}
        >
            <div className="language-change-content">
                {/* Icono principal animado */}
                <div className="language-icon-container">
                    <div className="language-switch-animation">
                        <div className="from-language">
                            {getFlagIcon(currentLanguage)}
                        </div>
                        <div className="arrow-animation">
                            <i className="pi pi-arrow-right"></i>
                        </div>
                        <div className="to-language">
                            {getFlagIcon(targetLanguage)}
                        </div>
                    </div>
                </div>

                {/* Título */}
                <h2 className="language-change-title">
                    <i className="pi pi-globe mr-2"></i>
                    {t('languageChanging')}
                </h2>

                {/* Descripción */}
                <p className="language-change-description">
                    {targetLanguage === 'es' ? 
                        'Cambiando a Español y actualizando contenido...' :
                        'Switching to English and updating content...'
                    }
                </p>

                {/* Spinner de carga */}
                <div className="spinner-container">
                    <ProgressSpinner 
                        style={{ width: '50px', height: '50px' }} 
                        strokeWidth="4" 
                        fill="transparent"
                        animationDuration="1.2s"
                    />
                </div>

                {/* Indicador de progreso con texto */}
                <div className="progress-info">
                    <div className="language-transition-info">
                        <span className="from-lang">
                            {getFlagIcon(currentLanguage)}
                            <span>{getLanguageName(currentLanguage)}</span>
                        </span>
                        <div className="transition-arrow">
                            <i className="pi pi-arrow-right"></i>
                        </div>
                        <span className="to-lang">
                            {getFlagIcon(targetLanguage)}
                            <span>{getLanguageName(targetLanguage)}</span>
                        </span>
                    </div>
                    
                    <div className="wait-message">
                        {currentLanguage === 'es' ? 'Por favor espera...' : 'Please wait...'}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}