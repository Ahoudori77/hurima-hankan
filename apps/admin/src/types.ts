export type Order = {
  id: string;
  order_id: string;
  marketplace: string;
  item_name: string;
  price: number;
  created_at: string;   // ISO
};

export type Shipment = {
  id: string;
  order_id: string;
  carrier: string;
  tracking_no: string;
  notified: boolean;
  created_at: string;   // ISO
};

export type ListResponse<T> = {
  items: T[];
  cont: string | null; // 継続トークン（今は未使用）
};
