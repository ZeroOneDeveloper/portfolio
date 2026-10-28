<script lang="ts">
	let {
		unavailable = false,
		noindex = false,
		previewSibling = false
	}: {
		unavailable?: boolean;
		noindex?: boolean;
		previewSibling?: boolean;
	} = $props();
</script>

{#if unavailable}
	<p id="translation-availability" class="mt-3 text-small text-muted">
		이 글은 한국어로만 제공돼요.
		<a
			href="/en/blog"
			lang="en"
			class="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-ink"
			>English articles →</a
		>
	</p>
{:else if noindex || previewSibling}
	<p role="note" class="mt-3 border-l-2 border-line pl-3 text-small text-muted">
		{previewSibling
			? 'English · 검토용 초안 · 발행 승인 전'
			: 'Review draft · Not approved for publication'}
	</p>
{/if}
