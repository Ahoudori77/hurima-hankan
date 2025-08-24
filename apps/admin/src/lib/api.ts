// apps/admin/src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE!.replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // CORSでCookie使う場合に備えて
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

// --- 型（必要に応じて拡張） ---
export type Shipment = {
  id: string;
  order_id: string;
  carrier: string;
  tracking_no: string;
  notified: boolean;
  created_at: string;
};

export type ShipPostBody = {
  order_id: string;
  carrier: string;
  tracking_no: string;
  notify: boolean;
};

export async function listShipments() {
  return request<{ items: Shipment[] }>("/ops/shipments");
}

export async function postShipment(body: ShipPostBody) {
  return request<{
    ok: true;
    shipment_id: string;
    order_id: string;
    status: "shipped";
    notified: boolean;
    message?: string;
  }>("/ops/ship", { method: "POST", body: JSON.stringify(body) });
}

export async function listOrders() {
  return request<{ items: any[] }>("/ops/orders");
}
