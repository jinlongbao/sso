<script>
  import { page } from '$app/stores';
  import { applyAction, enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import { linkPrefix } from '$lib/stores/prefix';
  import { t } from '@svelte-dev/i18n';

  let loading = $state(false);

  function confirmDelete(e) {
    if (!confirm($t('common.confirm_delete'))) {
      e.preventDefault();
      return false;
    }
  }

  function handleSubmit() {
    loading = true;
    return async function(event) {
      const { result } = event;
      await applyAction(result);
      if (!$page.params.id && result?.data?.id) {
        goto(`${$linkPrefix}/dashboard/app/edit/${result?.data?.id}`);
      }
      if (result?.data?.result === true) {
        await invalidateAll();
      }
      loading = false;
    };
  }
</script>

<div class="max-w-3xl mx-auto space-y-8 pb-20">
  <div class="flex items-center gap-4">
    <a href={`${$linkPrefix}/dashboard/app`} class="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors flex-shrink-0">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    </a>
    <h1 class="text-3xl font-bold text-white">
      {$t($page.params.id ? 'app.edit' : 'app.create')}
    </h1>
  </div>

  {#if $page.form?.created}
    <div class="glass border-emerald-500/20 bg-emerald-500/5 p-4 rounded-2xl flex items-center gap-3 text-emerald-400">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span class="font-medium">{$page.form?.created}</span>
    </div>
  {/if}

  <form action="?/save" method="POST" use:enhance={handleSubmit} class="card-form space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="name" class="label-premium">{$t('app.name')}</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder={$t('app.name')}
          required
          value={$page.data.app?.name || ''}
          class="input-premium w-full" />
      </div>

      <div class="space-y-2">
        <label for="homepage" class="label-premium">{$t('app.homepage')}</label>
        <input
          id="homepage"
          type="text"
          name="homepage"
          placeholder="https://example.com"
          value={$page.data.app?.homepage || ''}
          class="input-premium w-full" />
      </div>
    </div>

    <div class="space-y-2">
      <label for="description" class="label-premium">{$t('app.description')}</label>
      <textarea
        id="description"
        name="description"
        placeholder={$t('app.description')}
        value={$page.data.app?.description || ''}
        class="input-premium w-full h-32 resize-none"></textarea>
    </div>

    <div class="space-y-2">
      <label for="redirect_uris" class="label-premium">{$t('app.redirect_uris')} (Comma separated)</label>
      <input
        id="redirect_uris"
        type="text"
        name="redirect_uris"
        required
        placeholder="https://app.com/callback"
        value={Array.isArray($page.data.app?.redirect_uris)
          ? $page.data.app?.redirect_uris.join(',')
          : $page.data.app?.redirect_uris || ''}
        class="input-premium w-full" />
    </div>

    <div class="space-y-2">
      <label for="logo" class="label-premium">{$t('app.logo')} URL</label>
      <input
        id="logo"
        type="text"
        name="logo"
        placeholder="https://app.com/logo.png"
        value={$page.data.app?.logo || ''}
        class="input-premium w-full" />
    </div>

    <div class="flex items-center justify-between p-4 glass rounded-2xl border-white/5">
      <div>
        <span class="text-slate-200 font-medium block">{$t('app.production')}</span>
        <span class="text-xs text-slate-500">Publicly visible on dashboard</span>
      </div>
      <input
        type="checkbox"
        class="toggle toggle-primary"
        name="production"
        checked={$page.data.app?.production || false} />
    </div>

    <div class="pt-4">
      <button
        type="submit"
        disabled={loading}
        class="btn-gradient w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
        {/if}
        {$t('common.save')}
      </button>
    </div>
  </form>

  {#if $page.params.id}
    <section class="space-y-6">
      <div class="flex items-center justify-between px-2">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          Client Secrets
        </h2>
        <form action="?/secret" method="POST" use:enhance={handleSubmit}>
          <button
            type="submit"
            disabled={loading}
            class="glass px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            {$t('app.create_secret')}
          </button>
        </form>
      </div>

      <div class="space-y-3">
        {#each $page.data.app?.secret as s (s.created_at)}
          <div class="glass p-4 rounded-2xl border-white/5 flex items-center justify-between group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2z" /></svg>
              </div>
              <div>
                <span class="text-xs text-slate-500 block">Created At</span>
                <span class="text-slate-200 font-mono text-sm">{new Date(s.created_at).toLocaleString()}</span>
              </div>
            </div>
            <form action="?/revoke" method="POST" use:enhance={handleSubmit}>
              <button
                onclick={confirmDelete}
                type="submit"
                name="_revoke"
                value={s.created_at}
                disabled={loading}
                class="p-2 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </form>
          </div>
        {/each}
        {#if $page.data.app?.secret.length === 0}
          <div class="text-center py-8 glass rounded-2xl border-dashed border-white/10 text-slate-600 italic">
            No secrets generated yet.
          </div>
        {/if}
      </div>
    </section>
  {/if}
</div>
