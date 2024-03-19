import React from 'react';
import ReactDOMServer from 'react-dom/server';

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    return new Response(ReactDOMServer.renderToString(<>123</>), { status: 400 });
  },
};
