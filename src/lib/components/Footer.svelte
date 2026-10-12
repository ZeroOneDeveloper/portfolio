<script lang="ts">
	import { footerColumns, profile } from '$lib/content';
</script>

<footer class="bg-parchment px-4 pb-16 pt-8 text-ink-80 sm:px-6">
	<div class="mx-auto max-w-text">
		<p class="border-b border-hairline pb-4 text-fine-print text-ink-48">
			{profile.motto}
		</p>

		<div class="grid grid-cols-1 gap-x-8 gap-y-6 py-8 xs:grid-cols-2 md:grid-cols-4">
			{#each footerColumns as column (column.heading)}
				<div>
					<h2 class="mb-1 font-text text-caption-strong text-ink">{column.heading}</h2>
					<ul class="text-dense-link">
						{#each column.links as link (link.href)}
							<li>
								<a
									href={link.href}
									target={link.href.startsWith('#') ? undefined : '_blank'}
									rel={link.href.startsWith('#') ? undefined : 'noopener noreferrer'}
									class="text-ink-80 hover:underline"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div
			class="flex flex-col gap-2 border-t border-hairline pt-4 text-fine-print text-ink-48 sm:flex-row sm:justify-between"
		>
			<p>Copyright © {new Date().getFullYear()} {profile.nameEn} (ZerOne). All rights reserved.</p>
			<p>{profile.company.name} · {profile.school.name}</p>
		</div>
	</div>
</footer>
