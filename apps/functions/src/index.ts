// apps/functions/src/index.ts
const modules = [
  "./http/admin-ping.js",
  "./http/admin-health.js",
  "./http/orders-receive.js",
  "./http/proofs-start.js",
  "./http/proofs-commit.js",
  "./http/admin-ship.js",
  "./http/admin-orders.js",
  "./http/admin-shipments-list.js",
  "./http/order-get.js",
];

for (const m of modules) {
  import(m).catch((e) => console.error("[functions] failed to load", m, e));
}

// Cosmos の起動は非同期でログだけ（失敗しても全体は止めない）
import { ensureCosmos } from "./integrations/cosmos.js";
ensureCosmos().then(
  () => console.log("[cosmos] ready"),
  (e) => console.error("[cosmos] init error", e)
);
