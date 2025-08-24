// apps/admin/src/pages/ShipForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ShipRequest = {
  order_id: string;
  carrier: string;
  tracking_no: string;
  notify: boolean;
};

type ShipResponse = {
  ok: boolean;
  order_id: string;
  shipment_id?: string;
  status?: string;
  notified?: boolean;
  message?: string;
};

export default function ShipForm() {
  // 最小プロトの初期値を踏襲（必要に応じて空にしてOK）
  const [orderId, setOrderId] = useState("ORD-TEST");
  const [carrier, setCarrier] = useState("JP Post");
  const [tracking, setTracking] = useState("AB123456789JP");
  const [notify, setNotify] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const canSubmit =
    !!orderId.trim() && !!carrier.trim() && !!tracking.trim() && !loading;

  async function onSubmit() {
    setError(null);
    setResult(null);
    setLoading(true);

    const payload: ShipRequest = {
      order_id: orderId.trim(),
      carrier: carrier.trim(),
      tracking_no: tracking.trim(),
      notify,
    };

    try {
      const base = import.meta.env.VITE_API_BASE ?? "/api";
      const res = await fetch(`${base}/ops/ship`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as ShipResponse;

      if (!res.ok || !json?.ok) {
        throw new Error(
          `HTTP ${res.status}${json?.message ? `: ${json.message}` : ""}`
        );
      }

      setResult(
        `出荷登録に成功しました。\n注文ID: ${json.order_id}${
          json.shipment_id ? `\n出荷ID: ${json.shipment_id}` : ""
        }`
      );

      // 一覧へ遷移（?refresh=1 で自動再読込）
      navigate("/shipments?refresh=1");
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 16, maxWidth: 560 }}>
      <h2>出荷登録</h2>

      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <label>
          注文ID：
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{ width: 360, marginLeft: 8 }}
            placeholder="ORD-XXXXXX"
          />
        </label>

        <label>
          配送会社：
          <input
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            style={{ width: 240, marginLeft: 8 }}
            placeholder="JP Post / Yamato など"
          />
        </label>

        <label>
          追跡番号：
          <input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            style={{ width: 240, marginLeft: 8 }}
            placeholder="AB123456789JP"
          />
        </label>

        <label style={{ userSelect: "none" }}>
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          出荷登録時に売り子へ通知（ダミー）
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button onClick={onSubmit} disabled={!canSubmit}>
            {loading ? "送信中..." : "出荷登録する"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/shipments")}
            disabled={loading}
          >
            出荷一覧へ
          </button>
        </div>

        {error && (
          <pre style={{ background: "#fff3f3", color: "#b00020", padding: 8 }}>
            エラー: {error}
          </pre>
        )}
        {result && (
          <pre style={{ background: "#f3fff3", color: "#006400", padding: 8 }}>
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}
