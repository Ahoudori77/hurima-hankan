import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { shipmentsContainer, ShipmentDoc } from "../integrations/cosmos.js";

type ReqBody = {
  order_id: string;
  carrier: string;
  tracking_no: string;
  notify?: boolean;
};

export async function adminShip(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  const body = (await req.json()) as Partial<ReqBody> ?? {};
  const { order_id, carrier, tracking_no, notify = true } = body;

  if (!order_id || !carrier || !tracking_no) {
    return { status: 400, jsonBody: { ok: false, message: "order_id, carrier, tracking_no は必須です" } };
  }

  const id = `SHP-${Date.now()}`;
  const doc: ShipmentDoc = {
    id,
    order_id,
    carrier,
    tracking_no,
    notified: !!notify,
    created_at: new Date().toISOString(),
  };

  // 保存
  await shipmentsContainer().items.create(doc);

  return {
    status: 200,
    jsonBody: {
      ok: true,
      shipment_id: id,
      order_id,
      status: "shipped",
      notified: !!notify,
      message: "出荷登録しました",
    },
  };
}

app.http("admin-ship", {
  methods: ["POST"],
  route: "ops/ship",
  authLevel: "admin",
  handler: adminShip,
});
