import "@assets/css/style.css";
import AppRoutes from "./routes/AppRoutes";
import { setupAxiosInterceptors } from "./config/axiosInterceptor";

setupAxiosInterceptors();

function App() {
  return (
    <AppRoutes />
  );
}

export default App;


