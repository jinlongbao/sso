<script>
  import { page } from '$app/stores';
  import AdSlot from '$lib/components/AdSlot.svelte';
  import { linkPrefix } from '$lib/stores/prefix';
  import { t } from '@svelte-dev/i18n';

  const user = $derived($page.data.user);
  const apps = $derived($page.data.apps || []);

  function appLogin(app) {
    const search = new URLSearchParams();
    search.append('client_id', app.id);
    search.append('redirect_uri', app.redirect_uris[0]);
    search.append('state', Date.now().toString());
    window.open(`/auth/authorize?${search.toString()}`);
  }
</script>

<div class="space-y-12">
  <!-- Welcome Header -->
  <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div>
      <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {$t('common.welcome_back')}, <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user.display_name || user.username}</span>
      </h1>
      <p class="mt-2 text-lg text-slate-400">
        {$t('dashboard.subtitle')}
      </p>
    </div>
    
    {#if user.type === 'admin'}
      <div class="flex items-center gap-3">
        <a href={`${$linkPrefix}/dashboard/app`} class="btn-gradient px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
          {$t('app.management')}
        </a>
        <a href={`${$linkPrefix}/dashboard/user`} class="glass px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-white/5 transition-colors">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          {$t('user.management')}
        </a>
      </div>
    {/if}
  </header>

  <!-- Apps Grid -->
  <section>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        {$t('dashboard.my_apps')}
      </h2>
    </div>

    {#if apps.length === 0}
      <div class="card-premium p-12 text-center">
        <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
        <h3 class="text-lg font-medium text-slate-300">{$t('dashboard.no_apps')}</h3>
        <p class="text-slate-500 mt-1 max-w-xs mx-auto">{$t('dashboard.no_apps_hint')}</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each apps as app (app.id)}
          <div class="card-premium group p-6 flex flex-col justify-between gap-4">
            <div class="flex gap-5">
              <div class="flex-shrink-0">
                <img
                  src={app.logo.startsWith('http') ? app.logo : '/logo.jpg'}
                  alt={app.name}
                  class="w-16 h-16 rounded-2xl object-cover shadow-xl border border-white/5" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{app.name}</h3>
                <p class="text-slate-400 text-sm mt-1 line-clamp-2 leading-relaxed">
                  {app.description || $t('app.no_description')}
                </p>
              </div>
            </div>
            
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <a href={app.homepage} target="_blank" class="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                {app.homepage.replace(/^https?:\/\//, '')}
              </a>
              <button onclick={() => appLogin(app)} class="btn-gradient px-4 py-2 rounded-xl text-xs font-bold">
                {$t('common.login')}
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <AdSlot />
</div>
