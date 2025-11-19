import { LanguageProvider, useLanguage } from './contexts/LanguageContext'

function TestComponent() {
    const { language, setLanguage, t } = useLanguage();
    
    return (
        <div style={{ padding: '20px', background: 'white', color: 'black' }}>
            <h1>Test Component</h1>
            <p>Current language: {language}</p>
            <p>Translated text: {t('weapons')}</p>
            <button onClick={() => setLanguage('es')}>Español</button>
            <button onClick={() => setLanguage('en')}>English</button>
        </div>
    );
}

export function TestApp() {
    return (
        <LanguageProvider>
            <TestComponent />
        </LanguageProvider>
    );
}