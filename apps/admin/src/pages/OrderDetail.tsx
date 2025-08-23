import React from 'react';
export function OrderDetail(){
  return (
    <main style={{ padding: 16 }}>
      <h1>注文詳細</h1>
      <section>
        <h2>証憑</h2>
        <div>サムネイル（後で実装）</div>
        <label>配送会社<input placeholder="JP Post"/></label>
        <label>追跡番号<input placeholder="AB123456789JP"/></label>
        <div>
          <label><input type="checkbox" defaultChecked/> 出荷登録時に売り子へ通知</label>
        </div>
        <button>出荷登録 & 売り子に連絡</button>
      </section>
    </main>
  );
}