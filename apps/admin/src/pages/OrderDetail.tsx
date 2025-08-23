import React, { useState } from 'react';

export function OrderDetail() {
  const [orderId, setOrderId] = useState('ORD-TEST'); // LIFFの結果を貼って試せるように初期値
  const [carrier, setCarrier] = useState('JP Post');
  const [tracking, setTracking] = useState('AB123456789JP');
  const [notify, setNotify] = useState(true);
  const [result, setResult] = useState('');

  async function onShip() {
    try {
      setResult('送信中...');
      const res = await fetch('/api/ops/ship', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          // 関数側の期待に合わせて **スネークケース** で送信
          order_id: orderId,
          carrier,
          tracking_no: tracking,
          notify,
        }),
      });
      const json = await res.json();
      if (res.ok && json?.ok) {
        setResult(`出荷登録OK: ${json.order_id}\n${JSON.stringify(json, null, 2)}`);
      } else {
        setResult(`エラー: ${res.status}\n${JSON.stringify(json, null, 2)}`);
      }
    } catch (e: any) {
      setResult(`通信エラー: ${e?.message ?? e}`);
    }
  }

  return (
    <main style={{ padding: 16, maxWidth: 520 }}>
      <h1>出荷登録（最小プロト）</h1>

      <label>
        注文ID：
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} style={{ width: 320 }} />
      </label>
      <div style={{ height: 8 }} />

      <label>
        配送会社：
        <input value={carrier} onChange={(e) => setCarrier(e.target.value)} />
      </label>
      <div style={{ height: 8 }} />

      <label>
        追跡番号：
        <input value={tracking} onChange={(e) => setTracking(e.target.value)} />
      </label>
      <div style={{ height: 8 }} />

      <label>
        <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
        出荷登録時に売り子へ通知（ダミー）
      </label>
      <div style={{ height: 12 }} />

      <button onClick={onShip} disabled={!orderId}>
        出荷登録 & 売り子に連絡
      </button>

      <pre style={{ background: '#111', color: '#0f0', padding: 8, marginTop: 12, whiteSpace: 'pre-wrap' }}>
        {result}
      </pre>
    </main>
  );
}
