<script>
  import { page } from '$app/stores';
  import { linkPrefix } from '$lib/stores/prefix';
  import { applyAction, enhance } from '$app/forms';
  import { afterNavigate, goto, invalidateAll } from '$app/navigation';
  import Pagination from '$lib/components/Pagination.svelte';
  import { t } from '@svelte-dev/i18n';

  const baned = $derived($page.url.searchParams.get('forbidden') === '1');

  function handleUserType(e) {
    const t = e.target;
    const search = new URLSearchParams($page.url.search);
    search.set('forbidden', t.value);
    goto(`${$page.url.pathname}?${search.toString()}`);
  }

  function handleSubmit() {
    return async function (event) {
      const { result } = event;
      await applyAction(result);
      if (result?.data?.result === true) {
        await invalidateAll();
      }
    };
  }

  function confirmOperation(e) {
    if (!confirm($t('common.confirm'))) {
      e.preventDefault();
      return false;
    }
  }

  afterNavigate(() => {
    invalidateAll();
  });
</script>

<div class="space-y-8">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-white">{$t('user.management')}</h1>
      <p class="text-slate-500 mt-1">{$t('common.total')}： {$page.data.users?.total}</p>
    </div>

    <div class="flex items-center gap-3">
      <select
        name="type"
        onchange={handleUserType}
        value={baned ? '1' : '0'}
        class="glass rounded-xl px-4 py-2 text-sm font-medium border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
        <option value="0" class="bg-slate-900">{$t('user.normal')}</option>
        <option value="1" class="bg-slate-900">{$t('user.forbidden')}</option>
      </select>
    </div>
  </div>

  <form action="?/forbidden" method="POST" use:enhance={handleSubmit}>
    <div class="card-premium overflow-hidden">
      <div class="overflow-x-auto">
        <table class="sso-table">
          <thead>
            <tr>
              <th>{$t('user.avatar')}</th>
              <th>{$t('user.username')}</th>
              <th>{$t('user.display_name')}</th>
              <th>{$t('user.type')}</th>
              <th>{$t('common.created_at')}</th>
              <th class="text-right">{$t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {#each $page.data.users?.data as user (user.id)}
              <tr>
                <td>
                  <img src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username} alt={user.display_name} class="w-10 h-10 rounded-full border border-white/10" />
                </td>
                <td class="font-medium text-white">{user.username}</td>
                <td class="text-slate-400">{user.display_name}</td>
                <td>
                  <span class="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                    {user.type}
                  </span>
                </td>
                <td class="text-slate-500 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                <td class="text-right space-x-2">
                  <button
                    type="submit"
                    onclick={confirmOperation}
                    name="id"
                    value={user.id}
                    class="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    class:text-error={!baned}
                    class:text-emerald-400={baned}
                    title={baned ? $t('user.unban') : $t('user.ban')}>
                    {#if baned}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {:else}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    {/if}
                  </button>
                  <a
                    href={`${$linkPrefix}/dashboard/user/edit/${user.id}`}
                    class="p-2 rounded-lg hover:bg-white/5 text-indigo-400 inline-block transition-colors"
                    title={$t('common.edit')}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </a>
                </td>
              </tr>
            {/each}
            {#if $page.data.users?.data.length === 0}
              <tr>
                <td colspan="6" class="py-20 text-center text-slate-500 italic">
                  No users found.
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt-6">
      <Pagination total={$page.data.users?.total} />
    </div>
  </form>
</div>
