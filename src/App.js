import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout.js"; // Переименовал Home → MainLayout
import Form from "./Main/GetTicketForm/Form.js";
import ServiceMenu from "./Main/ServiceMenu.js";
import ProtectedRoute from "./ProtectedRoute.js";
import BranchQR from "./BranchQR.js";
// import Ticket from "./Main/Ticket/Ticket.js";
import "./App.css";
import translationEN from "./locales/en/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationKZ from "./locales/kz/translation.json";
import Ticket from "./Main/Ticket/Ticket.js";

// Конфигурация локализации
const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
  kz: { translation: translationKZ },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
    },
  });

function App() {

  return (
    <BrowserRouter>
      <div className="App">
      <Routes>
        <Route path="/branch/:branchId/" element={<MainLayout />}>
          <Route index element={<Form />} />
          <Route path="qr/" element={<BranchQR />} />
          <Route element={<ProtectedRoute />}>
              <Route path="service/:serviceId/" element={<ServiceMenu />} />
              <Route path="ticket/:ticketId/" element={<Ticket/>}/>
          </Route>
        </Route>
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
