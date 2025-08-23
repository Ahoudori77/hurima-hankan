import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
app.http('admin-health', {
  methods: ['GET'], authLevel: 'function', route: 'admin/health',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    // TODO: LINE/Cosmos/Storage/Functions のプローブ結果を返す
    return { status: 200, jsonBody: { overall: 'green', checks: {} } };
  }
});