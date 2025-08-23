import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
app.http('orders-receive', {
  methods: ['POST'], authLevel: 'function', route: 'orders/receive',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    // TODO: id_token 検証 → 送料/方法決定 → QR割当 → LINE送信
    return { status: 200, jsonBody: { ok: true, order_id: 'ORD-sample' } };
  }
});