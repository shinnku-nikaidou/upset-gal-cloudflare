import CryptoJS from 'crypto-js';

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = 'https://s0cjp-my.sharepoint.com/personal/03_s0cjp_onmicrosoft_com/_layouts/15/download.aspx?UniqueId=68400d3b-728f-4c55-a930-f70219e54987&Translate=false&tempauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvczBjanAtbXkuc2hhcmVwb2ludC5jb21AMmY3NWYzMjEtMDY0Zi00ZjE0LTkzMDItYWZjYzdlMjViNjE3IiwiaXNzIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwIiwibmJmIjoiMTcxMDg3ODAwMiIsImV4cCI6IjE3MTA4ODE2MDIiLCJlbmRwb2ludHVybCI6Ikd6eTFEd0YvL1VuLzJRS004NUtkREVuVDErQVhQTkVSK1FxdllkeUwxRUE9IiwiZW5kcG9pbnR1cmxMZW5ndGgiOiIxNTMiLCJpc2xvb3BiYWNrIjoiVHJ1ZSIsImNpZCI6IlF1SGY2WCtGOVVlNVRUZXJURVJsNkE9PSIsInZlciI6Imhhc2hlZHByb29mdG9rZW4iLCJzaXRlaWQiOiJZVFl6WldRek5HUXRZekk0WmkwME1UVXdMVGcxTXpVdE9EQXhZamxsTUdJd1lUZGoiLCJhcHBfZGlzcGxheW5hbWUiOiJzaGlubmt1IGdhbGdhbWUiLCJnaXZlbl9uYW1lIjoiMDMiLCJmYW1pbHlfbmFtZSI6IjAzIiwiYXBwaWQiOiI2ZDBjMTg0MC03NmJjLTQ4NzEtODI5Ny1jYTQ1YzdhNmIwZmQiLCJ0aWQiOiIyZjc1ZjMyMS0wNjRmLTRmMTQtOTMwMi1hZmNjN2UyNWI2MTciLCJ1cG4iOiIwM0BzMGNqcC5vbm1pY3Jvc29mdC5jb20iLCJwdWlkIjoiMTAwMzIwMDIzNEYzQ0QwNiIsImNhY2hla2V5IjoiMGguZnxtZW1iZXJzaGlwfDEwMDMyMDAyMzRmM2NkMDZAbGl2ZS5jb20iLCJzY3AiOiJteWZpbGVzLnJlYWQgYWxsZmlsZXMucmVhZCBteWZpbGVzLndyaXRlIGFsbGZpbGVzLndyaXRlIGFsbHNpdGVzLnJlYWQgYWxscHJvZmlsZXMucmVhZCIsInR0IjoiMiIsImlwYWRkciI6IjQwLjEyNi4yNy4yNCJ9.i3fw4ZMK3azSeRGD-h32DlafsQmxbBfhKnSJUKJ7PJM&ApiVersion=2.0';

    const secretKey = env.secretKey;

    const encrypted = CryptoJS.AES.encrypt(url, secretKey).toString();

    const encoded = encodeURIComponent(encrypted);

    return new Response(encoded, { status: 200 });
  },
};
