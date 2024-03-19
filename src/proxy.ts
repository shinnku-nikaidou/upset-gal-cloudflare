import CryptoJS from 'crypto-js';

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const proxyUrl = url.searchParams.get('proxyUrl'); // get a query param value (?proxyUrl=...)
    if (!proxyUrl) {
      return new Response('Bad request: Missing `proxyUrl` query param', { status: 400 });
    }

    const secretKey = env.secretKey;
    const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(proxyUrl), secretKey);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

    console.log(decryptedData);

    let res = await fetchAndApply(decryptedData, request);

    return res;
  },
};

async function fetchAndApply(proxyUrl: string, request: Request): Promise<Response> {
  const f_url = new URL(proxyUrl);
  let response = null;

  let new_request_headers = new Headers(request.headers);
  new_request_headers.set('Host', f_url.host);
  new_request_headers.set('Referer', request.url);

  response = await fetch(f_url.href, {
    method: request.method,
    body: request.body,
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
