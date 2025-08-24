const BASE = import.meta.env.VITE_API_BASE as string;

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getOrders: () => fetch(`${BASE}/ops/orders`).then(json),
  getShipments: () => fetch(`${BASE}/ops/shipments`).then(json),
};
