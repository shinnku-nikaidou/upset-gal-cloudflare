import CryptoJS from 'crypto-js';

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = 'https://www.shinnku.com';

    const secretKey = env.secretKey;

    const encrypted = CryptoJS.AES.encrypt(url, secretKey).toString();

    const encoded = encodeURIComponent(encrypted);

    return new Response(encoded, { status: 200 });
  },
};
