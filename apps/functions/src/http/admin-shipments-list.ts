import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { shipmentsContainer } from "../integrations/cosmos.js";
import { ensureCosmos, ordersContainer } from "../integrations/cosmos.js";

export const opsShipmentsList = app.http("ops-shipments-list", {
  methods: ["GET"],
  route: "ops/shipments",
  authLevel: "anonymous",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    await ensureCosmos(); 
    const limit = Number(req.query.get("limit") ?? "20");
    const token = req.query.get("cont") ?? undefined;

    const query = {
      query: "SELECT c.id, c.order_id, c.carrier, c.tracking_no, c.notified, c.created_at FROM c ORDER BY c._ts DESC",
    };

    const container = shipmentsContainer();
    const iter = container.items.query(query, { maxItemCount: limit, continuationToken: token });
    const { resources, continuationToken } = await iter.fetchNext();

    return {
      status: 200,
      jsonBody: { items: resources, cont: continuationToken ?? null },
    };
  },
});