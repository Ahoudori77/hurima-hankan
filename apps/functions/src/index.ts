import './http/orders-receive.js';
import './http/proofs-start.js';
import './http/proofs-commit.js';
import './http/admin-ship.js';
import './http/admin-health.js';

import "./http/admin-orders.js";
import "./http/admin-shipments-list.js";
import "./http/order-get.js";

import { ensureCosmos } from "./integrations/cosmos.js";
// Functions ホスト起動時に Cosmos を準備
ensureCosmos().then(
  () => console.log("[cosmos] ready"),
  (e) => console.error("[cosmos] init error", e)
);