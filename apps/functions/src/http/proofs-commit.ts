import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
app.http('proofs-commit', {
  methods: ['POST'], authLevel: 'function', route: 'orders/proofs/commit',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    // TODO: DB更新 status=proof_submitted + 通知
    return { status: 200, jsonBody: { ok: true } };
  }
});