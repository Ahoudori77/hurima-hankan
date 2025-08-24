import { useState } from "react";
import OrdersPage from "./pages/OrdersPage";
import ShipmentsPage from "./pages/ShipmentsPage";

type Tab = "orders" | "shipments";

export default function App() {
  const [tab, setTab] = useState<Tab>("orders");

  return (
    <main style={{ fontFamily: "system-ui, sans-serif" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
        <strong>管理画面</strong>
        <nav style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button onClick={() => setTab("orders")} disabled={tab === "orders"}>受注一覧</button>
          <button onClick={() => setTab("shipments")} disabled={tab === "shipments"}>出荷一覧</button>
        </nav>
      </header>
      {tab === "orders" && <OrdersPage />}
      {tab === "shipments" && <ShipmentsPage />}
    </main>
  );
}
