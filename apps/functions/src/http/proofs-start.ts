import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
app.http('proofs-start', {
  methods: ['POST'], authLevel: 'function', route: 'orders/proofs/start',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    // TODO: SAS(put) を2枚分 15分で発行
    return { status: 200, jsonBody: { upload: { trade: { url: 'https://sas', blob: 'proofs/..' }, post: { url: 'https://sas', blob: 'proofs/..' } }, expires_in: 900 } };
  }
});