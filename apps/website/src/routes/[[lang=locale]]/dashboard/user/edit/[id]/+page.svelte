<script>
  import { page } from '$app/stores';
  import { applyAction, enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import { linkPrefix } from '$lib/stores/prefix';
  import { getProviderName } from '$lib/utils';
  import { t } from '@svelte-dev/i18n';

  let loading = $state(false);

  function handleSubmit() {
    loading = true;
    return async function(event) {
      const { result } = event;
      await applyAction(result);
      if (result?.data?.result === true) {
        await invalidateAll();
      }
      loading = false;
    };
  }

  function confirmOperation(e) {
    if (!confirm($t('common.confirm'))) {
      e.preventDefault();
      return false;
    }
  }
</script>

<div class="max-w-3xl mx-auto space-y-8 pb-20">
  <div class="flex items-center gap-4">
    <a href={`${$linkPrefix}/dashboard/user`} class="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors flex-shrink-0">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    </a>
    <h1 class="text-3xl font-bold text-white">{$t('common.edit')} {$t('user.user')}</h1>
  </div>

  <form action="?/save" method="POST" use:enhance={handleSubmit} class="card-form space-y-6">
    <div class="space-y-2 opacity-60">
      <label for="uid" class="label-premium">{$t('user.id')}</label>
      <input
        id="uid"
        type="text"
        value={$page.data.user?.id || ''}
        class="input-premium w-full bg-black/20"
        disabled
        readonly />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="username" class="label-premium">{$t('user.username')}</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder={$t('user.username')}
          value={$page.data.user?.username || ''}
          class="input-premium w-full" />
      </div>

      <div class="space-y-2">
        <label for="display_name" class="label-premium">{$t('user.display_name')}</label>
        <input
          id="display_name"
          type="text"
          name="display_name"
          placeholder={$t('user.display_name')}
          value={$page.data.user?.display_name || ''}
          class="input-premium w-full" />
      </div>
    </div>

    <div class="space-y-2">
      <label for="avatar" class="label-premium">{$t('user.avatar')} URL</label>
      <div class="flex items-center gap-4">
        <img src={$page.data.user?.avatar} alt="" class="w-12 h-12 rounded-full border border-white/10" />
        <input
          id="avatar"
          type="text"
          name="avatar"
          placeholder="https://..."
          value={$page.data.user?.avatar || ''}
          class="input-premium flex-grow" />
      </div>
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

  <section class="space-y-6">
    <h2 class="text-xl font-bold text-white flex items-center gap-3 px-2">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <span>{$t('user.thirdparty')}</span>
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each $page.data.user?.thirdparty as thirdUser (thirdUser.id)}
        <div class="glass p-6 rounded-2xl border-white/5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white capitalize">
              {getProviderName(thirdUser.provider)}
            </h3>
            <span class="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-widest font-bold">Connected</span>
          </div>
          <p class="text-xs text-slate-500">
            Linked at: {new Date(thirdUser.created_at).toLocaleString()}
          </p>
          <form action="?/unbind" method="POST" use:enhance={handleSubmit} class="pt-2">
            <button
              type="submit"
              name="provider"
              value={thirdUser.provider}
              class="w-full py-2 rounded-xl text-sm font-bold border border-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
              onclick={confirmOperation}
              disabled={loading || $page.data.user?.thirdparty?.length === 1}>
              {$t('user.unbind')}
            </button>
          </form>
        </div>
      {/each}
    </div>
  </section>
</div>
