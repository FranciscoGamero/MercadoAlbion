import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Home } from './pages/Home';
import { ItemDetails } from './pages/components/itemDetails/ItemDetails';

function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t('app_title');
  }, [t, i18n.language]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </Router>
  )
}

export default App
