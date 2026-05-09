<script>
  import { linkPrefix } from '$lib/stores/prefix';
  import { page } from '$app/stores';
  import { t } from '@svelte-dev/i18n';

  const user = $derived($page.data.user);
</script>

<header class="sticky top-0 w-full z-50 px-4 pt-4">
  <nav class="glass max-w-7xl mx-auto rounded-2xl px-4 h-16 flex items-center justify-between shadow-2xl shadow-black/20">
    <div class="flex items-center gap-8">
      <a href={`${$linkPrefix || '/'}`} class="flex items-center gap-3 group">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Willin SSO
        </span>
      </a>

      <div class="hidden md:flex items-center gap-1">
        {#if user}
          <a href={`${$linkPrefix}/dashboard`} class="nav-link flex items-center gap-2" class:active={$page.url.pathname.includes('/dashboard')}>
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>{$t('common.dashboard')}</span>
          </a>
        {/if}
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 mr-2">
        {#await import('./ChangeLanguage.svelte')}
          <div class="w-10 h-10 animate-pulse bg-white/5 rounded-xl"></div>
        {:then Module}
          <Module.default />
        {/await}
      </div>

      {#if user}
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar border border-white/10 p-0.5">
            <div class="w-10 rounded-full">
              <img src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username} alt={user.username} />
            </div>
          </label>
          <ul tabindex="0" class="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content glass rounded-2xl w-52 border border-white/10">
            <li class="px-4 py-2 border-b border-white/5 mb-2">
              <span class="text-xs text-slate-500">{$t('user.logged_in_as')}</span>
              <span class="font-bold text-slate-200 truncate">{user.display_name || user.username}</span>
            </li>
            <li><a href={`${$linkPrefix}/dashboard/me`}>{$t('user.profile')}</a></li>
            <li><a href="/auth/logout" class="text-error">{$t('common.logout')}</a></li>
          </ul>
        </div>
      {:else}
        <a href="/login" class="btn-gradient px-6 py-2 rounded-xl text-sm font-semibold">
          {$t('common.login')}
        </a>
      {/if}
    </div>
  </nav>
</header>
