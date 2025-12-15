import "@assets/css/style.css";
import { setupAxiosInterceptors, validateTokenOnInit } from "./config/axiosInterceptor";
import AppRoutes from "./routes/AppRoutes";

// Validate token on app initialization (before any API calls)
validateTokenOnInit();

// Setup axios interceptors for request/response handling
setupAxiosInterceptors();

function App() {
  return (
    <AppRoutes />
  );
}

export default App;
