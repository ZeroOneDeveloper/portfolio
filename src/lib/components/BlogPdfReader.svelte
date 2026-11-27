<script lang="ts">
	import type { Language } from '$lib/blog/locale';
	import type { ReportPdf } from '$lib/blog/types';

	let { reports, language }: { reports: ReportPdf[]; language: Language } = $props();

	let selectedLanguage = $state<Language>();
	let page = $state(1);

	const english = $derived(language === 'en');
	const report = $derived(
		reports.find((item) => item.language === (selectedLanguage ?? language)) ?? reports[0]
	);
	const pageImage = $derived(report && report.pagePrefix + String(page).padStart(2, '0') + '.png');
	const languageName = (locale: Language) => (locale === 'en' ? 'English' : '한국어');

	function selectReport(locale: Language) {
		if (report.language === locale) return;
		selectedLanguage = locale;
		page = 1;
	}
</script>

{#if report}
	<section
		id="report-pdf"
		aria-labelledby="report-pdf-title"
		class="mt-14 scroll-mt-8 border-t border-line pt-8"
	>
		<h2 id="report-pdf-title" class="text-title font-bold">
			{english ? 'Original PDF' : 'PDF 원본'}
		</h2>

		<div class="mt-5 overflow-hidden rounded-lg border border-line bg-paper">
			<div
				class="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-b border-line px-3 py-2 sm:px-5"
			>
				<div role="group" aria-label={english ? 'PDF language' : 'PDF 언어'} class="flex gap-1">
					{#each reports as item (item.language)}
						<button
							type="button"
							lang={item.language}
							aria-pressed={item.language === report.language}
							onclick={() => selectReport(item.language)}
							class="min-h-11 rounded-md px-3 text-small font-semibold text-muted aria-pressed:bg-ink aria-pressed:text-paper"
							>{languageName(item.language)}</button
						>
					{/each}
				</div>

				<a
					href={report.src}
					download
					class="link inline-flex min-h-11 items-center px-2 text-small font-semibold text-ink"
				>
					{english ? 'Download PDF' : 'PDF 다운로드'}
				</a>
			</div>

			<a
				href={report.src + '#page=' + page}
				target="_blank"
				rel="noopener"
				aria-label={english ? 'Open this page in the PDF' : '현재 페이지를 PDF로 열기'}
				class="bg-white block"
			>
				<img
					src={pageImage}
					width={report.width}
					height={report.height}
					alt={languageName(report.language) + ' PDF ' + (english ? 'page ' + page : page + '쪽')}
					loading="lazy"
					decoding="async"
					class="block h-auto w-full"
				/>
			</a>

			<div
				class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-line px-3 py-2 text-small sm:px-5"
			>
				<button
					type="button"
					aria-label={english ? 'Previous page' : '이전 페이지'}
					onclick={() => page--}
					disabled={page === 1}
					class="min-h-11 justify-self-start rounded px-2 font-medium text-ink disabled:text-muted disabled:opacity-45"
					>{english ? 'Previous' : '이전'}</button
				>

				<div class="flex items-center gap-1.5 tabular-nums text-muted">
					<select
						bind:value={page}
						aria-label={english ? 'Go to page' : '페이지 이동'}
						class="h-11 rounded-md border border-line bg-paper px-2 font-medium text-ink"
					>
						{#each Array(report.pages) as _, index (index)}
							<option value={index + 1}>{index + 1}</option>
						{/each}
					</select>
					<span aria-hidden="true">/ {report.pages}</span>
				</div>

				<button
					type="button"
					aria-label={english ? 'Next page' : '다음 페이지'}
					onclick={() => page++}
					disabled={page === report.pages}
					class="min-h-11 justify-self-end rounded px-2 font-medium text-ink disabled:text-muted disabled:opacity-45"
					>{english ? 'Next' : '다음'}</button
				>
			</div>
		</div>
	</section>
{/if}
