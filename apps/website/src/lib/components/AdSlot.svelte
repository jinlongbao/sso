<script lang="ts">
  import { navigating } from '$app/stores';
  
  $effect(() => {
    if ($navigating) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    }
  });
</script>

<ins
  class="adsbygoogle my-2"
  style="display:block"
  data-ad-format="autorelaxed"
  data-ad-client="ca-pub-5059418763237956"
  data-ad-slot="3528738701"></ins>
