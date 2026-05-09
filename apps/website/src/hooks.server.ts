import { getLocales, locale } from '@svelte-dev/i18n';
import type { Handle } from '@sveltejs/kit';
import { fallbackLng } from '$lib/i18n';
import app from '$lib/hono';

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth')) {
    console.log('--- HOOKS ENTERED ---', url.pathname);
    try {
      return await app.fetch(
        event.request,
        event.platform?.env,
        event.platform?.context
      );
    } catch (err: any) {
      console.error('--- CRITICAL FETCH ERROR ---', err);
      // 直接把错误信息作为响应返回，这样你在浏览器里就能看到了
      return new Response(`WORKER CRASHED: ${err.message}\n${err.stack}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  }

  const [, matched = ''] = url.pathname.split('/');
  const lang: string = getLocales().includes(matched) ? matched : fallbackLng;
  locale.set(lang);

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  });
};
