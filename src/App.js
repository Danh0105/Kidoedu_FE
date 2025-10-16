
import React from "react";
import UserAppRoutes from "./routes/UserAppRoutes";
import AdminAppRoutes from "./routes/AdminAppRoutes";
import useAutoLogout from "./hooks/useAutoLogout";
import { CartProvider } from "./hooks/CartContext";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import LoadPage from "./hooks/LoadPage";
function App() {


  return (

    <React.StrictMode>
      {/*  <MobileBlocker /> */}
      <LoadPage>
        {useAutoLogout()}
        <CartProvider>
          <UserAppRoutes />
        </CartProvider>

        <AdminAppRoutes />
      </LoadPage>
    </React.StrictMode>


  );
}

export default App;
