
import React from "react";
import UserAppRoutes from "./routes/UserAppRoutes";
import AdminAppRoutes from "./routes/AdminAppRoutes";
import useAutoLogout from "./hooks/useAutoLogout";
import { CartProvider } from "./hooks/CartContext";
function App() {


  return (
    <React.StrictMode>
      {useAutoLogout()}
      <CartProvider>
        <UserAppRoutes />
      </CartProvider>

      <AdminAppRoutes />
    </React.StrictMode>


  );
}

export default App;
