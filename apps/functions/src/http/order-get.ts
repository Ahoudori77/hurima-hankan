import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ensureCosmos, ordersContainer } from "../integrations/cosmos.js";

export const orderGet = app.http("orders-get", {
  route: "orders/{id}",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    await ensureCosmos(); 
    // ルートパラメータ（/orders/{id}）から取得
    const id = req.params?.id;
    if (!id) {
      return { status: 400, jsonBody: { error: "id is required" } };
    }

    try {
      const { resource } = await ordersContainer().item(id, id).read();
      if (!resource) {
        return { status: 404, jsonBody: { error: "not found" } };
      }
      return { status: 200, jsonBody: resource };
    } catch (err: any) {
      // Cosmos の 404 は例外で飛んでくることがある
      if (err?.code === 404) {
        return { status: 404, jsonBody: { error: "not found" } };
      }
      ctx.error("[orders-get] error", err);
      return { status: 500, jsonBody: { error: "internal_error" } };
    }
  },
});
