<script>
	import blackLogo from '$lib/logo-black.svg';
	import whiteLogo from '$lib/logo-white.svg';

	import Mention from '../components/Mention.svelte';
	import Card from '../components/Card.svelte';
</script>

<div class="w-4/5 md:w-2/5 mx-auto">
	<div class="flex items-center justify-evenly border-b py-8">
		<img
			src={whiteLogo}
			alt="logo"
			class="hidden h-32 w-32 rounded-full dark:block md:h-64 md:w-64"
		/>
		<img
			src={blackLogo}
			alt="logo"
			class="block h-32 w-32 rounded-full dark:hidden md:h-64 md:w-64"
		/>
		<div class="flex flex-col gap-4 justify-between">
			<div class="flex items-center gap-4">
				<h1 class="text-2xl font-light">zerone.ed</h1>
				<a
					class="hidden rounded-lg text-white bg-blue-500 px-6 py-2 font-bold md:block"
					href="https://github.com/ZeroOneDeveloper/"
					target="_blank"
				>
					Follow
				</a>
			</div>
			<div class="flex items-center justify-between gap-4 text-lg font-medium">
				<p>06 post</p>
				<p>12K followers</p>
				<p>16K following</p>
			</div>
			<span class="flex flex-col text-base md:text-lg">
				<span>
					<Mention url="https://www.kyungheeboy.hs.kr/">@KHHS</Mention>
					63'
				</span>
				<span>
					<Mention url="https://www.gwnu.ac.kr/">@GWNU</Mention>
					25'
				</span>
				<span>It's enough to change the world using zero and one. </span>
			</span>
		</div>
	</div>
	<div class="grid grid-cols-2 md:grid-cols-3 py-8">
		<Card title="FreeAI"></Card>
		<Card title="UniqueBots"></Card>
		<Card title="UniqueCode"></Card>
		<Card title="SIR Model"></Card>
		<Card title="ODS" dark></Card>
		<Card title="NeulBom" dark></Card>
		<Card title="Blockchain"></Card>
		<Card title="Integral Velocity Equation"></Card>
		<Card title="Graph Visualization"></Card>
	</div>
</div>
