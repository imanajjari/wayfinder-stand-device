import { useEffect } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PathProvider } from "./contexts/PathContext";
import { ShopDetailsProvider } from "./contexts/ShopDetailsContext";
import { SearchResultsProvider } from "./contexts/SearchResultsContext";
import routes from "./routes";
import { Suspense } from "react";

export default function App() {
  const { i18n: i18next } = useTranslation();

  useEffect(() => {
    const setDirLang = (lng) => {
      const rtlLanguages = ["fa", "ar"];
      const dir = rtlLanguages.includes(lng) ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", lng);
    };

    setDirLang(i18next.language);
    const handler = (lng) => setDirLang(lng);

    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, [i18next.language]);

  return (
    <ThemeProvider>
      <PathProvider>
        <SearchResultsProvider>
          <ShopDetailsProvider>
          {/* <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}> */}
            <Routes>
              {routes.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
            </Routes>
          {/* </Suspense> */}
          </ShopDetailsProvider>
        </SearchResultsProvider>
      </PathProvider>
    </ThemeProvider>
  );
}
