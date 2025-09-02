// apps/functions/src/integrations/cosmos.ts
import { CosmosClient, Database, Container } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

// ローカルの TLS 回避は prod では無効に
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const endpoint = process.env.COSMOS_ENDPOINT!;
const dbName = process.env.COSMOS_DB!;
const ordersContainerName = process.env.COSMOS_CONTAINER_ORDERS!;
const proofsContainerName = process.env.COSMOS_CONTAINER_PROOFS!;
const shipmentsContainerName = process.env.COSMOS_CONTAINER_SHIPMENTS!;

// キーがあれば(=ローカル/エミュ等)キーで、なければ(Azure)MSIで
const client = process.env.COSMOS_KEY
  ? new CosmosClient({ endpoint, key: process.env.COSMOS_KEY })
  : new CosmosClient({ endpoint, aadCredentials: new DefaultAzureCredential() });

let db: Database;
let orders: Container;
let proofs: Container;
let shipments: Container;

export async function ensureCosmos() {
  // （本番は事前に DB/Container 作成済みなら createIfNotExists は OK。足りなければ Portal で作成推奨）
  const { database } = await client.databases.createIfNotExists({ id: dbName });
  db = database;

  const [ordersResp, proofsResp, shipmentsResp] = await Promise.all([
    db.containers.createIfNotExists({ id: ordersContainerName, partitionKey: { paths: ["/order_id"], version: 2 } }),
    db.containers.createIfNotExists({ id: proofsContainerName, partitionKey: { paths: ["/order_id"], version: 2 } }),
    db.containers.createIfNotExists({ id: shipmentsContainerName, partitionKey: { paths: ["/order_id"], version: 2 } }),
  ]);

  orders = ordersResp.container;
  proofs = proofsResp.container;
  shipments = shipmentsResp.container;
}

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
