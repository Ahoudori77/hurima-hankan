import React, { useState } from 'react';

export function TasksPage() {
  const [marketplace, setMarketplace] = useState<'M' | 'Y' | 'R'>('M');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [result, setResult] = useState<string>('');

  async function onSubmit() {
    try {
      setResult('送信中...');
      const res = await fetch('/api/orders/receive', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          marketplace,          // 'M' | 'Y' | 'R'
          itemName,
          price: price === '' ? undefined : Number(price),
          sellerHint: 'dummy-seller' // 今はダミー。後で id_token から確定
        }),
      });
      const json = await res.json();
      if (res.ok && json?.ok) {
        setResult(`受付済み: ${json.order_id}\n${JSON.stringify(json, null, 2)}`);
        // 必要ならクリップボード
        // await navigator.clipboard.writeText(json.order_id);
      } else {
        setResult(`エラー: ${res.status}\n${JSON.stringify(json, null, 2)}`);
      }
    } catch (e: any) {
      setResult(`通信エラー: ${e?.message ?? e}`);
    }
  }

  return (
    <main style={{ padding: 16, maxWidth: 520 }}>
      <h1>受付（最小プロト）</h1>

      <label>
        媒体：
        <select value={marketplace} onChange={(e) => setMarketplace(e.target.value as any)}>
          <option value="M">メルカリ</option>
          <option value="Y">ヤフオク</option>
          <option value="R">ラクマ</option>
        </select>
      </label>
      <br />

      <label>
        商品名：
        <input value={itemName} onChange={(e) => setItemName(e.target.value)} />
      </label>
      <br />

      <label>
        価格：
        <input
          inputMode="numeric"
          value={price}
          onChange={(e) => {
            const v = e.target.value;
            setPrice(v === '' ? '' : Number(v));
          }}
        />
      </label>
      <br />

      <button onClick={onSubmit} disabled={!itemName || price === ''}>
        受付する
      </button>

      <pre style={{ background: '#111', color: '#0f0', padding: 8, marginTop: 12, whiteSpace: 'pre-wrap' }}>
        {result}
      </pre>
    </main>
  );
}