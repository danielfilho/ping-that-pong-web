<script lang="ts">
	import { onMount } from 'svelte';
	import { gameState, gameActions, servePosition, isLoading } from '$lib/stores/gameStore.js';
	import { fireConfetti } from '$lib/utils/confetti.js';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import ScoreArea from '$lib/components/ScoreArea.svelte';
	import GameSettings from '$lib/components/GameSettings.svelte';
	import ResetConfirmation from '$lib/components/ResetConfirmation.svelte';
	import { Team } from '$lib/types.js';

	let isShowingAlert = $state(false);
	let isShowingConfig = $state(false);
	let teamAElement: HTMLElement | undefined = $state();
	let teamBElement: HTMLElement | undefined = $state();

	// Watch for winning condition
	$effect(() => {
		if ($gameState.teamAScore === $gameState.maxPoints) {
			fireConfetti(Team.TeamA);
		} else if ($gameState.teamBScore === $gameState.maxPoints) {
			fireConfetti(Team.TeamB);
		}
	});

	function handleTeamATap() {
		gameActions.addPoint(Team.TeamA);
	}

	function handleTeamBTap() {
		gameActions.addPoint(Team.TeamB);
	}

	function handleTeamASwipe(direction: string) {
		if (direction === 'left') {
			gameActions.removePoint(Team.TeamA);
		} else if (direction === 'right') {
			gameActions.addPoint(Team.TeamA);
		}
	}

	function handleTeamBSwipe(direction: string) {
		if (direction === 'left') {
			gameActions.removePoint(Team.TeamB);
		} else if (direction === 'right') {
			gameActions.addPoint(Team.TeamB);
		}
	}

	onMount(() => {
		// Lock screen orientation to portrait
		if (typeof window !== 'undefined' && screen && screen.orientation && 'lock' in screen.orientation) {
			try {
				(screen.orientation as any).lock('portrait').catch(() => {
					// Fallback for browsers that don't support orientation lock
					console.log('Orientation lock not supported');
				});
			} catch (error) {
				console.log('Orientation lock not available');
			}
		}
	});

	// Initialize Hammer.js after loading is complete and elements are available
	$effect(() => {
		if (!$isLoading && teamAElement && teamBElement && typeof window !== 'undefined') {
			import('hammerjs').then(({ default: Hammer }) => {
				const hammerA = new Hammer(teamAElement!);
				const hammerB = new Hammer(teamBElement!);

				hammerA.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
				hammerB.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

				hammerA.on('swipeleft', () => handleTeamASwipe('left'));
				hammerA.on('swiperight', () => handleTeamASwipe('right'));

				hammerB.on('swipeleft', () => handleTeamBSwipe('left'));
				hammerB.on('swiperight', () => handleTeamBSwipe('right'));
			});
		}
	});
</script>

<div class="app">
	<div class="game-area">
		<!-- Team A Score Area -->
		<ScoreArea
			team={Team.TeamA}
			score={$gameState.teamAScore}
			onclick={handleTeamATap}
			bind:element={teamAElement}
			isLoading={$isLoading}
		/>

		<!-- Team B Score Area -->
		<ScoreArea
			team={Team.TeamB}
			score={$gameState.teamBScore}
			onclick={handleTeamBTap}
			bind:element={teamBElement}
			isLoading={$isLoading}
		/>
	</div>

	<!-- Center Line -->
	<div class="center-line"></div>

	<!-- Serve Indicator (Tennis Ball) -->
	<div class="serve-indicator" style="transform: translateY({$servePosition}px) translateX(-50%);">
		🎾
	</div>

	<!-- Control Panel -->
	<ControlPanel
		onShowReset={() => (isShowingAlert = true)}
		onShowSettings={() => (isShowingConfig = true)}
	/>

	<!-- Modals -->
	<ResetConfirmation
		isOpen={isShowingAlert}
		onClose={() => (isShowingAlert = false)}
	/>

	<GameSettings
		isOpen={isShowingConfig}
		onClose={() => (isShowingConfig = false)}
	/>
</div>

<style>
	.app {
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		user-select: none;
		-webkit-user-select: none;
		-webkit-touch-callout: none;
	}

	.game-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.center-line {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 10px;
		background: white;
		transform: translateY(-50%);
		border-radius: 5px;
		margin: 0 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		z-index: 10;
	}

	.serve-indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		font-size: 3rem;
		z-index: 20;
		transition: transform 0.3s ease;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	/* Force portrait layout on mobile devices */
	@media (orientation: landscape) and (hover: none) and (pointer: coarse) {
		.app {
			transform: rotate(90deg);
			transform-origin: center center;
			width: 100vh;
			height: 100vw;
			position: fixed;
			top: 50%;
			left: 50%;
			margin-left: -50vh;
			margin-top: -50vw;
		}
		
		.serve-indicator {
			font-size: 2rem;
		}
	}
	
	/* Normal layout on desktop and mobile portrait */
	@media (orientation: portrait), (hover: hover) and (pointer: fine) {
		.app {
			transform: none;
			width: 100%;
			height: 100vh;
			position: relative;
			top: auto;
			left: auto;
			margin: 0;
		}
	}

	/* Landscape mobile optimizations */
	@media (max-height: 500px) and (orientation: landscape) {
		.serve-indicator {
			font-size: 2rem;
		}
	}
</style>