// apps/functions/src/integrations/cosmos.ts
import { CosmosClient, Database, Container } from "@azure/cosmos";

// Emulator の自己署名証明書で TLS エラーになるのを回避（ローカル限定）
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const endpoint = process.env.COSMOS_ENDPOINT!;
const key = process.env.COSMOS_KEY!;
const dbName = process.env.COSMOS_DB!;
const ordersContainerName = process.env.COSMOS_CONTAINER_ORDERS!;
const proofsContainerName = process.env.COSMOS_CONTAINER_PROOFS!;
const shipmentsContainerName = process.env.COSMOS_CONTAINER_SHIPMENTS!;

const client = new CosmosClient({ endpoint, key });

let db: Database;
let orders: Container;
let proofs: Container;
let shipments: Container;

export async function ensureCosmos() {
  // DB & コンテナを無ければ作成（初回だけ）
  const { database } = await client.databases.createIfNotExists({ id: dbName });
  db = database;

  const [ordersResp, proofsResp, shipmentsResp] = await Promise.all([
    db.containers.createIfNotExists({
      id: ordersContainerName,
      partitionKey: { paths: ["/order_id"], version: 2 },
    }),
    db.containers.createIfNotExists({
      id: proofsContainerName,
      partitionKey: { paths: ["/order_id"], version: 2 },
    }),
    db.containers.createIfNotExists({
      id: shipmentsContainerName,
      partitionKey: { paths: ["/order_id"], version: 2 },
    }),
  ]);

  orders = ordersResp.container;
  proofs = proofsResp.container;
  shipments = shipmentsResp.container;
}

// ドキュメント型（必要に応じて他の型もここに）
export type ShipmentDoc = {
  id: string;
  order_id: string;
  carrier: string;
  tracking_no: string;
  notified: boolean;
  created_at: string; // ISO8601
};

export function ordersContainer() {
  if (!orders) throw new Error("Cosmos not initialized");
  return orders;
}

export function proofsContainer() {
  if (!proofs) throw new Error("Cosmos not initialized");
  return proofs;
}

export function shipmentsContainer() {
  if (!shipments) throw new Error("Cosmos not initialized");
  return shipments;
}
