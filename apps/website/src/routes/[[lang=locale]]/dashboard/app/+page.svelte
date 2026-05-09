<script lang="ts">
  import { t } from '@svelte-dev/i18n';
  import { page } from '$app/stores';
  import { linkPrefix } from '$lib/stores/prefix';
</script>

<div class="space-y-8">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white">{$t('app.management')}</h1>
      <p class="text-slate-500 mt-1">{$t('dashboard.subtitle')}</p>
    </div>
    <a href={`${$linkPrefix}/dashboard/app/edit`} class="btn-gradient px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-xl">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
      {$t('app.create')}
    </a>
  </div>

  <div class="card-premium overflow-hidden">
    <div class="overflow-x-auto">
      <table class="sso-table">
        <thead>
          <tr>
            <th>{$t('app.logo')}</th>
            <th>{$t('app.name')}</th>
            <th>{$t('app.production')}</th>
            <th>{$t('app.homepage')}</th>
            <th>{$t('common.created_at')}</th>
            <th class="text-right">{$t('common.edit')}</th>
          </tr>
        </thead>
        <tbody>
          {#each $page.data.apps as app (app.id)}
            <tr>
              <td>
                <img
                  src={app.logo.startsWith('http') ? app.logo : '/logo.jpg'}
                  alt={app.name}
                  class="w-10 h-10 rounded-xl object-cover border border-white/10" />
              </td>
              <td class="font-bold text-white">{app.name}</td>
              <td>
                {#if app.production}
                  <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    Production
                  </span>
                {:else}
                  <span class="px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-xs font-bold border border-white/5">
                    Draft
                  </span>
                {/if}
              </td>
              <td>
                <a href={app.homepage} target="_blank" rel="noreferrer" class="text-indigo-400 hover:underline">
                  {app.homepage.replace(/^https?:\/\//, '')}
                </a>
              </td>
              <td class="text-slate-500 text-sm">
                {new Date(app.created_at).toLocaleDateString()}
              </td>
              <td class="text-right">
                <a
                  class="p-2 rounded-lg hover:bg-white/5 text-indigo-400 inline-block transition-colors"
                  href={`${$linkPrefix}/dashboard/app/edit/${app.id}`}
                  title={$t('common.edit')}>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </a>
              </td>
            </tr>
          {/each}
          {#if $page.data.apps.length === 0}
            <tr>
              <td colspan="6" class="py-20 text-center text-slate-500 italic">
                {$t('dashboard.no_apps')}
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
