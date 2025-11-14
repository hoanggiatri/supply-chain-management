import AppRoutes from "./routes/AppRoutes";
import ThemeCustomization from './themes';
import React from "react";
import "@assets/css/style.css";

function App() {
  return (
    <ThemeCustomization>
      <AppRoutes/>
    </ThemeCustomization>
  );
}

export default App;


