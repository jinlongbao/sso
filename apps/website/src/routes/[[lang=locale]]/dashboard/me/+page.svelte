<script>
  import { page } from '$app/stores';
  import { applyAction, enhance } from '$app/forms';
  import { goto, invalidateAll } from '$app/navigation';
  import { linkPrefix } from '$lib/stores/prefix';
  import AdSlot from '$lib/components/AdSlot.svelte';
  import { getProviderName } from '$lib/utils';

  // Mock i18n
  const t_func = (key) => key;

  let loading = $state(false);
  const providers = $derived(
    ['github', 'afdian', 'alipay'].filter(
      (x) =>
        $page.data.user?.thirdparty.findIndex((y) => y.provider === x) === -1
    )
  );

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
    if (!confirm('confirm?')) {
      e.preventDefault();
      return false;
    }
  }
</script>

<form action="?/save" method="POST" use:enhance={handleSubmit}>
  <input type="hidden" name="id" value={$page.data.user.id} />
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">username</span>
    </label>
    <input
      type="text"
      name="username"
      placeholder="username"
      value={$page.data.user?.username || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">display_name</span>
    </label>
    <input
      type="text"
      name="display_name"
      placeholder="display_name"
      value={$page.data.user?.display_name || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full my-2">
    <label class="label">
      <span class="label-text">avatar</span>
    </label>
    <input
      type="text"
      name="avatar"
      placeholder="avatar"
      value={$page.data.user?.avatar || ''}
      class="input input-bordered w-full" />
  </div>
  <div class="form-control w-full py-4 my-2">
    <button
      type="submit"
      class="btn btn-primary"
      disabled={loading}
      class:btn-disabled={loading}>
      save
    </button>
  </div>
</form>
<AdSlot />
<h3 class="my-4">thirdparty</h3>

{#each $page.data.user?.thirdparty as thirdUser (thirdUser.id)}
  <div class="card w-full my-4 bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title capitalize">
        {getProviderName(thirdUser.provider)}
      </h2>
      <p>created_at: {thirdUser.created_at}</p>
      <div class="card-actions justify-end">
        <form action="?/unbind" method="POST" use:enhance={handleSubmit}>
          <input type="hidden" name="id" value={$page.data.user.id} />
          <div class="form-control w-full my-2">
            <button
              type="submit"
              name="provider"
              value={thirdUser.provider}
              class="btn btn-secondary"
              onclick={confirmOperation}
              disabled={loading || $page.data.user?.thirdparty?.length === 1}
              class:btn-disabled={loading ||
                $page.data.user?.thirdparty?.length === 1}>
              unbind
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/each}

<div>
  {#each providers as provider (provider)}
    <div class="card w-full my-4 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title capitalize">{getProviderName(provider)}</h2>
        <div class="card-actions justify-end">
          <form>
            <div class="form-control w-full my-2">
              <a
                class="btn btn-primary"
                href={`/auth/${provider}?returnTo=${$page.url.pathname}`}>
                bind
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/each}
</div>
