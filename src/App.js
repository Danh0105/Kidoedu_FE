import { Routes, Route } from "react-router-dom";
import UserAppRoutes from "./routes/UserAppRoutes";
import AdminAppRoutes from "./routes/AdminAppRoutes";
import useAutoLogout from "./hooks/useAutoLogout";
import { CartProvider } from "./hooks/CartContext";
import LoadPage from "./hooks/LoadPage";

function App() {
  useAutoLogout(); // ❗ hook KHÔNG render JSX

  return (
    <LoadPage>
      <CartProvider>
        <Routes>
          {/* USER */}
          <Route path="/*" element={<UserAppRoutes />} />

          {/* ADMIN */}
          <Route path="/admin/*" element={<AdminAppRoutes />} />
        </Routes>
      </CartProvider>
    </LoadPage>
  );
}

export default App;
