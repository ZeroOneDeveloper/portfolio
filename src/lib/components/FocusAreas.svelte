<script lang="ts">
	import { focusAreas } from '$lib/content';
</script>

<!-- 하는 일: the three focus areas, a quiet bridge from the lead case into the work. -->
<section aria-labelledby="focus-title" class="page mt-10 sm:mt-12">
	<h2 id="focus-title" class="text-meta font-semibold text-muted">하는 일</h2>
	<ul class="mt-3 grid border-t border-line sm:grid-cols-3 sm:gap-x-8 lg:gap-x-12">
		{#each focusAreas as area (area.title)}
			<li class="border-b border-line py-4 sm:border-b-0 sm:pb-0 sm:pt-5">
				<h3 class="text-item-title font-semibold">{area.title}</h3>
				<p class="mt-1 text-small text-muted">{area.body}</p>
			</li>
		{/each}
	</ul>
</section>
