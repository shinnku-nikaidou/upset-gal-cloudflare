export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		const proxyUrlBase64 = url.searchParams.get('proxyUrlBase64'); // get a query param value (?proxyUrl=...)

		let host = 'https://z08ty-my.sharepoint.com';

		if (!proxyUrlBase64) {
			return new Response('Bad request: Missing `proxyUrlBase64` query param', { status: 400 });
		}
		const proxyUrl = atob(proxyUrlBase64);

		// make subrequests with the global `fetch()` function
		let res = await fetchAndApply(host, proxyUrl, request);

		return res;
	},
};

async function fetchAndApply(host: string, proxyUrl: string, request: Request): Promise<Response> {
	console.log(host, proxyUrl, request);
	let f_url = new URL(proxyUrl);
	let a_url = new URL(host);

	let replace_path = a_url.pathname;

	if (replace_path.substring(replace_path.length - 1) != '/') {
		replace_path += '/';
	}
	console.log('replace_path=', replace_path);

	let replaced_path = '/';
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
	if (out_headers.get('Content-Disposition') == 'attachment') out_headers.delete('Content-Disposition');
	let out_body: BodyInit | null | undefined = null;
	const contentType = out_headers.get('Content-Type')!;
	if (contentType.includes('application/text')) {
		out_body = await response.text();
		while (out_body.includes(replace_path)) {
			out_body = out_body.replace(replace_path, replaced_path);
		}
	} else if (contentType.includes('text/html')) {
		out_body = await response.text();

		while (replace_path != '/' && out_body.includes(replace_path)) {
			out_body = out_body.replace(replace_path, replaced_path);
		}
	} else {
		out_body = response.body;
	}

	let out_response = new Response(out_body, {
		status: response.status,
		headers: out_headers,
	});

	return out_response;
}
