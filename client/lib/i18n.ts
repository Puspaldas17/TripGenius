import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      title: "TripGenius",
      welcome: "Welcome to TripGenius",
      tagline: "Plan smarter, travel better.",
      dashboard_title: "Dashboard",
      planner_title: "Travel Planner",
      login: "Login",
      signup: "Sign up",
    },
  },
  es: {
    translation: {
      title: "TripGenius",
      welcome: "Bienvenido a TripGenius",
      tagline: "Planifica de manera inteligente, viaja mejor.",
      dashboard_title: "Panel principal",
      planner_title: "Planificador de Viajes",
      login: "Iniciar sesión",
      signup: "Registrarse",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false, // React automatically protects from XSS
    },
  });

export default i18n;
