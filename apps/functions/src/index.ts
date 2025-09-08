// apps/functions/src/index.ts
import "./http/admin-ping.js";
import "./http/admin-health.js";
import "./http/orders-receive.js";
import "./http/proofs-start.js";
import "./http/proofs-commit.js";
import "./http/admin-ship.js";
import "./http/admin-orders.js";
import "./http/admin-shipments-list.js";
import "./http/order-get.js";

// Cosmos 初期化は失敗しても全体は止めない
import { ensureCosmos } from "./integrations/cosmos.js";
ensureCosmos().then(
  () => console.log("[cosmos] ready"),
  (e) => console.error("[cosmos] init error", e)
);
