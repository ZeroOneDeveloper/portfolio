<script lang="ts">
	import Dots from './Dots.svelte';

	import { focusAreas, papers, profile } from '$lib/content';

	interface Props {
		/** Grid placement within the opening. */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const journals = papers.filter((paper) => paper.kind === '저널').length;
	const conferences = papers.length - journals;
</script>

<!--
	At a glance. From lg up it stands beside the intro, ruled off on the left; below lg it
	follows AXIT, ruled off on top. On phones 하는 일 takes the label column of the
	intro's 지금 and 최근 rows, so it reads as one more row of the profile, not a stray
	list; from md its three items share one band. 학교 and 연구 are repeated in 경력 and
	연구, so they join from lg up only. The researcher profiles are left to 연구 and the
	footer.
-->
<aside
	aria-label="한눈에 보기"
	class="grid content-start gap-y-7 border-t border-line pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1 {className}"
>
	<div
		class="grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-x-3 sm:grid-cols-[4.25rem_minmax(0,1fr)] sm:gap-x-4 md:block"
	>
		<p id="focus-label" class="text-meta font-semibold text-muted md:text-small md:text-ink">
			하는 일
		</p>
		<ul
			aria-labelledby="focus-label"
			class="grid gap-y-4 md:mt-3 md:grid-cols-3 md:gap-x-8 lg:grid-cols-1"
		>
			{#each focusAreas as area (area.title)}
				<li>
					<p class="text-small font-bold">{area.title}</p>
					<!-- One measure, balanced: each body breaks at its phrase, none trails a stub. -->
					<p class="mt-0.5 max-w-[22rem] text-balance text-meta text-ink-soft">{area.body}</p>
				</li>
			{/each}
		</ul>
	</div>

	<dl class="hidden grid-cols-2 gap-x-6 gap-y-6 lg:grid xl:gap-x-8">
		<div>
			<dt class="text-meta font-semibold text-muted">학교</dt>
			<dd class="mt-1.5 text-small font-semibold">{profile.school.name}</dd>
			<dd class="text-small text-ink-soft">
				{profile.school.department}
				<span class="whitespace-nowrap">{profile.school.cohort}</span>
			</dd>
		</div>
		<div>
			<dt class="text-meta font-semibold text-muted">연구</dt>
			<dd class="mt-1.5 text-small font-semibold">논문 {papers.length}편</dd>
			<dd class="text-small text-ink-soft">
				<Dots items={[`국제 저널 ${journals}`, `학술대회 ${conferences}`]} />
			</dd>
		</div>
	</dl>
</aside>
