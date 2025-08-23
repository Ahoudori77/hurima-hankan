import React, { useEffect, useState } from 'react';


export function ProofPage() {
  const [orderId, setOrderId] = useState('');
  const [token, setToken] = useState('');
  const [trade, setTrade] = useState<File | null>(null);
  const [post, setPost] = useState<File | null>(null);
  const [msg, setMsg] = useState<string>('');


  useEffect(() => {
    const u = new URL(location.href);
    setOrderId(u.searchParams.get('order') || '');
    setToken(u.searchParams.get('token') || '');
  }, []);


  async function compress(f: File) {
    // TODO: 実装（簡易のまま）
    return f;
  }


  async function onSubmit() {
    setMsg('リクエスト中...');
    const start = await fetch('/api/orders/proofs/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id_token: 'LIFF_ID_TOKEN', order_id: orderId, files: ['trade','post'], token })
    }).then(r => r.json());


    const tradeC = trade ? await compress(trade) : null;
    const postC = post ? await compress(post) : null;
    if (tradeC) await fetch(start.upload.trade.url, { method: 'PUT', body: tradeC });
    if (postC) await fetch(start.upload.post.url, { method: 'PUT', body: postC });


    await fetch('/api/orders/proofs/commit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id_token: 'LIFF_ID_TOKEN', order_id: orderId, blobs: { trade: start.upload.trade.blob, post: start.upload.post.blob } })
    });
    setMsg('送信しました');
  }


  return (
    <main style={{ padding: 16 }}>
      <h1>証憑アップロード</h1>
      <p>注文: {orderId}</p>
      <input type="file" accept="image/*" onChange={e=>setTrade(e.target.files?.[0]||null)} /> 取引画面
      <br />
      <input type="file" accept="image/*" onChange={e=>setPost(e.target.files?.[0]||null)} /> 投函番号
      <br />
      <button disabled={!trade || !post} onClick={onSubmit}>アップロード</button>
      <p>{msg}</p>
    </main>
  );
}