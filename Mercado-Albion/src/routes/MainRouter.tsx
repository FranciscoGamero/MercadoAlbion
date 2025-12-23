import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "../pages/HomePage/Home.page";
import { ItemDetails } from "../pages/itemDetails/ItemDetails.page";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function MainRouter() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t('app_title');
  }, [t, i18n.language]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </BrowserRouter>
  )
}
