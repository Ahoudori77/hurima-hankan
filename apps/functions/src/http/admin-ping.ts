import { app } from "@azure/functions";

app.http("admin-ping", {
  methods: ["GET"],
  route: "ops/ping",
  authLevel: "anonymous",
  handler: async () => {
    return { status: 200, jsonBody: { ok: true, time: new Date().toISOString() } };
  },
});
