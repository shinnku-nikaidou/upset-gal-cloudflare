export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const proxyUrlBase64 = url.searchParams.get('proxyUrlBase64'); // get a query param value (?proxyUrl=...)

    if (!proxyUrlBase64) {
      return new Response('Bad request: Missing `proxyUrlBase64` query param', { status: 400 });
    }
    const proxyUrl = atob(proxyUrlBase64);

    let res = await fetchAndApply(proxyUrl, request);

    return res;
  },
};

async function fetchAndApply(proxyUrl: string, request: Request): Promise<Response> {
  console.log(proxyUrl, request);
  let f_url = new URL(proxyUrl);
  let response = null;

  let method = request.method;
  console.log('method=', method);
  let body = request.body;
  let request_headers = request.headers;
  let new_request_headers = new Headers(request_headers);
  new_request_headers.set('Host', f_url.host);
  new_request_headers.set('Referer', request.url);

  response = await fetch(f_url.href, {
    method: method,
    body: body,
    headers: new_request_headers,
  });

  let out_headers = new Headers(response.headers);
  if (out_headers.get('Content-Disposition') == 'attachment') {
    out_headers.delete('Content-Disposition');
  }
  let out_body: BodyInit | null | undefined = null;

  const contentType = out_headers.get('Content-Type')!;
  if (contentType.includes('application/text')) {
    out_body = await response.text();
  } else if (contentType.includes('text/html')) {
    out_body = await response.text();
  } else {
    out_body = response.body;
  }

  let out_response = new Response(out_body, {
    status: response.status,
    headers: out_headers,
  });

  return out_response;
}
