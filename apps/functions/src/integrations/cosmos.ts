import { CosmosClient, Database, Container } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

if (process.env.NODE_ENV !== "production") {
  // ※ Cosmos エミュレータ向けの回避。クラウド接続では無効に。
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const endpoint = (process.env.COSMOS_ENDPOINT ?? "").replace(/\/$/, ""); // 念のため末尾/除去
const dbName = process.env.COSMOS_DB!;
const ordersContainerName = process.env.COSMOS_CONTAINER_ORDERS!;
const proofsContainerName = process.env.COSMOS_CONTAINER_PROOFS!;
const shipmentsContainerName = process.env.COSMOS_CONTAINER_SHIPMENTS!;

const client =
  process.env.COSMOS_KEY
    ? new CosmosClient({ endpoint, key: process.env.COSMOS_KEY })
    : new CosmosClient({ endpoint, tokenCredential: new DefaultAzureCredential() });
// 旧: aadCredentials でも可

let db: Database;
let orders: Container;
let proofs: Container;
let shipments: Container;

export async function ensureCosmos() {
  const { database } = await client.databases.createIfNotExists({ id: dbName });
  db = database;

  const pk = { paths: ["/order_id"], version: 2 as const };
  const [o, p, s] = await Promise.all([
    db.containers.createIfNotExists({ id: ordersContainerName, partitionKey: pk }),
    db.containers.createIfNotExists({ id: proofsContainerName, partitionKey: pk }),
    db.containers.createIfNotExists({ id: shipmentsContainerName, partitionKey: pk }),
  ]);
  orders = o.container;
  proofs = p.container;
  shipments = s.container;
}

export const ordersContainer    = () => (orders    ?? (() => { throw new Error("Cosmos not initialized"); })());
export const proofsContainer    = () => (proofs    ?? (() => { throw new Error("Cosmos not initialized"); })());
export const shipmentsContainer = () => (shipments ?? (() => { throw new Error("Cosmos not initialized"); })());
