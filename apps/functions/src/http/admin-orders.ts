import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { ordersContainer } from "../integrations/cosmos.js";

export const opsOrders = app.http("ops-orders", {
  methods: ["GET"],
  route: "ops/orders",
  authLevel: "anonymous",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const limit = Number(req.query.get("limit") ?? "20");
    const token = req.query.get("cont") ?? undefined;

    const query = {
      query: "SELECT c.id, c.order_id, c.marketplace, c.item_name, c.price, c.created_at FROM c ORDER BY c._ts DESC",
    };

    const container = ordersContainer();
    const iter = container.items.query(query, { maxItemCount: limit, continuationToken: token });
    const { resources, continuationToken } = await iter.fetchNext();

    return {
      status: 200,
      jsonBody: { items: resources, cont: continuationToken ?? null },
    };
  },
});
