// apps/functions/src/http/orders-receive.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ensureCosmos, ordersContainer } from "../integrations/cosmos.js";

type OrderRequest = {
  marketplace: "M" | "Y" | "R";
  itemName: string;
  price: number;
  sellerHint?: string;
};

app.http("orders-receive", {
  methods: ["POST"],
  authLevel: "admin",
  route: "orders/receive",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    await ensureCosmos(); 
    const body = (await req.json()) as OrderRequest;
    const orderId = `ORD-${Date.now()}`;

    ctx.log(`orders/receive: request ${JSON.stringify(body)} -> ${orderId}`);

    const doc = {
      id: orderId,            // Cosmos の id
      order_id: orderId,      // パーティションキー
      marketplace: body.marketplace,
      item_name: body.itemName,
      price: body.price,
      seller_hint: body.sellerHint ?? null,
      created_at: new Date().toISOString(),
      status: "received",
    };
    await ordersContainer().items.upsert(doc);

    return {
      status: 200,
      jsonBody: { ok: true, order_id: orderId, message: "受付&保存しました（Emulator）" },
    };
  },
});
