<script lang="ts">
	import type { Team } from '../types.js';
	import LoadingSpinner from './LoadingSpinner.svelte';

	interface Props {
		team: Team;
		score: number;
		onclick: () => void;
		element?: HTMLElement;
		isLoading?: boolean;
	}

	let { team, score, onclick, element = $bindable(), isLoading = false }: Props = $props();
</script>

<button
	bind:this={element}
	class="score-area team-{team}"
	onclick={isLoading ? undefined : onclick}
	disabled={isLoading}
	type="button"
>
	<div class="score-display">
		{#if isLoading}
			<LoadingSpinner size="large" />
		{:else}
			<span class="score-text">{score}</span>
		{/if}
	</div>
</button>

<style>
	.score-area {
		flex: 1;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s ease;
		position: relative;
		touch-action: manipulation;
	}

	.score-area:active:not(:disabled) {
		opacity: 0.8;
	}

	.score-area:disabled {
		cursor: default;
		opacity: 0.9;
	}

	.team-teamA {
		background: linear-gradient(135deg, #4f46e5, #6366f1);
		color: white;
	}

	.team-teamB {
		background: linear-gradient(135deg, #ec4899, #f472b6);
		color: white;
	}

	.score-display {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.score-text {
		font-size: clamp(6rem, 20vw, 12rem);
		font-weight: 900;
		font-family: system-ui, -apple-system, sans-serif;
		text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s ease;
	}

	/* Force portrait layout on mobile devices */
	@media (orientation: landscape) and (hover: none) and (pointer: coarse) {
		/* Rotate scores back since the whole app is rotated */
		.score-text {
			transform: rotate(90deg);
		}
	}
	
	/* Normal layout on desktop and mobile portrait */
	@media (orientation: portrait), (hover: hover) and (pointer: fine) {
		.score-text {
			transform: rotate(0deg);
		}
	}
</style>