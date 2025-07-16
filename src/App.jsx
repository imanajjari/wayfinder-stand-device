import { useEffect } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PathProvider } from "./contexts/PathContext";

import routes from './routes';  // ایمپورت مسیرها

export default function App() {
  const { t } = useTranslation();

  useEffect(() => {
    const rtlLanguages = ["fa", "ar"];
    document.body.dir = rtlLanguages.includes(i18n.language) ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <ThemeProvider>
      <PathProvider>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </PathProvider>
    </ThemeProvider>
  );
}
