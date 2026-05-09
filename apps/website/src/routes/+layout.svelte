<script>
  import '../app.css';
  import { t } from '@svelte-dev/i18n';
  import SEO from '$lib/components/SEO.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { onNavigate } from '$app/navigation';
  import Bootstrap from '$lib/components/Bootstrap.svelte';

  onNavigate((navigation) => {
    // @ts-ignore
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      // @ts-ignore
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<SEO />

<div id="background"></div>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-5xl mx-auto">
      <slot />
    </div>
  </main>

  <footer class="py-12 border-t border-white/5 mt-auto">
    <div class="container mx-auto px-4 flex justify-center items-center">
      <div class="text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Willin SSO
      </div>
    </div>
  </footer>
</div>

<Bootstrap />
