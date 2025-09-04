import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Order, ListResponse } from "../types";

export default function OrdersPage() {
  const [data, setData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.getOrders() as ListResponse<Order>;
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
      <h2>受注一覧</h2>
      <button onClick={load} disabled={loading} style={{ marginBottom: 8 }}>
        {loading ? "読み込み中..." : "再読み込み"}
      </button>
      {err && <div style={{ color: "crimson" }}>Error: {err}</div>}
      {!data?.length && !loading && <div>データなし</div>}
      {!!data?.length && (
        <table border={1} cellPadding={6} style={{ width: "100%", fontSize: 14 }}>
          <thead>
            <tr>
              <th>注文ID</th><th>媒体</th><th>商品名</th><th>価格</th><th>登録日時</th>
            </tr>
          </thead>
          <tbody>
            {data.map(o => (
              <tr key={o.id}>
                <td>{o.order_id}</td>
                <td>{o.marketplace}</td>
                <td>{o.item_name}</td>
                <td>{o.price.toLocaleString()}</td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
