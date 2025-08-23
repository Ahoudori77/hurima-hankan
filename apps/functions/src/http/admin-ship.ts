import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

app.http('admin-ship', {
  methods: ['POST'],
  authLevel: 'function',
  route: 'ops/ship',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    const body = (await req.json().catch(() => ({}))) as {
      order_id: string;
      carrier?: string;
      tracking_no?: string;
      notify?: boolean;
    };

    ctx.log('admin/ship: request', body);
    if (!body.order_id) {
      return { status: 400, jsonBody: { ok: false, error: 'order_id required' } };
    }

    // ※ここで本来は: 認可チェック → 状態ガード → DB更新 → （静音考慮の）LINE通知

    return {
      status: 200,
      jsonBody: {
        ok: true,
        order_id: body.order_id,
        status: 'shipped',
        notified: !!body.notify,
        message: '出荷登録しました（ダミー応答）',
      },
    };
  },
});
