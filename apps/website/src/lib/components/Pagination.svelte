<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { linkPrefix } from '$lib/stores/prefix';

  const { total } = $props();

  let size = $state('20');
  const pages = $derived(Math.ceil(Number(total || 0) / Number(size)));
  const search = $derived($page.url.searchParams);

  const arr = $derived(
    Array.from(
      { length: 5 },
      (_, i) => Number(search.get('page')) - 2 + i
    ).filter((x) => x > 1 && x < pages)
  );

  $effect(() => {
    if (!search.get('size') || !search.get('page')) {
      const newSearch = new URLSearchParams(search);
      newSearch.set('size', '20');
      newSearch.set('page', '1');
      goto(`${$page.url.pathname}?${newSearch.toString()}`, { replaceState: true });
    }
  });

  function handleLink(e: Event) {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    goto(target.href);
  }

  function handleSize(e: Event) {
    const target = e.target as HTMLSelectElement;
    const newSearch = new URLSearchParams(search);
    newSearch.set('size', target.value);
    newSearch.set('page', '1'); // Reset to page 1 on size change
    goto(`${$page.url.pathname}?${newSearch.toString()}`);
  }
</script>

<div class="flex items-center justify-center gap-4 py-8">
  <div class="flex items-center gap-2">
    <span class="text-xs text-slate-500 font-medium">Show</span>
    <select
      onchange={handleSize}
      class="glass rounded-xl px-3 py-1.5 text-xs font-bold border-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all cursor-pointer appearance-none text-slate-300"
      bind:value={size}>
      <option value="10" class="bg-slate-900">10</option>
      <option value="20" class="bg-slate-900">20</option>
      <option value="50" class="bg-slate-900">50</option>
      <option value="100" class="bg-slate-900">100</option>
    </select>
  </div>

  <div class="flex items-center gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-xl">
    <!-- First Page -->
    <a
      onclick={handleLink}
      class="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 {search.get('page') === '1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10'}"
      href={`${$linkPrefix}${$page.url.pathname}?${(() => {
        const p = new URLSearchParams(search);
        p.set('page', '1');
        return p.toString();
      })()}`}>
      1
    </a>

    {#if arr.length > 0 && arr[0] > 2}
      <span class="text-slate-600 px-1">...</span>
    {/if}

    {#each arr as p (p)}
      <a
        onclick={handleLink}
        class="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 {search.get('page') === `${p}` ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10'}"
        href={`${$linkPrefix}${$page.url.pathname}?${(() => {
          const params = new URLSearchParams(search);
          params.set('page', p.toString());
          return params.toString();
        })()}`}>
        {p}
      </a>
    {/each}

    {#if arr.length > 0 && arr[arr.length - 1] < pages - 1}
      <span class="text-slate-600 px-1">...</span>
    {/if}

    {#if pages > 1}
      <a
        onclick={handleLink}
        class="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 {search.get('page') === `${pages}` ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10'}"
        href={`${$linkPrefix}${$page.url.pathname}?${(() => {
          const p = new URLSearchParams(search);
          p.set('page', pages.toString());
          return p.toString();
        })()}`}>
        {pages}
      </a>
    {/if}
  </div>
</div>
