<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Ping That Pong</title>
	<meta name="description" content="A fun ping pong score tracking app" />
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		overflow: hidden;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}
</style>