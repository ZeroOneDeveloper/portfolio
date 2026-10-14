<script lang="ts">
	import Frame from './Frame.svelte';

	import { BOX, INSET, arrow, at, box, draw, fade, through } from '$lib/figures';

	// Three blocks chained left to right, read as a ledger: one row per field, named once on
	// the left. Each block keeps the hash of the one before it (prev), so the arrows run from
	// a hash to the next block's prev. Every value is a placeholder; the hashes start with 00,
	// the target the nonce is searched for.

	const blocks = [
		{ index: 0, prev: '0000', nonce: '2817', tx: 'A→B', hash: '00a7' },
		{ index: 1, prev: '00a7', nonce: '5091', tx: 'B→C', hash: '003c' },
		{ index: 2, prev: '003c', nonce: '1460', tx: 'C→D', hash: '00f1' }
	];
	const rows = [
		{ field: 'prev', y: 94 },
		{ field: 'nonce', y: 112 },
		{ field: 'tx', y: 130 },
		{ field: 'hash', y: 153 }
	] as const;
	const [WIDTH, GAP] = [44, 14.5];
	const block = {
		top: 81,
		bottom: 165,
		// The blocks stand against the right margin; the names of the rows take the rest.
		left: BOX - INSET - blocks.length * WIDTH - (blocks.length - 1) * GAP
	};
	/** Between what goes into a block and its hash. */
	const RULE = 141;
	const left = (index: number) => block.left + index * (WIDTH + GAP);
	const middle = (index: number) => left(index) + WIDTH / 2;
	const [prevRow, , , hashRow] = rows;

	/** From a block's hash, across and up, into the next block's prev. */
	const link = (index: number) => {
		const turn = left(index) + WIDTH + GAP / 2;
		return arrow(
			[
				[left(index) + WIDTH, hashRow.y],
				[turn, hashRow.y],
				[turn, prevRow.y],
				[left(index + 1), prevRow.y]
			],
			4
		);
	};

	/** The leading zeros a hash needs, set apart from the rest of it. */
	const split = (hash: string) => [hash.slice(0, 2), hash.slice(2)];

	const LEGEND = 194;
</script>

<Frame
	title="블록에 담은 제품 이력"
	label="블록체인 도식. #0, #1, #2 세 블록이 왼쪽에서 오른쪽으로 이어집니다. 블록마다 prev, nonce, tx(거래), hash가 있고, 각 블록의 hash는 다음 블록의 prev가 됩니다. 아래 범례: nonce를 바꿔 hash가 00으로 시작하게 만드는 것이 작업증명(PoW)이고, tx는 RSA로 서명됩니다."
>
	{#snippet art()}
		{#each blocks as { index } (index)}
			<path
				d={box(left(index), block.top, WIDTH, block.bottom - block.top)}
				{...draw(index * 120)}
			/>
			<path
				d={through([
					[left(index), RULE],
					[left(index) + WIDTH, RULE]
				])}
				class="text-line"
				{...draw(200 + index * 120)}
			/>
			{#if index > 0}
				<path d={link(index - 1)} {...draw(400 + index * 160)} />
			{/if}
		{/each}
	{/snippet}

	{#snippet words()}
		{#each blocks as { index } (index)}
			<text
				{...at(middle(index), block.top)}
				dy="-0.6em"
				text-anchor="middle"
				class="font-semibold"
				{...fade(200 + index * 120)}>#{index}</text
			>
		{/each}
		{#each rows as row, position (row.field)}
			<text
				{...at(block.left, row.y)}
				dx="-0.5em"
				dy="0.36em"
				text-anchor="end"
				class="text-muted"
				{...fade(300 + position * 60)}>{row.field}</text
			>
			{#each blocks as entry (entry.index)}
				{@const value = entry[row.field]}
				<text
					{...at(middle(entry.index), row.y)}
					dy="0.36em"
					text-anchor="middle"
					class="tabular-nums"
					{...fade(420 + entry.index * 120 + position * 40)}
					>{#if row.field === 'prev' || row.field === 'hash'}{@const [zeros, rest] =
							split(value)}{zeros}<tspan class="text-muted">{rest}</tspan
						>{:else if row.field === 'nonce'}<tspan class="text-muted">{value}</tspan
						>{:else}{value}{/if}</text
				>
			{/each}
		{/each}

		<!-- The key, set like the ledger: what to look for on the left, what it means beside it. -->
		<g {...fade(1100)}>
			<text {...at(block.left, LEGEND)} dx="-0.5em" text-anchor="end" class="tabular-nums"
				>00<tspan class="text-muted">…</tspan></text
			>
			<text {...at(block.left, LEGEND)}>작업증명 (PoW)</text>
			<text {...at(block.left, LEGEND)} dx="-0.5em" dy="1.6em" text-anchor="end" class="text-muted"
				>tx</text
			>
			<text {...at(block.left, LEGEND)} dy="1.6em">RSA 서명</text>
		</g>
	{/snippet}
</Frame>
