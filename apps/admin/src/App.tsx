// apps/admin/src/App.tsx
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import ShipForm from "./pages/ShipForm";
import ShipmentsPage from "./pages/ShipmentsPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 12 }}>
        <h1>管理画面</h1>
        <div style={{ marginBottom: 12 }}>
          <Link to="/orders"><button>受注一覧</button></Link>{" "}
          <Link to="/shipments"><button>出荷一覧</button></Link>{" "}
          <Link to="/ship"><button>出荷登録</button></Link>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/shipments" element={<ShipmentsPage />} />
          <Route path="/ship" element={<ShipForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
