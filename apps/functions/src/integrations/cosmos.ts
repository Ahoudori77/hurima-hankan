// apps/functions/src/integrations/cosmos.ts
import { CosmosClient, Database, Container, CosmosClientOptions } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

// 本番だけで TLS 回避を無効
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const endpoint = process.env.COSMOS_ENDPOINT!;
const dbName = process.env.COSMOS_DB!;
const ordersContainerName = process.env.COSMOS_CONTAINER_ORDERS!;
const proofsContainerName = process.env.COSMOS_CONTAINER_PROOFS!;
const shipmentsContainerName = process.env.COSMOS_CONTAINER_SHIPMENTS!;

// 使っているなら最低限の型を export
export type OrderDoc    = { id: string; order_id: string; [k: string]: unknown };
export type ProofDoc    = { id: string; order_id: string; [k: string]: unknown };
export type ShipmentDoc = { id: string; order_id: string; [k: string]: unknown };

const options: CosmosClientOptions = process.env.COSMOS_KEY
  ? { endpoint, key: process.env.COSMOS_KEY }
  : { endpoint, aadCredentials: new DefaultAzureCredential() };

export const client = new CosmosClient(options);

let db: Database;
let orders: Container;
let proofs: Container;
let shipments: Container;
let initPromise: Promise<void> | null = null;

export async function ensureCosmos() {
  const { database } = await client.databases.createIfNotExists({ id: dbName });
  db = database;

  const [o, p, s] = await Promise.all([
    db.containers.createIfNotExists({ id: ordersContainerName,    partitionKey: { paths: ["/order_id"], version: 2 } }),
    db.containers.createIfNotExists({ id: proofsContainerName,    partitionKey: { paths: ["/order_id"], version: 2 } }),
    db.containers.createIfNotExists({ id: shipmentsContainerName, partitionKey: { paths: ["/order_id"], version: 2 } }),
  ]);

  orders = o.container;
  proofs = p.container;
  shipments = s.container;

  if (orders && proofs && shipments) return;

  if (!initPromise) {
    initPromise = (async () => {
      const { database } = await client.databases.createIfNotExists({ id: dbName });
      db = database;
      const [o, p, s] = await Promise.all([
        db.containers.createIfNotExists({ id: ordersContainerName,    partitionKey: { paths: ["/order_id"], version: 2 } }),
        db.containers.createIfNotExists({ id: proofsContainerName,    partitionKey: { paths: ["/order_id"], version: 2 } }),
        db.containers.createIfNotExists({ id: shipmentsContainerName, partitionKey: { paths: ["/order_id"], version: 2 } }),
      ]);
      orders = o.container;
      proofs = p.container;
      shipments = s.container;
    })().catch((e) => {
      // 失敗時は次回呼び出しでやり直せるように
      initPromise = null;
      throw e;
    });
  }

  await initPromise;
}

export const ordersContainer    = () => { if (!orders) throw new Error("Cosmos not initialized"); return orders; };
export const proofsContainer    = () => { if (!proofs) throw new Error("Cosmos not initialized"); return proofs; };
export const shipmentsContainer = () => { if (!shipments) throw new Error("Cosmos not initialized"); return shipments; };
