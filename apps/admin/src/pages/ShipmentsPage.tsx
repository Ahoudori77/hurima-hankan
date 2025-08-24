import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Shipment, ListResponse } from "../types";

export default function ShipmentsPage() {
  const [data, setData] = useState<Shipment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.getShipments() as ListResponse<Shipment>;
      setData(res.items ?? []);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <section style={{ padding: 16 }}>
      <h2>出荷一覧</h2>
      <button onClick={load} disabled={loading} style={{ marginBottom: 8 }}>
        {loading ? "読み込み中..." : "再読み込み"}
      </button>
      {err && <div style={{ color: "crimson" }}>Error: {err}</div>}
      {!data?.length && !loading && <div>データなし</div>}
      {!!data?.length && (
        <table border={1} cellPadding={6} style={{ width: "100%", fontSize: 14 }}>
          <thead>
            <tr>
              <th>注文ID</th><th>配送会社</th><th>追跡番号</th><th>通知</th><th>登録日時</th>
            </tr>
          </thead>
          <tbody>
            {data.map(s => (
              <tr key={s.id}>
                <td>{s.order_id}</td>
                <td>{s.carrier}</td>
                <td>{s.tracking_no}</td>
                <td>{s.notified ? "はい" : "いいえ"}</td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
