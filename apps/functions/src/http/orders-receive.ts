import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

app.http('orders-receive', {
  methods: ['POST'],
  authLevel: 'function',
  route: 'orders/receive',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    const body = (await req.json().catch(() => ({}))) as {
      marketplace?: 'M' | 'Y' | 'R';
      itemName?: string;
      price?: number;
      sellerHint?: string;
    };

    // ダミーで order_id を発番
    const orderId = `ORD-${Date.now()}`;
    ctx.log('orders/receive: request', body, '->', orderId);

    // ※ここで本来は: id_token検証 → 送料/方法決定 → QR割当 → LINE送信

    return {
      status: 200,
      jsonBody: {
        ok: true,
        order_id: orderId,
        message: '受付しました（ダミー応答）',
      },
    };
  },
});
