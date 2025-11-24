import AppRoutes from "./routes/AppRoutes";
import ThemeCustomization from './themes';
import { ThemeModeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import React from "react";
import "@assets/css/style.css";

function App() {
  return (
    <ThemeModeProvider>
      <NotificationProvider>
        <ThemeCustomization>
          <AppRoutes />
        </ThemeCustomization>
      </NotificationProvider>
    </ThemeModeProvider>
  );
}

export default App;


