// apps/admin/src/pages/ShipForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShipForm() {
  const [orderId, setOrderId] = useState("ORD-TEST");
  const [carrier, setCarrier] = useState("JP Post");
  const [tracking, setTracking] = useState("AB123456789JP");
  const [notify, setNotify] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // --- 3) かんたんバリデーション ---
    if (!orderId.trim() || !carrier.trim() || !tracking.trim()) {
      setErr("未入力の項目があります。");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ops/ship", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          order_id: orderId.trim(),
          carrier: carrier.trim(),
          tracking_no: tracking.trim(),
          notify,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || `HTTP ${res.status}`);
      }

      // --- 1) 成功したら一覧へ（自動リフレッシュ） ---
      navigate("/shipments?refresh=1", { replace: true });
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: 16 }}>
      <h2>出荷登録</h2>
      <form onSubmit={onSubmit}>
        <div>
          注文ID：
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} style={{ width: 320 }} />
        </div>
        <div style={{ marginTop: 8 }}>
          配送会社：
          <input value={carrier} onChange={(e) => setCarrier(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          追跡番号：
          <input value={tracking} onChange={(e) => setTracking(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
            出荷登録時に売り子へ通知（ダミー）
          </label>
        </div>

        {err && <p style={{ color: "crimson", marginTop: 8 }}>Error: {err}</p>}

        <div style={{ marginTop: 12 }}>
          {/* 2) ローディング & 二重送信防止 */}
          <button type="submit" disabled={loading}>
            {loading ? "送信中..." : "出荷登録"}
          </button>
        </div>
      </form>
    </section>
  );
}
