// apps/admin/src/pages/ShipmentsList.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { listShipments, Shipment } from "../lib/api";

export default function ShipmentsList() {
  const [items, setItems] = useState<Shipment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const loc = useLocation();
  const needsRefresh = useMemo(() => {
    const s = new URLSearchParams(loc.search);
    return s.get("refresh") === "1";
  }, [loc.search]);

  const fetchList = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await listShipments();
      setItems(res.items);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // /ship から遷移して来たときは追いリロード
  useEffect(() => {
    if (needsRefresh) fetchList();
  }, [needsRefresh]);

  return (
    <div>
      <h2>出荷一覧</h2>
      <button onClick={fetchList} disabled={loading}>
        {loading ? "読込中..." : "再読み込み"}
      </button>
      {err && <p style={{ color: "crimson" }}>Error: {err}</p>}
      {!items?.length && !loading && <p>データなし</p>}
      {!!items?.length && (
        <table border={1} cellPadding={6} style={{ marginTop: 8, width: "100%" }}>
          <thead>
            <tr>
              <th>注文ID</th>
              <th>配送会社</th>
              <th>追跡番号</th>
              <th>通知</th>
              <th>登録日時</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id}>
                <td>{x.order_id}</td>
                <td>{x.carrier}</td>
                <td>{x.tracking_no}</td>
                <td>{x.notified ? "はい" : "いいえ"}</td>
                <td>{formatDate(x.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ja-JP", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(d);
  } catch {
    return iso;
  }
}
