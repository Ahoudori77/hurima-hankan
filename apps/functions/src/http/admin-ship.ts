import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
app.http('admin-ship', {
  methods: ['POST'], authLevel: 'function', route: 'admin/ship',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    // TODO: 認可(Entra+role=admin) → statusガード → shippedに更新 → LINE通知 or 予約
    return { status: 200, jsonBody: { ok: true } };
  }
});